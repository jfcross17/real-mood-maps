import { getLatestSnapshot } from "@/lib/supabase";
import seedData from "@/lib/seed-data.json";
import type { SnapshotData } from "@/lib/types";
import DashboardClient from "./DashboardClient";

export const revalidate = 3600; // revalidate every hour

export default async function DashboardPage() {
  // Try Supabase first; fall back to seed data
  let snapshot: SnapshotData | null = await getLatestSnapshot();

  if (!snapshot) {
    snapshot = seedData as unknown as SnapshotData;
  }

  // TODO: pull subscription tier from session
  const tier = "free";

  return <DashboardClient snapshot={snapshot} tier={tier} />;
}
