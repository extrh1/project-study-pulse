<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Course;
use App\Models\Lesson;

class LessonController extends Controller
{
    // 📄 GET ALL LESSONS
    public function index()
    {
        return Lesson::with('subject')->get();
    }

    // 📄 GET ONE LESSON
    public function show($id)
    {
        return Lesson::with('subject')->findOrFail($id);
    }

    // ➕ CREATE LESSON
    public function store(Request $request)
    {
        $request->validate([
            'course_id' => 'required|exists:courses,id',
            'title' => 'required|string',
            'content' => 'required|string',
            'subject_id' => 'required|exists:subjects,id',
            'order' => 'nullable|integer|min:0',
            'xp' => 'nullable|integer|min:0',
            'is_completed' => 'nullable|boolean',
        ]);

        $course = Course::findOrFail($request->course_id);

        if ($course->subject_id != $request->subject_id) {
            return response()->json([
                'message' => 'Selected course does not belong to the chosen subject.',
            ], 422);
        }

        $lesson = Lesson::create([
            'course_id' => $request->course_id,
            'title' => $request->title,
            'content' => $request->content,
            'subject_id' => $request->subject_id,
            'order' => $request->order ?? 0,
            'xp' => $request->xp ?? 10,
            'is_completed' => $request->boolean('is_completed', false),
        ]);

        return response()->json($lesson, 201);
    }

    // ✏️ UPDATE LESSON
    public function update(Request $request, $id)
    {
        $lesson = Lesson::findOrFail($id);

        $request->validate([
            'course_id' => 'nullable|exists:courses,id',
            'title' => 'required|string',
            'content' => 'required|string',
            'subject_id' => 'nullable|exists:subjects,id',
            'order' => 'nullable|integer|min:0',
            'xp' => 'nullable|integer|min:0',
            'is_completed' => 'nullable|boolean',
        ]);

        $lesson->update([
            'course_id' => $request->course_id ?? $lesson->course_id,
            'title' => $request->title,
            'content' => $request->content,
            'subject_id' => $request->subject_id ?? $lesson->subject_id,
            'order' => $request->order ?? $lesson->order,
            'xp' => $request->xp ?? $lesson->xp,
            'is_completed' => $request->boolean('is_completed', $lesson->is_completed),
        ]);

        return response()->json($lesson);
    }

    // 🗑 DELETE LESSON
    public function destroy($id)
    {
        $lesson = Lesson::findOrFail($id);
        $lesson->delete();

        return response()->json(['message' => 'Lesson deleted']);
    }
}