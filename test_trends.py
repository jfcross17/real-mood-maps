from pytrends.request import TrendReq
import time

pytrends = TrendReq(hl='en-US', tz=360)

# Test different timeframe formats
test_formats = [
    'today 12-m',           # Last 12 months
    'today 3-m',            # Last 3 months  
    'now 7-d',              # Last 7 days
    '2023-03-01 2023-03-31',  # Absolute dates
]

keyword = 'recession'
state = 'US-CA'

for tf in test_formats:
    print(f"\nTesting timeframe: '{tf}'")
    try:
        pytrends.build_payload([keyword], timeframe=tf, geo=state)
        data = pytrends.interest_over_time()
        if not data.empty:
            print(f"  ✓ SUCCESS - Got {len(data)} data points")
            print(f"    Date range: {data.index[0]} to {data.index[-1]}")
        else:
            print(f"  ✗ EMPTY - No data returned")
    except Exception as e:
        print(f"  ✗ ERROR: {e}")
    time.sleep(3)