<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;

class LessonSummaryService
{
    public function summarizeLesson($lessonContent, $lessonTitle = null)
    {
        $apiKey = env('GEMINI_API_KEY');

        if (!$apiKey) {
            throw new \Exception('GEMINI_API_KEY not configured');
        }

        $prompt = "
Summarize the following lesson in a clear and concise way. 
Create multiple sections with key points.

Lesson Title: {$lessonTitle}

Lesson Content:
{$lessonContent}

Provide the summary in the following JSON format:
{
  \"title\": \"Summary Title\",
  \"overview\": \"2-3 sentence overview\",
  \"keyPoints\": [\"point 1\", \"point 2\", \"point 3\", ...],
  \"concepts\": {
    \"concept_name\": \"explanation\"
  },
  \"tips\": [\"tip 1\", \"tip 2\"],
  \"reviewQuestions\": [\"question 1\", \"question 2\", \"question 3\"]
}

Return ONLY valid JSON, no additional text.
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
            $text = $responseData['candidates'][0]['content']['parts'][0]['text'] ?? null;

            if (!$text) {
                throw new \Exception('Empty response from AI');
            }

            return json_decode($text, true);
        } catch (\Exception $e) {
            throw new \Exception('Failed to summarize lesson: ' . $e->getMessage());
        }
    }
}
