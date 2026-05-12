import { Link } from "react-router-dom";
import { useMemo, useState } from "react";
import PageShell from "../components/PageShell";
import GrenadaMap from "../components/GrenadaMap";
import { LISTINGS, NEIGHBORHOODS, type Neighborhood } from "../data/listings";

export default function Listings() {
  const [hood, setHood] = useState<Neighborhood | "All">("All");
  const [maxPrice, setMaxPrice] = useState<number>(5000);

  const filtered = useMemo(
    () =>
      LISTINGS.filter(
        (l) =>
          (hood === "All" || l.neighborhood === hood) && l.price <= maxPrice,
      ).sort((a, b) => a.price - b.price),
    [hood, maxPrice],
  );

  return (
    <PageShell
      kicker="Find Housing"
      title="Verified rentals near SGU"
      subtitle={`${LISTINGS.length} listings across Lance aux Épines, True Blue, Grand Anse, Morne Rouge, St. George's, and Westerhall. Every property inspected. Every lease decoded.`}
    >
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <FilterPill
          active={hood === "All"}
          onClick={() => setHood("All")}
          label={`All (${LISTINGS.length})`}
        />
        {NEIGHBORHOODS.map((n) => {
          const count = LISTINGS.filter((l) => l.neighborhood === n).length;
          return (
            <FilterPill
              key={n}
              active={hood === n}
              onClick={() => setHood(n)}
              label={`${n} (${count})`}
            />
          );
        })}

        <div
          className="liquid-glass ml-auto px-4 py-2 flex items-center gap-3"
          style={{ borderRadius: "9999px" }}
        >
          <span className="text-xs font-body text-white/70 whitespace-nowrap">
            Max ${maxPrice.toLocaleString()}/mo
          </span>
          <input
            type="range"
            min={500}
            max={5000}
            step={50}
            value={maxPrice}
            onChange={(e) => setMaxPrice(parseInt(e.target.value, 10))}
            className="accent-sealOrange w-44"
          />
        </div>
      </div>

      {/* Map */}
      <GrenadaMap listings={filtered} className="mb-8" height={420} />

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((l) => (
          <Link
            key={l.id}
            to={`/listings/${l.id}`}
            className="liquid-glass overflow-hidden flex flex-col group"
            style={{ borderRadius: "1.25rem" }}
          >
            <div className="relative aspect-[4/3] overflow-hidden bg-sealNavyDeep">
              <img
                src={l.thumb}
                alt=""
                loading="lazy"
                onError={(e) => {
                  const t = e.currentTarget;
                  if (!t.dataset.fallback) {
                    t.dataset.fallback = "1";
                    t.src =
                      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=900&q=70&auto=format&fit=crop";
                  }
                }}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
              />
              {l.sealApproved && (
                <span className="absolute top-3 left-3 bg-sealOrange text-white rounded-full px-2.5 py-1 text-[10px] font-body font-semibold">
                  Seal Approved
                </span>
              )}
              <span className="absolute bottom-3 right-3 liquid-glass-strong text-white px-3 py-1 text-xs font-body rounded-full">
                {l.walkToCampus} min to SGU
              </span>
            </div>
            <div className="p-5 flex-1 flex flex-col">
              <h3 className="font-heading text-white text-2xl tracking-[-0.5px] leading-none">
                {l.title}
              </h3>
              <p className="mt-1 text-xs font-body font-light text-white/70">
                {l.neighborhood} · {l.bedrooms} BR · {l.bathrooms} BA
              </p>
              <p className="mt-3 text-sm font-body font-light text-white/85 leading-snug line-clamp-2">
                {l.blurb}
              </p>
              <div className="mt-auto pt-4 flex items-baseline justify-between">
                <span>
                  <span className="font-heading text-white text-3xl tracking-[-1px]">
                    ${l.price.toLocaleString()}
                  </span>
                  <span className="text-xs font-body text-white/70 ml-1">
                    / mo
                  </span>
                </span>
                <span className="text-xs font-body text-white/60 group-hover:text-white">
                  View →
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {filtered.length === 0 && (
        <div
          className="liquid-glass p-8 text-center text-white/80 font-body"
          style={{ borderRadius: "1.25rem" }}
        >
          No listings match those filters yet. Try widening the price range or
          picking a different neighborhood.
        </div>
      )}
    </PageShell>
  );
}

function FilterPill({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-4 py-2 text-xs font-body font-medium rounded-full transition ${
        active
          ? "bg-sealOrange text-white"
          : "liquid-glass text-white/85 hover:text-white"
      }`}
    >
      {label}
    </button>
  );
}
