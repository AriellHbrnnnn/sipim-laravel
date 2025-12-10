import { User } from '@/types';
import React from 'react';

interface SidebarProps {
    user: User & { photo?: string };
}

export default function Sidebar({ user }: SidebarProps) {
    return (
        <aside className="fixed inset-y-0 left-0 z-50 w-64 bg-blue-800 text-white transform transition-transform duration-300 lg:translate-x-0">
            {/* Logo */}
            <div className="flex items-center justify-center h-16 bg-blue-900 border-b border-blue-700">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                        <span className="text-blue-800 font-bold text-xl">S</span>
                    </div>
                    <div>
                        <h1 className="text-xl font-bold">SIPIM</h1>
                        <p className="text-xs text-blue-200">Store Management</p>
                    </div>
                </div>
            </div>

            {/* User Info */}
            <div className="p-4 border-b border-blue-700">
                <div className="flex items-center gap-3">
                    {user.photo ? (
                        <img
                            src={`/storage/${user.photo}?t=${Date.now()}`}
                            alt={user.name}
                            className="w-12 h-12 rounded-full object-cover border-2 border-blue-400"
                            onLoad={() => console.log('✅ Sidebar photo loaded')}
                            onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                                console.error('❌ Sidebar photo failed');
                                console.error('Path:', (e.currentTarget as HTMLImageElement).src);
                                // Fallback to initial
                                (e.currentTarget as HTMLImageElement).style.display = 'none';
                                const fallback = (e.currentTarget as HTMLImageElement).nextElementSibling as HTMLElement | null;
                                if (fallback) fallback.style.display = 'flex';
                            }}
                        />
                    ) : null}
                    
                    {/* Fallback initial */}
                    <div 
                        className={`w-12 h-12 rounded-full bg-blue-700 items-center justify-center border-2 border-blue-400 ${user.photo ? 'hidden' : 'flex'}`}
                    >
                        <span className="text-lg font-bold text-white">
                            {user.name.charAt(0).toUpperCase()}
                        </span>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                        <p className="text-white font-semibold truncate">{user.name}</p>
                        <p className="text-blue-200 text-sm capitalize">{user.role}</p>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <nav className="p-4 space-y-2">
                {/* Dashboard */}
                <a
                    href="/dashboard"
                    className={`flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-blue-700 hover:text-white rounded-lg transition-colors ${
                        typeof window !== 'undefined' && window.location.pathname === '/dashboard' ? 'bg-blue-700 text-white' : ''
                    }`}
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                    <span>Dashboard</span>
                </a>

                {/* Products */}
                <a
                    href="/products"
                    className={`flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-blue-700 hover:text-white rounded-lg transition-colors ${
                        typeof window !== 'undefined' && window.location.pathname === '/products' ? 'bg-blue-700 text-white' : ''
                    }`}
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                    <span>Products</span>
                </a>

                {/* Transactions */}
                <a
                    href="/transactions"
                    className={`flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-blue-700 hover:text-white rounded-lg transition-colors ${
                        typeof window !== 'undefined' && window.location.pathname === '/transactions' ? 'bg-blue-700 text-white' : ''
                    }`}
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2" />
                    </svg>
                    <span>Transactions</span>
                </a>

                {/* Suppliers - Owner Only */}
                {user.role === 'owner' && (
                    <a
                        href="/suppliers"
                        className={`flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-blue-700 hover:text-white rounded-lg transition-colors ${
                            typeof window !== 'undefined' && window.location.pathname === '/suppliers' ? 'bg-blue-700 text-white' : ''
                        }`}
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                        </svg>
                        <span>Suppliers</span>
                    </a>
                )}

                {/* Point of Sale */}
                <a
                    href="/pos"
                    className={`flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-blue-700 hover:text-white rounded-lg transition-colors ${
                        typeof window !== 'undefined' && window.location.pathname === '/pos' ? 'bg-blue-700 text-white' : ''
                    }`}
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <span>Point of Sale</span>
                </a>

                {/* Users - Owner Only */}
                {user.role === 'owner' && (
                    <a
                        href="/users"
                        className={`flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-blue-700 hover:text-white rounded-lg transition-colors ${
                            typeof window !== 'undefined' && window.location.pathname === '/users' ? 'bg-blue-700 text-white' : ''
                        }`}
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                        <span>Users</span>
                    </a>
                )}

                {/* Divider */}
                <div className="pt-4 mt-4 border-t border-blue-700"></div>

                {/* Settings - Owner Only */}
                {user.role === 'owner' && (
                    <a
                        href="/settings"
                        className={`flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-blue-700 hover:text-white rounded-lg transition-colors ${
                            typeof window !== 'undefined' && window.location.pathname === '/settings' ? 'bg-blue-700 text-white' : ''
                        }`}
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span>Settings</span>
                    </a>
                )}

                {/* Profile */}
                <a
                    href="/profile"
                    className={`flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-blue-700 hover:text-white rounded-lg transition-colors ${
                        typeof window !== 'undefined' && window.location.pathname === '/profile' ? 'bg-blue-700 text-white' : ''
                    }`}
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span>Profile</span>
                </a>

                {/* Logout */}
                <a
                    href="/logout"
                    className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-red-600 hover:text-white rounded-lg transition-colors"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    <span>Logout</span>
                </a>
            </nav>
        </aside>
    );
}
