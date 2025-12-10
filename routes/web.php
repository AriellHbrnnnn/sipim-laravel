<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\SupplierController;
use App\Http\Controllers\TransactionController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\PosController;
use App\Http\Controllers\SettingsController;
use App\Exports\TransactionsExport;
use Maatwebsite\Excel\Facades\Excel;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;

Route::get('/', function () {
    return redirect()->route('login');
});

Route::middleware(['auth'])->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // Products
    Route::get('/products', [ProductController::class, 'index'])->name('products.index');
    Route::post('/products', [ProductController::class, 'store'])->name('products.store')->middleware('role:owner');
    Route::put('/products/{product}', [ProductController::class, 'update'])->name('products.update')->middleware('role:owner');
    Route::delete('/products/{product}', [ProductController::class, 'destroy'])->name('products.destroy')->middleware('role:owner');

    // Dashboard
Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
Route::get('/dashboard/export-pdf', [DashboardController::class, 'exportPdf'])->name('dashboard.export.pdf');

    // Suppliers
    Route::get('/suppliers', [SupplierController::class, 'index'])->name('suppliers.index')->middleware('role:owner');
    Route::post('/suppliers', [SupplierController::class, 'store'])->name('suppliers.store')->middleware('role:owner');
    Route::put('/suppliers/{supplier}', [SupplierController::class, 'update'])->name('suppliers.update')->middleware('role:owner');
    Route::delete('/suppliers/{supplier}', [SupplierController::class, 'destroy'])->name('suppliers.destroy')->middleware('role:owner');

    // Transactions
    Route::get('/transactions', [TransactionController::class, 'index'])->name('transactions.index');

    // Export - MUST be BEFORE {transaction} route
    Route::get('/transactions/export', function () {
        $startDate = request('start_date');
        $endDate = request('end_date');

        $filename = 'transactions_' . date('Y-m-d_His') . '.xlsx';

        return Excel::download(
            new TransactionsExport($startDate, $endDate),
            $filename
        );
    })->name('transactions.export');

    Route::get('/transactions/{transaction}', [TransactionController::class, 'show'])->name('transactions.show');

    // Users
    Route::get('/users', [UserController::class, 'index'])->name('users.index')->middleware('role:owner');
    Route::post('/users', [UserController::class, 'store'])->name('users.store')->middleware('role:owner');
    Route::put('/users/{user}', [UserController::class, 'update'])->name('users.update')->middleware('role:owner');
    Route::delete('/users/{user}', [UserController::class, 'destroy'])->name('users.destroy')->middleware('role:owner');

    // Point of Sale
    Route::get('/pos', [PosController::class, 'index'])->name('pos.index');
    Route::post('/pos/checkout', [PosController::class, 'checkout'])->name('pos.checkout');

    // Profile
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::put('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::post('/profile/photo', [ProfileController::class, 'updatePhoto'])->name('profile.photo.update');
    Route::delete('/profile/photo', [ProfileController::class, 'deletePhoto'])->name('profile.photo.delete');
    Route::put('/profile/password', [ProfileController::class, 'updatePassword'])->name('profile.password.update');

    // Settings - Owner only
    Route::middleware('role:owner')->group(function () {
        Route::get('/settings', [SettingsController::class, 'index'])->name('settings.index');
        Route::put('/settings', [SettingsController::class, 'update'])->name('settings.update');

        // Import Routes
        Route::get('/settings/template', [SettingsController::class, 'downloadTemplate'])->name('settings.template');
        Route::post('/settings/import', [SettingsController::class, 'importData'])->name('settings.import');
    });

    // Logout
    Route::get('/logout', function () {
        Auth::logout();
        return redirect('/login');
    })->name('logout');
});

require __DIR__ . '/auth.php';
