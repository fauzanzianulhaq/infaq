import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { useState } from 'react';

export default function Dashboard({ auth, ringkasan, grafikBulanan, pemasukanPerKelas, transaksiTerbaru, tahun }) {
    const [loading, setLoading] = useState(false);

    // Fungsi untuk sanitasi data - PERBAIKAN: hilangkan kata tidak pantas
    const sanitizeData = (data) => {
        if (!data) return [];
        return data.map(item => ({
            ...item,
            siswa_nama: item.siswa_nama 
                ? item.siswa_nama.replace(/[^a-zA-Z0-9\s]/g, '').replace(/kontol/gi, '***').trim() 
                : 'N/A'
        }));
    };

    // Fungsi untuk validasi data - PERBAIKAN: sesuaikan dengan struktur dari controller
    const validateData = (data) => {
        if (!data) return [];
        const requiredFields = ['siswa_nama', 'kelas', 'jumlah_bayar'];
        return data.filter(item => 
            item && requiredFields.every(field => 
                item[field] !== undefined && item[field] !== null && item[field] !== ''
            )
        );
    };

    const generatePDF = async () => {
        setLoading(true);
        try {
            const response = await fetch('/admin/dashboard/export-data');
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const result = await response.json();

            if (result.success) {
                const data = result.data;
                const validatedTransaksi = validateData(sanitizeData(data.transaksiTerbaru));
                
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
                            .action-buttons {
                                text-align: center;
                                margin: 20px 0;
                                padding: 20px;
                                background: #f3f4f6;
                                border-radius: 5px;
                            }
                            .btn-print {
                                background: #059669;
                                color: white;
                                padding: 10px 20px;
                                border: none;
                                border-radius: 5px;
                                cursor: pointer;
                                margin: 0 10px;
                            }
                            .btn-close {
                                background: #dc2626;
                                color: white;
                                padding: 10px 20px;
                                border: none;
                                border-radius: 5px;
                                cursor: pointer;
                                margin: 0 10px;
                            }
                            @media print {
                                body { margin: 10mm; }
                                .no-print { display: none !important; }
                                .header { border-bottom: 2px solid #000; }
                                .stat-card { break-inside: avoid; }
                                .action-buttons { display: none; }
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
                        </div>

                        <div class="action-buttons no-print">
                            <button class="btn-print" onclick="window.print()">🖨️ Print Laporan</button>
                            <button class="btn-close" onclick="window.close()">❌ Tutup</button>
                            <p style="margin-top: 10px; color: #666;">
                                Gunakan tombol Print dan pilih "Save as PDF" untuk download file PDF
                            </p>
                        </div>

                        <div class="section">
                            <h2>📊 Statistik Utama</h2>
                            <div class="stats-grid">
                                <div class="stat-card">
                                    <h3>Pemasukan Bulan Ini</h3>
                                    <p class="total">Rp ${(data.ringkasan?.pemasukan_bulan_ini || 0).toLocaleString('id-ID')}</p>
                                </div>
                                <div class="stat-card">
                                    <h3>Pemasukan Tahun Ini</h3>
                                    <p class="total">Rp ${(data.ringkasan?.pemasukan_tahun_ini || 0).toLocaleString('id-ID')}</p>
                                </div>
                                <div class="stat-card">
                                    <h3>Total Siswa</h3>
                                    <p>${data.ringkasan?.total_siswa || '0'} siswa</p>
                                </div>
                                <div class="stat-card">
                                    <h3>Total Guru</h3>
                                    <p>${data.ringkasan?.total_guru || '0'} guru</p>
                                </div>
                                <div class="stat-card">
                                    <h3>Laporan Terkirim</h3>
                                    <p>${data.ringkasan?.laporan_terkirim || '0'} laporan</p>
                                </div>
                                <div class="stat-card">
                                    <h3>Transaksi Bulan Ini</h3>
                                    <p>${data.ringkasan?.transaksi_bulan_ini || '0'} transaksi</p>
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
                                    ${(data.grafikBulanan || []).map(item => `
                                        <tr>
                                            <td>${item.bulan || 'N/A'}</td>
                                            <td class="total">Rp ${(item.total || 0).toLocaleString('id-ID')}</td>
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
                                    ${(data.pemasukanPerKelas || []).map(item => `
                                        <tr>
                                            <td>Kelas ${item.kelas || 'N/A'}</td>
                                            <td class="total">Rp ${(item.total || 0).toLocaleString('id-ID')}</td>
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
                                    ${validatedTransaksi.map(transaksi => `
                                        <tr>
                                            <td>${transaksi.siswa_nama}</td>
                                            <td>${transaksi.kelas}</td>
                                            <td class="total">Rp ${(transaksi.jumlah_bayar || 0).toLocaleString('id-ID')}</td>
                                            <td>${transaksi.periode_bayar || 'N/A'}</td>
                                            <td>${transaksi.tanggal_input || 'N/A'}</td>
                                        </tr>
                                    `).join('')}
                                    ${validatedTransaksi.length === 0 ? `
                                        <tr>
                                            <td colspan="5" style="text-align: center; padding: 20px; color: #666;">
                                                Tidak ada data transaksi
                                            </td>
                                        </tr>
                                    ` : ''}
                                </tbody>
                            </table>
                        </div>
                    </body>
                    </html>
                `;

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
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const result = await response.json();

            if (result.success) {
                const data = result.data;
                const validatedTransaksi = validateData(sanitizeData(data.transaksiTerbaru));
                
                const htmlContent = `
                    <!DOCTYPE html>
                    <html>
                    <head>
                        <title>Preview - ${data.judul}</title>
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
                            .btn-print {
                                background: #059669;
                                color: white;
                                padding: 10px 20px;
                                border: none;
                                border-radius: 5px;
                                cursor: pointer;
                                margin: 0 10px;
                            }
                            .btn-close {
                                background: #dc2626;
                                color: white;
                                padding: 10px 20px;
                                border: none;
                                border-radius: 5px;
                                cursor: pointer;
                                margin: 0 10px;
                            }
                        </style>
                    </head>
                    <body>
                        <div class="header">
                            <h1>${data.judul} - PREVIEW</h1>
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
                                    <p class="total">Rp ${(data.ringkasan?.pemasukan_bulan_ini || 0).toLocaleString('id-ID')}</p>
                                </div>
                                <div class="stat-card">
                                    <h3>Pemasukan Tahun Ini</h3>
                                    <p class="total">Rp ${(data.ringkasan?.pemasukan_tahun_ini || 0).toLocaleString('id-ID')}</p>
                                </div>
                                <div class="stat-card">
                                    <h3>Total Siswa</h3>
                                    <p>${data.ringkasan?.total_siswa || '0'} siswa</p>
                                </div>
                                <div class="stat-card">
                                    <h3>Total Guru</h3>
                                    <p>${data.ringkasan?.total_guru || '0'} guru</p>
                                </div>
                                <div class="stat-card">
                                    <h3>Laporan Terkirim</h3>
                                    <p>${data.ringkasan?.laporan_terkirim || '0'} laporan</p>
                                </div>
                                <div class="stat-card">
                                    <h3>Transaksi Bulan Ini</h3>
                                    <p>${data.ringkasan?.transaksi_bulan_ini || '0'} transaksi</p>
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
                                    ${(data.grafikBulanan || []).map(item => `
                                        <tr>
                                            <td>${item.bulan || 'N/A'}</td>
                                            <td class="total">Rp ${(item.total || 0).toLocaleString('id-ID')}</td>
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
                                    ${(data.pemasukanPerKelas || []).map(item => `
                                        <tr>
                                            <td>Kelas ${item.kelas || 'N/A'}</td>
                                            <td class="total">Rp ${(item.total || 0).toLocaleString('id-ID')}</td>
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
                                    ${validatedTransaksi.map(transaksi => `
                                        <tr>
                                            <td>${transaksi.siswa_nama}</td>
                                            <td>${transaksi.kelas}</td>
                                            <td class="total">Rp ${(transaksi.jumlah_bayar || 0).toLocaleString('id-ID')}</td>
                                            <td>${transaksi.periode_bayar || 'N/A'}</td>
                                            <td>${transaksi.tanggal_input || 'N/A'}</td>
                                        </tr>
                                    `).join('')}
                                    ${validatedTransaksi.length === 0 ? `
                                        <tr>
                                            <td colspan="5" style="text-align: center; padding: 20px; color: #666;">
                                                Tidak ada data transaksi
                                            </td>
                                        </tr>
                                    ` : ''}
                                </tbody>
                            </table>
                        </div>
                    </body>
                    </html>
                `;

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

    // PERBAIKAN: Validasi dan sanitasi data sebelum render
    const validatedTransaksi = validateData(sanitizeData(transaksiTerbaru));

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">Dashboard Admin</h2>
                </div>
            }
        >
            <Head title="Dashboard Admin" />

            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    
                    {/* Loading Overlay */}
                    {loading && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                            <div className="bg-white p-6 rounded-lg flex items-center shadow-lg">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mr-3"></div>
                                <span className="text-gray-700">Menyiapkan laporan...</span>
                            </div>
                        </div>
                    )}

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
                                        Rp {ringkasan?.pemasukan_bulan_ini?.toLocaleString('id-ID') || '0'}
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
                                        Rp {ringkasan?.pemasukan_tahun_ini?.toLocaleString('id-ID') || '0'}
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
                                        {ringkasan?.total_siswa?.toLocaleString('id-ID') || '0'}
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
                                        {ringkasan?.total_guru?.toLocaleString('id-ID') || '0'}
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
                                        {ringkasan?.laporan_terkirim?.toLocaleString('id-ID') || '0'}
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
                                        {ringkasan?.transaksi_bulan_ini?.toLocaleString('id-ID') || '0'}
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
                                {(!grafikBulanan || grafikBulanan.length === 0) && (
                                    <p className="text-gray-500 text-center py-4">Belum ada data grafik bulanan</p>
                                )}
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
                                    {validatedTransaksi.map((transaksi) => (
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
                                                {transaksi.periode_bayar || `${transaksi.bulan_bayar} ${transaksi.tahun_bayar}`}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {transaksi.tanggal_input || transaksi.tanggal}
                                            </td>
                                        </tr>
                                    ))}
                                    {validatedTransaksi.length === 0 && (
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