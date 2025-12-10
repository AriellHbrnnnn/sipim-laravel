import { useEffect, useState } from 'react';
import { CheckCircle, XCircle, AlertCircle, X } from 'lucide-react';

interface ToastProps {
    message: string;
    type: 'success' | 'error' | 'info';
    onClose: () => void;
}

export default function Toast({ message, type, onClose }: ToastProps) {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false);
            setTimeout(onClose, 300); // Wait for fade out animation
        }, 3000);

        return () => clearTimeout(timer);
    }, [onClose]);

    const icons = {
        success: <CheckCircle className="w-5 h-5 text-green-600" />,
        error: <XCircle className="w-5 h-5 text-red-600" />,
        info: <AlertCircle className="w-5 h-5 text-blue-600" />,
    };

    const bgColors = {
        success: 'bg-green-50 border-green-200',
        error: 'bg-red-50 border-red-200',
        info: 'bg-blue-50 border-blue-200',
    };

    return (
        <div
            className={`fixed top-4 right-4 z-50 transition-all duration-300 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'
            }`}
        >
            <div className={`flex items-center gap-3 px-4 py-3 rounded-lg border shadow-lg ${bgColors[type]} min-w-[300px]`}>
                {icons[type]}
                <p className="flex-1 text-sm font-medium text-gray-900">{message}</p>
                <button
                    onClick={() => {
                        setIsVisible(false);
                        setTimeout(onClose, 300);
                    }}
                    className="text-gray-400 hover:text-gray-600"
                >
                    <X className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}