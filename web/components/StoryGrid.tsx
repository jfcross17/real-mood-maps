import type { StoryCardData } from "@/lib/pulseData";
import StoryCard from "./StoryCard";

export default function StoryGrid({ stories }: { stories: StoryCardData[] }) {
  return (
    <div className="grid grid-cols-1 gap-7 lg:grid-cols-3">
      {stories.map((s) => (
        <StoryCard key={s.slug} story={s} />
      ))}
    </div>
  );
}
