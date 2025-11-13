#!/usr/bin/env python3
"""
Test script for NSE Corporate Announcements API
Run this locally to see the actual API response structure
"""

import requests
import json

def test_corporate_announcements():
    """Test the NSE Corporate Announcements API"""

    # Create a session to handle cookies
    session = requests.Session()

    # Headers to mimic browser
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'application/json',
        'Referer': 'https://www.nseindia.com/'
    }

    # First, get the homepage to establish cookies
    print("Step 1: Getting homepage to establish session...")
    homepage = session.get('https://www.nseindia.com', headers=headers, timeout=10)
    print(f"Homepage status: {homepage.status_code}")

    # Now make the API request
    print("\nStep 2: Fetching Corporate Announcements...")
    url = 'https://www.nseindia.com/api/corporate-announcements?index=equities'
    response = session.get(url, headers=headers, timeout=10)
    print(f"API status: {response.status_code}")

    if response.status_code == 200:
        data = response.json()
        print("\n" + "="*80)
        print("API RESPONSE STRUCTURE:")
        print("="*80)

        # Check if it's a direct array or wrapped in 'data'
        if isinstance(data, list):
            print(f"Response is a DIRECT ARRAY with {len(data)} items")
            announcements = data
        elif isinstance(data, dict) and 'data' in data:
            print(f"Response is WRAPPED in 'data' key with {len(data['data'])} items")
            announcements = data['data']
        else:
            print(f"Response type: {type(data)}")
            print(f"Response keys: {data.keys() if isinstance(data, dict) else 'N/A'}")
            announcements = []

        if announcements:
            print(f"\nTotal announcements: {len(announcements)}")
            print("\n" + "="*80)
            print("FIRST ANNOUNCEMENT DETAILS:")
            print("="*80)
            first = announcements[0]

            # Print all available keys
            print(f"\nAvailable fields: {list(first.keys())}")

            # Print specific fields we're interested in
            print(f"\n{'Field':<25} {'Value':<50}")
            print("-" * 80)
            important_fields = [
                'symbol', 'smName', 'cmName', 'type', 'qe_Date',
                'ixbrl', 'pdf_attach', 'xbrl',
                'broadcast_Date', 'creation_Date',
                'audited', 'consolidated'
            ]

            for field in important_fields:
                value = first.get(field, 'NOT PRESENT')
                # Truncate long URLs for display
                if isinstance(value, str) and len(value) > 50:
                    value = value[:47] + '...'
                print(f"{field:<25} {str(value):<50}")

            # Check for document links
            print("\n" + "="*80)
            print("DOCUMENT LINKS CHECK:")
            print("="*80)

            count_ixbrl = sum(1 for a in announcements[:10] if a.get('ixbrl'))
            count_pdf = sum(1 for a in announcements[:10] if a.get('pdf_attach'))

            print(f"Out of first 10 announcements:")
            print(f"  - Have ixbrl link: {count_ixbrl}")
            print(f"  - Have pdf_attach link: {count_pdf}")

            # Show first 3 announcements with details
            print("\n" + "="*80)
            print("FIRST 3 ANNOUNCEMENTS (ABBREVIATED):")
            print("="*80)
            for i, ann in enumerate(announcements[:3], 1):
                print(f"\n{i}. {ann.get('symbol', 'N/A')} - {ann.get('smName', 'N/A')}")
                print(f"   Type: {ann.get('type', 'N/A')}")
                print(f"   Date: {ann.get('broadcast_Date', ann.get('creation_Date', 'N/A'))}")
                print(f"   iXBRL: {'✓ YES' if ann.get('ixbrl') else '✗ NO'}")
                print(f"   PDF: {'✓ YES' if ann.get('pdf_attach') else '✗ NO'}")
                if ann.get('ixbrl'):
                    print(f"   iXBRL URL: {ann.get('ixbrl')[:80]}...")
                if ann.get('pdf_attach'):
                    print(f"   PDF URL: {ann.get('pdf_attach')[:80]}...")

            # Save full response to file for inspection
            with open('corporate_announcements_response.json', 'w') as f:
                json.dump(data, f, indent=2)
            print("\n" + "="*80)
            print("Full response saved to: corporate_announcements_response.json")
            print("="*80)

        else:
            print("No announcements found in response")
            print(f"\nFull response:\n{json.dumps(data, indent=2)}")
    else:
        print(f"Error: Received status code {response.status_code}")
        print(f"Response: {response.text[:500]}")

if __name__ == '__main__':
    try:
        test_corporate_announcements()
    except Exception as e:
        print(f"\nError occurred: {e}")
        import traceback
        traceback.print_exc()
