import { useState } from 'react';
import { Printer, X } from 'lucide-react';

interface ReceiptItem {
    product_name: string;
    quantity: number;
    price: number;
}

interface ReceiptProps {
    show: boolean;
    transactionId: number;
    items: ReceiptItem[];
    total: number;
    cashierName: string;
    date: string;
    time: string;
    onClose: () => void;
}

export default function Receipt({
    show,
    transactionId,
    items,
    total,
    cashierName,
    date,
    time,
    onClose,
}: ReceiptProps) {
    const [isPrinting, setIsPrinting] = useState(false);

    if (!show) return null;

    const handlePrint = () => {
    setIsPrinting(true);
    
    // Create printable HTML content
    const printContent = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <title>Receipt #${transactionId}</title>
            <style>
                @page {
                    size: 80mm auto;
                    margin: 5mm;
                }
                body {
                    font-family: 'Courier New', monospace;
                    margin: 0;
                    padding: 10px;
                    font-size: 11px;
                    line-height: 1.4;
                    color: #000;
                }
                h1 {
                    font-size: 20px;
                    text-align: center;
                    margin: 0 0 5px 0;
                    font-weight: bold;
                }
                .center {
                    text-align: center;
                }
                .header {
                    border-bottom: 2px dashed #333;
                    padding-bottom: 10px;
                    margin-bottom: 10px;
                }
                .info {
                    margin: 10px 0;
                }
                .info-row {
                    display: flex;
                    justify-content: space-between;
                    margin: 4px 0;
                }
                table {
                    width: 100%;
                    border-collapse: collapse;
                    border-top: 2px dashed #333;
                    border-bottom: 2px dashed #333;
                    margin: 10px 0;
                    padding: 10px 0;
                }
                thead {
                    border-bottom: 1px solid #333;
                }
                th, td {
                    padding: 6px 2px;
                    text-align: left;
                }
                th {
                    font-weight: bold;
                }
                th:nth-child(2), td:nth-child(2) {
                    text-align: center;
                    width: 40px;
                }
                th:nth-child(3), td:nth-child(3),
                th:nth-child(4), td:nth-child(4) {
                    text-align: right;
                }
                tbody tr {
                    border-bottom: 1px dotted #ccc;
                }
                .total-row {
                    font-size: 16px;
                    font-weight: bold;
                    margin: 10px 0;
                    display: flex;
                    justify-content: space-between;
                    padding: 10px 0;
                }
                .footer {
                    border-top: 2px dashed #333;
                    padding-top: 10px;
                    margin-top: 10px;
                    text-align: center;
                    font-size: 10px;
                }
            </style>
        </head>
        <body>
            <div class="header center">
                <h1>SIPIM STORE</h1>
                <div style="font-size: 11px; margin: 2px 0;">Store Information & Management</div>
                <div style="font-size: 9px; margin-top: 5px; color: #666;">
                    Jl. Contoh No. 123, Jakarta<br>
                    Tel: (021) 1234-5678
                </div>
            </div>
            
            <div class="info">
                <div class="info-row">
                    <span>Transaction #</span>
                    <span><strong>${transactionId}</strong></span>
                </div>
                <div class="info-row">
                    <span>Date</span>
                    <span><strong>${date}</strong></span>
                </div>
                <div class="info-row">
                    <span>Time</span>
                    <span><strong>${time}</strong></span>
                </div>
                <div class="info-row">
                    <span>Cashier</span>
                    <span><strong>${cashierName}</strong></span>
                </div>
            </div>
            
            <table>
                <thead>
                    <tr>
                        <th>Item</th>
                        <th>Qty</th>
                        <th>Price</th>
                        <th>Total</th>
                    </tr>
                </thead>
                <tbody>
                    ${items.map(item => `
                        <tr>
                            <td>${item.product_name}</td>
                            <td>${item.quantity}</td>
                            <td>Rp ${item.price.toLocaleString('id-ID')}</td>
                            <td><strong>Rp ${(item.price * item.quantity).toLocaleString('id-ID')}</strong></td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
            
            <div class="total-row">
                <span>TOTAL</span>
                <span>Rp ${total.toLocaleString('id-ID')}</span>
            </div>
            
            <div class="footer">
                <div style="font-size: 11px; margin-bottom: 5px;"><strong>Thank you for shopping!</strong></div>
                <div style="margin: 5px 0;">Please come again</div>
                <div style="margin-top: 10px; color: #999; font-size: 9px;">Powered by SIPIM</div>
            </div>
            
            <script>
                window.onload = function() {
                    setTimeout(function() {
                        window.print();
                        window.onafterprint = function() {
                            window.close();
                        };
                    }, 250);
                };
            </script>
        </body>
        </html>
    `;
    
    // Open new window and print
    const printWindow = window.open('', '_blank', 'width=300,height=600');
    if (printWindow) {
        printWindow.document.write(printContent);
        printWindow.document.close();
    }
    
    setTimeout(() => setIsPrinting(false), 500);
};

    return (
        <>
            {/* Modal Overlay - Hidden on print */}
            <div className="receipt-modal fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-lg max-w-md w-full shadow-xl">
                    {/* Header - Hidden on print */}
                    <div className="receipt-header flex items-center justify-between px-6 py-4 border-b border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-900">Transaction Receipt</h3>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Receipt Preview - Hidden on print */}
                    <div className="receipt-preview p-6">
                        <div className="bg-white p-6 border border-gray-200 rounded-lg">
                            <ReceiptContent
                                transactionId={transactionId}
                                items={items}
                                total={total}
                                cashierName={cashierName}
                                date={date}
                                time={time}
                            />
                        </div>
                    </div>

                    {/* Actions - Hidden on print */}
                    <div className="receipt-actions flex gap-3 px-6 py-4 bg-gray-50 rounded-b-lg">
                        <button
                            onClick={onClose}
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 font-medium text-gray-700 transition-colors"
                        >
                            Close
                        </button>
                        <button
                            onClick={handlePrint}
                            disabled={isPrinting}
                            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            <Printer className="w-4 h-4" />
                            {isPrinting ? 'Printing...' : 'Print'}
                        </button>
                    </div>
                </div>
            </div>

            {/* Print Version - Only visible when printing */}
            <div className="receipt-print-only">
                <ReceiptContent
                    transactionId={transactionId}
                    items={items}
                    total={total}
                    cashierName={cashierName}
                    date={date}
                    time={time}
                />
            </div>
        </>
    );
}

// Separate component for receipt content
function ReceiptContent({
    transactionId,
    items,
    total,
    cashierName,
    date,
    time,
}: Omit<ReceiptProps, 'show' | 'onClose'>) {
    return (
        <div className="receipt-content text-center space-y-4" style={{ fontFamily: 'monospace' }}>
            {/* Store Header */}
            <div className="border-b-2 border-dashed border-gray-300 pb-4">
                <h1 className="text-2xl font-bold text-gray-900">SIPIM STORE</h1>
                <p className="text-sm text-gray-600 mt-1">Store Information & Management</p>
                <p className="text-xs text-gray-500 mt-1">Jl. Contoh No. 123, Jakarta</p>
                <p className="text-xs text-gray-500">Tel: (021) 1234-5678</p>
            </div>

            {/* Transaction Info */}
            <div className="text-left space-y-1 text-sm">
                <div className="flex justify-between">
                    <span className="text-gray-600">Transaction #</span>
                    <span className="font-semibold">{transactionId}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-600">Date</span>
                    <span className="font-semibold">{date}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-600">Time</span>
                    <span className="font-semibold">{time}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-600">Cashier</span>
                    <span className="font-semibold">{cashierName}</span>
                </div>
            </div>

            {/* Items */}
            <div className="border-t-2 border-b-2 border-dashed border-gray-300 py-4">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="text-left border-b border-gray-300">
                            <th className="pb-2">Item</th>
                            <th className="pb-2 text-center">Qty</th>
                            <th className="pb-2 text-right">Price</th>
                            <th className="pb-2 text-right">Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map((item, index) => (
                            <tr key={index} className="border-b border-gray-200">
                                <td className="py-2">{item.product_name}</td>
                                <td className="py-2 text-center">{item.quantity}</td>
                                <td className="py-2 text-right">
                                    {item.price.toLocaleString('id-ID')}
                                </td>
                                <td className="py-2 text-right font-semibold">
                                    {(item.price * item.quantity).toLocaleString('id-ID')}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Total */}
            <div className="text-left space-y-2">
                <div className="flex justify-between text-lg font-bold">
                    <span>TOTAL</span>
                    <span>Rp {total.toLocaleString('id-ID')}</span>
                </div>
            </div>

            {/* Footer */}
            <div className="border-t-2 border-dashed border-gray-300 pt-4 text-center">
                <p className="text-sm text-gray-600">Thank you for shopping!</p>
                <p className="text-xs text-gray-500 mt-2">Please come again</p>
                <p className="text-xs text-gray-400 mt-4">
                    Powered by SIPIM
                </p>
            </div>
        </div>
    );
}