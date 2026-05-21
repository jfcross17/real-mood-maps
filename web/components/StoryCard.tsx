import Link from "next/link";
import type { StoryCardData } from "@/lib/pulseData";

const COVERS: Record<number, { bg: string; art: React.ReactNode; label: string }> = {
  1: {
    bg: "linear-gradient(135deg, #2a1d1a, #7a3528)",
    label: "heat rising",
    art: (
      <svg viewBox="0 0 200 150" xmlns="http://www.w3.org/2000/svg" aria-hidden>
        <defs>
          <linearGradient id="sun1" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f5b35a" />
            <stop offset="100%" stopColor="#d65838" />
          </linearGradient>
        </defs>
        <rect x="0" y="100" width="200" height="50" fill="#2a1d1a" opacity="0.6" />
        <circle cx="100" cy="100" r="50" fill="url(#sun1)" />
        <path d="M20,100 Q60,90 100,100 T180,100" stroke="#f0ebe0" strokeWidth="1" fill="none" opacity="0.4" />
        <path d="M20,110 Q60,118 100,110 T180,110" stroke="#f0ebe0" strokeWidth="1" fill="none" opacity="0.3" />
        <text x="100" y="40" textAnchor="middle" fontFamily="Fraunces, Georgia, serif" fontStyle="italic" fontSize="14" fill="#f0ebe0" opacity="0.8">
          heat rising
        </text>
      </svg>
    ),
  },
  2: {
    bg: "linear-gradient(135deg, #1a2a26, #2d5e4f)",
    label: "the holdouts",
    art: (
      <svg viewBox="0 0 200 150" xmlns="http://www.w3.org/2000/svg" aria-hidden>
        <path d="M30,130 L60,80 L80,100 L110,50 L140,90 L170,40" stroke="#6ba292" strokeWidth="3" fill="none" />
        <circle cx="170" cy="40" r="6" fill="#6ba292" />
        <circle cx="170" cy="40" r="12" fill="#6ba292" opacity="0.3" />
        <line x1="20" y1="130" x2="180" y2="130" stroke="#f0ebe0" strokeWidth="0.5" opacity="0.3" />
        <text x="100" y="25" textAnchor="middle" fontFamily="Fraunces, Georgia, serif" fontStyle="italic" fontSize="14" fill="#f0ebe0" opacity="0.8">
          the holdouts
        </text>
      </svg>
    ),
  },
  3: {
    bg: "linear-gradient(135deg, #2a2218, #6b5126)",
    label: "the gap",
    art: (
      <svg viewBox="0 0 200 150" xmlns="http://www.w3.org/2000/svg" aria-hidden>
        <circle cx="60" cy="75" r="32" fill="#e8a04a" opacity="0.85" />
        <circle cx="140" cy="75" r="32" fill="#d65838" opacity="0.85" />
        <circle cx="100" cy="75" r="20" fill="#f0ebe0" opacity="0.15" />
        <text x="60" y="78" textAnchor="middle" fontFamily="Fraunces, Georgia, serif" fontSize="11" fill="#0f1117" fontWeight="600">
          ANXIETY
        </text>
        <text x="140" y="78" textAnchor="middle" fontFamily="Fraunces, Georgia, serif" fontSize="11" fill="#0f1117" fontWeight="600">
          SENTIMENT
        </text>
        <text x="100" y="25" textAnchor="middle" fontFamily="Fraunces, Georgia, serif" fontStyle="italic" fontSize="14" fill="#f0ebe0" opacity="0.8">
          the gap
        </text>
      </svg>
    ),
  },
};

export default function StoryCard({ story }: { story: StoryCardData }) {
  const cover = COVERS[story.coverVariant];
  const parts = story.title.split(story.accentWord);
  return (
    <Link
      href={`/stories/${story.slug}`}
      className="group flex flex-col overflow-hidden border border-border bg-bg-card text-text transition-all duration-200 hover:-translate-y-1 hover:border-accent"
    >
      <div
        className="relative overflow-hidden border-b border-border"
        style={{ aspectRatio: "4 / 3", background: cover.bg }}
      >
        <div className="absolute inset-0 flex items-center justify-center p-6">
          {cover.art}
        </div>
      </div>
      <div className="flex justify-between px-5 pb-1.5 pt-4 font-mono text-[10px] uppercase tracking-[0.14em] text-text-muted">
        <span>{story.issue}</span>
        <strong className="font-semibold text-accent">{story.section}</strong>
      </div>
      <h3
        className="px-5 pb-3 pt-1.5 font-display leading-[1.05] tracking-[-0.02em]"
        style={{
          fontVariationSettings: '"opsz" 72, "SOFT" 40, "wght" 600',
          fontSize: "26px",
        }}
      >
        {parts[0]}
        <em
          className="not-italic text-accent"
          style={{
            fontStyle: "italic",
            fontVariationSettings: '"opsz" 72, "SOFT" 80, "wght" 600',
          }}
        >
          {story.accentWord}
        </em>
        {parts[1] ?? ""}
      </h3>
      <p
        className="px-5 pb-6 font-display italic text-text-muted"
        style={{
          fontVariationSettings: '"opsz" 18',
          fontSize: "14px",
          lineHeight: 1.45,
        }}
      >
        {story.dek}
      </p>
    </Link>
  );
}
