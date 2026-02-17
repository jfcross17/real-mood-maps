"""
Event Pattern Analyzer for Panic Atlas
Analyzes collected historical event data to identify panic patterns

Usage:
    python event_analyzer.py
"""

import json
import os
from datetime import datetime

class EventAnalyzer:
    """Analyzes historical event data for panic patterns"""
    
    def __init__(self):
        self.panic_threshold = 70
        self.min_states_required = 12
        self.min_regions_required = 3
        
    def load_event_data(self, event_name):
        """Load event data from JSON file"""
        filename = f'backtest_data/{event_name}_data.json'
        if not os.path.exists(filename):
            raise FileNotFoundError(f"Event data not found: {filename}")
        
        with open(filename, 'r') as f:
            return json.load(f)
    
    def check_panic_signature(self, event_data):
        """
        Check if event matches the Panic Signature criteria
        
        Returns:
            dict with signature match results
        """
        summary = event_data['summary']
        
        # Criteria 1: State Count (12+ states above threshold)
        states_count = summary['states_above_threshold']
        criterion_1 = states_count >= self.min_states_required
        
        # Criteria 2: Regional Spread (3+ regions affected)
        regions_count = summary['total_regions_affected']
        criterion_2 = regions_count >= self.min_regions_required
        
        # Criteria 3: Major States Present (CA or NY in top 10)
        top_states = [s['state'] for s in summary['top_10_states']]
        has_major_state = 'California' in top_states or 'New York' in top_states
        criterion_3 = has_major_state
        
        # Overall signature match
        criteria_met = sum([criterion_1, criterion_2, criterion_3])
        
        if criteria_met == 3:
            signal_strength = 'STRONG'
        elif criteria_met == 2:
            signal_strength = 'MEDIUM'
        else:
            signal_strength = 'WEAK'
        
        return {
            'signature_detected': criteria_met >= 2,
            'signal_strength': signal_strength,
            'criteria_met': criteria_met,
            'criteria': {
                'state_count': {
                    'value': states_count,
                    'required': self.min_states_required,
                    'met': criterion_1
                },
                'regional_spread': {
                    'value': regions_count,
                    'required': self.min_regions_required,
                    'met': criterion_2
                },
                'major_states': {
                    'present': has_major_state,
                    'met': criterion_3,
                    'top_states': top_states[:3]
                }
            }
        }
    
    def analyze_single_event(self, event_name):
        """Analyze a single event and return findings"""
        print(f"\n{'='*70}")
        print(f"ANALYZING: {event_name}")
        print('='*70)
        
        # Load data
        event_data = self.load_event_data(event_name)
        
        # Basic info
        print(f"\nEvent Date: {event_data['event_date']}")
        print(f"Analysis Window: {event_data['analysis_window']['start_date']} to {event_data['analysis_window']['end_date']}")
        
        # Summary stats
        summary = event_data['summary']
        print(f"\n📊 Summary Statistics:")
        print(f"   States Above Threshold ({self.panic_threshold}%): {summary['states_above_threshold']}")
        print(f"   Regions Affected: {summary['total_regions_affected']}/5")
        
        print(f"\n🔝 Top 5 Panicking States:")
        for i, state_data in enumerate(summary['top_10_states'][:5], 1):
            print(f"   {i}. {state_data['state']}: {state_data['panic_score']:.1f}")
        
        print(f"\n🌎 Affected Regions:")
        for region in summary['regions_affected']:
            print(f"   • {region}")
        
        # Check panic signature
        signature = self.check_panic_signature(event_data)
        
        print(f"\n🎯 PANIC SIGNATURE ANALYSIS:")
        print(f"   Signal Strength: {signature['signal_strength']}")
        print(f"   Criteria Met: {signature['criteria_met']}/3")
        
        print(f"\n   ✓/✗ State Count: {'✓' if signature['criteria']['state_count']['met'] else '✗'}")
        print(f"       {signature['criteria']['state_count']['value']} states (need {signature['criteria']['state_count']['required']})")
        
        print(f"\n   ✓/✗ Regional Spread: {'✓' if signature['criteria']['regional_spread']['met'] else '✗'}")
        print(f"       {signature['criteria']['regional_spread']['value']} regions (need {signature['criteria']['regional_spread']['required']})")
        
        print(f"\n   ✓/✗ Major States: {'✓' if signature['criteria']['major_states']['met'] else '✗'}")
        print(f"       CA/NY present: {signature['criteria']['major_states']['present']}")
        print(f"       Top 3: {', '.join(signature['criteria']['major_states']['top_states'])}")
        
        if signature['signature_detected']:
            print(f"\n✅ PATTERN DETECTED - Would trigger {signature['signal_strength']} signal")
        else:
            print(f"\n❌ PATTERN NOT DETECTED - No tradeable signal")
        
        print('='*70)
        
        return signature
    
    def analyze_all_events(self):
        """Analyze all collected events and generate summary report"""
        print("\n" + "="*70)
        print("ANALYZING ALL COLLECTED EVENTS")
        print("="*70)
        
        # Get list of event files
        backtest_dir = 'backtest_data'
        if not os.path.exists(backtest_dir):
            print(f"\n❌ No backtest data found. Run backtest_data_collector.py first.")
            return
        
        event_files = [f for f in os.listdir(backtest_dir) if f.endswith('_data.json')]
        
        if not event_files:
            print(f"\n❌ No event data files found in {backtest_dir}/")
            return
        
        print(f"\nFound {len(event_files)} events to analyze\n")
        
        results = []
        
        for filename in sorted(event_files):
            event_name = filename.replace('_data.json', '')
            
            try:
                signature = self.analyze_single_event(event_name)
                
                results.append({
                    'event_name': event_name,
                    'signature_detected': signature['signature_detected'],
                    'signal_strength': signature['signal_strength'],
                    'criteria_met': signature['criteria_met']
                })
                
            except Exception as e:
                print(f"\n❌ Error analyzing {event_name}: {e}")
                continue
        
        # Generate summary report
        print("\n" + "="*70)
        print("SUMMARY REPORT")
        print("="*70)
        
        total_events = len(results)
        events_with_pattern = sum(1 for r in results if r['signature_detected'])
        strong_signals = sum(1 for r in results if r['signal_strength'] == 'STRONG')
        medium_signals = sum(1 for r in results if r['signal_strength'] == 'MEDIUM')
        weak_signals = sum(1 for r in results if r['signal_strength'] == 'WEAK')
        
        detection_rate = (events_with_pattern / total_events * 100) if total_events > 0 else 0
        
        print(f"\n📊 Overall Statistics:")
        print(f"   Total Events Analyzed: {total_events}")
        print(f"   Pattern Detected: {events_with_pattern}/{total_events} ({detection_rate:.1f}%)")
        print(f"   STRONG Signals: {strong_signals}")
        print(f"   MEDIUM Signals: {medium_signals}")
        print(f"   WEAK Signals: {weak_signals}")
        
        print(f"\n✅ Events WITH Pattern:")
        for r in results:
            if r['signature_detected']:
                print(f"   [{r['signal_strength']}] {r['event_name']}")
        
        print(f"\n❌ Events WITHOUT Pattern:")
        for r in results:
            if not r['signature_detected']:
                print(f"   {r['event_name']}")
        
        # Save summary report
        report = {
            'analysis_date': datetime.now().isoformat(),
            'total_events': total_events,
            'pattern_detection_rate': detection_rate,
            'signal_distribution': {
                'STRONG': strong_signals,
                'MEDIUM': medium_signals,
                'WEAK': weak_signals
            },
            'events': results
        }
        
        report_file = 'backtest_data/summary_report.json'
        with open(report_file, 'w') as f:
            json.dump(report, f, indent=2)
        
        print(f"\n💾 Summary report saved to: {report_file}")
        print("="*70)
        
        # Determine scenario
        if detection_rate >= 70:
            print(f"\n🎯 RESULT: SCENARIO 1 (STRONG) - {detection_rate:.1f}% detection rate")
            print("   ✅ System is valid and tradeable")
            print("   ✅ Pattern is reliable predictor")
            print("   ✅ Ready for marketing and launch")
        elif detection_rate >= 50:
            print(f"\n⚠️  RESULT: SCENARIO 2 (MODERATE) - {detection_rate:.1f}% detection rate")
            print("   ⚠️  System works but needs refinement")
            print("   ⚠️  Consider combining with other indicators")
            print("   ⚠️  6-12 months additional development recommended")
        else:
            print(f"\n❌ RESULT: SCENARIO 3 (WEAK) - {detection_rate:.1f}% detection rate")
            print("   ❌ Core hypothesis doesn't hold with this data")
            print("   ❌ Consider pivot or better data sources")
            print("   ❌ Re-evaluate methodology")
        
        print("\n")


def main():
    """Main function"""
    analyzer = EventAnalyzer()
    
    print("\n" + "="*70)
    print("PANIC ATLAS - EVENT PATTERN ANALYZER")
    print("="*70)
    
    print("\nOptions:")
    print("1. Analyze SINGLE event")
    print("2. Analyze ALL events (generate report)")
    
    choice = input("\nEnter choice (1 or 2): ").strip()
    
    if choice == '1':
        event_name = input("\nEnter event name (e.g., SVB_Collapse): ").strip()
        try:
            analyzer.analyze_single_event(event_name)
        except FileNotFoundError as e:
            print(f"\n❌ {e}")
    
    elif choice == '2':
        analyzer.analyze_all_events()
    
    else:
        print("Invalid choice. Exiting.")


if __name__ == "__main__":
    main()
