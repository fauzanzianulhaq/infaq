<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Laporan Infaq Siswa</title>
    <style>
        body { 
            font-family: 'Helvetica', sans-serif;
            font-size: 12px;
            color: #333;
        }
        .container {
            width: 100%;
            margin: 0 auto;
        }
        .header {
            text-align: center;
            margin-bottom: 20px;
        }
        .header h1 {
            margin: 0;
            font-size: 24px;
        }
        .header p {
            margin: 0;
            font-size: 14px;
        }
        .profile-table {
            width: 100%;
            margin-bottom: 20px;
            border-collapse: collapse;
        }
        .profile-table td {
            padding: 8px;
            border: 1px solid #ddd;
        }
        .profile-table td:first-child {
            font-weight: bold;
            width: 150px;
            background-color: #f9f9f9;
        }
        .payment-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
        }
        .payment-table th, .payment-table td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
        }
        .payment-table th {
            background-color: #f2f2f2;
            text-align: center;
        }
        .status-lunas {
            color: green;
            font-weight: bold;
        }
        .status-tunggakan {
            color: red;
            font-weight: bold;
        }
        .text-center {
            text-align: center;
        }
        .text-right {
            text-align: right;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Laporan Infaq Siswa</h1>
            <p>Status Pembayaran Tahun: {{ $tahunDipilih }}</p>
        </div>

        <h3>Profil Siswa</h3>
        <table class="profile-table">
            <tr>
                <td>Nama Lengkap</td>
                <td>{{ $siswa->nama_lengkap }}</td>
            </tr>
            <tr>
                <td>Kelas</td>
                <td>{{ $siswa->kelas }}</td>
            </tr>
            <tr>
                <td>Nama Wali</td>
                <td>{{ $siswa->nama_wali }}</td>
            </tr>
            <tr>
                <td>No. Telp Wali</td>
                <td>{{ $siswa->no_telp_wali }}</td>
            </tr>
            <tr>
                <td>Alamat</td>
                <td>{{ $siswa->alamat }}</td>
            </tr>
        </table>

        <h3>Detail Pembayaran Tahun {{ $tahunDipilih }}</h3>
        <table class="payment-table">
            <thead>
                <tr>
                    <th>Bulan</th>
                    <th>Status</th>
                    <th>Tanggal Bayar</th>
                    <th>Jumlah Bayar (Rp)</th>
                    <th>Keterangan</th>
                </tr>
            </thead>
            <tbody>
                @foreach ($statusPembayaran as $pembayaran)
                    <tr>
                        <td>{{ $pembayaran['bulan'] }}</td>
                        <td class="text-center @if($pembayaran['status'] == 'Lunas') status-lunas @else status-tunggakan @endif">
                            {{ $pembayaran['status'] }}
                        </td>
                        <td class="text-center">
                            {{ $pembayaran['detail'] ? date('d-m-Y', strtotime($pembayaran['detail']['tanggal_bayar'])) : '-' }}
                        </td>
                        <td class="text-right">
                            {{ $pembayaran['detail'] ? number_format($pembayaran['detail']['jumlah_bayar'], 0, ',', '.') : '-' }}
                        </td>
                        <td>
                            {{ $pembayaran['detail'] ? $pembayaran['detail']['keterangan'] : '-' }}
                        </td>
                    </tr>
                @endforeach
            </tbody>
        </table>
    </div>
</body>
</html>