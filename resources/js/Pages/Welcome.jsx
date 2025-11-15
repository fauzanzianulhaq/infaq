import { Head, Link } from '@inertiajs/react';

export default function Welcome({ auth }) {
    const user = auth.user;

    return (
        <>
            <Head title="Sistem Catat Infaq" />
            
            {/* Wrapper utama dengan gradient biru seperti dashboard */}
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
                
                {/* === HEADER & NAVIGASI === */}
                <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-lg border-b border-blue-200/50 shadow-lg">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex h-20 justify-between items-center">
                            
                            {/* Logo & Brand */}
                            <Link href="/" className="flex items-center space-x-3">
                                <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg">
                                    <img 
                                        src="/images/Logo.png" 
                                        alt="InfaQ Logo" 
                                        className="h-8 w-8 object-contain"
                                        onError={(e) => {
                                            e.target.style.display = 'none';
                                            e.target.nextSibling.style.display = 'flex';
                                        }}
                                    />
                                    {/* Fallback logo */}
                                    <div className="h-8 w-8 bg-white rounded flex items-center justify-center text-blue-600 font-bold text-sm" style={{display: 'none'}}>
                                        IS
                                    </div>
                                </div>
                                <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                    Catat Infaq
                                </span>
                            </Link>
                            
                            {/* Navigasi */}
                            <nav className="flex items-center space-x-4">
                                {user ? (
                                    <Link
                                        href={user.role === 'admin' ? '/admin/dashboard' : '/dashboard'}
                                        className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 border border-gray-200 font-medium"
                                    >
                                        <span>📊</span>
                                        <span>Dashboard</span>
                                    </Link>
                                ) : (
                                    <>
                                        <Link
                                            href="/login"
                                            className="px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 font-medium"
                                        >
                                            Masuk
                                        </Link>
                                        <Link
                                            href="/register"
                                            className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 font-medium hover:scale-105"
                                        >
                                            Daftar
                                        </Link>
                                    </>
                                )}
                            </nav>
                        </div>
                    </div>
                </header>

                {/* === KONTEN UTAMA === */}
                <main>
                    
                    {/* Hero Section */}
                    <section className="relative py-20 px-4 sm:py-32">
                        <div className="max-w-7xl mx-auto text-center">
                            <div className="max-w-4xl mx-auto">
                                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-800 mb-6">
                                    Kelola Infaq Sekolah dengan{' '}
                                    <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                        Mudah & Terstruktur
                                    </span>
                                </h1>
                                <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                                    Sistem terintegrasi untuk mencatat, memantau, dan melaporkan infaq siswa. 
                                    Membantu administrasi sekolah menjadi lebih efisien dan transparan.
                                </p>
                                
                                {/* CTA Buttons */}
                                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-10">
                                    <Link
                                        href={user ? (user.role === 'admin' ? '/admin/dashboard' : '/dashboard') : '/login'}
                                        className="group flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                                    >
                                        <span>🚀</span>
                                        <span>Mulai Sekarang</span>
                                        <span className="group-hover:translate-x-1 transition-transform duration-200">→</span>
                                    </Link>
                                    
                                    {!user && (
                                        <Link
                                            href="/register"
                                            className="px-8 py-4 border-2 border-blue-600 text-blue-600 text-lg font-semibold rounded-xl hover:bg-blue-600 hover:text-white transition-all duration-300"
                                        >
                                            Daftar Gratis
                                        </Link>
                                    )}
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Features Section */}
                    <section className="py-20 px-4 bg-white/50 backdrop-blur-sm">
                        <div className="max-w-7xl mx-auto">
                            <div className="text-center mb-16">
                                <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4">
                                    Fitur Unggulan Sistem InfaQ
                                </h2>
                                <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                                    Semua yang Anda butuhkan untuk mengelola infaq sekolah dalam satu platform
                                </p>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {/* Feature 1 */}
                                <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200/50 hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center text-white text-xl mb-4">
                                        💰
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-800 mb-3">Pencatatan Real-time</h3>
                                    <p className="text-gray-600">
                                        Catat setiap transaksi infaq secara real-time dengan antarmuka yang mudah digunakan.
                                    </p>
                                </div>
                                
                                {/* Feature 2 */}
                                <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200/50 hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center text-white text-xl mb-4">
                                        📊
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-800 mb-3">Laporan Otomatis</h3>
                                    <p className="text-gray-600">
                                        Generate laporan keuangan otomatis dengan grafik dan statistik yang informatif.
                                    </p>
                                </div>
                                
                                {/* Feature 3 */}
                                <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200/50 hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                                    <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center text-white text-xl mb-4">
                                        👨‍🎓
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-800 mb-3">Manajemen Siswa</h3>
                                    <p className="text-gray-600">
                                        Kelola data siswa dan histori pembayaran infaq dengan sistem yang terorganisir.
                                    </p>
                                </div>
                                
                                {/* Feature 4 */}
                                <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200/50 hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                                    <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg flex items-center justify-center text-white text-xl mb-4">
                                        🔒
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-800 mb-3">Keamanan Data</h3>
                                    <p className="text-gray-600">
                                        Data keuangan sekolah terlindungi dengan sistem keamanan berlapis.
                                    </p>
                                </div>
                                
                                {/* Feature 5 */}
                                <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200/50 hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                                    <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-red-600 rounded-lg flex items-center justify-center text-white text-xl mb-4">
                                        📱
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-800 mb-3">Responsive Design</h3>
                                    <p className="text-gray-600">
                                        Akses sistem dari desktop, tablet, atau smartphone dengan tampilan yang optimal.
                                    </p>
                                </div>
                                
                                {/* Feature 6 */}
                                <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200/50 hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                                    <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-lg flex items-center justify-center text-white text-xl mb-4">
                                        🚀
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-800 mb-3">Cepat & Efisien</h3>
                                    <p className="text-gray-600">
                                        Proses data dengan cepat, mengurangi waktu administrasi hingga 70%.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* How It Works Section */}
                    <section className="py-20 px-4">
                        <div className="max-w-7xl mx-auto">
                            <div className="text-center mb-16">
                                <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4">
                                    Mulai dalam 3 Langkah Mudah
                                </h2>
                                <p className="text-xl text-gray-600">
                                    Sistem yang dirancang untuk kemudahan penggunaan
                                </p>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                <div className="text-center">
                                    <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-6 shadow-lg">
                                        1
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-800 mb-3">Daftar Akun</h3>
                                    <p className="text-gray-600">
                                        Buat akun administrator untuk sekolah Anda dalam hitungan menit.
                                    </p>
                                </div>
                                
                                <div className="text-center">
                                    <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-6 shadow-lg">
                                        2
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-800 mb-3">Input Data</h3>
                                    <p className="text-gray-600">
                                        Masukkan data siswa dan mulai mencatat transaksi infaq.
                                    </p>
                                </div>
                                
                                <div className="text-center">
                                    <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-6 shadow-lg">
                                        3
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-800 mb-3">Pantau & Laporkan</h3>
                                    <p className="text-gray-600">
                                        Pantau perkembangan dan generate laporan kapan saja.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* CTA Section */}
                    <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-purple-600">
                        <div className="max-w-4xl mx-auto text-center">
                            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
                                Siap Mengoptimalkan Pengelolaan Infaq Sekolah?
                            </h2>
                            <p className="text-xl text-blue-100 mb-8">
                                Bergabung dengan ratusan sekolah yang telah mempercayakan sistem infaq mereka kepada kami.
                            </p>
                            <Link
                                href={user ? (user.role === 'admin' ? '/admin/dashboard' : '/dashboard') : '/register'}
                                className="inline-flex items-center space-x-2 px-8 py-4 bg-white text-blue-600 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                            >
                                <span>🎯</span>
                                <span>{user ? 'Buka Dashboard' : 'Daftar Sekarang'}</span>
                            </Link>
                        </div>
                    </section>
                </main>

                {/* === FOOTER === */}
                <footer className="bg-gray-800 py-12 text-gray-400">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center">
                            <div className="flex justify-center items-center space-x-3 mb-4">
                                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                                    IS
                                </div>
                                <span className="text-white font-semibold text-lg">InfaQ School</span>
                            </div>
                            <p className="text-sm">
                                &copy; {new Date().getFullYear()} InfaQ School. All rights reserved. | 
                                Dibuat dengan ❤️ oleh Kelompok Gacor
                            </p>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}