<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Notification;

class NotificationController extends Controller
{
    // GET ALL NOTIFICATIONS (for user)
    public function index(Request $request)
    {
        return Notification::where('user_id', $request->user()->id)
            ->latest()
            ->get();
    }

    //  CREATE NOTIFICATION
    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'message' => 'required|string',
            'type' => 'nullable|string',
            'user_id' => 'nullable|exists:users,id',
        ]);

        $notification = Notification::create([
            'title' => $request->title,
            'message' => $request->message,
            'type' => $request->type ?? 'info',
            'user_id' => $request->user()->id,
        ]);

        return response()->json($notification, 201);
    }

    //  SHOW SINGLE NOTIFICATION
    public function show($id)
    {
        return Notification::findOrFail($id);
    }

    //  DELETE NOTIFICATION
    public function destroy(Request $request, $id)
    {
        $notification = Notification::where('id', $id)
            ->where('user_id', $request->user()->id)
            ->firstOrFail();

        $notification->delete();

        return response()->json(['message' => 'Deleted']);
    }

    // ✔ MARK AS READ (important for PFE 🔥)
    public function markAsRead(Request $request, $id)
    {
        $notification = Notification::where('id', $id)
            ->where('user_id', $request->user()->id)
            ->firstOrFail();

        $notification->update([
            'is_read' => true
        ]);

        return response()->json($notification);
    }
}