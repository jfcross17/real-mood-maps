import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { SnapshotData } from "./types";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

// Lazy — only instantiate when credentials are present
let _client: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient | null {
  if (!supabaseUrl || !supabaseAnonKey) return null;
  if (!_client) _client = createClient(supabaseUrl, supabaseAnonKey);
  return _client;
}

// Named export for client components (auth, etc.)
export const supabase = supabaseUrl
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

/** Fetch the most recent snapshot + state readings from Supabase */
export async function getLatestSnapshot(): Promise<SnapshotData | null> {
  const client = getSupabaseClient();
  if (!client) return null;

  try {
    const { data: snapshot, error: snapErr } = await client
      .from("snapshots")
      .select("*")
      .order("collected_at", { ascending: false })
      .limit(1)
      .single();

    if (snapErr || !snapshot) return null;

    const { data: readings, error: readErr } = await client
      .from("state_readings")
      .select("*")
      .eq("snapshot_id", snapshot.id);

    if (readErr || !readings) return null;

    const state_data: SnapshotData["state_data"] = {};
    for (const row of readings) {
      state_data[row.state_name] = {
        anxiety: row.anxiety,
        hope: row.hope,
        stress: row.stress,
        fear: row.fear,
        depression: row.depression,
        top_concerns: row.top_concerns ?? [],
        hope_drivers: row.hope_drivers ?? [],
        velocity: row.velocity,
        velocity_percent: row.velocity_percent,
      };
    }

    return {
      last_updated: snapshot.collected_at,
      state_data,
      national_stats: {
        national_anxiety: snapshot.national_anxiety,
        national_hope: snapshot.national_hope,
        national_stress: snapshot.national_stress,
        fear_index: snapshot.fear_index,
        bullish_index: snapshot.bullish_index,
        top_national_concerns: snapshot.top_national_concerns ?? [],
        top_national_hope_drivers: snapshot.top_national_hope_drivers ?? [],
      },
    };
  } catch {
    return null;
  }
}
