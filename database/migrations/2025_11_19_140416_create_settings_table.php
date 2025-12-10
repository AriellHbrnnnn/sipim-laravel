<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('settings', function (Blueprint $table) {
            $table->id();
            $table->string('store_name')->default('SIPIM Store');
            $table->string('store_phone')->nullable();
            $table->string('store_email')->nullable();
            $table->text('store_address')->nullable();
            $table->string('currency')->default('IDR');
            $table->string('currency_symbol')->default('Rp');
            $table->string('logo_path')->nullable();
            $table->text('receipt_header')->nullable();
            $table->text('receipt_footer')->nullable();
            $table->boolean('tax_enabled')->default(false);
            $table->decimal('tax_percentage', 5, 2)->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('settings');
    }
};