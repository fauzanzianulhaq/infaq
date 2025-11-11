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

export default function UserIndex({ auth, users }) {
    // Ambil flash message dari props
    const { flash } = usePage().props;

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Kelola Guru (User)</h2>}
        >
            <Head title="Kelola Guru" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            
                            <FlashMessage message={flash?.success} />

                            <Link
                                href="/admin/users/create" // PERBAIKAN: Ganti route() dengan path
                                className="inline-block rounded-md bg-green-700 px-4 py-2 mb-4 text-white font-semibold transition hover:bg-green-800"
                            >
                                + Tambah Guru Baru
                            </Link>

                            {/* Tabel Daftar Guru */}
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nama</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tanggal Bergabung</th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {users.data.length === 0 && (
                                            <tr>
                                                <td colSpan="4" className="px-6 py-4 text-center text-gray-500">
                                                    Belum ada data guru.
                                                </td>
                                            </tr>
                                        )}
                                        {users.data.map((user) => (
                                            <tr key={user.id}>
                                                <td className="px-6 py-4 whitespace-nowrap">{user.name}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">{new Date(user.created_at).toLocaleDateString('id-ID')}</td>
                                                <td className="px-6 py-4 text-right whitespace-nowrap">
                                                    <Link
                                                        href={`/admin/users/${user.id}`} // PERBAIKAN: Ganti route() dengan path
                                                        method="delete"
                                                        as="button"
                                                        type="button"
                                                        onBefore={() => window.confirm(`Yakin ingin hapus guru "${user.name}"?`)}
                                                        className="font-medium text-red-600 hover:text-red-900"
                                                        disabled={auth.user.id === user.id} // Admin tidak bisa hapus diri sendiri
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
                            <Pagination links={users.links} />

                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}