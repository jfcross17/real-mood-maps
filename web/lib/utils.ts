import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Map a 0–100 score to a color on the anxiety/hope gradient */
export function scoreToColor(
  score: number,
  mode: "anxiety" | "hope" | "stress" = "anxiety"
): string {
  const clamped = Math.max(0, Math.min(100, score));
  const t = clamped / 100;

  if (mode === "hope") {
    // Low hope = gray, high hope = green
    const r = Math.round(107 + (16 - 107) * t);
    const g = Math.round(114 + (185 - 114) * t);
    const b = Math.round(128 + (129 - 128) * t);
    return `rgb(${r},${g},${b})`;
  }

  if (mode === "stress") {
    // Low = neutral, high = amber
    const r = Math.round(107 + (245 - 107) * t);
    const g = Math.round(114 + (158 - 114) * t);
    const b = Math.round(128 + (11 - 128) * t);
    return `rgb(${r},${g},${b})`;
  }

  // anxiety: low = muted gray, high = red
  const r = Math.round(107 + (232 - 107) * t);
  const g = Math.round(114 + (76 - 114) * t);
  const b = Math.round(128 + (61 - 128) * t);
  return `rgb(${r},${g},${b})`;
}

export function formatScore(score: number): string {
  return score.toFixed(0);
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function velocityLabel(velocity: number): string {
  if (velocity > 5) return "surging";
  if (velocity > 2) return "rising";
  if (velocity < -5) return "falling fast";
  if (velocity < -2) return "easing";
  return "stable";
}
