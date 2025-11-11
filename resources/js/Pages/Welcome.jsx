import { Head, Link } from '@inertiajs/react';

// Props 'auth' diteruskan dari rute web.php
export default function Welcome({ auth }) {
    // Kita ambil 'user' dari prop 'auth'
    // 'user' bisa jadi null jika pengunjung belum login
    const user = auth.user;

    return (
        <>
            <Head title="Catat Infaq" />
            
            {/* Wrapper utama halaman */}
            <div className="flex min-h-screen flex-col bg-gray-100 dark:bg-[#559733]">
                
                {/* === HEADER & NAVIGASI === */}
                <header className="sticky top-0 z-50 bg-white shadow-sm dark:bg-[#559733]">
                    <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
                        
                        {/* Logo Sederhana */}
                        <Link href="/">
                            <img 
                                src="/images/Logo.png" 
                                alt="Infaq Logo" 
                                className="h-12 w-auto"
                            />
                        </Link>
                        
                        {/* Navigasi Login/Register/Dashboard */}
                        <nav className="flex items-center space-x-4">
                            {user ? (
                                // **PERBAIKAN:** Ganti route() dengan path langsung
                                <Link
                                    href={user.role === 'admin' ? '/admin/dashboard' : '/dashboard'}
                                    className="rounded-md px-3 py-2 text-sm font-medium text-gray-700 transition hover:text-red-600 dark:text-gray-300 dark:hover:text-red-500"
                                >
                                    Dashboard
                                </Link>
                            ) : (
                                // Jika belum login, tampilkan Login & Register
                                <>
                                    <Link
                                        href="/login"
                                        className="rounded-md px-3 py-2 text-sm font-medium text-gray-700 transition hover:text-green-600 dark:text-gray-300 dark:hover:text-green-500"
                                    >
                                        Log in
                                    </Link>
                                    <Link
                                        href="/register"
                                        className="rounded-md dark:bg-green-700 px-4 py-2 text-sm font-medium text-white transition hover:bg-green-800"
                                    >
                                        Register
                                    </Link>
                                </>
                            )}
                        </nav>
                    </div>
                </header>

                {/* === KONTEN UTAMA HALAMAN === */}
                <main className="flex-grow">
                    
                    {/* Hero Section (Bagian Paling Atas) */}
                    <section className="bg-white py-24 px-4 text-center dark:bg-[#305321] sm:py-32">
                        <div className="container mx-auto max-w-3xl">
                            <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white md:text-5xl">
                                Catat Infaqmu Di Aplikasi Kami
                            </h1>
                            <p className="mt-4 text-lg text-gray-600 dark:text-gray-300 md:text-xl">
                                Setiap infaq Anda sangat berarti untuk memberikan harapan 
                                dan untuk madrasah kita ke depannya.
                            </p>
                            
                            {/* Tombol Call-to-Action (CTA) */}
                            <Link
                                // **PERBAIKAN:** Ganti route() dengan path langsung
                                href={user ? (user.role === 'admin' ? '/admin/dashboard' : '/dashboard') : '/login'}
                                className="mt-8 inline-block rounded-lg bg-green-700 px-10 py-3 text-lg font-medium text-white shadow-lg transition duration-300 hover:-translate-y-1 hover:bg-green-800 focus:outline-none focus:ring-4 focus:ring-red-300"
                            >
                                Infaq Sekarang
                            </Link>
                        </div>
                    </section>

                    {/* Program Section (Program Unggulan) */}
                    <section className="bg-gray-50 py-20 px-4 dark:bg-[#559733]">
                        <div className="container mx-auto max-w-5xl">
                            <h2 className="mb-12 text-center text-3xl font-bold text-gray-900 dark:text-white">
                                Program Infaq Unggulan
                            </h2>
                            <div className="grid gap-8 md:grid-cols-3">
                                {/* Card 1 */}
                                <div className="transform rounded-lg bg-white p-6 shadow-lg transition duration-300 hover:scale-105 dark:bg-green-700">
                                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Infaq Masjid</h3>
                                    <p className="mt-2 text-gray-600 dark:text-gray-300">
                                        Bantu pembangunan dan renovasi masjid agar lebih nyaman.
                                    </p>
                                </div>
                                {/* Card 2 */}
                                <div className="transform rounded-lg bg-white p-6 shadow-lg transition duration-300 hover:scale-105 dark:bg-green-700">
                                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Gaji Pengajar</h3>
                                    <p className="mt-2 text-gray-600 dark:text-gray-300">
                                        memberikan gaji yang layak untuk pengajar.
                                    </p>
                                </div>
                                {/* Card 3 */}
                                <div className="transform rounded-lg bg-white p-6 shadow-lg transition duration-300 hover:scale-105 dark:bg-green-700">
                                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Kondisi Darurat</h3>
                                    <p className="mt-2 text-gray-600 dark:text-gray-300">
                                        Bantu saudara kita yang sedang mengalami kesulitan.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* How-to Section (Cara Berdonasi) */}
                    <section className="bg-white py-20 px-4 dark:bg-[#305321]">
                        <div className="container mx-auto max-w-5xl text-center">
                            <h2 className="mb-12 text-3xl font-bold text-gray-900 dark:text-white">
                                3 Langkah Mudah Berinfaq
                            </h2>
                            <div className="grid gap-8 md:grid-cols-3">
                                <div>
                                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-2xl font-bold text-green-600">1</div>
                                    <h4 className="text-xl font-medium text-gray-900 dark:text-white">Daftar & Login</h4>
                                    <p className="mt-1 text-gray-600 dark:text-gray-300">Buat akun atau masuk jika sudah punya.</p>
                                </div>
                                <div>
                                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-2xl font-bold text-green-600">2</div>
                                    <h4 className="text-xl font-medium text-gray-900 dark:text-white">Pilih Program</h4>
                                    <p className="mt-1 text-gray-600 dark:text-gray-300">Pilih program infaq yang Anda inginkan.</p>
                                </div>
                                <div>
                                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-2xl font-bold text-green-600">3</div>
                                    <h4 className="text-xl font-medium text-gray-900 dark:text-white">Lakukan Donasi</h4>
                                    <p className="mt-1 text-gray-600 dark:text-gray-300">Lakukan pembayaran dan konfirmasi.</p>
                                </div>
                            </div>
                        </div>
                    </section>
                </main>

                {/* === FOOTER === */}
                <footer className="bg-gray-800 py-8 text-center text-gray-400">
                    <div className="container mx-auto">
                        &copy; {new Date().getFullYear()} CatatInfaq. With Kelompok Gacor
                    </div>
                </footer>

            </div>
        </>
    );
}