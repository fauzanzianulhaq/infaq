import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage } from '@inertiajs/react';

// Komponen untuk menampilkan pesan sukses (Flash Message)
function FlashMessage({ message }) {
    if (!message) return null;
    return (
        <div className="mb-4 rounded-md bg-green-100 p-4 text-sm text-green-700">
            {message}
        </div>
    );
}

// Komponen Paginasi Sederhana
function Pagination({ links }) {
    return (
        <div className="mt-6 flex space-x-2">
            {links.map((link, index) => (
                <Link
                    key={index}
                    href={link.url || '#'}
                    className={`px-3 py-1 rounded ${
                        link.active
                            ? 'bg-green-600 text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    } ${!link.url ? 'opacity-50 cursor-not-allowed' : ''}`}
                    dangerouslySetInnerHTML={{ __html: link.label }}
                />
            ))}
        </div>
    );
}

export default function InfaqIndex({ auth, pembayarans }) {
    // Ambil flash message dari props
    const { flash } = usePage().props;

    // Helper untuk format bulan
    const getNamaBulan = (bulanNum) => {
        const namaBulan = [
            "Jan", "Feb", "Mar", "Apr", "Mei", "Jun", 
            "Jul", "Ags", "Sep", "Okt", "Nov", "Des"
        ];
        return namaBulan[bulanNum - 1] || 'N/A';
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Kelola Infaq (Buku Kas)</h2>}
        >
            <Head title="Kelola Infaq" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            
                            <FlashMessage message={flash?.success} />

                            <p className="mb-4 text-gray-600">
                                Halaman ini berisi seluruh riwayat transaksi infaq yang tercatat. 
                                Anda dapat mengedit atau menghapus transaksi jika terjadi kesalahan input.
                            </p>

                            {/* Tabel Riwayat Infaq */}
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tanggal Bayar</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nama Siswa</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kelas</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Jumlah</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Untuk Bulan</th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {pembayarans.data.length === 0 && (
                                            <tr>
                                                <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                                                    Belum ada data pembayaran.
                                                </td>
                                            </tr>
                                        )}
                                        {pembayarans.data.map((p) => (
                                            <tr key={p.id}>
                                                <td className="px-6 py-4 whitespace-nowrap">{p.tanggal_bayar}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">{p.siswa?.nama_lengkap}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">{p.siswa?.kelas}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">Rp {Number(p.jumlah_bayar).toLocaleString('id-ID')}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">{getNamaBulan(p.bulan_bayar)} {p.tahun_bayar}</td>
                                                <td className="px-6 py-4 text-right whitespace-nowrap space-x-4">
                                                    <Link 
                                                        href={`/admin/infaq/${p.id}/edit`} // PERBAIKAN: Ganti route() dengan path
                                                        className="font-medium text-yellow-600 hover:text-yellow-900"
                                                    >
                                                        Edit
                                                    </Link>
                                                    <Link
                                                        href={`/admin/infaq/${p.id}`} // PERBAIKAN: Ganti route() dengan path
                                                        method="delete"
                                                        as="button"
                                                        type="button"
                                                        onBefore={() => window.confirm('Yakin ingin hapus data pembayaran ini?')}
                                                        className="font-medium text-red-600 hover:text-red-900"
                                                    >
                                                        Hapus
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            
                            {/* Paginasi */}
                            <Pagination links={pembayarans.links} />

                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}