<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application; // Pastikan 'use' ini ada
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// --- TAMBAHKAN BLOK INI KEMBALI ---
// Ini adalah rute untuk halaman utama (http://127.0.0.1:8000/)
Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});
// ---------------------------------


// Rute untuk USER (role: user)
Route::middleware(['auth', 'verified', 'role:user'])->group(function () {
    Route::get('/dashboard', function () {
        return Inertia::render('User/Dashboard');
    })->name('dashboard');
});

// Rute untuk ADMIN (role: admin)
Route::middleware(['auth', 'verified', 'role:admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/dashboard', function () {
        return Inertia::render('Admin/Dashboard');
    })->name('dashboard');

    // Tambahkan rute admin lainnya di sini
    // contoh: Route::get('/users', [UserController::class, 'index'])->name('users.index');
});

// Rute Profile (bisa diakses keduanya)
Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';