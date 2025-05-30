<?php

namespace App\Http\Controllers;

use App\Models\ThemeSetting;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ThemeController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/ThemeCustomizer');
    }

    public function update(Request $request)
    {
        $data = $request->validate([
            'light' => 'required|array',
            'dark'  => 'required|array',
        ]);

        ThemeSetting::first()->update($data);

        return back()->with('success', 'Theme updated.');
    }
}
