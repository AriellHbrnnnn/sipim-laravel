<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Product;
use App\Models\Supplier;
use Illuminate\Database\Seeder;
use App\Models\Transaction;
use App\Models\TransactionItem;
use App\Models\Setting;
use App\Models\Category;
use Carbon\Carbon;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Create Users
        $owner = User::updateOrCreate(
            ['email' => 'owner@sipim.com'],
            [
                'name' => 'Budi Santoso',
                'password' => bcrypt('password'),
                'role' => 'owner',
                'email_verified_at' => now(),
            ]
        );

        $employee = User::updateOrCreate(
            ['email' => 'employee@sipim.com'],
            [
                'name' => 'Siti Aminah',
                'password' => bcrypt('password'),
                'role' => 'employee',
                'email_verified_at' => now(),
            ]
        );

        // 2. Create Settings
        if (Setting::count() === 0) {
            Setting::create([
                'store_name' => 'SIPIM Store',
                'store_phone' => '0812-3456-7890',
                'store_email' => 'admin@sipim.com',
                'store_address' => 'Jl. Soekarno Hatta No. 45, Natuna, Kepulauan Riau',
                'currency' => 'IDR',
                'currency_symbol' => 'Rp',
                'receipt_header' => 'Selamat Belanja!',
                'receipt_footer' => 'Terima kasih atas kunjungan Anda. Barang yang dibeli tidak dapat ditukar.',
                'tax_enabled' => false, // Biasanya UMKM belum pakai PPN di struk
                'tax_percentage' => 11.00,
            ]);
        }

        // 3. Create Categories (Lengkap)
        $categoriesData = [
            ['name' => 'Makanan', 'description' => 'Mie instan, Roti, Beras, Sembako'],
            ['name' => 'Minuman', 'description' => 'Air mineral, Kopi, Susu, Minuman ringan'],
            ['name' => 'Snack & Coklat', 'description' => 'Keripik, Biskuit, Coklat, Permen'],
            ['name' => 'Rokok', 'description' => 'Rokok filter, Kretek, Elektrik'],
            ['name' => 'Perawatan Diri', 'description' => 'Sabun, Shampo, Pasta Gigi'],
            ['name' => 'Kebutuhan Rumah', 'description' => 'Deterjen, Pembersih Lantai, Gas'],
            ['name' => 'Kesehatan', 'description' => 'Obat-obatan bebas, Vitamin, Minyak angin'],
            ['name' => 'Ibu & Bayi', 'description' => 'Popok, Susu Formula, Minyak Telon'],
        ];

        foreach ($categoriesData as $cat) {
            Category::firstOrCreate(['name' => $cat['name']], $cat);
        }

        // Ambil ID kategori untuk mapping produk
        $cats = Category::pluck('name', 'name')->toArray(); // Key = Name, Value = Name (bisa disesuaikan jika relasi pakai ID)

        // 4. Create Suppliers (Distributor Besar)
        $suppliersData = [
            ['name' => 'PT Indofood CBP', 'phone' => '021-111111', 'products' => 'Indomie, Pop Mie, Chitato, Indomilk'],
            ['name' => 'PT Unilever Indonesia', 'phone' => '021-222222', 'products' => 'Lifebuoy, Pepsodent, Rinso, Sunlight, Royco'],
            ['name' => 'PT Mayora Indah', 'phone' => '021-333333', 'products' => 'Beng Beng, Kopiko, Torabika, Le Minerale'],
            ['name' => 'PT HM Sampoerna', 'phone' => '031-444444', 'products' => 'Sampoerna Mild, Dji Sam Soe'],
            ['name' => 'PT Gudang Garam', 'phone' => '0354-555555', 'products' => 'Gudang Garam Filter, Surya 16'],
            ['name' => 'PT Coca-Cola Amatil', 'phone' => '021-666666', 'products' => 'Coke, Sprite, Fanta, Frestea'],
            ['name' => 'PT Tirta Investama (Danone)', 'phone' => '021-777777', 'products' => 'Aqua, Mizone, Vit'],
            ['name' => 'Agen Sembako Lokal', 'phone' => '0812-9999-8888', 'products' => 'Beras, Telur, Gula, Minyak Curah'],
        ];

        foreach ($suppliersData as $sup) {
            Supplier::firstOrCreate(['name' => $sup['name']], [
                'phone' => $sup['phone'],
                'email' => strtolower(str_replace(' ', '', $sup['name'])) . '@distributor.com',
                'address' => 'Kawasan Industri, Indonesia',
                'products' => $sup['products']
            ]);
        }

        // 5. Create Products (Data Realistis & Banyak)
        if (Product::count() < 10) {
            $products = [
                // Makanan / Sembako
                ['name' => 'Indomie Goreng Original', 'category' => 'Makanan', 'price' => 3500, 'cost' => 2800, 'stock' => 200],
                ['name' => 'Indomie Soto Mie', 'category' => 'Makanan', 'price' => 3500, 'cost' => 2800, 'stock' => 150],
                ['name' => 'Mie Sedaap Goreng', 'category' => 'Makanan', 'price' => 3500, 'cost' => 2700, 'stock' => 150],
                ['name' => 'Pop Mie Ayam Bawang', 'category' => 'Makanan', 'price' => 6000, 'cost' => 4800, 'stock' => 80],
                ['name' => 'Beras Premium 5kg', 'category' => 'Makanan', 'price' => 75000, 'cost' => 68000, 'stock' => 20],
                ['name' => 'Telur Ayam Negeri (1kg)', 'category' => 'Makanan', 'price' => 28000, 'cost' => 25000, 'stock' => 30],
                ['name' => 'Minyak Goreng Sania 2L', 'category' => 'Makanan', 'price' => 38000, 'cost' => 34000, 'stock' => 40],
                ['name' => 'Gula Pasir Gulaku 1kg', 'category' => 'Makanan', 'price' => 16000, 'cost' => 13500, 'stock' => 50],
                ['name' => 'Sari Roti Tawar', 'category' => 'Makanan', 'price' => 14000, 'cost' => 11000, 'stock' => 15],
                ['name' => 'Kecap Bango 550ml', 'category' => 'Makanan', 'price' => 24000, 'cost' => 20000, 'stock' => 25],

                // Minuman
                ['name' => 'Aqua Botol 600ml', 'category' => 'Minuman', 'price' => 4000, 'cost' => 2800, 'stock' => 100],
                ['name' => 'Aqua Galon 19L (Isi Ulang)', 'category' => 'Minuman', 'price' => 22000, 'cost' => 17000, 'stock' => 50],
                ['name' => 'Le Minerale 600ml', 'category' => 'Minuman', 'price' => 3500, 'cost' => 2500, 'stock' => 80],
                ['name' => 'Teh Pucuk Harum 350ml', 'category' => 'Minuman', 'price' => 4000, 'cost' => 2700, 'stock' => 120],
                ['name' => 'Floridina Orange', 'category' => 'Minuman', 'price' => 3500, 'cost' => 2500, 'stock' => 60],
                ['name' => 'Bear Brand (Susu Beruang)', 'category' => 'Minuman', 'price' => 10500, 'cost' => 9000, 'stock' => 48],
                ['name' => 'Yakult (1 Pack)', 'category' => 'Minuman', 'price' => 10500, 'cost' => 8500, 'stock' => 30],
                ['name' => 'Kopi Good Day Cappuccino', 'category' => 'Minuman', 'price' => 7000, 'cost' => 5500, 'stock' => 50],
                ['name' => 'Coca Cola 390ml', 'category' => 'Minuman', 'price' => 5500, 'cost' => 4000, 'stock' => 40],
                ['name' => 'Es Batu Kristal (Pack)', 'category' => 'Minuman', 'price' => 2000, 'cost' => 1000, 'stock' => 20],

                // Snack
                ['name' => 'Beng Beng', 'category' => 'Snack & Coklat', 'price' => 2500, 'cost' => 1800, 'stock' => 200],
                ['name' => 'Chitato Sapi Panggang', 'category' => 'Snack & Coklat', 'price' => 11000, 'cost' => 9000, 'stock' => 40],
                ['name' => 'Qtela Singkong Balado', 'category' => 'Snack & Coklat', 'price' => 6500, 'cost' => 5000, 'stock' => 50],
                ['name' => 'Oreo Original', 'category' => 'Snack & Coklat', 'price' => 9500, 'cost' => 7500, 'stock' => 60],
                ['name' => 'Silverqueen Chunky Bar', 'category' => 'Snack & Coklat', 'price' => 25000, 'cost' => 21000, 'stock' => 30],
                ['name' => 'Roma Kelapa Biskuit', 'category' => 'Snack & Coklat', 'price' => 10000, 'cost' => 8000, 'stock' => 35],

                // Rokok (Best Seller di Indo)
                ['name' => 'Sampoerna Mild 16', 'category' => 'Rokok', 'price' => 32000, 'cost' => 29500, 'stock' => 100],
                ['name' => 'Gudang Garam Surya 12', 'category' => 'Rokok', 'price' => 24000, 'cost' => 22000, 'stock' => 80],
                ['name' => 'Djarum Super 12', 'category' => 'Rokok', 'price' => 23000, 'cost' => 21000, 'stock' => 80],
                ['name' => 'Marlboro Merah', 'category' => 'Rokok', 'price' => 42000, 'cost' => 39000, 'stock' => 40],
                ['name' => 'LA Lights 16', 'category' => 'Rokok', 'price' => 31000, 'cost' => 28500, 'stock' => 60],

                // Kebutuhan Rumah & Personal
                ['name' => 'Rinso Anti Noda 770g', 'category' => 'Kebutuhan Rumah', 'price' => 28000, 'cost' => 25000, 'stock' => 30],
                ['name' => 'Sunlight Jeruk Nipis 755ml', 'category' => 'Kebutuhan Rumah', 'price' => 18000, 'cost' => 15000, 'stock' => 40],
                ['name' => 'Gas Elpiji 3kg', 'category' => 'Kebutuhan Rumah', 'price' => 22000, 'cost' => 18000, 'stock' => 20],
                ['name' => 'Lifebuoy Sabun Cair 450ml', 'category' => 'Perawatan Diri', 'price' => 25000, 'cost' => 21000, 'stock' => 25],
                ['name' => 'Pepsodent Pencegah Berlubang', 'category' => 'Perawatan Diri', 'price' => 12000, 'cost' => 9500, 'stock' => 50],
                ['name' => 'Shampo Pantene Sachet (Renceng)', 'category' => 'Perawatan Diri', 'price' => 12000, 'cost' => 10000, 'stock' => 50],
                
                // Kesehatan & Bayi
                ['name' => 'Minyak Kayu Putih Cap Lang 60ml', 'category' => 'Kesehatan', 'price' => 24000, 'cost' => 20000, 'stock' => 30],
                ['name' => 'Panadol Merah (Strip)', 'category' => 'Kesehatan', 'price' => 12000, 'cost' => 10000, 'stock' => 40],
                ['name' => 'Tolak Angin Cair (Sachet)', 'category' => 'Kesehatan', 'price' => 4500, 'cost' => 3500, 'stock' => 100],
                ['name' => 'MamyPoko Pants M', 'category' => 'Ibu & Bayi', 'price' => 55000, 'cost' => 48000, 'stock' => 15],
                ['name' => 'SGM Eksplor 1+ 400g', 'category' => 'Ibu & Bayi', 'price' => 42000, 'cost' => 38000, 'stock' => 20],
            ];

            foreach ($products as $prod) {
                Product::create([
                    'name' => $prod['name'],
                    'category' => $prod['category'],
                    'price' => $prod['price'],
                    'cost' => $prod['cost'],
                    'stock' => $prod['stock'],
                    'sold' => rand(10, 100), // Random sold count
                ]);
            }
        }

        // 6. Generate Transactions History (Algorithm)
        // Ini akan membuat transaksi untuk 30 hari ke belakang secara otomatis
        if (Transaction::count() === 0) {
            $products = Product::all();
            $cashiers = [$owner->id, $employee->id];

            // Loop untuk 30 hari terakhir
            for ($daysAgo = 30; $daysAgo >= 0; $daysAgo--) {
                
                // Tentukan jumlah transaksi per hari (Acak antara 3 sampai 15 transaksi sehari)
                // Hari ini (0 days ago) mungkin transaksinya baru sedikit
                $transactionsCount = ($daysAgo == 0) ? rand(2, 5) : rand(5, 15);
                $date = Carbon::now()->subDays($daysAgo);

                for ($i = 0; $i < $transactionsCount; $i++) {
                    // Random jam transaksi antara jam 8 pagi sampai 9 malam
                    $time = Carbon::createFromTime(rand(8, 21), rand(0, 59), rand(0, 59));

                    $transaction = Transaction::create([
                        'cashier_id' => $cashiers[array_rand($cashiers)],
                        'total' => 0, // Nanti diupdate
                        'date' => $date->toDateString(),
                        'time' => $time->toTimeString(),
                        'created_at' => $date->setTimeFrom($time),
                        'updated_at' => $date->setTimeFrom($time),
                    ]);

                    $totalAmount = 0;
                    // Random jumlah item dalam 1 struk (1 sampai 5 jenis barang)
                    $itemsCount = rand(1, 5);
                    
                    // Ambil produk acak
                    $randomProducts = $products->random($itemsCount);

                    foreach ($randomProducts as $itemProduct) {
                        // Quantity beli 1-3 pcs
                        $qty = rand(1, 3);
                        $subtotal = $itemProduct->price * $qty;

                        TransactionItem::create([
                            'transaction_id' => $transaction->id,
                            'product_id' => $itemProduct->id,
                            'quantity' => $qty,
                            'price' => $itemProduct->price,
                            'created_at' => $date->setTimeFrom($time),
                            'updated_at' => $date->setTimeFrom($time),
                        ]);

                        $totalAmount += $subtotal;
                        
                        // Kurangi stok (simple logic)
                        $itemProduct->decrement('stock', $qty);
                        $itemProduct->increment('sold', $qty);
                    }

                    // Update total transaksi
                    $transaction->update(['total' => $totalAmount]);
                }
            }
        }
    }
}