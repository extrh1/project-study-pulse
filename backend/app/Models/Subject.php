<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Lesson;

class Subject extends Model
{
    protected $fillable = [
        'name',
        'description',
        'progress',
        'user_id',
    ];

    public function lessons()
    {
        return $this->hasMany(Lesson::class);
    }
}
