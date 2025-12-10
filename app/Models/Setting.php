<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Setting extends Model
{
    use HasFactory;

    protected $fillable = [
        'store_name',
        'store_phone',
        'store_email',
        'store_address',
        'currency',
        'currency_symbol',
        'logo_path',
        'receipt_header',
        'receipt_footer',
        'tax_enabled',
        'tax_percentage',
    ];

    protected $casts = [
        'tax_enabled' => 'boolean',
        'tax_percentage' => 'decimal:2',
    ];

    // Singleton pattern - hanya ada 1 settings
    public static function get()
    {
        return static::first() ?? static::create([
            'store_name' => 'SIPIM Store',
            'currency' => 'IDR',
            'currency_symbol' => 'Rp',
        ]);
    }
}