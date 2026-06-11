<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Lesson;
use App\Services\LessonSummaryService;

class LessonSummaryController extends Controller
{
    protected $summaryService;

    public function __construct(LessonSummaryService $summaryService)
    {
        $this->summaryService = $summaryService;
    }

    /**
     * Generate AI summary for a lesson
     */
    public function summarize(Request $request, $lessonId)
    {
        try {
            $lesson = Lesson::findOrFail($lessonId);

            $summary = $this->summaryService->summarizeLesson(
                $lesson->content,
                $lesson->title
            );

            return response()->json([
                'success' => true,
                'lessonId' => $lessonId,
                'summary' => $summary,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Generate summary from custom content
     */
    public function summarizeContent(Request $request)
    {
        try {
            $validated = $request->validate([
                'content' => 'required|string',
                'title' => 'nullable|string',
            ]);

            $summary = $this->summaryService->summarizeLesson(
                $validated['content'],
                $validated['title'] ?? null
            );

            return response()->json([
                'success' => true,
                'summary' => $summary,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
