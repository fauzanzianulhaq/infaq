import { useEffect } from 'react';
import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import { Head, Link, useForm } from '@inertiajs/react';

// --- Icon Komponen (disisipkan di sini untuk kemudahan) ---

// Icon untuk di atas card (panah masuk)
function LoginIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m-3-6l-3-3m0 0l-3 3m3-3v12" />
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

// --- Komponen Login Utama ---

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    // Reset password saat komponen di-unmount
    useEffect(() => {
        return () => {
            reset('password');
        };
    }, []);

    const submit = (e) => {
        e.preventDefault();
        // PERBAIKAN: Ganti route('login') dengan path langsung
        post('/login');
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-green-800">
            {/* Menggunakan bg-green-800 dari Tailwind sebagai ganti #559733 */}
            <Head title="Log in" />

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
                        Login Akun
                    </h2>

                    {/* Menampilkan status (cth: reset password) */}
                    {status && (
                        <div className="mb-4 text-sm font-medium text-green-600">
                            {status}
                        </div>
                    )}

                    <form onSubmit={submit}>
                        
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
                                    autoFocus
                                    onChange={(e) => setData('email', e.target.value)}
                                    placeholder="Email/Username"
                                    className="block w-full py-3 pl-10 pr-4 text-gray-900 bg-gray-100 border-none rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
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
                                    autoComplete="current-password"
                                    onChange={(e) => setData('password', e.target.value)}
                                    placeholder="Password"
                                    className="block w-full py-3 pl-10 pr-10 text-gray-900 bg-gray-100 border-none rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                />
                                <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 cursor-pointer">
                                    <EyeIcon />
                                </span>
                            </div>
                            <InputError message={errors.password} className="mt-2" />
                        </div>
                        
                        {/* Baris "Ingat saya" & "Lupa password" */}
                        <div className="flex items-center justify-between mb-6">
                            <label className="flex items-center">
                                <Checkbox
                                    name="remember"
                                    checked={data.remember}
                                    onChange={(e) => setData('remember', e.target.checked)}
                                    className="text-green-700" // Mewarnai checkbox
                                />
                                <span className="ml-2 text-sm text-gray-600">Ingat saya?</span>
                            </label>

                            {canResetPassword && (
                                <Link
                                    // PERBAIKAN: Ganti route('password.request') dengan path langsung
                                    href="/forgot-password"
                                    className="text-sm text-green-700 hover:text-green-900 hover:underline"
                                >
                                    Lupa password?
                                </Link>
                            )}
                        </div>

                        {/* Tombol Login Utama */}
                        <button
                            type="submit"
                            className="w-full py-3 font-semibold text-white bg-green-700 rounded-lg shadow-md transition-colors duration-300 hover:bg-green-800 disabled:opacity-50"
                            disabled={processing}
                        >
                            {processing ? 'Loading...' : 'Login'}
                        </button>
                    </form>

                    {/* Toggle Login / Daftar */}
                    <div className="p-1 mt-6 bg-gray-100 rounded-lg flex">
                        {/* Tab Login (Aktif) */}
                        <div className="w-1/2 py-2 font-semibold text-center text-green-700 bg-white rounded-lg shadow-sm">
                            Login
                        </div>
                        
                        {/* Tab Daftar (Link) */}
                        <Link 
                            // PERBAIKAN: Ganti route('register') dengan path langsung
                            href="/register" 
                            className="w-1/2 py-2 font-medium text-center text-gray-500 transition-colors duration-300 rounded-lg hover:text-green-700"
                        >
                            Daftar
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}