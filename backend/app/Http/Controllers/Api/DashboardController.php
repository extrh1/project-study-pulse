<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Course;
use App\Models\Lesson;
use App\Models\QuizAttempt;
use App\Models\StudySession;
use Carbon\Carbon;

class DashboardController extends Controller
{
    public function stats(Request $request)
    {
        $user = $request->user();

        $courses = Course::count();

        $enrolledCourseIds = $user->courses()->pluck('courses.id')->unique()->toArray();
        $totalLessons = $enrolledCourseIds
            ? Lesson::whereIn('course_id', $enrolledCourseIds)->count()
            : 0;

        $completedLessons = $user->lessons()
            ->wherePivot('is_completed', true)
            ->count();

        $now = Carbon::now();
        $thisWeekStart = $now->copy()->subDays(7);
        $lastWeekStart = $thisWeekStart->copy()->subDays(7);

        $coursesThisWeek = Course::where('created_at', '>=', $thisWeekStart)->count();
        $coursesLastWeek = Course::whereBetween('created_at', [$lastWeekStart, $thisWeekStart])->count();
        $courseTrend = $coursesThisWeek - $coursesLastWeek;

        $quizzesAttempted = QuizAttempt::where('user_id', $user->id)->count();
        $quizzesPassed = QuizAttempt::where('user_id', $user->id)
            ->where('passed', true)
            ->count();

        $progress = $totalLessons > 0
            ? round(($completedLessons / $totalLessons) * 100)
            : ($quizzesAttempted > 0
                ? round(($quizzesPassed / $quizzesAttempted) * 100)
                : 0);

        $studyMinutes = $user->studySessions()->sum('duration');
        $useQuizFallbackForStudyTime = false;

        $now = Carbon::now();
        $thisWeekStart = $now->copy()->subDays(7);
        $lastWeekStart = $thisWeekStart->copy()->subDays(7);

        $sessionMinutesThisWeek = $user->studySessions()
            ->where('created_at', '>=', $thisWeekStart)
            ->sum('duration');

        $sessionMinutesLastWeek = $user->studySessions()
            ->whereBetween('created_at', [$lastWeekStart, $thisWeekStart])
            ->sum('duration');

        $quizAttemptsThisWeek = QuizAttempt::where('user_id', $user->id)
            ->where('created_at', '>=', $thisWeekStart)
            ->count();

        $quizAttemptsLastWeek = QuizAttempt::where('user_id', $user->id)
            ->whereBetween('created_at', [$lastWeekStart, $thisWeekStart])
            ->count();

        if ($studyMinutes === 0 && $quizzesAttempted > 0) {
            $studyMinutes = $quizzesAttempted * 5; // estimate 5 minutes per quiz when no session data exists
            $useQuizFallbackForStudyTime = true;
        }

        $studyTime = round($studyMinutes / 60, 1);

        $studyMinutesThisWeek = $sessionMinutesThisWeek;
        $studyMinutesLastWeek = $sessionMinutesLastWeek;

        if ($useQuizFallbackForStudyTime) {
            $studyMinutesThisWeek = $quizAttemptsThisWeek * 5;
            $studyMinutesLastWeek = $quizAttemptsLastWeek * 5;
        }

        $studyTimeTrend = round(($studyMinutesThisWeek - $studyMinutesLastWeek) / 60, 1);
        if (abs($studyTimeTrend) < 0.1) {
            $studyTimeTrend = 0;
        }

        $quizzesFailed = QuizAttempt::where('user_id', $user->id)
            ->where('passed', false)
            ->count();
        $averageScore = round((float) (QuizAttempt::where('user_id', $user->id)->avg('score') ?? 0), 1);
        $quizPassRate = $quizzesAttempted > 0
            ? round(($quizzesPassed / $quizzesAttempted) * 100)
            : 0;

        // Level system: 100 XP per level
        $userXp = max(0, (int) ($user->xp ?? 0));
        $userLevel = $user->computedLevel();
        $xpPerLevel = 100;
        $currentLevelXp = ($userLevel - 1) * $xpPerLevel;
        $xpForNextLevel = $xpPerLevel;
        $xpProgress = max(0, $userXp - $currentLevelXp);
        $xpPercentage = $xpForNextLevel > 0 ? min(100, round(($xpProgress / $xpForNextLevel) * 100)) : 0;

        return response()->json([
            'courses' => $courses,
            'progress' => $progress,
            'studyTime' => $studyTime,
            'badges' => $user->badges()->count(),
            'level' => $userLevel,
            'xp' => $userXp,
            'xpForNextLevel' => $xpForNextLevel,
            'xpProgress' => $xpProgress,
            'xpPercentage' => $xpPercentage,
            'courseTrend' => $courseTrend,
            'studyTimeTrend' => $studyTimeTrend,
            'quizzesAttempted' => $quizzesAttempted,
            'quizzesPassed' => $quizzesPassed,
            'quizzesFailed' => $quizzesFailed,
            'averageQuizScore' => $averageScore,
            'quizPassRate' => $quizPassRate,
        ]);
    }
    public function recentActivity(Request $request)
    {
        $user = $request->user();

        $lessonActivities = $user->lessons()
            ->wherePivot('is_completed', true)
            ->get()
            ->map(function ($lesson) {
                return [
                    'title' => "Completed lesson: " . $lesson->title,
                    'time' => $lesson->pivot->updated_at->diffForHumans(),
                    'timestamp' => $lesson->pivot->updated_at->timestamp,
                ];
            });

        $quizActivities = QuizAttempt::with('quiz')
            ->where('user_id', $user->id)
            ->orderByDesc('completed_at')
            ->take(5)
            ->get()
            ->map(function ($attempt) {
                return [
                    'title' => trim("Quiz attempt: " . ($attempt->quiz->title ?? "Untitled Quiz") . " - " . ($attempt->passed ? "Passed" : "Failed")),
                    'time' => $attempt->completed_at ? $attempt->completed_at->diffForHumans() : $attempt->created_at->diffForHumans(),
                    'timestamp' => $attempt->completed_at ? $attempt->completed_at->timestamp : $attempt->created_at->timestamp,
                ];
            });

        $sessionActivities = StudySession::where('user_id', $user->id)
            ->orderByDesc('created_at')
            ->take(5)
            ->get()
            ->map(function ($session) {
                $hours = round($session->duration / 60, 1);
                return [
                    'title' => "Study session: " . ($hours >= 1 ? $hours . "h" : $session->duration . "m"),
                    'time' => $session->created_at->diffForHumans(),
                    'timestamp' => $session->created_at->timestamp,
                ];
            });

        $activities = collect()
            ->merge($lessonActivities)
            ->merge($quizActivities)
            ->merge($sessionActivities)
            ->sortByDesc('timestamp')
            ->values()
            ->take(5)
            ->map(function ($item) {
                unset($item['timestamp']);
                return $item;
            });

        return response()->json($activities);
    }
}