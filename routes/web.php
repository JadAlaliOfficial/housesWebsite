<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');


Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';


//tests

Route::get('/c', function () {
    return Inertia::render('welcome_c', [
        
        // 'rightCardContent' => 'First step',

        'rightCardContent' => 'Second step',

        // 'rightCardContent' => 'Third step',

        // 'rightCardContent' => 'Fourth step',

        // 'rightCardContent' => 'Fifth step',

        // 'rightCardContent' => 'Final step',

        'status' => 'not requested',

    ]);
})->name('home_c');
