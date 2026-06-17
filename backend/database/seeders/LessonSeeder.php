<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Lesson;
use App\Models\Subject;
use App\Models\Course;
class LessonSeeder extends Seeder
{
        /**
         * Run the database seeds.
         */
    public function run(): void
    {
        $react = Course::where('title', 'React')->first();
        $laravel = Course::where('title', 'Laravel')->first();

        // React lessons
        $reactLessons = [
            'Axios',
            'React Router',
            'Hooks',
            'Components',
            'State Management',
        ];

        foreach ($reactLessons as $index => $lesson) {
            Lesson::create([
                'course_id' => $react->id,
                'subject_id' => $react->subject_id,
                'title' => $lesson,
                'order' => $index + 1,
                'xp' => 10,
            ]);
        }

        // Laravel lessons
        $laravelLessons = [
            'Route',
            'Middleware',
            'Controller',
            'Model',
            'Migration',
            'Validation',
            'Authentication',
        ];

        foreach ($laravelLessons as $index => $lesson) {
            Lesson::create([
                'course_id' => $laravel->id,
                'subject_id' => $laravel->subject_id,
                'title' => $lesson,
                'order' => $index + 1,
                'xp' => 10,
            ]);
        }
    }
}