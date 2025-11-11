import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import PrimaryButton from '@/Components/PrimaryButton';

export default function SiswaCreate({ auth }) {
    // Siapkan form state menggunakan hook dari Inertia
    const { data, setData, post, processing, errors, reset } = useForm({
        nama_lengkap: '',
        kelas: '',
        alamat: '',
        nama_wali: '',
        no_telp_wali: '',
    });

    const submit = (e) => {
        e.preventDefault();
        // PERBAIKAN: Ganti route() dengan path langsung
        post('/admin/siswa', {
            onSuccess: () => reset(), // Reset form jika sukses
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Tambah Siswa Baru</h2>}
        >
            <Head title="Tambah Siswa" />

            <div className="py-12">
                <div className="max-w-2xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            
                            <Link 
                                href="/admin/siswa" // PERBAIKAN: Ganti route() dengan path
                                className="text-blue-600 hover:underline mb-4 block"
                            >
                                &larr; Kembali ke Daftar Siswa
                            </Link>
                            
                            {/* Form Tambah Siswa */}
                            <form onSubmit={submit}>
                                <div>
                                    <InputLabel htmlFor="nama_lengkap" value="Nama Lengkap Siswa" />
                                    <TextInput
                                        id="nama_lengkap"
                                        name="nama_lengkap"
                                        value={data.nama_lengkap}
                                        className="mt-1 block w-full"
                                        isFocused={true}
                                        onChange={(e) => setData('nama_lengkap', e.target.value)}
                                    />
                                    <InputError message={errors.nama_lengkap} className="mt-2" />
                                </div>

                                <div className="mt-4">
                                    <InputLabel htmlFor="kelas" value="Kelas" />
                                    <TextInput
                                        id="kelas"
                                        name="kelas"
                                        value={data.kelas}
                                        className="mt-1 block w-full"
                                        onChange={(e) => setData('kelas', e.target.value)}
                                    />
                                    <InputError message={errors.kelas} className="mt-2" />
                                </div>
                                
                                <div className="mt-4">
                                    <InputLabel htmlFor="alamat" value="Alamat" />
                                    <TextInput
                                        id="alamat"
                                        name="alamat"
                                        value={data.alamat}
                                        className="mt-1 block w-full"
                                        onChange={(e) => setData('alamat', e.target.value)}
                                    />
                                    <InputError message={errors.alamat} className="mt-2" />
                                </div>

                                <div className="mt-4">
                                    <InputLabel htmlFor="nama_wali" value="Nama Wali" />
                                    <TextInput
                                        id="nama_wali"
                                        name="nama_wali"
                                        value={data.nama_wali}
                                        className="mt-1 block w-full"
                                        onChange={(e) => setData('nama_wali', e.target.value)}
                                    />
                                    <InputError message={errors.nama_wali} className="mt-2" />
                                </div>
                                
                                <div className="mt-4">
                                    <InputLabel htmlFor="no_telp_wali" value="No. Telp Wali (Format: 08...)" />
                                    <TextInput
                                        id="no_telp_wali"
                                        name="no_telp_wali"
                                        type="tel"
                                        value={data.no_telp_wali}
                                        className="mt-1 block w-full"
                                        onChange={(e) => setData('no_telp_wali', e.target.value)}
                                    />
                                    <InputError message={errors.no_telp_wali} className="mt-2" />
                                </div>
                                
                                <div className="flex items-center justify-end mt-6">
                                    <PrimaryButton className="ms-4" disabled={processing}>
                                        {processing ? 'Menyimpan...' : 'Simpan Siswa'}
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