import Image from "next/image";
import Link from "next/link";

interface ChartBlockProps {
  src: string;
  alt: string;
  caption: string;
  finding: string;
}

function ChartBlock({ src, alt, caption, finding }: ChartBlockProps) {
  return (
    <div
      className="rounded-lg overflow-hidden flex flex-col"
      style={{ border: "1px solid var(--border)" }}
    >
      <Image
        src={src}
        alt={alt}
        width={900}
        height={450}
        className="w-full h-auto"
        style={{ display: "block" }}
      />
      <div
        className="px-5 py-4 flex flex-col gap-2"
        style={{
          background: "var(--surface)",
          borderTop: "1px solid var(--border)",
        }}
      >
        <p className="text-xs mono" style={{ color: "var(--muted)" }}>
          {caption}
        </p>
        <p
          className="text-sm leading-relaxed"
          style={{ color: "var(--text)" }}
        >
          {finding}
        </p>
      </div>
    </div>
  );
}

interface FindingPillProps {
  label: string;
  value: string;
  color?: string;
}

function FindingPill({
  label,
  value,
  color = "var(--accent)",
}: FindingPillProps) {
  return (
    <div
      className="rounded-lg px-5 py-4"
      style={{
        background: "var(--surface2)",
        border: "1px solid var(--border)",
      }}
    >
      <p className="text-xs mono uppercase tracking-widest mb-1" style={{ color: "var(--muted)" }}>
        {label}
      </p>
      <p className="text-sm font-semibold" style={{ color }}>
        {value}
      </p>
    </div>
  );
}

export default function ProofPage() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-16">
      {/* Header */}
      <div className="mb-16">
        <span
          className="mono text-xs uppercase tracking-widest"
          style={{ color: "var(--accent)" }}
        >
          Methodology Validation
        </span>
        <h1
          className="display-font text-6xl mt-3 mb-5"
          style={{ color: "var(--text)" }}
        >
          THE BACKTESTS
        </h1>
        <p
          className="text-lg max-w-2xl leading-relaxed"
          style={{ color: "var(--muted)" }}
        >
          Before selling access, we ran National Pulse backward through two
          elections to confirm the signal was real. Both backtests showed the
          same thing: the emotional search data predicted issue dominance weeks
          before it appeared in polls or press coverage.
        </p>
      </div>

      {/* Methodology note */}
      <div
        className="rounded-lg px-6 py-5 mb-16"
        style={{
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderLeft: "3px solid var(--accent)",
        }}
      >
        <p className="text-sm font-semibold mb-1" style={{ color: "var(--text)" }}>
          Methodology
        </p>
        <p className="text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
          We used Google Trends data — the same source National Pulse uses in
          production — queried historically for specific issue keyword groups.
          Data is normalized 0–100 (relative search interest) and aggregated
          by issue category per state. No extrapolation, no model tuning. The
          raw numbers are what they are.
        </p>
      </div>

      {/* ── ARIZONA 2022 ─────────────────────────────────────────── */}
      <section className="mb-24">
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-3">
            <div
              className="h-px flex-1"
              style={{ background: "var(--border)" }}
            />
            <span
              className="mono text-xs uppercase tracking-widest"
              style={{ color: "var(--muted)" }}
            >
              Backtest 01
            </span>
            <div
              className="h-px flex-1"
              style={{ background: "var(--border)" }}
            />
          </div>
          <h2
            className="display-font text-4xl mb-3"
            style={{ color: "var(--text)" }}
          >
            ARIZONA 2022 SENATE
          </h2>
          <p className="text-base" style={{ color: "var(--muted)" }}>
            Mark Kelly (D) vs Blake Masters (R) &mdash; Kelly wins 51.4% to 46.5%
          </p>
          <p className="text-sm mt-2" style={{ color: "var(--muted2)" }}>
            Window: Aug 10 – Nov 8, 2022 &nbsp;|&nbsp; Keyword groups:
            Immigration Anxiety, Crime Anxiety, Economy Anxiety, Candidate Direct
          </p>
        </div>

        {/* Key findings row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <FindingPill
            label="Dominant Issue"
            value="Economy Anxiety"
            color="var(--blue)"
          />
          <FindingPill
            label="Rising Into Election"
            value="Immigration Anxiety"
            color="var(--accent)"
          />
          <FindingPill
            label="Final Debate Spike"
            value="Oct 18 — Crime + Immigration"
            color="var(--accent2)"
          />
          <FindingPill
            label="Result"
            value="Kelly holds. Economy won."
            color="var(--accent3)"
          />
        </div>

        <div className="flex flex-col gap-8">
          <ChartBlock
            src="/proof/az2022_chart1_overview.png"
            alt="Arizona 2022 — all issue groups over time"
            caption="All issue groups, Aug–Nov 2022. Economy Anxiety led throughout the window."
            finding="Economy Anxiety was the dominant issue for the entire campaign window. Immigration rose sharply in the final 3 weeks — aligned with Masters' debate messaging — but never overtook Economy. Kelly's ground was economy: he held it, and he won."
          />
          <ChartBlock
            src="/proof/az2022_chart2_imm_vs_eco.png"
            alt="Immigration vs Economy anxiety — Arizona 2022"
            caption="Immigration vs Economy head-to-head. Red shading = immigration dominant (Masters territory)."
            finding="The shading shows exactly when Masters had the wind at his back. Immigration surged briefly after the Oct 18 debate, which featured heavy crime and border rhetoric. But it was too late and too narrow. Economy anxiety stayed elevated through Election Day — Kelly's territory."
          />
          <ChartBlock
            src="/proof/az2022_chart3_keywords.png"
            alt="Individual keyword breakdown — Arizona 2022"
            caption="Individual keyword breakdown by group. Pre-headline spikes visible 3–4 weeks before debate coverage."
            finding="The individual keyword view is where the signal becomes clearest. Specific immigration keywords spiked 3 weeks before the final debate — a pre-headline indicator that Masters was activating his base. A campaign watching this in real time would have had 21 days of advance notice."
          />
        </div>
      </section>

      {/* ── PRESIDENTIAL 2024 ────────────────────────────────────── */}
      <section className="mb-24">
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-3">
            <div
              className="h-px flex-1"
              style={{ background: "var(--border)" }}
            />
            <span
              className="mono text-xs uppercase tracking-widest"
              style={{ color: "var(--muted)" }}
            >
              Backtest 02
            </span>
            <div
              className="h-px flex-1"
              style={{ background: "var(--border)" }}
            />
          </div>
          <h2
            className="display-font text-4xl mb-3"
            style={{ color: "var(--text)" }}
          >
            PRESIDENTIAL 2024
          </h2>
          <p className="text-base" style={{ color: "var(--muted)" }}>
            Donald Trump (R) vs Kamala Harris (D) — Trump sweeps all 5 swing
            states
          </p>
          <p className="text-sm mt-2" style={{ color: "var(--muted2)" }}>
            Window: Aug 19 – Nov 5, 2024 &nbsp;|&nbsp; States: Arizona,
            Pennsylvania, Michigan, Wisconsin, Georgia &nbsp;|&nbsp; Issue
            groups: Immigration, Economy, Crime (Trump); Abortion, Democracy
            (Harris)
          </p>
        </div>

        {/* Key findings */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <FindingPill
            label="Trump Issues"
            value="Economy + Immigration — dominated all 5 states"
            color="var(--accent)"
          />
          <FindingPill
            label="Harris Issues"
            value="Abortion + Democracy — elevated but secondary"
            color="var(--blue)"
          />
          <FindingPill
            label="Key Signal"
            value="Economy anxiety rose in all 5 after DNC"
            color="var(--accent2)"
          />
          <FindingPill
            label="Result"
            value="Trump wins AZ, PA, MI, WI, GA"
            color="var(--accent3)"
          />
        </div>

        <div className="flex flex-col gap-8">
          <ChartBlock
            src="/proof/pres2024_chart1_states.png"
            alt="Presidential 2024 — state by state issue comparison"
            caption="State-by-state issue anxiety comparison across all 5 swing states, Aug–Nov 2024."
            finding="Economy and Immigration anxiety dominated in every single swing state throughout the window. The pattern was not close. Harris's issues were present but never rose to the level that would indicate issue dominance — and in a campaign, dominance is everything."
          />
          <ChartBlock
            src="/proof/pres2024_chart2_comparison.png"
            alt="Trump vs Harris issue anxiety comparison"
            caption="Trump issues vs Harris issues — aggregate comparison across swing states."
            finding="The Trump issue basket (Economy + Immigration + Crime) vs the Harris issue basket (Abortion + Democracy) shows a consistent gap. After the September debate, Harris's issues briefly rose — but Economy anxiety surged again in October, widening the gap into Election Day."
          />
          <ChartBlock
            src="/proof/pres2024_chart3_ratio.png"
            alt="Trump/Harris issue ratio across swing states"
            caption="Issue dominance ratio across states. Values above 1.0 = Trump issue territory."
            finding="The ratio chart makes the outcome legible weeks in advance. Every swing state was above 1.0 — Trump issue territory — for the majority of the campaign window. Wisconsin and Michigan, often called the closest races, show the same pattern as Arizona. The search data said the same thing in all five."
          />
        </div>
      </section>

      {/* Bottom CTA */}
      <section
        className="rounded-xl px-8 py-10 text-center"
        style={{
          background: "var(--surface)",
          border: "1px solid var(--border)",
        }}
      >
        <h3
          className="display-font text-4xl mb-3"
          style={{ color: "var(--text)" }}
        >
          THE SIGNAL IS LIVE NOW
        </h3>
        <p
          className="text-base mb-8 max-w-xl mx-auto"
          style={{ color: "var(--muted)" }}
        >
          The same methodology running in production today. Updated daily across
          all 50 states. Subscribe to track the issues that matter to your
          clients before they break through.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Link
            href="/pricing"
            className="px-8 py-3 rounded font-semibold text-base hover:opacity-90 transition-opacity"
            style={{ background: "var(--accent)", color: "white" }}
          >
            View Pricing
          </Link>
          <Link
            href="/dashboard"
            className="px-8 py-3 rounded font-medium text-base"
            style={{
              border: "1px solid var(--border2)",
              color: "var(--text)",
              background: "var(--surface2)",
            }}
          >
            Preview Dashboard
          </Link>
        </div>
      </section>
    </div>
  );
}
