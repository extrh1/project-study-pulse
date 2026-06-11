<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\StudyAssistantService;

class StudyAssistantController extends Controller
{
    protected $assistantService;

    public function __construct(StudyAssistantService $assistantService)
    {
        $this->assistantService = $assistantService;
    }

    /**
     * Send a message to the study assistant
     */
    public function chat(Request $request)
    {
        try {
            $validated = $request->validate([
                'message' => 'required|string|max:2000',
                'lesson_id' => 'nullable|integer|exists:lessons,id',
            ]);

            $userId = auth()->id();

            $response = $this->assistantService->chat(
                $userId,
                $validated['message'],
                $validated['lesson_id'] ?? null
            );

            return response()->json([
                'success' => true,
                'response' => $response,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get conversation history
     */
    public function history(Request $request)
    {
        try {
            $userId = auth()->id();
            $lessonId = $request->query('lesson_id');

            $messages = $this->assistantService->getConversationHistory(
                $userId,
                $lessonId
            );

            return response()->json([
                'success' => true,
                'messages' => $messages,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Clear conversation history
     */
    public function clear(Request $request)
    {
        try {
            $userId = auth()->id();
            $lessonId = $request->query('lesson_id');

            $deleted = $this->assistantService->clearConversation(
                $userId,
                $lessonId
            );

            return response()->json([
                'success' => true,
                'deleted' => $deleted,
                'message' => 'Conversation cleared',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
