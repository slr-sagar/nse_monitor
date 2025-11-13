import React from 'react';
import { Card } from './Card';
import { SkeletonCard } from './LoadingSpinner';
import { ErrorMessage } from './ErrorMessage';
import { useNSEData } from '@/hooks/useNSEData';
import { Activity } from 'lucide-react';

export const OISpurts: React.FC = () => {
  const { data, error, isLoading, refetch } = useNSEData('oi-spurts');

  if (isLoading) return <SkeletonCard />;
  if (error) return <ErrorMessage message={error.message} onRetry={refetch} />;

  const spurts = data?.data?.slice(0, 10) || [];

  return (
    <Card title="OI Spurts - Most Active Underlyings" subtitle="Options with highest open interest changes">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {spurts.map((item: any, idx: number) => {
          const oiChange = parseFloat(item.oiChangePercent || item.changeInOI || 0);
          const isPositive = oiChange >= 0;

          return (
            <div
              key={idx}
              className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center">
                    <Activity className="w-4 h-4 text-blue-600 dark:text-blue-400 mr-2" />
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                      {item.symbol || item.symbolName}
                    </h3>
                  </div>
                  <div className="mt-2 space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">LTP:</span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        ₹{parseFloat(item.ltp || item.lastPrice || 0).toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">OI Change:</span>
                      <span className={`font-medium ${isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                        {isPositive ? '+' : ''}{oiChange.toFixed(2)}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};
