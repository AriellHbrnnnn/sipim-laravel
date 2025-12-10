import { useState, FormEvent } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PageProps } from '@/types';
import { 
    Store, 
    Receipt, 
    DollarSign, 
    Save, 
    Upload,
    Download,
    Building2,
    Phone,
    Mail,
    MapPin,
    Percent,
    FileText,
    Database,
    AlertCircle,
    CheckCircle,
    TrendingUp,
    Package,
    Calendar
} from 'lucide-react';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';

interface Setting {
    id: number;
    store_name: string;
    store_phone: string | null;
    store_email: string | null;
    store_address: string | null;
    currency: string;
    currency_symbol: string;
    receipt_header: string | null;
    receipt_footer: string | null;
    tax_enabled: boolean;
    tax_percentage: number;
}

interface SettingsPageProps extends PageProps {
    settings: Setting;
    importStats?: {
        total_products: number;
        total_transactions: number;
        total_revenue: number;
        last_import: string | null;
    };
}

export default function SettingsIndex({ auth, settings, importStats }: SettingsPageProps) {
    const [activeTab, setActiveTab] = useState<'store' | 'finance' | 'receipt' | 'data'>('store');

    const { data, setData, put, processing, errors } = useForm({
        store_name: settings?.store_name || 'SIPIM Store',
        store_phone: settings?.store_phone || '',
        store_email: settings?.store_email || '',
        store_address: settings?.store_address || '',
        currency: settings?.currency || 'IDR',
        currency_symbol: settings?.currency_symbol || 'Rp',
        receipt_header: settings?.receipt_header || '',
        receipt_footer: settings?.receipt_footer || '',
        tax_enabled: settings?.tax_enabled || false,
        tax_percentage: settings?.tax_percentage || 0,
    });

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        put('/settings', { preserveScroll: true });
    };

    const tabs = [
        { id: 'store', label: 'Store Info', icon: Store, color: 'blue' },
        { id: 'finance', label: 'Finance', icon: DollarSign, color: 'green' },
        { id: 'receipt', label: 'Receipt', icon: Receipt, color: 'purple' },
        { id: 'data', label: 'Data Import', icon: Database, color: 'orange' },
    ];

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800">Settings</h2>}
        >
            <Head title="Settings" />

            <div className="max-w-5xl mx-auto space-y-6">
                {/* Header Card */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg p-6 text-white shadow-lg">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm">
                                <Store className="w-8 h-8" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold">System Settings</h3>
                                <p className="text-blue-100 text-sm mt-1">
                                    Configure your store and system preferences
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Card with Tabs */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                    {/* Tab Navigation */}
                    <div className="border-b border-gray-200 bg-gray-50">
                        <div className="flex overflow-x-auto">
                            {tabs.map((tab) => {
                                const Icon = tab.icon;
                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id as any)}
                                        className={`flex items-center gap-2 px-6 py-4 font-medium text-sm border-b-2 transition-all whitespace-nowrap ${
                                            activeTab === tab.id
                                                ? 'border-blue-600 text-blue-600 bg-white'
                                                : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                                        }`}
                                    >
                                        <Icon className="w-5 h-5" />
                                        {tab.label}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Tab Content */}
                    <div className="p-6">
                        {/* Store Info Tab */}
                        {activeTab === 'store' && (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                                        Store Information
                                    </h3>
                                    <p className="text-sm text-gray-600">
                                        Basic information about your store that will appear on receipts
                                    </p>
                                </div>

                                <div className="space-y-5">
                                    {/* Store Name */}
                                    <div>
                                        <InputLabel htmlFor="store_name">
                                            <div className="flex items-center gap-2">
                                                <Building2 className="w-4 h-4 text-gray-600" />
                                                Store Name *
                                            </div>
                                        </InputLabel>
                                        <TextInput
                                            id="store_name"
                                            value={data.store_name}
                                            onChange={(e: any) => setData('store_name', e.target.value)}
                                            error={errors.store_name}
                                            placeholder="e.g. SIPIM Store"
                                            required
                                            className="mt-2"
                                        />
                                        <InputError message={errors.store_name} className="mt-1" />
                                    </div>

                                    {/* Phone & Email */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        <div>
                                            <InputLabel htmlFor="store_phone">
                                                <div className="flex items-center gap-2">
                                                    <Phone className="w-4 h-4 text-gray-600" />
                                                    Phone Number
                                                </div>
                                            </InputLabel>
                                            <TextInput
                                                id="store_phone"
                                                type="tel"
                                                value={data.store_phone}
                                                onChange={(e: any) => setData('store_phone', e.target.value)}
                                                error={errors.store_phone}
                                                placeholder="(021) 1234-5678"
                                                className="mt-2"
                                            />
                                            <InputError message={errors.store_phone} className="mt-1" />
                                        </div>

                                        <div>
                                            <InputLabel htmlFor="store_email">
                                                <div className="flex items-center gap-2">
                                                    <Mail className="w-4 h-4 text-gray-600" />
                                                    Email Address
                                                </div>
                                            </InputLabel>
                                            <TextInput
                                                id="store_email"
                                                type="email"
                                                value={data.store_email}
                                                onChange={(e: any) => setData('store_email', e.target.value)}
                                                error={errors.store_email}
                                                placeholder="store@example.com"
                                                className="mt-2"
                                            />
                                            <InputError message={errors.store_email} className="mt-1" />
                                        </div>
                                    </div>

                                    {/* Address */}
                                    <div>
                                        <InputLabel htmlFor="store_address">
                                            <div className="flex items-center gap-2">
                                                <MapPin className="w-4 h-4 text-gray-600" />
                                                Store Address
                                            </div>
                                        </InputLabel>
                                        <textarea
                                            id="store_address"
                                            value={data.store_address}
                                            onChange={(e) => setData('store_address', e.target.value)}
                                            className={`mt-2 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
                                                errors.store_address
                                                    ? 'border-red-300 focus:ring-red-500'
                                                    : 'border-gray-300 focus:ring-blue-500'
                                            }`}
                                            rows={3}
                                            placeholder="Jl. Contoh No. 123, Jakarta Selatan, DKI Jakarta 12345"
                                        />
                                        <InputError message={errors.store_address} className="mt-1" />
                                    </div>
                                </div>

                                {/* Save Button */}
                                <div className="flex justify-end pt-4 border-t border-gray-200">
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <Save className="w-4 h-4" />
                                        {processing ? 'Saving...' : 'Save Changes'}
                                    </button>
                                </div>
                            </form>
                        )}

                        {/* Finance Tab */}
                        {activeTab === 'finance' && (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                                        Financial Settings
                                    </h3>
                                    <p className="text-sm text-gray-600">
                                        Configure currency and tax settings for transactions
                                    </p>
                                </div>

                                <div className="space-y-5">
                                    {/* Currency */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        <div>
                                            <InputLabel htmlFor="currency">
                                                <div className="flex items-center gap-2">
                                                    <DollarSign className="w-4 h-4 text-gray-600" />
                                                    Currency Code *
                                                </div>
                                            </InputLabel>
                                            <select
                                                id="currency"
                                                value={data.currency}
                                                onChange={(e) => setData('currency', e.target.value)}
                                                className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            >
                                                <option value="IDR">IDR - Indonesian Rupiah</option>
                                                <option value="USD">USD - US Dollar</option>
                                                <option value="EUR">EUR - Euro</option>
                                                <option value="MYR">MYR - Malaysian Ringgit</option>
                                                <option value="SGD">SGD - Singapore Dollar</option>
                                            </select>
                                            <InputError message={errors.currency} className="mt-1" />
                                        </div>

                                        <div>
                                            <InputLabel htmlFor="currency_symbol">
                                                <div className="flex items-center gap-2">
                                                    <DollarSign className="w-4 h-4 text-gray-600" />
                                                    Currency Symbol *
                                                </div>
                                            </InputLabel>
                                            <TextInput
                                                id="currency_symbol"
                                                value={data.currency_symbol}
                                                onChange={(e: any) => setData('currency_symbol', e.target.value)}
                                                error={errors.currency_symbol}
                                                placeholder="Rp"
                                                required
                                                className="mt-2"
                                            />
                                            <InputError message={errors.currency_symbol} className="mt-1" />
                                        </div>
                                    </div>

                                    {/* Tax Settings */}
                                    <div className="bg-gray-50 rounded-lg p-5 border border-gray-200">
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex items-center gap-3">
                                                <div className={`p-2 rounded-lg ${data.tax_enabled ? 'bg-green-100' : 'bg-gray-200'}`}>
                                                    <Percent className={`w-5 h-5 ${data.tax_enabled ? 'text-green-600' : 'text-gray-400'}`} />
                                                </div>
                                                <div>
                                                    <h4 className="text-sm font-semibold text-gray-900">
                                                        Enable Tax
                                                    </h4>
                                                    <p className="text-xs text-gray-600">
                                                        Apply tax to all transactions
                                                    </p>
                                                </div>
                                            </div>
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={data.tax_enabled}
                                                    onChange={(e) => setData('tax_enabled', e.target.checked)}
                                                    className="sr-only peer"
                                                />
                                                <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                            </label>
                                        </div>

                                        {data.tax_enabled && (
                                            <div className="pt-4 border-t border-gray-200">
                                                <InputLabel htmlFor="tax_percentage">
                                                    Tax Percentage (%)
                                                </InputLabel>
                                                <TextInput
                                                    id="tax_percentage"
                                                    type="number"
                                                    step="0.01"
                                                    min="0"
                                                    max="100"
                                                    value={data.tax_percentage?.toString()}
                                                    onChange={(e: any) =>
                                                        setData('tax_percentage', parseFloat(e.target.value || '0'))
                                                    }
                                                    error={errors.tax_percentage}
                                                    placeholder="10.00"
                                                    className="mt-2"
                                                />
                                                <InputError message={errors.tax_percentage} className="mt-1" />
                                                <p className="mt-2 text-xs text-gray-500">
                                                    Example: 10% tax on Rp 100,000 = Rp 10,000
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Save Button */}
                                <div className="flex justify-end pt-4 border-t border-gray-200">
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <Save className="w-4 h-4" />
                                        {processing ? 'Saving...' : 'Save Changes'}
                                    </button>
                                </div>
                            </form>
                        )}

                        {/* Receipt Tab */}
                        {activeTab === 'receipt' && (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                                        Receipt Customization
                                    </h3>
                                    <p className="text-sm text-gray-600">
                                        Customize header and footer messages that appear on receipts
                                    </p>
                                </div>

                                <div className="space-y-5">
                                    {/* Receipt Header */}
                                    <div>
                                        <InputLabel htmlFor="receipt_header">
                                            <div className="flex items-center gap-2">
                                                <FileText className="w-4 h-4 text-gray-600" />
                                                Receipt Header Message
                                            </div>
                                        </InputLabel>
                                        <textarea
                                            id="receipt_header"
                                            value={data.receipt_header}
                                            onChange={(e) => setData('receipt_header', e.target.value)}
                                            className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            rows={3}
                                            placeholder="Welcome to our store! Thank you for shopping with us."
                                        />
                                        <InputError message={errors.receipt_header} className="mt-1" />
                                        <p className="mt-2 text-xs text-gray-500">
                                            This message will appear at the top of receipts
                                        </p>
                                    </div>

                                    {/* Receipt Footer */}
                                    <div>
                                        <InputLabel htmlFor="receipt_footer">
                                            <div className="flex items-center gap-2">
                                                <FileText className="w-4 h-4 text-gray-600" />
                                                Receipt Footer Message
                                            </div>
                                        </InputLabel>
                                        <textarea
                                            id="receipt_footer"
                                            value={data.receipt_footer}
                                            onChange={(e) => setData('receipt_footer', e.target.value)}
                                            className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            rows={3}
                                            placeholder="Thank you for your purchase! Please come again."
                                        />
                                        <InputError message={errors.receipt_footer} className="mt-1" />
                                        <p className="mt-2 text-xs text-gray-500">
                                            This message will appear at the bottom of receipts
                                        </p>
                                    </div>

                                    {/* Preview */}
                                    <div className="bg-gray-50 rounded-lg p-5 border border-gray-200">
                                        <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                            <Receipt className="w-4 h-4" />
                                            Preview
                                        </h4>
                                        <div className="bg-white border border-gray-300 rounded-lg p-4 font-mono text-xs">
                                            {/* Header */}
                                            {data.receipt_header && (
                                                <div className="text-center text-gray-700 mb-4 pb-4 border-b border-gray-200">
                                                    {data.receipt_header}
                                                </div>
                                            )}

                                            {/* Sample Content */}
                                            <div className="text-center text-gray-500 py-6 border-y border-gray-200 my-4">
                                                [Transaction Details]
                                            </div>

                                            {/* Footer */}
                                            {data.receipt_footer && (
                                                <div className="text-center text-gray-700 mt-4 pt-4 border-t border-gray-200">
                                                    {data.receipt_footer}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Save Button */}
                                <div className="flex justify-end pt-4 border-t border-gray-200">
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <Save className="w-4 h-4" />
                                        {processing ? 'Saving...' : 'Save Changes'}
                                    </button>
                                </div>
                            </form>
                        )}

                        {/* Data Import Tab */}
                        {activeTab === 'data' && (
                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                                        Data Import
                                    </h3>
                                    <p className="text-sm text-gray-600">
                                        Import products and transactions from Excel files
                                    </p>
                                </div>

                                {/* Import Statistics */}
                                {importStats && (
                                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-5">
                                        <h4 className="text-sm font-semibold text-blue-900 mb-4 flex items-center gap-2">
                                            <TrendingUp className="w-4 h-4" />
                                            Current Database Statistics
                                        </h4>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                            <div className="bg-white rounded-lg p-3 border border-blue-100">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <Package className="w-4 h-4 text-blue-600" />
                                                    <span className="text-xs text-gray-600">Products</span>
                                                </div>
                                                <div className="text-2xl font-bold text-gray-900">
                                                    {importStats.total_products}
                                                </div>
                                            </div>
                                            <div className="bg-white rounded-lg p-3 border border-blue-100">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <Receipt className="w-4 h-4 text-green-600" />
                                                    <span className="text-xs text-gray-600">Transactions</span>
                                                </div>
                                                <div className="text-2xl font-bold text-gray-900">
                                                    {importStats.total_transactions}
                                                </div>
                                            </div>
                                            <div className="bg-white rounded-lg p-3 border border-blue-100">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <DollarSign className="w-4 h-4 text-purple-600" />
                                                    <span className="text-xs text-gray-600">Revenue</span>
                                                </div>
                                                <div className="text-lg font-bold text-gray-900">
                                                    Rp {(importStats.total_revenue || 0).toLocaleString('id-ID')}
                                                </div>
                                            </div>
                                            <div className="bg-white rounded-lg p-3 border border-blue-100">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <Calendar className="w-4 h-4 text-orange-600" />
                                                    <span className="text-xs text-gray-600">Last Update</span>
                                                </div>
                                                <div className="text-sm font-semibold text-gray-900">
                                                    {importStats.last_import
                                                        ? new Date(importStats.last_import).toLocaleDateString('id-ID')
                                                        : 'Never'}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Download Template */}
                                <div className="bg-green-50 border border-green-200 rounded-lg p-5">
                                    <h4 className="text-sm font-semibold text-green-900 mb-3 flex items-center gap-2">
                                        <Download className="w-4 h-4" />
                                        Step 1: Download Template
                                    </h4>
                                    <p className="text-sm text-green-700 mb-4">
                                        Download the Excel template with sample data and proper formatting
                                    </p>

                                    <a
                                        href="/settings/template"
                                        className="inline-flex items-center gap-2 px-4 py-2.5 bg-white text-green-700 border border-green-300 rounded-lg hover:bg-green-50 font-medium transition-colors"
                                    >
                                        <Download className="w-4 h-4" />
                                        Download Excel Template
                                    </a>
                                </div>

                                {/* Upload Form */}
                                <form
                                    onSubmit={(e) => {
                                        e.preventDefault();
                                        const formData = new FormData(e.currentTarget);
                                        router.post('/settings/import', formData, {
                                            forceFormData: true,
                                            preserveScroll: true,
                                        });
                                    }}
                                    className="space-y-5"
                                >
                                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-5">
                                        <h4 className="text-sm font-semibold text-blue-900 mb-3 flex items-center gap-2">
                                            <Upload className="w-4 h-4" />
                                            Step 2: Upload Your Data
                                        </h4>

                                        {/* File Upload */}
                                        <div className="mb-4">
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Select Excel File
                                            </label>
                                            <input
                                                type="file"
                                                name="file"
                                                accept=".xlsx,.xls"
                                                required
                                                className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-white focus:outline-none file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700"
                                            />
                                            <p className="mt-2 text-xs text-gray-600">
                                                Supported formats: .xlsx, .xls (Max 10MB)
                                            </p>
                                        </div>

                                        {/* Replace Data Warning */}
                                        <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-4">
                                            <label className="flex items-start gap-3 cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    name="clear_existing"
                                                    value="1"
                                                    defaultChecked
                                                    className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                                />
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2">
                                                        <AlertCircle className="w-4 h-4 text-yellow-700" />
                                                        <span className="text-sm font-semibold text-yellow-900">
                                                            Replace All Existing Data
                                                        </span>
                                                    </div>
                                                    <p className="text-xs text-yellow-700 mt-1">
                                                        Warning: This will permanently delete ALL current products and transactions before importing new data. <strong>This action cannot be undone!</strong>
                                                    </p>
                                                </div>
                                            </label>
                                        </div>

                                        {/* Submit Button */}
                                        <button
                                            type="submit"
                                            className="mt-4 w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold transition-colors"
                                        >
                                            <Upload className="w-5 h-5" />
                                            Import Data Now
                                        </button>
                                    </div>
                                </form>

                                {/* Instructions */}
                                <div className="bg-gray-50 border border-gray-200 rounded-lg p-5">
                                    <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                        <CheckCircle className="w-4 h-4" />
                                        File Requirements
                                    </h4>

                                    <div className="space-y-3">
                                        <div>
                                            <h5 className="text-xs font-semibold text-gray-700 mb-2">
                                                📄 Sheet 1: "Products"
                                            </h5>
                                            <div className="bg-white border border-gray-300 rounded p-2 font-mono text-[10px]">
                                                name | category | price | cost | stock | sold
                                            </div>
                                        </div>

                                        <div>
                                            <h5 className="text-xs font-semibold text-gray-700 mb-2">
                                                📄 Sheet 2: "Transactions"
                                            </h5>
                                            <div className="bg-white border border-gray-300 rounded p-2 font-mono text-[10px]">
                                                transaction_id | date | time | cashier_email | product_name | quantity | price
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-4 pt-4 border-t border-gray-300">
                                        <h5 className="text-xs font-semibold text-gray-900 mb-2">⚠️ Important Notes:</h5>
                                        <ul className="text-xs text-gray-600 space-y-1 list-disc list-inside">
                                            <li>File must have exactly 2 sheets named "Products" and "Transactions"</li>
                                            <li>Product names in Transactions must match Products sheet exactly (case-sensitive)</li>
                                            <li>Date format: YYYY-MM-DD (e.g., 2025-12-03)</li>
                                            <li>Time format: HH:MM:SS (e.g., 14:30:00)</li>
                                            <li>Cashier email must exist in your users database</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
