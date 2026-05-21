import Image from "next/image";
import Link from "next/link";
import TopBar from "@/components/TopBar";
import SiteFooter from "@/components/SiteFooter";
import SectionHeader from "@/components/SectionHeader";

interface ChartCardProps {
  src: string;
  alt: string;
  caption: string;
  finding: string;
}

function ChartCard({ src, alt, caption, finding }: ChartCardProps) {
  return (
    <figure className="overflow-hidden border border-border bg-bg-card">
      <Image
        src={src}
        alt={alt}
        width={900}
        height={450}
        className="block h-auto w-full"
      />
      <figcaption className="border-t border-border bg-bg-elevated px-6 py-5">
        <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.14em] text-text-muted">
          {caption}
        </p>
        <p
          className="font-display text-text"
          style={{
            fontVariationSettings: '"opsz" 18, "SOFT" 30, "wght" 400',
            fontSize: "17px",
            lineHeight: 1.55,
          }}
        >
          {finding}
        </p>
      </figcaption>
    </figure>
  );
}

interface FindingPillProps {
  label: string;
  value: string;
  tone?: "accent" | "green" | "red";
}

function FindingPill({ label, value, tone = "accent" }: FindingPillProps) {
  const color =
    tone === "green" ? "text-green" : tone === "red" ? "text-red-5" : "text-accent";
  return (
    <div className="border border-border bg-bg-card px-5 py-4">
      <p className="mb-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-text-muted">
        {label}
      </p>
      <p className={`text-sm font-semibold ${color}`}>{value}</p>
    </div>
  );
}

export default function ProofPage() {
  return (
    <>
      <TopBar />
      <header className="relative mx-auto max-w-[1320px] px-4 pb-8 pt-12 lg:px-8">
        <div className="mb-6 flex items-baseline justify-between border-b-2 border-text pb-4">
          <div className="font-mono text-[11px] uppercase tracking-[0.16em] text-text-muted">
            <strong className="font-semibold text-accent">Methodology</strong> ·
            Proof · <strong className="font-semibold text-accent">Backtests</strong>
          </div>
          <div
            className="hidden font-display text-sm italic text-text-muted md:block"
            style={{ fontVariationSettings: '"opsz" 144' }}
          >
            Two elections. Same signal.
          </div>
        </div>
        <h1
          className="mb-5 max-w-[1100px] font-display leading-[0.95] tracking-[-0.035em]"
          style={{
            fontVariationSettings: '"opsz" 144, "SOFT" 30, "wght" 500',
            fontSize: "clamp(40px, 6vw, 76px)",
          }}
        >
          The model,{" "}
          <em
            className="not-italic text-accent"
            style={{
              fontStyle: "italic",
              fontVariationSettings: '"opsz" 144, "SOFT" 80, "wght" 500',
            }}
          >
            tested
          </em>
          .
        </h1>
        <p
          className="max-w-[720px] font-display italic text-text-muted"
          style={{
            fontVariationSettings: '"opsz" 36',
            fontSize: "19px",
            lineHeight: 1.5,
          }}
        >
          {`Before selling access, we ran The National Pulse backward through two elections to see whether the emotional search signal showed up before the polls did. It did — by weeks, in both cases.`}
        </p>
        <div className="mt-6 font-mono text-[11px] uppercase tracking-[0.12em] text-text-dim">
          Same Google Trends data the production pipeline uses · No model tuning · No extrapolation
        </div>
      </header>

      <main className="mx-auto max-w-[1320px] px-4 pb-20 lg:px-8">
        <SectionHeader
          number="§ 01"
          titlePrefix="Arizona 2022"
          titleAccent="Senate"
          tag="Aug 10 – Nov 8, 2022 · Kelly (D) vs. Masters (R)"
        />

        <div className="mb-8 grid grid-cols-1 gap-7 lg:grid-cols-[2fr_1fr]">
          <div
            className="mx-auto w-full max-w-[720px] font-display text-text"
            style={{
              fontVariationSettings: '"opsz" 18, "SOFT" 30, "wght" 400',
              fontSize: "18px",
              lineHeight: 1.7,
            }}
          >
            <p className="mb-5">
              {`Kelly held Arizona 51.4% to 46.5%. The pre-election conventional read was that immigration would carry Masters — border rhetoric was loud, debate coverage was crime-and-border heavy, and Masters had wind at his back the final three weeks.`}
            </p>
            <p className="mb-5">
              {`The search data said something different. Economy anxiety led the issue mix from August through Election Day and never gave up the top spot. Immigration rose late, sharply, and visibly — but as a second-order signal, not a dominant one. Kelly’s ground was the economy. He held it, and he won.`}
            </p>
            <p>
              {`Individual keyword traces spiked three to four weeks before the same themes landed in debate coverage. A campaign watching this in real time would have had three weeks of advance notice on every issue inflection.`}
            </p>
          </div>
          <aside className="grid grid-cols-2 gap-3 self-start lg:grid-cols-1">
            <FindingPill label="Dominant Issue" value="Economy anxiety" />
            <FindingPill label="Late Surge" value="Immigration, final 3 weeks" tone="red" />
            <FindingPill label="Outcome" value="Kelly +4.9 pts" tone="green" />
            <FindingPill label="Lead Time" value="~3 weeks vs. polls" />
          </aside>
        </div>

        <div className="flex flex-col gap-7">
          <ChartCard
            src="/proof/az2022_chart1_overview.png"
            alt="Arizona 2022 — all issue groups over time"
            caption="All issue groups · Aug–Nov 2022 · Economy Anxiety leads throughout the window"
            finding={`Economy anxiety was the dominant issue for the entire campaign window. Immigration rose sharply in the final three weeks — aligned with Masters’ debate messaging — but never overtook it.`}
          />
          <ChartCard
            src="/proof/az2022_chart2_imm_vs_eco.png"
            alt="Immigration vs Economy anxiety — Arizona 2022"
            caption="Immigration vs. Economy head-to-head · Red shading = immigration dominant (Masters territory)"
            finding={`The shading shows exactly when Masters had momentum. Immigration surged briefly after the Oct 18 debate — crime and border rhetoric. But economy anxiety stayed elevated through Election Day. Kelly’s territory.`}
          />
          <ChartCard
            src="/proof/az2022_chart3_keywords.png"
            alt="Individual keyword breakdown — Arizona 2022"
            caption="Individual keyword breakdown by group · Pre-headline spikes visible 3–4 weeks early"
            finding={`The keyword view is where the signal becomes legible. Specific immigration keywords spiked three weeks before the final debate — a pre-headline indicator a real-time consumer would have caught.`}
          />
        </div>

        <SectionHeader
          number="§ 02"
          titlePrefix="2024 Presidential"
          titleAccent="Swing States"
          tag="Aug 19 – Nov 5, 2024 · 5 states"
        />

        <div className="mb-8 grid grid-cols-1 gap-7 lg:grid-cols-[2fr_1fr]">
          <div
            className="mx-auto w-full max-w-[720px] font-display text-text"
            style={{
              fontVariationSettings: '"opsz" 18, "SOFT" 30, "wght" 400',
              fontSize: "18px",
              lineHeight: 1.7,
            }}
          >
            <p className="mb-5">
              {`Trump swept all five swing states: Arizona, Pennsylvania, Michigan, Wisconsin, Georgia. In every one, the Trump-coded issue basket (economy, immigration, crime) ran above the Harris-coded basket (abortion, democracy) for the majority of the campaign window.`}
            </p>
            <p className="mb-5">
              {`The September debate produced the only meaningful Harris-side surge. It lasted about two weeks. Then economy anxiety re-asserted in October, the gap widened, and the chart through Election Day looks exactly like the eventual result.`}
            </p>
            <p>
              {`Wisconsin and Michigan — the two states most pundits called toss-ups — show the same pattern as Arizona. The data did not see five close races. It saw one wave.`}
            </p>
          </div>
          <aside className="grid grid-cols-2 gap-3 self-start lg:grid-cols-1">
            <FindingPill label="Trump Basket" value="Economy + immigration" />
            <FindingPill label="Harris Basket" value="Abortion + democracy" tone="green" />
            <FindingPill label="Outcome" value="Trump 5 / 5" tone="red" />
            <FindingPill label="Consistency" value="Same pattern in all 5" />
          </aside>
        </div>

        <div className="flex flex-col gap-7">
          <ChartCard
            src="/proof/pres2024_chart1_states.png"
            alt="Presidential 2024 — state-by-state issue comparison"
            caption="State-by-state issue anxiety across all 5 swing states · Aug–Nov 2024"
            finding={`Economy and immigration anxiety dominated in every single swing state through the window. The pattern was not close. Harris’s issues were present but never crossed into dominance — and dominance is the variable that matters.`}
          />
          <ChartCard
            src="/proof/pres2024_chart2_comparison.png"
            alt="Trump vs Harris issue anxiety comparison"
            caption="Trump issue basket vs. Harris issue basket · Aggregate across swing states"
            finding={`After the September debate, Harris’s basket briefly rose — but economy anxiety surged again in October, widening the gap into Election Day. Two weeks of momentum against eleven of consistency.`}
          />
          <ChartCard
            src="/proof/pres2024_chart3_ratio.png"
            alt="Trump/Harris issue ratio across swing states"
            caption="Issue dominance ratio across states · Above 1.0 = Trump issue territory"
            finding={`The ratio chart makes the outcome legible weeks early. Every swing state was above 1.0 for most of the window. Wisconsin and Michigan — the “closest” races — show the same shape as Arizona.`}
          />
        </div>

        <SectionHeader
          number="§ 03"
          titlePrefix="How we"
          titleAccent="measure"
          tag="Methodology · Updated weekly"
        />
        <div
          className="mx-auto max-w-[720px] font-display text-text"
          style={{
            fontVariationSettings: '"opsz" 18, "SOFT" 30, "wght" 400',
            fontSize: "18px",
            lineHeight: 1.7,
          }}
        >
          <p className="mb-5">
            {`The pipeline takes Google Trends queries for emotion-coded keyword baskets (anxiety, hope, stress, fear, depression) and issue-coded baskets (economy, immigration, crime, abortion, democracy, healthcare) and pulls relative search interest 0–100 per state.`}
          </p>
          <p className="mb-5">
            {`Each basket is normalized within its category, smoothed with a 7-day rolling window to suppress single-day noise, then aggregated per state to produce the indices you see on the dashboard. There is no learned model on top — the only judgment calls are basket composition, which is public.`}
          </p>
          <p>
            {`We do not predict elections. We measure where the country’s attention is, in near real-time, at the level of the state. In two backtests, that turned out to be enough.`}
          </p>
        </div>

        <section className="mt-16 grid grid-cols-1 overflow-hidden border border-border bg-bg-elevated lg:grid-cols-[1.5fr_1fr]">
          <div className="px-8 py-12 lg:px-14 lg:py-14">
            <div className="mb-4 flex items-center gap-2.5 font-mono text-[11px] uppercase tracking-[0.18em] text-accent">
              <span className="h-px w-6 bg-accent" />
              From Proof to Practice
            </div>
            <h3
              className="mb-5 font-display leading-[1.05] tracking-[-0.03em]"
              style={{
                fontVariationSettings: '"opsz" 144, "SOFT" 40, "wght" 500',
                fontSize: "clamp(30px, 4vw, 42px)",
              }}
            >
              Ready to read the country{" "}
              <em
                className="not-italic text-accent"
                style={{
                  fontStyle: "italic",
                  fontVariationSettings: '"opsz" 144, "SOFT" 80, "wght" 500',
                }}
              >
                before
              </em>{" "}
              the polls do?
            </h3>
            <p
              className="mb-7 max-w-[480px] font-display text-text-muted"
              style={{
                fontVariationSettings: '"opsz" 24',
                fontSize: "16px",
                lineHeight: 1.55,
              }}
            >
              {`The same methodology that called both backtests runs in production today. Updated every cycle, across all 50 states, in time for the next move.`}
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/pricing"
                className="rounded-full bg-accent px-6 py-2.5 font-sans text-[13px] font-semibold text-bg transition-all hover:-translate-y-px hover:bg-[#f5b35a]"
              >
                View pricing →
              </Link>
              <Link
                href="/"
                className="rounded-full border border-border-strong px-6 py-2.5 font-sans text-[13px] font-medium text-text transition-colors hover:border-accent hover:text-accent"
              >
                Back to this issue
              </Link>
            </div>
          </div>
          <div className="border-t border-border bg-bg/50 px-10 py-12 lg:border-l lg:border-t-0 lg:px-11 lg:py-14">
            <div className="mb-7">
              <div
                className="font-display leading-none tracking-[-0.03em] text-text"
                style={{
                  fontVariationSettings: '"opsz" 144, "SOFT" 50, "wght" 500',
                  fontSize: "42px",
                }}
              >
                <em
                  className="not-italic text-accent"
                  style={{
                    fontStyle: "italic",
                    fontVariationSettings: '"opsz" 144, "SOFT" 80, "wght" 500',
                  }}
                >
                  2
                </em>
                <span className="text-text-muted">/2</span>
              </div>
              <div className="mt-2.5 font-mono text-[10px] uppercase tracking-[0.14em] text-text-muted">
                Backtests Called Correctly
              </div>
            </div>
            <div className="mb-7">
              <div
                className="font-display leading-none tracking-[-0.03em] text-text"
                style={{
                  fontVariationSettings: '"opsz" 144, "SOFT" 50, "wght" 500',
                  fontSize: "42px",
                }}
              >
                <em
                  className="not-italic text-accent"
                  style={{
                    fontStyle: "italic",
                    fontVariationSettings: '"opsz" 144, "SOFT" 80, "wght" 500',
                  }}
                >
                  3w
                </em>
              </div>
              <div className="mt-2.5 font-mono text-[10px] uppercase tracking-[0.14em] text-text-muted">
                Median Lead Time
              </div>
            </div>
            <div>
              <div
                className="font-display leading-none tracking-[-0.03em] text-text"
                style={{
                  fontVariationSettings: '"opsz" 144, "SOFT" 50, "wght" 500',
                  fontSize: "42px",
                }}
              >
                <em
                  className="not-italic text-accent"
                  style={{
                    fontStyle: "italic",
                    fontVariationSettings: '"opsz" 144, "SOFT" 80, "wght" 500',
                  }}
                >
                  50
                </em>
              </div>
              <div className="mt-2.5 font-mono text-[10px] uppercase tracking-[0.14em] text-text-muted">
                States · 4 Time Zones
              </div>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
