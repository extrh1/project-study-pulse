<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Course;
use App\Models\StudySession;

class AdminController extends Controller
{
    public function stats()
    {
        return response()->json([
            'totalUsers'    => User::count(),
            'activeUsers'   => User::where('is_active', true)->count(),
            'inactiveUsers' => User::where('is_active', false)->count(),
            'totalCourses'  => Course::count(),
            'totalSessions' => StudySession::count(),
            'growth'        => 15,
        ]);
    }
}