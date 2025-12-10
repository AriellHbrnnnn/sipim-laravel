<?php

namespace App\Http\Controllers;

use App\Models\Setting;
use App\Models\Product;
use App\Models\Transaction;
use App\Imports\DataImport;
use App\Exports\DataTemplateExport;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Maatwebsite\Excel\Facades\Excel;
use Inertia\Inertia;

class SettingsController extends Controller
{
    public function index()
    {
        if (auth()->user()->role !== 'owner') {
            abort(403, 'Unauthorized action.');
        }

        $settings = Setting::first();
        
        // Get comprehensive import stats
        $stats = [
            'total_products' => Product::count(),
            'total_transactions' => Transaction::count(),
            'total_revenue' => Transaction::sum('total') ?? 0,
            'last_import' => Product::max('updated_at'),
        ];

        return Inertia::render('Settings/Index', [
            'settings' => $settings,
            'importStats' => $stats,
        ]);
    }

    public function update(Request $request)
    {
        if (auth()->user()->role !== 'owner') {
            abort(403, 'Unauthorized action.');
        }

        $validated = $request->validate([
            'store_name' => 'required|string|max:255',
            'store_phone' => 'nullable|string|max:20',
            'store_email' => 'nullable|email|max:255',
            'store_address' => 'nullable|string',
            'currency' => 'required|string|max:10',
            'currency_symbol' => 'required|string|max:5',
            'receipt_header' => 'nullable|string',
            'receipt_footer' => 'nullable|string',
            'tax_enabled' => 'boolean',
            'tax_percentage' => 'nullable|numeric|min:0|max:100',
        ]);

        $settings = Setting::first();
        
        if (!$settings) {
            $settings = Setting::create($validated);
        } else {
            $settings->update($validated);
        }

        return redirect()->route('settings.index')
            ->with('success', 'Settings updated successfully!');
    }

    public function downloadTemplate()
    {
        return Excel::download(new DataTemplateExport(), 'sipim_data_template.xlsx');
    }

    public function importData(Request $request)
    {
        Log::info('========================================');
        Log::info('🚀 IMPORT PROCESS STARTED');
        Log::info('User: ' . auth()->user()->email);
        Log::info('Timestamp: ' . now());
        
        $request->validate([
            'file' => 'required|mimes:xlsx,xls|max:10240',
            'clear_existing' => 'boolean',
        ]);

        Log::info('✅ Validation passed');
        Log::info('File name: ' . $request->file('file')->getClientOriginalName());
        Log::info('File size: ' . round($request->file('file')->getSize() / 1024, 2) . ' KB');
        Log::info('Clear existing: ' . ($request->clear_existing ? 'YES' : 'NO'));

        try {
            // Clear existing data if requested (WITHOUT DB transaction to avoid conflict)
            if ($request->clear_existing) {
                Log::info('----------------------------------------');
                Log::info('🗑️  CLEARING EXISTING DATA');
                
                // Count before delete
                $oldProductsCount = Product::count();
                $oldTransactionsCount = Transaction::count();
                Log::info("Before clear - Products: {$oldProductsCount}, Transactions: {$oldTransactionsCount}");
                
                // Disable foreign key checks
                DB::statement('SET FOREIGN_KEY_CHECKS=0;');
                Log::info('✅ Foreign key checks disabled');
                
                // Truncate tables (order matters: child first, then parent)
                DB::table('transaction_items')->truncate();
                Log::info('✅ Transaction items truncated');
                
                DB::table('transactions')->truncate();
                Log::info('✅ Transactions truncated');
                
                DB::table('products')->truncate();
                Log::info('✅ Products truncated');
                
                // Re-enable foreign key checks
                DB::statement('SET FOREIGN_KEY_CHECKS=1;');
                Log::info('✅ Foreign key checks re-enabled');
                Log::info('✅ All existing data cleared successfully');
            }

            // Import new data
            // NOTE: Excel::import handles its own transactions internally
            // DO NOT wrap this in DB::beginTransaction() or it will cause SAVEPOINT errors
            Log::info('----------------------------------------');
            Log::info('📥 STARTING EXCEL IMPORT');
            
            Excel::import(new DataImport, $request->file('file'));
            
            Log::info('✅ Excel import completed without errors');

            // Get final counts
            Log::info('----------------------------------------');
            Log::info('📊 CALCULATING FINAL STATISTICS');
            
            $productsCount = Product::count();
            $transactionsCount = Transaction::count();
            $totalRevenue = Transaction::sum('total') ?? 0;
            
            Log::info("Final count - Products: {$productsCount}");
            Log::info("Final count - Transactions: {$transactionsCount}");
            Log::info("Total Revenue: Rp " . number_format($totalRevenue, 0, ',', '.'));
            
            Log::info('----------------------------------------');
            Log::info('✅ IMPORT PROCESS COMPLETED SUCCESSFULLY');
            Log::info('========================================');

            return redirect()->route('settings.index')
                ->with('success', "Data imported successfully! {$productsCount} products and {$transactionsCount} transactions added.");

        } catch (\Maatwebsite\Excel\Validators\ValidationException $e) {
            // Handle Excel validation errors specifically
            Log::error('----------------------------------------');
            Log::error('❌ EXCEL VALIDATION ERROR');
            
            $failures = $e->failures();
            $errorMessages = [];
            
            foreach ($failures as $failure) {
                $row = $failure->row();
                $attribute = $failure->attribute();
                $errors = $failure->errors();
                $values = $failure->values();
                
                $errorMsg = "Row {$row}, Column '{$attribute}': " . implode(', ', $errors);
                $errorMessages[] = $errorMsg;
                
                Log::error($errorMsg);
                Log::error("Values: " . json_encode($values));
            }
            
            Log::error('Total validation errors: ' . count($errorMessages));
            Log::error('========================================');
            
            // Re-enable foreign key checks if disabled
            try {
                DB::statement('SET FOREIGN_KEY_CHECKS=1;');
            } catch (\Exception $fkError) {
                // Ignore
            }
            
            return redirect()->route('settings.index')
                ->with('error', 'Excel validation failed. Check: ' . implode(' | ', array_slice($errorMessages, 0, 3)));
                
        } catch (\Exception $e) {
            // Handle general errors
            Log::error('----------------------------------------');
            Log::error('❌ IMPORT FAILED WITH EXCEPTION');
            Log::error('Error Type: ' . get_class($e));
            Log::error('Error Message: ' . $e->getMessage());
            Log::error('Error File: ' . $e->getFile());
            Log::error('Error Line: ' . $e->getLine());
            Log::error('Stack Trace:');
            Log::error($e->getTraceAsString());
            Log::error('========================================');
            
            // Re-enable foreign key checks if disabled
            try {
                DB::statement('SET FOREIGN_KEY_CHECKS=1;');
            } catch (\Exception $fkError) {
                Log::error('Failed to re-enable foreign key checks: ' . $fkError->getMessage());
            }
            
            return redirect()->route('settings.index')
                ->with('error', 'Import failed: ' . $e->getMessage());
        }
    }
}