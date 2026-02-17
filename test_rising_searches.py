"""
Test Script: Check if Google Trends Rising Searches works for states
"""

from pytrends.request import TrendReq
import time

pytrends = TrendReq(hl='en-US', tz=360)

# Test states
test_states = ['US-CA', 'US-TX', 'US-NY', 'US-FL']

print("="*60)
print("Testing Google Trends Rising Searches API")
print("="*60)

for state_code in test_states:
    state_name = state_code.replace('US-', '')
    print(f"\n📍 Testing: {state_name}")
    print("-"*40)
    
    try:
        # Method 1: Try trending_searches (might be US-only)
        print("  Method 1: trending_searches()...")
        trending = pytrends.trending_searches(pn='united_states')
        if not trending.empty:
            print(f"  ✓ Got {len(trending)} trending searches (NATIONAL)")
            print(f"    Top 3: {trending[0].head(3).tolist()}")
        else:
            print("  ✗ No data")
    except Exception as e:
        print(f"  ✗ Error: {e}")
    
    time.sleep(2)
    
    try:
        # Method 2: Try related_queries with broad keyword
        print("  Method 2: related_queries() with 'news'...")
        pytrends.build_payload(['news'], timeframe='now 7-d', geo=state_code)
        related = pytrends.related_queries()
        
        if related and 'news' in related:
            rising = related['news']['rising']
            if rising is not None and not rising.empty:
                print(f"  ✓ Got {len(rising)} rising queries for {state_name}")
                print(f"    Top 5:")
                for idx, row in rising.head(5).iterrows():
                    print(f"      • {row['query']} (value: {row['value']})")
            else:
                print("  ✗ No rising queries")
        else:
            print("  ✗ No data")
    except Exception as e:
        print(f"  ✗ Error: {e}")
    
    time.sleep(2)

print("\n" + "="*60)
print("TEST COMPLETE")
print("="*60)
print("\nConclusion:")
print("If Method 2 showed rising queries per state → WE CAN DO THIS")
print("If both methods failed → We need the 16-keyword approach")
print("="*60)
