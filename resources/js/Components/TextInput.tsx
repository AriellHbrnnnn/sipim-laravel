import { forwardRef, InputHTMLAttributes } from 'react';

export default forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement> & { error?: string }>(
    function TextInput({ type = 'text', className = '', error, ...props }, ref) {
        return (
            <input
                {...props}
                type={type}
                className={
                    'w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-all ' +
                    (error
                        ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                        : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500') +
                    ' ' +
                    className
                }
                ref={ref}
            />
        );
    }
);