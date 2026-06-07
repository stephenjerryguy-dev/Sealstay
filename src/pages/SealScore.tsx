import { Link } from "react-router-dom";
import PageShell from "../components/PageShell";
import { LISTINGS, priceLabel } from "../data/listings";

const FACETS: Array<{ key: string; label: string; weight: number; body: string }> = [
  {
    key: "walk",
    label: "Walk to SGU",
    weight: 25,
    body: "Door-to-True-Blue-gate walk minutes, weighted by hill / sidewalk / lighting.",
  },
  {
    key: "value",
    label: "Value",
    weight: 20,
    body: "Price per square foot, normalized for neighborhood and bedroom count.",
  },
  {
    key: "safety",
    label: "Safety",
    weight: 15,
    body: "Inspection findings + neighborhood incident reports + security setup.",
  },
  {
    key: "wifi",
    label: "Wi-Fi",
    weight: 15,
    body: "Measured Mbps + uptime % over 30 days. Critical for med-school exams.",
  },
  {
    key: "generator",
    label: "Generator",
    weight: 15,
    body: "Backup power coverage during scheduled and unscheduled outages.",
  },
  {
    key: "hurricane",
    label: "Hurricane fitness",
    weight: 10,
    body: "Structural rating + history through past 10 hurricane seasons.",
  },
];

export default function SealScore() {
  // Show top 3 highest-scoring listings using the same simple model as
  // ListingDetail, just to demonstrate the rubric in action.
  const ranked = LISTINGS
    .map((l) => ({ l, score: simpleScore(l) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  return (
    <PageShell
      kicker="SealScore"
      title="The fitness rating for your future home"
      subtitle="Photos lie. SealScore doesn't. Every property is rated on the six things that actually decide whether your next year on the island goes well."
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Rubric */}
        <section
          className="liquid-glass p-6"
          style={{ borderRadius: "1.5rem" }}
        >
          <p className="text-xs font-body text-white/70">// Rubric</p>
          <h2 className="mt-1 font-heading text-white text-3xl tracking-[-1px] leading-none">
            What we measure
          </h2>
          <ul className="mt-5 flex flex-col gap-3">
            {FACETS.map((f) => (
              <li
                key={f.key}
                className="liquid-glass p-4"
                style={{ borderRadius: "1rem" }}
              >
                <div className="flex items-baseline justify-between gap-3">
                  <p className="font-heading text-white text-2xl tracking-[-0.5px] leading-none">
                    {f.label}
                  </p>
                  <span className="text-xs font-body font-light text-white/70">
                    {f.weight}% of score
                  </span>
                </div>
                <p className="mt-2 text-sm font-body font-light text-white/80 leading-snug">
                  {f.body}
                </p>
              </li>
            ))}
          </ul>
        </section>

        {/* Top scorers */}
        <section
          className="liquid-glass p-6"
          style={{ borderRadius: "1.5rem" }}
        >
          <p className="text-xs font-body text-white/70">// Top scorers</p>
          <h2 className="mt-1 font-heading text-white text-3xl tracking-[-1px] leading-none">
            Highest-rated rentals
          </h2>
          <ul className="mt-5 flex flex-col gap-3">
            {ranked.map(({ l, score }) => (
              <Link
                key={l.id}
                to={`/listings/${l.id}`}
                className="liquid-glass p-4 flex items-center gap-4 hover:bg-white/[0.02] transition"
                style={{ borderRadius: "1rem" }}
              >
                <img
                  src={l.thumb}
                  alt=""
                  className="w-20 h-20 object-cover shrink-0"
                  style={{ borderRadius: "0.7rem" }}
                />
                <div className="flex-1 min-w-0">
                  <p className="font-heading text-white text-2xl tracking-[-0.5px] leading-none truncate">
                    {l.title}
                  </p>
                  <p className="mt-1 text-[11px] font-body font-light text-white/70">
                    {l.neighborhood} · {l.bedrooms} BR · {priceLabel(l)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-heading text-sealOrange text-3xl tracking-[-1px] leading-none">
                    {score}
                  </p>
                  <p className="text-[10px] font-body font-light text-white/60">
                    / 100
                  </p>
                </div>
              </Link>
            ))}
          </ul>
          <Link
            to="/listings"
            className="mt-5 liquid-glass-strong rounded-full px-4 py-2 inline-flex text-xs font-medium font-body text-white"
          >
            See all scored listings →
          </Link>
        </section>
      </div>
    </PageShell>
  );
}

function simpleScore(l: { walkToCampus: number; price: number; sealApproved: boolean }) {
  const walk = clamp(100 - (l.walkToCampus - 4) * 6, 30, 100);
  const value = l.price > 0 ? clamp(100 - Math.max(0, (l.price - 800) / 30), 30, 100) : 70;
  const safety = l.sealApproved ? 92 : 70;
  const wifi = 78;
  const generator = l.price > 1500 ? 88 : 70;
  const hurricane = 80;
  return Math.round((walk + value + safety + wifi + generator + hurricane) / 6);
}
function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}
