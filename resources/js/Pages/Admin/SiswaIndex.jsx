import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage, useForm } from '@inertiajs/react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';

// Komponen FlashMessage untuk SiswaIndex
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

// Form Kirim Laporan Per Kelas - DIPINDAH KE SINI
function FormKirimLaporanPerKelas({ gurus, semuaKelas }) {
    const { data, setData, post, processing, errors } = useForm({
        user_id: '',
        tahun: new Date().getFullYear(),
        kelas: '',
    });
    
    const submit = (e) => {
        e.preventDefault();
        post('/admin/laporan/kirim-per-kelas', {
            preserveScroll: true,
            onSuccess: () => setData('user_id', ''),
        });
    };
    
    return (
        <div className="p-6 bg-white shadow-sm sm:rounded-lg mb-6">
            <h3 className="text-lg font-medium mb-4">Kirim Laporan Per Kelas</h3>
            <p className="text-sm text-gray-600 mb-4">
                Kirim laporan infaq untuk seluruh siswa dalam satu kelas kepada guru.
            </p>
            <form onSubmit={submit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                        <InputLabel htmlFor="kelas" value="Pilih Kelas" />
                        <select 
                            id="kelas" 
                            value={data.kelas}
                            onChange={(e) => setData('kelas', e.target.value)}
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                            required
                        >
                            <option value="">Pilih Kelas...</option>
                            {semuaKelas.map((kelas) => (
                                <option key={kelas} value={kelas}>
                                    Kelas {kelas}
                                </option>
                            ))}
                        </select>
                        <InputError message={errors.kelas} className="mt-2" />
                    </div>
                    
                    <div>
                        <InputLabel htmlFor="tahun" value="Tahun" />
                        <select 
                            id="tahun" 
                            value={data.tahun}
                            onChange={(e) => setData('tahun', e.target.value)}
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                        >
                            <option value="2024">2024</option>
                            <option value="2025">2025</option>
                            <option value="2026">2026</option>
                        </select>
                        <InputError message={errors.tahun} className="mt-2" />
                    </div>
                    
                    <div>
                        <InputLabel htmlFor="user_id" value="Pilih Guru Penerima" />
                        <select 
                            id="user_id" 
                            value={data.user_id}
                            onChange={(e) => setData('user_id', e.target.value)}
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                            required
                        >
                            <option value="">Pilih Guru...</option>
                            {gurus.map((guru) => (
                                <option key={guru.id} value={guru.id}>
                                    {guru.name}
                                </option>
                            ))}
                        </select>
                        <InputError message={errors.user_id} className="mt-2" />
                    </div>
                    
                    <div className="flex items-end">
                        <PrimaryButton className="w-full justify-center" disabled={processing || !data.user_id || !data.kelas}>
                            {processing ? 'Mengirim...' : 'Kirim Laporan'}
                        </PrimaryButton>
                    </div>
                </div>
            </form>
        </div>
    );
}

export default function SiswaIndex({ auth, siswas, gurus, semuaKelas }) {
    // Ambil flash message dari props
    const { flash } = usePage().props;

    // Fungsi untuk konfirmasi hapus
    const handleDelete = (siswa) => {
        if (confirm(`Apakah Anda yakin ingin menghapus siswa "${siswa.nama_lengkap}"?`)) {
            // Gunakan Inertia.delete untuk mengirim request
            // (Kita bisa import { router } from '@inertiajs/react' dan gunakan router.delete)
            // Tapi untuk kesederhanaan, kita akan buatkan form di dalam tabel
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Kelola Siswa</h2>}
        >
            <Head title="Kelola Siswa" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            
                            {/* Tampilkan pesan sukses jika ada */}
                            <FlashMessage message={flash?.success} />

                            {/* FORM KIRIM LAPORAN PER KELAS - DIPINDAH KE SINI */}
                            <FormKirimLaporanPerKelas 
                                gurus={gurus} 
                                semuaKelas={semuaKelas} 
                            />

                            <Link
                                href="/admin/siswa/create"
                                className="inline-block rounded-md bg-green-700 px-4 py-2 mb-4 text-white font-semibold transition hover:bg-green-800"
                            >
                                + Tambah Siswa Baru
                            </Link>

                            {/* Tabel Daftar Siswa */}
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nama</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kelas</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">No. Telp Wali (WA)</th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {siswas.data.length === 0 && (
                                            <tr>
                                                <td colSpan="4" className="px-6 py-4 text-center text-gray-500">
                                                    Belum ada data siswa.
                                                </td>
                                            </tr>
                                        )}
                                        {siswas.data.map((siswa) => (
                                            <tr key={siswa.id}>
                                                <td className="px-6 py-4 whitespace-nowrap">{siswa.nama_lengkap}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">{siswa.kelas}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {/* FITUR LINK KE WA */}
                                                    <a 
                                                        href={`https://wa.me/${siswa.no_telp_wali?.replace(/^0/, '62')}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-blue-600 hover:underline"
                                                    >
                                                        {siswa.no_telp_wali}
                                                    </a>
                                                </td>
                                                <td className="px-6 py-4 text-right whitespace-nowrap space-x-4">
                                                    <Link 
                                                        href={`/admin/siswa/${siswa.id}`}
                                                        className="font-medium text-indigo-600 hover:text-indigo-900"
                                                    >
                                                        Detail
                                                    </Link>
                                                    <Link 
                                                        href={`/admin/siswa/${siswa.id}/edit`}
                                                        className="font-medium text-yellow-600 hover:text-yellow-900"
                                                    >
                                                        Edit
                                                    </Link>
                                                    {/* Tombol Hapus */}
                                                    <Link
                                                        href={`/admin/siswa/${siswa.id}`}
                                                        method="delete"
                                                        as="button"
                                                        type="button"
                                                        onBefore={() => window.confirm(`Yakin ingin hapus "${siswa.nama_lengkap}"?`)}
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
                            <Pagination links={siswas.links} />

                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}