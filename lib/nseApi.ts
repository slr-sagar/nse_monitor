import axios from 'axios';
import { wrapper } from 'axios-cookiejar-support';
import { CookieJar } from 'tough-cookie';

export async function fetchNSEData(url: string): Promise<any> {
  try {
    // Create a cookie jar to store cookies (like Python's requests.Session())
    const jar = new CookieJar();
    const client = wrapper(axios.create({ jar }));

    const headers = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      'Accept': 'application/json',
      'Referer': 'https://www.nseindia.com/'
    };

    // First, get the homepage to establish cookies (exactly like Python code)
    await client.get('https://www.nseindia.com', { headers, timeout: 10000 });

    // Now make the actual API request with the same session (cookies are automatically carried)
    const response = await client.get(url, { headers, timeout: 10000 });

    return response.data;
  } catch (error: any) {
    console.error(`NSE API error for ${url}:`, error.message);
    throw error;
  }
}

export const NSE_ENDPOINTS = {
  OI_SPURTS: 'https://www.nseindia.com/api/live-analysis-oi-spurts-underlyings',
  MOST_ACTIVE: 'https://www.nseindia.com/api/live-analysis-most-active-securities?index=value',
  ALL_INDICES: 'https://www.nseindia.com/api/allIndices',
  CORPORATE_ANNOUNCEMENTS: 'https://www.nseindia.com/api/corporate-announcements?index=equities',
  VOLUME_GAINERS: 'https://www.nseindia.com/api/live-analysis-volume-gainers',
  NIFTY_CHART: 'https://www.nseindia.com/api/chart-databyindex?index=NIFTY%2050&indices=true',
  HEATMAP: 'https://www.nseindia.com/api/equity-stockIndices?index=NIFTY%2050',
  MARKET_STATUS: 'https://www.nseindia.com/api/marketStatus',
} as const;
