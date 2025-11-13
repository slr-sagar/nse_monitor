import React from 'react';
import { Card } from './Card';
import { SkeletonCard } from './LoadingSpinner';
import { ErrorMessage } from './ErrorMessage';
import { useNSEData } from '@/hooks/useNSEData';
import clsx from 'clsx';

export const StocksHeatmap: React.FC = () => {
  const { data, error, isLoading, refetch } = useNSEData('heatmap');

  if (isLoading) return <SkeletonCard />;
  if (error) return <ErrorMessage message={error.message} onRetry={refetch} />;

  // Parse heatmap data - handle the actual API response format
  let stocks: any[] = [];

  if (data?.data && Array.isArray(data.data)) {
    // Standard format: { data: [...] }
    stocks = data.data;
  } else if (Array.isArray(data)) {
    // Direct array format
    stocks = data;
  } else {
    console.log('Unexpected heatmap data format:', data);
    return <ErrorMessage message="Invalid data format received" onRetry={refetch} />;
  }

  // Filter to get only stocks with proper data
  const validStocks = stocks
    .filter((stock: any) =>
      stock &&
      (stock.symbol || stock.symbolName) &&
      stock.lastPrice !== undefined &&
      stock.pChange !== undefined
    )
    .slice(0, 50);

  // Sort by absolute percentage change (highest volatility first)
  const sortedStocks = validStocks.sort((a: any, b: any) => {
    const aChange = Math.abs(parseFloat(a.pChange || a.percentChange || 0));
    const bChange = Math.abs(parseFloat(b.pChange || b.percentChange || 0));
    return bChange - aChange;
  });

  if (sortedStocks.length === 0) {
    return <ErrorMessage message="No stock data available" onRetry={refetch} />;
  }

  const getColorIntensity = (change: number): string => {
    const absChange = Math.abs(change);

    if (change > 0) {
      // Green shades for positive
      if (absChange > 3) return 'bg-green-600 text-white';
      if (absChange > 2) return 'bg-green-500 text-white';
      if (absChange > 1) return 'bg-green-400 text-white';
      if (absChange > 0.5) return 'bg-green-300 text-gray-900';
      return 'bg-green-200 text-gray-900';
    } else if (change < 0) {
      // Red shades for negative
      if (absChange > 3) return 'bg-red-600 text-white';
      if (absChange > 2) return 'bg-red-500 text-white';
      if (absChange > 1) return 'bg-red-400 text-white';
      if (absChange > 0.5) return 'bg-red-300 text-gray-900';
      return 'bg-red-200 text-gray-900';
    }

    return 'bg-gray-300 text-gray-900';
  };

  const getFontSize = (change: number): string => {
    const absChange = Math.abs(change);
    if (absChange > 2) return 'text-sm font-bold';
    return 'text-xs font-semibold';
  };

  return (
    <Card title="NIFTY 50 Stocks Heatmap" subtitle="Color intensity shows price movement strength">
      {/* Legend */}
      <div className="mb-4 flex items-center justify-center gap-4 text-xs flex-wrap">
        <div className="flex items-center">
          <div className="w-4 h-4 bg-red-600 rounded mr-1"></div>
          <span className="text-gray-600 dark:text-gray-400">Strong Decline (&gt;3%)</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-red-300 rounded mr-1"></div>
          <span className="text-gray-600 dark:text-gray-400">Weak Decline</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-gray-300 rounded mr-1"></div>
          <span className="text-gray-600 dark:text-gray-400">Neutral</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-green-300 rounded mr-1"></div>
          <span className="text-gray-600 dark:text-gray-400">Weak Gain</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-green-600 rounded mr-1"></div>
          <span className="text-gray-600 dark:text-gray-400">Strong Gain (&gt;3%)</span>
        </div>
      </div>

      {/* Heatmap Grid */}
      <div className="grid grid-cols-5 md:grid-cols-7 lg:grid-cols-10 gap-2">
        {sortedStocks.map((stock: any, idx: number) => {
          const change = parseFloat(stock.pChange || stock.percentChange || 0);
          const symbol = (stock.symbol || stock.symbolName || 'N/A').substring(0, 10);
          const price = parseFloat(stock.lastPrice || stock.last || 0);

          return (
            <div
              key={idx}
              className={clsx(
                'relative group cursor-pointer rounded-lg p-3 transition-all duration-200 hover:scale-110 hover:shadow-lg hover:z-10',
                getColorIntensity(change)
              )}
              title={`${symbol}: ${change > 0 ? '+' : ''}${change.toFixed(2)}%`}
            >
              <div className={clsx('text-center', getFontSize(change))}>
                <div className="truncate">{symbol}</div>
                <div className="mt-1">
                  {change > 0 ? '+' : ''}{change.toFixed(1)}%
                </div>
              </div>

              {/* Tooltip on hover */}
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block z-50">
                <div className="bg-gray-900 text-white text-xs rounded-lg py-2 px-3 shadow-lg whitespace-nowrap">
                  <div className="font-bold">{symbol}</div>
                  <div className="mt-1">
                    LTP: ₹{price.toFixed(2)}
                  </div>
                  <div>
                    Change: {change > 0 ? '+' : ''}{change.toFixed(2)}%
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary Stats */}
      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">
            {sortedStocks.filter((s: any) => parseFloat(s.pChange || s.percentChange || 0) > 0).length}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Gainers</div>
        </div>
        <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-red-600 dark:text-red-400">
            {sortedStocks.filter((s: any) => parseFloat(s.pChange || s.percentChange || 0) < 0).length}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Decliners</div>
        </div>
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {sortedStocks.filter((s: any) => parseFloat(s.pChange || s.percentChange || 0) === 0).length}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Unchanged</div>
        </div>
        <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
            {sortedStocks.length}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">Total Stocks</div>
        </div>
      </div>
    </Card>
  );
};
