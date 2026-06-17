<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Badge;

class BadgeController extends Controller
{
    public function index()
    {
        return Badge::all();
    }

    public function show($id)
    {
        return Badge::findOrFail($id);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|unique:badges',
            'description' => 'nullable|string',
            'icon' => 'nullable|string',
            'required_xp' => 'nullable|integer|min:0',
            'required_lessons' => 'nullable|integer|min:0',
        ]);

        $badge = Badge::create([
            'name' => $request->name,
            'description' => $request->description,
            'icon' => $request->icon,
            'required_xp' => $request->required_xp ?? 0,
            'required_lessons' => $request->required_lessons ?? 0,
        ]);

        return response()->json($badge, 201);
    }

    public function update(Request $request, $id)
    {
        $badge = Badge::findOrFail($id);

        $request->validate([
            'name' => 'nullable|string|unique:badges,name,' . $id,
            'description' => 'nullable|string',
            'icon' => 'nullable|string',
            'required_xp' => 'nullable|integer|min:0',
            'required_lessons' => 'nullable|integer|min:0',
        ]);

        $badge->update([
            'name' => $request->name ?? $badge->name,
            'description' => $request->description ?? $badge->description,
            'icon' => $request->icon ?? $badge->icon,
            'required_xp' => $request->required_xp ?? $badge->required_xp,
            'required_lessons' => $request->required_lessons ?? $badge->required_lessons,
        ]);

        return response()->json($badge);
    }

    public function destroy($id)
    {
        $badge = Badge::findOrFail($id);
        $badge->delete();
        return response()->json(['message' => 'Badge deleted']);
    }

    // 🏆 GET USER BADGES
    public function userBadges()
    {
        return auth()->user()->badges()->get();
    }

    // 🎁 AWARD BADGE TO USER
    public function awardBadge(Request $request, $badgeId)
    {
        // Only admins or the badge endpoint can award badges
        // For now, require authentication; extend with role check if needed
        if (!auth()->check()) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        $request->validate([
            'user_id' => 'required|exists:users,id',
        ]);

        $user = \App\Models\User::findOrFail($request->user_id);
        $badge = Badge::findOrFail($badgeId);

        $user->badges()->syncWithoutDetaching([$badgeId]);

        return response()->json(['message' => 'Badge awarded', 'badge' => $badge]);
    }
}
