"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import * as d3 from "d3";
import { feature, mesh } from "topojson-client";
import type {
  Topology,
  GeometryCollection,
  GeometryObject,
} from "topojson-specification";
import type { Feature, FeatureCollection, Geometry } from "geojson";
import type { EmotionKey, StateValue } from "@/lib/pulseData";
import { STATES_BY_NAME } from "@/lib/pulseData";

const FIPS_TO_STATE: Record<string, string> = {
  "01": "Alabama", "02": "Alaska", "04": "Arizona", "05": "Arkansas",
  "06": "California", "08": "Colorado", "09": "Connecticut", "10": "Delaware",
  "11": "District of Columbia", "12": "Florida", "13": "Georgia", "15": "Hawaii",
  "16": "Idaho", "17": "Illinois", "18": "Indiana", "19": "Iowa",
  "20": "Kansas", "21": "Kentucky", "22": "Louisiana", "23": "Maine",
  "24": "Maryland", "25": "Massachusetts", "26": "Michigan", "27": "Minnesota",
  "28": "Mississippi", "29": "Missouri", "30": "Montana", "31": "Nebraska",
  "32": "Nevada", "33": "New Hampshire", "34": "New Jersey", "35": "New Mexico",
  "36": "New York", "37": "North Carolina", "38": "North Dakota", "39": "Ohio",
  "40": "Oklahoma", "41": "Oregon", "42": "Pennsylvania", "44": "Rhode Island",
  "45": "South Carolina", "46": "South Dakota", "47": "Tennessee", "48": "Texas",
  "49": "Utah", "50": "Vermont", "51": "Virginia", "53": "Washington",
  "54": "West Virginia", "55": "Wisconsin", "56": "Wyoming",
};

const TABS: { key: EmotionKey; label: string }[] = [
  { key: "anxiety", label: "Anxiety" },
  { key: "hope", label: "Hope" },
  { key: "anxiety_vs_hope", label: "Anxiety vs. Hope" },
  { key: "stress", label: "Stress" },
  { key: "depression", label: "Depression" },
];

const RED_SCALE = ["#2a1d1a", "#4a261f", "#7a3528", "#a84432", "#d65838"];

function pickValue(s: StateValue | undefined, mode: EmotionKey): number {
  if (!s) return 0;
  if (mode === "anxiety_vs_hope") return s.anxiety - s.hope;
  return s[mode];
}

function colorForValue(v: number, mode: EmotionKey): string {
  if (mode === "anxiety_vs_hope") {
    const clamped = Math.max(-15, Math.min(15, v));
    const t = (clamped + 15) / 30;
    if (t < 0.5) {
      const g = (0.5 - t) * 2;
      const i = Math.min(4, Math.floor(g * 5));
      return ["#6ba292", "#5a8e82", "#496f70", "#3a4f5a", "#2d3a47"][i];
    }
    const i = Math.min(4, Math.floor((t - 0.5) * 2 * 5));
    return RED_SCALE[i];
  }
  const max = mode === "hope" ? 28 : 35;
  const min = mode === "hope" ? 14 : 13;
  const norm = Math.max(0, Math.min(1, (v - min) / (max - min)));
  const i = Math.min(4, Math.floor(norm * 5));
  return RED_SCALE[i];
}

interface Tip {
  visible: boolean;
  x: number;
  y: number;
  state: string;
  value: number;
  mode: EmotionKey;
}

interface MapStateFeature extends Feature<Geometry, { name?: string }> {
  id?: string | number;
}

export default function EmotionalMap() {
  const [mode, setMode] = useState<EmotionKey>("anxiety");
  const [topo, setTopo] = useState<Topology | null>(null);
  const [size, setSize] = useState({ w: 800, h: 500 });
  const [tip, setTip] = useState<Tip>({
    visible: false,
    x: 0,
    y: 0,
    state: "",
    value: 0,
    mode: "anxiety",
  });
  const wrapRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    fetch("/us-states.json")
      .then((r) => r.json())
      .then(setTopo)
      .catch(() => setTopo(null));
  }, []);

  useEffect(() => {
    const update = () => {
      const el = wrapRef.current;
      if (!el) return;
      const w = el.clientWidth;
      setSize({ w, h: Math.round(w * 0.625) });
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const { features, borders, projection } = useMemo(() => {
    if (!topo)
      return {
        features: [] as MapStateFeature[],
        borders: "",
        projection: null,
      };
    const statesCollection = topo.objects.states as GeometryCollection;
    const fc = feature(topo, statesCollection) as FeatureCollection<
      Geometry,
      { name?: string }
    >;
    const proj = d3
      .geoAlbersUsa()
      .fitSize([size.w, size.h], fc);
    const path = d3.geoPath(proj);
    const meshGeo = mesh(
      topo,
      statesCollection as unknown as GeometryObject,
      (a, b) => a !== b
    );
    return {
      features: fc.features as MapStateFeature[],
      borders: path(meshGeo) ?? "",
      projection: path,
    };
  }, [topo, size]);

  return (
    <div className="border border-border bg-bg-card p-6 pb-8 lg:p-7 lg:pb-8">
      <div className="card-title-row mb-5">
        <div
          role="tablist"
          aria-label="Choose emotion to visualize"
          className="flex gap-1 overflow-x-auto border-b border-border"
        >
          {TABS.map((t) => {
            const active = t.key === mode;
            return (
              <button
                key={t.key}
                role="tab"
                aria-selected={active}
                onClick={() => setMode(t.key)}
                className={`-mb-px cursor-pointer border-b-2 px-4 py-2.5 text-[13px] font-medium transition-colors ${
                  active
                    ? "border-accent text-text"
                    : "border-transparent text-text-muted hover:text-text"
                }`}
              >
                {t.label}
              </button>
            );
          })}
        </div>
      </div>

      <div ref={wrapRef} className="relative w-full" style={{ aspectRatio: "16 / 10" }}>
        <svg
          ref={svgRef}
          viewBox={`0 0 ${size.w} ${size.h}`}
          width="100%"
          height="100%"
        >
          <g>
            {projection &&
              features.map((f) => {
                const fips = String(f.id ?? "").padStart(2, "0");
                const stateName = FIPS_TO_STATE[fips];
                const sv = stateName ? STATES_BY_NAME[stateName] : undefined;
                const v = pickValue(sv, mode);
                const fill = colorForValue(v, mode);
                const d = projection(f) ?? "";
                if (!d || !stateName) return null;
                return (
                  <path
                    key={fips}
                    d={d}
                    fill={fill}
                    className="us-state-path"
                    tabIndex={0}
                    role="button"
                    aria-label={`${stateName}: ${v}`}
                    onMouseMove={(e) => {
                      const rect = wrapRef.current?.getBoundingClientRect();
                      if (!rect) return;
                      setTip({
                        visible: true,
                        x: e.clientX - rect.left,
                        y: e.clientY - rect.top,
                        state: stateName,
                        value: v,
                        mode,
                      });
                    }}
                    onMouseLeave={() =>
                      setTip((t) => ({ ...t, visible: false }))
                    }
                    onFocus={() => {
                      setTip({
                        visible: true,
                        x: size.w / 2,
                        y: size.h / 2,
                        state: stateName,
                        value: v,
                        mode,
                      });
                    }}
                    onBlur={() => setTip((t) => ({ ...t, visible: false }))}
                  />
                );
              })}
          </g>
          {borders && (
            <path
              d={borders}
              fill="none"
              stroke="var(--color-bg)"
              strokeWidth="0.6"
              pointerEvents="none"
            />
          )}
        </svg>

        {tip.visible && (
          <div
            className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-[125%] whitespace-nowrap border border-accent bg-[#07080d] px-4 py-3 font-mono text-[11px] text-text shadow-2xl"
            style={{ left: tip.x, top: tip.y }}
          >
            <div
              className="mb-1.5 font-display text-base text-text"
              style={{ fontVariationSettings: '"opsz" 24, "wght" 600' }}
            >
              {tip.state}
            </div>
            <div className="flex justify-between gap-5">
              <span>
                {tip.mode === "anxiety_vs_hope"
                  ? "Anxiety − Hope"
                  : tip.mode.charAt(0).toUpperCase() + tip.mode.slice(1)}
              </span>
              <span className="font-semibold text-accent">
                {tip.mode === "anxiety_vs_hope" && tip.value > 0 ? "+" : ""}
                {tip.value}
              </span>
            </div>
          </div>
        )}
      </div>

      <div className="mt-5">
        <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.12em] text-text-muted">
          <span>Calm</span>
          <div className="h-2 flex-1 bg-[linear-gradient(90deg,var(--color-red-1),var(--color-red-2),var(--color-red-3),var(--color-red-4),var(--color-red-5))]" />
          <span>Anxious</span>
        </div>
        <div className="mt-2 flex justify-between font-mono text-[10px] text-text-dim">
          <span>10</span>
          <span>15</span>
          <span>20</span>
          <span>25</span>
          <span>30+</span>
        </div>
      </div>
    </div>
  );
}
