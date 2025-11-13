import React from 'react';
import { Card } from './Card';
import { SkeletonCard } from './LoadingSpinner';
import { ErrorMessage } from './ErrorMessage';
import { useNSEData } from '@/hooks/useNSEData';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart } from 'recharts';

export const NiftyChart: React.FC = () => {
  const { data, error, isLoading, refetch } = useNSEData('nifty-chart');

  if (isLoading) return <SkeletonCard />;
  if (error) return <ErrorMessage message={error.message} onRetry={refetch} />;

  // Parse chart data from different possible formats
  let chartData: any[] = [];

  if (data?.grapthData) {
    chartData = data.grapthData.map((point: any) => ({
      time: new Date(point[0]).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      value: parseFloat(point[1]),
    }));
  } else if (data?.data) {
    chartData = data.data.map((point: any) => ({
      time: new Date(point.timestamp || point.time).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      value: parseFloat(point.value || point.close),
    }));
  } else if (Array.isArray(data)) {
    chartData = data.map((point: any) => ({
      time: new Date(point[0] || point.timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      value: parseFloat(point[1] || point.value),
    }));
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
