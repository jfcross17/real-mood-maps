import Link from "next/link";
import TopBar from "@/components/TopBar";
import SiteFooter from "@/components/SiteFooter";

interface PlanFeature {
  text: string;
  included: boolean;
}

interface Plan {
  name: string;
  priceItalic: string;
  pricePostfix: string;
  cadence: string;
  tagline: string;
  features: PlanFeature[];
  cta: string;
  href: string;
  recommended?: boolean;
}

// PLACEHOLDER: pricing copy to be finalized with sales — current figures match positioning brief
const PLANS: Plan[] = [
  {
    name: "Free",
    priceItalic: "0",
    pricePostfix: "",
    cadence: "Forever",
    tagline: "See the country at a glance.",
    features: [
      { text: "National anxiety + hope indices", included: true },
      { text: "Live emotional map (state colors only)", included: true },
      { text: "Weekly Brief in your inbox", included: true },
      { text: "Full state detail + history", included: false },
      { text: "CSV export · API access", included: false },
    ],
    cta: "Start free",
    href: "/login",
  },
  {
    name: "Pro",
    priceItalic: "99",
    pricePostfix: "",
    cadence: "Per month",
    tagline: "For consultants who need the signal in time.",
    features: [
      { text: "Everything in Free", included: true },
      { text: "Full state detail · 90-day history", included: true },
      { text: "Daily Brief (Mon–Fri, 6 AM PT)", included: true },
      { text: "CSV export · read-only API", included: true },
      { text: "Issue-level keyword breakdowns", included: true },
    ],
    cta: "Subscribe",
    href: "/login",
    recommended: true,
  },
  {
    name: "Firm",
    priceItalic: "299",
    pricePostfix: "",
    cadence: "Per month",
    tagline: "For teams managing multiple campaigns.",
    features: [
      { text: "Everything in Pro", included: true },
      { text: "5 team seats", included: true },
      { text: "White-labelled briefs (PDF export)", included: true },
      { text: "Full archive · all 142 back issues", included: true },
      { text: "Priority Slack-Connect support", included: true },
    ],
    cta: "Talk to us",
    href: "/login",
  },
];

interface FAQItem {
  q: string;
  a: string;
}

// PLACEHOLDER: FAQ copy to be reviewed by legal before live billing
const FAQ: FAQItem[] = [
  {
    q: "Can I cancel anytime?",
    a: "Yes. Cancel from your account page; you keep access through the end of the current billing period. We do not bill the next cycle automatically once you cancel.",
  },
  {
    q: "Do you offer refunds?",
    a: "Within 14 days of a new Pro or Firm subscription, full refund, no questions. After that, we prorate by remaining days in the period.",
  },
  {
    q: "Where does the data come from?",
    a: "Google Trends queries for emotion- and issue-coded keyword baskets, normalized 0–100 per state and smoothed over a 7-day window. The methodology is documented in full on the Proof page.",
  },
  {
    q: "Do you share customer data?",
    a: "No. Your account, queries, and exports are private to your team. We do not sell subscriber data, and we do not aggregate it back into the public product.",
  },
  {
    q: "Need something custom — enterprise, embeds, an extra seat block?",
    a: "Email the desk at hello@nationalpulse.io. We will price a tier that matches what you actually need rather than asking you to buy three Firm seats to get two extras.",
  },
];

function CheckIcon({ included }: { included: boolean }) {
  if (included) {
    return (
      <svg
        viewBox="0 0 20 20"
        className="mt-0.5 h-4 w-4 shrink-0 text-accent-cool"
        fill="none"
        aria-hidden
      >
        <path
          d="M4 10.5l4 4 8-9"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }
  return (
    <svg
      viewBox="0 0 20 20"
      className="mt-0.5 h-4 w-4 shrink-0 text-text-dim"
      fill="none"
      aria-hidden
    >
      <line
        x1="5"
        y1="10"
        x2="15"
        y2="10"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function PlanCard({ plan }: { plan: Plan }) {
  const isRec = !!plan.recommended;
  return (
    <div
      className={`relative flex flex-col border bg-bg-card p-8 ${
        isRec ? "border-accent" : "border-border"
      }`}
    >
      {isRec && (
        <span className="absolute -top-3 right-6 rounded-full bg-accent px-3 py-1 font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-bg">
          Recommended
        </span>
      )}
      <div className="mb-2 font-mono text-[11px] uppercase tracking-[0.14em] text-accent">
        {plan.name}
      </div>
      <div
        className="mb-2 flex items-baseline gap-1 font-display leading-none tracking-[-0.04em] text-text"
        style={{
          fontVariationSettings: '"opsz" 144, "SOFT" 60, "wght" 500',
          fontSize: "72px",
        }}
      >
        <span className="text-3xl text-text-muted">$</span>
        <em
          className="not-italic text-accent"
          style={{
            fontStyle: "italic",
            fontVariationSettings: '"opsz" 144, "SOFT" 80, "wght" 500',
          }}
        >
          {plan.priceItalic}
        </em>
        {plan.pricePostfix && (
          <span className="text-3xl text-text">{plan.pricePostfix}</span>
        )}
      </div>
      <div className="mb-5 font-mono text-[10px] uppercase tracking-[0.14em] text-text-muted">
        {plan.cadence}
      </div>
      <p
        className="mb-7 font-display italic text-text-muted"
        style={{
          fontVariationSettings: '"opsz" 24',
          fontSize: "15px",
          lineHeight: 1.5,
        }}
      >
        {plan.tagline}
      </p>
      <ul className="mb-8 flex flex-1 flex-col gap-3">
        {plan.features.map((f) => (
          <li
            key={f.text}
            className={`flex items-start gap-3 font-mono text-[13px] ${
              f.included ? "text-text" : "text-text-dim line-through"
            }`}
          >
            <CheckIcon included={f.included} />
            <span>{f.text}</span>
          </li>
        ))}
      </ul>
      <Link
        href={plan.href}
        className={`block w-full rounded-full py-3 text-center font-sans text-sm font-semibold transition-all ${
          isRec
            ? "bg-accent text-bg hover:-translate-y-px hover:bg-[#f5b35a]"
            : "border border-border-strong text-text hover:border-accent hover:text-accent"
        }`}
      >
        {plan.cta} →
      </Link>
    </div>
  );
}

export default function PricingPage() {
  return (
    <>
      <TopBar />
      <header className="relative mx-auto max-w-[1320px] px-4 pb-8 pt-12 lg:px-8">
        <div className="mb-6 flex items-baseline justify-between border-b-2 border-text pb-4">
          <div className="font-mono text-[11px] uppercase tracking-[0.16em] text-text-muted">
            <strong className="font-semibold text-accent">Subscriptions</strong> · Pricing ·{" "}
            <strong className="font-semibold text-accent">May 2026</strong>
          </div>
          <div
            className="hidden font-display text-sm italic text-text-muted md:block"
            style={{ fontVariationSettings: '"opsz" 144' }}
          >
            Priced for the way operators actually work
          </div>
        </div>
        <h1
          className="mb-5 max-w-[1100px] font-display leading-[0.95] tracking-[-0.035em]"
          style={{
            fontVariationSettings: '"opsz" 144, "SOFT" 30, "wght" 500',
            fontSize: "clamp(40px, 6vw, 76px)",
          }}
        >
          Built for{" "}
          <em
            className="not-italic text-accent"
            style={{
              fontStyle: "italic",
              fontVariationSettings: '"opsz" 144, "SOFT" 80, "wght" 500',
            }}
          >
            operators
          </em>
          .
        </h1>
        <p
          className="max-w-[720px] font-display italic text-text-muted"
          style={{
            fontVariationSettings: '"opsz" 36',
            fontSize: "19px",
            lineHeight: 1.5,
          }}
        >
          {`Three tiers. No usage meter, no surprise overages, no contract you need legal to read. Cancel from your account page.`}
        </p>
        <div className="mt-6 font-mono text-[11px] uppercase tracking-[0.12em] text-text-dim">
          14-day refund window · No card required for the free tier · Annual plans 2 months off
        </div>
      </header>

      <main className="mx-auto max-w-[1320px] px-4 pb-20 lg:px-8">
        <section className="grid grid-cols-1 gap-7 lg:grid-cols-3">
          {PLANS.map((p) => (
            <PlanCard key={p.name} plan={p} />
          ))}
        </section>

        <section className="mt-12 border border-border bg-bg-elevated px-6 py-7 lg:px-10">
          <div className="flex flex-col items-start justify-between gap-3 md:flex-row md:items-center">
            <div>
              <div className="mb-1.5 font-mono text-[11px] uppercase tracking-[0.14em] text-accent">
                Not ready to subscribe?
              </div>
              <p
                className="font-display italic text-text"
                style={{
                  fontVariationSettings: '"opsz" 24',
                  fontSize: "17px",
                  lineHeight: 1.45,
                }}
              >
                {`Browse this week’s issue free — the national map, the rankings, and the stories.`}
              </p>
            </div>
            <Link
              href="/"
              className="rounded-full border border-border-strong px-5 py-2.5 font-sans text-[13px] font-medium text-text transition-colors hover:border-accent hover:text-accent"
            >
              Read Issue № 142 →
            </Link>
          </div>
        </section>

        <section className="mt-16">
          <div className="mb-6 flex items-end justify-between border-b border-text pb-3.5">
            <div className="flex items-baseline gap-4">
              <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-accent">
                § FAQ
              </span>
              <h2
                className="font-display leading-none tracking-[-0.025em]"
                style={{
                  fontVariationSettings: '"opsz" 144, "SOFT" 40, "wght" 500',
                  fontSize: "clamp(28px, 3.6vw, 38px)",
                }}
              >
                Common{" "}
                <em
                  className="not-italic text-accent"
                  style={{
                    fontStyle: "italic",
                    fontVariationSettings: '"opsz" 144, "SOFT" 80, "wght" 500',
                  }}
                >
                  questions
                </em>
              </h2>
            </div>
            <span className="hidden font-mono text-[11px] uppercase tracking-[0.12em] text-text-muted md:block">
              5 answers · 2 min read
            </span>
          </div>

          <div className="grid grid-cols-1 gap-px bg-border md:grid-cols-2">
            {FAQ.map((item) => (
              <article
                key={item.q}
                className="bg-bg-card px-7 py-7"
              >
                <h3
                  className="mb-3 font-display italic text-text"
                  style={{
                    fontVariationSettings: '"opsz" 36, "SOFT" 50, "wght" 500',
                    fontSize: "22px",
                    lineHeight: 1.25,
                    letterSpacing: "-0.01em",
                  }}
                >
                  {item.q}
                </h3>
                <p className="font-mono text-[13px] leading-[1.6] text-text-muted">
                  {item.a}
                </p>
              </article>
            ))}
            {FAQ.length % 2 === 1 && <div className="hidden bg-bg md:block" />}
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
