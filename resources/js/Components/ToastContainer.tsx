import { usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import Toast from './Toast';

interface ToastMessage {
    id: number;
    message: string;
    type: 'success' | 'error' | 'info';
}

export default function ToastContainer() {
    const { flash } = usePage().props as any;
    const [toasts, setToasts] = useState<ToastMessage[]>([]);
    const [toastId, setToastId] = useState(0);

    useEffect(() => {
        if (flash?.success) {
            addToast(flash.success, 'success');
        }
        if (flash?.error) {
            addToast(flash.error, 'error');
        }
        if (flash?.info) {
            addToast(flash.info, 'info');
        }
    }, [flash]);

    const addToast = (message: string, type: 'success' | 'error' | 'info') => {
        const id = toastId;
        setToastId(prev => prev + 1);
        setToasts(prev => [...prev, { id, message, type }]);
    };

    const removeToast = (id: number) => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
    };

    return (
        <div>
            {toasts.map((toast) => (
                <Toast
                    key={toast.id}
                    message={toast.message}
                    type={toast.type}
                    onClose={() => removeToast(toast.id)}
                />
            ))}
        </div>
    );
}