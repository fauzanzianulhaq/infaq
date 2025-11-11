<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Siswa;
use App\Models\User;
use App\Models\Laporan;
use App\Models\Pembayaran;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Redirect;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\Storage;

class SiswaController extends Controller
{
    /**
     * Menampilkan daftar semua siswa.
     */
    public function index()
    {
        $siswas = Siswa::latest()->paginate(10);
        
        // Ambil daftar Guru untuk form laporan per kelas
        $gurus = User::where('role', 'user')->get(['id', 'name']);
        
        // Ambil semua kelas yang ada
        $semuaKelas = Siswa::distinct()->pluck('kelas')->sort()->values();
        
        return Inertia::render('Admin/SiswaIndex', [
            'siswas' => $siswas,
            'gurus' => $gurus,
            'semuaKelas' => $semuaKelas,
            'flash' => [
                'success' => session('success'),
                'error' => session('error'),
            ]
        ]);
    }

    /**
     * Menampilkan form untuk membuat siswa baru.
     */
    public function create()
    {
        return Inertia::render('Admin/SiswaCreate');
    }

    /**
     * Menyimpan siswa baru ke database.
     */
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'nama_lengkap' => 'required|string|max:255',
            'kelas' => 'required|string|max:100',
            'alamat' => 'required|string',
            'nama_wali' => 'required|string|max:255',
            'no_telp_wali' => 'required|string|max:20',
        ]);

        Siswa::create($validatedData);

        return Redirect::route('admin.siswa.index')->with('success', 'Siswa berhasil ditambahkan.');
    }

    /**
     * Menampilkan detail satu siswa & status tunggakan.
     */
    public function show(Siswa $siswa, Request $request)
    {
        $tahunSekarang = $request->input('tahun', date('Y'));
        $pembayaranSiswa = $siswa->pembayaran()
                                ->where('tahun_bayar', $tahunSekarang)
                                ->get()
                                ->keyBy('bulan_bayar'); 
        $statusPembayaran = [];
        $namaBulan = [ 1 => "Januari", 2 => "Februari", 3 => "Maret", 4 => "April", 5 => "Mei", 6 => "Juni", 7 => "Juli", 8 => "Agustus", 9 => "September", 10 => "Oktober", 11 => "November", 12 => "Desember" ];
        for ($bulan = 1; $bulan <= 12; $bulan++) {
            $status = 'Tunggakan';
            $dataPembayaran = null;
            if ($pembayaranSiswa->has($bulan)) {
                $status = 'Lunas';
                $dataPembayaran = $pembayaranSiswa->get($bulan);
            }
            $statusPembayaran[] = [
                'bulan' => $namaBulan[$bulan],
                'bulan_num' => $bulan,
                'status' => $status,
                'detail' => $dataPembayaran
            ];
        }

        $gurus = User::where('role', 'user')->get(['id', 'name']);
        $semuaKelas = Siswa::distinct()->pluck('kelas')->sort()->values();

        return Inertia::render('Admin/SiswaShow', [
            'siswa' => $siswa,
            'statusPembayaran' => $statusPembayaran,
            'tahunDipilih' => (int)$tahunSekarang,
            'gurus' => $gurus,
            'semuaKelas' => $semuaKelas,
            'flash' => [
                'success' => session('success'),
                'error' => session('error'),
            ]
        ]);
    }

    /**
     * METHOD BARU: Kirim Laporan Per Kelas - DIPERBAIKI
     */
    public function kirimLaporanPerKelas(Request $request)
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'tahun' => 'required|integer',
            'kelas' => 'required|string',
        ]);

        $guru = User::findOrFail($validated['user_id']);
        $kelas = $validated['kelas'];
        $tahun = $validated['tahun'];

        // 1. Ambil semua siswa di kelas tersebut
        $siswaKelas = Siswa::where('kelas', $kelas)->get();

        // 2. Kumpulkan data untuk laporan - DIPERBAIKI
        $laporanData = [
            'kelas' => $kelas,
            'tahun' => $tahun,
            'guru' => $guru,
            'data_siswa' => [],
            'ringkasan' => [
                'total_siswa' => $siswaKelas->count(), // TAMBAHKAN INI
                'total_pembayaran' => 0,
                'siswa_sudah_bayar' => 0,
                'siswa_belum_bayar' => 0,
            ]
        ];

        foreach ($siswaKelas as $siswa) {
            $pembayaranSiswa = $siswa->pembayaran()
                ->where('tahun_bayar', $tahun)
                ->get();

            $totalBayarSiswa = $pembayaranSiswa->sum('jumlah_bayar');
            $status = $pembayaranSiswa->count() > 0 ? 'Sudah Bayar' : 'Belum Bayar';

            $laporanData['data_siswa'][] = [
                'nama' => $siswa->nama_lengkap,
                'pembayaran' => $pembayaranSiswa,
                'total_bayar' => $totalBayarSiswa,
                'status' => $status,
            ];

            // Update ringkasan
            $laporanData['ringkasan']['total_pembayaran'] += $totalBayarSiswa;
            if ($pembayaranSiswa->count() > 0) {
                $laporanData['ringkasan']['siswa_sudah_bayar']++;
            } else {
                $laporanData['ringkasan']['siswa_belum_bayar']++;
            }
        }

        // 3. Generate PDF Laporan Per Kelas
        $pdf = Pdf::loadView('pdf.laporan-siswa', $laporanData);
        
        // 4. Buat nama file
        $namaFile = 'laporan-siswa-' . $kelas . '-' . $tahun . '-' . time() . '.pdf';
        $path = 'laporans/' . $namaFile;

        // 5. Simpan file ke storage
        Storage::disk('public')->makeDirectory('laporans');
        Storage::disk('public')->put($path, $pdf->output());

        // 6. Simpan ke tabel laporan - DIPERBAIKI
        Laporan::create([
            'user_id' => $guru->id,
            'siswa_id' => null, // TAMBAHKAN INI - karena laporan per kelas
            'kelas' => $kelas,
            'nama_file' => $namaFile,
            'file_path' => $path,
            'tahun' => $tahun,
            'is_read' => false,
            'tipe' => 'per_kelas',
        ]);

        return Redirect::back()
            ->with('success', "Laporan kelas {$kelas} tahun {$tahun} berhasil dikirim ke {$guru->name}");
    }

    // ... (method edit, update, destroy, dan sendReportToUser tetap sama) ...
}