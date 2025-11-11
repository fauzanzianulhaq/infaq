import { useEffect } from 'react';
import InputError from '@/Components/InputError';
import { Head, Link, useForm } from '@inertiajs/react';

// Icon untuk input nama (user)
function UserIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A1.875 1.875 0 0 1 18 22.5H6.002c-.997 0-1.808-.74-1.92-1.73A6.002 6.002 0 0 1 4.5 20.118Z" />
        </svg>
    );
}

// Icon untuk input email (amplop)
function EmailIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0Zm0 0c0 1.657 1.007 3 2.25 3S21 13.657 21 12a9 9 0 1 0-2.636 6.364M16.5 12V8.25" />
        </svg>
    );
}

// Icon untuk input password (gembok)
function LockIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
        </svg>
    );
}

// Icon untuk mata (password)
function EyeIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178a1.012 1.012 0 0 1 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
        </svg>
    );
}

// --- Komponen Register Utama ---

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    useEffect(() => {
        return () => {
            reset('password', 'password_confirmation');
        };
    }, []);

    const submit = (e) => {
        e.preventDefault();
        // PERBAIKAN: Ganti route() dengan path langsung
        post('/register');
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-green-800">
            <Head title="Daftar" />

            {/* Header Teks */}
            <div className="mb-8 text-center text-white">
                <h1 className="text-3xl font-bold">Persiapkan akunmu</h1>
                <p className="text-sm text-green-200">
                    Log-in atau Sign-up terlebih dahulu untuk mulai mencatat infaqmu
                </p>
            </div>

            {/* Wrapper untuk Card + Icon di atasnya */}
            <div className="relative w-full max-w-sm">

                {/* Card Putih */}
                <div className="relative pt-16 pb-8 px-6 bg-white rounded-2xl shadow-xl">
                    
                    <h2 className="mb-6 text-2xl font-bold text-center text-gray-900">
                        Daftar Akun
                    </h2>

                    <form onSubmit={submit}>
                        
                        {/* Input Nama Lengkap */}
                        <div className="mb-4">
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                                    <UserIcon />
                                </span>
                                <input
                                    id="name"
                                    type="text"
                                    name="name"
                                    value={data.name}
                                    autoComplete="name"
                                    autoFocus
                                    onChange={(e) => setData('name', e.target.value)}
                                    placeholder="Nama Lengkap"
                                    className="block w-full py-3 pl-10 pr-4 text-gray-900 bg-gray-100 border-none rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                    required
                                />
                            </div>
                            <InputError message={errors.name} className="mt-2" />
                        </div>

                        {/* Input Email/Username */}
                        <div className="mb-4">
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                                    <EmailIcon />
                                </span>
                                <input
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={data.email}
                                    autoComplete="username"
                                    onChange={(e) => setData('email', e.target.value)}
                                    placeholder="Email/Username"
                                    className="block w-full py-3 pl-10 pr-4 text-gray-900 bg-gray-100 border-none rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                    required
                                />
                            </div>
                            <InputError message={errors.email} className="mt-2" />
                        </div>

                        {/* Input Password */}
                        <div className="mb-4">
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                                    <LockIcon />
                                </span>
                                <input
                                    id="password"
                                    type="password"
                                    name="password"
                                    value={data.password}
                                    autoComplete="new-password"
                                    onChange={(e) => setData('password', e.target.value)}
                                    placeholder="Password"
                                    className="block w-full py-3 pl-10 pr-10 text-gray-900 bg-gray-100 border-none rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                    required
                                />
                                <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 cursor-pointer">
                                    <EyeIcon />
                                </span>
                            </div>
                            <InputError message={errors.password} className="mt-2" />
                        </div>
                        
                        {/* Input Konfirmasi Password */}
                        <div className="mb-6">
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                                    <LockIcon />
                                </span>
                                <input
                                    id="password_confirmation"
                                    type="password"
                                    name="password_confirmation"
                                    value={data.password_confirmation}
                                    autoComplete="new-password"
                                    onChange={(e) => setData('password_confirmation', e.target.value)}
                                    placeholder="Konfirmasi Password"
                                    className="block w-full py-3 pl-10 pr-10 text-gray-900 bg-gray-100 border-none rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                    required
                                />
                                <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 cursor-pointer">
                                    <EyeIcon />
                                </span>
                            </div>
                            <InputError message={errors.password_confirmation} className="mt-2" />
                        </div>

                        {/* Tombol Daftar Utama */}
                        <button
                            type="submit"
                            className="w-full py-3 font-semibold text-white bg-green-700 rounded-lg shadow-md transition-colors duration-300 hover:bg-green-800 disabled:opacity-50"
                            disabled={processing}
                        >
                            {processing ? 'Loading...' : 'Daftar'}
                        </button>
                    </form>

                    {/* Toggle Login / Daftar */}
                    <div className="p-1 mt-6 bg-gray-100 rounded-lg flex">
                        {/* Tab Login (Link) */}
                        <Link 
                            href="/login" // PERBAIKAN: Ganti route() dengan path
                            className="w-1/2 py-2 font-medium text-center text-gray-500 transition-colors duration-300 rounded-lg hover:text-green-700"
                        >
                            Login
                        </Link>
                        
                        {/* Tab Daftar (Aktif) */}
                        <div className="w-1/2 py-2 font-semibold text-center text-green-700 bg-white rounded-lg shadow-sm">
                            Daftar
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}