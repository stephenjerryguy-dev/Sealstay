import { Link } from "react-router-dom";
import PageShell from "../components/PageShell";

const PILLARS = [
  {
    name: "Tenant screening",
    body: "SGU enrollment, prior-stay reviews, and Roommate DNA compatibility — before you ever sign.",
  },
  {
    name: "Rent guarantee",
    body: "If a verified tenant skips a payment, we cover up to 60 days while we work the dispute.",
  },
  {
    name: "On-island maintenance",
    body: "24-hour emergency contractors for plumbing, generator, and AC. You see one invoice; we route the rest.",
  },
  {
    name: "Damage protection",
    body: "Up to US$5,000 of accidental damage covered per stay, on top of the security deposit.",
  },
  {
    name: "Hurricane fund",
    body: "Pooled emergency fund for named-storm displacement so you don't refund out of pocket.",
  },
  {
    name: "Eviction support",
    body: "Legal-aid partner files notices and represents you in tenancy court when needed.",
  },
];

const PRICING = [
  {
    tier: "Free",
    monthly: 0,
    note: "Listed, screened, escrow-paid.",
    perks: ["Verified student tenants", "Escrow rent collection", "Lease DNA Scanner integration"],
  },
  {
    tier: "Shield",
    monthly: 49,
    note: "Per occupied unit / month.",
    perks: ["Everything in Free", "Rent guarantee · 60 days", "Damage protection · US$5,000", "On-island 24h maintenance"],
    featured: true,
  },
  {
    tier: "Shield Plus",
    monthly: 99,
    note: "Per occupied unit / month.",
    perks: ["Everything in Shield", "Hurricane fund access", "Eviction & legal support", "Concierge guest turnover"],
  },
];

export default function LandlordShield() {
  return (
    <PageShell
      kicker="LandlordShield"
      title="Protection for the other side of the lease"
      subtitle="The same obsessive verification we run for students — applied to keep your property running, your rent on time, and your weekends yours."
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {PILLARS.map((p) => (
          <div
            key={p.name}
            className="liquid-glass p-6"
            style={{ borderRadius: "1.25rem" }}
          >
            <h3 className="font-heading text-white text-3xl tracking-[-1px] leading-none">
              {p.name}
            </h3>
            <p className="mt-3 text-sm font-body font-light text-white/85 leading-snug max-w-[36ch]">
              {p.body}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-12">
        <p className="text-xs font-body text-white/70 mb-4">// Pricing</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {PRICING.map((p) => (
            <div
              key={p.tier}
              className={`p-6 flex flex-col ${
                p.featured ? "liquid-glass-strong" : "liquid-glass"
              }`}
              style={{ borderRadius: "1.5rem" }}
            >
              <div className="flex items-baseline justify-between gap-3">
                <h3 className="font-heading text-white text-3xl tracking-[-1px] leading-none">
                  {p.tier}
                </h3>
                {p.featured && (
                  <span className="bg-sealOrange text-white rounded-full px-2.5 py-1 text-[10px] font-body font-semibold">
                    Most landlords
                  </span>
                )}
              </div>
              <p className="mt-4 font-heading text-white text-5xl tracking-[-1px] leading-none">
                ${p.monthly}
                <span className="text-base text-white/70 font-body font-light ml-1">
                  / mo
                </span>
              </p>
              <p className="mt-2 text-[11px] font-body font-light text-white/65">
                {p.note}
              </p>
              <ul className="mt-5 flex-1 flex flex-col gap-2">
                {p.perks.map((perk) => (
                  <li
                    key={perk}
                    className="flex gap-2 text-sm font-body font-light text-white/90"
                  >
                    <span className="text-sealOrange">›</span>
                    {perk}
                  </li>
                ))}
              </ul>
              <Link
                to="/list-property"
                className={`mt-6 rounded-full px-5 py-2.5 text-sm font-medium font-body text-center ${
                  p.featured
                    ? "bg-white text-sealNavyDeep"
                    : "liquid-glass-strong text-white"
                }`}
              >
                {p.tier === "Free" ? "List free" : "Add Shield"}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </PageShell>
  );
}
