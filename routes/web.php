<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// IMPORT CONTROLLER - GUNAKAN USE STATEMENT YANG BENAR
use App\Http\Controllers\Admin\SiswaController;
use App\Http\Controllers\Admin\PembayaranController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\User\DashboardController as UserDashboardController;

// Halaman Utama (Welcome)
Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

// Rute untuk USER (role: user)
Route::middleware(['auth', 'verified', 'role:user'])->group(function () {
    
    Route::get('/dashboard', [UserDashboardController::class, 'index'])->name('dashboard');
    Route::get('/laporan/{laporan}/download', [UserDashboardController::class, 'downloadLaporan'])
           ->name('user.laporan.download');
});

// Rute untuk ADMIN (role: admin)
Route::middleware(['auth', 'verified', 'role:admin'])->prefix('admin')->name('admin.')->group(function () {
    
    // GUNAKAN CONTROLLER YANG SUDAH DIPERBAIKI
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    // Route Export PDF - PASTIKAN INI ADA
    Route::get('/dashboard/export-pdf', [DashboardController::class, 'exportPdf'])->name('admin.dashboard.export-pdf');
    Route::get('/dashboard/export-data', [DashboardController::class, 'exportData'])->name('admin.dashboard.export-data');
    // Rute resource
    Route::resource('siswa', SiswaController::class);
    Route::resource('users', UserController::class);
    Route::resource('infaq', PembayaranController::class)->except([
        'create', 'store', 'show'
    ])->parameters(['infaq' => 'pembayaran']);

    // Rute lainnya
    Route::post('siswa/{siswa}/pembayaran', [PembayaranController::class, 'store'])
           ->name('siswa.pembayaran.store');
    Route::post('siswa/{siswa}/send-report', [SiswaController::class, 'sendReportToUser'])
           ->name('siswa.send-report');
    Route::post('laporan/kirim-per-kelas', [SiswaController::class, 'kirimLaporanPerKelas'])
           ->name('laporan.kirim-per-kelas');
});

// Rute Profile
Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::put('/password', [ProfileController::class, 'updatePassword'])->name('password.update'); // TAMBAH INI
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';