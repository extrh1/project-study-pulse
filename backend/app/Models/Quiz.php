<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Quiz extends Model
{
    protected $fillable = [
        'lesson_id',
        'title',
        'description',
        'passing_score',
        'questions_count',
        'is_published',
    ];

    protected $casts = [
        'is_published'    => 'boolean',
        'questions_count' => 'integer',
        'passing_score'   => 'integer',
    ];

    public function lesson()
    {
        return $this->belongsTo(Lesson::class);
    }

    public function questions()
    {
        return $this->hasMany(QuizQuestion::class);
    }

    public function attempts()
    {
        return $this->hasMany(QuizAttempt::class);
    }

    public function course()
    {
        return $this->hasOneThrough(Course::class, Lesson::class, 'id', 'id', 'lesson_id', 'course_id');
    }
}