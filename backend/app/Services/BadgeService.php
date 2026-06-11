<?php

namespace App\Services;

use App\Models\Badge;
use App\Models\User;
use App\Models\UserBadge;
use App\Models\QuizAttempt;
use App\Models\StudySession;
use Carbon\Carbon;

class BadgeService
{
    /**
     * Check and award badges for a user after quiz completion
     */
    public static function checkQuizBadges(User $user, QuizAttempt $attempt)
    {
        $awardedBadges = [];

        // Get all badges that can be earned through quiz completion
        $quizBadges = Badge::whereIn('type', ['quiz_completion', 'quiz_score', 'quiz_speed'])->get();

        foreach ($quizBadges as $badge) {
            if (!self::userHasBadge($user, $badge) && self::meetsBadgeCriteria($user, $badge, $attempt)) {
                self::awardBadge($user, $badge);
                $awardedBadges[] = $badge;
            }
        }

        return $awardedBadges;
    }

    /**
     * Check and award XP/level based badges
     */
    public static function checkXpBadges(User $user)
    {
        $awardedBadges = [];

        $xpBadges = Badge::where('type', 'xp_milestone')->get();

        foreach ($xpBadges as $badge) {
            if (!self::userHasBadge($user, $badge) && $user->xp >= $badge->required_xp) {
                self::awardBadge($user, $badge);
                $awardedBadges[] = $badge;
            }
        }

        return $awardedBadges;
    }

    /**
     * Check and award level-based badges
     */
    public static function checkLevelBadges(User $user)
    {
        $awardedBadges = [];

        $levelBadges = Badge::where('type', 'level_milestone')->get();

        foreach ($levelBadges as $badge) {
            if (!self::userHasBadge($user, $badge) && $user->computedLevel() >= $badge->criteria['level']  ?? 0) {
                self::awardBadge($user, $badge);
                $awardedBadges[] = $badge;
            }
        }

        return $awardedBadges;
    }

    /**
     * Check study time badges
     */
    public static function checkStudyTimeBadges(User $user)
    {
        $awardedBadges = [];

        $studyBadges = Badge::where('type', 'study_time')->get();

        foreach ($studyBadges as $badge) {
            $totalHours = StudySession::where('user_id', $user->id)->sum('duration') / 60; // Convert minutes to hours
            if (!self::userHasBadge($user, $badge) && $totalHours >= $badge->criteria['total_hours']) {
                self::awardBadge($user, $badge);
                $awardedBadges[] = $badge;
            }
        }

        return $awardedBadges;
    }

    /**
     * Check subject completion badges
     */
    public static function checkSubjectBadges(User $user)
    {
        $awardedBadges = [];

        $subjectBadges = Badge::where('type', 'subject_completion')->get();

        foreach ($subjectBadges as $badge) {
            $uniqueSubjects = $user->courses()->with('subject')->get()->pluck('subject.id')->unique()->count();
            if (!self::userHasBadge($user, $badge) && $uniqueSubjects >= $badge->criteria['unique_subjects']) {
                self::awardBadge($user, $badge);
                $awardedBadges[] = $badge;
            }
        }

        return $awardedBadges;
    }

    /**
     * Check streak badges (daily activity)
     */
    public static function checkStreakBadges(User $user)
    {
        $awardedBadges = [];

        $streakBadges = Badge::where('type', 'streak')->get();

        foreach ($streakBadges as $badge) {
            $streakDays = self::calculateCurrentStreak($user);
            if (!self::userHasBadge($user, $badge) && $streakDays >= $badge->criteria['days_streak']) {
                self::awardBadge($user, $badge);
                $awardedBadges[] = $badge;
            }
        }

        return $awardedBadges;
    }

    /**
     * Check consistency badges (active days)
     */
    public static function checkConsistencyBadges(User $user)
    {
        $awardedBadges = [];

        $consistencyBadges = Badge::where('type', 'consistency')->get();

        foreach ($consistencyBadges as $badge) {
            $activeDays = self::calculateActiveDays($user);
            if (!self::userHasBadge($user, $badge) && $activeDays >= $badge->criteria['active_days']) {
                self::awardBadge($user, $badge);
                $awardedBadges[] = $badge;
            }
        }

        return $awardedBadges;
    }

    /**
     * Check if user meets specific badge criteria
     */
    private static function meetsBadgeCriteria(User $user, Badge $badge, QuizAttempt $attempt = null)
    {
        switch ($badge->type) {
            case 'quiz_completion':
                if (isset($badge->criteria['first_quiz'])) {
                    return QuizAttempt::where('user_id', $user->id)->count() >= 1;
                }
                if (isset($badge->criteria['total_quizzes'])) {
                    return QuizAttempt::where('user_id', $user->id)->count() >= $badge->criteria['total_quizzes'];
                }
                break;

            case 'quiz_score':
                if (isset($badge->criteria['perfect_score'])) {
                    return $attempt && $attempt->score == 100;
                }
                break;

            case 'quiz_speed':
                if (isset($badge->criteria['time_limit'])) {
                    // This would require tracking quiz start time
                    // For now, we'll assume it's met if they passed quickly
                    return $attempt && $attempt->passed;
                }
                break;
        }

        return false;
    }

    /**
     * Calculate current streak of consecutive days with activity
     */
    private static function calculateCurrentStreak(User $user)
    {
        $today = Carbon::today();
        $streak = 0;

        for ($i = 0; $i < 30; $i++) {
            $date = $today->copy()->subDays($i);
            $hasActivity = QuizAttempt::where('user_id', $user->id)
                ->whereDate('completed_at', $date)
                ->exists();

            if ($hasActivity) {
                $streak++;
            } else {
                break;
            }
        }

        return $streak;
    }

    /**
     * Calculate total active days in the last 90 days
     */
    private static function calculateActiveDays(User $user)
    {
        $ninetyDaysAgo = Carbon::now()->subDays(90);

        return QuizAttempt::where('user_id', $user->id)
            ->where('completed_at', '>=', $ninetyDaysAgo)
            ->selectRaw('DATE(completed_at) as date')
            ->groupBy('date')
            ->get()
            ->count();
    }

    /**
     * Check if user already has a badge
     */
    private static function userHasBadge(User $user, Badge $badge)
    {
        return UserBadge::where('user_id', $user->id)
            ->where('badge_id', $badge->id)
            ->exists();
    }

    /**
     * Award a badge to a user
     */
    private static function awardBadge(User $user, Badge $badge)
    {
        UserBadge::create([
            'user_id' => $user->id,
            'badge_id' => $badge->id,
        ]);

        // You could add notification logic here
        // Notification::create([...]);
    }

    /**
     * Get all badges for a user
     */
    public static function getUserBadges(User $user)
    {
        return $user->badges()->with('badge')->get();
    }
}