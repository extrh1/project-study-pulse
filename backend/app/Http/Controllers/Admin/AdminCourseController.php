<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\AdminNotification;
use Illuminate\Http\Request;

class AdminCourseController extends Controller
{
    public function index(Request $request)
    {
        $query = Course::with('category')
        ->withCount('lessons');

        if ($request->filled('search')) {
            $query->where(function ($q) use ($request) {
                $q->where('title', 'like', "%{$request->search}%")
                  ->orWhere('description', 'like', "%{$request->search}%");
            });
        }

        if ($request->filled('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        $courses = $query->orderBy('created_at', 'desc')->paginate(10);

        return response()->json([
            'data'         => $courses->items(),
            'last_page'    => $courses->lastPage(),
            'current_page' => $courses->currentPage(),
            'total'        => $courses->total(),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'title'       => 'required|string|max:255',
            'description' => 'required|string',
            'status'      => 'required|in:draft,published',
            'category_id' => 'nullable|exists:categories,id',
        ]);

        $course = Course::create([
            'title'       => $request->title,
            'description' => $request->description,
            'status'      => $request->status ?? 'draft',
            'category_id' => $request->category_id,
        ]);

        AdminNotification::create([
            'type'    => 'new_course',
            'title'   => 'New Course Created',
            'message' => "Course \"{$course->title}\" was created",
            'icon'    => 'book',
            'data'    => ['course_id' => $course->id, 'status' => $course->status],
        ]);

        return response()->json($course, 201);
    }

    public function show($id)
    {
        $course = Course::with(['category', 'subject', 'lessons'])
            ->withCount('lessons')
            ->findOrFail($id);

        return response()->json($course);
    }

    public function update(Request $request, $id)
    {
        $course = Course::findOrFail($id);

        $request->validate([
            'title'       => 'sometimes|string|max:255',
            'description' => 'sometimes|string',
            'status'      => 'sometimes|in:draft,published',
            'category_id' => 'nullable|exists:categories,id',
        ]);

        $data = [];

        if ($request->has('title'))       $data['title']       = $request->title;
        if ($request->has('description')) $data['description'] = $request->description;
        if ($request->has('status'))      $data['status']      = $request->status;
        if ($request->has('category_id')) $data['category_id'] = $request->category_id;

        $course->update($data);

        return response()->json($course->fresh('category'));
    }

    public function destroy($id)
    {
        $course = Course::findOrFail($id);
        $title  = $course->title;
        $course->delete();

        AdminNotification::create([
            'type'    => 'course_deleted',
            'title'   => 'Course Deleted',
            'message' => "Course \"{$title}\" was deleted",
            'icon'    => 'trash',
            'data'    => ['course_id' => $id],
        ]);

        return response()->json(['message' => 'Deleted successfully']);
    }

    public function toggle($id)
    {
        $course         = Course::findOrFail($id);
        $course->status = $course->status === 'published' ? 'draft' : 'published';
        $course->save();

        AdminNotification::create([
            'type'    => 'course_status',
            'title'   => 'Course Status Changed',
            'message' => "Course \"{$course->title}\" is now {$course->status}",
            'icon'    => 'toggle',
            'data'    => ['course_id' => $course->id, 'status' => $course->status],
        ]);

        return response()->json($course);
    }
}