<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
use App\Exports\TransactionsExport;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;

class TransactionController extends Controller
{
    /**
     * Display paginated list of transactions
     */
    public function index(Request $request)
    {
        $query = Transaction::with(['cashier', 'items.product']);

        // Date Range Filter
        if ($request->has('start_date') && $request->start_date) {
            $query->whereDate('date', '>=', $request->start_date);
        }

        if ($request->has('end_date') && $request->end_date) {
            $query->whereDate('date', '<=', $request->end_date);
        }

        // Search by transaction ID or cashier name
        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('id', 'like', "%{$search}%")
                  ->orWhereHas('cashier', function ($q) use ($search) {
                      $q->where('name', 'like', "%{$search}%");
                  });
            });
        }

        // Pagination (15 per page)
        $transactions = $query
            ->orderBy('date', 'desc')
            ->orderBy('time', 'desc')
            ->paginate(15)
            ->withQueryString()
            ->through(function ($transaction) {
                return [
                    'id' => $transaction->id, // ID from database
                    'cashier_name' => $transaction->cashier->name,
                    'total' => (float) $transaction->total,
                    'date' => $transaction->date,
                    'time' => $transaction->time,
                    'products' => $transaction->items->map(function ($item) {
                        return [
                            'product_name' => $item->product->name,
                            'quantity' => $item->quantity,
                            'price' => (float) $item->price,
                        ];
                    }),
                ];
            });

        return Inertia::render('Transactions/Index', [
            'transactions' => $transactions,
            'filters' => $request->only(['search', 'start_date', 'end_date']),
        ]);
    }

    /**
     * Display single transaction details
     */
    public function show(Transaction $transaction)
    {
        $transaction->load(['cashier', 'items.product']);

        return Inertia::render('Transactions/Show', [
            'transaction' => [
                'id' => $transaction->id,
                'cashier_name' => $transaction->cashier->name,
                'total' => (float) $transaction->total,
                'date' => $transaction->date,
                'time' => $transaction->time,
                'products' => $transaction->items->map(function ($item) {
                    return [
                        'product_name' => $item->product->name,
                        'quantity' => $item->quantity,
                        'price' => (float) $item->price,
                    ];
                }),
            ],
        ]);
    }

    /**
     * Export transactions to Excel
     */
    public function export(Request $request)
    {
        $startDate = $request->get('start_date');
        $endDate = $request->get('end_date');

        // Generate filename with date range if applicable
        $filename = 'transactions';
        if ($startDate && $endDate) {
            $filename .= '_' . $startDate . '_to_' . $endDate;
        } elseif ($startDate) {
            $filename .= '_from_' . $startDate;
        } elseif ($endDate) {
            $filename .= '_until_' . $endDate;
        }
        $filename .= '_' . date('Y-m-d_His') . '.xlsx';

        return Excel::download(
            new TransactionsExport($startDate, $endDate),
            $filename
        );
    }
}