import { useState, FormEvent } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PageProps, User } from '@/types';
import { UserCircle, Lock, Save } from 'lucide-react';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';

interface ProfilePageProps extends PageProps {
    user: User & { photo?: string };
}

export default function ProfileEdit({ auth, user }: ProfilePageProps) {
    const [showPasswordForm, setShowPasswordForm] = useState(false);

    // Profile Form
    const { data: profileData, setData: setProfileData, put: updateProfile, processing: profileProcessing, errors: profileErrors } = useForm({
        name: user.name,
        email: user.email,
    });

    // Password Form
    const { data: passwordData, setData: setPasswordData, put: updatePassword, processing: passwordProcessing, errors: passwordErrors, reset: resetPassword } = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const handleProfileSubmit = (e: FormEvent) => {
        e.preventDefault();
        updateProfile('/profile', {
            preserveScroll: true,
        });
    };

    const handlePasswordSubmit = (e: FormEvent) => {
        e.preventDefault();
        updatePassword('/profile/password', {
            preserveScroll: true,
            onSuccess: () => {
                resetPassword();
                setShowPasswordForm(false);
            },
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800">Profile Settings</h2>}
        >
            <Head title="Profile" />

            <div className="max-w-4xl mx-auto space-y-6">
                {/* Profile Photo */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <div className="flex items-center gap-6">
                        {/* Current Photo */}
                        <div className="flex-shrink-0">
                            {user.photo ? (
                                <div className="relative">
                                    <img
                                        src={`/storage/${user.photo}?t=${Date.now()}`}
                                        alt={user.name}
                                        className="w-24 h-24 rounded-full object-cover border-4 border-blue-100"
                                        onLoad={() => console.log('✅ Image loaded successfully')}
                                        onError={(e) => {
                                            console.error('❌ Image failed to load');
                                            console.error('Path:', `/storage/${user.photo}`);
                                            console.error('Full URL:', (e.currentTarget as HTMLImageElement).src);
                                        }}
                                    />
                                    <div className="mt-2 text-xs text-gray-500 break-all max-w-[100px]">
                                        {user.photo}
                                    </div>
                                </div>
                            ) : (
                                <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center border-4 border-blue-200">
                                    <span className="text-3xl font-bold text-blue-600">
                                        {user.name.charAt(0).toUpperCase()}
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Upload Form */}
                        <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Profile Photo</h3>
                            <p className="text-sm text-gray-600 mb-4">
                                Upload a profile photo (JPG, PNG - Max 2MB)
                            </p>
                            
                            <div className="flex gap-3">
                                <label className="cursor-pointer px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors flex items-center gap-2">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    Upload Photo
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={(e) => {
                                            if (e.target.files?.[0]) {
                                                console.log('📁 File selected:', e.target.files[0].name);
                                                
                                                const formData = new FormData();
                                                formData.append('photo', e.target.files[0]);
                                                
                                                router.post('/profile/photo', formData, {
                                                    forceFormData: true,
                                                    preserveScroll: true,
                                                    onSuccess: (page) => {
                                                        console.log('✅ Photo uploaded successfully');
                                                        // If backend updated auth user, log new path
                                                        try {
                                                            // page.props may be typed `any`, be cautious
                                                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                                            const p: any = page;
                                                            console.log('New photo path:', p.props?.auth?.user?.photo);
                                                        } catch (err) {
                                                            // ignore
                                                        }
                                                        // Force page reload to refresh image
                                                        window.location.reload();
                                                    },
                                                    onError: (errors) => {
                                                        console.error('❌ Upload failed:', errors);
                                                    }
                                                });
                                            }
                                        }}
                                    />
                                </label>
                                
                                {user.photo && (
                                    <button
                                        onClick={() => {
                                            if (confirm('Remove profile photo?')) {
                                                router.delete('/profile/photo', {
                                                    preserveScroll: true,
                                                    onSuccess: () => {
                                                        window.location.reload();
                                                    }
                                                });
                                            }
                                        }}
                                        className="px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 font-medium transition-colors"
                                    >
                                        Remove
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Profile Information */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <UserCircle className="w-8 h-8 text-blue-600" />
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900">Profile Information</h3>
                            <p className="text-sm text-gray-600">Update your account profile information</p>
                        </div>
                    </div>

                    <form onSubmit={handleProfileSubmit} className="space-y-4">
                        <div>
                            <InputLabel htmlFor="name" value="Name" />
                            <TextInput
                                id="name"
                                value={profileData.name}
                                onChange={(e: any) => setProfileData('name', e.target.value)}
                                error={profileErrors.name}
                                required
                            />
                            <InputError message={profileErrors.name} />
                        </div>

                        <div>
                            <InputLabel htmlFor="email" value="Email" />
                            <TextInput
                                id="email"
                                type="email"
                                value={profileData.email}
                                onChange={(e: any) => setProfileData('email', e.target.value)}
                                error={profileErrors.email}
                                required
                            />
                            <InputError message={profileErrors.email} />
                        </div>

                        <div>
                            <InputLabel value="Role" />
                            <div className="mt-1 px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm text-gray-700">
                                {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                            </div>
                            <p className="mt-1 text-xs text-gray-500">Your role cannot be changed</p>
                        </div>

                        <div className="flex justify-end pt-4">
                            <button
                                type="submit"
                                disabled={profileProcessing}
                                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors flex items-center gap-2 disabled:opacity-50"
                            >
                                <Save className="w-4 h-4" />
                                {profileProcessing ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Password */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <Lock className="w-8 h-8 text-blue-600" />
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900">Update Password</h3>
                            <p className="text-sm text-gray-600">Ensure your account is using a secure password</p>
                        </div>
                    </div>

                    {!showPasswordForm ? (
                        <button
                            onClick={() => setShowPasswordForm(true)}
                            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium transition-colors"
                        >
                            Change Password
                        </button>
                    ) : (
                        <form onSubmit={handlePasswordSubmit} className="space-y-4">
                            <div>
                                <InputLabel htmlFor="current_password" value="Current Password" />
                                <TextInput
                                    id="current_password"
                                    type="password"
                                    value={passwordData.current_password}
                                    onChange={(e: any) => setPasswordData('current_password', e.target.value)}
                                    error={passwordErrors.current_password}
                                    required
                                />
                                <InputError message={passwordErrors.current_password} />
                            </div>

                            <div>
                                <InputLabel htmlFor="password" value="New Password" />
                                <TextInput
                                    id="password"
                                    type="password"
                                    value={passwordData.password}
                                    onChange={(e: any) => setPasswordData('password', e.target.value)}
                                    error={passwordErrors.password}
                                    required
                                />
                                <InputError message={passwordErrors.password} />
                                <p className="mt-1 text-xs text-gray-500">Minimum 8 characters</p>
                            </div>

                            <div>
                                <InputLabel htmlFor="password_confirmation" value="Confirm Password" />
                                <TextInput
                                    id="password_confirmation"
                                    type="password"
                                    value={passwordData.password_confirmation}
                                    onChange={(e: any) => setPasswordData('password_confirmation', e.target.value)}
                                    error={passwordErrors.password_confirmation}
                                    required
                                />
                                <InputError message={passwordErrors.password_confirmation} />
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowPasswordForm(false);
                                        resetPassword();
                                    }}
                                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium text-gray-700"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={passwordProcessing}
                                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors flex items-center gap-2 disabled:opacity-50"
                                >
                                    <Save className="w-4 h-4" />
                                    {passwordProcessing ? 'Updating...' : 'Update Password'}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
