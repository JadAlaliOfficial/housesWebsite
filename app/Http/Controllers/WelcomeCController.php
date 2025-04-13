<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
class WelcomeCController extends Controller
{
    public function index()
    {
        return Inertia::render('welcome', [
            'user' => Auth::user() // Pass the authenticated user
        ]);
    }
}
