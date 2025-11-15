import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';
import { Head } from '@inertiajs/react';

export default function Edit({ auth, mustVerifyEmail, status }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Profile</h2>}
        >
            <Head title="Profile" />

            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-3xl mx-auto">
                        {/* Header Section */}
                        <div className="text-center mb-8">
                            <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4">
                                {auth.user.name.charAt(0).toUpperCase()}
                            </div>
                            <h1 className="text-3xl font-bold text-gray-800">Profile Saya</h1>
                            <p className="text-gray-600 mt-2">Kelola informasi profil dan password akun Anda</p>
                        </div>

                        <div className="space-y-6">
                            {/* Update Profile Information Card */}
                            <div className="bg-white rounded-2xl shadow-lg border border-gray-200/50 overflow-hidden">
                                <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4">
                                    <h2 className="text-lg font-semibold text-white flex items-center">
                                        <span className="mr-2">👤</span>
                                        Informasi Profil
                                    </h2>
                                </div>
                                <div className="p-6">
                                    <UpdateProfileInformationForm
                                        mustVerifyEmail={mustVerifyEmail}
                                        status={status}
                                        className="max-w-xl"
                                    />
                                </div>
                            </div>

                            {/* Update Password Card */}
                            <div className="bg-white rounded-2xl shadow-lg border border-gray-200/50 overflow-hidden">
                                <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-6 py-4">
                                    <h2 className="text-lg font-semibold text-white flex items-center">
                                        <span className="mr-2">🔒</span>
                                        Update Password
                                    </h2>
                                </div>
                                <div className="p-6">
                                    <UpdatePasswordForm className="max-w-xl" />
                                </div>
                            </div>

                            {/* Delete Account Card */}
                            <div className="bg-white rounded-2xl shadow-lg border border-gray-200/50 overflow-hidden">
                                <div className="bg-gradient-to-r from-red-600 to-pink-600 px-6 py-4">
                                    <h2 className="text-lg font-semibold text-white flex items-center">
                                        <span className="mr-2">🗑️</span>
                                        Hapus Akun
                                    </h2>
                                </div>
                                <div className="p-6">
                                    <p className="text-sm text-gray-600 mb-4">
                                        Setelah akun Anda dihapus, semua resource dan data akan dihapus secara permanen. 
                                        Sebelum menghapus akun, harap unduh data atau informasi yang ingin Anda simpan.
                                    </p>
                                    <DeleteUserForm className="max-w-xl" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}