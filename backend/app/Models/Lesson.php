<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Lesson extends Model
{
    protected $fillable = [
        'course_id',
        'subject_id',
        'title',
        'content',
        'order',
        'xp',
        'is_completed',
    ];

    protected $casts = [
        'is_completed' => 'boolean',
        'xp'           => 'integer',
        'order'        => 'integer',
    ];


    public function course()
    {
        return $this->belongsTo(Course::class);
    }

    public function subject()
    {
        return $this->belongsTo(Subject::class);
    }

    public function users()
    {
        return $this->belongsToMany(User::class, 'lesson_progress')
            ->withPivot('is_completed')
            ->withTimestamps();
    }

    public function quizzes()
    {
        return $this->hasMany(Quiz::class);
    }

    public function messages()
    {
        return $this->hasMany(Message::class);
    }
}