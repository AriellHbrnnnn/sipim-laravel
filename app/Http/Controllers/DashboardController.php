<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Transaction;
use App\Models\TransactionItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Carbon\Carbon;
use Barryvdh\DomPDF\Facade\Pdf;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        // Get filter parameters
        $filterType = $request->get('filter', 'last_7_days');
        $startDate = $request->get('start_date');
        $endDate = $request->get('end_date');
        
        // Calculate date range based on filter
        [$startDate, $endDate] = $this->getDateRange($filterType, $startDate, $endDate);

        // Basic Stats (with filter)
        $stats = [
            'totalRevenue' => Transaction::whereBetween('date', [$startDate, $endDate])->sum('total'),
            'totalProducts' => Product::count(), // Total products tidak perlu filter
            'totalTransactions' => Transaction::whereBetween('date', [$startDate, $endDate])->count(),
            'lowStockCount' => Product::where('stock', '<', 10)->count(), // Low stock tidak perlu filter
        ];

        // Sales Chart Data (filtered period)
        $salesChart = Transaction::whereBetween('date', [$startDate, $endDate])
            ->selectRaw('DATE(date) as date, SUM(total) as revenue')
            ->groupBy('date')
            ->orderBy('date')
            ->get()
            ->map(function ($item) {
                return [
                    'date' => Carbon::parse($item->date)->format('M d'),
                    'revenue' => (float) $item->revenue,
                ];
            });

        // Best Selling Products (filtered by transactions in date range)
        $bestProducts = DB::table('products')
            ->join('transaction_items', 'products.id', '=', 'transaction_items.product_id')
            ->join('transactions', 'transaction_items.transaction_id', '=', 'transactions.id')
            ->whereBetween('transactions.date', [$startDate, $endDate])
            ->select(
                'products.name',
                DB::raw('SUM(transaction_items.quantity) as sold'),
                DB::raw('SUM(transaction_items.quantity * transaction_items.price) as revenue')
            )
            ->groupBy('products.id', 'products.name')
            ->orderByDesc('sold')
            ->take(5)
            ->get()
            ->map(function ($item) {
                return [
                    'name' => $item->name,
                    'sold' => (int) $item->sold,
                    'revenue' => (float) $item->revenue,
                ];
            });

        // Top 10 Categories by Revenue (HORIZONTAL BAR CHART - filtered)
        $categoryStats = DB::table('products')
            ->join('transaction_items', 'products.id', '=', 'transaction_items.product_id')
            ->join('transactions', 'transaction_items.transaction_id', '=', 'transactions.id')
            ->whereBetween('transactions.date', [$startDate, $endDate])
            ->select(
                'products.category as name',
                DB::raw('SUM(transaction_items.quantity * transaction_items.price) as value')
            )
            ->groupBy('products.category')
            ->orderByDesc('value')
            ->take(10)
            ->get()
            ->map(function ($item) {
                return [
                    'name' => $item->name,
                    'value' => (float) $item->value,
                ];
            });

        // Recent Transactions (filtered, last 5)
        $recentTransactions = Transaction::with('cashier')
            ->whereBetween('date', [$startDate, $endDate])
            ->orderBy('date', 'desc')
            ->orderBy('time', 'desc')
            ->take(5)
            ->get()
            ->map(function ($transaction) {
                return [
                    'id' => $transaction->id,
                    'cashier_name' => $transaction->cashier->name,
                    'total' => (float) $transaction->total,
                    'date' => $transaction->date,
                    'time' => $transaction->time,
                ];
            });

        return Inertia::render('Dashboard', [
            'stats' => $stats,
            'salesChart' => $salesChart,
            'bestProducts' => $bestProducts,
            'categoryStats' => $categoryStats,
            'recentTransactions' => $recentTransactions,
            'filters' => [
                'filter_type' => $filterType,
                'start_date' => $startDate,
                'end_date' => $endDate,
            ],
        ]);
    }

    /**
     * Export dashboard to PDF
     */
    public function exportPdf(Request $request)
    {
        // Get filter parameters
        $filterType = $request->get('filter', 'last_7_days');
        $startDate = $request->get('start_date');
        $endDate = $request->get('end_date');
        
        // Calculate date range
        [$startDate, $endDate] = $this->getDateRange($filterType, $startDate, $endDate);

        // Get all data (same as index)
        $stats = [
            'totalRevenue' => Transaction::whereBetween('date', [$startDate, $endDate])->sum('total'),
            'totalProducts' => Product::count(),
            'totalTransactions' => Transaction::whereBetween('date', [$startDate, $endDate])->count(),
            'lowStockCount' => Product::where('stock', '<', 10)->count(),
        ];

        $salesChart = Transaction::whereBetween('date', [$startDate, $endDate])
            ->selectRaw('DATE(date) as date, SUM(total) as revenue')
            ->groupBy('date')
            ->orderBy('date')
            ->get()
            ->map(function ($item) {
                return [
                    'date' => Carbon::parse($item->date)->format('M d'),
                    'revenue' => (float) $item->revenue,
                ];
            });

        $bestProducts = DB::table('products')
            ->join('transaction_items', 'products.id', '=', 'transaction_items.product_id')
            ->join('transactions', 'transaction_items.transaction_id', '=', 'transactions.id')
            ->whereBetween('transactions.date', [$startDate, $endDate])
            ->select(
                'products.name',
                DB::raw('SUM(transaction_items.quantity) as sold'),
                DB::raw('SUM(transaction_items.quantity * transaction_items.price) as revenue')
            )
            ->groupBy('products.id', 'products.name')
            ->orderByDesc('sold')
            ->take(5)
            ->get();

        $categoryStats = DB::table('products')
            ->join('transaction_items', 'products.id', '=', 'transaction_items.product_id')
            ->join('transactions', 'transaction_items.transaction_id', '=', 'transactions.id')
            ->whereBetween('transactions.date', [$startDate, $endDate])
            ->select(
                'products.category as name',
                DB::raw('SUM(transaction_items.quantity * transaction_items.price) as value')
            )
            ->groupBy('products.category')
            ->orderByDesc('value')
            ->take(10)
            ->get();

        $recentTransactions = Transaction::with('cashier')
            ->whereBetween('date', [$startDate, $endDate])
            ->orderBy('date', 'desc')
            ->orderBy('time', 'desc')
            ->take(5)
            ->get();

        // Get filter label
        $filterLabel = $this->getFilterLabel($filterType, $startDate, $endDate);

        // Generate PDF
        $pdf = Pdf::loadView('pdf.dashboard', [
            'stats' => $stats,
            'salesChart' => $salesChart,
            'bestProducts' => $bestProducts,
            'categoryStats' => $categoryStats,
            'recentTransactions' => $recentTransactions,
            'filterLabel' => $filterLabel,
            'startDate' => $startDate,
            'endDate' => $endDate,
            'generatedAt' => now()->format('d/m/Y H:i'),
        ]);

        return $pdf->download('dashboard-report-' . date('Y-m-d') . '.pdf');
    }
    
    /**
     * Get date range based on filter type
     */
    private function getDateRange($filterType, $customStart = null, $customEnd = null)
    {
        $today = Carbon::today();
        
        switch ($filterType) {
            case 'today':
                return [$today->toDateString(), $today->toDateString()];
                
            case 'last_7_days':
                return [
                    $today->copy()->subDays(6)->toDateString(),
                    $today->toDateString()
                ];
                
            case 'last_30_days':
                return [
                    $today->copy()->subDays(29)->toDateString(),
                    $today->toDateString()
                ];
                
            case 'this_month':
                return [
                    $today->copy()->startOfMonth()->toDateString(),
                    $today->copy()->endOfMonth()->toDateString()
                ];
                
            case 'custom':
                if ($customStart && $customEnd) {
                    return [$customStart, $customEnd];
                }
                // Fallback to last 7 days
                return [
                    $today->copy()->subDays(6)->toDateString(),
                    $today->toDateString()
                ];
                
            default:
                return [
                    $today->copy()->subDays(6)->toDateString(),
                    $today->toDateString()
                ];
        }
    }

    /**
     * Get human-readable filter label
     */
    private function getFilterLabel($filterType, $startDate, $endDate)
    {
        switch ($filterType) {
            case 'today':
                return 'Today';
                
            case 'last_7_days':
                return 'Last 7 Days';
                
            case 'last_30_days':
                return 'Last 30 Days';
                
            case 'this_month':
                return 'This Month';
                
            case 'custom':
                return Carbon::parse($startDate)->format('d/m/Y') . ' - ' . Carbon::parse($endDate)->format('d/m/Y');
                
            default:
                return 'Last 7 Days';
        }
    }
}