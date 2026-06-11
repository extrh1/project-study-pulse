<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Course;
use App\Models\Subject;
use App\Models\User;

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
}