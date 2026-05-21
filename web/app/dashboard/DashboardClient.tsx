"use client";

import { useState } from "react";
import Link from "next/link";
import StateMap from "@/components/StateMap";
import MetricCard from "@/components/MetricCard";
import StateModal from "@/components/StateModal";
import type { SnapshotData, StateData, MetricMode, SubscriptionTier } from "@/lib/types";
import { formatDate } from "@/lib/utils";

interface DashboardClientProps {
  snapshot: SnapshotData;
  tier: SubscriptionTier;
}

const MODE_OPTIONS: { value: MetricMode; label: string }[] = [
  { value: "anxiety", label: "Anxiety" },
  { value: "hope", label: "Hope" },
  { value: "stress", label: "Stress" },
];

export default function DashboardClient({ snapshot, tier }: DashboardClientProps) {
  const [mode, setMode] = useState<MetricMode>("anxiety");
  const [selectedState, setSelectedState] = useState<{
    name: string;
    data: StateData;
  } | null>(null);

  const isPaid = tier === "pro" || tier === "agency";
  const { national_stats, state_data, last_updated } = snapshot;

  // Top 3 most anxious states for the sidebar
  const topAnxietyStates = Object.entries(state_data)
    .sort((a, b) => b[1].anxiety - a[1].anxiety)
    .slice(0, 5);

  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      {/* Top bar */}
      <div
        className="sticky top-14 z-40"
        style={{
          background: "var(--surface)",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <span
              className="display-font text-xl"
              style={{ color: "var(--text)" }}
            >
              NATIONAL PULSE
            </span>
            <span
              className="mono text-xs px-2 py-0.5 rounded"
              style={{
                background: "rgba(16,185,129,0.1)",
                color: "var(--accent3)",
                border: "1px solid rgba(16,185,129,0.2)",
              }}
            >
              LIVE
            </span>
          </div>

          {/* Mode toggle */}
          <div
            className="flex rounded overflow-hidden"
            style={{ border: "1px solid var(--border2)" }}
          >
            {MODE_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setMode(opt.value)}
                className="px-4 py-1.5 text-sm font-medium transition-all"
                style={{
                  background:
                    mode === opt.value ? "var(--accent)" : "transparent",
                  color:
                    mode === opt.value ? "white" : "var(--muted)",
                }}
              >
                {opt.label}
              </button>
            ))}
          </div>

          <p className="text-xs mono hidden md:block" style={{ color: "var(--muted)" }}>
            Updated {formatDate(last_updated)}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* National metrics row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <MetricCard
            label="National Anxiety"
            value={national_stats.national_anxiety}
            accentColor="var(--accent)"
            subtext="avg across 50 states"
          />
          <MetricCard
            label="National Hope"
            value={national_stats.national_hope}
            accentColor="var(--accent3)"
            subtext="avg across 50 states"
          />
          <MetricCard
            label="National Stress"
            value={national_stats.national_stress}
            accentColor="var(--accent2)"
            subtext="avg across 50 states"
          />
          <MetricCard
            label="Fear Index"
            value={national_stats.fear_index ?? 0}
            accentColor="#ef4444"
            subtext="recession / market fear"
          />
        </div>

        {/* Main layout: map + sidebar */}
        <div className="grid lg:grid-cols-[1fr_300px] gap-6">
          {/* Map panel */}
          <div
            className="rounded-lg overflow-hidden relative"
            style={{
              background: "var(--surface)",
              border: "1px solid var(--border)",
            }}
          >
            <div className="px-5 py-4 flex items-center justify-between" style={{ borderBottom: "1px solid var(--border)" }}>
              <p className="text-sm font-semibold" style={{ color: "var(--text)" }}>
                {mode === "anxiety"
                  ? "Anxiety"
                  : mode === "hope"
                    ? "Hope"
                    : "Stress"}{" "}
                by State
              </p>
              {!isPaid && (
                <span className="text-xs" style={{ color: "var(--muted)" }}>
                  Click any state to view details — requires Pro
                </span>
              )}
            </div>

            <div className="p-4 relative">
              <StateMap
                stateData={state_data}
                mode={mode}
                onStateClick={(name, data) =>
                  isPaid ? setSelectedState({ name, data }) : null
                }
                blurred={false}
              />

              {/* Paywall overlay */}
              {!isPaid && (
                <div
                  className="absolute inset-0 flex items-center justify-center rounded-lg"
                  style={{
                    background:
                      "linear-gradient(to top, rgba(7,8,10,0.95) 0%, rgba(7,8,10,0.3) 60%, transparent 100%)",
                    pointerEvents: "none",
                  }}
                >
                  <div
                    className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center px-8 py-5 rounded-lg"
                    style={{
                      background: "var(--surface)",
                      border: "1px solid var(--border2)",
                      pointerEvents: "all",
                    }}
                  >
                    <p
                      className="text-sm font-semibold mb-1"
                      style={{ color: "var(--text)" }}
                    >
                      State-level detail requires Pro
                    </p>
                    <p
                      className="text-xs mb-3"
                      style={{ color: "var(--muted)" }}
                    >
                      Click any state to see concerns, hope drivers, and velocity
                    </p>
                    <Link
                      href="/pricing"
                      className="inline-block px-5 py-1.5 rounded text-sm font-semibold"
                      style={{ background: "var(--accent)", color: "white" }}
                    >
                      Upgrade to Pro &rarr;
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="flex flex-col gap-4">
            {/* Top concerns nationally */}
            <div
              className="rounded-lg p-5"
              style={{
                background: "var(--surface)",
                border: "1px solid var(--border)",
              }}
            >
              <p
                className="text-xs mono uppercase tracking-widest mb-4"
                style={{ color: "var(--muted)" }}
              >
                Top National Concerns
              </p>
              <div className="flex flex-col gap-2">
                {(national_stats.top_national_concerns ?? []).map(([concern, value], i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between text-sm"
                  >
                    <span
                      className="capitalize truncate max-w-[180px]"
                      style={{ color: "var(--text)" }}
                    >
                      {concern}
                    </span>
                    <span className="mono text-xs" style={{ color: "var(--muted)" }}>
                      {value.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Top hope drivers nationally */}
            <div
              className="rounded-lg p-5"
              style={{
                background: "var(--surface)",
                border: "1px solid var(--border)",
              }}
            >
              <p
                className="text-xs mono uppercase tracking-widest mb-4"
                style={{ color: "var(--muted)" }}
              >
                Top Hope Drivers
              </p>
              <div className="flex flex-col gap-2">
                {(national_stats.top_national_hope_drivers ?? []).map(
                  ([driver, value], i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between text-sm"
                    >
                      <span
                        className="capitalize truncate max-w-[180px]"
                        style={{ color: "var(--accent3)" }}
                      >
                        {driver}
                      </span>
                      <span className="mono text-xs" style={{ color: "var(--muted)" }}>
                        {value.toLocaleString()}
                      </span>
                    </div>
                  )
                )}
              </div>
            </div>

            {/* Highest anxiety states */}
            <div
              className="rounded-lg p-5"
              style={{
                background: "var(--surface)",
                border: "1px solid var(--border)",
              }}
            >
              <p
                className="text-xs mono uppercase tracking-widest mb-4"
                style={{ color: "var(--muted)" }}
              >
                Highest Anxiety States
              </p>
              <div className="flex flex-col gap-2">
                {topAnxietyStates.map(([name, data], i) => (
                  <div
                    key={name}
                    className="flex items-center justify-between text-sm"
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className="mono text-xs w-4"
                        style={{ color: "var(--muted2)" }}
                      >
                        {i + 1}
                      </span>
                      <button
                        onClick={() =>
                          isPaid
                            ? setSelectedState({ name, data })
                            : null
                        }
                        className="truncate max-w-[140px] text-left"
                        style={{
                          color: isPaid ? "var(--text)" : "var(--muted)",
                          cursor: isPaid ? "pointer" : "default",
                        }}
                      >
                        {name}
                      </button>
                    </div>
                    <span
                      className="font-semibold"
                      style={{ color: "var(--accent)" }}
                    >
                      {data.anxiety}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {!isPaid && (
              <Link
                href="/pricing"
                className="rounded-lg p-5 text-center block"
                style={{
                  background: "rgba(232,76,61,0.08)",
                  border: "1px solid rgba(232,76,61,0.2)",
                }}
              >
                <p
                  className="text-sm font-semibold mb-1"
                  style={{ color: "var(--accent)" }}
                >
                  Unlock Full Dashboard
                </p>
                <p className="text-xs" style={{ color: "var(--muted)" }}>
                  State detail, history charts, CSV export
                </p>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* State modal */}
      {selectedState && (
        <StateModal
          stateName={selectedState.name}
          data={selectedState.data}
          onClose={() => setSelectedState(null)}
        />
      )}
    </div>
  );
}
