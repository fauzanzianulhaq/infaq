<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use App\Models\Laporan;
use Illuminate\Support\Facades\Storage;

class DashboardController extends Controller
{
    public function index()
{
    $currentUser = Auth::user();

    $laporans = Laporan::where('user_id', $currentUser->id)
                    ->with('siswa')
                    ->latest()
                    ->paginate(10);

    $unreadCount = Laporan::where('user_id', $currentUser->id)
                        ->where('is_read', false)
                        ->count();

    return Inertia::render('User/Dashboard', [
        'laporans' => $laporans,
        'unreadCount' => $unreadCount,
    ]);
}
    public function downloadLaporan(Laporan $laporan)
    {
        if (Auth::id() !== $laporan->user_id) {
            abort(403, 'Akses ditolak.');
        }

        $path = $laporan->file_path;
        if (!Storage::disk('public')->exists($path)) {
            abort(404, 'File tidak ditemukan.');
        }

        $laporan->update(['is_read' => true]);

        return Storage::disk('public')->download($path, $laporan->nama_file);
    }
}