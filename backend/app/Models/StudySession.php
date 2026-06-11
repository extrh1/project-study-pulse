<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class StudySession extends Model
{
    protected $fillable = [
        'user_id',
        'duration',
        'started_at'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}