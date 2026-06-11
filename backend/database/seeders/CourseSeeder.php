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
            // Create some sample courses
            $courses = [
                [
                    'title' => 'Introduction to Programming',
                    'description' => 'Learn the basics of programming using Python.',
                    'image_url' => 'https://example.com/images/python-course.jpg',
                ],
                [
                    'title' => 'Web Development with Laravel',
                    'description' => 'Build modern web applications using the Laravel framework.',
                    'image_url' => 'https://example.com/images/laravel-course.jpg',
                ],
                [
                    'title' => 'Data Science with R',
                    'description' => 'Analyze and visualize data using R programming language.',
                    'image_url' => 'https://example.com/images/r-course.jpg',
                ],
            ];
    
            foreach ($courses as $course) {
                \App\Models\Course::create($course);
            }
    }
}
