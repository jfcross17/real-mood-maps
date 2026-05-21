"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/proof", label: "Proof" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/pricing", label: "Pricing" },
];

export default function NavBar() {
  const pathname = usePathname();

  return (
    <header
      style={{
        background: "var(--surface)",
        borderBottom: "1px solid var(--border)",
      }}
      className="sticky top-0 z-50"
    >
      <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
        {/* Wordmark */}
        <Link href="/" className="flex items-center gap-3 group">
          <span
            className="display-font text-2xl tracking-wider"
            style={{ color: "var(--text)" }}
          >
            NATIONAL
          </span>
          <span
            className="display-font text-2xl tracking-wider"
            style={{ color: "var(--accent)" }}
          >
            PULSE
          </span>
        </Link>

        {/* Nav links */}
        <nav className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map(({ href, label }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className="text-sm font-medium transition-colors"
                style={{
                  color: active ? "var(--text)" : "var(--muted)",
                }}
                onMouseEnter={(e) =>
                  ((e.target as HTMLElement).style.color = "var(--text)")
                }
                onMouseLeave={(e) =>
                  ((e.target as HTMLElement).style.color = active
                    ? "var(--text)"
                    : "var(--muted)")
                }
              >
                {label}
              </Link>
            );
          })}
        </nav>

        {/* CTA */}
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="text-sm font-medium transition-colors"
            style={{ color: "var(--muted)" }}
          >
            Sign in
          </Link>
          <Link
            href="/pricing"
            className="text-sm font-semibold px-4 py-1.5 rounded transition-all"
            style={{
              background: "var(--accent)",
              color: "white",
            }}
          >
            Get Access
          </Link>
        </div>
      </div>
    </header>
  );
}
