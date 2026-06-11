<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\User;

class Badge extends Model
{
    protected $fillable = [
        'name',
        'description',
        'icon',
        'required_xp',
        'required_lessons',
        'type',
        'criteria'
    ];

    protected $casts = [
        'criteria' => 'json',
    ];
    
    public function users()
    {
        return $this->belongsToMany(User::class, 'user_badges');
    }
}
