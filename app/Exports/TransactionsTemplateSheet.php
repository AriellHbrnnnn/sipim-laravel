<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\WithTitle;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Concerns\FromArray;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class TransactionsTemplateSheet implements WithTitle, WithHeadings, WithStyles, FromArray
{
    public function title(): string
    {
        return 'Transactions';
    }

    public function headings(): array
    {
        return [
            'transaction_id',
            'date',
            'time',
            'cashier_email',
            'product_name',
            'quantity',
            'price',
        ];
    }

    public function array(): array
    {
        // Example data - showing one transaction with multiple items
        return [
            [1, '2025-11-20', '10:30:00', 'owner@sipim.com', 'Indomie Goreng', 2, 3500],
            [1, '2025-11-20', '10:30:00', 'owner@sipim.com', 'Aqua 600ml', 3, 4000],
            [2, '2025-11-20', '11:15:00', 'owner@sipim.com', 'Chitato', 1, 12000],
            [2, '2025-11-20', '11:15:00', 'owner@sipim.com', 'Indomie Goreng', 5, 3500],
            [3, '2025-11-21', '09:00:00', 'employee@sipim.com', 'Aqua 600ml', 10, 4000],
        ];
    }

    public function styles(Worksheet $sheet)
    {
        return [
            1 => ['font' => ['bold' => true, 'size' => 12]],
        ];
    }
}