"""
Backtest Data Collector for Panic Atlas
Collects HISTORICAL Google Trends data for specific past events
Based on trends_collector.py but modified for backtesting

Usage:
    python backtest_data_collector.py
"""

from pytrends.request import TrendReq
import json
import time
import os
from datetime import datetime, timedelta

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

# Keywords for backtesting (matching the strategy)
BACKTEST_KEYWORDS = [
    'recession',
    'stock market crash',
    'should I sell stocks',
    'layoffs',
    'unemployment',
    'market crash',
    'financial crisis'
]

def collect_historical_data_by_state(keywords, start_date, end_date, description):
    """
    Collect trend data for SPECIFIC HISTORICAL DATE RANGE across all states
    
    Args:
        keywords: List of search terms
        start_date: Start date (YYYY-MM-DD format)
        end_date: End date (YYYY-MM-DD format)
        description: Description for logging
    
    Returns:
        Dictionary with state-level data
    """
    print(f"📊 Collecting {description} by state...")
    print(f"   Date range: {start_date} to {end_date}")
    state_data = {}
    
    # Create timeframe string for Google Trends
    timeframe = f'{start_date} {end_date}'
    
    for state_name, state_code in US_STATES.items():
        try:
            pytrends.build_payload(keywords, timeframe=timeframe, geo=state_code)
            data = pytrends.interest_over_time()
            
            if not data.empty:
                # Calculate average for each keyword over the date range
                state_data[state_name] = {
                    keyword: int(data[keyword].mean()) 
                    for keyword in keywords if keyword in data.columns
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


def get_historical_related_queries(keyword, state_code, start_date, end_date):
    """
    Get related queries for SPECIFIC HISTORICAL DATE RANGE
    
    Args:
        keyword: Search term
        state_code: US state code (e.g., 'US-CA')
        start_date: Start date (YYYY-MM-DD)
        end_date: End date (YYYY-MM-DD)
    
    Returns:
        List of related search terms
    """
    try:
        timeframe = f'{start_date} {end_date}'
        pytrends.build_payload([keyword], timeframe=timeframe, geo=state_code)
        related = pytrends.related_queries()
        
        if related and keyword in related:
            rising = related[keyword]['rising']
            if rising is not None and not rising.empty:
                top_rising = rising.head(3)['query'].tolist()
                return top_rising
        
        return []
    except Exception as e:
        print(f"      ⚠️ Error getting related queries: {e}")
        return []


def collect_event_data(event_name, event_date, days_before=7):
    """
    Collect complete data for a SPECIFIC HISTORICAL EVENT
    
    Args:
        event_name: Name of event (e.g., "SVB_Collapse")
        event_date: Date of event (YYYY-MM-DD format)
        days_before: How many days before event to collect
    
    Returns:
        Dictionary with complete event data
    """
    print("\n" + "=" * 70)
    print(f"📍 COLLECTING HISTORICAL DATA FOR: {event_name}")
    print("=" * 70)
    
    # Calculate date range
    event_dt = datetime.strptime(event_date, '%Y-%m-%d')
    start_dt = event_dt - timedelta(days=days_before)
    
    start_date = start_dt.strftime('%Y-%m-%d')
    end_date = event_date
    
    print(f"Event Date: {event_date}")
    print(f"Analysis Window: {start_date} to {end_date} ({days_before} days)")
    print("=" * 70 + "\n")
    
    # Collect keyword data
    print("Phase 1: Collecting keyword search data...")
    keyword_data = collect_historical_data_by_state(
        BACKTEST_KEYWORDS, 
        start_date, 
        end_date,
        f"{event_name} keywords"
    )
    
    # Calculate panic scores for each state
    print("\nPhase 2: Calculating panic scores...")
    state_panic_scores = {}
    
    for state_name, data in keyword_data.items():
        # Simple panic score: average of all keywords
        values = [v for v in data.values() if v > 0]
        if values:
            panic_score = sum(values) / len(values)
        else:
            panic_score = 0
        
        state_panic_scores[state_name] = {
            'panic_score': round(panic_score, 1),
            'keyword_data': data
        }
    
    # Identify top panicking states
    sorted_states = sorted(
        state_panic_scores.items(), 
        key=lambda x: x[1]['panic_score'], 
        reverse=True
    )
    
    top_10_states = sorted_states[:10]
    
    print("\n📈 Top 10 Panicking States:")
    for rank, (state, data) in enumerate(top_10_states, 1):
        print(f"   {rank}. {state}: {data['panic_score']:.1f}")
    
    # Count states above panic threshold
    panic_threshold = 70
    states_above_threshold = [
        state for state, data in state_panic_scores.items() 
        if data['panic_score'] >= panic_threshold
    ]
    
    print(f"\n🚨 States Above {panic_threshold}% Panic Threshold: {len(states_above_threshold)}")
    if states_above_threshold:
        for state in states_above_threshold[:5]:  # Show first 5
            print(f"   • {state}")
    
    # Determine regional spread
    regions = {
        'Northeast': ['New York', 'Pennsylvania', 'Massachusetts', 'New Jersey', 'Connecticut', 
                     'Rhode Island', 'Vermont', 'New Hampshire', 'Maine'],
        'Southeast': ['Florida', 'Georgia', 'North Carolina', 'South Carolina', 'Virginia', 
                     'West Virginia', 'Kentucky', 'Tennessee', 'Alabama', 'Mississippi', 'Louisiana'],
        'Midwest': ['Ohio', 'Illinois', 'Michigan', 'Indiana', 'Wisconsin', 'Minnesota', 
                   'Iowa', 'Missouri', 'North Dakota', 'South Dakota', 'Nebraska', 'Kansas'],
        'Southwest': ['Texas', 'Arizona', 'New Mexico', 'Oklahoma', 'Arkansas'],
        'West': ['California', 'Washington', 'Oregon', 'Nevada', 'Idaho', 'Montana', 
                'Wyoming', 'Utah', 'Colorado', 'Alaska', 'Hawaii']
    }
    
    affected_regions = []
    for region, states in regions.items():
        region_panic = [
            state_panic_scores[state]['panic_score'] 
            for state in states 
            if state in state_panic_scores and state_panic_scores[state]['panic_score'] >= panic_threshold
        ]
        if region_panic:
            affected_regions.append(region)
    
    print(f"\n🌎 Regions Affected: {len(affected_regions)}/5")
    for region in affected_regions:
        print(f"   • {region}")
    
    # Create final results structure
    results = {
        'event_name': event_name,
        'event_date': event_date,
        'analysis_window': {
            'start_date': start_date,
            'end_date': end_date,
            'days_before': days_before
        },
        'collection_timestamp': datetime.now().isoformat(),
        'state_data': state_panic_scores,
        'summary': {
            'states_above_threshold': len(states_above_threshold),
            'threshold_used': panic_threshold,
            'top_10_states': [
                {'state': state, 'panic_score': data['panic_score']} 
                for state, data in top_10_states
            ],
            'regions_affected': affected_regions,
            'total_regions_affected': len(affected_regions)
        }
    }
    
    # Save to file
    output_dir = 'backtest_data'
    os.makedirs(output_dir, exist_ok=True)
    
    filename = f'{output_dir}/{event_name}_data.json'
    with open(filename, 'w') as f:
        json.dump(results, f, indent=2)
    
    print(f"\n💾 Data saved to: {filename}")
    print("=" * 70 + "\n")
    
    return results


# List of events to backtest
EVENTS = [
    # 2020
    {'name': 'COVID_Crash_Start', 'date': '2020-02-24'},
    {'name': 'Circuit_Breaker_1', 'date': '2020-03-09'},
    {'name': 'Circuit_Breaker_2', 'date': '2020-03-12'},
    {'name': 'Black_Monday_2020', 'date': '2020-03-16'},
    {'name': 'Election_Night_2020', 'date': '2020-11-03'},
    
    # 2021
    {'name': 'GameStop_Mania', 'date': '2021-01-27'},
    {'name': 'Tech_Correction', 'date': '2021-02-25'},
    {'name': 'Inflation_Shock', 'date': '2021-05-12'},
    {'name': 'Omicron_Variant', 'date': '2021-11-26'},
    
    # 2022
    {'name': 'Russia_Ukraine', 'date': '2022-02-24'},
    {'name': 'Fed_75bps_Shock', 'date': '2022-06-13'},
    {'name': 'Jackson_Hole_Crash', 'date': '2022-08-26'},
    {'name': 'CPI_Disaster', 'date': '2022-09-13'},
    {'name': 'FTX_Implosion', 'date': '2022-11-09'},
    
    # 2023
    {'name': 'SVB_Collapse', 'date': '2023-03-10'},
    {'name': 'Banking_Contagion', 'date': '2023-03-13'},
    {'name': 'First_Republic_Seized', 'date': '2023-05-01'},
    {'name': 'Fitch_Downgrade', 'date': '2023-08-01'},
    
    # 2024
    {'name': 'Yen_Carry_Unwind', 'date': '2024-08-05'},
    {'name': 'Election_Volatility_2024', 'date': '2024-11-05'},
]


def main():
    """
    Main function to collect data for all events
    """
    print("\n" + "=" * 70)
    print("PANIC ATLAS - HISTORICAL BACKTEST DATA COLLECTION")
    print("=" * 70)
    print(f"\nTotal Events to Analyze: {len(EVENTS)}")
    print("Keywords Tracked:", ', '.join(BACKTEST_KEYWORDS))
    print("\nEstimated Time: ~2-3 hours for all events")
    print("(Can be interrupted and resumed - progress is saved per event)")
    print("=" * 70)
    
    # Ask which events to collect
    print("\nOptions:")
    print("1. Collect SINGLE event (test run)")
    print("2. Collect ALL events (full backtest)")
    print("3. Collect specific date range")
    
    choice = input("\nEnter choice (1, 2, or 3): ").strip()
    
    if choice == '1':
        # Single event for testing
        print("\nTest Event: SVB_Collapse (March 10, 2023)")
        collect_event_data('SVB_Collapse', '2023-03-10', days_before=7)
        
    elif choice == '2':
        # All events
        print(f"\nCollecting data for ALL {len(EVENTS)} events...")
        print("This will take 2-3 hours. You can stop anytime (Ctrl+C).")
        input("\nPress ENTER to start...")
        
        for i, event in enumerate(EVENTS, 1):
            print(f"\n[Event {i}/{len(EVENTS)}]")
            try:
                collect_event_data(event['name'], event['date'], days_before=7)
                time.sleep(10)  # Pause between events to avoid rate limiting
            except KeyboardInterrupt:
                print("\n\n⚠️ Collection interrupted by user")
                print(f"Progress: {i-1}/{len(EVENTS)} events completed")
                print("You can resume by running this script again")
                break
            except Exception as e:
                print(f"\n❌ Error collecting {event['name']}: {e}")
                print("Continuing to next event...")
                continue
        
        print("\n" + "=" * 70)
        print("✅ DATA COLLECTION COMPLETE")
        print(f"Files saved in: backtest_data/")
        print("=" * 70)
        
    elif choice == '3':
        # Custom event
        print("\nCustom Event Collection")
        event_name = input("Event name (e.g., Custom_Event): ").strip()
        event_date = input("Event date (YYYY-MM-DD): ").strip()
        days = input("Days before event to analyze (default 7): ").strip()
        days_before = int(days) if days else 7
        
        collect_event_data(event_name, event_date, days_before)
    
    else:
        print("Invalid choice. Exiting.")


if __name__ == "__main__":
    main()
