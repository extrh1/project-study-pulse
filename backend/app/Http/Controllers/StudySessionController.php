<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\StudySession;

class StudySessionController extends Controller
{
    public function index()
    {
        return StudySession::where('user_id', auth()->id())->get();
    }

    public function start(Request $request)
    {
        return StudySession::create([
            'user_id' => auth()->id(),
            'started_at' => now()
        ]);
    }

    public function end(Request $request)
    {
        $session = StudySession::where('user_id', auth()->id())
            ->latest()
            ->first();

        if ($session) {
            $session->update([
                'duration' => now()->diffInMinutes($session->started_at)
            ]);
        }

        return $session;
    }
}