import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Image from 'next/image';

export default function Home() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/check');
        const data = await response.json();

        if (data.isLoggedIn) {
          router.push('/dashboard');
        } else {
          router.push('/login');
        }
      } catch (error) {
        router.push('/login');
      }
    };

    checkAuth();
  }, [router]);

  return (
    <>
      <Head>
        <title>NSE Market Dashboard</title>
        <meta name="description" content="Real-time NSE stock market dashboard" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="relative w-24 h-24">
              <Image
                src="/skylife-logo.png"
                alt="SkyLife Research Logo"
                width={96}
                height={96}
                className="object-contain"
                priority
              />
            </div>
          </div>
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Redirecting...</p>
        </div>
      </div>
    </>
  );
}
