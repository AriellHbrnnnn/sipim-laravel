export interface User {
    id: number;
    name: string;
    email: string;
    role: 'owner' | 'employee';
    email_verified_at?: string;
}

export interface Product {
    id: number;
    name: string;
    category: string;
    price: number;
    cost: number;
    stock: number;
    sold: number;
    created_at: string;
    updated_at: string;
}

export interface Supplier {
    id: number;
    name: string;
    phone: string;
    email: string;
    address: string;
    products: string;
    created_at: string;
    updated_at: string;
}

export interface Transaction {
    id: number;
    date: string;
    time: string;
    products: TransactionProduct[];
    total: number;
    cashier_id: number;
    cashier_name: string;
    created_at: string;
    updated_at: string;
}

export interface TransactionProduct {
    product_id: number;
    product_name: string;
    quantity: number;
    price: number;
}

export interface Notification {
    id: number;
    type: 'stock' | 'bestseller' | 'target';
    message: string;
    read: boolean;
    date: string;
}

export interface SalesData {
    month: string;
    sales: number;
    profit: number;
}

export interface CategoryData {
    category: string;
    sales: number;
    stock: number;
    products: Product[];
}

export type FilterPeriod = 'daily' | 'weekly' | 'monthly';

export interface CartItem {
    product_id: number;
    product_name: string;
    price: number;
    quantity: number;
}

export type PageProps<T extends Record<string, unknown> = Record<string, unknown>> = T & {
    auth: {
        user: User;
    };
};
