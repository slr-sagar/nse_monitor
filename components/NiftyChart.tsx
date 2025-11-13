import React from 'react';
import { Card } from './Card';
import { SkeletonCard } from './LoadingSpinner';
import { ErrorMessage } from './ErrorMessage';
import { useNSEData } from '@/hooks/useNSEData';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export const NiftyChart: React.FC = () => {
  const { data, error, isLoading, refetch } = useNSEData('nifty-chart');

  if (isLoading) return <SkeletonCard />;
  if (error) return <ErrorMessage message={error.message} onRetry={refetch} />;

  // NIFTY Chart structure: { data: { grapthData: [...], identifier, name, closePrice } }
  const chartDataRaw = data?.data?.grapthData || data?.grapthData || [];

  // Handle empty or invalid data gracefully
  if (!Array.isArray(chartDataRaw) || chartDataRaw.length === 0) {
    return (
      <Card title="NIFTY 50 - Intraday Chart" subtitle="Live market movement">
        <div className="flex items-center justify-center h-80 text-gray-500">
          <div className="text-center">
            <p className="text-lg mb-2">📊 Chart data will appear when market opens</p>
            <p className="text-sm">Intraday data is available during trading hours</p>
          </div>
        </div>
      </Card>
    );
  }

  const chartData = chartDataRaw
    .filter((point: any) => point && point[0] && point[1]) // Filter out invalid points
    .map((point: any) => ({
      time: new Date(point[0]).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      value: parseFloat(point[1]),
    }));

  if (chartData.length === 0) {
    return (
      <Card title="NIFTY 50 - Intraday Chart" subtitle="Live market movement">
        <div className="flex items-center justify-center h-80 text-gray-500">
          <div className="text-center">
            <p className="text-lg mb-2">📊 Chart data will appear when market opens</p>
            <p className="text-sm">Intraday data is available during trading hours</p>
          </div>
        </div>
      </Card>
    );
  }

  const isPositive = chartData.length > 1 && chartData[chartData.length - 1].value >= chartData[0].value;

  return (
    <Card title="NIFTY 50 - Intraday Chart" subtitle="Live market movement">
      <ResponsiveContainer width="100%" height={350}>
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={isPositive ? "#10b981" : "#ef4444"} stopOpacity={0.3}/>
              <stop offset="95%" stopColor={isPositive ? "#10b981" : "#ef4444"} stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis
            dataKey="time"
            tick={{ fontSize: 12, fill: '#9ca3af' }}
            interval="preserveStartEnd"
          />
          <YAxis
            tick={{ fontSize: 12, fill: '#9ca3af' }}
            domain={['dataMin - 50', 'dataMax + 50']}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1f2937',
              border: '1px solid #374151',
              borderRadius: '8px',
              color: '#fff'
            }}
          />
          <Area
            type="monotone"
            dataKey="value"
            stroke={isPositive ? "#10b981" : "#ef4444"}
            strokeWidth={2}
            fill="url(#colorValue)"
            name="NIFTY 50"
          />
        </AreaChart>
      </ResponsiveContainer>
    </Card>
  );
};
