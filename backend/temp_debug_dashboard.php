<?php
require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\User;
use App\Models\Course;
use App\Models\Lesson;
use App\Models\StudySession;
use App\Models\QuizAttempt;

$user = User::find(1);
if (! $user) {
    echo "no user\n";
    exit(0);
}

$coursesCount = $user->courses()->count();
$courseIds = $user->courses()->pluck('courses.id')->toArray();
$totalLessons = $courseIds ? Lesson::whereIn('course_id', $courseIds)->count() : 0;
$completedLessons = $user->lessons()->wherePivot('is_completed', true)->count();
$studyMinutes = $user->studySessions()->sum('duration');
$completedAttemptCount = QuizAttempt::where('user_id', $user->id)
    ->whereNotNull('completed_at')
    ->count();
if ($studyMinutes === 0 && $completedAttemptCount > 0) {
    $studyMinutes = QuizAttempt::where('user_id', $user->id)
        ->whereNotNull('completed_at')
        ->get()
        ->sum(function ($attempt) {
            return $attempt->completed_at->diffInMinutes($attempt->created_at);
        });
}
$lessonProgressCount = \DB::table('lesson_progress')->count();
$quizAttemptCount = QuizAttempt::where('user_id', $user->id)->count();

$allUsers = User::count();
$allCourses = Course::count();
$enrollCount = \DB::table('user_courses')->count();
$sessionCount = StudySession::count();

echo "user=" . $user->id . "\n";
echo "courses=" . $coursesCount . "\n";
echo "courseIds=" . json_encode($courseIds) . "\n";
echo "totalLessons=" . $totalLessons . "\n";
echo "completedLessons=" . $completedLessons . "\n";
echo "lessonProgressCount=" . $lessonProgressCount . "\n";
echo "completedAttemptCount=" . $completedAttemptCount . "\n";
$sampleAttempt = QuizAttempt::where('user_id', $user->id)->whereNotNull('completed_at')->first();
if ($sampleAttempt) {
    echo "sample_created=" . $sampleAttempt->created_at . "\n";
    echo "sample_completed=" . $sampleAttempt->completed_at . "\n";
    echo "sample_diff=" . $sampleAttempt->completed_at->diffInMinutes($sampleAttempt->created_at) . "\n";
}
echo "studyMinutes=" . $studyMinutes . "\n";
echo "quizAttemptCount=" . $quizAttemptCount . "\n";
echo "allUsers=" . $allUsers . "\n";
echo "allCourses=" . $allCourses . "\n";
echo "enrollCount=" . $enrollCount . "\n";
echo "sessionCount=" . $sessionCount . "\n";

echo "user=" . $user->id . "\n";
echo "courses=" . $coursesCount . "\n";
echo "courseIds=" . json_encode($courseIds) . "\n";
echo "totalLessons=" . $totalLessons . "\n";
echo "completedLessons=" . $completedLessons . "\n";
echo "studyMinutes=" . $studyMinutes . "\n";
echo "allUsers=" . $allUsers . "\n";
echo "allCourses=" . $allCourses . "\n";
echo "enrollCount=" . $enrollCount . "\n";
echo "sessionCount=" . $sessionCount . "\n";