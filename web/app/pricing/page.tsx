import Link from "next/link";

const PLANS = [
  {
    name: "Pro",
    price: "$99",
    period: "/mo",
    description: "For individual consultants and campaign managers.",
    features: [
      "Live daily snapshot — all 50 states",
      "Full state detail: concerns, hope drivers, velocity",
      "30-day trend history per state",
      "National issue correlation view",
      "CSV export",
      "Email support",
    ],
    cta: "Start Pro Trial",
    href: "/login",
    highlight: false,
  },
  {
    name: "Agency",
    price: "$299",
    period: "/mo",
    description: "For firms managing multiple campaigns simultaneously.",
    features: [
      "Everything in Pro",
      "Up to 5 user seats",
      "API access (JSON endpoint)",
      "Custom state watchlists with alerts",
      "Priority Slack support",
      "Quarterly methodology briefing",
    ],
    cta: "Start Agency Trial",
    href: "/login",
    highlight: true,
  },
];

const FAQ = [
  {
    q: "What does the data actually measure?",
    a: "We track Google Trends search volume for emotional keywords (anxiety, hope, stress, fear) and issue-specific terms (layoffs, inflation, immigration, crime, etc.) across all 50 states. Data is normalized 0–100 and updated daily.",
  },
  {
    q: "How often is the dashboard updated?",
    a: "The pipeline runs once every 24 hours. Given Google Trends rate limits and 50-state coverage, a full run takes 60–90 minutes. You see the freshest data available each morning.",
  },
  {
    q: "Is there a free trial?",
    a: "Yes — both plans include a 7-day free trial. No credit card required to start. You will be prompted to add payment information after the trial period.",
  },
  {
    q: "What does the free tier show?",
    a: "The free tier shows the national map with anxiety/hope/stress coloring and the four national metric cards. State-level detail, modal breakdowns, and history charts require Pro or Agency.",
  },
  {
    q: "Can I cancel anytime?",
    a: "Yes. Cancel from your account page at any time. You retain access until the end of your billing period.",
  },
];

export default function PricingPage() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-16">
      {/* Header */}
      <div className="text-center mb-16">
        <span
          className="mono text-xs uppercase tracking-widest"
          style={{ color: "var(--accent)" }}
        >
          Pricing
        </span>
        <h1
          className="display-font text-6xl mt-3 mb-4"
          style={{ color: "var(--text)" }}
        >
          CLEAR PRICING.
          <br />
          <span style={{ color: "var(--accent)" }}>NO SURPRISES.</span>
        </h1>
        <p className="text-base max-w-xl mx-auto" style={{ color: "var(--muted)" }}>
          Built for political consultants. Priced for what the signal is actually
          worth in a race.
        </p>
      </div>

      {/* Plan cards */}
      <div className="grid md:grid-cols-2 gap-6 mb-20">
        {PLANS.map((plan) => (
          <div
            key={plan.name}
            className="rounded-xl p-8 flex flex-col"
            style={{
              background: plan.highlight ? "var(--surface2)" : "var(--surface)",
              border: plan.highlight
                ? "1px solid var(--accent)"
                : "1px solid var(--border)",
            }}
          >
            {plan.highlight && (
              <div className="mb-4">
                <span
                  className="mono text-xs uppercase tracking-widest px-2 py-0.5 rounded"
                  style={{
                    color: "var(--accent)",
                    background: "rgba(232,76,61,0.1)",
                    border: "1px solid rgba(232,76,61,0.2)",
                  }}
                >
                  Most Popular
                </span>
              </div>
            )}

            <p
              className="mono text-xs uppercase tracking-widest mb-2"
              style={{ color: "var(--muted)" }}
            >
              {plan.name}
            </p>

            <div className="flex items-end gap-1 mb-2">
              <span
                className="display-font text-6xl leading-none"
                style={{ color: "var(--text)" }}
              >
                {plan.price}
              </span>
              <span className="text-base pb-1" style={{ color: "var(--muted)" }}>
                {plan.period}
              </span>
            </div>

            <p className="text-sm mb-6" style={{ color: "var(--muted)" }}>
              {plan.description}
            </p>

            <ul className="flex flex-col gap-2.5 mb-8 flex-1">
              {plan.features.map((f) => (
                <li key={f} className="flex items-start gap-2.5 text-sm">
                  <span
                    className="mt-0.5 shrink-0"
                    style={{ color: "var(--accent3)" }}
                  >
                    &#10003;
                  </span>
                  <span style={{ color: "var(--text)" }}>{f}</span>
                </li>
              ))}
            </ul>

            <Link
              href={plan.href}
              className="w-full py-3 rounded text-center font-semibold text-sm transition-all block"
              style={
                plan.highlight
                  ? { background: "var(--accent)", color: "white" }
                  : {
                      border: "1px solid var(--border2)",
                      color: "var(--text)",
                    }
              }
            >
              {plan.cta}
            </Link>
          </div>
        ))}
      </div>

      {/* Free tier note */}
      <div
        className="rounded-lg px-6 py-5 mb-20 text-center"
        style={{
          background: "var(--surface)",
          border: "1px solid var(--border)",
        }}
      >
        <p className="text-sm" style={{ color: "var(--muted)" }}>
          Want to see the national view before subscribing?{" "}
          <Link
            href="/dashboard"
            className="underline underline-offset-4"
            style={{ color: "var(--text)" }}
          >
            Preview the dashboard
          </Link>{" "}
          — national metrics visible on the free tier, no credit card required.
        </p>
      </div>

      {/* FAQ */}
      <div>
        <h2
          className="display-font text-4xl mb-8"
          style={{ color: "var(--text)" }}
        >
          COMMON QUESTIONS
        </h2>
        <div className="flex flex-col gap-0">
          {FAQ.map(({ q, a }, i) => (
            <div
              key={i}
              className="py-6"
              style={{
                borderTop: "1px solid var(--border)",
              }}
            >
              <p
                className="text-sm font-semibold mb-2"
                style={{ color: "var(--text)" }}
              >
                {q}
              </p>
              <p className="text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
                {a}
              </p>
            </div>
          ))}
          <div style={{ borderTop: "1px solid var(--border)" }} />
        </div>
      </div>
    </div>
  );
}
