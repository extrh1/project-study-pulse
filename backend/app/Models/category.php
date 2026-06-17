<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    protected $fillable = [
        'name',
        'slug',
        'subject_id',
        'status',
        'color',
    ];

    protected $attributes = [
        'status' => 'active',
        'color'  => '#6366f1',
    ];

    // ── Relationships ──────────────────────────────────────────────────────

    public function subject()
    {
        return $this->belongsTo(Subject::class);
    }

    public function courses()
    {
        return $this->hasMany(Course::class);
    }

    public function lessons()
    {
        return $this->hasManyThrough(Lesson::class, Course::class);
    }
}