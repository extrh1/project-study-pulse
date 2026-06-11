<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Badge;

class BadgeSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $badges = [
            [
                'name' => 'First Steps',
                'description' => 'Completed your first quiz',
                'icon' => 'fas fa-bullseye',
                'required_xp' => 0,
                'required_lessons' => 0,
                'type' => 'quiz_completion',
                'criteria' => ['first_quiz' => true]
            ],
            [
                'name' => 'Quiz Master',
                'description' => 'Completed 10 quizzes',
                'icon' => 'fas fa-crown',
                'required_xp' => 0,
                'required_lessons' => 0,
                'type' => 'quiz_completion',
                'criteria' => ['total_quizzes' => 10]
            ],
            [
                'name' => 'Perfect Score',
                'description' => 'Got 100% on a quiz',
                'icon' => 'fas fa-star',
                'required_xp' => 0,
                'required_lessons' => 0,
                'type' => 'quiz_score',
                'criteria' => ['perfect_score' => true]
            ],
            [
                'name' => 'Speed Demon',
                'description' => 'Completed a quiz in under 5 minutes',
                'icon' => 'fas fa-bolt',
                'required_xp' => 0,
                'required_lessons' => 0,
                'type' => 'quiz_speed',
                'criteria' => ['time_limit' => 300] // 5 minutes in seconds
            ],
            [
                'name' => 'Knowledge Seeker',
                'description' => 'Completed 5 different subjects',
                'icon' => 'fas fa-brain',
                'required_xp' => 0,
                'required_lessons' => 0,
                'type' => 'subject_completion',
                'criteria' => ['unique_subjects' => 5]
            ],
            [
                'name' => 'Streak Master',
                'description' => 'Completed quizzes for 7 days in a row',
                'icon' => 'fas fa-fire',
                'required_xp' => 0,
                'required_lessons' => 0,
                'type' => 'streak',
                'criteria' => ['days_streak' => 7]
            ],
            [
                'name' => 'Scholar',
                'description' => 'Earned 1000 XP',
                'icon' => 'fas fa-graduation-cap',
                'required_xp' => 1000,
                'required_lessons' => 0,
                'type' => 'xp_milestone',
                'criteria' => ['xp_amount' => 1000]
            ],
            [
                'name' => 'Expert',
                'description' => 'Earned 5000 XP',
                'icon' => 'fas fa-trophy',
                'required_xp' => 5000,
                'required_lessons' => 0,
                'type' => 'xp_milestone',
                'criteria' => ['xp_amount' => 5000]
            ],
            [
                'name' => 'Master',
                'description' => 'Earned 10000 XP',
                'icon' => 'fas fa-crown',
                'required_xp' => 10000,
                'required_lessons' => 0,
                'type' => 'xp_milestone',
                'criteria' => ['xp_amount' => 10000]
            ],
            [
                'name' => 'Rising Star',
                'description' => 'Reached level 5',
                'icon' => 'fas fa-star',
                'required_xp' => 0,
                'required_lessons' => 0,
                'type' => 'level_milestone',
                'criteria' => ['level' => 5]
            ],
            [
                'name' => 'Study Champion',
                'description' => 'Studied for 100 hours total',
                'icon' => 'fas fa-clock',
                'required_xp' => 0,
                'required_lessons' => 0,
                'type' => 'study_time',
                'criteria' => ['total_hours' => 100]
            ],
            [
                'name' => 'Consistent 30',
                'description' => 'Active for 30 days',
                'icon' => 'fas fa-calendar-alt',
                'required_xp' => 0,
                'required_lessons' => 0,
                'type' => 'consistency',
                'criteria' => ['active_days' => 30]
            ],
            [
                'name' => 'Consistent 50',
                'description' => 'Active for 50 days',
                'icon' => 'fas fa-calendar-alt',
                'required_xp' => 0,
                'required_lessons' => 0,
                'type' => 'consistency',
                'criteria' => ['active_days' => 50]
            ],
            [
                'name' => 'Consistent 100',
                'description' => 'Active for 100 days',
                'icon' => 'fas fa-calendar-alt',
                'required_xp' => 0,
                'required_lessons' => 0,
                'type' => 'consistency',
                'criteria' => ['active_days' => 100]
            ]
        ];

        foreach ($badges as $badge) {
            Badge::create($badge);
        }
    }
}