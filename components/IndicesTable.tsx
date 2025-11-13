import React, { useState, useMemo } from 'react';
import useSWR from 'swr';
import { TrendingUp, TrendingDown, ArrowUpDown } from 'lucide-react';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

type SortField = 'index' | 'last' | 'percentChange' | 'pe' | 'pb' | 'dy' | 'perChange30d' | 'perChange365d';
type SortDirection = 'asc' | 'desc';

const IndicesTable: React.FC = () => {
  const { data, error } = useSWR('/api/nse/indices', fetcher, {
    refreshInterval: 5000,
  });

  const [sortField, setSortField] = useState<SortField>('percentChange');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [activeTab, setActiveTab] = useState<'broad' | 'sectoral'>('broad');

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const getColorForChange = (change: number) => {
    if (change > 1) return 'bg-green-500';
    if (change > 0.5) return 'bg-green-400';
    if (change > 0) return 'bg-green-300';
    if (change === 0) return 'bg-gray-300';
    if (change > -0.5) return 'bg-red-300';
    if (change > -1) return 'bg-red-400';
    return 'bg-red-500';
  };

  const getTextColorForChange = (change: number) => {
    return change >= 0 ? 'text-green-700' : 'text-red-700';
  };

  const filteredAndSortedData = useMemo(() => {
    if (!data?.data) return [];

    const filtered = data.data.filter((item: any) => {
      if (activeTab === 'broad') {
        return item.key === 'BROAD MARKET INDICES';
      } else {
        return item.key === 'SECTORAL INDICES';
      }
    });

    return filtered.sort((a: any, b: any) => {
      let aVal = a[sortField];
      let bVal = b[sortField];

      // Handle numeric fields
      if (sortField !== 'index') {
        aVal = parseFloat(aVal) || 0;
        bVal = parseFloat(bVal) || 0;
      }

      if (sortDirection === 'asc') {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });
  }, [data, activeTab, sortField, sortDirection]);

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-4 text-gray-800">📈 Market Indices</h2>
        <p className="text-red-500">Failed to fetch indices data</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-4 text-gray-800">📈 Market Indices</h2>
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  const SortIcon = ({ field }: { field: SortField }) => (
    <ArrowUpDown
      className={`w-4 h-4 inline ml-1 ${
        sortField === field ? 'text-blue-600' : 'text-gray-400'
      }`}
    />
  );

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">📈 Market Indices</h2>

        {/* Tab Switcher */}
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('broad')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'broad'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Broad Market ({data.data.filter((i: any) => i.key === 'BROAD MARKET INDICES').length})
          </button>
          <button
            onClick={() => setActiveTab('sectoral')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'sectoral'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Sectoral ({data.data.filter((i: any) => i.key === 'SECTORAL INDICES').length})
          </button>
        </div>
      </div>

      {/* Market Statistics */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <div className="text-sm text-green-700 font-medium">Advances</div>
          <div className="text-2xl font-bold text-green-800">{data.advances?.toLocaleString()}</div>
        </div>
        <div className="bg-red-50 p-4 rounded-lg border border-red-200">
          <div className="text-sm text-red-700 font-medium">Declines</div>
          <div className="text-2xl font-bold text-red-800">{data.declines?.toLocaleString()}</div>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <div className="text-sm text-gray-700 font-medium">Unchanged</div>
          <div className="text-2xl font-bold text-gray-800">{data.unchanged?.toLocaleString()}</div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 border-b-2 border-gray-300">
            <tr>
              <th
                className="text-left p-3 cursor-pointer hover:bg-gray-200"
                onClick={() => handleSort('index')}
              >
                Index Name <SortIcon field="index" />
              </th>
              <th
                className="text-right p-3 cursor-pointer hover:bg-gray-200"
                onClick={() => handleSort('last')}
              >
                Last <SortIcon field="last" />
              </th>
              <th
                className="text-right p-3 cursor-pointer hover:bg-gray-200"
                onClick={() => handleSort('percentChange')}
              >
                % Change <SortIcon field="percentChange" />
              </th>
              <th className="text-center p-3">Change</th>
              <th
                className="text-right p-3 cursor-pointer hover:bg-gray-200"
                onClick={() => handleSort('pe')}
              >
                P/E <SortIcon field="pe" />
              </th>
              <th
                className="text-right p-3 cursor-pointer hover:bg-gray-200"
                onClick={() => handleSort('pb')}
              >
                P/B <SortIcon field="pb" />
              </th>
              <th
                className="text-right p-3 cursor-pointer hover:bg-gray-200"
                onClick={() => handleSort('dy')}
              >
                Div Yield <SortIcon field="dy" />
              </th>
              <th
                className="text-right p-3 cursor-pointer hover:bg-gray-200"
                onClick={() => handleSort('perChange30d')}
              >
                1M % <SortIcon field="perChange30d" />
              </th>
              <th
                className="text-right p-3 cursor-pointer hover:bg-gray-200"
                onClick={() => handleSort('perChange365d')}
              >
                1Y % <SortIcon field="perChange365d" />
              </th>
              <th className="text-center p-3">Adv/Dec</th>
            </tr>
          </thead>
          <tbody>
            {filteredAndSortedData.map((index: any, idx: number) => {
              const percentChange = parseFloat(index.percentChange);
              const change = parseFloat(index.variation);
              const perChange30d = parseFloat(index.perChange30d) || 0;
              const perChange365d = parseFloat(index.perChange365d) || 0;

              return (
                <tr
                  key={idx}
                  className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  <td className="p-3 font-semibold text-gray-800">
                    {index.index}
                  </td>
                  <td className="p-3 text-right font-medium text-gray-900">
                    {parseFloat(index.last).toLocaleString('en-IN', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </td>
                  <td className="p-3 text-right">
                    <div
                      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-white font-bold ${getColorForChange(
                        percentChange
                      )}`}
                    >
                      {percentChange >= 0 ? (
                        <TrendingUp className="w-4 h-4" />
                      ) : (
                        <TrendingDown className="w-4 h-4" />
                      )}
                      {percentChange.toFixed(2)}%
                    </div>
                  </td>
                  <td className="p-3 text-center">
                    <span className={`font-medium ${getTextColorForChange(change)}`}>
                      {change >= 0 ? '+' : ''}
                      {change.toFixed(2)}
                    </span>
                  </td>
                  <td className="p-3 text-right text-gray-700">
                    {index.pe || '-'}
                  </td>
                  <td className="p-3 text-right text-gray-700">
                    {index.pb || '-'}
                  </td>
                  <td className="p-3 text-right text-gray-700">
                    {index.dy || '-'}
                  </td>
                  <td className="p-3 text-right">
                    <span
                      className={`font-medium ${getTextColorForChange(perChange30d)}`}
                    >
                      {perChange30d >= 0 ? '+' : ''}
                      {perChange30d.toFixed(2)}%
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <span
                      className={`font-medium ${getTextColorForChange(perChange365d)}`}
                    >
                      {perChange365d >= 0 ? '+' : ''}
                      {perChange365d.toFixed(2)}%
                    </span>
                  </td>
                  <td className="p-3 text-center">
                    {index.advances && index.declines ? (
                      <span className="text-xs">
                        <span className="text-green-600 font-medium">{index.advances}</span>
                        {' / '}
                        <span className="text-red-600 font-medium">{index.declines}</span>
                      </span>
                    ) : (
                      '-'
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Legend */}
      <div className="mt-4 flex items-center gap-4 text-xs text-gray-600">
        <div className="flex items-center gap-2">
          <span className="font-semibold">Performance Heatmap:</span>
          <div className="flex gap-1">
            <div className="w-8 h-4 bg-green-500 rounded"></div>
            <div className="w-8 h-4 bg-green-400 rounded"></div>
            <div className="w-8 h-4 bg-green-300 rounded"></div>
            <div className="w-8 h-4 bg-gray-300 rounded"></div>
            <div className="w-8 h-4 bg-red-300 rounded"></div>
            <div className="w-8 h-4 bg-red-400 rounded"></div>
            <div className="w-8 h-4 bg-red-500 rounded"></div>
          </div>
          <span>&gt;1% to &lt;-1%</span>
        </div>
      </div>

      <div className="mt-2 text-xs text-gray-500">
        Updated: {data.timestamp} | Click column headers to sort
      </div>
    </div>
  );
};

export default IndicesTable;
