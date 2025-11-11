<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia; // <-- Pastikan import Inertia
use Illuminate\Support\Facades\Hash; // <-- Pastikan import Hash
use Illuminate\Support\Facades\Redirect; // <-- Pastikan import Redirect

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // Ambil semua user yang rolenya 'user' (guru)
        $users = User::where('role', 'user')->latest()->paginate(10);
        
        return Inertia::render('Admin/UserIndex', [ // Sesuai struktur flat
            'users' => $users,
            'flash' => session('success') ? ['success' => session('success')] : [],
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Admin/UserCreate'); // Sesuai struktur flat
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed', // 'confirmed' akan cek 'password_confirmation'
        ]);

        User::create([
            'name' => $validatedData['name'],
            'email' => $validatedData['email'],
            'password' => Hash::make($validatedData['password']),
            'role' => 'user', // Otomatis set sebagai 'user' (guru)
        ]);

        return Redirect::route('admin.users.index')->with('success', 'User (Guru) berhasil ditambahkan.');
    }

    /**
     * Display the specified resource.
     */
    public function show(User $user)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(User $user)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, User $user)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(User $user)
    {
        $user->delete();
        return Redirect::route('admin.users.index')->with('success', 'User (Guru) berhasil dihapus.');
    }
}