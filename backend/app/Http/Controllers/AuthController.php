<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
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

        $token = $user->createToken('auth_token')->plainTextToken;

        $user->makeHidden(['password']);

        return response()->json([
            'status' => 'success',
            'user' => $user,
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
        ]);

        $token = $user->createToken('auth_token')->plainTextToken;

        $user->makeHidden(['password']);

        return response()->json([
            'status' => 'success',
            'user' => $user,
            'token' => $token
        ]);
    }

    // ========================
    // SOCIAL LOGIN
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
            'provider' => $provider,
            'url' => $url,
        ]);
    }

    public function socialCallback(Request $request, $provider)
    {
        $providers = ['google', 'facebook', 'linkedin', 'twitter'];

        if (!in_array($provider, $providers)) {
            return response()->json(['message' => 'Unsupported provider'], 404);
        }

        try {
            $socialUser = Socialite::driver($provider)->stateless()->user();
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Unable to authenticate with ' . $provider,
                'error' => $e->getMessage(),
            ], 422);
        }

        if (! $socialUser->getEmail()) {
            return response()->json([
                'message' => 'Email not provided by ' . $provider,
            ], 422);
        }

        $user = User::firstOrCreate(
            ['email' => $socialUser->getEmail()],
            [
                'name' => $socialUser->getName() ?? $socialUser->getNickname() ?? explode('@', $socialUser->getEmail())[0],
                'password' => Hash::make(Str::random(32)),
            ]
        );

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

        return response()->json([
            'message' => 'Logged out successfully'
        ]);
    }

    // ========================
    // PROFILE
    // ========================
    public function profile(Request $request)
    {
        $user = $request->user();
        $user->makeHidden(['password', 'remember_token']);

        return response()->json([
            'status' => 'success',
            'user' => $user,
        ]);
    }

    // ========================
    // UPDATE PROFILE
    // ========================
    public function updateProfile(Request $request)
    {
        $user = $request->user();

        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . $user->id,
            'username' => 'nullable|string|max:50|unique:users,username,' . $user->id,
            'phone' => 'nullable|string|max:30',
            'avatar' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
        ]);

        $profileData = $request->only(['name', 'email', 'username', 'phone']);

        if ($request->hasFile('avatar')) {
            if ($user->avatar && Storage::disk('public')->exists($user->avatar)) {
                Storage::disk('public')->delete($user->avatar);
            }

            $avatarPath = $request->file('avatar')->store('avatars', 'public');
            $profileData['avatar'] = $avatarPath;
        }

        $user->update($profileData);
        $user->refresh();
        $user->makeHidden(['password', 'remember_token']);

        return response()->json([
            'status' => 'success',
            'user' => $user,
        ]);
    }

    // ========================
    // FORGOT PASSWORD (SEND CODE)
    // ========================
    public function forgot(Request $request)
    {
        $request->validate([
            'email' => 'required|email|exists:users,email'
        ]);

        $code = rand(100000, 999999);

        $user = User::where('email', $request->email)->first();

        $user->reset_code = $code;
        $user->save();

        // 📩 Send Email
        Mail::to($user->email)->send(new ResetCodeMail($code));

        return response()->json([
            'message' => 'Code sent successfully'
        ]);
    }

    // ========================
    // VERIFY RESET CODE
    // ========================
    public function verifyCode(Request $request)
    {
        $request->validate([
            'email' => 'required|email|exists:users,email',
            'code' => 'required',
        ]);

        $user = User::where('email', $request->email)->first();

        if ($user->reset_code != $request->code) {
            return response()->json([
                'message' => 'Invalid code'
            ], 400);
        }

        return response()->json([
            'message' => 'Code verified successfully'
        ]);
    }

    // ========================
    // RESET PASSWORD
    // ========================
    public function reset(Request $request)
    {
        $request->validate([
            'email' => 'required|email|exists:users,email',
            'code' => 'required',
            'password' => 'required|min:6|confirmed'
        ]);

        $user = User::where('email', $request->email)->first();

        if ($user->reset_code != $request->code) {
            return response()->json([
                'message' => 'Invalid code'
            ], 400);
        }

        $user->password = Hash::make($request->password);
        $user->reset_code = null;
        $user->save();

        return response()->json([
            'message' => 'Password updated successfully'
        ]);
    }
}