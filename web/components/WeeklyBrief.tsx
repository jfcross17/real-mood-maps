import { BRIEF_STATS } from "@/lib/pulseData";

export default function WeeklyBrief() {
  return (
    <section
      id="brief"
      className="relative mt-16 grid grid-cols-1 overflow-hidden border border-border bg-bg-elevated lg:grid-cols-[1.5fr_1fr]"
    >
      <span
        aria-hidden
        className="pointer-events-none absolute -left-[10%] -top-1/2 h-[200%] w-[70%]"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(232, 160, 74, 0.08), transparent 60%)",
        }}
      />
      <div className="relative z-10 px-8 py-12 lg:px-14 lg:py-14">
        <div className="mb-4 flex items-center gap-2.5 font-mono text-[11px] uppercase tracking-[0.18em] text-accent">
          <span className="h-px w-6 bg-accent" />
          The Weekly Brief
        </div>
        <h2
          className="mb-5 font-display leading-[1.05] tracking-[-0.03em]"
          style={{
            fontVariationSettings: '"opsz" 144, "SOFT" 40, "wght" 500',
            fontSize: "clamp(34px, 4.2vw, 46px)",
          }}
        >
          Read the country{" "}
          <em
            className="not-italic text-accent"
            style={{
              fontStyle: "italic",
              fontVariationSettings: '"opsz" 144, "SOFT" 80, "wght" 500',
            }}
          >
            before
          </em>{" "}
          the polls do.
        </h2>
        <p
          className="mb-7 max-w-[500px] font-display text-text-muted"
          style={{
            fontVariationSettings: '"opsz" 24',
            fontSize: "17px",
            lineHeight: 1.55,
          }}
        >
          {`Every Monday at 6 AM, we send political consultants, campaign strategists, and policy teams a 5-minute briefing on what shifted, what’s heating up, and which states are moving against the national grain. No charts you’ve already seen. No takes.`}
        </p>
        <form
          className="flex max-w-[480px] flex-col gap-2 sm:flex-row sm:gap-0"
          action="#"
          method="post"
          aria-label="Subscribe to the Weekly Brief"
        >
          <label htmlFor="brief-email" className="sr-only">
            Email address
          </label>
          <input
            id="brief-email"
            type="email"
            name="email"
            required
            placeholder="you@strategy-firm.com"
            className="flex-1 border border-border-strong bg-bg px-5 py-3.5 text-sm text-text outline-none placeholder:text-text-dim focus:border-accent sm:border-r-0"
          />
          <button
            type="submit"
            className="cursor-pointer border border-accent bg-accent px-7 text-[13px] font-semibold tracking-[0.02em] text-bg transition-colors hover:bg-[#f5b35a]"
          >
            Subscribe →
          </button>
        </form>
        <div className="mt-4 font-mono text-[10px] uppercase tracking-[0.08em] text-text-dim">
          Free tier · Pro from $99/mo · Unsubscribe anytime
        </div>
      </div>
      <div className="relative z-10 border-t border-border bg-bg/50 px-10 py-12 lg:border-l lg:border-t-0 lg:px-11 lg:py-14">
        {BRIEF_STATS.map((s, i) => (
          <div key={s.label} className={i < BRIEF_STATS.length - 1 ? "mb-8" : ""}>
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
                {s.italicPart}
              </em>
              {s.suffix}
            </div>
            <div className="mt-2.5 font-mono text-[10px] uppercase tracking-[0.14em] text-text-muted">
              {s.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
