<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'category',
        'price',
        'cost',
        'stock',
        'sold',
    ];

    protected $casts = [
        'price' => 'float',
        'cost' => 'float',
        'stock' => 'integer',
        'sold' => 'integer',
    ];

    // Tambahkan di dalam class
    public function categoryModel(): BelongsTo
    {
        return $this->belongsTo(Category::class, 'category', 'name');
    }
}
