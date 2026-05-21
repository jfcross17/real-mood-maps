interface SparklineProps {
  values: number[];
  width?: number;
  height?: number;
  stroke?: string;
  gradientId?: string;
}

export default function Sparkline({
  values,
  width = 400,
  height = 48,
  stroke = "#e8a04a",
  gradientId = "sparkGrad",
}: SparklineProps) {
  if (values.length < 2) return null;
  const max = Math.max(...values);
  const min = Math.min(...values);
  const range = max - min || 1;
  const step = width / (values.length - 1);
  const pts = values
    .map((v, i) => {
      const x = i * step;
      const y = ((v - min) / range) * (height - 8) + 4;
      return [x, y] as const;
    });
  const linePath = pts.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
  const fillPath = `${linePath} L${width},${height} L0,${height} Z`;
  const last = pts[pts.length - 1];

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
      className="mt-5 h-12 w-full"
      role="img"
      aria-label="Anxiety index trend over time"
    >
      <defs>
        <linearGradient id={gradientId} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={stroke} stopOpacity="0.5" />
          <stop offset="100%" stopColor={stroke} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={fillPath} fill={`url(#${gradientId})`} />
      <path d={linePath} fill="none" stroke={stroke} strokeWidth="1.75" />
      <circle cx={last[0]} cy={last[1]} r="3.5" fill={stroke} />
      <circle cx={last[0]} cy={last[1]} r="6" fill={stroke} opacity="0.3" />
    </svg>
  );
}
