from pytrends.request import TrendReq
import time

# Connect to Google Trends (with settings to avoid blocks)
pytrend = TrendReq(hl='en-US', tz=360)
time.sleep(1)

# Search for specific keywords instead of trending searches
keywords = ['AI', 'Taylor Swift', 'Super Bowl']
pytrend.build_payload(keywords, timeframe='now 7-d', geo='US')

# Get interest over time
interest = pytrend.interest_over_time()

print("INTEREST IN THESE TOPICS (last 7 days in USA):")
print(interest)