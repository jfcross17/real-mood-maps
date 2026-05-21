"use client";

import { useEffect, useRef } from "react";
import type { StateData } from "@/lib/types";
import { velocityLabel } from "@/lib/utils";

interface StateModalProps {
  stateName: string;
  data: StateData;
  onClose: () => void;
}

function ScoreBar({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex justify-between items-center">
        <span
          className="text-xs uppercase tracking-widest mono"
          style={{ color: "var(--muted)" }}
        >
          {label}
        </span>
        <span className="text-sm font-semibold" style={{ color }}>
          {value}
        </span>
      </div>
      <div
        className="h-1.5 rounded-full overflow-hidden"
        style={{ background: "var(--border2)" }}
      >
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${value}%`, background: color }}
        />
      </div>
    </div>
  );
}

export default function StateModal({
  stateName,
  data,
  onClose,
}: StateModalProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const velocity = data.velocity ?? 0;
  const velocityDir = velocity > 0 ? "+" : "";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.7)" }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={ref}
        className="w-full max-w-lg rounded-xl p-6 flex flex-col gap-6 max-h-[90vh] overflow-y-auto"
        style={{
          background: "var(--surface)",
          border: "1px solid var(--border2)",
        }}
      >
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h2
              className="display-font text-3xl"
              style={{ color: "var(--text)" }}
            >
              {stateName.toUpperCase()}
            </h2>
            {data.velocity !== undefined && (
              <p className="text-sm mt-1" style={{ color: "var(--muted)" }}>
                Anxiety {velocityDir}
                {velocity} pts —{" "}
                <span
                  style={{
                    color:
                      velocity > 0
                        ? "var(--accent)"
                        : velocity < 0
                          ? "var(--accent3)"
                          : "var(--muted)",
                  }}
                >
                  {velocityLabel(velocity)}
                </span>
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-2xl leading-none transition-opacity hover:opacity-60"
            style={{ color: "var(--muted)" }}
            aria-label="Close"
          >
            &times;
          </button>
        </div>

        {/* Emotion scores */}
        <div className="flex flex-col gap-3">
          <p
            className="text-xs uppercase tracking-widest mono"
            style={{ color: "var(--muted2)" }}
          >
            Emotional Scores
          </p>
          <ScoreBar label="Anxiety" value={data.anxiety} color="var(--accent)" />
          <ScoreBar
            label="Stress"
            value={data.stress}
            color="var(--accent2)"
          />
          <ScoreBar
            label="Fear"
            value={data.fear}
            color="#ef4444"
          />
          <ScoreBar
            label="Hope"
            value={data.hope}
            color="var(--accent3)"
          />
          <ScoreBar
            label="Depression"
            value={data.depression}
            color="var(--muted)"
          />
        </div>

        {/* Top concerns */}
        {data.top_concerns && data.top_concerns.length > 0 && (
          <div className="flex flex-col gap-3">
            <p
              className="text-xs uppercase tracking-widest mono"
              style={{ color: "var(--muted2)" }}
            >
              Top Concerns
            </p>
            <div className="flex flex-col gap-2">
              {data.top_concerns.slice(0, 5).map((item, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between rounded-lg px-3 py-2"
                  style={{ background: "var(--surface2)" }}
                >
                  <span
                    className="text-sm capitalize"
                    style={{ color: "var(--text)" }}
                  >
                    {item.concern}
                  </span>
                  <span
                    className="text-xs mono"
                    style={{ color: "var(--muted)" }}
                  >
                    {item.value.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Hope drivers */}
        {data.hope_drivers && data.hope_drivers.length > 0 && (
          <div className="flex flex-col gap-3">
            <p
              className="text-xs uppercase tracking-widest mono"
              style={{ color: "var(--muted2)" }}
            >
              Hope Drivers
            </p>
            <div className="flex flex-col gap-2">
              {data.hope_drivers.slice(0, 3).map((item, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between rounded-lg px-3 py-2"
                  style={{ background: "var(--surface2)" }}
                >
                  <span
                    className="text-sm capitalize"
                    style={{ color: "var(--accent3)" }}
                  >
                    {item.hope_driver}
                  </span>
                  <span
                    className="text-xs mono"
                    style={{ color: "var(--muted)" }}
                  >
                    {item.value.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
