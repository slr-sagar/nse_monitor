import React from 'react';
import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const MarketStatus: React.FC = () => {
  const { data, error } = useSWR('/api/nse/market-status', fetcher, {
    refreshInterval: 5000,
  });

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-4 text-gray-800">Market Status</h2>
        <p className="text-red-500">Failed to fetch market status</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-4 text-gray-800">Market Status</h2>
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  const marketState = data.marketState || [];
  const indicativeNifty = data.indicativenifty50 || {};
  const giftNifty = data.giftnifty || {};

  const getStatusColor = (status: string) => {
    return status?.toLowerCase() === 'open'
      ? 'text-green-600 bg-green-100'
      : 'text-red-600 bg-red-100';
  };

  const getStatusEmoji = (status: string) => {
    return status?.toLowerCase() === 'open' ? '🟢' : '🔴';
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-bold mb-4 text-gray-800">📊 Market Status</h2>

      {/* Indicative NIFTY 50 */}
      {indicativeNifty.indexName && (
        <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-semibold text-lg text-gray-800">{indicativeNifty.indexName}</h3>
              <p className="text-sm text-gray-600">{indicativeNifty.dateTime}</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-gray-800">
                {indicativeNifty.finalClosingValue?.toLocaleString('en-IN')}
              </div>
              <div className={`text-sm font-semibold ${
                parseFloat(indicativeNifty.perChange) >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {parseFloat(indicativeNifty.change) >= 0 ? '▲' : '▼'} {indicativeNifty.change} ({indicativeNifty.perChange}%)
              </div>
              <div className={`inline-block px-3 py-1 rounded-full text-sm font-semibold mt-1 ${
                indicativeNifty.status === 'CLOSE' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
              }`}>
                {indicativeNifty.status === 'CLOSE' ? '🔴 CLOSED' : '🟢 OPEN'}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* GIFT Nifty */}
      {giftNifty.SYMBOL && (
        <div className="mb-6 p-4 bg-purple-50 rounded-lg border border-purple-200">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-semibold text-lg text-gray-800">🎁 GIFT {giftNifty.SYMBOL}</h3>
              <p className="text-sm text-gray-600">{giftNifty.TIMESTMP}</p>
              <p className="text-xs text-gray-500">Expiry: {giftNifty.EXPIRYDATE}</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-gray-800">
                {parseFloat(giftNifty.LASTPRICE)?.toLocaleString('en-IN')}
              </div>
              <div className={`text-sm font-semibold ${
                parseFloat(giftNifty.DAYCHANGE) >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {parseFloat(giftNifty.DAYCHANGE) >= 0 ? '▲' : '▼'} {giftNifty.DAYCHANGE} ({parseFloat(giftNifty.PERCHANGE).toFixed(2)}%)
              </div>
              <div className="text-xs text-gray-600 mt-1">
                Contracts: {parseInt(giftNifty.CONTRACTSTRADED)?.toLocaleString('en-IN')}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Market States Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {marketState.map((market: any, index: number) => (
          <div
            key={index}
            className={`p-4 rounded-lg border-2 transition-all ${
              market.marketStatus?.toLowerCase() === 'open'
                ? 'border-green-300 bg-green-50'
                : 'border-red-300 bg-red-50'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                {getStatusEmoji(market.marketStatus)}
                {market.market}
              </h3>
              <span
                className={`px-2 py-1 rounded-full text-xs font-bold ${getStatusColor(
                  market.marketStatus
                )}`}
              >
                {market.marketStatus}
              </span>
            </div>

            <p className="text-xs text-gray-600 mb-2">{market.marketStatusMessage}</p>
            <p className="text-xs text-gray-500">📅 {market.tradeDate}</p>

            {market.index && (
              <div className="mt-3 pt-3 border-t border-gray-300">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">{market.index}</span>
                  <div className="text-right">
                    <div className="text-sm font-bold text-gray-800">
                      {parseFloat(market.last)?.toLocaleString('en-IN')}
                    </div>
                    <div className={`text-xs ${
                      parseFloat(market.percentChange) >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {parseFloat(market.variation) >= 0 ? '▲' : '▼'} {market.variation} ({market.percentChange}%)
                    </div>
                  </div>
                </div>
              </div>
            )}

            {market.underlying && market.underlying !== market.index && (
              <div className="mt-2">
                <span className="text-xs text-gray-600">Underlying: {market.underlying}</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Market Cap */}
      {data.marketcap && (
        <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
          <h3 className="font-semibold text-gray-800 mb-2">💰 Market Capitalization</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-gray-600">Total (Rupees)</p>
              <p className="text-lg font-bold text-gray-800">
                ₹{data.marketcap.marketCapinLACCRRupeesFormatted} Lac Cr
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-600">Total (USD)</p>
              <p className="text-lg font-bold text-gray-800">
                ${data.marketcap.marketCapinTRDollars} Trillion
              </p>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">As on {data.marketcap.timeStamp}</p>
        </div>
      )}
    </div>
  );
};

export default MarketStatus;
