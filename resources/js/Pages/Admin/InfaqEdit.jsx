import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import PrimaryButton from '@/Components/PrimaryButton';

export default function InfaqEdit({ auth, pembayaran }) {
    // Ambil flash message (khususnya error validasi)
    const { flash } = usePage().props;

    // Siapkan form state dengan data pembayaran yang ada
    const { data, setData, put, processing, errors } = useForm({
        jumlah_bayar: pembayaran.jumlah_bayar || '',
        tanggal_bayar: pembayaran.tanggal_bayar || '',
        bulan_bayar: pembayaran.bulan_bayar || '',
        tahun_bayar: pembayaran.tahun_bayar || '',
    });

    const submit = (e) => {
        e.preventDefault();
        // Kirim data form ke route 'admin.infaq.update'
        put(route('admin.infaq.update', pembayaran.id));
    };

    const namaBulan = [
        "Januari", "Februari", "Maret", "April", "Mei", "Juni", 
        "Juli", "Agustus", "September", "Oktober", "November", "Desember"
    ];

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Edit Data Infaq</h2>}
        >
            <Head title="Edit Infaq" />

            <div className="py-12">
                <div className="max-w-2xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            
                            {/* Tombol Kembali */}
                            <Link 
                                href={route('admin.infaq.index')} 
                                className="text-blue-600 hover:underline mb-4 block"
                            >
                                &larr; Kembali ke Buku Kas Infaq
                            </Link>

                            {/* Info Siswa (tidak bisa diedit) */}
                            <div className="mb-4 p-4 bg-gray-100 rounded-md">
                                <h4 className="font-semibold">Mengedit Infaq untuk:</h4>
                                <p className="text-lg">{pembayaran.siswa.nama_lengkap} ({pembayaran.siswa.kelas})</p>
                            </div>

                            {/* Tampilkan error validasi (cth: "Siswa sudah lunas...") */}
                            {flash.error && (
                                <div className="mb-4 rounded-md bg-red-100 p-4 text-sm text-red-700">
                                    {flash.error}
                                </div>
                            )}

                            {/* Form Edit */}
                            <form onSubmit={submit}>
                                <div>
                                    <InputLabel htmlFor="jumlah_bayar" value="Jumlah Bayar" />
                                    <TextInput
                                        id="jumlah_bayar"
                                        type="number"
                                        value={data.jumlah_bayar}
                                        onChange={(e) => setData('jumlah_bayar', e.target.value)}
                                        className="mt-1 block w-full"
                                    />
                                    <InputError message={errors.jumlah_bayar} className="mt-2" />
                                </div>
                                
                                <div className="mt-4">
                                    <InputLabel htmlFor="tanggal_bayar" value="Tanggal Bayar" />
                                    <TextInput
                                        id="tanggal_bayar"
                                        type="date"
                                        value={data.tanggal_bayar}
                                        onChange={(e) => setData('tanggal_bayar', e.target.value)}
                                        className="mt-1 block w-full"
                                    />
                                    <InputError message={errors.tanggal_bayar} className="mt-2" />
                                </div>

                                <div className="mt-4">
                                    <InputLabel htmlFor="bulan_bayar" value="Untuk Bulan" />
                                    <select 
                                        id="bulan_bayar" 
                                        value={data.bulan_bayar}
                                        onChange={(e) => setData('bulan_bayar', e.target.value)}
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                    >
                                        <option value="">Pilih Bulan</option>
                                        {namaBulan.map((bulan, index) => (
                                            <option key={index} value={index + 1}>
                                                {bulan}
                                            </option>
                                        ))}
                                    </select>
                                    <InputError message={errors.bulan_bayar} className="mt-2" />
                                </div>

                                <div className="mt-4">
                                    <InputLabel htmlFor="tahun_bayar" value="Untuk Tahun" />
                                    <TextInput
                                        id="tahun_bayar"
                                        type="number"
                                        value={data.tahun_bayar}
                                        onChange={(e) => setData('tahun_bayar', e.target.value)}
                                        className="mt-1 block w-full"
                                        placeholder="Contoh: 2024"
                                    />
                                    <InputError message={errors.tahun_bayar} className="mt-2" />
                                </div>
                                
                                <div className="flex items-center justify-end mt-6">
                                    <PrimaryButton className="ms-4" disabled={processing}>
                                        {processing ? 'Menyimpan...' : 'Update Data'}
                                    </PrimaryButton>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}