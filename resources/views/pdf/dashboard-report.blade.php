<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Laporan Dashboard Sistem Infaq</title>
    <style>
        body { 
            font-family: Arial, sans-serif; 
            margin: 20px; 
            line-height: 1.6;
            color: #333;
        }
        .header { 
            text-align: center; 
            margin-bottom: 30px; 
            border-bottom: 2px solid #333; 
            padding-bottom: 10px; 
        }
        .stats-grid { 
            display: grid; 
            grid-template-columns: repeat(3, 1fr); 
            gap: 15px; 
            margin-bottom: 30px; 
        }
        .stat-card { 
            border: 1px solid #ddd; 
            padding: 15px; 
            border-radius: 5px; 
            text-align: center;
            background: #f9f9f9;
        }
        .table { 
            width: 100%; 
            border-collapse: collapse; 
            margin-bottom: 20px; 
            font-size: 12px;
        }
        .table th, .table td { 
            border: 1px solid #ddd; 
            padding: 8px; 
            text-align: left; 
        }
        .table th { 
            background-color: #f5f5f5; 
            font-weight: bold;
        }
        .total { 
            font-weight: bold; 
            color: #059669; 
        }
        .section { 
            margin-bottom: 30px; 
        }
        .footer {
            margin-top: 40px; 
            padding-top: 20px; 
            border-top: 1px solid #ddd; 
            text-align: center; 
            color: #666;
            font-size: 12px;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>Laporan Dashboard Sistem Infaq</h1>
        <p>Periode: {{ $tanggal_laporan }}</p>
    </div>

    <div class="section">
        <h2>📊 Statistik Utama</h2>
        <div class="stats-grid">
            <div class="stat-card">
                <h3>Pemasukan Bulan Ini</h3>
                <p class="total">Rp {{ number_format($ringkasan['pemasukan_bulan_ini'], 0, ',', '.') }}</p>
            </div>
            <div class="stat-card">
                <h3>Pemasukan Tahun Ini</h3>
                <p class="total">Rp {{ number_format($ringkasan['pemasukan_tahun_ini'], 0, ',', '.') }}</p>
            </div>
            <div class="stat-card">
                <h3>Total Siswa</h3>
                <p>{{ $ringkasan['total_siswa'] }} siswa</p>
            </div>
            <div class="stat-card">
                <h3>Total Guru</h3>
                <p>{{ $ringkasan['total_guru'] }} guru</p>
            </div>
            <div class="stat-card">
                <h3>Laporan Terkirim</h3>
                <p>{{ $ringkasan['laporan_terkirim'] }} laporan</p>
            </div>
            <div class="stat-card">
                <h3>Transaksi Bulan Ini</h3>
                <p>{{ $ringkasan['transaksi_bulan_ini'] }} transaksi</p>
            </div>
        </div>
    </div>

    <div class="section">
        <h2>📈 Trend Pemasukan 6 Bulan Terakhir</h2>
        <table class="table">
            <thead>
                <tr>
                    <th>Bulan</th>
                    <th>Total Pemasukan</th>
                </tr>
            </thead>
            <tbody>
                @foreach($grafikBulanan as $item)
                <tr>
                    <td>{{ $item['bulan'] }}</td>
                    <td class="total">Rp {{ number_format($item['total'], 0, ',', '.') }}</td>
                </tr>
                @endforeach
            </tbody>
        </table>
    </div>

    <div class="section">
        <h2>🏫 Pemasukan per Kelas ({{ $tahun }})</h2>
        <table class="table">
            <thead>
                <tr>
                    <th>Kelas</th>
                    <th>Total Pemasukan</th>
                </tr>
            </thead>
            <tbody>
                @foreach($pemasukanPerKelas as $item)
                <tr>
                    <td>Kelas {{ $item['kelas'] }}</td>
                    <td class="total">Rp {{ number_format($item['total'], 0, ',', '.') }}</td>
                </tr>
                @endforeach
            </tbody>
        </table>
    </div>

    <div class="section">
        <h2>💳 Transaksi Terbaru</h2>
        <table class="table">
            <thead>
                <tr>
                    <th>Siswa</th>
                    <th>Kelas</th>
                    <th>Jumlah</th>
                    <th>Periode</th>
                    <th>Tanggal</th>
                </tr>
            </thead>
            <tbody>
                @foreach($transaksiTerbaru as $transaksi)
                <tr>
                    <td>{{ $transaksi['siswa_nama'] }}</td>
                    <td>{{ $transaksi['kelas'] }}</td>
                    <td class="total">Rp {{ number_format($transaksi['jumlah_bayar'], 0, ',', '.') }}</td>
                    <td>{{ $transaksi['bulan_bayar'] }} {{ $transaksi['tahun_bayar'] }}</td>
                    <td>{{ $transaksi['tanggal'] }}</td>
                </tr>
                @endforeach
            </tbody>
        </table>
    </div>

    <div class="footer">
        <p>Dibuat secara otomatis oleh Sistem Infaq Sekolah</p>
        <p>{{ $tanggal_laporan }}</p>
    </div>
</body>
</html>