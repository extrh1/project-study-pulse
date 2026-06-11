<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\StudySession;
use App\Models\QuizAttempt;
use Carbon\Carbon;

class StatsChartController extends Controller
{
    public function index()
    {
        $userId = auth()->id();

        $sessions = StudySession::where('user_id', $userId)->get();

        $days = [
            'Mon' => ['hours' => 0, 'quizzes' => 0],
            'Tue' => ['hours' => 0, 'quizzes' => 0],
            'Wed' => ['hours' => 0, 'quizzes' => 0],
            'Thu' => ['hours' => 0, 'quizzes' => 0],
            'Fri' => ['hours' => 0, 'quizzes' => 0],
            'Sat' => ['hours' => 0, 'quizzes' => 0],
            'Sun' => ['hours' => 0, 'quizzes' => 0],
        ];

        foreach ($sessions as $session) {
            $dayName = Carbon::parse($session->created_at)->format('D'); // Mon, Tue...

            if (isset($days[$dayName])) {
                $days[$dayName]['hours'] += $session->duration;
            }
        }

        $quizAttempts = QuizAttempt::where('user_id', $userId)->get();
        $totalSessionMinutes = $sessions->sum('duration');
        $useQuizFallback = $totalSessionMinutes === 0;

        foreach ($quizAttempts as $attempt) {
            $dayName = Carbon::parse($attempt->completed_at ?? $attempt->created_at)->format('D');

            if (isset($days[$dayName])) {
                $days[$dayName]['quizzes'] += 1;

                if ($useQuizFallback) {
                    $duration = 5;
                    if ($attempt->completed_at && $attempt->completed_at->greaterThan($attempt->created_at)) {
                        $duration = $attempt->completed_at->diffInMinutes($attempt->created_at);
                    }
                    $days[$dayName]['hours'] += $duration;
                }
            }
        }

        $data = [];

        foreach ($days as $day => $values) {
            $data[] = [
                'name' => $day,
                'hours' => round($values['hours'] / 60, 1),
                'quizzes' => $values['quizzes'],
            ];
        }

        return response()->json($data);
    }
}