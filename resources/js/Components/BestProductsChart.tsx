import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface BestProductsChartProps {
    data: Array<{ name: string; sold: number; revenue: number }>;
}

export default function BestProductsChart({ data }: BestProductsChartProps) {
    return (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Best Selling Products</h3>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis 
                        dataKey="name" 
                        tick={{ fontSize: 12 }}
                        stroke="#9ca3af"
                        angle={-45}
                        textAnchor="end"
                        height={80}
                    />
                    <YAxis 
                        tick={{ fontSize: 12 }}
                        stroke="#9ca3af"
                    />
                    <Tooltip 
                        formatter={(value: number, name: string) => {
                            if (name === 'sold') return [value, 'Sold'];
                            return [`Rp ${value.toLocaleString('id-ID')}`, 'Revenue'];
                        }}
                        contentStyle={{ 
                            backgroundColor: '#fff', 
                            border: '1px solid #e5e7eb',
                            borderRadius: '8px'
                        }}
                    />
                    <Bar dataKey="sold" fill="#10b981" radius={[8, 8, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}