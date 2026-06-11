<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Subject;

class SubjectController extends Controller
{
    public function index()
    {
        return Subject::withCount('lessons')->latest()->get();
    }

    public function show($id)
    {
        return Subject::withCount('lessons')->findOrFail($id);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $subject = Subject::create([
            'name' => $request->name,
            'description' => $request->description ?? null,
            'user_id' => $request->user()->id,
        ]);

        return response()->json($subject, 201);
    }

    public function update(Request $request, $id)
    {
        $subject = Subject::where('id', $id)
            ->where('user_id', $request->user()->id)
            ->firstOrFail();

        $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $subject->update([
            'name' => $request->name,
            'description' => $request->description ?? $subject->description,
        ]);

        return response()->json($subject);
    }

    public function destroy(Request $request, $id)
    {
        $subject = Subject::where('id', $id)
            ->where('user_id', $request->user()->id)
            ->firstOrFail();

        $subject->delete();

        return response()->json(['message' => 'Subject deleted']);
    }
}
