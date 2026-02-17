from pytrends.request import TrendReq
import time

pytrends = TrendReq(hl='en-US', tz=360)

# Test with ALL 7 keywords (same as backtest script)
BACKTEST_KEYWORDS = [
    'recession',
    'stock market crash',
    'should I sell stocks',
    'layoffs',
    'unemployment',
    'market crash',
    'financial crisis'
]

timeframe = '2023-03-03 2023-03-10'
state = 'US-AL'  # Alabama

print(f"Testing with ALL 7 keywords:")
print(f"  Timeframe: {timeframe}")
print(f"  State: {state}")
print(f"  Keywords: {BACKTEST_KEYWORDS}")
print()

try:
    pytrends.build_payload(BACKTEST_KEYWORDS, timeframe=timeframe, geo=state)
    data = pytrends.interest_over_time()
    
    if not data.empty:
        print("SUCCESS!")
        print(f"Got {len(data)} data points")
        print(f"Columns: {data.columns.tolist()}")
    else:
        print("Empty data returned")
        
except Exception as e:
    print(f"ERROR: {e}")
    print(f"\nThis is the problem! Google Trends limits to 5 keywords max.")
