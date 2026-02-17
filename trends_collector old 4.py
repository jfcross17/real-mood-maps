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

# Emotional keywords
EMOTIONAL_KEYWORDS = ['anxiety', 'hope', 'stress', 'fear', 'depression']

# Economic concern keywords (EXPANDED)
CONCERN_KEYWORDS = [
    'layoffs', 
    'unemployment', 
    'inflation', 
    'housing costs',
    'rent prices',
    'gas prices',
    'cost of living',
    'crime', 
    'homelessness',
    'immigration',
    'border crisis',
    'healthcare costs',
    'student debt',
    'taxes',
    'recession fears',
    'job security'
]

# Hope driver keywords (POSITIVE)
HOPE_KEYWORDS = ['good news', 'breakthrough', 'market rally', 'opportunity', 'recovery']

# Market sentiment keywords
FEAR_KEYWORDS = ['recession', 'market crash', 'economic collapse']
BULLISH_KEYWORDS = ['invest', 'buy stocks', 'market rally']

def load_previous_data():
    """Load previous sentiment results if they exist"""
    if os.path.exists('sentiment_results.json'):
        try:
            with open('sentiment_results.json', 'r') as f:
                return json.load(f)
        except Exception as e:
            print(f"   ⚠️  Could not load previous data: {e}")
            return None
    return None

def calculate_velocity(current_anxiety, previous_anxiety, time_delta_hours=1.0):
    """Calculate velocity metrics for anxiety change"""
    if previous_anxiety is None:
        return {
            'velocity': 0,
            'velocity_percent': 0.0,
            'velocity_hourly': 0.0
        }
    
    absolute_change = current_anxiety - previous_anxiety
    
    if previous_anxiety > 0:
        percent_change = round((absolute_change / previous_anxiety) * 100, 1)
    else:
        percent_change = 0.0
    
    # Normalize to hourly rate
    hourly_rate = round(absolute_change / time_delta_hours, 1)
    
    return {
        'velocity': absolute_change,
        'velocity_percent': percent_change,
        'velocity_hourly': hourly_rate
    }


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

def get_top_items_with_context(state_data, state_code, item_type="concerns"):
    """Get top 3 items (concerns or hope drivers) for a state WITH related searches"""
    top_items = []
    
    # Sort by value (highest first)
    sorted_items = sorted(state_data.items(), key=lambda x: x[1], reverse=True)
    
    # Get top 3
    for item, value in sorted_items[:3]:
        if value > 0:  # Only get related queries if there's actual search volume
            print(f"      🔍 Getting context for '{item}'...")
            related = get_related_queries(item, state_code)
            time.sleep(2)  # Rate limiting
            
            top_items.append({
                item_type[:-1]: item,  # "concern" or "hope_driver"
                "value": value,
                "related_searches": related[:3] if related else []
            })
        else:
            top_items.append({
                item_type[:-1]: item,
                "value": value,
                "related_searches": []
            })
    
    return top_items

def calculate_national_averages(emotional_data, concern_data, hope_data, fear_data, bullish_data):
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
    
    # Hope driver averages
    hope_totals = {keyword: 0 for keyword in HOPE_KEYWORDS}
    for state_data in hope_data.values():
        for keyword, value in state_data.items():
            hope_totals[keyword] += value
    
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
        )[:3],
        'top_national_hope_drivers': sorted(
            hope_totals.items(), 
            key=lambda x: x[1], 
            reverse=True
        )[:3]
    }

def main():
    print("🔍 Connecting to Google Trends...")
    print("=" * 60)
    
    # Load previous data for velocity calculations
    print("📂 Loading previous data for velocity tracking...")
    previous_results = load_previous_data()
    
    if previous_results:
        prev_timestamp = previous_results.get('last_updated')
        print(f"   ✅ Found previous data from: {prev_timestamp}")
        
        # Calculate time delta
        if prev_timestamp:
            try:
                prev_time = datetime.fromisoformat(prev_timestamp)
                current_time = datetime.now()
                time_delta_hours = (current_time - prev_time).total_seconds() / 3600
                print(f"   ⏱️  Time since last collection: {time_delta_hours:.1f} hours")
            except:
                time_delta_hours = 1.0
        else:
            time_delta_hours = 1.0
    else:
        print("   📝 No previous data - this is the first run")
        time_delta_hours = 1.0
        previous_results = {'state_data': {}}
    
    print("=" * 60)
    
    # Collect emotional data
    emotional_data = collect_data_by_state(EMOTIONAL_KEYWORDS, "EMOTIONAL data")
    
    # Collect economic concern data (NEGATIVE)
    concern_data = collect_data_by_state(CONCERN_KEYWORDS, "ECONOMIC CONCERN data")
    
    # Collect hope driver data (POSITIVE)
    hope_driver_data = collect_data_by_state(HOPE_KEYWORDS, "HOPE DRIVER data")
    
    # Collect market fear data
    fear_data = collect_data_by_state(FEAR_KEYWORDS, "MARKET FEAR indicators")
    
    # Collect bullish sentiment
    bullish_data = collect_data_by_state(BULLISH_KEYWORDS, "BULLISH sentiment")
    
    # Get top concerns per state WITH related searches context
    print("🔍 Getting top concerns with context (this will take a few minutes)...")
    top_concerns_with_context = {}
    
    for state_name, state_code in US_STATES.items():
        print(f"   📍 {state_name} - CONCERNS...")
        state_concern_data = concern_data.get(state_name, {})
        top_concerns_with_context[state_name] = get_top_items_with_context(
            state_concern_data, 
            state_code,
            "concerns"
        )
    
    # Get top hope drivers per state WITH related searches context
    print("✨ Getting hope drivers with context...")
    top_hope_with_context = {}
    
    for state_name, state_code in US_STATES.items():
        print(f"   📍 {state_name} - HOPE DRIVERS...")
        state_hope_data = hope_driver_data.get(state_name, {})
        top_hope_with_context[state_name] = get_top_items_with_context(
            state_hope_data, 
            state_code,
            "hope_drivers"
        )
    
    # Calculate national averages
    print("🌍 Calculating national averages...")
    national_stats = calculate_national_averages(
        emotional_data, 
        concern_data, 
        hope_driver_data,
        fear_data, 
        bullish_data
    )
    
    # Combine all data WITH VELOCITY
    print("🔥 Calculating velocity metrics...")
    combined_data = {}
    velocity_rankings = []  # Track states by velocity for summary
    
    for state_name in US_STATES.keys():
        # Get current anxiety
        current_anxiety = emotional_data.get(state_name, {}).get('anxiety', 0)
        
        # Get previous anxiety if it exists
        previous_state_data = previous_results.get('state_data', {}).get(state_name, {})
        previous_anxiety = previous_state_data.get('anxiety', None)
        
        # Calculate velocity
        velocity_data = calculate_velocity(current_anxiety, previous_anxiety, time_delta_hours)
        
        # Combine all data for this state
        combined_data[state_name] = {
            **emotional_data.get(state_name, {}),
            'top_concerns': top_concerns_with_context.get(state_name, []),
            'hope_drivers': top_hope_with_context.get(state_name, []),
            **velocity_data,  # Add velocity, velocity_percent, velocity_hourly
            'time_delta_hours': round(time_delta_hours, 2)
        }
        
        # Track for velocity ranking
        velocity_rankings.append((state_name, velocity_data['velocity'], current_anxiety))
    
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
    print(f"\n✨ TOP NATIONAL HOPE DRIVERS:")
    for driver, value in national_stats['top_national_hope_drivers']:
        print(f"   • {driver}: {value}")
    
    # Show velocity rankings
    print(f"\n🔥 TOP 5 VELOCITY STATES (Biggest Anxiety Changes):")
    top_velocity = sorted(velocity_rankings, key=lambda x: abs(x[1]), reverse=True)[:5]
    
    for state, velocity, anxiety in top_velocity:
        if velocity > 0:
            direction = "📈"
            arrow = "↑"
        elif velocity < 0:
            direction = "📉"
            arrow = "↓"
        else:
            direction = "➡️"
            arrow = "→"
        
        print(f"   {direction} {state}: {velocity:+d} pts {arrow} (now at {anxiety})")
    
    print(f"\n💾 Data saved to: sentiment_results.json")
    print("=" * 60)

if __name__ == "__main__":
    main()
