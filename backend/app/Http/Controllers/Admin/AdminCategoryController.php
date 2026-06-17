<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\Request;

class AdminCategoryController extends Controller
{
    public function index(Request $request)
    {
        $query = Category::withCount(['courses', 'lessons']);

        if ($request->filled('search')) {
            $search = $request->string('search')->toString();
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('slug', 'like', "%{$search}%");
            });
        }

        $categories = $query
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        return response()->json([
            'data'         => $categories->items(),
            'last_page'    => $categories->lastPage(),
            'current_page' => $categories->currentPage(),
            'total'        => $categories->total(),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name'   => 'required|string|max:255',
            'slug'   => 'required|string|max:255|unique:categories,slug',
            'status' => 'nullable|in:active,inactive',
            'color'  => 'nullable|string|max:20',
        ]);

        $category = Category::create([
            'name'   => $request->name,
            'slug'   => $request->slug,
            'status' => $request->status ?? 'active',
            'color'  => $request->color  ?? '#6366f1',
        ]);

        return response()->json($category, 201);
    }

    public function show($id)
    {
        $category = Category::with([
            'courses.lessons'
        ])->withCount([
            'courses',
            'lessons'
        ])->findOrFail($id);

        return response()->json($category);
    }

    public function update(Request $request, $id)
    {
        $category = Category::findOrFail($id);

        $request->validate([
            'name'   => 'sometimes|required|string|max:255',
            'slug'   => 'sometimes|required|string|max:255|unique:categories,slug,' . $category->id,
            'status' => 'nullable|in:active,inactive',
            'color'  => 'nullable|string|max:20',
        ]);

        $category->update([
            'name'   => $request->input('name',   $category->name),
            'slug'   => $request->input('slug',   $category->slug),
            'status' => $request->input('status', $category->status),
            'color'  => $request->input('color',  $category->color),
        ]);

        return response()->json($category);
    }

    public function destroy($id)
    {
        Category::destroy($id);

        return response()->json(['message' => 'Deleted successfully']);
    }

    public function toggle($id)
    {
        $category = Category::findOrFail($id);
        $category->status = $category->status === 'active' ? 'inactive' : 'active';
        $category->save();

        return response()->json($category);
    }
}