import { ISSUE, MASTHEAD } from "@/lib/pulseData";

export default function Masthead() {
  return (
    <header className="relative mx-auto max-w-[1320px] px-4 pb-8 pt-12 lg:px-8">
      <div className="mb-6 flex items-baseline justify-between border-b-2 border-text pb-4">
        <div className="font-mono text-[11px] uppercase tracking-[0.16em] text-text-muted">
          Issue <strong className="font-semibold text-accent">№ {ISSUE.number}</strong> ·{" "}
          {ISSUE.weekdayDate} ·{" "}
          <strong className="font-semibold text-accent">{ISSUE.volume}</strong>
        </div>
        <div
          className="hidden font-display text-sm italic text-text-muted md:block"
          style={{ fontVariationSettings: '"opsz" 144' }}
        >
          A weekly reading of the American mood
        </div>
      </div>
      <h1
        className="mb-5 max-w-[1100px] font-display leading-[0.95] tracking-[-0.035em]"
        style={{
          fontVariationSettings: '"opsz" 144, "SOFT" 30, "wght" 500',
          fontSize: "clamp(40px, 6vw, 76px)",
        }}
      >
        {MASTHEAD.headlinePrefix}{" "}
        <em
          className="not-italic text-accent"
          style={{
            fontStyle: "italic",
            fontVariationSettings: '"opsz" 144, "SOFT" 80, "wght" 500',
          }}
        >
          {MASTHEAD.headlineAccent}
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
        {MASTHEAD.dek}
      </p>
      <div className="mt-6 font-mono text-[11px] uppercase tracking-[0.12em] text-text-dim">
        Reported by <strong className="font-medium text-text-muted">The Pulse Desk</strong> · Data from{" "}
        <strong className="font-medium text-text-muted">{ISSUE.dataPointsLabel}</strong> · Updated every 60 seconds
      </div>
    </header>
  );
}
