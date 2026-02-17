from pytrends.request import TrendReq
import json
import time

# Initialize PyTrends
pytrends = TrendReq(hl='en-US', tz=360)

def get_related_searches(keyword, geo='US'):
    """Get related rising queries for a keyword"""
    try:
        pytrends.build_payload([keyword], timeframe='now 7-d', geo=geo)
        related_queries = pytrends.related_queries()
        
        if keyword in related_queries and related_queries[keyword]['rising'] is not None:
            # Get top 3 rising related searches
            rising = related_queries[keyword]['rising']
            if not rising.empty:
                top_rising = rising.head(3)['query'].tolist()
                return top_rising
        
        return []
    except Exception as e:
        print(f"   ⚠️  Error getting related searches for '{keyword}': {e}")
        return []

def main():
    print("🔍 Loading sentiment data...")
    
    # Load existing sentiment results
    with open('sentiment_results.json', 'r') as f:
        data = json.load(f)
    
    print("📊 Fetching related searches for top concerns...\n")
    
    # Track unique concerns to avoid duplicate API calls
    unique_concerns = set()
    concern_related = {}
    
    # Collect all unique concerns first
    for state_name, state_data in data['state_data'].items():
        if 'top_concerns' in state_data:
            for concern_item in state_data['top_concerns']:
                concern = concern_item['concern']
                unique_concerns.add(concern)
    
    # Fetch related searches for each unique concern
    print(f"Found {len(unique_concerns)} unique concerns to analyze...")
    for i, concern in enumerate(unique_concerns, 1):
        print(f"   [{i}/{len(unique_concerns)}] Analyzing '{concern}'...")
        related = get_related_searches(concern)
        concern_related[concern] = related
        time.sleep(2)  # Rate limiting
    
    # Add related searches to each state's concerns
    for state_name, state_data in data['state_data'].items():
        if 'top_concerns' in state_data:
            for concern_item in state_data['top_concerns']:
                concern = concern_item['concern']
                concern_item['related_searches'] = concern_related.get(concern, [])
    
    # Save updated data
    with open('sentiment_results.json', 'w') as f:
        json.dump(data, f, indent=2)
    
    print("\n✅ RELATED SEARCHES ADDED!")
    print(f"   💾 Updated: sentiment_results.json")
    print("\n🔍 Sample related searches:")
    for concern, related in list(concern_related.items())[:3]:
        print(f"\n   {concern}:")
        for search in related:
            print(f"      • {search}")

if __name__ == "__main__":
    main()
