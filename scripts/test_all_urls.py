#!/usr/bin/env python3
import requests
import json

def test_nse_api(name, url):
    print(f"\n{'='*80}")
    print(f"Testing: {name}")
    print(f"URL: {url}")
    print('='*80)

    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'application/json',
        'Referer': 'https://www.nseindia.com/'
    }

    try:
        session = requests.Session()
        session.get('https://www.nseindia.com', headers=headers, timeout=10)
        response = session.get(url, headers=headers, timeout=10)
        response.raise_for_status()
        data = response.json()

        print(f"✅ SUCCESS - Status: {response.status_code}")
        print(f"Response type: {type(data)}")

        if isinstance(data, dict):
            print(f"Top-level keys: {list(data.keys())}")
            # Show structure of each key
            for key in list(data.keys())[:5]:
                val = data[key]
                if isinstance(val, list) and len(val) > 0:
                    print(f"  {key}: list with {len(val)} items")
                    print(f"    First item keys: {list(val[0].keys()) if isinstance(val[0], dict) else type(val[0])}")
                elif isinstance(val, dict):
                    print(f"  {key}: dict with keys: {list(val.keys())[:5]}")
                else:
                    print(f"  {key}: {type(val).__name__}")

        # Show first item if it's a list
        if isinstance(data, list) and len(data) > 0:
            print(f"List with {len(data)} items")
            print(f"First item: {json.dumps(data[0], indent=2)[:500]}")
        elif isinstance(data, dict) and 'data' in data and isinstance(data['data'], list) and len(data['data']) > 0:
            print(f"\nFirst data item:")
            print(json.dumps(data['data'][0], indent=2)[:500])

    except Exception as e:
        print(f"❌ ERROR: {str(e)}")

# Test all endpoints
urls = [
    ("OI Spurts", "https://www.nseindia.com/api/live-analysis-oi-spurts-underlyings"),
    ("Most Active", "https://www.nseindia.com/api/live-analysis-most-active-securities?index=value"),
    ("All Indices", "https://www.nseindia.com/api/allIndices"),
    ("Corporate Announcements", "https://www.nseindia.com/api/corporate-announcements?index=equities"),
    ("Volume Gainers", "https://www.nseindia.com/api/live-analysis-volume-gainers"),
    ("NIFTY Chart", "https://www.nseindia.com/api/chart-databyindex?index=NIFTY%2050&indices=true"),
    ("Heatmap (equity-stockIndices)", "https://www.nseindia.com/api/equity-stockIndices?index=NIFTY%2050"),
]

for name, url in urls:
    test_nse_api(name, url)

print(f"\n{'='*80}")
print("ALL TESTS COMPLETE")
print('='*80)
