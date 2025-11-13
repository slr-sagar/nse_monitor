import React from 'react';
import { Card } from './Card';
import { LoadingSpinner, SkeletonCard } from './LoadingSpinner';
import { ErrorMessage } from './ErrorMessage';
import { useNSEData } from '@/hooks/useNSEData';
import { TrendingUp, TrendingDown } from 'lucide-react';

export const IndicesOverview: React.FC = () => {
  const { data, error, isLoading, refetch } = useNSEData('indices');

  if (isLoading) return <SkeletonCard />;
  if (error) return <ErrorMessage message={error.message} onRetry={refetch} />;

  const indices = data?.data || [];
  const majorIndices = indices.filter((idx: any) =>
    ['NIFTY 50', 'NIFTY BANK', 'NIFTY IT', 'NIFTY PHARMA', 'NIFTY AUTO'].includes(idx.index)
  );

  return (
    <Card title="Major Indices" subtitle="Real-time index performance">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {majorIndices.map((index: any, idx: number) => {
          const isPositive = parseFloat(index.percentChange) >= 0;
          return (
            <div
              key={idx}
              className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-600"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    {index.index}
                  </h3>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                    {parseFloat(index.last).toFixed(2)}
                  </p>
                </div>
                {isPositive ? (
                  <TrendingUp className="w-5 h-5 text-green-500" />
                ) : (
                  <TrendingDown className="w-5 h-5 text-red-500" />
                )}
              </div>
              <div className="flex items-center mt-2">
                <span className={`text-sm font-medium ${isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                  {isPositive ? '+' : ''}{parseFloat(index.percentChange).toFixed(2)}%
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                  ({isPositive ? '+' : ''}{parseFloat(index.change).toFixed(2)})
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};
