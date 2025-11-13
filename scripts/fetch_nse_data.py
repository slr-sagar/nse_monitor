#!/usr/bin/env python3
"""
NSE India API Data Fetcher
Fetches real-time market data from NSE India APIs
"""

import requests
import json
import sys
from typing import Dict, Any


class NSEDataFetcher:
    """Class to fetch data from NSE India APIs"""

    def __init__(self):
        self.base_url = "https://www.nseindia.com"
        self.session = requests.Session()
        self.headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            'Accept': 'application/json',
            'Accept-Language': 'en-US,en;q=0.9',
            'Accept-Encoding': 'gzip, deflate, br',
            'Referer': 'https://www.nseindia.com/'
        }

    def initialize_session(self) -> bool:
        """Initialize session by making a request to get cookies"""
        try:
            response = self.session.get(
                self.base_url,
                headers=self.headers,
                timeout=10
            )
            return response.status_code == 200
        except Exception as e:
            print(f"Error initializing session: {e}", file=sys.stderr)
            return False

    def fetch_data(self, url: str) -> Dict[str, Any]:
        """Fetch data from given URL"""
        try:
            # Initialize session if not already done
            if not self.session.cookies:
                if not self.initialize_session():
                    return {"error": "Failed to initialize session"}

            response = self.session.get(url, headers=self.headers, timeout=10)
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            return {"error": str(e)}
        except json.JSONDecodeError as e:
            return {"error": f"Invalid JSON response: {str(e)}"}

    def get_oi_spurts(self) -> Dict[str, Any]:
        """Fetch OI spurts (most active underlyings)"""
        url = f"{self.base_url}/api/live-analysis-oi-spurts-underlyings"
        return self.fetch_data(url)

    def get_most_active_securities(self) -> Dict[str, Any]:
        """Fetch most active securities"""
        url = f"{self.base_url}/api/live-analysis-most-active-securities?index=value"
        return self.fetch_data(url)

    def get_all_indices(self) -> Dict[str, Any]:
        """Fetch all indices performance"""
        url = f"{self.base_url}/api/allIndices"
        return self.fetch_data(url)

    def get_corporate_announcements(self) -> Dict[str, Any]:
        """Fetch corporate announcements"""
        url = f"{self.base_url}/api/corporate-announcements?index=equities"
        return self.fetch_data(url)

    def get_volume_gainers(self) -> Dict[str, Any]:
        """Fetch volume gainers"""
        url = f"{self.base_url}/api/live-analysis-volume-gainers"
        return self.fetch_data(url)

    def get_nifty_chart(self, period: str = "1D") -> Dict[str, Any]:
        """Fetch NIFTY 50 chart data"""
        url = f"{self.base_url}/api/chart-databyindex?index=NIFTY%2050&indices=true"
        return self.fetch_data(url)

    def get_stocks_heatmap(self) -> Dict[str, Any]:
        """Fetch NIFTY 50 stocks heatmap"""
        url = f"{self.base_url}/api/NextApi/apiClient/indexTrackerApi?functionName=getIndicesHeatMap&&index=NIFTY%2050"
        return self.fetch_data(url)


def main():
    """Main function to demonstrate fetching data"""
    print("=" * 80)
    print("NSE India Market Data Fetcher")
    print("=" * 80)

    fetcher = NSEDataFetcher()

    # Menu
    endpoints = {
        "1": ("OI Spurts", fetcher.get_oi_spurts),
        "2": ("Most Active Securities", fetcher.get_most_active_securities),
        "3": ("All Indices", fetcher.get_all_indices),
        "4": ("Corporate Announcements", fetcher.get_corporate_announcements),
        "5": ("Volume Gainers", fetcher.get_volume_gainers),
        "6": ("NIFTY 50 Chart", fetcher.get_nifty_chart),
        "7": ("NIFTY 50 Stocks Heatmap", fetcher.get_stocks_heatmap),
        "all": ("Fetch All Endpoints", None),
    }

    print("\nAvailable Endpoints:")
    for key, (name, _) in endpoints.items():
        print(f"  {key}. {name}")

    choice = input("\nEnter your choice (or 'all' for all endpoints): ").strip()

    if choice == "all":
        print("\nFetching data from all endpoints...\n")
        for key, (name, func) in endpoints.items():
            if key == "all":
                continue
            print(f"\n{'=' * 80}")
            print(f"{name}")
            print('=' * 80)
            data = func()
            print(json.dumps(data, indent=2))
    elif choice in endpoints and choice != "all":
        name, func = endpoints[choice]
        print(f"\nFetching {name}...\n")
        data = func()
        print(json.dumps(data, indent=2))
    else:
        print("Invalid choice!")
        return 1

    return 0


if __name__ == "__main__":
    sys.exit(main())
