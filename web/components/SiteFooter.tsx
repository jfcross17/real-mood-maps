import Link from "next/link";
import { ISSUE } from "@/lib/pulseData";

const COLS = [
  {
    heading: "The Paper",
    links: [
      { href: "/", label: "This Issue" },
      { href: "/", label: "Archive" },
      { href: "/stories/florida-is-cooking", label: "Stories" },
      { href: "/dashboard", label: "By State" },
    ],
  },
  {
    heading: "Methodology",
    links: [
      { href: "/proof", label: "How We Measure" },
      { href: "/proof", label: "Validation Studies" },
      { href: "/proof", label: "Backtests" },
      { href: "/proof", label: "API Docs" },
    ],
  },
  {
    heading: "The Desk",
    links: [
      { href: "/", label: "About" },
      { href: "/", label: "Press" },
      { href: "/", label: "Contact" },
      { href: "/", label: "Terms · Privacy" },
    ],
  },
];

export default function SiteFooter() {
  return (
    <footer className="mx-auto mt-18 max-w-[1320px] px-4 pb-9 lg:px-8">
      <div className="grid grid-cols-1 gap-10 border-t-2 border-text pt-9 md:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr]">
        <div>
          <div
            className="mb-3.5 font-display text-[22px] italic"
            style={{ fontVariationSettings: '"opsz" 72, "wght" 600' }}
          >
            The National Pulse
          </div>
          <p
            className="max-w-[340px] font-display text-[15px] italic text-text-muted"
            style={{ fontVariationSettings: '"opsz" 24', lineHeight: 1.5 }}
          >
            A weekly reading of the American mood, built for operators who need
            to understand the country at the speed it actually moves.
          </p>
        </div>
        {COLS.map((col) => (
          <div key={col.heading}>
            <h4 className="mb-4 font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-accent">
              {col.heading}
            </h4>
            <ul className="list-none space-y-2.5">
              {col.links.map((l) => (
                <li key={l.label}>
                  <Link
                    href={l.href}
                    className="text-[13px] text-text transition-colors hover:text-accent"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="mt-7 flex flex-col justify-between gap-2 border-t border-border pt-7 font-mono text-[10px] uppercase tracking-[0.1em] text-text-dim md:flex-row">
        <span>
          © 2026 The In App LLC · A Gap Report Product · Data derived from
          anonymized public search trends
        </span>
        <span>
          Issue № {ISSUE.number} · Last build {ISSUE.liveTime}
        </span>
      </div>
    </footer>
  );
}
