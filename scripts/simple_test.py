#!/usr/bin/env python3
"""
Simple test to check NSE API connectivity
"""

import requests
import json


def test_nse_connection():
    """Test basic NSE connection"""
    print("Testing NSE India API connectivity...\n")

    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'application/json',
        'Accept-Language': 'en-US,en;q=0.9',
        'Referer': 'https://www.nseindia.com/'
    }

    # Test 1: Initialize session
    print("1. Initializing session with NSE...")
    try:
        session = requests.Session()
        response = session.get(
            'https://www.nseindia.com',
            headers=headers,
            timeout=10
        )
        print(f"   Status Code: {response.status_code}")
        print(f"   Cookies received: {len(session.cookies)}")

        if response.status_code == 200:
            print("   ✅ Session initialized")
        else:
            print(f"   ⚠️  Unexpected status code")
    except Exception as e:
        print(f"   ❌ Error: {e}")
        return False

    # Test 2: Fetch indices data
    print("\n2. Fetching indices data...")
    try:
        url = "https://www.nseindia.com/api/allIndices"
        response = session.get(url, headers=headers, timeout=10)
        print(f"   Status Code: {response.status_code}")

        if response.status_code == 200:
            data = response.json()
            print(f"   ✅ Success! Received {len(data.get('data', []))} indices")
            # Show first index
            if data.get('data'):
                first = data['data'][0]
                print(f"   Sample: {first.get('index')} - {first.get('last')}")
        else:
            print(f"   ⚠️  Status: {response.status_code}")
            print(f"   Response: {response.text[:200]}")
    except Exception as e:
        print(f"   ❌ Error: {e}")

    # Test 3: Fetch heatmap
    print("\n3. Fetching NIFTY 50 heatmap...")
    try:
        url = "https://www.nseindia.com/api/NextApi/apiClient/indexTrackerApi?functionName=getIndicesHeatMap&&index=NIFTY%2050"
        response = session.get(url, headers=headers, timeout=10)
        print(f"   Status Code: {response.status_code}")

        if response.status_code == 200:
            data = response.json()
            print(f"   ✅ Success!")
            if isinstance(data, dict):
                print(f"   Keys: {list(data.keys())}")
        else:
            print(f"   ⚠️  Status: {response.status_code}")
    except Exception as e:
        print(f"   ❌ Error: {e}")

    print("\n" + "="*60)
    print("Note: Some endpoints may be temporarily unavailable")
    print("or may require additional authentication/timing.")
    print("The Next.js app handles this with proper retry logic.")
    print("="*60)


if __name__ == "__main__":
    test_nse_connection()
