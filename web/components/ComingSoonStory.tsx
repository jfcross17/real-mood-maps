import Link from "next/link";
import type { StoryCardData } from "@/lib/pulseData";

export default function ComingSoonStory({ story }: { story: StoryCardData }) {
  return (
    <main className="mx-auto flex max-w-[760px] flex-col items-center px-4 py-24 text-center lg:px-8">
      <div className="mb-6 font-mono text-[11px] uppercase tracking-[0.16em] text-accent">
        Issue {story.issue} · {story.section}
      </div>
      <h1
        className="mb-6 font-display leading-[0.95] tracking-[-0.035em]"
        style={{
          fontVariationSettings: '"opsz" 144, "SOFT" 30, "wght" 500',
          fontSize: "clamp(40px, 6vw, 68px)",
        }}
      >
        {story.title.split(story.accentWord)[0]}
        <em
          className="not-italic text-accent"
          style={{
            fontStyle: "italic",
            fontVariationSettings: '"opsz" 144, "SOFT" 80, "wght" 500',
          }}
        >
          {story.accentWord}
        </em>
        {story.title.split(story.accentWord)[1] ?? ""}
      </h1>
      <p
        className="mb-8 max-w-lg font-display italic text-text-muted"
        style={{
          fontVariationSettings: '"opsz" 36',
          fontSize: "19px",
          lineHeight: 1.5,
        }}
      >
        {story.dek}
      </p>
      <div className="mb-10 font-mono text-[11px] uppercase tracking-[0.14em] text-text-dim">
        Filed for Issue № 142 · publishing this week
      </div>
      <div className="flex flex-wrap items-center justify-center gap-4">
        <Link
          href="/"
          className="rounded-full border border-border-strong px-5 py-2.5 font-sans text-[13px] font-medium text-text transition-colors hover:border-accent hover:text-accent"
        >
          ← Back to this issue
        </Link>
        <Link
          href="/#brief"
          className="rounded-full bg-accent px-5 py-2.5 font-sans text-[13px] font-semibold text-bg transition-all hover:-translate-y-px hover:bg-[#f5b35a]"
        >
          Get notified when it ships →
        </Link>
      </div>
    </main>
  );
}
