<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\Carbon;
use Inertia\Inertia;
use Inertia\Response;

class TemporaryLinkController extends Controller
{
    public function generateResetLink(Request $request)
    {
        $expiresAt = Carbon::now()->addHours(3); // 3 hours expiry
        $temporaryUrl = URL::temporarySignedRoute(
            'password.request.temp',
            $expiresAt
        );

        return response()->json(['url' => $temporaryUrl]);
    }

    public function showResetForm(Request $request)
    {
        if (! $request->hasValidSignature()) {
            abort(403, 'Link expired or invalid.');
        }

        return Inertia::render('auth/forgot-password', [
            'status' => $request->session()->get('status'),
        ]);
    }

    public function generateRegisterLink(Request $request)
    {
        $expiresAt = Carbon::now()->addHours(3);
        $temporaryUrl = URL::temporarySignedRoute(
            'register.temp',
            $expiresAt
        );

        return response()->json(['url' => $temporaryUrl]);
    }

    public function showRegisterForm(Request $request)
    {
        if (! $request->hasValidSignature()) {
            abort(403, 'Link expired or invalid.');
        }

        return Inertia::render('auth/register');
    }
}
