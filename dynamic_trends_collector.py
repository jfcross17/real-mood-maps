"""
Dynamic Trends Collector for Panic Atlas
Pulls ACTUAL rising searches per state instead of predetermined keywords

Usage:
    python dynamic_trends_collector.py
"""

from pytrends.request import TrendReq
import json
import time
import os
from datetime import datetime

# Initialize PyTrends
pytrends = TrendReq(hl='en-US', tz=360)

# US States mapping
US_STATES = {
    'Alabama': 'US-AL', 'Alaska': 'US-AK', 'Arizona': 'US-AZ', 'Arkansas': 'US-AR',
    'California': 'US-CA', 'Colorado': 'US-CO', 'Connecticut': 'US-CT', 'Delaware': 'US-DE',
    'Florida': 'US-FL', 'Georgia': 'US-GA', 'Hawaii': 'US-HI', 'Idaho': 'US-ID',
    'Illinois': 'US-IL', 'Indiana': 'US-IN', 'Iowa': 'US-IA', 'Kansas': 'US-KS',
    'Kentucky': 'US-KY', 'Louisiana': 'US-LA', 'Maine': 'US-ME', 'Maryland': 'US-MD',
    'Massachusetts': 'US-MA', 'Michigan': 'US-MI', 'Minnesota': 'US-MN', 'Mississippi': 'US-MS',
    'Missouri': 'US-MO', 'Montana': 'US-MT', 'Nebraska': 'US-NE', 'Nevada': 'US-NV',
    'New Hampshire': 'US-NH', 'New Jersey': 'US-NJ', 'New Mexico': 'US-NM', 'New York': 'US-NY',
    'North Carolina': 'US-NC', 'North Dakota': 'US-ND', 'Ohio': 'US-OH', 'Oklahoma': 'US-OK',
    'Oregon': 'US-OR', 'Pennsylvania': 'US-PA', 'Rhode Island': 'US-RI', 'South Carolina': 'US-SC',
    'South Dakota': 'US-SD', 'Tennessee': 'US-TN', 'Texas': 'US-TX', 'Utah': 'US-UT',
    'Vermont': 'US-VT', 'Virginia': 'US-VA', 'Washington': 'US-WA', 'West Virginia': 'US-WV',
    'Wisconsin': 'US-WI', 'Wyoming': 'US-WY', 'District of Columbia': 'US-DC'
}

# Emotional keywords (still track these for anxiety/hope scores)
EMOTIONAL_KEYWORDS = ['anxiety', 'hope', 'stress', 'fear', 'depression']

# Concern signal words - if a search contains these, it's likely a concern
CONCERN_SIGNALS = [
    # Economic
    'crisis', 'crash', 'collapse', 'recession', 'inflation', 'layoff', 'unemployment',
    'debt', 'broke', 'bankruptcy', 'foreclosure', 'eviction',
    
    # Costs/Prices
    'price', 'cost', 'expensive', 'unaffordable', 'shortage', 'supply',
    
    # Safety/Crime
    'crime', 'violence', 'shooting', 'murder', 'attack', 'threat', 'danger',
    'arrest', 'police', 'trial', 'lawsuit', 'scandal',
    
    # Social Issues
    'protest', 'riot', 'border', 'immigration', 'migrant',
    
    # Health/Safety
    'outbreak', 'pandemic', 'disease', 'death', 'disaster', 'emergency',
    'fire', 'flood', 'hurricane', 'earthquake',
    
    # General Concern
    'concern', 'worry', 'fear', 'panic', 'alarm', 'warning', 'alert',
    'problem', 'issue', 'trouble', 'risk', 'failure'
]

# Skip words - entertainment/sports that aren't concerns
SKIP_SIGNALS = [
    'game', 'score', 'season', 'playoff', 'championship', 'super bowl',
    'movie', 'film', 'tv show', 'series', 'episode', 'trailer',
    'album', 'song', 'concert', 'tour', 'grammy', 'oscar',
    'recipe', 'cooking', 'fashion', 'style', 'beauty'
]


def is_concern_related(search_query):
    """Determine if a search query is concern-related"""
    query_lower = search_query.lower()
    
    # Skip pure entertainment
    if any(skip in query_lower for skip in SKIP_SIGNALS):
        return False
    
    # Keep if it has concern signals
    if any(signal in query_lower for signal in CONCERN_SIGNALS):
        return True
    
    # Keep news-related searches (might be important)
    if 'breaking' in query_lower or 'news' in query_lower:
        return True
    
    return False


def get_rising_searches_for_state(state_name, state_code):
    """Get rising searches for a specific state"""
    print(f"   📍 {state_name}...", end=' ')
    
    try:
        # Use 'news' as the seed keyword - gets general rising searches
        pytrends.build_payload(['news'], timeframe='now 1-d', geo=state_code)
        related = pytrends.related_queries()
        
        if related and 'news' in related:
            rising = related['news']['rising']
            
            if rising is not None and not rising.empty:
                # Get all rising queries
                all_queries = rising[['query', 'value']].values.tolist()
                
                # Filter for concern-related only
                concern_queries = [
                    {'query': query, 'value': int(value)}
                    for query, value in all_queries
                    if is_concern_related(query)
                ]
                
                # Take top 5 concerns
                top_concerns = sorted(concern_queries, key=lambda x: x['value'], reverse=True)[:5]
                
                print(f"✓ ({len(top_concerns)} concerns)")
                return top_concerns
            else:
                print("✓ (no data)")
                return []
        else:
            print("✓ (no data)")
            return []
            
    except Exception as e:
        print(f"✗ Error: {e}")
        return []


def collect_emotional_data_by_state():
    """Collect basic emotional data (anxiety, hope, stress, etc.)"""
    print("\n📊 Collecting emotional baseline data...")
    state_data = {}
    
    for state_name, state_code in US_STATES.items():
        try:
            pytrends.build_payload(EMOTIONAL_KEYWORDS, timeframe='now 1-d', geo=state_code)
            data = pytrends.interest_over_time()
            
            if not data.empty:
                state_data[state_name] = {
                    keyword: int(data[keyword].mean()) 
                    for keyword in EMOTIONAL_KEYWORDS
                }
            else:
                state_data[state_name] = {keyword: 0 for keyword in EMOTIONAL_KEYWORDS}
            
            time.sleep(2)
            
        except Exception as e:
            print(f"   ⚠️  Error for {state_name}: {e}")
            state_data[state_name] = {keyword: 0 for keyword in EMOTIONAL_KEYWORDS}
            time.sleep(5)
    
    print(f"   ✅ Emotional data collected for {len(state_data)} states")
    return state_data


def main():
    print("\n" + "="*70)
    print("🔥 DYNAMIC TRENDS COLLECTOR - PHASE 2")
    print("="*70)
    print("\nThis collector pulls ACTUAL rising searches per state")
    print("No predetermined keywords - pure discovery mode")
    print("\nEstimated time: ~40-50 minutes")
    print("="*70)
    
    input("\nPress ENTER to start...")
    
    # Step 1: Collect emotional baseline (anxiety, hope, etc.)
    emotional_data = collect_emotional_data_by_state()
    
    # Step 2: Get rising searches per state
    print("\n🔥 Collecting rising searches per state...")
    print("   (Filtering for concerns only - skipping entertainment)\n")
    
    all_state_data = {}
    
    for state_name, state_code in US_STATES.items():
        rising_concerns = get_rising_searches_for_state(state_name, state_code)
        
        # Combine emotional data + rising concerns
        all_state_data[state_name] = {
            **emotional_data.get(state_name, {}),
            'top_concerns': [
                {
                    'concern': item['query'],
                    'value': item['value'],
                    'related_searches': []  # Could enhance later
                }
                for item in rising_concerns
            ]
        }
        
        time.sleep(3)  # Rate limiting
    
    # Calculate national averages
    print("\n🌍 Calculating national statistics...")
    num_states = len(all_state_data)
    
    emotional_totals = {keyword: 0 for keyword in EMOTIONAL_KEYWORDS}
    for state_data in all_state_data.values():
        for keyword in EMOTIONAL_KEYWORDS:
            emotional_totals[keyword] += state_data.get(keyword, 0)
    
    national_stats = {
        'national_anxiety': round(emotional_totals['anxiety'] / num_states, 1),
        'national_hope': round(emotional_totals['hope'] / num_states, 1),
        'national_stress': round(emotional_totals['stress'] / num_states, 1),
        'national_fear': round(emotional_totals['fear'] / num_states, 1),
    }
    
    # Create final results
    results = {
        'last_updated': datetime.now().isoformat(),
        'collection_method': 'dynamic_rising_searches',
        'timeframe': 'last_24_hours',
        'state_data': all_state_data,
        'national_stats': national_stats,
        'aggregated': {
            'emotions': {
                'anxiety': national_stats['national_anxiety'],
                'hope': national_stats['national_hope'],
                'stress': national_stats['national_stress'],
                'fear': national_stats['national_fear'],
                'sadness': 0,
                'optimism': national_stats['national_hope']
            }
        }
    }
    
    # Save to JSON
    with open('sentiment_results.json', 'w') as f:
        json.dump(results, f, indent=2)
    
    print("\n" + "="*70)
    print("✅ COLLECTION COMPLETE!")
    print("="*70)
    print(f"\n📊 Results:")
    print(f"   States analyzed: {len(all_state_data)}")
    print(f"   National Anxiety: {national_stats['national_anxiety']}")
    print(f"   National Hope: {national_stats['national_hope']}")
    
    # Show sample of what we found
    print(f"\n🔥 Sample Rising Concerns:")
    sample_states = ['California', 'Texas', 'New York', 'Florida']
    for state in sample_states:
        if state in all_state_data and all_state_data[state]['top_concerns']:
            print(f"\n   {state}:")
            for concern in all_state_data[state]['top_concerns'][:3]:
                print(f"      • {concern['concern']} ({concern['value']})")
    
    print(f"\n💾 Data saved to: sentiment_results.json")
    print("="*70 + "\n")


if __name__ == "__main__":
    main()
