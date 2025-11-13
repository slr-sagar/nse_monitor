import React, { useState } from 'react';
import useSWR from 'swr';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const IndicesPerformanceChart: React.FC = () => {
  const { data, error } = useSWR('/api/nse/indices', fetcher, {
    refreshInterval: 5000,
  });

  const [timeframe, setTimeframe] = useState<'1D' | '1M' | '1Y'>('1D');
  const [category, setCategory] = useState<'broad' | 'sectoral'>('broad');

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-4 text-gray-800">📊 Indices Performance</h2>
        <p className="text-red-500">Failed to fetch data</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-4 text-gray-800">📊 Indices Performance</h2>
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  const filteredData = data.data
    .filter((item: any) => {
      if (category === 'broad') {
        return item.key === 'BROAD MARKET INDICES';
      } else {
        return item.key === 'SECTORAL INDICES';
      }
    })
    .map((item: any) => {
      let performance = 0;
      if (timeframe === '1D') {
        performance = parseFloat(item.percentChange) || 0;
      } else if (timeframe === '1M') {
        performance = parseFloat(item.perChange30d) || 0;
      } else if (timeframe === '1Y') {
        performance = parseFloat(item.perChange365d) || 0;
      }

      return {
        name: item.index.replace('NIFTY ', ''),
        performance: performance,
        fullName: item.index,
      };
    })
    .sort((a: any, b: any) => b.performance - a.performance)
    .slice(0, 15); // Top 15 performers

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-gray-300 rounded shadow-lg">
          <p className="font-semibold text-gray-800">{data.fullName}</p>
          <p className={`text-lg font-bold ${data.performance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {data.performance >= 0 ? '+' : ''}{data.performance.toFixed(2)}%
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">📊 Indices Performance Comparison</h2>

        <div className="flex gap-4">
          {/* Category Selector */}
          <div className="flex gap-2">
            <button
              onClick={() => setCategory('broad')}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                category === 'broad'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Broad Market
            </button>
            <button
              onClick={() => setCategory('sectoral')}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                category === 'sectoral'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Sectoral
            </button>
          </div>

          {/* Timeframe Selector */}
          <div className="flex gap-2">
            <button
              onClick={() => setTimeframe('1D')}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                timeframe === '1D'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              1 Day
            </button>
            <button
              onClick={() => setTimeframe('1M')}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                timeframe === '1M'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              1 Month
            </button>
            <button
              onClick={() => setTimeframe('1Y')}
              className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                timeframe === '1Y'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              1 Year
            </button>
          </div>
        </div>
      </div>

      <div className="h-96">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={filteredData}
            margin={{ top: 20, right: 30, left: 20, bottom: 80 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
            <XAxis
              dataKey="name"
              angle={-45}
              textAnchor="end"
              height={100}
              interval={0}
              tick={{ fontSize: 11 }}
            />
            <YAxis
              label={{ value: 'Performance (%)', angle: -90, position: 'insideLeft' }}
              tick={{ fontSize: 12 }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="performance" radius={[8, 8, 0, 0]}>
              {filteredData.map((entry: any, index: number) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.performance >= 0 ? '#10b981' : '#ef4444'}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 text-xs text-gray-500">
        Showing top 15 performers for {category === 'broad' ? 'Broad Market' : 'Sectoral'} indices over {timeframe === '1D' ? '1 Day' : timeframe === '1M' ? '1 Month' : '1 Year'}
      </div>
    </div>
  );
};

export default IndicesPerformanceChart;
