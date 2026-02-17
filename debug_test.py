from pytrends.request import TrendReq
import time

pytrends = TrendReq(hl='en-US', tz=360)

# Test the EXACT parameters we're using
keywords = ['recession', 'stock market crash']
timeframe = '2023-03-03 2023-03-10'
state = 'US-AL'  # Alabama

print(f"Testing with:")
print(f"  Keywords: {keywords}")
print(f"  Timeframe: {timeframe}")
print(f"  State: {state}")
print()

try:
    pytrends.build_payload(keywords, timeframe=timeframe, geo=state)
    data = pytrends.interest_over_time()
    
    if not data.empty:
        print("SUCCESS!")
        print(f"Got {len(data)} data points")
        print(data.head())
    else:
        print("Empty data returned")
        
except Exception as e:
    print(f"ERROR: {e}")
    print(f"Error type: {type(e)}")
