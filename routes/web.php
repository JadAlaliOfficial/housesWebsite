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
        'leftCardImage' => [
            asset('storage/Group_1.png'),
            asset('storage/Group_2.png'),
            asset('storage/Group_3.png'),
            asset('storage/Group_4.png'),
            asset('storage/Group_5.png')
        ],
        // 'rightCardContent' => 'First step',

        // 'rightCardContent' => 'Second step',

        // 'rightCardContent' => 'Third step',

        // 'rightCardContent' => 'Fourth step',

        'rightCardContent' => 'Fifth step',

        // 'rightCardContent' => 'Final step',

    ]);
})->name('home_c');
