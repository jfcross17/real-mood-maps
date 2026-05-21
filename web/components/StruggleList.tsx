import { STRUGGLES } from "@/lib/pulseData";

export default function StruggleList() {
  return (
    <div className="border border-border bg-bg-card p-7">
      <div className="mb-1.5 font-mono text-[11px] uppercase tracking-[0.14em] text-accent">
        What People Are Struggling With
      </div>
      <div
        className="mb-5 font-display text-sm italic text-text-muted"
        style={{ fontVariationSettings: '"opsz" 24' }}
      >
        top search themes, this week
      </div>
      {STRUGGLES.map((row, i) => (
        <div
          key={row.name}
          className={`flex items-center justify-between py-3.5 ${
            i < STRUGGLES.length - 1 ? "border-b border-border" : ""
          }`}
        >
          <div>
            <div className="text-sm font-medium text-text">{row.name}</div>
            <div
              className="mt-1 font-display text-xs italic text-text-dim"
              style={{ fontVariationSettings: '"opsz" 14' }}
            >
              {row.detail}
            </div>
          </div>
          <div
            className="font-display text-2xl text-accent"
            style={{ fontVariationSettings: '"opsz" 48, "wght" 500' }}
          >
            {row.pct}%
          </div>
        </div>
      ))}
    </div>
  );
}
