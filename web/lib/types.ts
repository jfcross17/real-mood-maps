export interface ConcernItem {
  concern: string;
  value: number;
  related_searches: string[];
}

export interface HopeDriverItem {
  hope_driver: string;
  value: number;
  related_searches: string[];
}

export interface StateData {
  anxiety: number;
  hope: number;
  stress: number;
  fear: number;
  depression: number;
  top_concerns: ConcernItem[];
  hope_drivers: HopeDriverItem[];
  velocity?: number;
  velocity_percent?: number;
  velocity_hourly?: number;
}

export interface NationalStats {
  national_anxiety: number;
  national_hope: number;
  national_stress: number;
  fear_index?: number;
  bullish_index?: number;
  top_national_concerns?: [string, number][];
  top_national_hope_drivers?: [string, number][];
}

export interface SnapshotData {
  last_updated: string;
  state_data: Record<string, StateData>;
  national_stats: NationalStats;
}

export type MetricMode = "anxiety" | "hope" | "stress";

export type SubscriptionTier = "free" | "pro" | "agency";
