<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Models\User;
use App\Models\StudySession;

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::get('/home-stats', function () {
    return response()->json([
        'users' => User::count(),
        'sessions' => StudySession::count(),
    ]);
});