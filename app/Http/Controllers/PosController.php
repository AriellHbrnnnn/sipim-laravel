<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Transaction;
use App\Models\TransactionItem;
use App\Models\Setting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class PosController extends Controller
{
    public function index(Request $request)
    {
        // Get search and filter parameters
        $search = $request->get('search');
        $category = $request->get('category');
        
        // Build query
        $query = Product::where('stock', '>', 0);
        
        // Apply search
        if ($search) {
            $query->where('name', 'like', "%{$search}%");
        }
        
        // Apply category filter
        if ($category && $category !== 'all') {
            $query->where('category', $category);
        }
        
        // Get paginated products (12 per page untuk grid yang rapi)
        $products = $query->orderBy('name')
            ->paginate(12)
            ->withQueryString(); // Preserve query params in pagination links
        
        // Get all unique categories for filter buttons
        $categories = Product::where('stock', '>', 0)
            ->select('category')
            ->distinct()
            ->orderBy('category')
            ->pluck('category');
        
        // Get settings for tax
        $settings = Setting::first();

        return Inertia::render('Pos/Index', [
            'products' => $products,
            'categories' => $categories,
            'settings' => $settings,
            'filters' => [
                'search' => $search,
                'category' => $category,
            ],
        ]);
    }

    public function checkout(Request $request)
    {
        $validated = $request->validate([
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.price' => 'required|numeric|min:0',
            'subtotal' => 'required|numeric|min:0',
            'tax' => 'required|numeric|min:0',
            'total' => 'required|numeric|min:0',
        ]);

        $items = $validated['items'];

        // Check stock availability
        foreach ($items as $item) {
            $product = Product::find($item['product_id']);
            
            if ($product->stock < $item['quantity']) {
                return back()->with('error', "Insufficient stock for {$product->name}. Available: {$product->stock}, Requested: {$item['quantity']}");
            }
        }

        DB::beginTransaction();

        try {
            $transaction = Transaction::create([
                'cashier_id' => auth()->id(),
                'total' => $validated['total'],
                'date' => now()->toDateString(),
                'time' => now()->toTimeString(),
            ]);

            foreach ($items as $item) {
                TransactionItem::create([
                    'transaction_id' => $transaction->id,
                    'product_id' => $item['product_id'],
                    'quantity' => $item['quantity'],
                    'price' => $item['price'],
                ]);

                $product = Product::find($item['product_id']);
                $product->decrement('stock', $item['quantity']);
                $product->increment('sold', $item['quantity']);
            }

            DB::commit();

            return redirect()->route('pos.index')
                ->with('success', 'Transaction completed successfully!')
                ->with('lastTransaction', [
                    'id' => $transaction->id,
                    'date' => $transaction->date,
                    'time' => $transaction->time,
                    'subtotal' => $validated['subtotal'],
                    'tax' => $validated['tax'],
                ]);
                
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Checkout error: ' . $e->getMessage());
            return back()->with('error', 'Transaction failed. Please try again.');
        }
    }
}