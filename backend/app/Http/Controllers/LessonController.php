<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Course;
use App\Models\Lesson;

class LessonController extends Controller
{
    /**
     * Display a listing of the lessons with optional filters.
     */
    public function index(Request $request)
    {
        $query = Lesson::with(['subject', 'course']);
        
        // Filter by course_id
        if ($request->has('course_id') && $request->course_id) {
            $query->where('course_id', $request->course_id);
        }
        
        // Filter by subject_id
        if ($request->has('subject_id') && $request->subject_id) {
            $query->where('subject_id', $request->subject_id);
        }
        
        // Search by lesson title, course name, or subject name
        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('content', 'like', "%{$search}%")
                  ->orWhereHas('course', function($courseQuery) use ($search) {
                      $courseQuery->where('title', 'like', "%{$search}%");
                  })
                  ->orWhereHas('subject', function($subjectQuery) use ($search) {
                      $subjectQuery->where('name', 'like', "%{$search}%");
                  });
            });
        }
        
        // Filter by course title (if you want a separate course search)
        if ($request->has('course_title') && $request->course_title) {
            $query->whereHas('course', function($q) use ($request) {
                $q->where('title', 'like', "%{$request->course_title}%");
            });
        }
        
        // Sort options
        $sortBy = $request->get('sort_by', 'created_at');
        $sortOrder = $request->get('sort_order', 'desc');
        
        // Allowed sort fields to prevent SQL injection
        $allowedSorts = ['id', 'title', 'order', 'xp', 'created_at', 'updated_at'];
        if (in_array($sortBy, $allowedSorts)) {
            $query->orderBy($sortBy, $sortOrder);
        }
        
        // Pagination (optional)
        $perPage = $request->get('per_page', 100);
        $lessons = $query->paginate($perPage);
        
        return response()->json($lessons);
    }

    /**
     * Display the specified lesson.
     */
    public function show($id)
    {
        $lesson = Lesson::with(['subject', 'course', 'quizzes'])->findOrFail($id);
        return response()->json($lesson);
    }

    /**
     * Store a newly created lesson in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'course_id' => 'required|exists:courses,id',
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'subject_id' => 'required|exists:subjects,id',
            'order' => 'nullable|integer|min:0',
            'xp' => 'nullable|integer|min:0',
            'is_completed' => 'nullable|boolean',
        ]);

        // Verify that the course belongs to the subject
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

        // Load relationships before returning
        $lesson->load(['subject', 'course']);

        return response()->json([
            'message' => 'Lesson created successfully',
            'lesson' => $lesson
        ], 201);
    }

    /**
     * Update the specified lesson in storage.
     */
    public function update(Request $request, $id)
    {
        $lesson = Lesson::findOrFail($id);

        $request->validate([
            'course_id' => 'nullable|exists:courses,id',
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'subject_id' => 'nullable|exists:subjects,id',
            'order' => 'nullable|integer|min:0',
            'xp' => 'nullable|integer|min:0',
            'is_completed' => 'nullable|boolean',
        ]);

        // If course_id is being updated, verify subject relationship
        if ($request->has('course_id') && $request->course_id) {
            $course = Course::findOrFail($request->course_id);
            $subjectId = $request->subject_id ?? $lesson->subject_id;
            
            if ($course->subject_id != $subjectId) {
                return response()->json([
                    'message' => 'Selected course does not belong to the chosen subject.',
                ], 422);
            }
        }

        $lesson->update([
            'course_id' => $request->course_id ?? $lesson->course_id,
            'title' => $request->title,
            'content' => $request->content,
            'subject_id' => $request->subject_id ?? $lesson->subject_id,
            'order' => $request->order ?? $lesson->order,
            'xp' => $request->xp ?? $lesson->xp,
            'is_completed' => $request->boolean('is_completed', $lesson->is_completed),
        ]);

        // Load relationships before returning
        $lesson->load(['subject', 'course']);

        return response()->json([
            'message' => 'Lesson updated successfully',
            'lesson' => $lesson
        ]);
    }

    /**
     * Remove the specified lesson from storage.
     */
    public function destroy($id)
    {
        $lesson = Lesson::findOrFail($id);
        
        // Check if lesson has quizzes before deleting
        if ($lesson->quizzes()->count() > 0) {
            return response()->json([
                'message' => 'Cannot delete lesson because it has associated quizzes.',
                'quizzes_count' => $lesson->quizzes()->count()
            ], 422);
        }
        
        $lesson->delete();

        return response()->json([
            'message' => 'Lesson deleted successfully'
        ]);
    }

    /**
     * Toggle lesson status (active/inactive).
     */
    public function toggle($id)
    {
        $lesson = Lesson::findOrFail($id);
        $lesson->is_completed = !$lesson->is_completed;
        $lesson->save();
        
        return response()->json([
            'message' => 'Lesson status updated successfully',
            'lesson' => $lesson->load(['subject', 'course'])
        ]);
    }

    /**
     * Get lessons by course ID.
     */
    public function getByCourse($courseId)
    {
        $lessons = Lesson::with(['subject', 'course'])
            ->where('course_id', $courseId)
            ->orderBy('order')
            ->get();
            
        return response()->json($lessons);
    }

    /**
     * Get lessons by subject ID.
     */
    public function getBySubject($subjectId)
    {
        $lessons = Lesson::with(['subject', 'course'])
            ->where('subject_id', $subjectId)
            ->orderBy('order')
            ->get();
            
        return response()->json($lessons);
    }

    /**
     * Bulk delete lessons.
     */
    public function bulkDelete(Request $request)
    {
        $request->validate([
            'ids' => 'required|array|min:1',
            'ids.*' => 'exists:lessons,id'
        ]);

        $deletedCount = Lesson::whereIn('id', $request->ids)->delete();

        return response()->json([
            'message' => "{$deletedCount} lessons deleted successfully",
            'deleted_count' => $deletedCount
        ]);
    }

    /**
     * Reorder lessons.
     */
    public function reorder(Request $request)
    {
        $request->validate([
            'orders' => 'required|array',
            'orders.*.id' => 'required|exists:lessons,id',
            'orders.*.order' => 'required|integer|min:0'
        ]);

        foreach ($request->orders as $item) {
            Lesson::where('id', $item['id'])->update(['order' => $item['order']]);
        }

        return response()->json([
            'message' => 'Lessons reordered successfully'
        ]);
    }

    /**
     * Get lesson statistics.
     */
    public function stats()
    {
        $totalLessons = Lesson::count();
        $completedLessons = Lesson::where('is_completed', true)->count();
        $totalXP = Lesson::sum('xp');
        
        $lessonsByCourse = Lesson::with('course')
            ->selectRaw('course_id, count(*) as count')
            ->groupBy('course_id')
            ->get()
            ->map(function($item) {
                return [
                    'course_id' => $item->course_id,
                    'course_title' => $item->course->title ?? 'Unknown',
                    'count' => $item->count
                ];
            });

        return response()->json([
            'total_lessons' => $totalLessons,
            'completed_lessons' => $completedLessons,
            'completion_rate' => $totalLessons > 0 ? round(($completedLessons / $totalLessons) * 100, 2) : 0,
            'total_xp' => $totalXP,
            'average_xp' => $totalLessons > 0 ? round($totalXP / $totalLessons, 2) : 0,
            'lessons_by_course' => $lessonsByCourse
        ]);
    }
}