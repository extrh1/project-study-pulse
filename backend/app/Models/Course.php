<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Lesson;
use App\Models\User;

class Course extends Model
{
    protected $fillable = [
        'title',
        'description',
        'subject_id',
        'user_id',
        'progress',
        'level',
        'is_active',
    ];

    public function lessons()
    {
        return $this->hasMany(Lesson::class);
    }

    public function subject()
    {
        return $this->belongsTo(\App\Models\Subject::class);
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
}