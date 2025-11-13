import React from 'react';
import { Card } from './Card';
import { SkeletonCard } from './LoadingSpinner';
import { ErrorMessage } from './ErrorMessage';
import { useNSEData } from '@/hooks/useNSEData';
import { TrendingUp, TrendingDown } from 'lucide-react';

export const MostActiveSecurities: React.FC = () => {
  const { data, error, isLoading, refetch } = useNSEData('most-active');

  if (isLoading) return <SkeletonCard />;
  if (error) return <ErrorMessage message={error.message} onRetry={refetch} />;

  const securities = data?.data?.slice(0, 15) || [];

  return (
    <Card title="Most Active Securities" subtitle="Highest trading activity">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700">
              <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">Symbol</th>
              <th className="text-right py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">LTP</th>
              <th className="text-right py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">Change %</th>
              <th className="text-right py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">Volume</th>
              <th className="text-right py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">Value (Cr)</th>
            </tr>
          </thead>
          <tbody>
            {securities.map((security: any, idx: number) => {
              const change = parseFloat(security.pChange || security.percentChange || 0);
              const isPositive = change >= 0;

              return (
                <tr key={idx} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="py-3 px-4">
                    <div className="flex items-center">
                      <span className="font-medium text-gray-900 dark:text-white">
                        {security.symbol || security.meta?.symbol}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-right font-medium text-gray-900 dark:text-white">
                    ₹{parseFloat(security.ltp || security.lastPrice || 0).toFixed(2)}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end">
                      {isPositive ? (
                        <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                      ) : (
                        <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
                      )}
                      <span className={`font-medium ${isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                        {isPositive ? '+' : ''}{change.toFixed(2)}%
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-right text-gray-700 dark:text-gray-300">
                    {(parseInt(security.volume || security.tradedQuantity || 0) / 1000).toFixed(0)}K
                  </td>
                  <td className="py-3 px-4 text-right text-gray-700 dark:text-gray-300">
                    ₹{(parseFloat(security.value || security.totalTradedValue || 0) / 10000000).toFixed(2)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Card>
  );
};
