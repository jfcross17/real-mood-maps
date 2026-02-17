# The Human Pulse - Setup Guide

## Project Overview

**The Human Pulse** is a real-time emotional sentiment tracker that synthesizes data from Reddit, Twitter, and Google Trends to show what the world is feeling right now.

**Target Use Case:** Traders, analysts, and curious humans who want to understand collective sentiment beyond basic fear/greed indices.

---

## Quick Start (MVP - Week 1)

### Step 1: Get API Credentials

#### Reddit API
1. Go to https://www.reddit.com/prefs/apps
2. Click "Create App" or "Create Another App"
3. Fill out:
   - **Name:** The Human Pulse
   - **App type:** Script
   - **Description:** Sentiment analysis tool
   - **Redirect URI:** http://localhost:8080
4. Save your **Client ID** and **Client Secret**

#### Anthropic API
1. Go to https://console.anthropic.com/
2. Navigate to API Keys
3. Create a new key
4. Copy your API key (starts with `sk-ant-`)

#### Twitter API (Optional for MVP)
1. Go to https://developer.twitter.com/
2. Apply for Basic tier ($100/mo)
3. Get your API credentials

---

### Step 2: Install Dependencies

```bash
# Create virtual environment
python -m venv venv

# Activate it
# On Mac/Linux:
source venv/bin/activate
# On Windows:
venv\Scripts\activate

# Install requirements
pip install -r requirements.txt
```

---

### Step 3: Set Up Environment Variables

Create a `.env` file in the project root:

```bash
# Reddit API
REDDIT_CLIENT_ID=your_client_id_here
REDDIT_CLIENT_SECRET=your_client_secret_here
REDDIT_USER_AGENT=HumanPulse/1.0

# Anthropic API
ANTHROPIC_API_KEY=sk-ant-your_key_here

# Twitter API (optional)
TWITTER_API_KEY=your_twitter_key
TWITTER_API_SECRET=your_twitter_secret
TWITTER_BEARER_TOKEN=your_bearer_token
```

---

### Step 4: Collect Data

```bash
# Collect Reddit posts
python reddit_collector.py
```

This will:
- Scrape ~50 posts from each target subreddit
- Save to `reddit_data.json`
- Take ~2-3 minutes

**Cost:** FREE (Reddit API is free)

---

### Step 5: Analyze Sentiment

```bash
# Analyze collected data
python sentiment_analyzer.py
```

This will:
- Load posts from `reddit_data.json`
- Send to Claude API for emotion analysis
- Aggregate results
- Save to `sentiment_results.json`
- Print summary to console

**Cost:** ~$0.25-0.50 per run (50 posts × ~$0.005 per analysis)

---

### Step 6: View Results

Open `sentiment_results.json` to see:
- Aggregated emotion scores (0-100)
- Top themes
- Primary struggles

Example output:
```json
{
  "aggregated": {
    "emotions": {
      "anxiety": 72.3,
      "stress": 68.9,
      "fear": 45.2,
      "anger": 38.7,
      "sadness": 52.1,
      "optimism": 34.6,
      "excitement": 28.3,
      "contentment": 22.8
    },
    "top_themes": [
      {"theme": "job security", "count": 47},
      {"theme": "cost of living", "count": 39},
      {"theme": "mental health", "count": 34}
    ]
  }
}
```

---

## Week 1 Goals

✅ **Day 1-2:** Set up APIs, collect first batch of Reddit data  
✅ **Day 3-4:** Test sentiment analysis, refine prompts  
✅ **Day 5-6:** Add Google Trends integration  
✅ **Day 7:** Run full pipeline, generate first "Global Anxiety Index"

---

## Cost Estimates (Week 1)

| Service | Usage | Cost |
|---------|-------|------|
| Reddit API | Unlimited | FREE |
| Claude API | ~500 analyses | $2.50 |
| Google Trends | Unlimited | FREE |
| **Total** | | **~$3** |

---

## Next Steps (Week 2)

Week 2 will focus on:
1. Building the web dashboard
2. Automating data collection (run every hour)
3. Adding geographic/demographic breakdowns
4. Launching to traders on Twitter/Reddit

---

## Troubleshooting

### "praw.exceptions.ResponseException: received 401 HTTP response"
- Check your Reddit credentials in `.env`
- Make sure you're using the **client ID** and **secret**, not password

### "anthropic.APIError: Invalid API key"
- Verify your Anthropic API key starts with `sk-ant-`
- Check it's properly set in `.env`

### "No posts collected"
- Reddit API might be rate-limited
- Try running again in 5-10 minutes

---

## Project Structure

```
human-pulse/
├── reddit_collector.py      # Scrapes Reddit posts
├── sentiment_analyzer.py    # Analyzes emotions with Claude
├── requirements.txt         # Python dependencies
├── .env                     # API credentials (DO NOT COMMIT)
├── reddit_data.json         # Collected posts (generated)
└── sentiment_results.json   # Analysis results (generated)
```

---

## Security Notes

⚠️ **NEVER commit your `.env` file to GitHub**

Add to `.gitignore`:
```
.env
*.json
venv/
__pycache__/
```

---

## Questions?

This is your MVP. It's scrappy. It works.

Week 1 = prove the concept.  
Week 2 = build the dashboard.  
Week 3 = launch to the world.

Let's go. 🚀
