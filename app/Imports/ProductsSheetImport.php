<?php

namespace App\Imports;

use App\Models\Product;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\WithValidation;
use Maatwebsite\Excel\Concerns\SkipsOnFailure;
use Maatwebsite\Excel\Validators\Failure;

class ProductsSheetImport implements ToModel, WithHeadingRow, WithValidation, SkipsOnFailure
{
    public function model(array $row)
    {
        return new Product([
            'name' => $row['name'],
            'category' => $row['category'],
            'price' => $row['price'],
            'cost' => $row['cost'],
            'stock' => $row['stock'],
            'sold' => $row['sold'] ?? 0,
        ]);
    }

    public function rules(): array
    {
        return [
            'name' => 'required|string',
            'category' => 'required|string',
            'price' => 'required|numeric|min:0',
            'cost' => 'required|numeric|min:0',
            'stock' => 'required|integer|min:0',
        ];
    }

    public function onFailure(Failure ...$failures)
    {
        // Handle failures
    }
}