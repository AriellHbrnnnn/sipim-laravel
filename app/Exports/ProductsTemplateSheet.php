<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\WithTitle;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Concerns\FromArray;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class ProductsTemplateSheet implements WithTitle, WithHeadings, WithStyles, FromArray
{
    public function title(): string
    {
        return 'Products';
    }

    public function headings(): array
    {
        return [
            'name',
            'category',
            'price',
            'cost',
            'stock',
            'sold',
        ];
    }

    public function array(): array
    {
        // Example data
        return [
            ['Indomie Goreng', 'Food', 3500, 2800, 100, 50],
            ['Aqua 600ml', 'Beverages', 4000, 3200, 200, 80],
            ['Chitato', 'Snacks', 12000, 9500, 60, 30],
        ];
    }

    public function styles(Worksheet $sheet)
    {
        return [
            1 => ['font' => ['bold' => true, 'size' => 12]],
        ];
    }
}