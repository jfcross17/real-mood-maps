export type EmotionKey =
  | "anxiety"
  | "hope"
  | "anxiety_vs_hope"
  | "stress"
  | "depression";

export interface StateValue {
  name: string;
  anxiety: number;
  hope: number;
  stress: number;
  depression: number;
}

export interface MoverRow {
  state: string;
  value: number;
  delta: number;
}

export interface EmotionBar {
  label: string;
  value: number;
  pct: number;
  tone: "hot" | "warn" | "calm";
}

export interface StruggleItem {
  name: string;
  detail: string;
  pct: number;
}

export interface RankingEntry {
  rank: string;
  state: string;
  value: number;
  delta: number;
  direction: "up" | "down";
}

export interface StoryCardData {
  slug: string;
  issue: string;
  section: string;
  title: string;
  accentWord: string;
  dek: string;
  coverVariant: 1 | 2 | 3;
}

export interface IssueMeta {
  number: number;
  volume: string;
  monthLabel: string;
  weekdayDate: string;
  liveTime: string;
  dataPointsLabel: string;
}

export const ISSUE: IssueMeta = {
  number: 142,
  volume: "Vol. III",
  monthLabel: "May 2026",
  weekdayDate: "Wednesday, May 20, 2026",
  liveTime: "14:23 PT",
  dataPointsLabel: "2.4M anonymized searches",
};

export const MASTHEAD = {
  headlinePrefix: "The country is uneasy,",
  headlineAccent: "not unraveling",
  dek: "Anxiety climbed two points this week as Florida and Texas drove a Southern surge. Hope held its line in the Mountain West. Here's what's moving and where to watch.",
};

export const HERO = {
  anxietyIndex: 7,
  anxietyCaption: "Elevated. Highest reading since mid-March.",
  anxietyDelta: "▲ +2 vs. 7 days ago · 30-day high",
  marketSentiment: "+1",
  marketCaption: "Neutral · Wait & See",
  marketDetail:
    "A divergence worth watching — anxiety rising while sentiment holds.",
  movers: [
    { state: "Florida", value: 28, delta: 4 },
    { state: "New York", value: 31, delta: 2 },
    { state: "Texas", value: 26, delta: 3 },
    { state: "Montana", value: 25, delta: -1 },
  ] as MoverRow[],
  sparkline: [
    36, 34, 32, 35, 30, 33, 28, 31, 25, 28, 23, 26, 21, 24, 18, 22, 15, 19, 12,
    15, 8,
  ],
};

export const STATES: StateValue[] = [
  { name: "Alabama", anxiety: 22, hope: 16, stress: 23, depression: 19 },
  { name: "Alaska", anxiety: 17, hope: 21, stress: 18, depression: 17 },
  { name: "Arizona", anxiety: 24, hope: 17, stress: 26, depression: 20 },
  { name: "Arkansas", anxiety: 21, hope: 18, stress: 22, depression: 19 },
  { name: "California", anxiety: 29, hope: 17, stress: 30, depression: 22 },
  { name: "Colorado", anxiety: 20, hope: 22, stress: 21, depression: 17 },
  { name: "Connecticut", anxiety: 23, hope: 18, stress: 24, depression: 19 },
  { name: "Delaware", anxiety: 22, hope: 18, stress: 23, depression: 18 },
  { name: "District of Columbia", anxiety: 26, hope: 17, stress: 27, depression: 20 },
  { name: "Florida", anxiety: 28, hope: 15, stress: 29, depression: 21 },
  { name: "Georgia", anxiety: 23, hope: 18, stress: 24, depression: 19 },
  { name: "Hawaii", anxiety: 14, hope: 26, stress: 15, depression: 14 },
  { name: "Idaho", anxiety: 20, hope: 22, stress: 21, depression: 17 },
  { name: "Illinois", anxiety: 20, hope: 19, stress: 22, depression: 18 },
  { name: "Indiana", anxiety: 20, hope: 19, stress: 21, depression: 18 },
  { name: "Iowa", anxiety: 18, hope: 20, stress: 19, depression: 17 },
  { name: "Kansas", anxiety: 19, hope: 20, stress: 20, depression: 17 },
  { name: "Kentucky", anxiety: 21, hope: 19, stress: 22, depression: 19 },
  { name: "Louisiana", anxiety: 23, hope: 17, stress: 24, depression: 20 },
  { name: "Maine", anxiety: 16, hope: 22, stress: 17, depression: 15 },
  { name: "Maryland", anxiety: 22, hope: 18, stress: 23, depression: 19 },
  { name: "Massachusetts", anxiety: 24, hope: 18, stress: 25, depression: 19 },
  { name: "Michigan", anxiety: 19, hope: 19, stress: 21, depression: 18 },
  { name: "Minnesota", anxiety: 18, hope: 21, stress: 19, depression: 17 },
  { name: "Mississippi", anxiety: 22, hope: 17, stress: 23, depression: 20 },
  { name: "Missouri", anxiety: 20, hope: 19, stress: 21, depression: 18 },
  { name: "Montana", anxiety: 14, hope: 25, stress: 15, depression: 14 },
  { name: "Nebraska", anxiety: 17, hope: 21, stress: 18, depression: 16 },
  { name: "Nevada", anxiety: 21, hope: 18, stress: 23, depression: 19 },
  { name: "New Hampshire", anxiety: 19, hope: 21, stress: 20, depression: 17 },
  { name: "New Jersey", anxiety: 28, hope: 16, stress: 29, depression: 21 },
  { name: "New Mexico", anxiety: 22, hope: 19, stress: 23, depression: 19 },
  { name: "New York", anxiety: 31, hope: 16, stress: 32, depression: 23 },
  { name: "North Carolina", anxiety: 21, hope: 19, stress: 22, depression: 18 },
  { name: "North Dakota", anxiety: 14, hope: 22, stress: 15, depression: 14 },
  { name: "Ohio", anxiety: 20, hope: 19, stress: 21, depression: 18 },
  { name: "Oklahoma", anxiety: 22, hope: 18, stress: 23, depression: 19 },
  { name: "Oregon", anxiety: 18, hope: 21, stress: 19, depression: 17 },
  { name: "Pennsylvania", anxiety: 22, hope: 18, stress: 23, depression: 19 },
  { name: "Rhode Island", anxiety: 22, hope: 18, stress: 23, depression: 19 },
  { name: "South Carolina", anxiety: 22, hope: 18, stress: 23, depression: 19 },
  { name: "South Dakota", anxiety: 15, hope: 23, stress: 16, depression: 15 },
  { name: "Tennessee", anxiety: 22, hope: 18, stress: 23, depression: 19 },
  { name: "Texas", anxiety: 26, hope: 17, stress: 27, depression: 20 },
  { name: "Utah", anxiety: 22, hope: 20, stress: 23, depression: 18 },
  { name: "Vermont", anxiety: 18, hope: 22, stress: 19, depression: 16 },
  { name: "Virginia", anxiety: 22, hope: 18, stress: 23, depression: 19 },
  { name: "Washington", anxiety: 19, hope: 21, stress: 20, depression: 18 },
  { name: "West Virginia", anxiety: 21, hope: 18, stress: 22, depression: 19 },
  { name: "Wisconsin", anxiety: 17, hope: 21, stress: 18, depression: 17 },
  { name: "Wyoming", anxiety: 15, hope: 24, stress: 16, depression: 15 },
];

export const STATES_BY_NAME: Record<string, StateValue> = Object.fromEntries(
  STATES.map((s) => [s.name, s])
);

export const EMOTION_BREAKDOWN: EmotionBar[] = [
  { label: "Anxiety", value: 24, pct: 80, tone: "hot" },
  { label: "Stress", value: 26, pct: 87, tone: "hot" },
  { label: "Hope", value: 18, pct: 60, tone: "calm" },
  { label: "Fear", value: 21, pct: 70, tone: "warn" },
  { label: "Depression", value: 19, pct: 63, tone: "warn" },
];

export const STRUGGLES: StruggleItem[] = [
  {
    name: "Work Stress",
    detail: "layoff · burnout · return-to-office",
    pct: 26,
  },
  {
    name: "General Anxiety",
    detail: "panic attacks · sleepless",
    pct: 24,
  },
  {
    name: "Uncertainty",
    detail: "“what happens if” · “is it safe to”",
    pct: 21,
  },
  {
    name: "Money & Inflation",
    detail: "rent · gas · groceries",
    pct: 17,
  },
];

export const MOST_ANXIOUS: RankingEntry[] = [
  { rank: "i.", state: "New York", value: 31, delta: 2, direction: "up" },
  { rank: "ii.", state: "California", value: 29, delta: 3, direction: "up" },
  { rank: "iii.", state: "New Jersey", value: 28, delta: 1, direction: "up" },
  { rank: "iv.", state: "Florida", value: 28, delta: 4, direction: "up" },
  { rank: "v.", state: "Texas", value: 26, delta: 3, direction: "up" },
];

export const MOST_HOPEFUL: RankingEntry[] = [
  { rank: "i.", state: "Montana", value: 25, delta: 1, direction: "down" },
  { rank: "ii.", state: "Wyoming", value: 24, delta: 0, direction: "down" },
  { rank: "iii.", state: "South Dakota", value: 23, delta: 2, direction: "down" },
  { rank: "iv.", state: "North Dakota", value: 22, delta: 1, direction: "down" },
  { rank: "v.", state: "Idaho", value: 22, delta: 0, direction: "down" },
];

export const STORIES: StoryCardData[] = [
  {
    slug: "florida-is-cooking",
    issue: "№ 142.a",
    section: "The South",
    title: "Florida is cooking.",
    accentWord: "cooking",
    dek: "A four-point jump in seven days. We trace the search terms back to three triggers — and one nobody's talking about.",
    coverVariant: 1,
  },
  {
    slug: "why-montana-stays-calm",
    issue: "№ 142.b",
    section: "Mountain West",
    title: "Why Montana stays calm.",
    accentWord: "calm",
    dek: "For 142 issues, the Mountain West has held its hope index above the national average. The reasons are not what you'd guess.",
    coverVariant: 2,
  },
  {
    slug: "when-markets-and-moods-disagree",
    issue: "№ 142.c",
    section: "The Divergence",
    title: "When markets and moods disagree.",
    accentWord: "disagree",
    dek: "Anxiety is up. Sentiment is flat. History says one of them is about to move — fast. Here's which way the gap usually closes.",
    coverVariant: 3,
  },
];

export const BRIEF_STATS = [
  { num: "2.4", suffix: "M", italicPart: "2.4", label: "Searches Indexed Daily" },
  { num: "50", suffix: "", italicPart: "50", label: "States · 4 Time Zones" },
  { num: "142", suffix: "", italicPart: "142", label: "Issues & Counting" },
];

// ──────────────────────────────────────────────────────────────────────
// Story: Florida is cooking
// ──────────────────────────────────────────────────────────────────────

export interface FloridaTrendPoint {
  day: number;
  florida: number;
  national: number;
}

function buildFloridaTrend(): FloridaTrendPoint[] {
  const points: FloridaTrendPoint[] = [];
  for (let i = 0; i < 90; i++) {
    const t = i / 89;
    const national = 20 + Math.sin(t * Math.PI * 1.4) * 2 + (t - 0.5) * 1.5;
    let florida = 20 + Math.sin(t * Math.PI * 1.2 + 0.4) * 1.6 + (t - 0.5) * 1.2;
    if (i >= 82) {
      const surge = (i - 81) / 8;
      florida += surge * 4;
    }
    points.push({
      day: i - 89,
      florida: Math.round(florida * 10) / 10,
      national: Math.round(national * 10) / 10,
    });
  }
  return points;
}

export const FLORIDA_TREND = buildFloridaTrend();

export const FLORIDA_SEARCH_THEMES = [
  { theme: "hurricane prep checklist", pct: 31, delta: "+47% WoW" },
  { theme: "homeowner's insurance non-renewal", pct: 24, delta: "+38% WoW" },
  { theme: "wind coverage gap", pct: 19, delta: "+29% WoW" },
  { theme: "leaving Florida", pct: 18, delta: "+38% YoY" },
  { theme: "storm-surge zones map", pct: 16, delta: "+22% WoW" },
  { theme: "Miami-Dade roof inspection", pct: 14, delta: "+19% WoW" },
  { theme: "cost of moving out of state", pct: 12, delta: "+24% YoY" },
  { theme: "Florida property tax 2026", pct: 11, delta: "+15% WoW" },
];

export interface FloridaPullQuote {
  bigNumber: string;
  caption: string;
}

export const FLORIDA_PULL_QUOTES: FloridaPullQuote[] = [
  {
    bigNumber: "+4",
    caption: "points · the sharpest single-week move from any state in 142 issues of The Pulse",
  },
  {
    bigNumber: "+38%",
    caption: "YoY · searches for “leaving Florida” among 25–34s",
  },
];

export const FLORIDA_STORY = {
  slug: "florida-is-cooking",
  issue: "№ 142.a",
  section: "The South",
  reported: "The Pulse Desk",
  date: "May 20, 2026",
  readTime: "4 min read",
  titlePrefix: "Florida is",
  titleAccent: "cooking",
  dek: "A four-point jump in seven days — the sharpest single-week move from any state since we started measuring.",
  byline: "Reported by The Pulse Desk · Data from 2.4M anonymized searches",
};

export const RELATED_STORIES = STORIES.filter(
  (s) => s.slug !== "florida-is-cooking"
);
