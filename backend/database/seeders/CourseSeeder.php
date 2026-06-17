<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CourseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
            $courses = [
                [
                    'title' => 'Laravel',
                    'description' => 'Learn how to build modern web applications using the Laravel framework.',
                    'subject_id' => 1,
                    'status' => 'published',
                    'category_id' => 2,
                ],
                [
                    'title' => 'React',
                    'description' => 'Learn how to build modern web applications using React.',
                    'subject_id' => 1, 
                    'status' => 'published',
                    'category_id' => 1,
                ],
            ];
    
            foreach ($courses as $course) {
                \App\Models\Course::create($course);
            }
    }
}
