import { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PageProps, Supplier } from '@/types';
import { Plus, Edit, Trash2, Search, Phone, Mail, MapPin } from 'lucide-react';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import ConfirmModal from '@/Components/ConfirmModal';

interface SuppliersPageProps extends PageProps {
    suppliers: Supplier[];
}

export default function SuppliersIndex({ auth, suppliers }: SuppliersPageProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
    const [supplierToDelete, setSupplierToDelete] = useState<Supplier | null>(null);

    const { data, setData, post, put, processing, errors, reset } = useForm({
        name: '',
        phone: '',
        email: '',
        address: '',
        products: '',
    });

    const { delete: destroy } = useForm(); 

    const filteredSuppliers = suppliers.filter(supplier =>
        supplier.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        supplier.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (editingSupplier) {
            put(`/suppliers/${editingSupplier.id}`, {
                preserveScroll: true,
                onSuccess: () => {
                    setShowModal(false);
                    resetForm();
                }
            });
        } else {
            post('/suppliers', {
                preserveScroll: true,
                onSuccess: () => {
                    setShowModal(false);
                    resetForm();
                }
            });
        }
    };

    const handleEdit = (supplier: Supplier) => {
        setEditingSupplier(supplier);
        setData({
            name: supplier.name,
            phone: supplier.phone,
            email: supplier.email,
            address: supplier.address,
            products: supplier.products,
        });
        setShowModal(true);
    };

    const handleDelete = (supplier: Supplier) => {
        setSupplierToDelete(supplier);
        setShowDeleteModal(true);
    };

    const confirmDelete = () => {
    if (supplierToDelete) {
        destroy(`/suppliers/${supplierToDelete.id}`, {
            preserveScroll: true,
            onSuccess: () => {
                setShowDeleteModal(false);
                setSupplierToDelete(null);
            }
        });
    }
};

    const resetForm = () => {
        reset();
        setEditingSupplier(null);
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800">Suppliers</h2>}
        >
            <Head title="Suppliers" />

            <div className="space-y-6">
                {/* Toolbar */}
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex flex-col sm:flex-row gap-3 justify-between">
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Search suppliers..."
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
                            Add Supplier
                        </button>
                    </div>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredSuppliers.map((supplier) => (
                        <div key={supplier.id} className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start mb-4">
                                <h3 className="text-lg font-semibold text-gray-900">{supplier.name}</h3>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleEdit(supplier)}
                                        className="text-blue-600 hover:text-blue-900"
                                    >
                                        <Edit className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(supplier)}
                                        className="text-red-600 hover:text-red-900"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                            
                            <div className="space-y-2 text-sm">
                                <div className="flex items-center gap-2 text-gray-600">
                                    <Phone className="w-4 h-4" />
                                    {supplier.phone}
                                </div>
                                <div className="flex items-center gap-2 text-gray-600">
                                    <Mail className="w-4 h-4" />
                                    {supplier.email}
                                </div>
                                <div className="flex items-start gap-2 text-gray-600">
                                    <MapPin className="w-4 h-4 mt-0.5" />
                                    <span>{supplier.address}</span>
                                </div>
                                <div className="pt-2 mt-2 border-t border-gray-200">
                                    <p className="text-xs text-gray-500 mb-1">Products:</p>
                                    <p className="text-gray-900">{supplier.products}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Create/Edit Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg max-w-md w-full shadow-xl max-h-[90vh] overflow-y-auto">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-900">
                                {editingSupplier ? 'Edit Supplier' : 'Add New Supplier'}
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
                                <InputLabel htmlFor="phone" value="Phone" />
                                <TextInput
                                    id="phone"
                                    type="tel"
                                    value={data.phone}
                                    onChange={(e: any) => setData('phone', e.target.value)}
                                    error={errors.phone}
                                    required
                                />
                                <InputError message={errors.phone} />
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
                                <InputLabel htmlFor="address" value="Address" />
                                <textarea
                                    id="address"
                                    value={data.address}
                                    onChange={(e: any) => setData('address', e.target.value)}
                                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                                        errors.address
                                            ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                                            : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                                    }`}
                                    rows={2}
                                    required
                                />
                                <InputError message={errors.address} />
                            </div>
                            
                            <div>
                                <InputLabel htmlFor="products" value="Products" />
                                <textarea
                                    id="products"
                                    value={data.products}
                                    onChange={(e: any) => setData('products', e.target.value)}
                                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                                        errors.products
                                            ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                                            : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                                    }`}
                                    rows={2}
                                    placeholder="e.g., Indomie, Mie Sedaap"
                                    required
                                />
                                <InputError message={errors.products} />
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
                                    {processing ? 'Saving...' : (editingSupplier ? 'Update' : 'Create')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            <ConfirmModal
                show={showDeleteModal}
                title="Delete Supplier"
                message={`Are you sure you want to delete "${supplierToDelete?.name}"? This action cannot be undone.`}
                confirmText="Delete"
                cancelText="Cancel"
                type="danger"
                onConfirm={confirmDelete}
                onCancel={() => {
                    setShowDeleteModal(false);
                    setSupplierToDelete(null);
                }}
            />
        </AuthenticatedLayout>
    );
}