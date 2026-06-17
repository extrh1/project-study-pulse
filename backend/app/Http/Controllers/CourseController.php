<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Course;

class CourseController extends Controller
{
    //  GET ALL COURSES
    public function index()
    {
        return Course::with('subject')->get();
    }

    //  CREATE COURSE
    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'subject_id' => 'required|exists:subjects,id',
        ]);

        $course = Course::create([
            'title' => $request->title,
            'description' => $request->description,
            'subject_id' => $request->subject_id,
            'user_id' => $request->user()->id,
        ]);

        return response()->json($course->load('subject'), 201);
    }

    //  GET ONE COURSE
    public function show($id)
    {
        return Course::with('subject')->findOrFail($id);
    }

    //  UPDATE COURSE
    public function update(Request $request, $id)
    {
        $course = Course::where('id', $id)
            ->where('user_id', $request->user()->id)
            ->firstOrFail();

        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'subject_id' => 'required|exists:subjects,id',
        ]);

        $course->update([
            'title' => $request->title,
            'description' => $request->description,
            'subject_id' => $request->subject_id,
        ]);

        return response()->json($course->load('subject'));
    }

    public function destroy(Request $request, $id)
    {
        $course = Course::where('id', $id)
            ->where('user_id', $request->user()->id)
            ->firstOrFail();

        $course->delete();

        return response()->json(['message' => 'Deleted']);
    }
}