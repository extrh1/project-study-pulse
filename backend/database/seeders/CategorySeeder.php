<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Category;
use Illuminate\Support\Str;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            'Frontend',
            'Backend',
            'Full Stack',
            'UI/UX Design',
            'Database',
            'DevOps',
        ];

        foreach ($categories as $name) {
            Category::create([
                'name' => $name,
                'slug' => Str::slug($name),
                'subject_id' => 1, 
            ]);
        }
    }
}