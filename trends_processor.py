import json
from datetime import datetime

def process_trends_data():
    """Process Google Trends data into dashboard format"""
    
    # Load the trends data
    with open('trends_data.json', 'r') as f:
        trends = json.load(f)
    
    # Calculate average emotions across all states
    by_region = trends['by_region']
    
    total_anxiety = sum(state['anxiety'] for state in by_region.values())
    total_stress = sum(state['stress'] for state in by_region.values())
    total_depression = sum(state['depression'] for state in by_region.values())
    total_hope = sum(state['hope'] for state in by_region.values())
    total_fear = sum(state['fear'] for state in by_region.values())
    
    num_states = len(by_region)
    
    # Calculate averages (scaled to 0-100)
    avg_anxiety = (total_anxiety / num_states)
    avg_stress = (total_stress / num_states)
    avg_depression = (total_depression / num_states)
    avg_hope = (total_hope / num_states)
    avg_fear = (total_fear / num_states)
    
    # 🆕 NEW: Create state-level data for the map
    state_data = {}
    for state_name, emotions in by_region.items():
        state_data[state_name] = {
            "anxiety": emotions['anxiety'],
            "hope": emotions['hope'],
            "stress": emotions['stress'],
            "fear": emotions['fear'],
            "depression": emotions['depression']
        }
    
    # Create dashboard data structure
    dashboard_data = {
        "aggregated": {
            "emotions": {
                "anxiety": avg_anxiety,
                "stress": avg_stress,
                "fear": avg_fear,
                "anger": avg_depression,  # Using depression as anger proxy
                "sadness": avg_depression,
                "optimism": avg_hope
            },
            "top_themes": [
                {"theme": "Economic concerns", "count": int(avg_stress * 2)},
                {"theme": "Health anxiety", "count": int(avg_anxiety * 2)},
                {"theme": "Future uncertainty", "count": int(avg_fear * 2)},
                {"theme": "Work stress", "count": int(avg_stress * 1.5)},
                {"theme": "Hope for change", "count": int(avg_hope * 2)}
            ]
        },
        "state_data": state_data,  # 🆕 NEW: Add state data for the map
        "metadata": {
            "collected_at": datetime.now().isoformat(),
            "source": "Google Trends",
            "states_analyzed": num_states
        }
    }
    
    # Save processed data
    with open('sentiment_results.json', 'w') as f:
        json.dump(dashboard_data, f, indent=2)
    
    print(f"✅ Processed Google Trends data!")
    print(f"   Global Anxiety Index: {int(avg_anxiety)}")
    print(f"   Average Hope: {int(avg_hope)}")
    print(f"   📍 States with data: {num_states}")  # 🆕 NEW: Show state count
    
    return dashboard_data

if __name__ == "__main__":
    process_trends_data()
