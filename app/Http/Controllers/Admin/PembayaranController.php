<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Pembayaran;
use App\Models\Siswa; // <-- Import Siswa
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Redirect;

class PembayaranController extends Controller
{
    /**
     * Menampilkan halaman "Buku Kas" Infaq (Menu Kelola Infaq).
     */
    public function index()
    {
        // Ambil semua pembayaran, urutkan dari terbaru
        // 'with('siswa')' => Eager loading, ambil data siswa terkait agar efisien
        $pembayarans = Pembayaran::with('siswa')
                            ->latest('tanggal_bayar')
                            ->paginate(20); // Kita gunakan paginasi

        return Inertia::render('Admin/InfaqIndex', [ // Sesuai struktur flat
            'pembayarans' => $pembayarans,
            'flash' => session('success') ? ['success' => session('success')] : (session('error') ? ['error' => session('error')] : []),
        ]);
    }

    /**
     * Menyimpan data pembayaran baru DARI HALAMAN DETAIL SISWA.
     * Ini adalah CREATE (C) dari CRUD Infaq.
     */
    public function store(Request $request, Siswa $siswa)
    {
        $validatedData = $request->validate([
            'jumlah_bayar' => 'required|integer|min:1',
            'bulan_bayar'  => 'required|integer|min:1|max:12',
            'tahun_bayar'  => 'required|integer|min:2020|max:2030',
            'tanggal_bayar' => 'required|date',
            'keterangan' => 'nullable|string|max:255',
        ]);
        
        // Cek dulu apakah dia sudah bayar untuk bulan/tahun itu?
        $sudahBayar = $siswa->pembayaran()
                           ->where('bulan_bayar', $validatedData['bulan_bayar'])
                           ->where('tahun_bayar', $validatedData['tahun_bayar'])
                           ->exists();
                           
        if($sudahBayar) {
            // Jika sudah bayar, kembalikan dengan error
            return Redirect::route('admin.siswa.show', $siswa->id)
                             ->with('error', 'Siswa sudah lunas untuk bulan ini.');
        }

        // Jika belum, buat catatan pembayaran baru
        $siswa->pembayaran()->create($validatedData);
        
        // Arahkan kembali ke halaman detail siswa dengan pesan sukses
        return Redirect::route('admin.siswa.show', $siswa->id)
                         ->with('success', 'Pembayaran berhasil dicatat.');
    }

    /**
     * Menampilkan form edit untuk pembayaran (dari Menu Kelola Infaq).
     */
    public function edit(Pembayaran $pembayaran)
    {
        return Inertia::render('Admin/InfaqEdit', [
            'pembayaran' => $pembayaran
        ]);
    }

    /**
     * Update data pembayaran.
     */
    public function update(Request $request, Pembayaran $pembayaran)
    {
        $validatedData = $request->validate([
            'jumlah_bayar' => 'required|integer|min:1',
            'bulan_bayar'  => 'required|integer|min:1|max:12',
            'tahun_bayar'  => 'required|integer|min:2020|max:2030',
            'tanggal_bayar' => 'required|date',
            'keterangan' => 'nullable|string|max:255',
        ]);
        
        // Cek duplikat
        $sudahBayar = Pembayaran::where('siswa_id', $pembayaran->siswa_id)
                           ->where('bulan_bayar', $validatedData['bulan_bayar'])
                           ->where('tahun_bayar', $validatedData['tahun_bayar'])
                           ->where('id', '!=', $pembayaran->id) // Cek data lain
                           ->exists();
                           
        if($sudahBayar) {
            return back()->with('error', 'Siswa sudah ada catatan lunas untuk bulan/tahun tersebut.');
        }
        
        $pembayaran->update($validatedData);
        
        return Redirect::route('admin.infaq.index')
                         ->with('success', 'Data pembayaran berhasil diupdate.');
    }

    /**
     * Hapus data pembayaran.
     */
    public function destroy(Pembayaran $pembayaran)
    {
        $pembayaran->delete();
        
        return Redirect::route('admin.infaq.index')
                         ->with('success', 'Data pembayaran berhasil dihapus.');
    }
}