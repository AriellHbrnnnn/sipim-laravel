import { useState } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PageProps, Product } from '@/types';
import { Plus, Edit, Trash2, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import ConfirmModal from '@/Components/ConfirmModal';

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface PaginatedProducts {
    data: Product[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    links: PaginationLink[];
}

interface ProductsPageProps extends PageProps {
    products: PaginatedProducts;
    filters: {
        search?: string;
    };
}

export default function ProductsIndex({ auth, products, filters }: ProductsPageProps) {
    const [searchQuery, setSearchQuery] = useState(filters.search || '');
    const [showModal, setShowModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [productToDelete, setProductToDelete] = useState<Product | null>(null);

    const { data, setData, post, put, processing, errors, reset } = useForm({
        name: '',
        category: '',
        price: '',
        cost: '',
        stock: '',
    });

    const { delete: destroy } = useForm();

    const totalStock = products.data.reduce((sum, p) => sum + p.stock, 0);
    const lowStockCount = products.data.filter(p => p.stock < 10).length;

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/products', { search: searchQuery }, { preserveState: true });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (editingProduct) {
            put(`/products/${editingProduct.id}`, {
                preserveScroll: true,
                onSuccess: () => {
                    setShowModal(false);
                    resetForm();
                }
            });
        } else {
            post('/products', {
                preserveScroll: true,
                onSuccess: () => {
                    setShowModal(false);
                    resetForm();
                }
            });
        }
    };

    const handleEdit = (product: Product) => {
        setEditingProduct(product);
        setData({
            name: product.name,
            category: product.category,
            price: product.price.toString(),
            cost: product.cost.toString(),
            stock: product.stock.toString(),
        });
        setShowModal(true);
    };

    const handleDelete = (product: Product) => {
        setProductToDelete(product);
        setShowDeleteModal(true);
    };

    const confirmDelete = () => {
        if (productToDelete) {
            destroy(`/products/${productToDelete.id}`, {
                preserveScroll: true,
                onSuccess: () => {
                    setShowDeleteModal(false);
                    setProductToDelete(null);
                }
            });
        }
    };

    const resetForm = () => {
        reset();
        setEditingProduct(null);
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800">Products</h2>}
        >
            <Head title="Products" />

            <div className="space-y-6">
                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                        <div className="text-sm text-gray-600 mb-1">Total Products</div>
                        <div className="text-2xl font-semibold text-gray-900">{products.total}</div>
                    </div>
                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                        <div className="text-sm text-gray-600 mb-1">Total Stock</div>
                        <div className="text-2xl font-semibold text-gray-900">{totalStock}</div>
                    </div>
                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                        <div className="text-sm text-gray-600 mb-1">Low Stock Alert</div>
                        <div className="text-2xl font-semibold text-red-600">{lowStockCount}</div>
                    </div>
                </div>

                {/* Toolbar */}
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex flex-col sm:flex-row gap-3 justify-between">
                        <form onSubmit={handleSearch} className="relative flex-1 max-w-md">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Search products..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </form>
                        {auth.user.role === 'owner' && (
                            <button
                                onClick={() => setShowModal(true)}
                                className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                            >
                                <Plus className="w-5 h-5" />
                                Add Product
                            </button>
                        )}
                    </div>
                </div>

                {/* Table */}
                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cost</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stock</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sold</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {products.data.map((product) => (
                                <tr key={product.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                                        {product.name}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                                            {product.category}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-900">
                                        Rp {product.price.toLocaleString('id-ID')}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600">
                                        Rp {product.cost.toLocaleString('id-ID')}
                                    </td>
                                    <td className="px-6 py-4 text-sm">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium ${
                                            product.stock < 10 
                                                ? 'bg-red-100 text-red-800' 
                                                : 'bg-green-100 text-green-800'
                                        }`}>
                                            {product.stock}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600">
                                        {product.sold}
                                    </td>
                                    <td className="px-6 py-4 text-right text-sm">
                                        {auth.user.role === 'owner' ? (
                                            <>
                                                <button
                                                    onClick={() => handleEdit(product)}
                                                    className="text-blue-600 hover:text-blue-900 mr-3"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(product)}
                                                    className="text-red-600 hover:text-red-900"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </>
                                        ) : (
                                            <span className="text-gray-400 text-xs">View Only</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* Pagination */}
                    {products.last_page > 1 && (
                        <div className="px-6 py-4 border-t border-gray-200">
                            <div className="flex items-center justify-between">
                                <div className="text-sm text-gray-700">
                                    Showing <span className="font-medium">{products.data.length}</span> of{' '}
                                    <span className="font-medium">{products.total}</span> results
                                </div>
                                <div className="flex gap-2">
                                    {products.links.map((link, index) => {
                                        if (link.label === '&laquo; Previous') {
                                            return (
                                                <button
                                                    key={index}
                                                    onClick={() => link.url && router.get(link.url)}
                                                    disabled={!link.url}
                                                    className="px-3 py-1 border border-gray-300 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                                                >
                                                    <ChevronLeft className="w-4 h-4" />
                                                </button>
                                            );
                                        }
                                        if (link.label === 'Next &raquo;') {
                                            return (
                                                <button
                                                    key={index}
                                                    onClick={() => link.url && router.get(link.url)}
                                                    disabled={!link.url}
                                                    className="px-3 py-1 border border-gray-300 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                                                >
                                                    <ChevronRight className="w-4 h-4" />
                                                </button>
                                            );
                                        }
                                        return (
                                            <button
                                                key={index}
                                                onClick={() => link.url && router.get(link.url)}
                                                className={`px-3 py-1 border rounded-lg text-sm ${
                                                    link.active
                                                        ? 'bg-blue-600 text-white border-blue-600'
                                                        : 'border-gray-300 hover:bg-gray-50'
                                                }`}
                                            >
                                                {link.label}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Create/Edit Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg max-w-md w-full shadow-xl">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-900">
                                {editingProduct ? 'Edit Product' : 'Add New Product'}
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
                                <InputLabel htmlFor="category" value="Category" />
                                <select
                                    id="category"
                                    value={data.category}
                                    onChange={(e: any) => setData('category', e.target.value)}
                                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                                        errors.category
                                            ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                                            : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                                    }`}
                                    required
                                >
                                    <option value="">Select Category</option>
                                    <option value="Food">Food</option>
                                    <option value="Beverages">Beverages</option>
                                    <option value="Snacks">Snacks</option>
                                    <option value="Dairy">Dairy</option>
                                    <option value="Personal Care">Personal Care</option>
                                    <option value="Household">Household</option>
                                </select>
                                <InputError message={errors.category} />
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <InputLabel htmlFor="price" value="Price" />
                                    <TextInput
                                        id="price"
                                        type="number"
                                        value={data.price}
                                        onChange={(e: any) => setData('price', e.target.value)}
                                        error={errors.price}
                                        required
                                    />
                                    <InputError message={errors.price} />
                                </div>
                                <div>
                                    <InputLabel htmlFor="cost" value="Cost" />
                                    <TextInput
                                        id="cost"
                                        type="number"
                                        value={data.cost}
                                        onChange={(e: any) => setData('cost', e.target.value)}
                                        error={errors.cost}
                                        required
                                    />
                                    <InputError message={errors.cost} />
                                </div>
                            </div>
                            
                            <div>
                                <InputLabel htmlFor="stock" value="Stock" />
                                <TextInput
                                    id="stock"
                                    type="number"
                                    value={data.stock}
                                    onChange={(e: any) => setData('stock', e.target.value)}
                                    error={errors.stock}
                                    required
                                />
                                <InputError message={errors.stock} />
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
                                    {processing ? 'Saving...' : (editingProduct ? 'Update' : 'Create')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            <ConfirmModal
                show={showDeleteModal}
                title="Delete Product"
                message={`Are you sure you want to delete "${productToDelete?.name}"? This action cannot be undone.`}
                confirmText="Delete"
                cancelText="Cancel"
                type="danger"
                onConfirm={confirmDelete}
                onCancel={() => {
                    setShowDeleteModal(false);
                    setProductToDelete(null);
                }}
            />
        </AuthenticatedLayout>
    );
}