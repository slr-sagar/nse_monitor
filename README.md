# NSE Market Dashboard

A real-time stock market dashboard for NSE (National Stock Exchange of India) built with Next.js, TypeScript, and Tailwind CSS.

## Features

- **Real-time Data Sync**: Auto-refreshes every 5 seconds
- **Interactive Charts**: Beautiful visualizations using Recharts
- **Major Indices**: Live tracking of NIFTY 50, NIFTY BANK, and other major indices
- **NIFTY 50 Chart**: Live intraday area chart with color-coded gains/losses
- **Stocks Heatmap**: Interactive NIFTY 50 stocks heatmap with color intensity based on price movement
- **Volume Gainers**: Stocks with highest trading volume (chart + table)
- **Most Active Securities**: Securities with highest trading activity
- **OI Spurts**: Options with highest open interest changes
- **Corporate Announcements**: Latest company updates
- **🔒 Secure Authentication**: Login system with authorized user access

## Authentication

The dashboard is protected with a login system. Only authorized users can access the market data.

### Login Flow:
1. Visit the application URL
2. You'll be redirected to the login page
3. Enter your authorized email and password
4. Access the full dashboard with real-time data
5. Logout button available in the dashboard header

### Security Features:
- Secure session management using iron-session
- HttpOnly cookies for session storage
- Password validation on server-side
- Automatic redirect for unauthenticated users
- 7-day session expiry

## Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Data Fetching**: SWR (stale-while-revalidate)
- **HTTP Client**: Axios
- **Icons**: Lucide React
- **Authentication**: iron-session (secure cookie-based sessions)

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd Claude_test
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Set up environment variables:
```bash
# Copy the example file
cp .env.example .env

# Edit .env and set a secure SESSION_SECRET
# Generate one using: openssl rand -base64 32
```

4. Run the development server:
```bash
npm run dev
# or
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

6. Login with an authorized email address and password

## Deployment

### Deploy to Vercel

The easiest way to deploy this app is using Vercel:

1. Push your code to GitHub
2. Import your repository in [Vercel](https://vercel.com)
3. Vercel will automatically detect Next.js and configure the build settings
4. **Important**: Add environment variable in Vercel:
   - Go to Project Settings → Environment Variables
   - Add `SESSION_SECRET` with a secure random string (at least 32 characters)
   - Generate using: `openssl rand -base64 32`
5. Click "Deploy"

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/yourrepo)

### Manual Deployment

```bash
npm run build
npm start
```

## API Routes

The app uses Next.js API routes to proxy NSE API calls and handle CORS:

- `/api/nse/indices` - All indices data
- `/api/nse/volume-gainers` - Volume gainers
- `/api/nse/most-active` - Most active securities
- `/api/nse/oi-spurts` - OI spurts data
- `/api/nse/corporate-announcements` - Corporate announcements
- `/api/nse/nifty-chart` - NIFTY 50 chart data

## Features in Detail

### Real-time Updates
- Data automatically refreshes every 5 seconds
- Manual refresh button available
- Toggle auto-refresh on/off

### Responsive Design
- Mobile-friendly interface
- Adapts to different screen sizes
- Dark mode support

### Interactive Visualizations
- Area charts for NIFTY 50 intraday movement
- Bar charts for volume analysis
- Color-coded gainers/losers
- Heatmap-style cards for indices

## Python Testing Scripts

A Python script is included for testing API endpoints directly:

```bash
# Install dependencies
pip install requests

# Run interactive script
python3 scripts/fetch_nse_data.py
```

See `scripts/README.md` for more details.

## Data Sources

All data is fetched from official NSE India APIs:
- https://www.nseindia.com/api/allIndices
- https://www.nseindia.com/api/live-analysis-volume-gainers
- https://www.nseindia.com/api/live-analysis-most-active-securities
- https://www.nseindia.com/api/live-analysis-oi-spurts-underlyings
- https://www.nseindia.com/api/corporate-announcements
- https://www.nseindia.com/api/NextApi/apiClient/indexTrackerApi (heatmap)

## License

MIT

## Disclaimer

This dashboard is for informational and educational purposes only. It is not intended for making trading or investment decisions. Always consult with a qualified financial advisor before making investment decisions.
