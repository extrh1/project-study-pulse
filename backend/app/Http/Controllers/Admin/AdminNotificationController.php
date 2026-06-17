<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AdminNotification;

class AdminNotificationController extends Controller
{
    // GET /admin/notifications
    public function index()
    {
        $notifications = AdminNotification::latest()->take(30)->get();

        return response()->json($notifications);
    }

    // PATCH /admin/notifications/{id}/read
    public function markAsRead($id)
    {
        AdminNotification::findOrFail($id)->update(['read_at' => now()]);

        return response()->json(['message' => 'Marked as read']);
    }

    // POST /admin/notifications/read-all
    public function markAllAsRead()
    {
        AdminNotification::whereNull('read_at')->update(['read_at' => now()]);

        return response()->json(['message' => 'All marked as read']);
    }

    // DELETE /admin/notifications/{id}
    public function destroy($id)
    {
        AdminNotification::findOrFail($id)->delete();

        return response()->json(['message' => 'Deleted']);
    }
}