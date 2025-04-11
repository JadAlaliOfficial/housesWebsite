<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Auth;
class CheckUserStage
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Check if user is authenticated
        if (!Auth::check()) {
            return redirect()->route('login');
        }

        // Check if user's stage is 0 (admin)
        if (Auth::user()->stage != 0) {
            // Redirect to home or another appropriate page for non-admin users
            return redirect()->route('home')->with('error', 'Only administrators can access the dashboard.');
        }

        return $next($request);
    }
}
