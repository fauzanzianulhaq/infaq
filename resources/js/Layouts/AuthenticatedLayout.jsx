import NavLink from '@/Components/NavLink';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function AuthenticatedLayout({ header, children }) {
    const user = usePage().props.auth.user;
    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
            {/* Modern Navigation Bar */}
            <nav className="bg-white/90 backdrop-blur-lg border-b border-blue-200/50 shadow-lg">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-20 justify-between">
{/* Logo & Brand */}
<div className="flex items-center">
    <div className="flex shrink-0 items-center">
        <Link href="/" className="flex items-center space-x-3">
            {/* LOGO YANG TIDAK GEPENG */}
            <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg flex items-center justify-center">
                {/* Option 1: Jika punya logo square */}
                <img 
                    src="/images/logo.png" 
                    alt="Logo Sekolah" 
                    className="h-8 w-8 object-contain rounded"
                    onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                    }}
                />
                {/* Fallback text logo */}
                <div className="h-8 w-8 bg-white rounded flex items-center justify-center text-blue-600 font-bold text-sm" style={{display: 'none'}}>
                    IS
                </div>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Catat Infaq
            </span>
        </Link>
    </div>

    {/* Desktop Navigation */}
    <div className="hidden md:ml-8 md:flex md:space-x-1">
        {user.role === 'user' && (
            <NavLink
                href="/dashboard"
                active={window.location.pathname === '/dashboard'}
                className="px-4 py-2 rounded-lg transition-all duration-200 hover:bg-blue-50 hover:text-blue-700 font-medium"
            >
                <span className="flex items-center">
                    📊 Dashboard
                </span>
            </NavLink>
        )}

        {user.role === 'admin' && (
            <>
                <NavLink
                    href="/admin/dashboard"
                    active={window.location.pathname === '/admin/dashboard'}
                    className="px-4 py-2 rounded-lg transition-all duration-200 hover:bg-blue-50 hover:text-blue-700 font-medium"
                >
                    <span className="flex items-center">
                        🏠 Dashboard
                    </span>
                </NavLink>
                
                <NavLink 
                    href="/admin/siswa" 
                    active={window.location.pathname.startsWith('/admin/siswa')}
                    className="px-4 py-2 rounded-lg transition-all duration-200 hover:bg-green-50 hover:text-green-700 font-medium"
                >
                    <span className="flex items-center">
                        👨‍🎓 Siswa
                    </span>
                </NavLink>
                
                <NavLink 
                    href="/admin/infaq" 
                    active={window.location.pathname.startsWith('/admin/infaq')}
                    className="px-4 py-2 rounded-lg transition-all duration-200 hover:bg-purple-50 hover:text-purple-700 font-medium"
                >
                    <span className="flex items-center">
                        💰 Infaq
                    </span>
                </NavLink>

                <NavLink 
                    href="/admin/users" 
                    active={window.location.pathname.startsWith('/admin/users')}
                    className="px-4 py-2 rounded-lg transition-all duration-200 hover:bg-orange-50 hover:text-orange-700 font-medium"
                >
                    <span className="flex items-center">
                        👨‍🏫 Guru
                    </span>
                </NavLink>
            </>
        )}
    </div>
</div>

{/* User Menu - TANPA DROPDOWN */}
<div className="flex items-center space-x-4">
    {/* Welcome Text - Desktop */}
    <div className="hidden md:flex md:items-center md:space-x-4">
        <div className="text-right">
            <p className="text-sm text-gray-600">Halo,</p>
            <p className="text-sm font-semibold text-gray-800">{user.name}</p>
        </div>
        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
            {user.name.charAt(0).toUpperCase()}
        </div>
    </div>

    {/* Profile & Logout Buttons - TANPA DROPDOWN */}
    <div className="hidden md:flex md:items-center md:space-x-2">
        <Link 
            href="/profile" 
            className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 border border-gray-200"
        >
            <span>👤</span>
            <span>Profile</span>
        </Link>
        
        <Link 
            href="/logout" 
            method="post" 
            as="button"
            className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 border border-gray-200"
        >
            <span>🚪</span>
            <span>Logout</span>
        </Link>
    </div>

    {/* Mobile menu button */}
    <div className="flex items-center md:hidden">
        <button
            onClick={() => setShowingNavigationDropdown(!showingNavigationDropdown)}
            className="p-3 rounded-lg bg-white/80 border border-gray-300 hover:bg-white hover:shadow-md transition-all duration-200"
        >
            {showingNavigationDropdown ? (
                <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
            ) : (
                <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
            )}
        </button>
    </div>
</div>
                    </div>
                </div>

                {/* Mobile Navigation Menu */}
                <div className={`${showingNavigationDropdown ? 'block' : 'hidden'} md:hidden bg-white/95 backdrop-blur-lg border-t border-blue-200/50 shadow-lg`}>
                    <div className="px-4 pt-4 pb-6 space-y-2">
                        {/* User Info Mobile */}
                        <div className="px-3 py-4 border-b border-gray-200/50 mb-2">
                            <div className="flex items-center space-x-3">
                                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                                    {user.name.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-gray-900">{user.name}</p>
                                    <p className="text-xs text-gray-500">{user.email}</p>
                                    <p className="text-xs text-blue-600 font-medium capitalize">
                                        {user.role === 'admin' ? 'Administrator' : 'Guru'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Mobile Navigation Links */}
                        {user.role === 'user' && (
                            <ResponsiveNavLink
                                href="/dashboard"
                                active={window.location.pathname === '/dashboard'}
                                className="flex items-center px-4 py-3 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors duration-200 text-base font-medium"
                            >
                                <span className="mr-3 text-lg">📊</span>
                                Dashboard
                            </ResponsiveNavLink>
                        )}

                        {user.role === 'admin' && (
                            <>
                                <ResponsiveNavLink
                                    href="/admin/dashboard"
                                    active={window.location.pathname === '/admin/dashboard'}
                                    className="flex items-center px-4 py-3 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors duration-200 text-base font-medium"
                                >
                                    <span className="mr-3 text-lg">🏠</span>
                                    Admin Dashboard
                                </ResponsiveNavLink>
                                
                                <ResponsiveNavLink 
                                    href="/admin/siswa" 
                                    active={window.location.pathname.startsWith('/admin/siswa')}
                                    className="flex items-center px-4 py-3 rounded-lg text-gray-700 hover:bg-green-50 hover:text-green-700 transition-colors duration-200 text-base font-medium"
                                >
                                    <span className="mr-3 text-lg">👨‍🎓</span>
                                    Kelola Siswa
                                </ResponsiveNavLink>
                                
                                <ResponsiveNavLink 
                                    href="/admin/infaq" 
                                    active={window.location.pathname.startsWith('/admin/infaq')}
                                    className="flex items-center px-4 py-3 rounded-lg text-gray-700 hover:bg-purple-50 hover:text-purple-700 transition-colors duration-200 text-base font-medium"
                                >
                                    <span className="mr-3 text-lg">💰</span>
                                    Kelola Infaq
                                </ResponsiveNavLink>
                                
                                <ResponsiveNavLink 
                                    href="/admin/users" 
                                    active={window.location.pathname.startsWith('/admin/users')}
                                    className="flex items-center px-4 py-3 rounded-lg text-gray-700 hover:bg-orange-50 hover:text-orange-700 transition-colors duration-200 text-base font-medium"
                                >
                                    <span className="mr-3 text-lg">👨‍🏫</span>
                                    Kelola Guru
                                </ResponsiveNavLink>
                            </>
                        )}

                        {/* Mobile Profile Links */}
                        <div className="pt-4 border-t border-gray-200/50 mt-4 space-y-2">
                            <ResponsiveNavLink 
                                href="/profile"
                                className="flex items-center px-4 py-3 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors duration-200 text-base font-medium"
                            >
                                <span className="mr-3 text-lg">👤</span>
                                Profile Saya
                            </ResponsiveNavLink>
                            
                            <ResponsiveNavLink
                                method="post"
                                href="/logout"
                                as="button"
                                className="flex items-center px-4 py-3 rounded-lg text-gray-700 hover:bg-red-50 hover:text-red-700 transition-colors duration-200 text-base font-medium w-full text-left"
                            >
                                <span className="mr-3 text-lg">🚪</span>
                                Keluar
                            </ResponsiveNavLink>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Page Content */}
            {header && (
                <header className="bg-white/80 backdrop-blur-sm shadow-sm">
                    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                        {header}
                    </div>
                </header>
            )}

            <main className="relative">
                {children}
            </main>
        </div>
    );
}