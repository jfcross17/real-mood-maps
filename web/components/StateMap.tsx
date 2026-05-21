"use client";

import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import * as topojson from "topojson-client";
import type { Topology } from "topojson-specification";
import type { StateData, MetricMode } from "@/lib/types";
import { scoreToColor } from "@/lib/utils";

// FIPS code → state name mapping (US Census)
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

interface StateMapProps {
  stateData: Record<string, StateData>;
  mode: MetricMode;
  onStateClick: (stateName: string, data: StateData) => void;
  blurred?: boolean;
}

interface TooltipState {
  visible: boolean;
  x: number;
  y: number;
  stateName: string;
  score: number;
}

export default function StateMap({
  stateData,
  mode,
  onStateClick,
  blurred = false,
}: StateMapProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [tooltip, setTooltip] = useState<TooltipState>({
    visible: false,
    x: 0,
    y: 0,
    stateName: "",
    score: 0,
  });
  const [topoData, setTopoData] = useState<Topology | null>(null);

  // Load TopoJSON once
  useEffect(() => {
    fetch("/us-states.json")
      .then((r) => r.json())
      .then(setTopoData)
      .catch(console.error);
  }, []);

  // Render map whenever data or mode changes
  useEffect(() => {
    if (!topoData || !svgRef.current || !containerRef.current) return;

    const container = containerRef.current;
    const width = container.clientWidth;
    const height = Math.round(width * 0.62);

    const svg = d3.select(svgRef.current);
    svg.attr("viewBox", `0 0 ${width} ${height}`).attr("width", "100%");

    // Clear previous render
    svg.selectAll("*").remove();

    const projection = d3
      .geoAlbersUsa()
      .fitSize([width, height], { type: "Sphere" });

    const path = d3.geoPath().projection(projection);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const states = topojson.feature(topoData as any, (topoData as any).objects.states);

    svg
      .append("g")
      .selectAll("path")
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .data((states as any).features)
      .join("path")
      .attr("class", "state-path")
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .attr("d", (d: any) => path(d) ?? "")
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .attr("fill", (d: any) => {
        const fips = String(d.id).padStart(2, "0");
        const stateName = FIPS_TO_STATE[fips];
        const data = stateName ? stateData[stateName] : null;
        const score = data ? data[mode] : 0;
        return scoreToColor(score, mode);
      })
      .attr("stroke", "#07080a")
      .attr("stroke-width", "0.8")
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .on("mousemove", (event: MouseEvent, d: any) => {
        const fips = String(d.id).padStart(2, "0");
        const stateName = FIPS_TO_STATE[fips] ?? "Unknown";
        const data = stateName ? stateData[stateName] : null;
        const score = data ? data[mode] : 0;
        const rect = container.getBoundingClientRect();
        setTooltip({
          visible: true,
          x: event.clientX - rect.left + 12,
          y: event.clientY - rect.top - 10,
          stateName,
          score,
        });
      })
      .on("mouseleave", () => {
        setTooltip((t) => ({ ...t, visible: false }));
      })
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .on("click", (_: MouseEvent, d: any) => {
        if (blurred) return;
        const fips = String(d.id).padStart(2, "0");
        const stateName = FIPS_TO_STATE[fips];
        if (stateName && stateData[stateName]) {
          onStateClick(stateName, stateData[stateName]);
        }
      });

    // State borders mesh
    svg
      .append("path")
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .datum(topojson.mesh(topoData as any, (topoData as any).objects.states, (a: any, b: any) => a !== b))
      .attr("fill", "none")
      .attr("stroke", "#07080a")
      .attr("stroke-width", "0.5")
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .attr("d", path as any);
  }, [topoData, stateData, mode, blurred, onStateClick]);

  const modeLabel =
    mode === "anxiety" ? "Anxiety" : mode === "hope" ? "Hope" : "Stress";

  return (
    <div ref={containerRef} className="relative w-full select-none">
      {/* Map SVG */}
      <div className={blurred ? "paywall-blur" : ""}>
        <svg ref={svgRef} className="w-full" />
      </div>

      {/* Tooltip */}
      {tooltip.visible && !blurred && (
        <div
          className="absolute pointer-events-none z-10 px-3 py-1.5 rounded text-sm"
          style={{
            left: tooltip.x,
            top: tooltip.y,
            background: "var(--surface2)",
            border: "1px solid var(--border2)",
            color: "var(--text)",
          }}
        >
          <span className="font-medium">{tooltip.stateName}</span>
          <span style={{ color: "var(--muted)" }}> — </span>
          <span
            style={{
              color:
                mode === "anxiety"
                  ? "var(--accent)"
                  : mode === "hope"
                    ? "var(--accent3)"
                    : "var(--accent2)",
            }}
          >
            {modeLabel}: {tooltip.score}
          </span>
        </div>
      )}

      {/* Legend */}
      <div className="absolute bottom-2 right-2 flex items-center gap-2">
        <span className="text-xs" style={{ color: "var(--muted)" }}>
          Low
        </span>
        <div
          className="h-2 w-20 rounded-full"
          style={{
            background:
              mode === "anxiety"
                ? "linear-gradient(to right, #6b7280, #e84c3d)"
                : mode === "hope"
                  ? "linear-gradient(to right, #6b7280, #10b981)"
                  : "linear-gradient(to right, #6b7280, #f59e0b)",
          }}
        />
        <span className="text-xs" style={{ color: "var(--muted)" }}>
          High
        </span>
      </div>
    </div>
  );
}
