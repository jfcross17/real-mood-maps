"use client";

import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Legend,
} from "recharts";
import { FLORIDA_TREND } from "@/lib/pulseData";

export default function FloridaTrendChart() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);
  return (
    <div className="border border-border bg-bg-card p-5 lg:p-7">
      <div className="mb-1.5 flex items-baseline justify-between font-mono text-[11px] uppercase tracking-[0.14em] text-accent">
        <span>Florida Anxiety · 90 Days</span>
        <span className="text-text-muted">vs. National Average</span>
      </div>
      <div
        className="mb-5 font-display text-sm italic text-text-muted"
        style={{ fontVariationSettings: '"opsz" 24' }}
      >
        the four-point jump, in context
      </div>
      <div className="h-72 w-full">
        {mounted && (
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={FLORIDA_TREND}
            margin={{ top: 16, right: 24, left: 0, bottom: 8 }}
          >
            <CartesianGrid
              strokeDasharray="2 4"
              stroke="var(--color-border)"
              vertical={false}
            />
            <XAxis
              dataKey="day"
              stroke="var(--color-text-dim)"
              tick={{ fontSize: 10, fontFamily: "var(--font-mono)" }}
              tickFormatter={(v) => (v === 0 ? "today" : `${v}d`)}
              ticks={[-89, -60, -30, 0]}
            />
            <YAxis
              stroke="var(--color-text-dim)"
              tick={{ fontSize: 10, fontFamily: "var(--font-mono)" }}
              domain={[14, 32]}
              width={32}
            />
            <Tooltip
              contentStyle={{
                background: "#07080d",
                border: "1px solid var(--color-accent)",
                fontFamily: "var(--font-mono)",
                fontSize: 11,
                color: "var(--color-text)",
              }}
              labelFormatter={(v) =>
                v === 0 ? "Today" : `${Math.abs(Number(v))} days ago`
              }
              formatter={(value, name) => [
                typeof value === "number" ? value.toFixed(1) : String(value),
                name === "florida" ? "Florida" : "National",
              ]}
            />
            <Legend
              wrapperStyle={{
                fontFamily: "var(--font-mono)",
                fontSize: 11,
                color: "var(--color-text-muted)",
                paddingTop: 12,
              }}
              formatter={(value) =>
                value === "florida" ? "Florida" : "National Average"
              }
            />
            <ReferenceLine
              x={0}
              stroke="var(--color-accent)"
              strokeDasharray="3 3"
              label={{
                value: "+4 this week",
                position: "insideTopRight",
                fill: "var(--color-accent)",
                fontSize: 11,
                fontFamily: "var(--font-mono)",
              }}
            />
            <Line
              type="monotone"
              dataKey="national"
              stroke="var(--color-text-dim)"
              strokeWidth={1.5}
              dot={false}
              activeDot={{ r: 4, fill: "var(--color-text-muted)" }}
            />
            <Line
              type="monotone"
              dataKey="florida"
              stroke="var(--color-red-5)"
              strokeWidth={2.5}
              dot={false}
              activeDot={{ r: 5, fill: "var(--color-red-5)" }}
            />
          </LineChart>
        </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
