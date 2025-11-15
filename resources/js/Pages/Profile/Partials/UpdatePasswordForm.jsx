import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { useForm } from '@inertiajs/react';
import { Transition } from '@headlessui/react';

export default function UpdatePasswordForm({ className = '' }) {
    const { data, setData, errors, put, reset, processing, recentlySuccessful } = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
    e.preventDefault();
    put('/password', {  // Ganti route() dengan URL langsung
        preserveScroll: true,
        onSuccess: () => {
            reset();
            setData({
                current_password: '',
                password: '',
                password_confirmation: '',
            });
        },
        onError: (errors) => {
            if (errors.password) {
                reset('password', 'password_confirmation');
            }
        },
    });
};

    return (
        <section className={className}>
            <form onSubmit={submit} className="space-y-6">
                <div>
                    <InputLabel htmlFor="current_password" value="Password Saat Ini" className="text-gray-700 font-medium" />
                    <TextInput
                        id="current_password"
                        type="password"
                        className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition duration-200"
                        value={data.current_password}
                        onChange={(e) => setData('current_password', e.target.value)}
                        autoComplete="current-password"
                    />
                    <InputError message={errors.current_password} className="mt-2" />
                </div>

                <div>
                    <InputLabel htmlFor="password" value="Password Baru" className="text-gray-700 font-medium" />
                    <TextInput
                        id="password"
                        type="password"
                        className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition duration-200"
                        value={data.password}
                        onChange={(e) => setData('password', e.target.value)}
                        autoComplete="new-password"
                    />
                    <InputError message={errors.password} className="mt-2" />
                </div>

                <div>
                    <InputLabel htmlFor="password_confirmation" value="Konfirmasi Password Baru" className="text-gray-700 font-medium" />
                    <TextInput
                        id="password_confirmation"
                        type="password"
                        className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition duration-200"
                        value={data.password_confirmation}
                        onChange={(e) => setData('password_confirmation', e.target.value)}
                        autoComplete="new-password"
                    />
                    <InputError message={errors.password_confirmation} className="mt-2" />
                </div>

                <div className="flex items-center gap-4">
                    <PrimaryButton 
                        disabled={processing}
                        className="bg-green-600 hover:bg-green-700 focus:bg-green-700 active:bg-green-800 transition duration-200 shadow-lg px-6 py-2"
                    >
                        {processing ? 'Loading...' : 'Update Password'}
                    </PrimaryButton>

                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-in-out"
                        enterFrom="opacity-0"
                        leave="transition ease-in-out"
                        leaveTo="opacity-0"
                    >
                        <p className="text-sm text-green-600 font-medium flex items-center">
                            <span className="mr-1">✅</span>
                            Password berhasil diupdate!
                        </p>
                    </Transition>
                </div>
            </form>
        </section>
    );
}