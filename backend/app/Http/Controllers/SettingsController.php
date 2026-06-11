<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class SettingsController extends Controller
{
    // ========================
    // GET USER PREFERENCES
    // ========================
    public function getPreferences(Request $request): JsonResponse
    {
        $user = $request->user();

        return response()->json([
            'status' => 'success',
            'preferences' => [
                'notifications' => $user->preferences['notifications'] ?? true,
                'privacy' => $user->preferences['privacy'] ?? 'public',
                'theme' => $user->preferences['theme'] ?? 'light',
                'email_notifications' => $user->preferences['email_notifications'] ?? true,
                'marketing_emails' => $user->preferences['marketing_emails'] ?? false,
            ],
        ]);
    }

    // ========================
    // UPDATE LANGUAGE
    // ========================
    public function updateLanguage(Request $request): JsonResponse
    {
        $user = $request->user();

        $request->validate([
            'language' => 'required|in:en,fr,ar',
        ]);

        $user->update([
            'language' => $request->input('language'),
        ]);
        $user->refresh();
        return response()->json([
            'status' => 'success',
            'message' => 'Preferences updated successfully.',
            'language' => $user->language,
        ]);
    }

    // ========================
    // UPDATE PREFERENCES
    // ========================
    public function updatePreferences(Request $request): JsonResponse
    {
        $user = $request->user();

        $request->validate([
            'notifications' => 'nullable|boolean',
            'privacy' => 'nullable|in:public,private,friends',
            'language' => 'nullable|in:en,fr,ar',
            'theme' => 'nullable|in:light,dark,auto',
            'email_notifications' => 'nullable|boolean',
            'marketing_emails' => 'nullable|boolean',
        ]);

        $preferences = $user->preferences ?? [];

        // Update only provided fields
        $fields = [
            'notifications',
            'privacy',
            'theme',
            'email_notifications',
            'marketing_emails',
        ];

        foreach ($fields as $field) {
            if ($request->has($field)) {
                $preferences[$field] = $request->input($field);
            }
        }

        $updateData = ['preferences' => $preferences];

        if ($request->filled('language')) {
            $updateData['language'] = $request->input('language');
        }

        $user->update($updateData);
        $user->refresh();

        return response()->json([
            'status' => 'success',
            'message' => 'Preferences updated successfully.',
            'preferences' => [
                'notifications' => $user->preferences['notifications'] ?? true,
                'privacy' => $user->preferences['privacy'] ?? 'public',
                'language' => $user->language ?? 'en',
                'theme' => $user->preferences['theme'] ?? 'light',
                'email_notifications' => $user->preferences['email_notifications'] ?? true,
                'marketing_emails' => $user->preferences['marketing_emails'] ?? false,
            ],
        ]);
    }

    // ========================
    // CHANGE PASSWORD
    // ========================
    public function changePassword(Request $request): JsonResponse
    {
        $user = $request->user();
        $this->setLanguage($user);

        $request->validate([
            'current_password' => 'required|string',
            'new_password' => 'required|string|min:8|confirmed',
        ]);

        if (!Hash::check($request->input('current_password'), $user->password)) {
            return response()->json([
                'status' => 'error',
                'message' => 'Current password is incorrect.',
            ], 422);
        }

        $user->update([
            'password' => Hash::make($request->input('new_password')),
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Password changed successfully.',
        ]);
    }

    // ========================
    // SECURITY SETTINGS
    // ========================
    public function getSecuritySettings(Request $request): JsonResponse
    {
        $user = $request->user();

        return response()->json([
            'status' => 'success',
            'security' => [
                'two_factor_enabled' => !empty($user->two_factor_secret),
                'last_password_change' => $user->updated_at,
                'active_sessions' => 1,
                'login_attempts' => 0,
            ],
        ]);
    }

    // ========================
    // ACCOUNT SUMMARY
    // ========================
    public function getAccountSummary(Request $request): JsonResponse
    {
        $user = $request->user();

        $user->makeHidden(['password', 'remember_token', 'two_factor_secret']);

        return response()->json([
            'status' => 'success',
            'summary' => [
                'user' => $user,
                'plan' => $user->plan ?? 'Pro',
                'created_at' => $user->created_at,
                'updated_at' => $user->updated_at,
            ],
        ]);
    }

    // ========================
    // UPDATE ACCOUNT
    // ========================
    public function updateAccountSettings(Request $request): JsonResponse
    {
        $user = $request->user();

        $request->validate([
            'name' => 'nullable|string|max:255',
            'email' => 'nullable|email|unique:users,email,' . $user->id,
            'username' => 'nullable|string|max:50|unique:users,username,' . $user->id,
            'phone' => 'nullable|string|max:30',
        ]);

        $user->update($request->only(['name', 'email', 'username', 'phone']));
        $user->refresh();

        $user->makeHidden(['password', 'remember_token']);

        return response()->json([
            'status' => 'success',
            'message' => 'Account updated successfully.',
            'user' => $user,
        ]);
    }

    // ========================
    // DELETE ACCOUNT
    // ========================
    public function deleteAccount(Request $request): JsonResponse
    {
        $user = $request->user();

        $request->validate([
            'password' => 'required|string',
        ]);

        if (!Hash::check($request->input('password'), $user->password)) {
            return response()->json([
                'status' => 'error',
                'message' => 'Account deletion failed.',
            ], 422);
        }

        $user->tokens()->delete();
        $user->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Account deleted successfully.',
        ]);
    }
}