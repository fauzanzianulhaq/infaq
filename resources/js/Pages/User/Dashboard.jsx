import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

// Komponen Paginasi Sederhana
function Pagination({ links }) {
    return (
        <div className="mt-6">
            {links.map((link, index) => (
                <Link
                    key={index}
                    href={link.url || undefined} 
                    dangerouslySetInnerHTML={{ __html: link.label }}
                    className={`inline-block px-4 py-2 text-sm border rounded-md ${
                        link.active ? 'bg-green-700 text-white' : 'bg-white text-gray-700'
                    } ${!link.url ? 'text-gray-400 cursor-not-allowed' : 'hover:bg-gray-50'}`}
                    as="button"
                    disabled={!link.url}
                />
            ))}
        </div>
    );
}

// Komponen Notifikasi
function LaporanNotification({ count }) {
    if (count === 0) {
        return (
            <div className="mb-6 rounded-md border border-gray-300 bg-white p-4">
                <p className="font-medium text-gray-700">Tidak ada laporan baru untuk Anda.</p>
            </div>
        );
    }
    
    return (
        <div className="mb-6 rounded-md border border-blue-300 bg-blue-100 p-4">
            <p className="font-medium text-blue-800">
                Anda memiliki {count} laporan baru yang belum dibaca. Silakan cek di bawah.
            </p>
        </div>
    );
}

export default function Dashboard({ auth, laporans, unreadCount }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Dashboard Guru</h2>}
        >
            <Head title="Dashboard Guru" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    
                    {/* 1. Komponen Notifikasi */}
                    <LaporanNotification count={unreadCount} />

                    {/* 2. Daftar Laporan */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <h3 className="text-lg font-medium mb-4">Laporan Infaq Siswa</h3>
                            
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nama Siswa/Kelas</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nama File</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tanggal Dibuat</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {laporans.data.length === 0 && (
                                            <tr>
                                                <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                                                    Belum ada laporan yang dibagikan kepada Anda.
                                                </td>
                                            </tr>
                                        )}
                                        {laporans.data.map((laporan) => (
                                            <tr key={laporan.id} className={!laporan.is_read ? 'bg-yellow-50' : ''}>
                                                {/* PERBAIKAN: Handle siswa null dengan safe */}
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {laporan.siswa && laporan.siswa.nama_lengkap 
                                                        ? laporan.siswa.nama_lengkap 
                                                        : `Laporan Kelas ${laporan.kelas || 'Umum'}`
                                                    }
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">{laporan.nama_file}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {new Date(laporan.created_at).toLocaleDateString('id-ID')}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {laporan.is_read ? (
                                                        <span className="text-gray-500">Sudah dibaca</span>
                                                    ) : (
                                                        <span className="font-bold text-yellow-600">BARU</span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 text-right whitespace-nowrap">
    {/* SOLUSI SEMENTARA: Gunakan URL langsung */}
    <a 
        href={`/storage/${laporan.file_path}`}
        download
        className="font-medium text-green-700 hover:text-green-900"
    >
        Download
    </a>
</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            
                            <Pagination links={laporans.links} />
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}