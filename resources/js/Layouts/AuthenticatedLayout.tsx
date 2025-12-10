import { PropsWithChildren, ReactNode } from 'react';
import { User } from '@/types';
import Sidebar from './Sidebar';
import ToastContainer from '@/Components/ToastContainer';

export default function AuthenticatedLayout({
    user,
    header,
    children,
}: PropsWithChildren<{ user: User; header?: ReactNode }>) {
    return (
        <div className="min-h-screen bg-gray-100 flex">
            <Sidebar user={user} />
            
            <div className="flex-1 ml-64">
                {header && (
                    <header className="bg-white shadow">
                        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                            {header}
                        </div>
                    </header>
                )}

                <main className="p-6">
                    {children}
                </main>
            </div>

            {/* Add Toast Container */}
            <ToastContainer />
        </div>
    );
}