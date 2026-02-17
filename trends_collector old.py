from pytrends.request import TrendReq
import json
import time
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

# Emotional keywords
EMOTIONAL_KEYWORDS = ['anxiety', 'hope', 'stress', 'fear', 'depression']

# Economic concern keywords
CONCERN_KEYWORDS = ['layoffs', 'housing costs', 'crime', 'unemployment', 'inflation']

# Market sentiment keywords
FEAR_KEYWORDS = ['recession', 'market crash', 'economic collapse']
BULLISH_KEYWORDS = ['invest', 'buy stocks', 'market rally']

def collect_data_by_state(keywords, description):
    """Collect trend data for given keywords across all states"""
    print(f"📊 Collecting {description} by state...")
    state_data = {}
    
    for state_name, state_code in US_STATES.items():
        try:
            pytrends.build_payload(keywords, timeframe='now 7-d', geo=state_code)
            data = pytrends.interest_over_time()
            
            if not data.empty:
                # Calculate average for each keyword over the past week
                state_data[state_name] = {
                    keyword: int(data[keyword].mean()) 
                    for keyword in keywords
                }
            else:
                state_data[state_name] = {keyword: 0 for keyword in keywords}
            
            time.sleep(2)  # Rate limiting
            
        except Exception as e:
            print(f"   ⚠️  Error for {state_name}: {e}")
            state_data[state_name] = {keyword: 0 for keyword in keywords}
            time.sleep(5)
    
    print(f"   ✅ {description} collected for {len(state_data)} states")
    return state_data

def get_related_queries(keyword, state_code):
    """Get related rising queries for a specific keyword and state"""
    try:
        pytrends.build_payload([keyword], timeframe='now 7-d', geo=state_code)
        related = pytrends.related_queries()
        
        if related and keyword in related:
            rising = related[keyword]['rising']
            if rising is not None and not rising.empty:
                # Get top 3 rising queries
                top_rising = rising.head(3)['query'].tolist()
                return top_rising
        
        return []
    except Exception as e:
        print(f"      ⚠️ Error getting related queries: {e}")
        return []

def get_top_concerns_with_context(state_data, state_code):
    """Get top 3 concerns for a state WITH related searches showing the 'why'"""
    top_concerns = []
    
    # Sort concerns by value (highest first)
    sorted_concerns = sorted(state_data.items(), key=lambda x: x[1], reverse=True)
    
    # Get top 3
    for concern, value in sorted_concerns[:3]:
        if value > 0:  # Only get related queries if there's actual search volume
            print(f"      🔍 Getting context for '{concern}'...")
            related = get_related_queries(concern, state_code)
            time.sleep(2)  # Rate limiting
            
            top_concerns.append({
                "concern": concern,
                "value": value,
                "related_searches": related[:3] if related else []
            })
        else:
            top_concerns.append({
                "concern": concern,
                "value": value,
                "related_searches": []
            })
    
    return top_concerns

def calculate_national_averages(emotional_data, concern_data, fear_data, bullish_data):
    """Calculate national averages across all states"""
    num_states = len(emotional_data)
    
    # Emotional averages
    emotional_totals = {keyword: 0 for keyword in EMOTIONAL_KEYWORDS}
    for state_data in emotional_data.values():
        for keyword, value in state_data.items():
            emotional_totals[keyword] += value
    
    # Concern averages
    concern_totals = {keyword: 0 for keyword in CONCERN_KEYWORDS}
    for state_data in concern_data.values():
        for keyword, value in state_data.items():
            concern_totals[keyword] += value
    
    # Fear index (average of all fear keywords)
    fear_total = sum(sum(state.values()) for state in fear_data.values())
    
    # Bullish index (average of all bullish keywords)
    bullish_total = sum(sum(state.values()) for state in bullish_data.values())
    
    return {
        'national_anxiety': round(emotional_totals['anxiety'] / num_states, 1),
        'national_hope': round(emotional_totals['hope'] / num_states, 1),
        'national_stress': round(emotional_totals['stress'] / num_states, 1),
        'fear_index': round(fear_total / (num_states * len(FEAR_KEYWORDS)), 1),
        'bullish_index': round(bullish_total / (num_states * len(BULLISH_KEYWORDS)), 1),
        'top_national_concerns': sorted(
            concern_totals.items(), 
            key=lambda x: x[1], 
            reverse=True
        )[:3]
    }

def main():
    print("🔍 Connecting to Google Trends...")
    
    # Collect emotional data
    emotional_data = collect_data_by_state(EMOTIONAL_KEYWORDS, "EMOTIONAL data")
    
    # Collect economic concern data
    concern_data = collect_data_by_state(CONCERN_KEYWORDS, "ECONOMIC CONCERN data")
    
    # Collect market fear data
    fear_data = collect_data_by_state(FEAR_KEYWORDS, "MARKET FEAR indicators")
    
    # Collect bullish sentiment
    bullish_data = collect_data_by_state(BULLISH_KEYWORDS, "BULLISH sentiment")
    
    # Get top concerns per state WITH related searches context
    print("🔍 Getting top concerns with context (this will take a few minutes)...")
    top_concerns_with_context = {}
    
    for state_name, state_code in US_STATES.items():
        print(f"   📍 {state_name}...")
        state_concern_data = concern_data.get(state_name, {})
        top_concerns_with_context[state_name] = get_top_concerns_with_context(
            state_concern_data, 
            state_code
        )
    
    # Calculate national averages
    print("🌍 Calculating national averages...")
    national_stats = calculate_national_averages(emotional_data, concern_data, fear_data, bullish_data)
    
    # Combine all data
    combined_data = {}
    for state_name in US_STATES.keys():
        combined_data[state_name] = {
            **emotional_data.get(state_name, {}),
            'top_concerns': top_concerns_with_context.get(state_name, [])
        }
    
    # Create final results structure
    results = {
        'last_updated': datetime.now().isoformat(),
        'state_data': combined_data,
        'national_stats': national_stats
    }
    
    # Save to JSON
    with open('sentiment_results.json', 'w') as f:
        json.dump(results, f, indent=2)
    
    print("\n✅ COLLECTION COMPLETE!")
    print(f"   📍 States analyzed: {len(combined_data)}")
    print(f"   😰 National Anxiety: {national_stats['national_anxiety']}")
    print(f"   💚 National Hope: {national_stats['national_hope']}")
    print(f"   📉 Fear Index: {national_stats['fear_index']}")
    print(f"   📈 Bullish Index: {national_stats['bullish_index']}")
    print(f"\n🔝 TOP NATIONAL CONCERNS:")
    for concern, value in national_stats['top_national_concerns']:
        print(f"   • {concern}: {value}")
    print(f"\n💾 Data saved to: sentiment_results.json")

if __name__ == "__main__":
    main()
