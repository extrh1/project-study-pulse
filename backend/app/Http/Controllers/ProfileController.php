<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Storage;
use App\Models\User;

class ProfileController extends Controller
{
    // ========================
    // HIDDEN FIELDS (shared)
    // ========================
    private array $hiddenFields = ['password', 'remember_token', 'two_factor_secret'];

    // ========================
    // GET AUTHENTICATED USER PROFILE
    // ========================
    public function getProfile(Request $request): JsonResponse
    {
        $user = $request->user();
        $user->makeHidden($this->hiddenFields);

        return response()->json([
            'status' => 'success',
            'user'   => $this->appendAvatarUrl($user),
        ]);
    }

    // ========================
    // GET PUBLIC PROFILE BY USERNAME
    // ========================
    public function getPublicProfile(string $username): JsonResponse
    {
        $user = User::where('username', $username)
            ->where('is_active', true)
            ->firstOrFail();

        $user->makeHidden([
            ...$this->hiddenFields,
            'preferences',
            'email',
            'phone',
        ]);

        return response()->json([
            'status' => 'success',
            'user'   => $this->appendAvatarUrl($user),
        ]);
    }

    // ========================
    // UPDATE PROFILE
    // ========================
    public function updateProfile(Request $request): JsonResponse
    {
        $user = $request->user();

        $request->validate([
            'name'     => 'nullable|string|max:255',
            'email'    => 'nullable|email|unique:users,email,' . $user->id,
            'username' => 'nullable|string|max:50|unique:users,username,' . $user->id,
            'phone'    => 'nullable|string|max:30',
        ]);

        $user->update($request->only(['name', 'email', 'username', 'phone']));

        $user->refresh();
        $user->makeHidden($this->hiddenFields);

        return response()->json([
            'status'  => 'success',
            'message' => 'Profile updated successfully.',
            'user'    => $this->appendAvatarUrl($user),
        ]);
    }

    // ========================
    // UPLOAD / UPDATE AVATAR
    // ========================
    public function uploadAvatar(Request $request): JsonResponse
    {
        $user = $request->user();

        $request->validate([
            'avatar' => 'required|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
        ]);

        try {
            if ($user->avatar && Storage::disk('public')->exists($user->avatar)) {
                Storage::disk('public')->delete($user->avatar);
            }

            $avatarPath = $request->file('avatar')->store('avatars', 'public');
            $user->update(['avatar' => $avatarPath]);
            $user->refresh();
            $user->makeHidden($this->hiddenFields);

            return response()->json([
                'status'  => 'success',
                'message' => __('profile.avatar_uploaded'),
                'user'    => $this->appendAvatarUrl($user),
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status'  => 'error',
                'message' => __('profile.avatar_upload_failed'),
            ], 500);
        }
    }

    // ========================
    // DELETE AVATAR
    // ========================
    public function deleteAvatar(Request $request): JsonResponse
    {
        $user = $request->user();

        try {
            if ($user->avatar && Storage::disk('public')->exists($user->avatar)) {
                Storage::disk('public')->delete($user->avatar);
            }

            $user->update(['avatar' => null]);
            $user->refresh();
            $user->makeHidden($this->hiddenFields);

            return response()->json([
                'status'  => 'success',
                'message' => __('profile.avatar_deleted'),
                'user'    => $this->appendAvatarUrl($user),
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status'  => 'error',
                'message' => __('profile.avatar_deletion_failed'),
            ], 500);
        }
    }

    // ========================
    // GET USER STATS
    // ========================
    public function getUserStats(Request $request): JsonResponse
    {
        return response()->json([
            'status' => 'success',
            'stats'  => $this->buildStats($request->user()),
        ]);
    }

    // ========================
    // GET PROFILE WITH STATS
    // ========================
    public function getProfileWithStats(Request $request): JsonResponse
    {
        $user = $request->user();
        $user->makeHidden($this->hiddenFields);

        return response()->json([
            'status' => 'success',
            'user'   => $this->appendAvatarUrl($user),
            'stats'  => $this->buildStats($user),
        ]);
    }

    // ========================
    // PRIVATE HELPERS
    // ========================

    /**
     * Build gamification stats for a user.
     */
    private function buildStats(User $user): array
    {
        return [
            'total_xp'          => $user->xp ?? 0,
            'level'             => $user->computedLevel(),
            'streak_days'       => $user->streak_days ?? 0,
            'badges_count'      => $user->badges()->count(),
            'courses_count'     => $user->courses()->count(),
            'completed_lessons' => $user->lessons()->wherePivot('is_completed', true)->count(),
            'total_lessons'     => $user->lessons()->count(),
        ];
    }

    /**
     * Append a full public avatar_url to the user object.
     * The frontend should always use avatar_url, never the raw avatar path.
     */
    private function appendAvatarUrl(User $user): User
    {
        $user->avatar_url = $user->avatar
            ? url('/storage/' . $user->avatar)
            : null;

        return $user;
    }
}