import { useState, FormEvent } from 'react';
import { Head, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PageProps } from '@/types';
import { Search, Calendar, X, Eye, ChevronLeft, ChevronRight, Download } from 'lucide-react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

interface TransactionItem {
    product_name: string;
    quantity: number;
    price: number;
}

interface Transaction {
    id: number;
    cashier_name: string;
    total: number;
    date: string;
    time: string;
    products: TransactionItem[];
}

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface PaginatedTransactions {
    data: Transaction[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    links: PaginationLink[];
}

interface TransactionsPageProps extends PageProps {
    transactions: PaginatedTransactions;
    filters: {
        search?: string;
        start_date?: string;
        end_date?: string;
    };
}

export default function TransactionsIndex({ auth, transactions, filters }: TransactionsPageProps) {
    const [searchQuery, setSearchQuery] = useState(filters.search || '');
    const [startDate, setStartDate] = useState<Date | null>(
        filters.start_date ? new Date(filters.start_date) : null
    );
    const [endDate, setEndDate] = useState<Date | null>(
        filters.end_date ? new Date(filters.end_date) : null
    );
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

    const handleFilter = (e?: FormEvent) => {
        if (e) e.preventDefault();

        const params: any = {};

        if (searchQuery) params.search = searchQuery;
        if (startDate) params.start_date = startDate.toISOString().split('T')[0];
        if (endDate) params.end_date = endDate.toISOString().split('T')[0];

        router.get('/transactions', params, { preserveState: true });
    };

    const clearFilters = () => {
        setSearchQuery('');
        setStartDate(null);
        setEndDate(null);
        router.get('/transactions', {}, { preserveState: true });
    };

    const hasActiveFilters = Boolean(searchQuery || startDate || endDate);

    const totalRevenue = transactions.data.reduce((sum, t) => sum + t.total, 0);

    const viewDetails = (transaction: Transaction) => {
        setSelectedTransaction(transaction);
        setShowDetailModal(true);
    };

    // Build export href with date filters
    const exportHref =
        `/transactions/export${
            startDate || endDate
                ? '?' +
                  new URLSearchParams({
                      ...(startDate && { start_date: startDate.toISOString().split('T')[0] }),
                      ...(endDate && { end_date: endDate.toISOString().split('T')[0] }),
                  }).toString()
                : ''
        }`;

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800">Transactions</h2>}
        >
            <Head title="Transactions" />

            <div className="space-y-6">
                {/* Stats + Export Button */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                        <div className="text-sm text-gray-600 mb-1">Total Transactions</div>
                        <div className="text-2xl font-semibold text-gray-900">
                            {transactions.total}
                        </div>
                    </div>
                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-sm text-gray-600 mb-1">Total Revenue</div>
                                <div className="text-2xl font-semibold text-green-600">
                                    Rp {totalRevenue.toLocaleString('id-ID')}
                                </div>
                            </div>
                            {/* Export Button */}
                            <a
                                href={exportHref}
                                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium transition-colors flex items-center gap-2"
                            >
                                <Download className="w-4 h-4" />
                                Export Excel
                            </a>
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                    <form onSubmit={handleFilter} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                            {/* Search */}
                            <div className="relative md:col-span-2">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="text"
                                    placeholder="Search by ID or cashier..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>

                            {/* Start Date */}
                            <div className="relative">
                                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none z-10" />
                                <DatePicker
                                    selected={startDate}
                                    onChange={(date) => setStartDate(date)}
                                    selectsStart
                                    startDate={startDate || undefined}
                                    endDate={endDate || undefined}
                                    maxDate={endDate || undefined}
                                    placeholderText="Start Date"
                                    dateFormat="yyyy-MM-dd"
                                    isClearable
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>

                            {/* End Date */}
                            <div className="relative">
                                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none z-10" />
                                <DatePicker
                                    selected={endDate}
                                    onChange={(date) => setEndDate(date)}
                                    selectsEnd
                                    startDate={startDate || undefined}
                                    endDate={endDate || undefined}
                                    minDate={startDate || undefined}
                                    placeholderText="End Date"
                                    dateFormat="yyyy-MM-dd"
                                    isClearable
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2">
                            <button
                                type="submit"
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors"
                            >
                                Apply Filters
                            </button>

                            {hasActiveFilters && (
                                <button
                                    type="button"
                                    onClick={clearFilters}
                                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors flex items-center gap-2"
                                >
                                    <X className="w-4 h-4" />
                                    Clear Filters
                                </button>
                            )}
                        </div>

                        {/* Active Filters Display */}
                        {hasActiveFilters && (
                            <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-200">
                                {searchQuery && (
                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                                        Search: {searchQuery}
                                    </span>
                                )}
                                {startDate && (
                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800">
                                        From: {startDate.toISOString().split('T')[0]}
                                    </span>
                                )}
                                {endDate && (
                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800">
                                        To: {endDate.toISOString().split('T')[0]}
                                    </span>
                                )}
                            </div>
                        )}
                    </form>
                </div>

                {/* Table */}
                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                    ID
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                    Date
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                    Time
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                    Cashier
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                    Items
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                    Total
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {transactions.data.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                                        No transactions found
                                    </td>
                                </tr>
                            ) : (
                                transactions.data.map((transaction) => (
                                    <tr key={transaction.id} className="hover:bg-gray-50">
                                        {/* ID FROM DATABASE */}
                                        <td className="px-6 py-4 text-sm font-medium text-gray-900">
                                            #{transaction.id}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            {transaction.date}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            {transaction.time}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            {transaction.cashier_name}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                                                {transaction.products.length} items
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm font-semibold text-green-600">
                                            Rp {transaction.total.toLocaleString('id-ID')}
                                        </td>
                                        <td className="px-6 py-4 text-right text-sm">
                                            <button
                                                onClick={() => viewDetails(transaction)}
                                                className="text-blue-600 hover:text-blue-900 inline-flex items-center gap-1"
                                            >
                                                <Eye className="w-4 h-4" />
                                                <span>View Details</span>
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>

                    {/* Pagination */}
                    {transactions.last_page > 1 && (
                        <div className="px-6 py-4 border-t border-gray-200">
                            <div className="flex items-center justify-between">
                                <div className="text-sm text-gray-700">
                                    Showing{' '}
                                    <span className="font-medium">
                                        {transactions.data.length}
                                    </span>{' '}
                                    of{' '}
                                    <span className="font-medium">{transactions.total}</span>{' '}
                                    results
                                </div>
                                <div className="flex gap-2">
                                    {transactions.links.map((link, index) => {
                                        if (link.label === '&laquo; Previous') {
                                            return (
                                                <button
                                                    key={index}
                                                    onClick={() =>
                                                        link.url && router.get(link.url)
                                                    }
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
                                                    onClick={() =>
                                                        link.url && router.get(link.url)
                                                    }
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
                                                onClick={() =>
                                                    link.url && router.get(link.url)
                                                }
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

            {/* Detail Modal */}
            {showDetailModal && selectedTransaction && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg max-w-2xl w-full shadow-xl max-h-[90vh] overflow-y-auto">
                        {/* Header */}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-900">
                                Transaction Details #{selectedTransaction!.id}
                            </h3>
                            <button
                                onClick={() => setShowDetailModal(false)}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Body */}
                        <div className="p-6 space-y-6">
                            {/* Transaction Info */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <div className="text-sm text-gray-600">Date</div>
                                    <div className="text-base font-semibold text-gray-900">
                                        {selectedTransaction!.date}
                                    </div>
                                </div>
                                <div>
                                    <div className="text-sm text-gray-600">Time</div>
                                    <div className="text-base font-semibold text-gray-900">
                                        {selectedTransaction!.time}
                                    </div>
                                </div>
                                <div>
                                    <div className="text-sm text-gray-600">Cashier</div>
                                    <div className="text-base font-semibold text-gray-900">
                                        {selectedTransaction!.cashier_name}
                                    </div>
                                </div>
                                <div>
                                    <div className="text-sm text-gray-600">Total Items</div>
                                    <div className="text-base font-semibold text-gray-900">
                                        {selectedTransaction!.products.length} items
                                    </div>
                                </div>
                            </div>

                            {/* Products Table */}
                            <div>
                                <h4 className="text-sm font-medium text-gray-900 mb-3">
                                    Products
                                </h4>
                                <div className="border border-gray-200 rounded-lg overflow-hidden">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                                                    Product
                                                </th>
                                                <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase">
                                                    Qty
                                                </th>
                                                <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">
                                                    Price
                                                </th>
                                                <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">
                                                    Subtotal
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {selectedTransaction!.products.map(
                                                (item, index) => (
                                                    <tr key={index}>
                                                        <td className="px-4 py-3 text-sm text-gray-900">
                                                            {item.product_name}
                                                        </td>
                                                        <td className="px-4 py-3 text-sm text-gray-600 text-center">
                                                            {item.quantity}
                                                        </td>
                                                        <td className="px-4 py-3 text-sm text-gray-600 text-right">
                                                            Rp{' '}
                                                            {item.price.toLocaleString(
                                                                'id-ID'
                                                            )}
                                                        </td>
                                                        <td className="px-4 py-3 text-sm font-semibold text-gray-900 text-right">
                                                            Rp{' '}
                                                            {(
                                                                item.price *
                                                                item.quantity
                                                            ).toLocaleString('id-ID')}
                                                        </td>
                                                    </tr>
                                                )
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Total */}
                            <div className="border-t border-gray-200 pt-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-lg font-semibold text-gray-900">
                                        Total
                                    </span>
                                    <span className="text-2xl font-bold text-green-600">
                                        Rp{' '}
                                        {selectedTransaction!.total.toLocaleString(
                                            'id-ID'
                                        )}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 rounded-b-lg">
                            <button
                                onClick={() => setShowDetailModal(false)}
                                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
