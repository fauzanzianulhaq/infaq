<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Providers\RouteServiceProvider;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Inertia\Response;

class AuthenticatedSessionController extends Controller
{
    /**
     * Display the login view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Login', [
            'canResetPassword' => Route::has('password.request'),
            'status' => session('status'),
        ]);
    }

    /**
     * Handle an incoming authentication request.
     */
    public function store(LoginRequest $request): RedirectResponse
    {
        $request->authenticate();

        $request->session()->regenerate();

        // --- PERBAIKAN DIMULAI DI SINI ---

        // 1. Dapatkan data user yang baru saja login
        $user = $request->user();

        // 2. Cek rolenya
        if ($user->role === 'admin') {
            // 3. Jika admin, arahkan ke admin.dashboard
            return redirect()->intended(route('admin.dashboard'));
        }

        // 4. Jika bukan admin (role 'user'), arahkan ke dashboard biasa
        return redirect()->intended(route('dashboard'));

        // --- PERBAIKAN SELESAI ---

        // Baris asli Anda dihapus (yang ini):
        // return redirect()->intended(route('dashboard', absolute: false));
    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): RedirectResponse
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();

        $request->session()->regenerateToken();

        return redirect('/');
    }
}
