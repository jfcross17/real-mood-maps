import { HERO } from "@/lib/pulseData";
import Sparkline from "./Sparkline";

function HeroLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-4 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-text-muted">
      <span className="h-px w-3.5 bg-accent" />
      {children}
    </div>
  );
}

export default function HeroStrip() {
  return (
    <section className="relative mb-8 grid grid-cols-1 overflow-hidden border border-border bg-bg-elevated lg:grid-cols-[1.4fr_1fr_1fr]">
      <span className="absolute inset-x-0 top-0 h-0.5 bg-[linear-gradient(90deg,var(--color-accent-warm),var(--color-accent),var(--color-accent-cool))]" />

      <div className="border-b border-border px-8 py-8 lg:border-b-0 lg:border-r">
        <HeroLabel>National Anxiety Index</HeroLabel>
        <div
          className="flex items-baseline gap-3.5 font-display leading-[0.85] tracking-[-0.05em] text-text"
          style={{
            fontVariationSettings: '"opsz" 144, "SOFT" 60, "wght" 500',
            fontSize: "110px",
          }}
        >
          {HERO.anxietyIndex}
          <span className="font-mono text-lg font-normal text-text-dim">/10</span>
        </div>
        <div
          className="mt-3.5 max-w-[380px] font-display italic text-text"
          style={{ fontVariationSettings: '"opsz" 36', fontSize: "19px", lineHeight: 1.35 }}
        >
          {HERO.anxietyCaption}
        </div>
        <div className="mt-4 inline-flex items-center gap-2 font-mono text-xs text-red-5">
          {HERO.anxietyDelta}
        </div>
        <Sparkline values={HERO.sparkline} />
      </div>

      <div className="border-b border-border px-8 py-8 lg:border-b-0 lg:border-r">
        <HeroLabel>Market Sentiment</HeroLabel>
        <div
          className="font-display leading-none tracking-[-0.03em] text-accent"
          style={{
            fontVariationSettings: '"opsz" 144, "SOFT" 60, "wght" 500',
            fontSize: "64px",
          }}
        >
          {HERO.marketSentiment}
        </div>
        <div className="mt-3 font-mono text-[11px] uppercase tracking-[0.12em] text-text-muted">
          {HERO.marketCaption}
        </div>
        <div
          className="mt-4 font-display italic text-text"
          style={{ fontVariationSettings: '"opsz" 24', fontSize: "16px", lineHeight: 1.5 }}
        >
          {HERO.marketDetail}
        </div>
      </div>

      <div className="px-8 py-8">
        <HeroLabel>{"Today’s Movers"}</HeroLabel>
        <ul className="mt-2">
          {HERO.movers.map((m, i) => (
            <li
              key={m.state}
              className={`flex items-baseline justify-between py-2.5 text-[13px] ${
                i < HERO.movers.length - 1 ? "border-b border-dashed border-border" : ""
              }`}
            >
              <span className="text-text-muted">{m.state}</span>
              <span className="font-mono font-medium text-text">
                {m.value}{" "}
                <span className={m.delta > 0 ? "text-red-5" : "text-green"}>
                  {m.delta > 0 ? "▲" : "▼"} {Math.abs(m.delta)}
                </span>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
