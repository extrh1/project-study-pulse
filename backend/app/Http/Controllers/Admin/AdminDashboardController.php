<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Course;
use Illuminate\Support\Facades\DB;

class AdminDashboardController extends Controller
{
    public function index()
    {
        $totalUsers    = User::count();
        $activeUsers   = User::where('is_active', true)->count();
        $inactiveUsers = User::where('is_active', false)->count();
        $totalCourses = Course::count();

        $thisMonth = User::whereMonth('created_at', now()->month)
                         ->whereYear('created_at', now()->year)
                         ->count();

        $lastMonth = User::whereMonth('created_at', now()->subMonth()->month)
                         ->whereYear('created_at', now()->subMonth()->year)
                         ->count();

        $growth = $lastMonth > 0
            ? round((($thisMonth - $lastMonth) / $lastMonth) * 100, 2)
            : 0;


        $recentUsers = User::latest()
            ->take(5)
            ->get(['id', 'name', 'email', 'created_at', 'is_active']);

        return response()->json([
            'users' => [
                'total'    => $totalUsers,
                'active'   => $activeUsers,
                'inactive' => $inactiveUsers,
            ],
            'courses' => [
                'total' => $totalCourses,
            ],
            'growth'       => $growth,
            'recent_users' => $recentUsers,
        ]);
    }
}