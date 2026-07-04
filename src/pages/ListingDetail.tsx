import { Link, useParams } from "react-router-dom";
import type { ComponentType } from "react";
import { AlertCircle, CheckCircle2, RefreshCw } from "lucide-react";
import PageShell from "../components/PageShell";
import GrenadaMap from "../components/GrenadaMap";
import { LISTINGS, priceLabel } from "../data/listings";

export default function ListingDetail() {
  const { id } = useParams<{ id: string }>();
  const listing = LISTINGS.find((l) => l.id === id);

  if (!listing) {
    return (
      <PageShell title="Listing not found" subtitle="That property may have been delisted.">
        <Link
          to="/listings"
          className="liquid-glass-strong rounded-full px-5 py-2.5 inline-flex text-sm font-medium font-body text-white"
        >
          Back to all listings
        </Link>
      </PageShell>
    );
  }

  // SealScore (computed from data we already have)
  const score = computeSealScore(listing);
  const similar = LISTINGS
    .filter((l) => l.id !== listing.id && l.neighborhood === listing.neighborhood)
    .slice(0, 3);

  return (
    <PageShell
      kicker={listing.neighborhood}
      title={listing.title}
      subtitle={`${listing.bedrooms} bedroom · ${listing.bathrooms} bathroom · sleeps ${listing.occupancy} · ${listing.walkToCampus} min walk to SGU.`}
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mt-2">
        {/* Photo */}
        <div
          className="lg:col-span-2 liquid-glass overflow-hidden"
          style={{ borderRadius: "1.25rem" }}
        >
          <img
            src={listing.thumb}
            alt=""
            onError={(e) => {
              const t = e.currentTarget;
              if (!t.dataset.fallback) {
                t.dataset.fallback = "1";
                t.src =
                  "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1400&q=75&auto=format&fit=crop";
              }
            }}
            className="w-full aspect-[16/9] object-cover"
          />
        </div>

        {/* Sticky reservation panel */}
        <aside
          className="liquid-glass p-6 flex flex-col gap-5 self-start"
          style={{ borderRadius: "1.25rem", position: "sticky", top: 96 }}
        >
          <div>
            <span className="text-xs font-body text-white/70">Monthly rent</span>
            <p className="font-heading text-white text-5xl tracking-[-1px] leading-none mt-1">
              {priceLabel(listing).replace("/mo", "")}
            </p>
            {!listing.priceDisplay && (
              <span className="text-xs font-body text-white/70">USD / month</span>
            )}
          </div>
          {listing.sealApproved && (
            <span className="bg-sealGreen text-white rounded-full px-3 py-1 text-xs font-body font-semibold self-start">
              Seal Approved · refund-backed deposit
            </span>
          )}
          <div className="grid grid-cols-2 gap-2 text-xs font-body text-white/75">
            <span className="liquid-glass rounded-xl px-3 py-2 inline-flex items-center gap-2">
              <CheckCircle2 className="h-3.5 w-3.5 text-sealGreen" />
              Source-linked
            </span>
            <span className="liquid-glass rounded-xl px-3 py-2 inline-flex items-center gap-2">
              <RefreshCw className="h-3.5 w-3.5 text-sealSky" />
              Checked {listing.sourceLastChecked}
            </span>
          </div>
          <Link
            to="/for-students"
            className="bg-sealOrange hover:bg-sealOrangeDeep transition-colors rounded-full px-5 py-2.5 text-sm font-medium font-body text-white inline-flex justify-center"
          >
            Reserve this stay
          </Link>
          <Link
            to="/lease-dna-scanner"
            className="text-sm font-body text-white/90 underline-offset-4 hover:underline self-start"
          >
            Run the lease through Lease DNA Scanner →
          </Link>
          {listing.claimStatus === "unclaimed" && (
            <Link
              to="/claim-listing"
              className="text-sm font-body text-sealOrange underline-offset-4 hover:underline self-start"
            >
              Claim or correct this listing →
            </Link>
          )}
        </aside>

        {/* About */}
        <section
          className="lg:col-span-2 liquid-glass p-6"
          style={{ borderRadius: "1.25rem" }}
        >
          <h2 className="font-heading text-white text-3xl tracking-[-1px] leading-none">
            About this stay
          </h2>
          <p className="mt-4 text-sm md:text-base font-body font-light text-white/90 leading-snug">
            {listing.blurb}
          </p>
          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
            <Stat label="Bedrooms" value={listing.bedrooms.toString()} />
            <Stat label="Bathrooms" value={listing.bathrooms.toString()} />
            <Stat label="Sleeps" value={listing.occupancy.toString()} />
            <Stat label="To SGU" value={`${listing.walkToCampus} min`} />
          </div>
          <div className="mt-6 flex flex-wrap gap-2">
            {listing.amenities.map((amenity) => (
              <span
                key={amenity}
                className="liquid-glass rounded-full px-3 py-1 text-[11px] font-body text-white/80"
              >
                {amenity}
              </span>
            ))}
          </div>
        </section>

        <section
          className="liquid-glass p-6"
          style={{ borderRadius: "1.25rem" }}
        >
          <p className="text-xs font-body text-white/70">Truth layer</p>
          <h2 className="mt-1 font-heading text-white text-3xl tracking-[-1px] leading-none">
            Verification status
          </h2>
          <div className="mt-5 space-y-3">
            <TruthRow
              icon={listing.coordinatePrecision === "exact" ? CheckCircle2 : AlertCircle}
              label="Map pin"
              value={
                listing.coordinatePrecision === "exact"
                  ? "Exact property pin"
                  : "Neighborhood-level estimate"
              }
              tone={listing.coordinatePrecision === "exact" ? "good" : "warn"}
            />
            <TruthRow
              icon={listing.claimStatus === "claimed" ? CheckCircle2 : AlertCircle}
              label="Landlord record"
              value={listing.claimStatus === "claimed" ? "Claimed" : "Unclaimed"}
              tone={listing.claimStatus === "claimed" ? "good" : "warn"}
            />
            <TruthRow
              icon={CheckCircle2}
              label="Availability"
              value={`Listed as available by the source agency (${listing.sourceLastChecked})`}
              tone="good"
            />
            <TruthRow
              icon={
                listing.mediaStatus === "owner-provided" || listing.mediaStatus === "agency-source-photo"
                  ? CheckCircle2
                  : AlertCircle
              }
              label="Public media"
              value={
                listing.mediaStatus === "owner-provided"
                  ? "Owner-provided / rights-cleared"
                  : listing.mediaStatus === "agency-source-photo"
                  ? "Agency-published photo of this property"
                  : listing.mediaStatus === "generated-replica-needed"
                  ? "Stock placeholder — source photo is watermarked"
                  : "Stock placeholder — not the actual unit"
              }
              tone={
                listing.mediaStatus === "owner-provided" || listing.mediaStatus === "agency-source-photo"
                  ? "good"
                  : "warn"
              }
            />
            <TruthRow
              icon={CheckCircle2}
              label="Source checked"
              value={`${listing.source.name} · ${listing.sourceLastChecked}`}
              tone="neutral"
            />
          </div>
          <p className="mt-5 text-xs font-body font-light text-white/60 leading-snug">
            We keep source-linked listings searchable while exact coordinates,
            photos, landlord ownership, and availability are confirmed. Approximate
            pins are intentionally labeled until field verification is complete.
          </p>
        </section>

        {/* SealScore */}
        <section
          className="liquid-glass p-6"
          style={{ borderRadius: "1.25rem" }}
        >
          <p className="text-xs font-body text-white/70">SealScore · estimate</p>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="font-heading text-white text-5xl tracking-[-1px] leading-none">
              {score.total}
            </span>
            <span className="text-xs font-body text-white/70">/ 100</span>
          </div>
          <p className="mt-2 text-[11px] font-body font-light text-white/55 leading-snug">
            Modeled from price, location, and walk time — not yet a field
            inspection.
          </p>
          <ul className="mt-4 space-y-2">
            {score.facets.map((f) => (
              <li key={f.label} className="flex items-center gap-3">
                <span className="text-[11px] font-body text-white/70 w-24 shrink-0">
                  {f.label}
                </span>
                <span className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <span
                    className={`block h-full ${f.value >= 85 ? "bg-sealGreen" : f.value >= 60 ? "bg-sealSky" : "bg-sealAmber"}`}
                    style={{ width: `${f.value}%` }}
                  />
                </span>
                <span className="text-[11px] font-body text-white/85 w-8 text-right">
                  {f.value}
                </span>
              </li>
            ))}
          </ul>
        </section>

        {/* Map */}
        <section
          className="lg:col-span-3"
        >
          <p className="text-xs font-body text-sealSky/80 mb-2">// On the map</p>
          <GrenadaMap
            listings={LISTINGS}
            highlightId={listing.id}
            height={400}
          />
        </section>

        {/* Similar */}
        {similar.length > 0 && (
          <section className="lg:col-span-3">
            <p className="text-xs font-body text-sealSky/80 mb-3">
              // More in {listing.neighborhood}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {similar.map((l) => (
                <Link
                  key={l.id}
                  to={`/listings/${l.id}`}
                  className="liquid-glass overflow-hidden flex flex-col group"
                  style={{ borderRadius: "1rem" }}
                >
                  <img
                    src={l.thumb}
                    alt=""
                    className="aspect-[4/3] w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                  />
                  <div className="p-4">
                    <h3 className="font-heading text-white text-xl tracking-[-0.5px] leading-none">
                      {l.title}
                    </h3>
                    <p className="mt-1 text-[11px] font-body font-light text-white/70">
                      {l.bedrooms} BR · {priceLabel(l)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </PageShell>
  );
}

function TruthRow({
  icon: Icon,
  label,
  value,
  tone,
}: {
  icon: ComponentType<{ className?: string }>;
  label: string;
  value: string;
  tone: "good" | "warn" | "neutral";
}) {
  const color =
    tone === "good" ? "text-sealGreen" : tone === "warn" ? "text-sealAmber" : "text-sealSky/70";

  return (
    <div className="flex items-start gap-3">
      <Icon className={`h-4 w-4 mt-0.5 ${color}`} />
      <div>
        <p className="text-[11px] font-body text-white/50">{label}</p>
        <p className="text-sm font-body text-white/85">{value}</p>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div
      className="liquid-glass p-3 text-center"
      style={{ borderRadius: "0.85rem" }}
    >
      <p className="font-heading text-white text-2xl tracking-[-0.5px] leading-none">
        {value}
      </p>
      <p className="mt-1 text-[11px] font-body font-light text-white/70">
        {label}
      </p>
    </div>
  );
}

/** Lightweight SealScore — inputs we already have. Replace with the full
 *  rubric once survey + inspection data lands. */
function computeSealScore(l: { walkToCampus: number; price: number; sealApproved: boolean; bedrooms: number }) {
  const walk = clamp(100 - (l.walkToCampus - 4) * 6, 30, 100);
  const value = clamp(100 - Math.max(0, (l.price - 800) / 30), 30, 100);
  const safety = l.sealApproved ? 92 : 70;
  const wifi = 78; // proxy until we measure
  const generator = l.price > 1500 ? 88 : 70;
  const facets = [
    { label: "Walk to SGU", value: Math.round(walk) },
    { label: "Value", value: Math.round(value) },
    { label: "Safety", value: safety },
    { label: "Wi-Fi", value: wifi },
    { label: "Generator", value: generator },
  ];
  const total = Math.round(
    facets.reduce((s, f) => s + f.value, 0) / facets.length,
  );
  return { total, facets };
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}
