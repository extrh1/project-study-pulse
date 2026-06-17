<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Badge extends Model
{
    protected $fillable = [
        'name',
        'description',
        'icon',
        'required_xp',
        'required_lessons',
        'type',
        'criteria',
    ];

    protected $casts = [
        'criteria'          => 'array',
        'required_xp'       => 'integer',
        'required_lessons'  => 'integer',
    ];

    public function users()
    {
        return $this->belongsToMany(User::class, 'user_badges')
            ->withTimestamps();
    }
}