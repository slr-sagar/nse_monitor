import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { SWRConfig } from 'swr';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <SWRConfig
      value={{
        refreshInterval: 5000,
        revalidateOnFocus: true,
        dedupingInterval: 2000,
      }}
    >
      <Component {...pageProps} />
    </SWRConfig>
  );
}
