import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { IndicesOverview } from '@/components/IndicesOverview';
import { NiftyChart } from '@/components/NiftyChart';
import { StocksHeatmap } from '@/components/StocksHeatmap';
import { VolumeGainers } from '@/components/VolumeGainers';
import { MostActiveSecurities } from '@/components/MostActiveSecurities';
import { OISpurts } from '@/components/OISpurts';
import { CorporateAnnouncements } from '@/components/CorporateAnnouncements';
import { RefreshCw, Clock, LogOut, User } from 'lucide-react';

export default function Dashboard() {
  const router = useRouter();
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [userEmail, setUserEmail] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);

  // Check authentication on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/check');
        const data = await response.json();

        if (!data.isLoggedIn) {
          router.push('/login');
        } else {
          setUserEmail(data.email);
          setLoading(false);
        }
      } catch (error) {
        router.push('/login');
      }
    };

    checkAuth();
  }, [router]);

  useEffect(() => {
    if (autoRefresh && !loading) {
      const interval = setInterval(() => {
        setLastUpdated(new Date());
      }, 5000); // Update timestamp every 5 seconds

      return () => clearInterval(interval);
    }
  }, [autoRefresh, loading]);

  const handleManualRefresh = () => {
    setLastUpdated(new Date());
    window.location.reload();
  };

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/login');
    } catch (error) {
      console.error('Logout failed:', error);
      setLoggingOut(false);
    }
  };

  // Show loading state while checking auth
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>NSE Market Dashboard - Real-time Stock Market Data</title>
        <meta name="description" content="Live NSE stock market data, indices, volume gainers, and corporate announcements" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 shadow-lg border-b border-gray-200 dark:border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center">
                <div className="relative w-12 h-12 mr-3">
                  <Image
                    src="/skylife-logo.png"
                    alt="SkyLife Research Logo"
                    width={48}
                    height={48}
                    className="object-contain"
                  />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    SLR Market Monitoring System
                  </h1>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    NSE Market Dashboard - Real-time Analytics
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 flex-wrap">
                {/* User info */}
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <User className="w-4 h-4 mr-2" />
                  <span className="hidden sm:inline">{userEmail}</span>
                </div>

                {/* Last updated */}
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <Clock className="w-4 h-4 mr-2" />
                  <span>Updated: {lastUpdated.toLocaleTimeString()}</span>
                </div>

                {/* Refresh button */}
                <button
                  onClick={handleManualRefresh}
                  className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Refresh
                </button>

                {/* Auto-refresh toggle */}
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={autoRefresh}
                    onChange={(e) => setAutoRefresh(e.target.checked)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                    Auto-refresh
                  </span>
                </label>

                {/* Logout button */}
                <button
                  onClick={handleLogout}
                  disabled={loggingOut}
                  className="flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors disabled:opacity-50"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="space-y-6">
            {/* Indices Overview */}
            <IndicesOverview />

            {/* Nifty Chart */}
            <NiftyChart />

            {/* NIFTY 50 Stocks Heatmap */}
            <StocksHeatmap />

            {/* Two Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <VolumeGainers />
              <OISpurts />
            </div>

            {/* Most Active Securities */}
            <MostActiveSecurities />

            {/* Corporate Announcements */}
            <CorporateAnnouncements />
          </div>
        </div>

        {/* Footer */}
        <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="text-center text-sm text-gray-600 dark:text-gray-400">
              <p>Data provided by NSE India. Auto-updates every 5 seconds.</p>
              <p className="mt-1">
                This dashboard is for informational purposes only. Not intended for trading decisions.
              </p>
            </div>
          </div>
        </footer>
      </main>
    </>
  );
}
