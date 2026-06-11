<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Support\Facades\Storage;
use App\Models\Badge;
use App\Models\Notification;
use App\Models\Course;
use App\Models\Lesson;
use App\Models\StudySession;

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
        'level',
        'xp',
        'preferences',
        'plan',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $appends = [
        'avatar_url',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
        'preferences' => 'array',
    ];

    public function computedLevel(): int
    {
        $xp = max(0, (int) ($this->xp ?? 0));
        return max(1, intdiv($xp, 100) + 1);
    }

    public function getAvatarUrlAttribute()
    {
        if (!$this->avatar) {
            return null;
        }

        return url('storage/' . $this->avatar);
    }

    // Badges (many-to-many)
    public function badges()
    {
        return $this->belongsToMany(Badge::class, 'user_badges');
    }

    // Notifications (one-to-many)
    public function notifications()
    {
        return $this->hasMany(Notification::class);
    }

    // Enrolled courses (many-to-many)
    public function courses()
    {
        return $this->belongsToMany(Course::class, 'user_courses')
            ->withPivot('completed')
            ->withTimestamps();
    }

    // Lesson progress (many-to-many)
    public function lessons()
    {
        return $this->belongsToMany(Lesson::class, 'lesson_progress')
            ->withPivot('is_completed')
            ->withTimestamps();
    }

    public function studySessions()
    {
        return $this->hasMany(StudySession::class);
    }
}