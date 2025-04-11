<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\WelcomeCController;
Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');


Route::middleware(['auth', 'admin'])->group(function () {
    // Add this route or replace the existing dashboard route
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::post('/users', [DashboardController::class, 'store'])->name('users.store');
    Route::put('/users/{id}', [DashboardController::class, 'update'])->name('users.update');
    Route::delete('/users/{id}', [DashboardController::class, 'destroy'])->name('users.destroy');
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';


//tests
Route::middleware(['auth'])->group(function () {
    Route::get('/c', [WelcomeCController::class, 'index'])->name('home_c');
Route::post('/users/{id}/move-to-next-stage', [DashboardController::class, 'moveToNextStage'])->name('users.moveToNextStage');
Route::post('/users/{id}/move-to-stage', [DashboardController::class, 'moveToStage'])->name('users.moveToStage');
});

