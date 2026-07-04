import { Link, useSearchParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import {
  AlertCircle,
  CheckCircle2,
  Heart,
  MapPin,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";
import PageShell from "../components/PageShell";
import GrenadaMap from "../components/GrenadaMap";
import {
  LISTINGS,
  NEIGHBORHOODS,
  priceLabel,
  type Listing,
  type Neighborhood,
} from "../data/listings";

const ROOM_TYPES: Listing["roomType"][] = [
  "Studio",
  "1BR Apartment",
  "2BR Apartment",
  "3BR+ House",
];

type SortBy = "featured" | "price-asc" | "price-desc" | "campus";

export default function Listings() {
  const [searchParams] = useSearchParams();
  const [query, setQuery] = useState("");
  const [hood, setHood] = useState<Neighborhood | "All">(
    (searchParams.get("neighborhood") as Neighborhood | null) ?? "All",
  );
  const [selectedTypes, setSelectedTypes] = useState<Listing["roomType"][]>([]);
  const [maxPrice, setMaxPrice] = useState<number>(
    Number(searchParams.get("budget")) || 5000,
  );
  const [sealApprovedOnly, setSealApprovedOnly] = useState(false);
  const [exactPinsOnly, setExactPinsOnly] = useState(false);
  const [sortBy, setSortBy] = useState<SortBy>("featured");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [savedIds, setSavedIds] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem("ss_saved_listings") ?? "[]");
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("ss_saved_listings", JSON.stringify(savedIds));
  }, [savedIds]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const result = LISTINGS.filter((listing) => {
      const matchesQuery =
        !q ||
        listing.title.toLowerCase().includes(q) ||
        listing.neighborhood.toLowerCase().includes(q) ||
        listing.location.toLowerCase().includes(q) ||
        listing.amenities.some((amenity) => amenity.toLowerCase().includes(q));

      return (
        matchesQuery &&
        (hood === "All" || listing.neighborhood === hood) &&
        (listing.price === 0 || listing.price <= maxPrice) &&
        (selectedTypes.length === 0 || selectedTypes.includes(listing.roomType)) &&
        (!sealApprovedOnly || listing.sealApproved) &&
        (!exactPinsOnly || listing.coordinatePrecision === "exact")
      );
    });

    return result.sort((a, b) => {
      if (sortBy === "price-asc") return comparablePrice(a) - comparablePrice(b);
      if (sortBy === "price-desc") return comparablePrice(b) - comparablePrice(a);
      if (sortBy === "campus") return a.walkToCampus - b.walkToCampus;
      return Number(b.featured) - Number(a.featured) || a.price - b.price;
    });
  }, [
    exactPinsOnly,
    hood,
    maxPrice,
    query,
    sealApprovedOnly,
    selectedTypes,
    sortBy,
  ]);

  const hasFilters =
    query ||
    hood !== "All" ||
    selectedTypes.length > 0 ||
    maxPrice < 5000 ||
    sealApprovedOnly ||
    exactPinsOnly;

  const exactPinCount = LISTINGS.filter((l) => l.coordinatePrecision === "exact").length;

  function clearFilters() {
    setQuery("");
    setHood("All");
    setSelectedTypes([]);
    setMaxPrice(5000);
    setSealApprovedOnly(false);
    setExactPinsOnly(false);
    setSortBy("featured");
  }

  function toggleType(type: Listing["roomType"]) {
    setSelectedTypes((current) =>
      current.includes(type)
        ? current.filter((value) => value !== type)
        : [...current, type],
    );
  }

  function toggleSaved(id: string) {
    setSavedIds((current) =>
      current.includes(id)
        ? current.filter((savedId) => savedId !== id)
        : [...current, id],
    );
  }

  return (
    <PageShell
      kicker="Find Housing"
      title="Verified rentals near SGU"
      subtitle={`${LISTINGS.length} source-linked listings, ${exactPinCount} exact map pins, and every approximate marker labeled until the property is physically confirmed.`}
    >
      <div className="grid grid-cols-1 lg:grid-cols-[18rem_minmax(0,1fr)] gap-5">
        <aside
          className={`${filtersOpen ? "block" : "hidden"} lg:block liquid-glass p-5 self-start`}
          style={{ borderRadius: "1.25rem", position: "sticky", top: 96 }}
        >
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-body text-white/60">Filters</p>
              <h2 className="font-heading text-white text-3xl leading-none tracking-[-1px]">
                Match your stay
              </h2>
            </div>
            {hasFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="h-9 w-9 rounded-full liquid-glass flex items-center justify-center text-white/80 hover:text-white"
                aria-label="Clear filters"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          <div className="mt-5 space-y-5">
            <label className="block">
              <span className="text-xs font-body text-white/65">Search</span>
              <span className="mt-2 liquid-glass flex items-center gap-2 px-3 py-2 rounded-xl">
                <Search className="h-4 w-4 text-white/50" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Neighborhood, amenity, title"
                  className="w-full bg-transparent outline-none text-sm font-body text-white placeholder:text-white/35"
                />
              </span>
            </label>

            <label className="block">
              <span className="text-xs font-body text-white/65">Neighborhood</span>
              <select
                value={hood}
                onChange={(e) => setHood(e.target.value as Neighborhood | "All")}
                className="mt-2 w-full liquid-glass bg-sealNavyDeep/80 text-white text-sm font-body rounded-xl px-3 py-2 outline-none"
              >
                <option value="All">All neighborhoods</option>
                {NEIGHBORHOODS.map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </label>

            <div>
              <p className="text-xs font-body text-white/65">Room type</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {ROOM_TYPES.map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => toggleType(type)}
                    className={`px-3 py-1.5 rounded-full text-[11px] font-body transition ${
                      selectedTypes.includes(type)
                        ? "bg-sealOrange text-white"
                        : "liquid-glass text-white/75 hover:text-white"
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            <label className="block">
              <span className="text-xs font-body text-white/65">
                Max rent: ${maxPrice.toLocaleString()}/mo
              </span>
              <input
                type="range"
                min={500}
                max={5000}
                step={50}
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="mt-3 w-full accent-sealOrange"
              />
              <span className="mt-1 flex justify-between text-[10px] text-white/40 font-body">
                <span>$500</span>
                <span>$5,000</span>
              </span>
            </label>

            <div className="space-y-3">
              <Toggle
                label="Seal Approved only"
                checked={sealApprovedOnly}
                onChange={() => setSealApprovedOnly((v) => !v)}
              />
              <Toggle
                label="Exact map pins only"
                checked={exactPinsOnly}
                onChange={() => setExactPinsOnly((v) => !v)}
              />
            </div>
          </div>
        </aside>

        <main className="min-w-0">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
            <button
              type="button"
              onClick={() => setFiltersOpen((v) => !v)}
              className="lg:hidden liquid-glass rounded-full px-4 py-2 text-sm font-body text-white inline-flex items-center gap-2"
            >
              <SlidersHorizontal className="h-4 w-4" />
              Filters
            </button>
            <p className="text-sm font-body text-white/70">
              Showing <span className="text-white">{filtered.length}</span> of{" "}
              {LISTINGS.length} listings
            </p>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortBy)}
              className="liquid-glass bg-sealNavyDeep/80 text-white text-sm font-body rounded-full px-4 py-2 outline-none"
            >
              <option value="featured">Featured first</option>
              <option value="price-asc">Price: low to high</option>
              <option value="price-desc">Price: high to low</option>
              <option value="campus">Closest to SGU</option>
            </select>
          </div>

          <GrenadaMap listings={filtered} className="mb-6" height={420} />

          {filtered.length === 0 ? (
            <div
              className="liquid-glass p-10 text-center"
              style={{ borderRadius: "1.25rem" }}
            >
              <h3 className="font-heading text-white text-4xl tracking-[-1px] leading-none">
                No stays match that yet
              </h3>
              <p className="mt-3 text-sm text-white/70 font-body">
                Try clearing a filter or widening the monthly rent.
              </p>
              <button
                type="button"
                onClick={clearFilters}
                className="mt-5 bg-sealOrange text-white rounded-full px-5 py-2.5 text-sm font-body font-medium"
              >
                Clear filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {filtered.map((listing) => (
                <ListingCard
                  key={listing.id}
                  listing={listing}
                  saved={savedIds.includes(listing.id)}
                  onToggleSaved={() => toggleSaved(listing.id)}
                />
              ))}
            </div>
          )}
        </main>
      </div>
    </PageShell>
  );
}

function ListingCard({
  listing,
  saved,
  onToggleSaved,
}: {
  listing: Listing;
  saved: boolean;
  onToggleSaved: () => void;
}) {
  return (
    <article
      className="liquid-glass overflow-hidden flex flex-col group"
      style={{ borderRadius: "1.25rem" }}
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-sealNavyDeep">
        <Link to={`/listings/${listing.id}`} aria-label={`View ${listing.title}`}>
          <img
            src={listing.thumb}
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
        </Link>

        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          {listing.sealApproved && (
            <Badge tone="green">
              <CheckCircle2 className="h-3 w-3" />
              Seal Approved
            </Badge>
          )}
          {listing.mediaStatus !== "agency-source-photo" &&
            listing.mediaStatus !== "owner-provided" && (
              <Badge tone="light">
                <AlertCircle className="h-3 w-3" />
                Stock photo
              </Badge>
            )}
        </div>

        <button
          type="button"
          onClick={onToggleSaved}
          className={`absolute top-3 right-3 h-9 w-9 liquid-glass-strong rounded-full flex items-center justify-center transition-colors ${saved ? "text-sealOrange" : "text-white"}`}
          aria-label={saved ? "Remove saved listing" : "Save listing"}
        >
          <Heart className="h-4 w-4" fill={saved ? "currentColor" : "none"} />
        </button>

      </div>

      <div className="p-5 flex-1 flex flex-col">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-1 text-xs font-body text-white/60">
              <MapPin className="h-3 w-3 text-sealSky" />
              {listing.neighborhood} · {listing.walkToCampus} min to SGU
            </div>
            <Link to={`/listings/${listing.id}`}>
              <h3 className="mt-2 font-heading text-white text-2xl tracking-[-0.5px] leading-none">
                {listing.title}
              </h3>
            </Link>
          </div>
          <div className="text-right shrink-0">
            <div className="flex items-center justify-end gap-1 text-xs font-body text-white/80">
              <CheckCircle2 className="h-3 w-3 text-sealGreen" />
              Source-linked
            </div>
            <p className="text-[10px] text-white/45 font-body">
              checked {listing.sourceLastChecked}
            </p>
          </div>
        </div>

        <p className="mt-3 text-xs font-body font-light text-white/70">
          {listing.roomType} · {listing.bathrooms} BA · sleeps {listing.occupancy}
        </p>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {listing.amenities.slice(0, 4).map((amenity) => (
            <span
              key={amenity}
              className="liquid-glass rounded-full px-2.5 py-1 text-[10px] font-body text-white/80"
            >
              {amenity}
            </span>
          ))}
        </div>

        <div className="mt-4 flex items-center justify-between gap-3 text-[11px] font-body text-white/60">
          <span className="inline-flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            {listing.coordinatePrecision === "exact" ? "Exact pin" : "Approximate pin"}
          </span>
        </div>

        <div className="mt-auto pt-5 flex items-center justify-between gap-3">
          <span>
            <span className="font-heading text-white text-3xl tracking-[-1px]">
              {priceLabel(listing).replace("/mo", "")}
            </span>
            {!listing.priceDisplay && (
              <span className="text-xs font-body text-white/70 ml-1">/ mo</span>
            )}
          </span>
          <Link
            to={`/listings/${listing.id}`}
            className="bg-sealOrange text-white rounded-full px-4 py-2 text-xs font-body font-semibold whitespace-nowrap"
          >
            View
          </Link>
        </div>
      </div>
    </article>
  );
}

function comparablePrice(listing: Listing) {
  return listing.price > 0 ? listing.price : Number.POSITIVE_INFINITY;
}

function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onChange}
      className="w-full flex items-center justify-between gap-3 text-sm font-body text-white/80"
    >
      <span>{label}</span>
      <span
        className={`relative h-5 w-10 rounded-full transition ${
          checked ? "bg-sealOrange" : "bg-white/20"
        }`}
      >
        <span
          className="absolute top-0.5 h-4 w-4 rounded-full bg-white transition"
          style={{ left: checked ? "1.35rem" : "0.125rem" }}
        />
      </span>
    </button>
  );
}

const BADGE_TONES = {
  orange: "bg-sealOrange text-white",
  green: "bg-sealGreen text-white",
  sky: "bg-sealSky text-sealNavyDeep",
  light: "bg-white/90 text-sealNavyDeep",
} as const;

function Badge({
  children,
  tone,
}: {
  children: ReactNode;
  tone: keyof typeof BADGE_TONES;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-body font-semibold shadow ${BADGE_TONES[tone]}`}
    >
      {children}
    </span>
  );
}
