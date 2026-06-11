<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\User;
use App\Models\Quiz;

class QuizAttempt extends Model
{
    protected $fillable = [
        'user_id',
        'quiz_id',
        'score',
        'max_score',
        'passed',
        'answers',
        'earned_xp',
        'duration_seconds',
        'completed_at',
    ];

    protected $casts = [
        'answers'      => 'array',    // Laravel handles json_encode/decode automatically
        'passed'       => 'boolean',
        'score'        => 'integer',  // ensures score is always int, never null string
        'max_score'    => 'integer',
        'earned_xp'    => 'integer',
        'completed_at' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function quiz()
    {
        return $this->belongsTo(Quiz::class);
    }
}