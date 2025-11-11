import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { useState } from 'react';

export default function Dashboard({ auth, ringkasan, grafikBulanan, pemasukanPerKelas, transaksiTerbaru, tahun }) {
    const [loading, setLoading] = useState(false);

    const generatePDF = async () => {
        setLoading(true);
        try {
            // Ambil data dari backend
            const response = await fetch('/admin/dashboard/export-data');
            const result = await response.json();

            if (result.success) {
                const data = result.data;
                
                // Buat konten PDF sederhana menggunakan window.print()
                const htmlContent = `
                    <!DOCTYPE html>
                    <html>
                    <head>
                        <title>${data.judul}</title>
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
                                grid-template-columns: repeat(2, 1fr); 
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
                            .no-print { 
                                display: none; 
                            }
                            @media print {
                                body { margin: 10mm; }
                                .no-print { display: none !important; }
                                .header { border-bottom: 2px solid #000; }
                                .stat-card { break-inside: avoid; }
                            }
                            @page {
                                size: A4;
                                margin: 20mm;
                            }
                        </style>
                    </head>
                    <body>
                        <div class="header">
                            <h1>${data.judul}</h1>
                            <p>Periode: ${data.tanggal_laporan}</p>
                            <div class="no-print">
                                <button onclick="window.print()" style="padding: 10px 20px; background: #059669; color: white; border: none; border-radius: 5px; cursor: pointer; margin: 10px;">
                                    🖨️ Print Laporan
                                </button>
                                <button onclick="window.close()" style="padding: 10px 20px; background: #dc2626; color: white; border: none; border-radius: 5px; cursor: pointer; margin: 10px;">
                                    ❌ Tutup
                                </button>
                                <p style="color: #666; font-size: 14px; margin-top: 10px;">
                                    Gunakan fitur Print browser dan pilih "Save as PDF" untuk download PDF
                                </p>
                            </div>
                        </div>

                        <div class="section">
                            <h2>📊 Statistik Utama</h2>
                            <div class="stats-grid">
                                <div class="stat-card">
                                    <h3>Pemasukan Bulan Ini</h3>
                                    <p class="total">Rp ${data.ringkasan.pemasukan_bulan_ini.toLocaleString('id-ID')}</p>
                                </div>
                                <div class="stat-card">
                                    <h3>Pemasukan Tahun Ini</h3>
                                    <p class="total">Rp ${data.ringkasan.pemasukan_tahun_ini.toLocaleString('id-ID')}</p>
                                </div>
                                <div class="stat-card">
                                    <h3>Total Siswa</h3>
                                    <p>${data.ringkasan.total_siswa} siswa</p>
                                </div>
                                <div class="stat-card">
                                    <h3>Total Guru</h3>
                                    <p>${data.ringkasan.total_guru} guru</p>
                                </div>
                                <div class="stat-card">
                                    <h3>Laporan Terkirim</h3>
                                    <p>${data.ringkasan.laporan_terkirim} laporan</p>
                                </div>
                                <div class="stat-card">
                                    <h3>Transaksi Bulan Ini</h3>
                                    <p>${data.ringkasan.transaksi_bulan_ini} transaksi</p>
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
                                    ${data.grafikBulanan.map(item => `
                                        <tr>
                                            <td>${item.bulan}</td>
                                            <td class="total">Rp ${item.total.toLocaleString('id-ID')}</td>
                                        </tr>
                                    `).join('')}
                                </tbody>
                            </table>
                        </div>

                        <div class="section">
                            <h2>🏫 Pemasukan per Kelas (${data.tahun})</h2>
                            <table class="table">
                                <thead>
                                    <tr>
                                        <th>Kelas</th>
                                        <th>Total Pemasukan</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${data.pemasukanPerKelas.map(item => `
                                        <tr>
                                            <td>Kelas ${item.kelas}</td>
                                            <td class="total">Rp ${item.total.toLocaleString('id-ID')}</td>
                                        </tr>
                                    `).join('')}
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
                                    ${data.transaksiTerbaru.map(transaksi => `
                                        <tr>
                                            <td>${transaksi.siswa_nama}</td>
                                            <td>${transaksi.kelas}</td>
                                            <td class="total">Rp ${transaksi.jumlah_bayar.toLocaleString('id-ID')}</td>
                                            <td>${transaksi.bulan_bayar} ${transaksi.tahun_bayar}</td>
                                            <td>${transaksi.tanggal}</td>
                                        </tr>
                                    `).join('')}
                                </tbody>
                            </table>
                        </div>

                        <div class="no-print" style="margin-top: 40px; padding: 20px; background: #f3f4f6; border-radius: 5px; text-align: center;">
                            <p><strong>Tips:</strong> Klik "Print Laporan" lalu pilih "Save as PDF" sebagai destination untuk download file PDF</p>
                        </div>
                    </body>
                    </html>
                `;

                // Buka di tab baru
                const printWindow = window.open('', '_blank');
                printWindow.document.write(htmlContent);
                printWindow.document.close();
                
            } else {
                alert('Gagal mengambil data: ' + (result.error || 'Unknown error'));
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Terjadi kesalahan saat membuat laporan: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const previewPDF = async () => {
        setLoading(true);
        try {
            const response = await fetch('/admin/dashboard/export-data');
            const result = await response.json();

            if (result.success) {
                const data = result.data;
                
                // Buat HTML untuk preview
                const htmlContent = `
                    <!DOCTYPE html>
                    <html>
                    <head>
                        <title>${data.judul}</title>
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
                                grid-template-columns: repeat(2, 1fr); 
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
                            .action-buttons {
                                text-align: center;
                                margin: 20px 0;
                                padding: 20px;
                                background: #f3f4f6;
                                border-radius: 5px;
                            }
                            .action-buttons button {
                                padding: 10px 20px;
                                margin: 0 10px;
                                border: none;
                                border-radius: 5px;
                                cursor: pointer;
                                font-size: 14px;
                            }
                            .btn-print {
                                background: #059669;
                                color: white;
                            }
                            .btn-close {
                                background: #dc2626;
                                color: white;
                            }
                        </style>
                    </head>
                    <body>
                        <div class="header">
                            <h1>${data.judul}</h1>
                            <p>Periode: ${data.tanggal_laporan}</p>
                        </div>

                        <div class="action-buttons">
                            <button class="btn-print" onclick="window.print()">🖨️ Print Laporan</button>
                            <button class="btn-close" onclick="window.close()">❌ Tutup Preview</button>
                            <p style="margin-top: 10px; color: #666;">
                                Gunakan tombol Print dan pilih "Save as PDF" untuk download file PDF
                            </p>
                        </div>

                        <div class="section">
                            <h2>📊 Statistik Utama</h2>
                            <div class="stats-grid">
                                <div class="stat-card">
                                    <h3>Pemasukan Bulan Ini</h3>
                                    <p class="total">Rp ${data.ringkasan.pemasukan_bulan_ini.toLocaleString('id-ID')}</p>
                                </div>
                                <div class="stat-card">
                                    <h3>Pemasukan Tahun Ini</h3>
                                    <p class="total">Rp ${data.ringkasan.pemasukan_tahun_ini.toLocaleString('id-ID')}</p>
                                </div>
                                <div class="stat-card">
                                    <h3>Total Siswa</h3>
                                    <p>${data.ringkasan.total_siswa} siswa</p>
                                </div>
                                <div class="stat-card">
                                    <h3>Total Guru</h3>
                                    <p>${data.ringkasan.total_guru} guru</p>
                                </div>
                                <div class="stat-card">
                                    <h3>Laporan Terkirim</h3>
                                    <p>${data.ringkasan.laporan_terkirim} laporan</p>
                                </div>
                                <div class="stat-card">
                                    <h3>Transaksi Bulan Ini</h3>
                                    <p>${data.ringkasan.transaksi_bulan_ini} transaksi</p>
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
                                    ${data.grafikBulanan.map(item => `
                                        <tr>
                                            <td>${item.bulan}</td>
                                            <td class="total">Rp ${item.total.toLocaleString('id-ID')}</td>
                                        </tr>
                                    `).join('')}
                                </tbody>
                            </table>
                        </div>

                        <div class="section">
                            <h2>🏫 Pemasukan per Kelas (${data.tahun})</h2>
                            <table class="table">
                                <thead>
                                    <tr>
                                        <th>Kelas</th>
                                        <th>Total Pemasukan</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${data.pemasukanPerKelas.map(item => `
                                        <tr>
                                            <td>Kelas ${item.kelas}</td>
                                            <td class="total">Rp ${item.total.toLocaleString('id-ID')}</td>
                                        </tr>
                                    `).join('')}
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
                                    ${data.transaksiTerbaru.map(transaksi => `
                                        <tr>
                                            <td>${transaksi.siswa_nama}</td>
                                            <td>${transaksi.kelas}</td>
                                            <td class="total">Rp ${transaksi.jumlah_bayar.toLocaleString('id-ID')}</td>
                                            <td>${transaksi.bulan_bayar} ${transaksi.tahun_bayar}</td>
                                            <td>${transaksi.tanggal}</td>
                                        </tr>
                                    `).join('')}
                                </tbody>
                            </table>
                        </div>
                    </body>
                    </html>
                `;

                // Buka di tab baru
                const previewWindow = window.open('', '_blank');
                previewWindow.document.write(htmlContent);
                previewWindow.document.close();
                
            } else {
                alert('Gagal mengambil data: ' + (result.error || 'Unknown error'));
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Terjadi kesalahan saat membuat preview: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">Dashboard Admin</h2>
                    <div className="flex gap-2">
                        <button 
                            onClick={previewPDF}
                            disabled={loading}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center disabled:opacity-50"
                        >
                            <span className="mr-2">👁️</span>
                            {loading ? 'Loading...' : 'Preview Laporan'}
                        </button>
                        <button 
                            onClick={generatePDF}
                            disabled={loading}
                            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center disabled:opacity-50"
                        >
                            <span className="mr-2">📥</span>
                            {loading ? 'Loading...' : 'Download PDF'}
                        </button>
                    </div>
                </div>
            }
        >
            <Head title="Dashboard Admin" />

            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    
                    {/* Header Welcome */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-800">Selamat Datang, {auth.user.name}! 👋</h1>
                        <p className="text-gray-600 mt-2">Dashboard monitoring sistem infaq sekolah</p>
                    </div>

                    {/* Export PDF Buttons */}
                    <div className="flex gap-4 justify-end mb-6">
                        <button 
                            onClick={previewPDF}
                            disabled={loading}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center disabled:opacity-50"
                        >
                            <span className="mr-2">👁️</span>
                            {loading ? 'Loading...' : 'Preview Laporan'}
                        </button>
                        <button 
                            onClick={generatePDF}
                            disabled={loading}
                            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center disabled:opacity-50"
                        >
                            <span className="mr-2">📥</span>
                            {loading ? 'Loading...' : 'Download PDF'}
                        </button>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                        <div className="bg-white rounded-lg shadow p-6">
                            <div className="flex items-center">
                                <div className="p-3 bg-green-100 rounded-lg">
                                    <span className="text-2xl text-green-600">💰</span>
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm text-gray-500">Pemasukan Bulan Ini</p>
                                    <p className="text-lg font-bold text-gray-800">
                                        Rp {ringkasan.pemasukan_bulan_ini?.toLocaleString('id-ID') || '0'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow p-6">
                            <div className="flex items-center">
                                <div className="p-3 bg-blue-100 rounded-lg">
                                    <span className="text-2xl text-blue-600">📊</span>
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm text-gray-500">Pemasukan Tahun Ini</p>
                                    <p className="text-lg font-bold text-gray-800">
                                        Rp {ringkasan.pemasukan_tahun_ini?.toLocaleString('id-ID') || '0'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow p-6">
                            <div className="flex items-center">
                                <div className="p-3 bg-purple-100 rounded-lg">
                                    <span className="text-2xl text-purple-600">👨‍🎓</span>
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm text-gray-500">Total Siswa</p>
                                    <p className="text-lg font-bold text-gray-800">
                                        {ringkasan.total_siswa?.toLocaleString('id-ID') || '0'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow p-6">
                            <div className="flex items-center">
                                <div className="p-3 bg-orange-100 rounded-lg">
                                    <span className="text-2xl text-orange-600">👨‍🏫</span>
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm text-gray-500">Total Guru</p>
                                    <p className="text-lg font-bold text-gray-800">
                                        {ringkasan.total_guru?.toLocaleString('id-ID') || '0'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow p-6">
                            <div className="flex items-center">
                                <div className="p-3 bg-red-100 rounded-lg">
                                    <span className="text-2xl text-red-600">📋</span>
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm text-gray-500">Laporan Terkirim</p>
                                    <p className="text-lg font-bold text-gray-800">
                                        {ringkasan.laporan_terkirim?.toLocaleString('id-ID') || '0'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow p-6">
                            <div className="flex items-center">
                                <div className="p-3 bg-indigo-100 rounded-lg">
                                    <span className="text-2xl text-indigo-600">🔄</span>
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm text-gray-500">Transaksi Bulan Ini</p>
                                    <p className="text-lg font-bold text-gray-800">
                                        {ringkasan.transaksi_bulan_ini?.toLocaleString('id-ID') || '0'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Charts Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                        {/* Grafik Trend */}
                        <div className="bg-white rounded-lg shadow p-6">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Trend Pemasukan 6 Bulan Terakhir</h3>
                            <div className="space-y-3">
                                {grafikBulanan && grafikBulanan.map((item, index) => (
                                    <div key={index} className="flex justify-between items-center">
                                        <span className="text-sm text-gray-600">{item.bulan}</span>
                                        <span className="text-sm font-semibold">
                                            Rp {item.total.toLocaleString('id-ID')}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Pemasukan per Kelas */}
                        <div className="bg-white rounded-lg shadow p-6">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Pemasukan per Kelas ({tahun})</h3>
                            <div className="space-y-3">
                                {pemasukanPerKelas && pemasukanPerKelas.map((item, index) => (
                                    <div key={index} className="flex justify-between items-center">
                                        <span className="text-sm text-gray-600">Kelas {item.kelas}</span>
                                        <span className="text-sm font-semibold">
                                            Rp {item.total.toLocaleString('id-ID')}
                                        </span>
                                    </div>
                                ))}
                                {(!pemasukanPerKelas || pemasukanPerKelas.length === 0) && (
                                    <p className="text-gray-500 text-center py-4">Belum ada data pemasukan per kelas</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Recent Transactions */}
                    <div className="bg-white rounded-lg shadow overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-800">Transaksi Terbaru</h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Siswa</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kelas</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Jumlah</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Periode</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tanggal</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {transaksiTerbaru && transaksiTerbaru.map((transaksi) => (
                                        <tr key={transaksi.id}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {transaksi.siswa_nama}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {transaksi.kelas}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-600">
                                                Rp {transaksi.jumlah_bayar.toLocaleString('id-ID')}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {transaksi.bulan_bayar} {transaksi.tahun_bayar}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {transaksi.tanggal}
                                            </td>
                                        </tr>
                                    ))}
                                    {(!transaksiTerbaru || transaksiTerbaru.length === 0) && (
                                        <tr>
                                            <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                                                Belum ada transaksi terbaru
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}