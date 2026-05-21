"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

interface TocItem {
  id: string;
  text: string;
}

interface StoryRightRailProps {
  issue: string;
  shareUrl: string;
  shareTitle: string;
}

export default function StoryRightRail({
  issue,
  shareUrl,
  shareTitle,
}: StoryRightRailProps) {
  const [toc, setToc] = useState<TocItem[]>([]);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const h2s = document.querySelectorAll<HTMLHeadingElement>(
      "[data-story-body] h2"
    );
    const items: TocItem[] = [];
    h2s.forEach((h, i) => {
      if (!h.id) h.id = `s-${i}-${h.textContent?.toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 40) ?? i}`;
      items.push({ id: h.id, text: h.textContent ?? "" });
    });
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setToc(items);
  }, []);

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard not available */
    }
  };

  const tweetHref = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
    shareTitle
  )}&url=${encodeURIComponent(shareUrl)}`;
  const linkedinHref = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
    shareUrl
  )}`;

  return (
    <aside className="hidden lg:sticky lg:top-24 lg:block lg:h-fit">
      <div className="mb-7 border border-border bg-bg-card p-6">
        <div className="mb-1.5 font-mono text-[11px] uppercase tracking-[0.14em] text-accent">
          {issue}
        </div>
        <div
          className="font-display text-sm italic text-text-muted"
          style={{ fontVariationSettings: '"opsz" 24' }}
        >
          The Pulse, Issue 142
        </div>
      </div>

      <div className="mb-7 border border-border bg-bg-card p-6">
        <div className="mb-3 font-mono text-[11px] uppercase tracking-[0.14em] text-accent">
          Share
        </div>
        <div className="flex flex-col gap-2 font-mono text-[12px]">
          <a
            href={tweetHref}
            target="_blank"
            rel="noopener noreferrer"
            className="text-text transition-colors hover:text-accent"
          >
            → Share on X
          </a>
          <a
            href={linkedinHref}
            target="_blank"
            rel="noopener noreferrer"
            className="text-text transition-colors hover:text-accent"
          >
            → Share on LinkedIn
          </a>
          <button
            type="button"
            onClick={onCopy}
            className="cursor-pointer text-left text-text transition-colors hover:text-accent"
          >
            → {copied ? "Link copied" : "Copy link"}
          </button>
        </div>
      </div>

      <div className="mb-7 border border-border bg-bg-elevated p-6">
        <div className="mb-1.5 font-mono text-[11px] uppercase tracking-[0.14em] text-accent">
          The Weekly Brief
        </div>
        <div
          className="mb-3 font-display italic text-text"
          style={{ fontVariationSettings: '"opsz" 36', fontSize: "16px", lineHeight: 1.4 }}
        >
          Read the country before the polls do.
        </div>
        <Link
          href="/#brief"
          className="inline-block rounded-full bg-accent px-4 py-2 font-sans text-[12px] font-semibold text-bg transition-all hover:-translate-y-px hover:bg-[#f5b35a]"
        >
          Subscribe →
        </Link>
      </div>

      {toc.length > 0 && (
        <div className="border border-border bg-bg-card p-6">
          <div className="mb-3 font-mono text-[11px] uppercase tracking-[0.14em] text-accent">
            In This Story
          </div>
          <ul className="space-y-2 text-sm">
            {toc.map((item) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  className="text-text-muted transition-colors hover:text-accent"
                >
                  {item.text}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </aside>
  );
}
