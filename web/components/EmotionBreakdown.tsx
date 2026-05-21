import { EMOTION_BREAKDOWN } from "@/lib/pulseData";

const TONE_CLASS: Record<string, string> = {
  hot: "bg-red-5",
  warn: "bg-accent",
  calm: "bg-green",
};

export default function EmotionBreakdown() {
  return (
    <div className="mb-7 border border-border bg-bg-card p-7">
      <div className="mb-1.5 font-mono text-[11px] uppercase tracking-[0.14em] text-accent">
        Emotion Breakdown
      </div>
      <div
        className="mb-5 font-display text-sm italic text-text-muted"
        style={{ fontVariationSettings: '"opsz" 24' }}
      >
        a portrait of the week
      </div>
      {EMOTION_BREAKDOWN.map((row) => (
        <div
          key={row.label}
          className="grid grid-cols-[110px_1fr_40px] items-center gap-3.5 py-2.5"
        >
          <span className="text-[13px] text-text-muted">{row.label}</span>
          <div className="relative h-[5px] overflow-hidden rounded-sm bg-border">
            <div
              className={`absolute inset-y-0 left-0 rounded-sm ${TONE_CLASS[row.tone]} transition-[width] duration-700`}
              style={{ width: `${row.pct}%` }}
            />
          </div>
          <span className="text-right font-mono text-sm font-semibold text-text">
            {row.value}
          </span>
        </div>
      ))}
    </div>
  );
}
