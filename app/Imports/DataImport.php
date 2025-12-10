<?php

namespace App\Imports;

use Maatwebsite\Excel\Concerns\WithMultipleSheets;

class DataImport implements WithMultipleSheets
{
    public function sheets(): array
    {
        return [
            'Products' => new ProductsSheetImport(),
            'Transactions' => new TransactionsSheetImport(),
        ];
    }
}