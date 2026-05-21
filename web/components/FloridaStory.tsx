import {
  FLORIDA_STORY,
  FLORIDA_PULL_QUOTES,
  FLORIDA_SEARCH_THEMES,
  RELATED_STORIES,
} from "@/lib/pulseData";
import FloridaTrendChart from "./FloridaTrendChart";
import StoryRightRail from "./StoryRightRail";
import StoryGrid from "./StoryGrid";

function PullQuote({ bigNumber, caption }: { bigNumber: string; caption: string }) {
  return (
    <aside className="my-10 border-y border-border py-7 text-center">
      <div
        className="font-display italic text-accent leading-none"
        style={{
          fontVariationSettings: '"opsz" 144, "SOFT" 80, "wght" 500',
          fontSize: "clamp(56px, 8vw, 96px)",
          letterSpacing: "-0.04em",
        }}
      >
        {bigNumber}
      </div>
      <div className="mx-auto mt-3 max-w-md font-mono text-[11px] uppercase tracking-[0.14em] text-text-muted">
        {caption}
      </div>
    </aside>
  );
}

export default function FloridaStory() {
  const titlePrefix = FLORIDA_STORY.titlePrefix;
  const titleAccent = FLORIDA_STORY.titleAccent;

  return (
    <article>
      <header className="border-b border-border">
        <div className="mx-auto max-w-[1320px] px-4 pb-12 pt-10 lg:px-8 lg:pb-14 lg:pt-12">
          <div className="mb-6 font-mono text-[11px] uppercase tracking-[0.16em] text-text-muted">
            <span className="text-accent">Issue {FLORIDA_STORY.issue}</span> · Reported by{" "}
            <strong className="font-medium text-text-muted">
              {FLORIDA_STORY.reported}
            </strong>{" "}
            · {FLORIDA_STORY.date} · {FLORIDA_STORY.readTime}
          </div>
          <h1
            className="mb-5 max-w-[1000px] font-display leading-[0.95] tracking-[-0.035em]"
            style={{
              fontVariationSettings: '"opsz" 144, "SOFT" 30, "wght" 500',
              fontSize: "clamp(44px, 7vw, 88px)",
            }}
          >
            {titlePrefix}{" "}
            <em
              className="not-italic text-accent"
              style={{
                fontStyle: "italic",
                fontVariationSettings: '"opsz" 144, "SOFT" 80, "wght" 500',
              }}
            >
              {titleAccent}
            </em>
            .
          </h1>
          <p
            className="max-w-[720px] font-display italic text-text-muted"
            style={{
              fontVariationSettings: '"opsz" 36',
              fontSize: "20px",
              lineHeight: 1.5,
            }}
          >
            {FLORIDA_STORY.dek}
          </p>
          <div className="mt-6 font-mono text-[11px] uppercase tracking-[0.12em] text-text-dim">
            {FLORIDA_STORY.byline}
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-[1320px] px-4 py-14 lg:px-8">
        <FloridaTrendChart />
      </div>

      <div className="mx-auto grid max-w-[1320px] grid-cols-1 gap-10 px-4 pb-20 lg:grid-cols-[minmax(0,720px)_minmax(260px,1fr)] lg:gap-16 lg:px-8">
        <div
          className="story-body mx-auto w-full max-w-[720px]"
          data-story-body
        >
          {/* PLACEHOLDER: Florida story body — to be replaced when editorial copy is finalized */}
          <p>
            {`Florida’s anxiety index jumped four points in seven days — the sharpest single-week move from any state since we started measuring. New York is still higher in absolute terms, but New York has been high all year. Florida wasn’t. Two months ago, Florida was below the national average. This week it’s tied for fourth.`}
          </p>

          <h2>{`What’s happening`}</h2>
          <p>
            {`Three things are converging, and most of the takes you’ll read this week will only catch one.`}
          </p>
          <p>
            <strong>1. Hurricane season anticipation.</strong>{" "}
            {`Search volume for storm-related terms is up 47% week-over-week, two weeks earlier than the historical baseline for May.`}
          </p>
          <p>
            <strong>2. Property insurance.</strong>{" "}
            {`Miami-Dade and Broward counties are driving a spike in searches for “homeowner’s insurance non-renewal” and “wind coverage gap” — the financial undercurrent beneath the storm anxiety.`}
          </p>

          <PullQuote
            bigNumber={FLORIDA_PULL_QUOTES[0].bigNumber}
            caption={FLORIDA_PULL_QUOTES[0].caption}
          />

          <p>
            <strong>3. The quiet signal.</strong>{" "}
            {`Searches for “leaving Florida” are up 38% year-over-year among 25–34 year olds. This is the one nobody’s covering, and it’s the one that should matter most to anyone planning for 2027.`}
          </p>

          <h2>What people are searching</h2>
          <p>
            {`Below are the eight Florida-specific themes driving the surge this week, ranked by share of the state’s anxiety-coded search volume.`}
          </p>

          <div className="my-6 border border-border bg-bg-card p-6">
            <ul className="list-none space-y-4">
              {FLORIDA_SEARCH_THEMES.map((row) => (
                <li key={row.theme}>
                  <div className="mb-1.5 flex items-baseline justify-between gap-4">
                    <span className="text-sm font-medium text-text">
                      {row.theme}
                    </span>
                    <span className="font-mono text-[11px] text-text-muted">
                      {row.delta}
                    </span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-sm bg-border">
                    <div
                      className="h-full bg-red-5"
                      style={{ width: `${(row.pct / 31) * 100}%` }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <PullQuote
            bigNumber={FLORIDA_PULL_QUOTES[1].bigNumber}
            caption={FLORIDA_PULL_QUOTES[1].caption}
          />

          <h2>What it means for operators</h2>
          <p>
            {`If you’re building a campaign or a message for Florida this cycle, the conventional wisdom — that Florida anxiety is downstream of national politics — is wrong this week. It’s downstream of weather, money, and a generational exodus that’s still mostly invisible in the polling.`}
          </p>
          <p>
            {`Watch the 25–34 cohort. Watch the insurance-non-renewal corridor from Miami-Dade up to Palm Beach. And don’t read the political tea leaves until you’ve read the property ones first.`}
          </p>
        </div>

        <StoryRightRail
          issue={FLORIDA_STORY.issue}
          shareUrl="https://nationalpulse.io/stories/florida-is-cooking"
          shareTitle="The National Pulse: Florida is cooking."
        />
      </div>

      <section className="mx-auto max-w-[1320px] px-4 pb-16 lg:px-8">
        <div className="mb-6 flex items-end justify-between border-b border-text pb-3.5">
          <h2
            className="font-display leading-none tracking-[-0.025em]"
            style={{
              fontVariationSettings: '"opsz" 144, "SOFT" 40, "wght" 500',
              fontSize: "28px",
            }}
          >
            Also in this{" "}
            <em
              className="not-italic text-accent"
              style={{
                fontStyle: "italic",
                fontVariationSettings: '"opsz" 144, "SOFT" 80, "wght" 500',
              }}
            >
              issue
            </em>
          </h2>
          <span className="hidden font-mono text-[11px] uppercase tracking-[0.12em] text-text-muted md:block">
            Issue № 142
          </span>
        </div>
        <div className="grid grid-cols-1 gap-7 lg:grid-cols-2">
          <StoryGrid stories={RELATED_STORIES} />
        </div>
      </section>
    </article>
  );
}
