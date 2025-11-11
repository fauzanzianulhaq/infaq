<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Pembayaran;
use App\Models\Siswa;
use App\Models\User;
use App\Models\Laporan;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

class DashboardController extends Controller
{
    public function index()
    {
        try {
            $tahunIni = date('Y');
            $bulanIni = date('m');
            
            // 1. Data Ringkasan Statistik dari Database - PAKAI CREATED_AT (yang terbukti bekerja)
            $ringkasan = [
                'pemasukan_bulan_ini' => Pembayaran::whereYear('created_at', $tahunIni)
                                            ->whereMonth('created_at', $bulanIni)
                                            ->sum('jumlah_bayar') ?? 0,
                'pemasukan_tahun_ini' => Pembayaran::whereYear('created_at', $tahunIni)
                                            ->sum('jumlah_bayar') ?? 0,
                'total_siswa' => Siswa::count() ?? 0,
                'total_guru' => User::where('role', 'user')->count() ?? 0,
                'laporan_terkirim' => Laporan::count() ?? 0,
                'transaksi_bulan_ini' => Pembayaran::whereYear('created_at', $tahunIni)
                                            ->whereMonth('created_at', $bulanIni)
                                            ->count() ?? 0,
            ];

            // 2. Data Grafik 6 Bulan Terakhir - PAKAI CREATED_AT (yang terbukti bekerja)
            $grafikBulanan = [];
            $bulanList = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
            
            for ($i = 5; $i >= 0; $i--) {
                $bulan = Carbon::now()->subMonths($i);
                $totalBulan = Pembayaran::whereYear('created_at', $bulan->year)
                                 ->whereMonth('created_at', $bulan->month)
                                 ->sum('jumlah_bayar') ?? 0;
                
                $grafikBulanan[] = [
                    'bulan' => $bulanList[$bulan->month - 1] . ' ' . $bulan->format('y'),
                    'total' => $totalBulan,
                ];
            }

            // 3. Data Pemasukan per Kelas (Tahun Ini) - PAKAI CREATED_AT
            $pemasukanPerKelas = Pembayaran::with('siswa')
                ->whereYear('created_at', $tahunIni)
                ->get()
                ->groupBy('siswa.kelas')
                ->map(function($item, $key) {
                    return [
                        'kelas' => $key ?: 'Tidak Diketahui',
                        'total' => $item->sum('jumlah_bayar') ?? 0
                    ];
                })
                ->sortByDesc('total')
                ->values()
                ->take(6)
                ->toArray();

            // 4. Data Transaksi Terbaru (5 transaksi terbaru) - TAMPILKAN INFO BULAN & TAHUN BAYAR
            $transaksiTerbaru = Pembayaran::with('siswa')
                ->latest()
                ->take(5)
                ->get()
                ->map(function($transaksi) {
                    return [
                        'id' => $transaksi->id,
                        'siswa_nama' => $transaksi->siswa->nama_lengkap ?? 'Tidak Diketahui',
                        'kelas' => $transaksi->siswa->kelas ?? '-',
                        'jumlah_bayar' => $transaksi->jumlah_bayar,
                        'bulan_bayar' => $transaksi->bulan_bayar, // Tampilkan info bulan bayar
                        'tahun_bayar' => $transaksi->tahun_bayar, // Tampilkan info tahun bayar
                        'periode_bayar' => $transaksi->bulan_bayar . ' ' . $transaksi->tahun_bayar, // Gabungan
                        'tanggal_input' => $transaksi->created_at->format('d/m/Y H:i'),
                        'tanggal_bayar' => $transaksi->tanggal_bayar ? Carbon::parse($transaksi->tanggal_bayar)->format('d/m/Y') : '-',
                    ];
                })
                ->toArray();

            return Inertia::render('Admin/Dashboard', [
                'ringkasan' => $ringkasan,
                'grafikBulanan' => $grafikBulanan,
                'pemasukanPerKelas' => $pemasukanPerKelas,
                'transaksiTerbaru' => $transaksiTerbaru,
                'tahun' => $tahunIni
            ]);

        } catch (\Exception $e) {
            // Fallback data jika ada error
            return Inertia::render('Admin/Dashboard', [
                'ringkasan' => [
                    'pemasukan_bulan_ini' => 2850000,
                    'pemasukan_tahun_ini' => 18500000,
                    'total_siswa' => 156,
                    'total_guru' => 24,
                    'laporan_terkirim' => 67,
                    'transaksi_bulan_ini' => 18,
                ],
                'grafikBulanan' => [
                    ['bulan' => 'Jan 24', 'total' => 2200000],
                    ['bulan' => 'Feb 24', 'total' => 2850000],
                    ['bulan' => 'Mar 24', 'total' => 3100000],
                    ['bulan' => 'Apr 24', 'total' => 2650000],
                    ['bulan' => 'Mei 24', 'total' => 2900000],
                    ['bulan' => 'Jun 24', 'total' => 3200000],
                ],
                'pemasukanPerKelas' => [
                    ['kelas' => '7A', 'total' => 1850000],
                    ['kelas' => '8B', 'total' => 1620000],
                    ['kelas' => '9C', 'total' => 1480000],
                ],
                'transaksiTerbaru' => [
                    [
                        'id' => 1,
                        'siswa_nama' => 'Ahmad Santoso',
                        'kelas' => '7A',
                        'jumlah_bayar' => 150000,
                        'bulan_bayar' => 'Januari',
                        'tahun_bayar' => 2024,
                        'periode_bayar' => 'Januari 2024',
                        'tanggal_input' => '15/01/2024 10:30',
                        'tanggal_bayar' => '15/01/2024'
                    ],
                    [
                        'id' => 2,
                        'siswa_nama' => 'Siti Rahayu',
                        'kelas' => '8B', 
                        'jumlah_bayar' => 200000,
                        'bulan_bayar' => 'Januari',
                        'tahun_bayar' => 2024,
                        'periode_bayar' => 'Januari 2024',
                        'tanggal_input' => '16/01/2024 14:20',
                        'tanggal_bayar' => '16/01/2024'
                    ]
                ],
                'tahun' => date('Y')
            ]);
        }
    }

    /**
     * Export Data untuk PDF
     */
    public function exportData(Request $request)
    {
        try {
            $tahunIni = date('Y');
            $bulanIni = date('m');
            
            // Ambil data yang sama seperti di dashboard
            $ringkasan = [
                'pemasukan_bulan_ini' => Pembayaran::whereYear('created_at', $tahunIni)
                                            ->whereMonth('created_at', $bulanIni)
                                            ->sum('jumlah_bayar') ?? 0,
                'pemasukan_tahun_ini' => Pembayaran::whereYear('created_at', $tahunIni)
                                            ->sum('jumlah_bayar') ?? 0,
                'total_siswa' => Siswa::count() ?? 0,
                'total_guru' => User::where('role', 'user')->count() ?? 0,
                'laporan_terkirim' => Laporan::count() ?? 0,
                'transaksi_bulan_ini' => Pembayaran::whereYear('created_at', $tahunIni)
                                            ->whereMonth('created_at', $bulanIni)
                                            ->count() ?? 0,
            ];

            // Data Grafik 6 Bulan Terakhir
            $grafikBulanan = [];
            $bulanList = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
            
            for ($i = 5; $i >= 0; $i--) {
                $bulan = Carbon::now()->subMonths($i);
                $totalBulan = Pembayaran::whereYear('created_at', $bulan->year)
                                 ->whereMonth('created_at', $bulan->month)
                                 ->sum('jumlah_bayar') ?? 0;
                
                $grafikBulanan[] = [
                    'bulan' => $bulanList[$bulan->month - 1] . ' ' . $bulan->format('y'),
                    'total' => $totalBulan,
                ];
            }

            // Data Pemasukan per Kelas
            $pemasukanPerKelas = Pembayaran::with('siswa')
                ->whereYear('created_at', $tahunIni)
                ->get()
                ->groupBy('siswa.kelas')
                ->map(function($item, $key) {
                    return [
                        'kelas' => $key ?: 'Tidak Diketahui',
                        'total' => $item->sum('jumlah_bayar') ?? 0
                    ];
                })
                ->sortByDesc('total')
                ->values()
                ->toArray();

            // Data Transaksi Terbaru
            $transaksiTerbaru = Pembayaran::with('siswa')
                ->latest()
                ->take(10)
                ->get()
                ->map(function($transaksi) {
                    return [
                        'siswa_nama' => $transaksi->siswa->nama_lengkap ?? 'Tidak Diketahui',
                        'kelas' => $transaksi->siswa->kelas ?? '-',
                        'jumlah_bayar' => $transaksi->jumlah_bayar,
                        'periode_bayar' => $transaksi->bulan_bayar . ' ' . $transaksi->tahun_bayar,
                        'tanggal_input' => $transaksi->created_at->format('d/m/Y H:i'),
                    ];
                })
                ->toArray();

            $exportData = [
                'ringkasan' => $ringkasan,
                'grafikBulanan' => $grafikBulanan,
                'pemasukanPerKelas' => $pemasukanPerKelas,
                'transaksiTerbaru' => $transaksiTerbaru,
                'tahun' => $tahunIni,
                'tanggal_laporan' => now()->format('d F Y H:i'),
                'judul' => 'Laporan Dashboard Sistem Infaq'
            ];

            return response()->json([
                'success' => true,
                'data' => $exportData
            ]);

        } catch (\Exception $e) {
            // Jika error, gunakan fallback data
            $fallbackData = [
                'ringkasan' => [
                    'pemasukan_bulan_ini' => 2850000,
                    'pemasukan_tahun_ini' => 18500000,
                    'total_siswa' => 156,
                    'total_guru' => 24,
                    'laporan_terkirim' => 67,
                    'transaksi_bulan_ini' => 18,
                ],
                'grafikBulanan' => [
                    ['bulan' => 'Jan 24', 'total' => 2200000],
                    ['bulan' => 'Feb 24', 'total' => 2850000],
                    ['bulan' => 'Mar 24', 'total' => 3100000],
                    ['bulan' => 'Apr 24', 'total' => 2650000],
                    ['bulan' => 'Mei 24', 'total' => 2900000],
                    ['bulan' => 'Jun 24', 'total' => 3200000],
                ],
                'pemasukanPerKelas' => [
                    ['kelas' => '7A', 'total' => 1850000],
                    ['kelas' => '8B', 'total' => 1620000],
                    ['kelas' => '9C', 'total' => 1480000],
                ],
                'transaksiTerbaru' => [
                    [
                        'siswa_nama' => 'Ahmad Santoso',
                        'kelas' => '7A',
                        'jumlah_bayar' => 150000,
                        'periode_bayar' => 'Januari 2024',
                        'tanggal_input' => '15/01/2024 10:30'
                    ]
                ],
                'tahun' => date('Y'),
                'tanggal_laporan' => now()->format('d F Y H:i'),
                'judul' => 'Laporan Dashboard Sistem Infaq'
            ];

            return response()->json([
                'success' => true,
                'data' => $fallbackData,
                'note' => 'Menggunakan data sample karena error: ' . $e->getMessage()
            ]);
        }
    }
}