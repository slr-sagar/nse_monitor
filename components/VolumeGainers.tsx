import React from 'react';
import { Card } from './Card';
import { SkeletonCard } from './LoadingSpinner';
import { ErrorMessage } from './ErrorMessage';
import { useNSEData } from '@/hooks/useNSEData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export const VolumeGainers: React.FC = () => {
  const { data, error, isLoading, refetch } = useNSEData('volume-gainers');

  if (isLoading) return <SkeletonCard />;
  if (error) return <ErrorMessage message={error.message} onRetry={refetch} />;

  const gainers = data?.data || [];

  // Show top 10 in chart, but all in table
  const chartData = gainers.slice(0, 10).map((item: any) => ({
    name: item.symbol || item.symbolName || 'N/A',
    volume: parseInt(item.volume || item.tradedQuantity || 0),
    value: parseFloat(item.value || item.totalTradedValue || 0),
  }));

  return (
    <Card title="Top Volume Gainers" subtitle="Stocks with highest trading volume">
      <div className="overflow-x-auto">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="name"
              angle={-45}
              textAnchor="end"
              height={100}
              tick={{ fontSize: 12 }}
            />
            <YAxis
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`}
            />
            <Tooltip
              formatter={(value: any) => [
                typeof value === 'number' ? value.toLocaleString() : value,
                'Volume'
              ]}
            />
            <Legend />
            <Bar dataKey="volume" fill="#3b82f6" name="Volume" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-6 overflow-x-auto">
        <div className="max-h-[400px] overflow-y-auto">
          <table className="w-full text-sm">
          <thead className="bg-gray-50 dark:bg-gray-800 sticky top-0 z-10">
            <tr className="border-b border-gray-200 dark:border-gray-700">
              <th className="text-left py-2 px-4 font-semibold text-gray-700 dark:text-gray-300">Symbol</th>
              <th className="text-right py-2 px-4 font-semibold text-gray-700 dark:text-gray-300">Volume</th>
              <th className="text-right py-2 px-4 font-semibold text-gray-700 dark:text-gray-300">Value (Cr)</th>
            </tr>
          </thead>
          <tbody>
            {gainers.map((item: any, idx: number) => (
              <tr key={idx} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700">
                <td className="py-2 px-4 font-medium text-gray-900 dark:text-white">
                  {item.symbol || item.symbolName}
                </td>
                <td className="py-2 px-4 text-right text-gray-700 dark:text-gray-300">
                  {(parseInt(item.volume || item.tradedQuantity || 0)).toLocaleString()}
                </td>
                <td className="py-2 px-4 text-right text-gray-700 dark:text-gray-300">
                  ₹{(parseFloat(item.value || item.totalTradedValue || 0) / 10000000).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>
    </Card>
  );
};
