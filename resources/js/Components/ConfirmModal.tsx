import { AlertTriangle, X } from 'lucide-react';

interface ConfirmModalProps {
    show: boolean;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm: () => void;
    onCancel: () => void;
    type?: 'danger' | 'warning' | 'info';
}

export default function ConfirmModal({
    show,
    title,
    message,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    onConfirm,
    onCancel,
    type = 'danger',
}: ConfirmModalProps) {
    if (!show) return null;

    const colors = {
        danger: {
            bg: 'bg-red-100',
            icon: 'text-red-600',
            button: 'bg-red-600 hover:bg-red-700',
        },
        warning: {
            bg: 'bg-yellow-100',
            icon: 'text-yellow-600',
            button: 'bg-yellow-600 hover:bg-yellow-700',
        },
        info: {
            bg: 'bg-blue-100',
            icon: 'text-blue-600',
            button: 'bg-blue-600 hover:bg-blue-700',
        },
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-md w-full shadow-xl animate-fadeIn">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
                    <button
                        onClick={onCancel}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6">
                    <div className="flex items-start gap-4">
                        <div className={`flex-shrink-0 p-3 rounded-full ${colors[type].bg}`}>
                            <AlertTriangle className={`w-6 h-6 ${colors[type].icon}`} />
                        </div>
                        <div className="flex-1">
                            <p className="text-sm text-gray-700">{message}</p>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex gap-3 px-6 py-4 bg-gray-50 rounded-b-lg">
                    <button
                        onClick={onCancel}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 font-medium text-gray-700 transition-colors"
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={onConfirm}
                        className={`flex-1 px-4 py-2 rounded-lg font-medium text-white transition-colors ${colors[type].button}`}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
}