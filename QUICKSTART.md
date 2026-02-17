# Quick Start Without Reddit API

**Reddit is blocking you? No problem. Test the system with sample data first.**

---

## Step 1: Install Dependencies

```bash
pip install anthropic python-dotenv
```

(That's all you need for testing - just Claude API)

---

## Step 2: Set Up Your Anthropic API Key

Create a `.env` file:

```
ANTHROPIC_API_KEY=sk-ant-your_key_here
```

---

## Step 3: Test the Sentiment Analyzer

```bash
python sentiment_analyzer.py sample_reddit_data.json
```

This will:
- Load the 10 sample posts
- Analyze them with Claude
- Generate `sentiment_results.json`
- Print the emotional summary

**Cost:** ~$0.05 (10 posts × $0.005)

---

## Step 4: View the Dashboard

1. Open `dashboard.html` in your browser
2. You'll see:
   - Global Anxiety Index
   - Emotion breakdown
   - Top struggles

---

## What You'll See

The sample data represents real emotional patterns from Reddit:
- Job insecurity
- Financial stress
- Climate anxiety
- Work frustration
- Mental health struggles

**The Global Anxiety Index should be around 70-75** (high anxiety, low optimism)

---

## Get Reddit API Keys Later

Once Reddit unblocks you (tomorrow, different network):
1. Go to https://old.reddit.com/prefs/apps
2. Create the app
3. Run `reddit_collector.py` to get REAL data
4. Compare real data vs sample data

---

## For Now

**You can validate the entire concept with sample data:**
- ✅ Sentiment analysis works
- ✅ Dashboard visualizes results
- ✅ You understand the workflow
- ✅ You see what the output looks like

**Reddit API can wait. Test the core system first.**

---

**Run it now:**
```bash
python sentiment_analyzer.py sample_reddit_data.json
```
