/goal Implement a homepage redesign and a new story detail page for The National Pulse (nationalpulse.io). A reference HTML mockup is attached — match its visual design, typography, color palette, and component structure exactly, adapting to the existing Next.js + Tailwind setup in this repo.

## Repo context (already established — do not re-audit)
- Working directory: `C:\Users\trepr\Desktop\MVP\human-pulse\web` (the Next.js app lives inside the human-pulse repo under `web/`)
- Framework: Next.js 14, TypeScript, Tailwind CSS, App Router
- Deployed to Vercel at nationalpulse.io / realmoodmaps.com
- GitHub: jfcross17/real-mood-maps
- Already installed: @supabase/supabase-js, @supabase/ssr, stripe, d3, topojson-client
- Assets already in place: `web/public/us-states.json` (TopoJSON atlas), backtest PNGs in `web/public/proof/`
- Python backend (data collection, sentiment analysis) lives one level up in `human-pulse/` and is NOT touched in this task

## Reference file
- `national-pulse-v2.html` (in the repo root or wherever you placed it) — full homepage mockup

## Brand + positioning
- Product: The National Pulse · "A weekly reading of the American mood"
- Buyer: political consultants, campaign strategists, policy teams at $99–299/mo
- Parent: A Gap Report Product · The In App LLC
- Aesthetic: Bloomberg/Morning Consult credibility with editorial Pudding-style personality. NOT a wellness app, NOT a hobby project.

## Step 1 — Quick orientation (5 minutes max)
Before touching code:
1. `ls web/app` (or `web/src/app`) to confirm App Router structure and current route layout
2. Read `web/app/page.tsx` (or equivalent) to see what the current homepage does
3. Read `web/tailwind.config.ts` and any global CSS to understand current theme tokens
4. Report what you found in ≤10 lines, then proceed to Step 2 without waiting for approval

## Step 2 — Implement the homepage
Replace the current homepage. Match `national-pulse-v2.html` exactly for:

**Typography** (load via `next/font/google` in root layout):
- Fraunces — display, variable, italic + soft contrast axes. Use `opsz: 144` for large headlines, `opsz: 24-36` for italic body, `SOFT: 30-80` axis for character
- Inter — sans body and UI (400/500/600/700)
- JetBrains Mono — labels, timestamps, data values (400/500/600)

**Color palette** (add to `tailwind.config.ts`):
```
bg:           #0f1117
bg-warm:      #15161e
bg-elevated:  #1a1c26
bg-card:      #1f2230
border:       #2a2d3d
border-strong:#3a3e52
text:         #f0ebe0
text-muted:   #968f80
text-dim:     #5e5849
accent:       #e8a04a   (amber — primary brand)
accent-warm:  #d97757
accent-cool:  #6ba292
red-1..5:     #2a1d1a → #4a261f → #7a3528 → #a84432 → #d65838   (sequential choropleth scale)
green:        #6ba292
```

**Sections in order**:
1. Sticky topbar — logomark + "The National Pulse" wordmark in Fraunces italic + issue number "№ 142 / May 2026" + nav + live timestamp + CTA pill button
2. Editorial masthead — meta strip with issue/volume/date, big italic headline ("The country is uneasy, *not unraveling*."), italic Fraunces dek, mono byline
3. Hero strip — 3-column card (Anxiety Index 7/10 + sparkline + 7-day delta, Market Sentiment +1 with detail line, Today's Movers list)
4. Section header "§ 01 — The Emotional Map of *America*"
5. **Emotional Map of America** — USE THE EXISTING TOPOJSON at `/us-states.json` with d3-geo to render a real choropleth (not the hand-drawn paths in the mockup). Sequential red scale based on anxiety value. Tab switcher (Anxiety / Hope / Anxiety vs. Hope / Stress / Depression) above the map. Hover tooltip showing state name, emotion, value. Legend bar below.
6. Right sidebar — Emotion Breakdown (5 horizontal progress bars: Anxiety/Stress/Hope/Fear/Depression with color coding hot/calm/warn), What People Are Struggling With (top 4 search themes with detail copy and percentages in Fraunces display numerals)
7. Section header "§ 02 — Most Anxious & Most *Hopeful*"
8. Two ranking cards side by side, Roman numerals (i. ii. iii.) in italic Fraunces, with delta arrows
9. Section header "§ 03 — This Week, We're *Watching*"
10. Three-card story grid — gradient cover blocks with inline SVG art, meta line (№ 142.a/b/c), Fraunces italic-accent titles, italic deks. Cards link to `/stories/[slug]` routes.
11. Weekly Brief CTA — split section, editorial headline, email capture, three credibility stats (2.4M / 50 / 142) with big italic Fraunces numerals
12. Footer — 4 columns, publication-style with "The Paper / Methodology / The Desk" headings, last line includes "© 2026 The In App LLC · A Gap Report Product"

**Component structure** (suggested — put in `web/components/`):
- `TopBar.tsx`, `Masthead.tsx`, `HeroStrip.tsx` (with `Sparkline.tsx`), `EmotionalMap.tsx` (uses d3-geo + topojson), `MapTooltip.tsx`, `EmotionBreakdown.tsx`, `StruggleList.tsx`, `RankingList.tsx`, `StoryCard.tsx`, `StoryGrid.tsx`, `WeeklyBrief.tsx`, `SiteFooter.tsx`

**Data**: Hardcode mockup values in `web/lib/pulseData.ts` with TypeScript types. Don't wire to Supabase or Python backend yet.

**Details that matter**:
- Paper-grain SVG overlay at 2.5% opacity, fixed position, pointer-events none (copy the inline SVG noise filter from the mockup)
- Pulse animation on the live indicator dot
- Hover states on map paths (brightness 1.2, opacity 0.85)
- Mobile breakpoint at 1024px: single column, stack hero cells, single-column story grid

## Step 3 — Story detail page
Route: `web/app/stories/[slug]/page.tsx`
First story: slug `florida-is-cooking`

Design from the same aesthetic primitives. Spec:
- Same TopBar and SiteFooter as homepage
- **Story hero**: full-width band with meta strip (Issue № 142.a · Reported by The Pulse Desk · May 20, 2026 · 4 min read), huge Fraunces italic title with accent on key word, italic Fraunces dek, byline
- **Featured visual**: Florida-only sparkline showing the state's 90-day anxiety trend vs. national average. Use Recharts (install if not present, flag to user). Florida line in red-5, national in muted gray, with a vertical marker on "today" annotated with the +4 jump.
- **Body**: max-width ~720px centered, Fraunces opsz: 18 regular weight for body, generous line height (1.7), drop-cap on first paragraph (Fraunces 72pt italic accent color, float left)
- **Inline callouts**: pull-quote cards breaking up text every 3-4 paragraphs — big italic Fraunces number + small caption (e.g. "+38% YoY · searches for 'leaving Florida' among 25–34")
- **Inline list section**: "What people are searching" — top 8 Florida-specific search themes as horizontal bars
- **Right rail (desktop only, sticky)**: issue number, share buttons (X / LinkedIn / copy link), mini Weekly Brief CTA, table of contents auto-generated from h2s
- **Related stories**: 2-card mini grid linking to other recent issues (use the same StoryCard component)

Placeholder copy for Florida story body (mark with HTML comment as placeholder):
```
Florida's anxiety index jumped four points in seven days — the sharpest single-week move from any state since we started measuring. New York is still higher in absolute terms, but New York has been high all year. Florida wasn't. Two months ago, Florida was below the national average. This week it's tied for fourth.

## What's happening

Three things are converging, and most of the takes you'll read this week will only catch one.

**1. Hurricane season anticipation.** Search volume for storm-related terms is up 47% week-over-week, two weeks earlier than the historical baseline for May.

**2. Property insurance.** Miami-Dade and Broward counties are driving a spike in searches for "homeowner's insurance non-renewal" and "wind coverage gap" — the financial undercurrent beneath the storm anxiety.

**3. The quiet signal.** Searches for "leaving Florida" are up 38% year-over-year among 25–34 year olds. This is the one nobody's covering, and it's the one that should matter most to anyone planning for 2027.

## What it means for operators

If you're building a campaign or a message for Florida this cycle, the conventional wisdom — that Florida anxiety is downstream of national politics — is wrong this week. It's downstream of weather, money, and a generational exodus that's still mostly invisible in the polling.
```

## Step 4 — Wire up the homepage story grid
The three story cards on the homepage link to:
- `/stories/florida-is-cooking` (built in Step 3)
- `/stories/why-montana-stays-calm` (placeholder — 404 or "coming soon" page is fine)
- `/stories/when-markets-and-moods-disagree` (placeholder)

## Constraints
- NO emojis in the UI
- NO Cooper Black, pastel cards, or sticker buttons
- NO new dependencies beyond Recharts (flag if installing)
- TypeScript types on every component prop
- Mobile responsive at <1024px
- Accessibility: heading hierarchy, alt text, keyboard nav on map, WCAG AA contrast
- Don't touch the Python backend in `human-pulse/`
- Don't introduce or modify Stripe/Supabase wiring in this task — visual layer only

## Definition of done
1. `npm run build` passes with zero errors and zero warnings
2. `npm run dev` shows the new homepage at `/` matching the mockup on desktop
3. `/stories/florida-is-cooking` renders the story page
4. The two other story slugs render without 500 errors
5. No console errors, no hydration warnings
6. Commit to a new branch `redesign/v2` and push — don't merge to main yet

Begin with Step 1, report findings in ≤10 lines, then proceed straight through Step 4 without waiting for approval. Stop and ask only if you hit an actual blocker.
