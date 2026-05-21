import type { RankingEntry } from "@/lib/pulseData";

interface RankingListProps {
  title: string;
  subtitle: string;
  rows: RankingEntry[];
  tone: "high" | "low";
}

export default function RankingList({
  title,
  subtitle,
  rows,
  tone,
}: RankingListProps) {
  return (
    <div className="border border-border bg-bg-card p-7">
      <div className="mb-1.5 font-mono text-[11px] uppercase tracking-[0.14em] text-accent">
        {title}
      </div>
      <div
        className="mb-5 font-display text-sm italic text-text-muted"
        style={{ fontVariationSettings: '"opsz" 24' }}
      >
        {subtitle}
      </div>
      <ol className="list-none">
        {rows.map((r, i) => (
          <li
            key={r.state}
            className={`grid grid-cols-[28px_1fr_auto] items-center gap-3.5 py-3 ${
              i < rows.length - 1 ? "border-b border-border" : ""
            }`}
          >
            <span
              className="font-display italic text-[18px] text-accent"
              style={{ fontVariationSettings: '"opsz" 24, "wght" 500' }}
            >
              {r.rank}
            </span>
            <span className="text-sm font-medium text-text">
              {r.state}
              <span
                className={`ml-2 font-mono text-[10px] font-normal ${
                  r.direction === "up" ? "text-red-5" : "text-green"
                }`}
              >
                {r.direction === "up" ? "▲" : "▼"} {r.delta}
              </span>
            </span>
            <span
              className={`font-mono text-[15px] font-semibold ${
                tone === "high" ? "text-red-5" : "text-green"
              }`}
            >
              {r.value}
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}
