<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AdminMiddleware
{
    public function handle(Request $request, Closure $next): Response
    {
        $user = auth()->user();

        // Should never happen if auth:sanctum runs first,
        // but guard just in case.
        if (!$user) {
            return response()->json(['message' => 'Unauthenticated'], 401);
        }

        // Supports both: $user->role === 'admin'  (string column)
        //            and: $user->isAdmin()         (model method, if defined)
        $isAdmin = method_exists($user, 'isAdmin')
            ? $user->isAdmin()
            : $user->role === 'admin';

        if (!$isAdmin) {
            return response()->json(['message' => 'Forbidden. Admin access only.'], 403);
        }

        return $next($request);
    }
}