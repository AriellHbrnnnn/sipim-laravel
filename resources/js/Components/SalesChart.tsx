import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface SalesChartProps {
    data: Array<{ date: string; revenue: number }>;
}

export default function SalesChart({ data }: SalesChartProps) {
    return (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Sales Trend (Last 7 Days)</h3>
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis 
                        dataKey="date" 
                        tick={{ fontSize: 12 }}
                        stroke="#9ca3af"
                    />
                    <YAxis 
                        tick={{ fontSize: 12 }}
                        stroke="#9ca3af"
                        tickFormatter={(value) => `Rp ${(value / 1000).toFixed(0)}K`}
                    />
                    <Tooltip 
                        formatter={(value: number) => [`Rp ${value.toLocaleString('id-ID')}`, 'Revenue']}
                        contentStyle={{ 
                            backgroundColor: '#fff', 
                            border: '1px solid #e5e7eb',
                            borderRadius: '8px'
                        }}
                    />
                    <Line 
                        type="monotone" 
                        dataKey="revenue" 
                        stroke="#3b82f6" 
                        strokeWidth={2}
                        dot={{ fill: '#3b82f6', r: 4 }}
                        activeDot={{ r: 6 }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}