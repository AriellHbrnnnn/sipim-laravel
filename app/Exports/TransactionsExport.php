<?php

namespace App\Exports;

use App\Models\Transaction;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Concerns\WithTitle;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class TransactionsExport implements FromCollection, WithHeadings, WithMapping, WithStyles, WithTitle
{
    protected $startDate;
    protected $endDate;

    public function __construct($startDate = null, $endDate = null)
    {
        $this->startDate = $startDate;
        $this->endDate = $endDate;
    }

    /**
     * Get collection of transactions
     */
    public function collection()
    {
        $query = Transaction::with(['cashier', 'items.product'])
            ->orderBy('date', 'desc')
            ->orderBy('time', 'desc');

        // Apply date filters if provided
        if ($this->startDate) {
            $query->whereDate('date', '>=', $this->startDate);
        }

        if ($this->endDate) {
            $query->whereDate('date', '<=', $this->endDate);
        }

        return $query->get();
    }

    /**
     * Map each transaction to row data
     */
    public function map($transaction): array
    {
        return [
            $transaction->id,
            $transaction->date,
            $transaction->time,
            $transaction->cashier->name,
            $transaction->items->count(),
            $transaction->items->map(function($item) {
                return $item->product->name . ' (x' . $item->quantity . ')';
            })->implode(', '),
            $transaction->total,
        ];
    }

    /**
     * Define column headings
     */
    public function headings(): array
    {
        return [
            'Transaction ID',
            'Date',
            'Time',
            'Cashier',
            'Total Items',
            'Products',
            'Total Amount (Rp)',
        ];
    }

    /**
     * Apply styles to worksheet
     */
    public function styles(Worksheet $sheet)
    {
        return [
            // Style the first row as bold header
            1 => ['font' => ['bold' => true, 'size' => 12]],
        ];
    }

    /**
     * Set worksheet title
     */
    public function title(): string
    {
        return 'Transactions';
    }
}