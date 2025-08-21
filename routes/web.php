<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\WelcomeCController;
use App\Http\Controllers\StageController;
use App\Http\Controllers\TemporaryLinkController;
use App\Http\Middleware\HandleInertiaRequests;
use App\Http\Controllers\ThemeController;


Route::middleware(['auth', 'admin'])->group(function () {
    // Add this route or replace the existing dashboard route
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::post('/users', [DashboardController::class, 'store'])->name('users.store');
    Route::put('/users/{id}', [DashboardController::class, 'update'])->name('users.update');
    Route::delete('/users/{id}', [DashboardController::class, 'destroy'])->name('users.destroy');
    Route::resource('stages', StageController::class);
    Route::get('/admin/theme', [ThemeController::class, 'index'])
    ->name('admin.theme');
    Route::post('/admin/theme', [ThemeController::class, 'update'])->name('admin.theme.update');
    Route::post('/admin/upload-pdf',[DashboardController::class, 'upload'])->name('admin.trusted-partners.pdf.upload');
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';

// Generate temp link
Route::post('/temporary/reset-link', [TemporaryLinkController::class, 'generateResetLink'])
    ->name('temporary.reset-link');

// Handle signed link
Route::get('/temporary/forgot-password', [TemporaryLinkController::class, 'showResetForm'])
    ->name('password.request.temp');

// Generate temp registration link (JSON)
Route::post('/temporary/register-link', [TemporaryLinkController::class, 'generateRegisterLink'])
    ->name('temporary.register-link');

// Show registration form via signed URL
Route::get('/temporary/register', [TemporaryLinkController::class, 'showRegisterForm'])
    ->name('register.temp');
//tests
Route::middleware(['auth'])->group(function () {
    Route::get('/', [WelcomeCController::class, 'index'])->name('home');
Route::post('/users/{id}/move-to-next-stage', [DashboardController::class, 'moveToNextStage'])->name('users.moveToNextStage');
Route::post('/users/{id}/move-to-stage', [DashboardController::class, 'moveToStage'])->name('users.moveToStage');
Route::post('/users/{id}/handle-button', [DashboardController::class, 'handleButtonClick'])->name('users.handleButtonClick');
});

