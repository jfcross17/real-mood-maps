# 🌍 The Human Pulse

**Real-time global sentiment tracker for traders, analysts, and curious humans.**

See what the world is feeling—right now.

---

## What This Does

The Human Pulse synthesizes emotional sentiment from:
- **Reddit** (r/anxiety, r/jobs, r/personalfinance, r/wallstreetbets, etc.)
- **Twitter/X** (emotion keywords, financial sentiment)
- **Google Trends** (what people are searching)

And turns it into:
- **Global Anxiety Index** (0-100, updated hourly)
- **Emotion breakdown** (anxiety, stress, fear, anger, optimism, etc.)
- **Top struggles** (job security, cost of living, mental health)
- **Trending themes** (what's on people's minds)

---

## Why This Exists

**For Traders:**
- Fear & Greed Index is too simple (one number)
- Social media sentiment is noisy and unstructured
- You need **depth, granularity, and real-time data**

**The Human Pulse gives you:**
- Multi-dimensional emotions (not just fear/greed)
- Geographic breakdowns (coming in Week 2)
- Demographic filters (coming in Week 2)
- Predictive alerts (coming in Week 3)

---

## Quick Start

### 1. Get API Keys

- **Reddit:** https://www.reddit.com/prefs/apps
- **Anthropic:** https://console.anthropic.com/

### 2. Install Dependencies

```bash
pip install -r requirements.txt
```

### 3. Set Up Environment

Create `.env` file:
```
REDDIT_CLIENT_ID=your_id
REDDIT_CLIENT_SECRET=your_secret
ANTHROPIC_API_KEY=sk-ant-your_key
```

### 4. Collect Data

```bash
python reddit_collector.py
```

### 5. Analyze Sentiment

```bash
python sentiment_analyzer.py
```

### 6. View Dashboard

Open `dashboard.html` in your browser.

---

## What It Looks Like

```
🌍 GLOBAL ANXIETY INDEX

73 📈 +8 (last 4 hours)

📊 EMOTION BREAKDOWN
Anxiety:    72 ████████████████████
Stress:     68 ███████████████████
Fear:       45 ████████████
Anger:      38 ██████████
Optimism:   34 █████████

🔥 TOP STRUGGLES
1. Job insecurity (+18% mentions)
2. Cost of living (+14% mentions)
3. Climate anxiety (+11% mentions)
```

---

## Roadmap

### ✅ Week 1 (MVP)
- [x] Reddit data collection
- [x] Claude sentiment analysis
- [x] Basic dashboard
- [x] Global Anxiety Index

### 🚧 Week 2 (Launch Ready)
- [ ] Geographic breakdown (NYC, SF, London, etc.)
- [ ] Demographic filters (age, profession)
- [ ] Automated hourly updates
- [ ] API endpoint for traders

### 🎯 Week 3 (Monetize)
- [ ] Pro tier ($49/mo for traders)
- [ ] Real-time alerts
- [ ] Historical data (1-year archive)
- [ ] Market correlation view

---

## Use Cases

### For Traders
- Spot divergences (market up, anxiety rising = warning)
- Predict volatility (stress spikes → market swings)
- Front-run sentiment shifts (anxiety +20% → crash coming)

### For Researchers
- Track mental health trends
- Study emotional contagion
- Analyze crisis response

### For Curious Humans
- "How is the world feeling today?"
- "What are people stressed about?"
- "Is everyone as anxious as I am?"

---

## Cost

**Week 1 (Testing):**
- Reddit API: FREE
- Claude API: ~$3-5
- Total: **$5/week**

**Week 2 (Live):**
- Hourly updates: ~$20/week
- Storage: ~$5/week
- Total: **$25/week**

**At scale (10K users):**
- API costs: ~$500/mo
- Revenue (500 pro users × $49): ~$24,500/mo
- **Profit: ~$24K/mo**

---

## Tech Stack

- **Python** (data collection + analysis)
- **Claude API** (emotion synthesis)
- **Supabase** (database)
- **Vercel** (frontend hosting)
- **Railway** (backend cron jobs)

---

## Why This Will Work

1. **No competitor does this** (Fear & Greed is too basic)
2. **Traders pay for data** (Bloomberg costs $25K/year)
3. **Clear use case** ("I need better sentiment data")
4. **You're the target user** (trader who wants this)
5. **Fast validation** (launch in 2 weeks)

---

## Next Steps

**Week 1:**
- Run the scripts
- Generate your first Global Anxiety Index
- Share on Twitter/Reddit for feedback

**Week 2:**
- Build the API
- Add geographic breakdowns
- Launch to 100 beta traders

**Week 3:**
- Charge $49/mo
- Get to $1K MRR
- Scale from there

---

## Questions?

This is your MVP. It's scrappy. It works.

Now go build it.

🚀
