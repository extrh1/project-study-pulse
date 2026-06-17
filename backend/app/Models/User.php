<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
        'username',
        'phone',
        'avatar',
        // gamification
        'xp',
        'level',
        'streak_days',
        'last_login_at',
        // plan & preferences
        'plan',
        'preferences',
        // security
        'two_factor_enabled',
        'two_factor_secret',
        'login_alerts',
        'email_notifications',
        'push_notifications',
        'reset_code',
        // status
        'role',
        'is_active',
    ];

    protected $hidden = [
        'password',
        'remember_token',
        'two_factor_secret',
        'reset_code',
    ];

    protected $appends = [
        'avatar_url',
    ];

    protected $casts = [
        'email_verified_at'   => 'datetime',
        'last_login_at'       => 'datetime',
        'password'            => 'hashed',
        'preferences'         => 'array',
        'is_active'           => 'boolean',
        'two_factor_enabled'  => 'boolean',
        'login_alerts'        => 'boolean',
        'email_notifications' => 'boolean',
        'push_notifications'  => 'boolean',
        'xp'                  => 'integer',
        'level'               => 'integer',
        'streak_days'         => 'integer',
    ];

    // ── Accessors ──────────────────────────────────────────────────────────

    public function getAvatarUrlAttribute(): ?string
    {
        return $this->avatar ? url('storage/' . $this->avatar) : null;
    }

    // ── Helpers ────────────────────────────────────────────────────────────

    public function isAdmin(): bool
    {
        return $this->role === 'admin';
    }

    public function isActive(): bool
    {
        return (bool) $this->is_active;
    }

    public function computedLevel(): int
    {
        $xp = max(0, (int) ($this->xp ?? 0));
        return max(1, intdiv($xp, 100) + 1);
    }

    // ── Relationships ──────────────────────────────────────────────────────

    public function subjects()
    {
        return $this->hasMany(Subject::class);
    }

    public function courses()
    {
        return $this->belongsToMany(Course::class, 'user_courses')
            ->withPivot('completed')
            ->withTimestamps();
    }

    public function lessons()
    {
        return $this->belongsToMany(Lesson::class, 'lesson_progress')
            ->withPivot('is_completed')
            ->withTimestamps();
    }

    public function badges()
    {
        return $this->belongsToMany(Badge::class, 'user_badges')
            ->withPivot('earned_at')
            ->withTimestamps();
    }

    public function studySessions()
    {
        return $this->hasMany(StudySession::class);
    }

    public function quizAttempts()
    {
        return $this->hasMany(QuizAttempt::class);
    }

    public function messages()
    {
        return $this->hasMany(Message::class);
    }

    public function notifications()
    {
        return $this->hasMany(Notification::class);
    }

    public function loginHistories()
    {
        return $this->hasMany(LoginHistory::class);
    }
}