import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import PrimaryButton from '@/Components/PrimaryButton';
import { router } from '@inertiajs/react';
import { useState, useEffect } from 'react';

// Komponen FlashMessage
function FlashMessage({ success, error }) {
    return (
        <>
            {success && (
                <div className="mb-4 rounded-md bg-green-100 p-4 text-sm text-green-700">
                    {success}
                </div>
            )}
            {error && (
                <div className="mb-4 rounded-md bg-red-100 p-4 text-sm text-red-700">
                    {error}
                </div>
            )}
        </>
    );
}

// Komponen FormBayar
function FormBayar({ siswa, tahunDipilih }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        jumlah_bayar: '',
        tanggal_bayar: new Date().toISOString().split('T')[0],
        bulan_bayar: '',
        tahun_bayar: tahunDipilih,
    });
    
    useEffect(() => {
        setData('tahun_bayar', tahunDipilih);
    }, [tahunDipilih]);
    
    const submit = (e) => {
        e.preventDefault();
        post(`/admin/siswa/${siswa.id}/pembayaran`, {
            onSuccess: () => reset('jumlah_bayar', 'bulan_bayar'),
            preserveScroll: true,
        });
    };
    
    const namaBulan = [ "Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember" ];
    
    return (
        <form onSubmit={submit} className="grid grid-cols-1 md:grid-cols-5 gap-4" id="form-bayar">
            {/* Input Jumlah Bayar */}
            <div>
                <InputLabel htmlFor="jumlah_bayar" value="Jumlah Bayar" />
                <TextInput 
                    id="jumlah_bayar" 
                    type="number" 
                    value={data.jumlah_bayar} 
                    onChange={(e) => setData('jumlah_bayar', e.target.value)} 
                    className="mt-1 block w-full" 
                    placeholder="Contoh: 50000" 
                />
                <InputError message={errors.jumlah_bayar} className="mt-2" />
            </div>
            
            {/* Input Tanggal Bayar */}
            <div>
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
            
            {/* Input Bulan Bayar */}
            <div>
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
            
            {/* Input Tahun Bayar */}
            <div>
                <InputLabel htmlFor="tahun_bayar" value="Untuk Tahun" />
                <TextInput 
                    id="tahun_bayar" 
                    type="number" 
                    value={data.tahun_bayar} 
                    onChange={(e) => setData('tahun_bayar', e.target.value)} 
                    className="mt-1 block w-full bg-gray-100" 
                    readOnly 
                />
                <InputError message={errors.tahun_bayar} className="mt-2" />
            </div>
            
            {/* Tombol Submit */}
            <div className="flex items-end">
                <PrimaryButton className="w-full justify-center" disabled={processing}>
                    {processing ? 'Menyimpan...' : 'Catat Pembayaran'}
                </PrimaryButton>
            </div>
        </form>
    );
}

// Komponen Utama
export default function SiswaShow({ auth, siswa, statusPembayaran, tahunDipilih, gurus }) {
    const { flash } = usePage().props;
    const [selectedTahun, setSelectedTahun] = useState(tahunDipilih);
    
    const handleTahunChange = (e) => {
        const newTahun = e.target.value;
        setSelectedTahun(newTahun);
        router.get(
            `/admin/siswa/${siswa.id}`, 
            { tahun: newTahun }, 
            { preserveState: true, replace: true }
        );
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Detail Siswa: {siswa.nama_lengkap}</h2>}
        >
            <Head title="Detail Siswa" />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="space-y-6">
                        <Link 
                            href="/admin/siswa"
                            className="text-blue-600 hover:underline"
                        >
                            &larr; Kembali ke Daftar Siswa
                        </Link>
                        <FlashMessage success={flash?.success} error={flash?.error} />
                        
                        {/* 1. Form Input Pembayaran */}
                        <div className="p-6 bg-white shadow-sm sm:rounded-lg">
                            <h3 className="text-lg font-medium mb-4">Catat Pembayaran Baru</h3>
                            <FormBayar siswa={siswa} tahunDipilih={selectedTahun} />
                        </div>

                        {/* 2. Detail Info Siswa */}
                        <div className="p-6 bg-white shadow-sm sm:rounded-lg">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <h3 className="text-lg font-medium mb-2">Profil Siswa</h3>
                                    <p><strong>Nama:</strong> {siswa.nama_lengkap}</p>
                                    <p><strong>Kelas:</strong> {siswa.kelas}</p>
                                    <p><strong>Alamat:</strong> {siswa.alamat}</p>
                                </div>
                                <div>
                                    <h3 className="text-lg font-medium mb-2">Info Wali</h3>
                                    <p><strong>Nama Wali:</strong> {siswa.nama_wali}</p>
                                    <p>
                                        <strong>No. Telp Wali:</strong> 
                                        <a 
                                            href={`https://wa.me/${siswa.no_telp_wali?.replace(/^0/, '62')}`} 
                                            target="_blank" 
                                            rel="noopener noreferrer" 
                                            className="text-blue-600 hover:underline ml-1"
                                        >
                                            {siswa.no_telp_wali} (Chat WA)
                                        </a>
                                    </p>
                                </div>
                            </div>
                        </div>
                        
                        {/* 3. Status Tunggakan 12 Bulan */}
                        <div className="p-6 bg-white shadow-sm sm:rounded-lg">
                            <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-4 space-y-2 sm:space-y-0">
                                <h3 className="text-lg font-medium">Status Infaq ({selectedTahun})</h3>
                                <div className="flex items-center space-x-4">
                                    <select 
                                        value={selectedTahun} 
                                        onChange={handleTahunChange}
                                        className="border-gray-300 rounded-md shadow-sm"
                                    >
                                        <option value="2024">2024</option>
                                        <option value="2025">2025</option>
                                        <option value="2026">2026</option>
                                    </select>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                                {statusPembayaran.map((item) => (
                                    <div 
                                        key={item.bulan_num}
                                        className={`p-4 rounded-lg text-center ${
                                            item.status === 'Lunas' ? 'bg-green-100' : 'bg-red-100'
                                        }`}
                                    >
                                        <div className="font-semibold text-lg">{item.bulan}</div>
                                        <div className={`font-bold ${
                                            item.status === 'Lunas' ? 'text-green-700' : 'text-red-700'
                                        }`}>
                                            {item.status}
                                        </div>
                                        {item.status === 'Lunas' && (
                                            <div className="text-xs text-gray-600">
                                                <div>Rp {Number(item.detail?.jumlah_bayar || 0).toLocaleString('id-ID')}</div>
                                                <div>({item.detail?.tanggal_bayar})</div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                        
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}