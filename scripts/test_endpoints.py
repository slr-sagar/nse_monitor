#!/usr/bin/env python3
"""
Quick test script to verify all NSE API endpoints
"""

import sys
import os

# Add parent directory to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from fetch_nse_data import NSEDataFetcher


def test_endpoint(name: str, func, show_data: bool = False):
    """Test a single endpoint"""
    print(f"\n{'='*80}")
    print(f"Testing: {name}")
    print('='*80)

    try:
        data = func()

        if "error" in data:
            print(f"❌ FAILED: {data['error']}")
            return False
        else:
            print(f"✅ SUCCESS")

            # Show data structure
            if isinstance(data, dict):
                print(f"   Response type: Dictionary")
                print(f"   Keys: {list(data.keys())[:10]}")  # First 10 keys
                if 'data' in data:
                    data_len = len(data['data']) if isinstance(data['data'], list) else 'N/A'
                    print(f"   Data items: {data_len}")
            elif isinstance(data, list):
                print(f"   Response type: List")
                print(f"   Items count: {len(data)}")

            if show_data:
                import json
                print(f"\n   Sample data:")
                print(json.dumps(data if isinstance(data, dict) else data[0] if data else {}, indent=2)[:500])

            return True
    except Exception as e:
        print(f"❌ EXCEPTION: {str(e)}")
        return False


def main():
    print("="*80)
    print("NSE API Endpoints Test Suite")
    print("="*80)

    fetcher = NSEDataFetcher()
    print("\n🔄 Initializing session...")

    if not fetcher.initialize_session():
        print("❌ Failed to initialize session!")
        return 1

    print("✅ Session initialized successfully")

    # Test all endpoints
    endpoints = [
        ("All Indices", fetcher.get_all_indices),
        ("Volume Gainers", fetcher.get_volume_gainers),
        ("Most Active Securities", fetcher.get_most_active_securities),
        ("OI Spurts", fetcher.get_oi_spurts),
        ("Corporate Announcements", fetcher.get_corporate_announcements),
        ("NIFTY 50 Chart", fetcher.get_nifty_chart),
        ("NIFTY 50 Stocks Heatmap", fetcher.get_stocks_heatmap),
    ]

    results = {}
    for name, func in endpoints:
        results[name] = test_endpoint(name, func)

    # Summary
    print("\n" + "="*80)
    print("SUMMARY")
    print("="*80)

    passed = sum(results.values())
    total = len(results)

    for name, result in results.items():
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"{status} - {name}")

    print(f"\n{'='*80}")
    print(f"Results: {passed}/{total} endpoints working")
    print("="*80)

    return 0 if passed == total else 1


if __name__ == "__main__":
    sys.exit(main())
