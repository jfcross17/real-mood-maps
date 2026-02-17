# PANIC ATLAS - BACKTEST QUICKSTART GUIDE

## What You're About to Do

Test whether multi-state panic patterns in Google search data preceded 20 major market crashes (2020-2024).

**Goal:** Prove (or disprove) that your current dashboard system would have predicted these events 24-72 hours early.

---

## Prerequisites

✅ You already have:
- Python installed (you're running `trends_collector.py` for your live dashboard)
- Required libraries installed (`pytrends`, etc.)
- Working directory: `C:\Users\trepr\Desktop\MVP\human-pulse`

✅ What's new:
- Two new scripts for historical analysis
- Will NOT affect your existing dashboard

---

## Quick Start (Test Run)

### Step 1: Copy the New Files

Save these 2 new files to your `human-pulse` folder:
- `backtest_data_collector.py` - Collects historical data
- `event_analyzer.py` - Analyzes the patterns

### Step 2: Test with ONE Event (SVB)

Open Command Prompt in your `human-pulse` folder:

```bash
cd C:\Users\trepr\Desktop\MVP\human-pulse
python backtest_data_collector.py
```

When prompted, choose option **1** (single event test).

**What happens:**
- Collects Google Trends data for March 3-10, 2023 (week before SVB collapse)
- Takes ~30 minutes (50 states × 7 keywords)
- Creates: `backtest_data/SVB_Collapse_data.json`

### Step 3: Analyze the SVB Event

```bash
python event_analyzer.py
```

Choose option **1** (analyze single event).
Enter: `SVB_Collapse`

**What you'll see:**
- Did panic spike before March 10?
- Which states panicked first?
- Did it match the "Panic Signature"?
- Would it have triggered a trading signal?

---

## What Each Script Does

### `backtest_data_collector.py`

**Purpose:** Collects historical Google Trends data for specific past dates.

**Different from your current `trends_collector.py`:**
- Your current script: `timeframe='now 7-d'` (last 7 days from today)
- This script: `timeframe='2023-03-03 2023-03-10'` (specific past dates)

**Output:**
- `backtest_data/` folder with JSON files for each event
- Each file contains state-by-state panic scores for that event's week

### `event_analyzer.py`

**Purpose:** Analyzes collected event data to find patterns.

**What it checks:**
1. **State Count:** Did 12+ states panic?
2. **Regional Spread:** Were 3+ regions affected?
3. **Major States:** Was CA or NY in top 3?

**Output:**
- Pattern detected? (YES/NO)
- Signal strength (STRONG/MEDIUM/WEAK)
- Summary report with detection rate across all events

---

## Full Backtest (After Testing SVB)

Once SVB test works, run the full backtest:

### Step 1: Collect All 20 Events

```bash
python backtest_data_collector.py
```

Choose option **2** (all events).

**Warning:** This takes 2-3 hours.
- Can interrupt anytime (Ctrl+C)
- Progress is saved per event
- Can resume later

### Step 2: Analyze All Events

```bash
python event_analyzer.py
```

Choose option **2** (analyze all).

**Output:**
- `backtest_data/summary_report.json`
- Detection rate percentage
- List of events with/without pattern
- SCENARIO determination (Strong/Moderate/Weak)

---

## Understanding Results

### Scenario 1: STRONG (70%+ detection rate)
✅ Pattern appeared in 14+ of 20 events
✅ System is valid and tradeable
✅ Ready to market and launch

**Next steps:**
- Build marketing materials around the proof
- Add live signals to dashboard
- Launch subscription product

### Scenario 2: MODERATE (50-69% detection rate)
⚠️ Pattern appeared in 10-13 of 20 events
⚠️ Works but needs refinement
⚠️ Combine with other indicators

**Next steps:**
- Add VIX filter, momentum confirmation
- Rebuild as "sentiment intelligence" (not sole signal)
- 6-12 months more development

### Scenario 3: WEAK (<50% detection rate)
❌ Pattern appeared in <10 of 20 events
❌ Core hypothesis doesn't hold
❌ Need different approach

**Next steps:**
- Pivot to general dashboard (not trading)
- Partner with better data providers
- Publish findings as research

---

## The 20 Events Being Tested

### 2020 (5 events)
- COVID_Crash_Start (Feb 24)
- Circuit_Breaker_1 (Mar 9)
- Circuit_Breaker_2 (Mar 12)
- Black_Monday_2020 (Mar 16)
- Election_Night_2020 (Nov 3)

### 2021 (4 events)
- GameStop_Mania (Jan 27)
- Tech_Correction (Feb 25)
- Inflation_Shock (May 12)
- Omicron_Variant (Nov 26)

### 2022 (5 events)
- Russia_Ukraine (Feb 24)
- Fed_75bps_Shock (Jun 13)
- Jackson_Hole_Crash (Aug 26)
- CPI_Disaster (Sep 13)
- FTX_Implosion (Nov 9)

### 2023 (4 events)
- SVB_Collapse (Mar 10)
- Banking_Contagion (Mar 13)
- First_Republic_Seized (May 1)
- Fitch_Downgrade (Aug 1)

### 2024 (2 events)
- Yen_Carry_Unwind (Aug 5)
- Election_Volatility_2024 (Nov 5)

---

## Troubleshooting

### "Google returned response code 429"
- You hit rate limit (too many requests)
- Wait 1-2 hours
- Script can be resumed (progress saved)

### "Event data not found"
- Make sure you ran `backtest_data_collector.py` first
- Check that `backtest_data/` folder was created
- Event names are case-sensitive (e.g., `SVB_Collapse` not `svb_collapse`)

### "No module named pytrends"
- You need to install: `pip install pytrends`
- But you already have this (your live dashboard uses it)

---

## Files Created

After running the backtest:

```
C:\Users\trepr\Desktop\MVP\human-pulse\
├── (your existing files - unchanged)
├── backtest_data_collector.py       (NEW)
├── event_analyzer.py                (NEW)
└── backtest_data\                   (NEW FOLDER)
    ├── SVB_Collapse_data.json
    ├── COVID_Crash_Start_data.json
    ├── ... (one per event)
    └── summary_report.json
```

**Your existing dashboard is NOT affected.**

---

## Timeline

**Week 1 (This Week):**
- Day 1: Test SVB event (30 mins)
- Day 2-3: Collect all 20 events (2-3 hours total)
- Day 4: Analyze results

**Week 2 (If Results are Strong):**
- Create marketing materials
- Design live signal integration
- Plan product launch

**Week 2 (If Results are Moderate):**
- Refine methodology
- Add additional filters
- Consider hybrid approach

---

## What Success Looks Like

Opening `backtest_data/summary_report.json` shows:

```json
{
  "pattern_detection_rate": 75.0,
  "total_events": 20,
  "signal_distribution": {
    "STRONG": 12,
    "MEDIUM": 3,
    "WEAK": 5
  }
}
```

**Translation:** 75% detection rate = STRONG result = Launch ready

---

## Questions?

**"Will this break my current dashboard?"**
No. These are separate scripts that create a new `backtest_data/` folder.

**"Can I test just one event first?"**
Yes. Choose option 1 when running `backtest_data_collector.py`.

**"How long does the full backtest take?"**
2-3 hours for data collection. Analysis takes ~5 minutes.

**"What if I get rate limited?"**
Wait 1-2 hours, resume script. Progress is saved.

**"What if results are bad?"**
You learned something valuable. Pivot strategy based on findings.

---

## Ready to Start?

1. Copy `backtest_data_collector.py` and `event_analyzer.py` to your `human-pulse` folder
2. Run: `python backtest_data_collector.py`
3. Choose option 1 (SVB test)
4. Wait 30 minutes
5. Run: `python event_analyzer.py`
6. See if pattern exists

**Then decide:** Full backtest or pivot?

Good luck. 🚀
