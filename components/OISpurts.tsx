import React, { useState } from 'react';
import { Card } from './Card';
import { SkeletonCard } from './LoadingSpinner';
import { ErrorMessage } from './ErrorMessage';
import { useNSEData } from '@/hooks/useNSEData';
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';

type SortField = 'symbol' | 'futVol' | 'optVol' | 'totVol' | 'futVal' | 'optVal' | 'totVal' | 'openInt' | 'underlying';
type SortDirection = 'asc' | 'desc';

export const OISpurts: React.FC = () => {
  const { data, error, isLoading, refetch } = useNSEData('oi-spurts');
  const [sortField, setSortField] = useState<SortField>('totVol');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  if (isLoading) return <SkeletonCard />;
  if (error) return <ErrorMessage message={error.message} onRetry={refetch} />;

  const spurtsData = data?.data || [];

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const sortedData = [...spurtsData].sort((a: any, b: any) => {
    let aValue = 0;
    let bValue = 0;

    switch (sortField) {
      case 'symbol':
        return sortDirection === 'asc'
          ? (a.symbol || '').localeCompare(b.symbol || '')
          : (b.symbol || '').localeCompare(a.symbol || '');
      case 'futVol':
        aValue = parseFloat(a.futVol || 0);
        bValue = parseFloat(b.futVol || 0);
        break;
      case 'optVol':
        aValue = parseFloat(a.optVol || 0);
        bValue = parseFloat(b.optVol || 0);
        break;
      case 'totVol':
        aValue = parseFloat(a.totVol || 0);
        bValue = parseFloat(b.totVol || 0);
        break;
      case 'futVal':
        aValue = parseFloat(a.futVal || 0);
        bValue = parseFloat(b.futVal || 0);
        break;
      case 'optVal':
        aValue = parseFloat(a.optVal || 0);
        bValue = parseFloat(b.optVal || 0);
        break;
      case 'totVal':
        aValue = parseFloat(a.totVal || 0);
        bValue = parseFloat(b.totVal || 0);
        break;
      case 'openInt':
        aValue = parseFloat(a.openInt || 0);
        bValue = parseFloat(b.openInt || 0);
        break;
      case 'underlying':
        aValue = parseFloat(a.underlying || 0);
        bValue = parseFloat(b.underlying || 0);
        break;
    }

    return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
  });

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <ArrowUpDown className="w-3 h-3 ml-1 opacity-30" />;
    return sortDirection === 'asc'
      ? <ArrowUp className="w-3 h-3 ml-1 text-blue-600 dark:text-blue-400" />
      : <ArrowDown className="w-3 h-3 ml-1 text-blue-600 dark:text-blue-400" />;
  };

  const formatNumber = (num: any, decimals: number = 0) => {
    const n = parseFloat(num || 0);
    return n.toLocaleString('en-IN', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
  };

  return (
    <Card title="OI Spurts - Most Active Underlyings" subtitle="Options with highest open interest changes">
      <div className="overflow-x-auto">
        <div className="max-h-[600px] overflow-y-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800 sticky top-0 z-10">
              <tr>
                <th
                  className="px-3 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                  onClick={() => handleSort('symbol')}
                >
                  <div className="flex items-center">
                    Symbol
                    <SortIcon field="symbol" />
                  </div>
                </th>
                <th colSpan={3} className="px-3 py-2 text-center text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider border-b border-gray-300 dark:border-gray-600">
                  Volume (Contracts)
                </th>
                <th colSpan={3} className="px-3 py-2 text-center text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider border-b border-gray-300 dark:border-gray-600">
                  Value (₹ Lakhs)
                </th>
                <th
                  rowSpan={2}
                  className="px-3 py-3 text-right text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                  onClick={() => handleSort('openInt')}
                >
                  <div className="flex items-center justify-end">
                    Open Interest
                    <SortIcon field="openInt" />
                  </div>
                </th>
                <th
                  rowSpan={2}
                  className="px-3 py-3 text-right text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                  onClick={() => handleSort('underlying')}
                >
                  <div className="flex items-center justify-end">
                    Underlying
                    <SortIcon field="underlying" />
                  </div>
                </th>
              </tr>
              <tr>
                <th className="px-3 py-1"></th>
                <th
                  className="px-3 py-2 text-right text-xs font-medium text-gray-600 dark:text-gray-400 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                  onClick={() => handleSort('futVol')}
                >
                  <div className="flex items-center justify-end">
                    Futures
                    <SortIcon field="futVol" />
                  </div>
                </th>
                <th
                  className="px-3 py-2 text-right text-xs font-medium text-gray-600 dark:text-gray-400 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                  onClick={() => handleSort('optVol')}
                >
                  <div className="flex items-center justify-end">
                    Options
                    <SortIcon field="optVol" />
                  </div>
                </th>
                <th
                  className="px-3 py-2 text-right text-xs font-medium text-gray-600 dark:text-gray-400 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                  onClick={() => handleSort('totVol')}
                >
                  <div className="flex items-center justify-end">
                    Total
                    <SortIcon field="totVol" />
                  </div>
                </th>
                <th
                  className="px-3 py-2 text-right text-xs font-medium text-gray-600 dark:text-gray-400 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                  onClick={() => handleSort('futVal')}
                >
                  <div className="flex items-center justify-end">
                    Futures
                    <SortIcon field="futVal" />
                  </div>
                </th>
                <th
                  className="px-3 py-2 text-right text-xs font-medium text-gray-600 dark:text-gray-400 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                  onClick={() => handleSort('optVal')}
                >
                  <div className="flex items-center justify-end">
                    Options (Premium)
                    <SortIcon field="optVal" />
                  </div>
                </th>
                <th
                  className="px-3 py-2 text-right text-xs font-medium text-gray-600 dark:text-gray-400 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                  onClick={() => handleSort('totVal')}
                >
                  <div className="flex items-center justify-end">
                    Total
                    <SortIcon field="totVal" />
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
              {sortedData.map((item: any, idx: number) => (
                <tr
                  key={idx}
                  className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <td className="px-3 py-3 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    {item.symbol}
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap text-sm text-right text-gray-700 dark:text-gray-300">
                    {formatNumber(item.futVol)}
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap text-sm text-right text-gray-700 dark:text-gray-300">
                    {formatNumber(item.optVol)}
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap text-sm text-right font-medium text-gray-900 dark:text-white">
                    {formatNumber(item.totVol)}
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap text-sm text-right text-gray-700 dark:text-gray-300">
                    {formatNumber(item.futVal, 2)}
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap text-sm text-right text-gray-700 dark:text-gray-300">
                    {formatNumber(item.optVal, 2)}
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap text-sm text-right font-medium text-gray-900 dark:text-white">
                    {formatNumber(item.totVal, 2)}
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap text-sm text-right text-gray-700 dark:text-gray-300">
                    {formatNumber(item.openInt, 2)}
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap text-sm text-right font-medium text-gray-900 dark:text-white">
                    {formatNumber(item.underlying, 2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {sortedData.length === 0 && (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            No data available
          </div>
        )}
      </div>
    </Card>
  );
};
