import TopBar from "@/components/TopBar";
import Masthead from "@/components/Masthead";
import HeroStrip from "@/components/HeroStrip";
import SectionHeader from "@/components/SectionHeader";
import EmotionalMap from "@/components/EmotionalMap";
import EmotionBreakdown from "@/components/EmotionBreakdown";
import StruggleList from "@/components/StruggleList";
import RankingList from "@/components/RankingList";
import StoryGrid from "@/components/StoryGrid";
import WeeklyBrief from "@/components/WeeklyBrief";
import SiteFooter from "@/components/SiteFooter";
import { MOST_ANXIOUS, MOST_HOPEFUL, STORIES } from "@/lib/pulseData";

export default function HomePage() {
  return (
    <>
      <TopBar />
      <Masthead />
      <main className="mx-auto max-w-[1320px] px-4 pb-20 pt-4 lg:px-8">
        <HeroStrip />

        <SectionHeader
          number="§ 01"
          titlePrefix="The Emotional Map of"
          titleAccent="America"
          tag="N = 2.4M searches · 24h window"
        />
        <div className="grid grid-cols-1 gap-7 lg:grid-cols-[2fr_1fr]">
          <EmotionalMap />
          <aside>
            <EmotionBreakdown />
            <StruggleList />
          </aside>
        </div>

        <SectionHeader
          number="§ 02"
          titlePrefix="Most Anxious & Most"
          titleAccent="Hopeful"
          tag="Δ vs. 7-day average"
        />
        <div className="grid grid-cols-1 gap-7 lg:grid-cols-2">
          <RankingList
            title="Most Anxious States"
            subtitle="where the temperature is rising fastest"
            rows={MOST_ANXIOUS}
            tone="high"
          />
          <RankingList
            title="Most Hopeful States"
            subtitle="where the country is keeping faith"
            rows={MOST_HOPEFUL}
            tone="low"
          />
        </div>

        <SectionHeader
          number="§ 03"
          titlePrefix="This Week, We're"
          titleAccent="Watching"
          tag="3 stories · 4 min each"
        />
        <StoryGrid stories={STORIES} />

        <WeeklyBrief />
      </main>
      <SiteFooter />
    </>
  );
}
