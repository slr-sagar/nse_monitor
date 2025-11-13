# NSE Data Fetcher Scripts

Python scripts for testing and fetching data from NSE India APIs.

## Setup

Install required dependencies:

```bash
pip install requests
```

## Usage

### Interactive Mode

Run the script and select which endpoint to fetch:

```bash
python3 scripts/fetch_nse_data.py
```

### Programmatic Usage

```python
from fetch_nse_data import NSEDataFetcher

# Create fetcher instance
fetcher = NSEDataFetcher()

# Fetch specific data
volume_gainers = fetcher.get_volume_gainers()
print(volume_gainers)

# Fetch heatmap
heatmap = fetcher.get_stocks_heatmap()
print(heatmap)
```

## Available Methods

- `get_oi_spurts()` - OI spurts (most active underlyings)
- `get_most_active_securities()` - Most active securities
- `get_all_indices()` - All indices performance
- `get_corporate_announcements()` - Corporate announcements
- `get_volume_gainers()` - Volume gainers
- `get_nifty_chart()` - NIFTY 50 chart data
- `get_stocks_heatmap()` - NIFTY 50 stocks heatmap

## Testing

Run the test script to verify endpoint connectivity:

```bash
python3 scripts/simple_test.py
```

## Notes

- The script handles session initialization and cookie management automatically
- Proper headers are set to mimic browser requests
- All responses are returned as Python dictionaries (parsed JSON)
- **Important**: NSE APIs may block requests from certain environments (cloud servers, VPNs, etc.) for security reasons. If you get 403 errors, try running from a local machine with a residential IP address.
- The Next.js application handles these scenarios gracefully with proper retry logic and works correctly when deployed to Vercel.
