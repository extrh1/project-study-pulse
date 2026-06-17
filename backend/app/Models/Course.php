<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Course extends Model
{
    protected $fillable = [
        'title',
        'description',
        'subject_id',
        'status',
        'category_id',
        'user_id',
        'progress',
        'level',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'progress'  => 'integer',
    ];


    public function lessons()
    {
        return $this->hasMany(Lesson::class);
    }

    public function subject()
    {
        return $this->belongsTo(Subject::class);
    }

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function students()
    {
        return $this->belongsToMany(User::class, 'user_courses')
            ->withPivot('completed')
            ->withTimestamps();
    }

    public function quizzes()
    {
        return $this->hasManyThrough(Quiz::class, Lesson::class);
    }
}