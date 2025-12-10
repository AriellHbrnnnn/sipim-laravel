<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\WithMultipleSheets;

class DataTemplateExport implements WithMultipleSheets
{
    public function sheets(): array
    {
        return [
            new ProductsTemplateSheet(),
            new TransactionsTemplateSheet(),
        ];
    }
}