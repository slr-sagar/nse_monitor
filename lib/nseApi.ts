import axios, { AxiosInstance } from 'axios';

class NSEClient {
  private session: AxiosInstance;
  private cookiesInitialized: boolean = false;

  constructor() {
    this.session = axios.create({
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'application/json',
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept-Encoding': 'gzip, deflate, br',
        'Referer': 'https://www.nseindia.com/'
      },
      timeout: 10000,
    });
  }

  async initSession(): Promise<void> {
    if (this.cookiesInitialized) return;

    try {
      await this.session.get('https://www.nseindia.com', {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        }
      });
      this.cookiesInitialized = true;
    } catch (error) {
      console.error('Failed to initialize NSE session:', error);
      throw error;
    }
  }

  async fetchData(url: string): Promise<any> {
    try {
      await this.initSession();
      const response = await this.session.get(url);
      return response.data;
    } catch (error: any) {
      console.error(`Error fetching ${url}:`, error.message);
      throw new Error(`Failed to fetch data: ${error.message}`);
    }
  }
}

export const nseClient = new NSEClient();

export const NSE_ENDPOINTS = {
  OI_SPURTS: 'https://www.nseindia.com/api/live-analysis-oi-spurts-underlyings',
  MOST_ACTIVE: 'https://www.nseindia.com/api/live-analysis-most-active-securities?index=value',
  ALL_INDICES: 'https://www.nseindia.com/api/allIndices',
  CORPORATE_ANNOUNCEMENTS: 'https://www.nseindia.com/api/corporate-announcements?index=equities',
  VOLUME_GAINERS: 'https://www.nseindia.com/api/live-analysis-volume-gainers',
  NIFTY_CHART: 'https://www.nseindia.com/api/chart-databyindex?index=NIFTY%2050',
} as const;
