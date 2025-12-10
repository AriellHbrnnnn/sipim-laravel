# SIPIM - Store Information & Management System

Laravel 11 + Inertia.js + React + TypeScript + Tailwind CSS + MySQL

## 📋 Requirements

- PHP >= 8.2
- Composer
- Node.js >= 18
- MySQL
- Git

## 🚀 Installation

### 1. Clone Project

```bash
# Extract atau clone project ini
cd sipim-laravel
```

### 2. Install PHP Dependencies

```bash
composer install
```

### 3. Install Node Dependencies

```bash
npm install
```

### 4. Environment Setup

```bash
# Copy .env.example ke .env
cp .env.example .env

# Generate application key
php artisan key:generate
```

### 5. Database Configuration

Edit file `.env` dan sesuaikan dengan database MySQL Anda:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=sipim_db
DB_USERNAME=root
DB_PASSWORD=your_password
```

### 6. Create Database

Buat database di MySQL:

```sql
CREATE DATABASE sipim_db;
```

### 7. Run Migrations & Seeders

```bash
# Run migrations untuk membuat tabel
php artisan migrate

# Run seeders untuk dummy data
php artisan db:seed
```

### 8. Start Development Server

Buka 2 terminal:

**Terminal 1 - Laravel Server:**
```bash
php artisan serve
```

**Terminal 2 - Vite (Frontend):**
```bash
npm run dev
```

### 9. Access Application

Buka browser: `http://localhost:8000`

## 🔐 Demo Accounts

### Owner Account
- Email: `owner@sipim.com`
- Password: `password`

### Employee Account
- Email: `employee@sipim.com`
- Password: `password`

## 📁 Project Structure

```
├── app/
│   ├── Http/
│   │   ├── Controllers/
│   │   │   ├── Auth/
│   │   │   ├── DashboardController.php
│   │   │   ├── ProductController.php
│   │   │   ├── SupplierController.php
│   │   │   ├── TransactionController.php
│   │   │   ├── UserController.php
│   │   │   └── PosController.php
│   │   └── Middleware/
│   │       └── RoleMiddleware.php
│   └── Models/
│       ├── User.php
│       ├── Product.php
│       ├── Supplier.php
│       └── Transaction.php
├── database/
│   ├── migrations/
│   └── seeders/
├── resources/
│   ├── css/
│   │   └── app.css
│   └── js/
│       ├── Components/
│       ├── Layouts/
│       │   ├── AuthenticatedLayout.tsx
│       │   └── Sidebar.tsx
│       ├── Pages/
│       │   ├── Auth/
│       │   │   └── Login.tsx
│       │   ├── Dashboard.tsx
│       │   ├── Products/
│       │   ├── Suppliers/
│       │   ├── Transactions/
│       │   ├── Users/
│       │   └── Pos/
│       ├── types/
│       │   ├── index.d.ts
│       │   └── global.d.ts
│       ├── app.tsx
│       └── bootstrap.ts
└── routes/
    ├── web.php
    └── auth.php
```

## ✨ Features

- ✅ **Dashboard** - Analytics dan overview
- ✅ **Products Management** - CRUD produk
- ✅ **Suppliers Management** - Manajemen supplier
- ✅ **Transactions** - Riwayat transaksi
- ✅ **Point of Sale (PoS)** - Sistem kasir
- ✅ **Users Management** - Manajemen user (Owner only)
- ✅ **Authentication** - Login/Logout dengan session
- ✅ **Role-based Access** - Owner & Employee roles

## 🛠 Tech Stack

### Backend
- Laravel 11
- MySQL
- Inertia.js Server Adapter

### Frontend
- React 18
- TypeScript
- Inertia.js React
- Tailwind CSS
- Lucide React Icons
- Vite

## 📝 Development Commands

```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Run PHP tests
php artisan test

# Clear cache
php artisan cache:clear
php artisan config:clear
php artisan route:clear

# Create new controller
php artisan make:controller NameController

# Create new model with migration
php artisan make:model ModelName -m

# Create new seeder
php artisan make:seeder TableSeeder
```

## 🔄 Next Steps

STEP 1: ✅ Setup Laravel 11 + Inertia.js + React (DONE)

STEP 2: Database Design & Migrations
- Create migrations untuk semua tabel
- Setup relationships
- Create seeders dengan dummy data

STEP 3: Complete Authentication System

STEP 4: Implement All Pages & Components

STEP 5: Implement Business Logic & Controllers

STEP 6: Testing & Refinement

## 📞 Support

Jika ada pertanyaan atau masalah, silakan hubungi developer.

---

Made with ❤️ using Laravel + Inertia.js + React
