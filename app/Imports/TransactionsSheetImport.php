<?php

namespace App\Imports;

use App\Models\Transaction;
use App\Models\TransactionItem;
use App\Models\Product;
use App\Models\User;
use Maatwebsite\Excel\Concerns\ToCollection;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Log;
use PhpOffice\PhpSpreadsheet\Shared\Date;
use Carbon\Carbon;

class TransactionsSheetImport implements ToCollection, WithHeadingRow
{
    public function collection(Collection $rows)
    {
        Log::info('📦 Processing Transactions sheet');
        Log::info('Total rows: ' . $rows->count());
        
        // Group transactions by transaction_id
        $groupedTransactions = $rows->groupBy('transaction_id');
        
        Log::info('Grouped into ' . $groupedTransactions->count() . ' transactions');

        foreach ($groupedTransactions as $transactionId => $items) {
            try {
                $firstRow = $items->first();
                
                Log::info("Processing transaction #{$transactionId}");
                
                // Find or use default cashier
                $cashier = User::where('email', $firstRow['cashier_email'] ?? 'owner@sipim.com')->first();
                
                if (!$cashier) {
                    $cashier = User::where('role', 'owner')->first();
                }
                
                if (!$cashier) {
                    Log::error("No cashier found for transaction #{$transactionId}");
                    continue;
                }

                // Convert date from Excel format
                $date = $this->convertExcelDate($firstRow['date']);
                
                // Handle time
                $time = $this->convertExcelTime($firstRow['time'] ?? '12:00:00');
                
                Log::info("Date: {$date}, Time: {$time}");

                // Calculate total
                $total = 0;
                foreach ($items as $item) {
                    $total += $item['quantity'] * $item['price'];
                }
                
                Log::info("Total amount: Rp " . number_format($total, 0, ',', '.'));

                // Create transaction
                $transaction = Transaction::create([
                    'cashier_id' => $cashier->id,
                    'total' => $total,
                    'date' => $date,
                    'time' => $time,
                ]);
                
                Log::info("✅ Transaction #{$transactionId} created with ID: {$transaction->id}");

                // Create transaction items
                $itemCount = 0;
                foreach ($items as $item) {
                    $product = Product::where('name', $item['product_name'])->first();
                    
                    if ($product) {
                        TransactionItem::create([
                            'transaction_id' => $transaction->id,
                            'product_id' => $product->id,
                            'quantity' => $item['quantity'],
                            'price' => $item['price'],
                        ]);

                        // Update product sold count
                        $product->increment('sold', $item['quantity']);
                        
                        $itemCount++;
                    } else {
                        Log::warning("Product not found: {$item['product_name']}");
                    }
                }
                
                Log::info("✅ Added {$itemCount} items to transaction #{$transactionId}");
                
            } catch (\Exception $e) {
                Log::error("❌ Failed to process transaction #{$transactionId}: " . $e->getMessage());
                continue;
            }
        }
        
        Log::info('✅ Transactions sheet processing completed');
    }
    
    /**
     * Convert Excel date to Y-m-d format
     */
    private function convertExcelDate($dateValue)
    {
        // If already a string in correct format (YYYY-MM-DD)
        if (is_string($dateValue) && preg_match('/^\d{4}-\d{2}-\d{2}$/', $dateValue)) {
            return $dateValue;
        }
        
        // If it's an Excel serial number (numeric)
        if (is_numeric($dateValue)) {
            try {
                $unixTimestamp = Date::excelToTimestamp($dateValue);
                return Carbon::createFromTimestamp($unixTimestamp)->format('Y-m-d');
            } catch (\Exception $e) {
                Log::warning("Failed to convert Excel date: {$dateValue}, using today's date");
                return Carbon::today()->format('Y-m-d');
            }
        }
        
        // Try to parse as Carbon date
        try {
            return Carbon::parse($dateValue)->format('Y-m-d');
        } catch (\Exception $e) {
            Log::warning("Failed to parse date: {$dateValue}, using today's date");
            return Carbon::today()->format('Y-m-d');
        }
    }
    
    /**
     * Convert Excel time to H:i:s format
     */
    private function convertExcelTime($timeValue)
    {
        // If already a string in correct format (HH:MM:SS)
        if (is_string($timeValue) && preg_match('/^\d{2}:\d{2}:\d{2}$/', $timeValue)) {
            return $timeValue;
        }
        
        // If it's an Excel time fraction (0.0 to 1.0)
        if (is_numeric($timeValue) && $timeValue >= 0 && $timeValue < 1) {
            try {
                $unixTimestamp = Date::excelToTimestamp($timeValue);
                return Carbon::createFromTimestamp($unixTimestamp)->format('H:i:s');
            } catch (\Exception $e) {
                Log::warning("Failed to convert Excel time: {$timeValue}, using 12:00:00");
                return '12:00:00';
            }
        }
        
        // If it's a full Excel datetime number
        if (is_numeric($timeValue) && $timeValue > 1) {
            try {
                $unixTimestamp = Date::excelToTimestamp($timeValue);
                return Carbon::createFromTimestamp($unixTimestamp)->format('H:i:s');
            } catch (\Exception $e) {
                Log::warning("Failed to convert Excel datetime: {$timeValue}, using 12:00:00");
                return '12:00:00';
            }
        }
        
        // Try to parse as Carbon time
        try {
            return Carbon::parse($timeValue)->format('H:i:s');
        } catch (\Exception $e) {
            Log::warning("Failed to parse time: {$timeValue}, using 12:00:00");
            return '12:00:00';
        }
    }
}