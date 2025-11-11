<!DOCTYPE html>
<html>
<head>
    <title>Laporan Infaq Kelas {{ $kelas }} - {{ $tahun }}</title>
    <style>
        body { font-family: Arial, sans-serif; font-size: 12px; }
        .header { text-align: center; margin-bottom: 20px; }
        .table { width: 100%; border-collapse: collapse; margin-top: 10px; }
        .table th, .table td { border: 1px solid #ddd; padding: 6px; text-align: left; }
        .table th { background-color: #f2f2f2; }
        .ringkasan { background: #f9f9f9; padding: 10px; margin: 15px 0; border-radius: 5px; }
        .ringkasan h3 { margin-top: 0; }
        .footer { text-align: center; margin-top: 20px; font-size: 10px; color: #666; }
    </style>
</head>
<body>
    <div class="header">
        <h1>LAPORAN INFAQ KELAS {{ $kelas }}</h1>
        <h2>Tahun {{ $tahun }}</h2>
        <p>Ditujukan untuk: {{ $guru->name }}</p>
    </div>

    <div class="ringkasan">
    <h3>Ringkasan Kelas</h3>
    <p><strong>Total Siswa:</strong> {{ $ringkasan['total_siswa'] ?? 0 }}</p>
    <p><strong>Siswa Sudah Bayar:</strong> {{ $ringkasan['siswa_sudah_bayar'] ?? 0 }}</p>
    <p><strong>Siswa Belum Bayar:</strong> {{ $ringkasan['siswa_belum_bayar'] ?? 0 }}</p>
    <p><strong>Total Pembayaran:</strong> Rp {{ number_format($ringkasan['total_pembayaran'] ?? 0, 0, ',', '.') }}</p>
</div>

    <table class="table">
        <thead>
            <tr>
                <th>No</th>
                <th>Nama Siswa</th>
                <th>Status</th>
                <th>Total Bayar</th>
                <th>Detail Pembayaran</th>
            </tr>
        </thead>
        <tbody>
            @foreach($data_siswa as $index => $siswa)
            <tr>
                <td>{{ $index + 1 }}</td>
                <td>{{ $siswa['nama'] }}</td>
                <td>{{ $siswa['status'] }}</td>
                <td>Rp {{ number_format($siswa['total_bayar'], 0, ',', '.') }}</td>
                <td>
                    @if($siswa['pembayaran']->count() > 0)
                        @foreach($siswa['pembayaran'] as $pembayaran)
                            Bulan {{ $pembayaran->bulan_bayar }}: Rp {{ number_format($pembayaran->jumlah_bayar, 0, ',', '.') }}<br>
                        @endforeach
                    @else
                        -
                    @endif
                </td>
            </tr>
            @endforeach
        </tbody>
    </table>

    <div class="footer">
        <p>Dicetak pada: {{ date('d/m/Y H:i') }}</p>
    </div>
</body>
</html>