import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta name="description" content="NSE Market Dashboard - Real-time Indian stock market data" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <body className="bg-gray-50 dark:bg-gray-900">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
