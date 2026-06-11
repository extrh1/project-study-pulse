<?php

namespace App\Services;

use App\Models\Message;
use App\Models\Lesson;
use Illuminate\Support\Facades\Http;

class StudyAssistantService
{
    public function chat($userId, $userMessage, $lessonId = null)
    {
        $apiKey = env('GEMINI_API_KEY');

        if (!$apiKey) {
            throw new \Exception('GEMINI_API_KEY not configured');
        }

        // Save user message
        Message::create([
            'user_id' => $userId,
            'lesson_id' => $lessonId,
            'role' => 'user',
            'content' => $userMessage,
        ]);

        // Get lesson context if provided
        $lessonContext = '';
        if ($lessonId) {
            $lesson = Lesson::find($lessonId);
            if ($lesson) {
                $lessonContext = "Current Lesson: {$lesson->title}\n\nLesson Content:\n{$lesson->content}\n\n";
            }
        }

        // Get recent conversation history (last 5 messages for context)
        $recentMessages = Message::where('user_id', $userId)
            ->when($lessonId, fn($q) => $q->where('lesson_id', $lessonId))
            ->latest()
            ->limit(5)
            ->get()
            ->reverse();

        // Build conversation context
        $conversationHistory = '';
        foreach ($recentMessages as $msg) {
            $role = $msg->role === 'user' ? 'Student' : 'Study Assistant';
            $conversationHistory .= "{$role}: {$msg->content}\n\n";
        }

        $prompt = "
You are a helpful study assistant for a learning platform called StudyPulse.
Your role is to:
- Help students understand the CURRENT lesson.
- Always prioritize the lesson content provided below.
- If the student asks a short question like 'what is route?' or 'explain it', assume they are referring to the current lesson.
- Always give examples in Laravel if the lesson is Web Development or backend routing.
- Answer as a teacher, briefly and clearly.
- Provide study tips and advice
- Encourage deeper learning
- If the topic is \"axios\", always relate it to Laravel API calls (auth, notifications, quizzes, etc.) in StudyPulse project context.
- Give real project examples instead of generic blog examples.
- Be friendly and supportive

{$lessonContext}

Recent Conversation:
{$conversationHistory}

Student: {$userMessage}

Study Assistant: 
";

        try {
            $response = Http::post(
                "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={$apiKey}",
                [
                    "contents" => [
                        [
                            "parts" => [
                                ["text" => $prompt]
                            ]
                        ]
                    ]
                ]
            );

            $responseData = $response->json();

            \Log::info('Gemini Assistant Response', $responseData);

            if (!$response->successful()) {
                throw new \Exception(
                    $responseData['error']['message'] ?? 'Gemini API request failed'
                );
            }

            $assistantResponse =
                $responseData['candidates'][0]['content']['parts'][0]['text'] ?? null;

            if (!$assistantResponse) {
                throw new \Exception(
                    'No text returned. Response: ' . json_encode($responseData)
                );
            }

            // Save assistant message
            $savedMessage = Message::create([
                'user_id' => $userId,
                'lesson_id' => $lessonId,
                'role' => 'assistant',
                'content' => $assistantResponse,
            ]);

            return [
                'id' => $savedMessage->id,
                'role' => 'assistant',
                'content' => $assistantResponse,
                'created_at' => $savedMessage->created_at,
            ];
        } catch (\Exception $e) {
            throw new \Exception('Failed to generate response: ' . $e->getMessage());
        }
    }

    public function getConversationHistory($userId, $lessonId = null)
    {
        $query = Message::where('user_id', $userId);

        if ($lessonId) {
            $query->where('lesson_id', $lessonId);
        }

        return $query->orderBy('created_at', 'asc')->get();
    }

    public function clearConversation($userId, $lessonId = null)
    {
        $query = Message::where('user_id', $userId);

        if ($lessonId) {
            $query->where('lesson_id', $lessonId);
        }

        return $query->delete();
    }
}
