<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\AdminNotification;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Str;
use Laravel\Socialite\Facades\Socialite;
use App\Mail\ResetCodeMail;

class AuthController extends Controller
{
    // ========================
    // LOGIN
    // ========================
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json([
                'message' => 'Invalid credentials'
            ], 401);
        }

        if ($user->is_active == 0) {
            return response()->json([
                'message' => 'Account disabled'
            ], 403);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'status' => 'success',
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
            ],
            'token' => $token,
        ]);
    }

    // ========================
    // REGISTER
    // ========================
    public function register(Request $request)
    {
        $request->validate([
            'name' => 'required|string',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|min:8|confirmed',
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'is_active' => 1,
        ]);

        // 🔔 Admin notification
        AdminNotification::create([
            'type'    => 'new_user',
            'title'   => 'New Registration',
            'message' => "{$user->name} just created an account",
            'icon'    => 'user',
            'data'    => ['user_id' => $user->id, 'email' => $user->email],
        ]);

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'status' => 'success',
            'user'   => $user,
            'token'  => $token,
        ]);
    }

    // ========================
    // SOCIAL REDIRECT
    // ========================
    public function socialRedirect($provider)
    {
        $providers = ['google', 'facebook', 'linkedin', 'twitter'];

        if (!in_array($provider, $providers)) {
            return response()->json(['message' => 'Unsupported provider'], 404);
        }

        $url = Socialite::driver($provider)
            ->stateless()
            ->redirect()
            ->getTargetUrl();

        return response()->json([
            'status' => 'success',
            'url'    => $url,
        ]);
    }

    // ========================
    // SOCIAL CALLBACK
    // ========================
    public function socialCallback(Request $request, $provider)
    {
        $socialUser = Socialite::driver($provider)->stateless()->user();

        if (!$socialUser->getEmail()) {
            return response()->json(['message' => 'Email not provided'], 422);
        }

        $isNew = !User::where('email', $socialUser->getEmail())->exists();

        $user = User::firstOrCreate(
            ['email' => $socialUser->getEmail()],
            [
                'name'      => $socialUser->getName() ?? $socialUser->getNickname(),
                'password'  => Hash::make(Str::random(32)),
                'is_active' => 1,
            ]
        );

        // 🔔 Admin notification — only for new social users
        if ($isNew) {
            AdminNotification::create([
                'type'    => 'new_user',
                'title'   => 'New Social Registration',
                'message' => "{$user->name} joined via {$provider}",
                'icon'    => 'user',
                'data'    => ['user_id' => $user->id, 'provider' => $provider],
            ]);
        }

        if ($user->is_active == 0) {
            return response()->json(['message' => 'Account disabled'], 403);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        $frontendUrl = env('FRONTEND_URL', config('app.url'));
        $redirectUrl = rtrim($frontendUrl, '/') . '/social-login?token=' . $token;

        return Redirect::to($redirectUrl);
    }

    // ========================
    // LOGOUT
    // ========================
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Logged out successfully']);
    }

    // ========================
    // PROFILE
    // ========================
    public function profile(Request $request)
    {
        return response()->json([
            'status' => 'success',
            'user'   => $request->user(),
        ]);
    }

    // ========================
    // UPDATE PROFILE
    // ========================
    public function updateProfile(Request $request)
    {
        $user = $request->user();

        $request->validate([
            'name'     => 'required|string|max:255',
            'email'    => 'required|email|unique:users,email,' . $user->id,
            'username' => 'nullable|string|max:50|unique:users,username,' . $user->id,
            'phone'    => 'nullable|string|max:30',
            'avatar'   => 'nullable|image|max:2048',
        ]);

        $data = $request->only(['name', 'email', 'username', 'phone']);

        if ($request->hasFile('avatar')) {
            if ($user->avatar) {
                Storage::disk('public')->delete($user->avatar);
            }
            $data['avatar'] = $request->file('avatar')->store('avatars', 'public');
        }

        $user->update($data);

        return response()->json([
            'status' => 'success',
            'user'   => $user->fresh(),
        ]);
    }

    // ========================
    // FORGOT PASSWORD
    // ========================
    public function forgot(Request $request)
    {
        $request->validate([
            'email' => 'required|email|exists:users,email',
        ]);

        $user = User::where('email', $request->email)->first();

        $code = rand(100000, 999999);
        $user->reset_code = $code;
        $user->save();

        Mail::to($user->email)->send(new ResetCodeMail($code));

        return response()->json(['message' => 'Code sent successfully']);
    }

    // ========================
    // VERIFY CODE
    // ========================
    public function verifyCode(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'code'  => 'required',
        ]);

        $user = User::where('email', $request->email)->first();

        if ($user->reset_code != $request->code) {
            return response()->json(['message' => 'Invalid code'], 400);
        }

        return response()->json(['message' => 'Code verified']);
    }

    // ========================
    // RESET PASSWORD
    // ========================
    public function reset(Request $request)
    {
        $request->validate([
            'email'    => 'required|email',
            'code'     => 'required',
            'password' => 'required|min:6|confirmed',
        ]);

        $user = User::where('email', $request->email)->first();

        if ($user->reset_code != $request->code) {
            return response()->json(['message' => 'Invalid code'], 400);
        }

        $user->password   = Hash::make($request->password);
        $user->reset_code = null;
        $user->save();

        return response()->json(['message' => 'Password updated successfully']);
    }
}