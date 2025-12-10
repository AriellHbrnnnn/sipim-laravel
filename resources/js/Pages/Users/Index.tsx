import { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PageProps, User } from '@/types';
import { Plus, Edit, Trash2, Search, Shield, User as UserIcon } from 'lucide-react';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import ConfirmModal from '@/Components/ConfirmModal';

interface UsersPageProps extends PageProps {
    users: User[];
}

export default function UsersIndex({ auth, users }: UsersPageProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [userToDelete, setUserToDelete] = useState<User | null>(null);

    const { data, setData, post, put, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        role: 'employee' as 'owner' | 'employee',
    });

    const { delete: destroy } = useForm();

    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (editingUser) {
            put(`/users/${editingUser.id}`, {
                preserveScroll: true,
                onSuccess: () => {
                    setShowModal(false);
                    resetForm();
                }
            });
        } else {
            post('/users', {
                preserveScroll: true,
                onSuccess: () => {
                    setShowModal(false);
                    resetForm();
                }
            });
        }
    };

    const handleEdit = (user: User) => {
        setEditingUser(user);
        setData({
            name: user.name,
            email: user.email,
            password: '',
            role: user.role,
        });
        setShowModal(true);
    };

    const handleDelete = (user: User) => {
        if (user.id === auth.user.id) {
            return; // Can't delete yourself
        }
        setUserToDelete(user);
        setShowDeleteModal(true);
    };

    const confirmDelete = () => {
        if (userToDelete) {
            destroy(`/users/${userToDelete.id}`, {
                preserveScroll: true,
                onSuccess: () => {
                    setShowDeleteModal(false);
                    setUserToDelete(null);
                }
            });
        }
    };

    const resetForm = () => {
        reset();
        setEditingUser(null);
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800">Users</h2>}
        >
            <Head title="Users" />

            <div className="space-y-6">
                {/* Toolbar */}
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex flex-col sm:flex-row gap-3 justify-between">
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Search users..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                        <button
                            onClick={() => setShowModal(true)}
                            className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                        >
                            <Plus className="w-5 h-5" />
                            Add User
                        </button>
                    </div>
                </div>

                {/* Table */}
                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredUsers.map((user) => (
                                <tr key={user.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                                        {user.name}
                                        {user.id === auth.user.id && (
                                            <span className="ml-2 text-xs text-blue-600">(You)</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600">
                                        {user.email}
                                    </td>
                                    <td className="px-6 py-4 text-sm">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium ${user.role === 'owner'
                                                ? 'bg-blue-100 text-blue-800'
                                                : 'bg-gray-100 text-gray-800'
                                            }`}>
                                            {user.role === 'owner' ? <Shield className="w-3 h-3 mr-1" /> : <UserIcon className="w-3 h-3 mr-1" />}
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right text-sm">
                                        <button
                                            onClick={() => handleEdit(user)}
                                            className="text-blue-600 hover:text-blue-900 mr-3"
                                        >
                                            <Edit className="w-4 h-4" />
                                        </button>
                                        {user.id !== auth.user.id && (
                                            <button
                                                onClick={() => handleDelete(user)}
                                                className="text-red-600 hover:text-red-900"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Create/Edit Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg max-w-md w-full shadow-xl">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-900">
                                {editingUser ? 'Edit User' : 'Add New User'}
                            </h3>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <InputLabel htmlFor="name" value="Name" />
                                <TextInput
                                    id="name"
                                    value={data.name}
                                    onChange={(e: any) => setData('name', e.target.value)}
                                    error={errors.name}
                                    required
                                />
                                <InputError message={errors.name} />
                            </div>

                            <div>
                                <InputLabel htmlFor="email" value="Email" />
                                <TextInput
                                    id="email"
                                    type="email"
                                    value={data.email}
                                    onChange={(e: any) => setData('email', e.target.value)}
                                    error={errors.email}
                                    required
                                />
                                <InputError message={errors.email} />
                            </div>

                            <div>
                                <InputLabel htmlFor="password" value={editingUser ? 'Password (leave blank to keep current)' : 'Password'} />
                                <TextInput
                                    id="password"
                                    type="password"
                                    value={data.password}
                                    onChange={(e: any) => setData('password', e.target.value)}
                                    error={errors.password}
                                    required={!editingUser}
                                />
                                <InputError message={errors.password} />
                            </div>

                            <div>
                                <InputLabel htmlFor="role" value="Role" />
                                <select
                                    id="role"
                                    value={data.role}
                                    onChange={(e: any) => setData('role', e.target.value as 'owner' | 'employee')}
                                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-all ${errors.role
                                            ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                                            : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                                        }`}
                                    required
                                >
                                    <option value="employee">Employee</option>
                                    <option value="owner">Owner</option>
                                </select>
                                <InputError message={errors.role} />
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowModal(false);
                                        resetForm();
                                    }}
                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium"
                                    disabled={processing}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium disabled:opacity-50"
                                    disabled={processing}
                                >
                                    {processing ? 'Saving...' : (editingUser ? 'Update' : 'Create')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            <ConfirmModal
                show={showDeleteModal}
                title="Delete User"
                message={`Are you sure you want to delete "${userToDelete?.name}"? This action cannot be undone.`}
                confirmText="Delete"
                cancelText="Cancel"
                type="danger"
                onConfirm={confirmDelete}
                onCancel={() => {
                    setShowDeleteModal(false);
                    setUserToDelete(null);
                }}
            />
        </AuthenticatedLayout>
    );
}