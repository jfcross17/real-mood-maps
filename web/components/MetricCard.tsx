interface MetricCardProps {
  label: string;
  value: number | string;
  subtext?: string;
  accentColor?: string;
  trend?: "up" | "down" | "neutral";
  trendValue?: number;
}

export default function MetricCard({
  label,
  value,
  subtext,
  accentColor = "var(--accent)",
  trend,
  trendValue,
}: MetricCardProps) {
  return (
    <div
      className="rounded-lg p-5 flex flex-col gap-2"
      style={{
        background: "var(--surface)",
        border: "1px solid var(--border)",
      }}
    >
      <span
        className="text-xs font-semibold uppercase tracking-widest mono"
        style={{ color: "var(--muted)" }}
      >
        {label}
      </span>

      <div className="flex items-end gap-3">
        <span
          className="display-font text-5xl leading-none"
          style={{ color: accentColor }}
        >
          {typeof value === "number" ? value.toFixed(1) : value}
        </span>
        <span className="text-sm pb-1" style={{ color: "var(--muted)" }}>
          / 100
        </span>
      </div>

      {(subtext || trend) && (
        <div className="flex items-center gap-2 mt-1">
          {trend && trendValue !== undefined && (
            <span
              className="text-xs font-medium"
              style={{
                color:
                  trend === "up"
                    ? "var(--accent)"
                    : trend === "down"
                      ? "var(--accent3)"
                      : "var(--muted)",
              }}
            >
              {trend === "up" ? "+" : ""}
              {trendValue.toFixed(1)}
            </span>
          )}
          {subtext && (
            <span className="text-xs" style={{ color: "var(--muted)" }}>
              {subtext}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
