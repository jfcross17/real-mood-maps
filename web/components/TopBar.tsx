"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ISSUE } from "@/lib/pulseData";

const NAV = [
  { href: "/", label: "Dashboard" },
  { href: "/dashboard", label: "By State" },
  { href: "/proof", label: "Trends" },
  { href: "/proof", label: "Methodology" },
  { href: "/", label: "Archive" },
  { href: "/dashboard", label: "API" },
];

function formatPT(date: Date): string {
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "America/Los_Angeles",
  });
}

export default function TopBar() {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    const tick = () => setTime(formatPT(new Date()));
    tick();
    const id = setInterval(tick, 30000);
    return () => clearInterval(id);
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-bg/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-[1320px] items-center justify-between gap-8 px-4 py-4 lg:px-8">
        <Link href="/" className="flex items-baseline gap-3 text-text">
          <svg
            className="h-8 w-8 translate-y-1"
            viewBox="0 0 32 32"
            fill="none"
            aria-hidden
          >
            <circle
              cx="16"
              cy="16"
              r="14"
              stroke="var(--color-accent)"
              strokeWidth="1.5"
            />
            <circle
              cx="16"
              cy="16"
              r="9"
              stroke="var(--color-accent)"
              strokeWidth="1"
              opacity="0.6"
            />
            <circle cx="16" cy="16" r="4" fill="var(--color-accent)" />
            <circle cx="16" cy="16" r="2" fill="var(--color-bg)" />
          </svg>
          <span
            className="font-display text-[26px] leading-none italic tracking-[-0.02em]"
            style={{ fontVariationSettings: '"opsz" 144, "SOFT" 50, "wght" 600' }}
          >
            The National Pulse
          </span>
          <span className="ml-1 hidden border-l border-border-strong pl-3 font-mono text-[10px] uppercase leading-tight tracking-[0.14em] text-text-muted md:block">
            № {ISSUE.number}
            <br />
            {ISSUE.monthLabel}
          </span>
        </Link>

        <nav className="hidden items-center gap-7 text-[13px] lg:flex">
          {NAV.map((n, i) => (
            <Link
              key={`${n.label}-${i}`}
              href={n.href}
              className="group relative text-text-muted transition-colors hover:text-text"
            >
              {n.label}
              <span className="absolute -bottom-1 left-0 right-0 h-px origin-left scale-x-0 bg-accent transition-transform group-hover:scale-x-100" />
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3.5 font-mono text-[11px] text-text-muted">
          <span className="hidden items-center sm:inline-flex">
            <span className="pulse-dot mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-green" />
            LIVE · {time ?? ISSUE.liveTime}
          </span>
          <a
            href="#brief"
            className="rounded-full bg-accent px-4 py-2 font-sans text-[12px] font-semibold text-bg transition-all hover:-translate-y-px hover:bg-[#f5b35a]"
          >
            Get the Brief →
          </a>
        </div>
      </div>
    </header>
  );
}
