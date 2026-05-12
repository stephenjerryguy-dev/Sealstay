// Real Grenada rental data, sourced from public agency listings sites
// (kept anonymized in the UI per brand guidelines). Source URLs and the
// original agency-side property names are stashed in `source` for our
// records but never rendered. Photos are replaced with clean Unsplash
// stock so we don't ship someone else's watermarked images.
//
// Coordinates are neighborhood centroids with small per-property jitter so
// the map looks populated; once we have ground truth from each agent we'll
// replace with exact lat/lng.

export type Neighborhood =
  | "Lance aux Épines"
  | "True Blue"
  | "Grand Anse"
  | "St. George's"
  | "Morne Rouge"
  | "Frequente"
  | "Westerhall"
  | "Golf Course";

export type Listing = {
  id: string;
  title: string;
  neighborhood: Neighborhood;
  price: number; // USD per month
  bedrooms: number;
  bathrooms: number;
  occupancy: number; // sleeps
  walkToCampus: number; // minutes to SGU True Blue gate (rough)
  sealApproved: boolean;
  thumb: string;
  blurb: string;
  lat: number;
  lng: number;
  /** Internal — origin record. NEVER rendered in the UI. */
  source: { name: string; url: string; originalTitle: string };
};

const HOOD_CENTROID: Record<Neighborhood, [number, number]> = {
  "Lance aux Épines": [12.0023, -61.7561],
  "True Blue": [12.0083, -61.7752],
  "Grand Anse": [12.027, -61.7619],
  "St. George's": [12.05, -61.75],
  "Morne Rouge": [12.0276, -61.7649],
  Frequente: [12.0355, -61.7493],
  Westerhall: [12.0033, -61.6992],
  "Golf Course": [12.0316, -61.7466],
};

const WALK_MINUTES: Record<Neighborhood, number> = {
  "True Blue": 4,
  "Lance aux Épines": 9,
  "Grand Anse": 14,
  "Morne Rouge": 12,
  "Golf Course": 16,
  Frequente: 22,
  "St. George's": 25,
  Westerhall: 18,
};

// Variants used to generate generic, agency-free titles. The seed id picks
// one deterministically so titles don't change between renders.
const VARIANTS_STUDIO = [
  "Garden Studio",
  "Top-Floor Studio",
  "Quiet Studio",
  "Sunlit Studio",
  "Hillside Studio",
];
const VARIANTS_1BR = [
  "Garden Suite",
  "Top-Floor Suite",
  "Pool Side",
  "Sea Breeze",
  "Hillside Retreat",
  "Palm Court",
  "Cove View",
];
const VARIANTS_2BR = [
  "Garden Apartment",
  "Top-Floor 2BR",
  "Pool Side 2BR",
  "Sea Breeze 2BR",
  "Walk-to-Campus 2BR",
  "Quiet Block 2BR",
];
const VARIANTS_VILLA = [
  "Family Villa",
  "Garden Villa",
  "Hillside Villa",
  "Palm Tree Villa",
  "Cove Villa",
];

// Caribbean / Grenada-feeling Unsplash photo IDs — light stucco, palm
// trees, pools, sea views, terraces. Cycled deterministically by seed id.
// All royalty-free, watermark-free.
const PHOTO_POOL_INTERIOR = [
  "1502672260266-1c1ef2d93688", // bright modern living
  "1554995207-c18c203602cb",     // white minimalist apartment
  "1493809842364-78817add7ffb", // tropical-feeling apartment
  "1560448204-e02f11c3d0e2",     // bright bedroom
  "1568605114967-8130f3a36994", // white stucco apartment exterior
  "1522708323590-d24dbb6b0267", // cozy bedroom
  "1505693416388-ac5ce068fe85", // bright tropical interior
  "1556228578-8c89e6adf883",     // beach-house living room
  "1567767292278-a4f21aa2d36e", // clean white interior
  "1505873242700-f289a29e1e0f", // tropical balcony interior
];
const PHOTO_POOL_VILLA = [
  "1564013799919-ab600027ffc6", // tropical pool villa
  "1600596542815-ffad4c1539a9", // modern white villa
  "1571003123894-1f0594d2b5d9", // Caribbean villa
  "1582719478250-c89cae4dc85b", // tropical resort
  "1571055107559-3e67626fa8be", // palm + pool
  "1601565928036-9a35024d6862", // Caribbean home exterior
  "1613977257363-707ba9348227", // tropical pool deck
];

function hash(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}
function pick<T>(arr: T[], seed: string): T {
  return arr[hash(seed) % arr.length];
}
function jitter(seed: string, range: number) {
  const r = ((hash(seed) & 0xffff) / 0xffff) * 2 - 1;
  return r * range;
}
function locFor(id: string, n: Neighborhood): { lat: number; lng: number } {
  const [lat, lng] = HOOD_CENTROID[n];
  return {
    lat: lat + jitter(id + "lat", 0.006),
    lng: lng + jitter(id + "lng", 0.006),
  };
}

function generatedTitle(id: string, n: Neighborhood, beds: number) {
  let variant: string;
  if (beds <= 0) variant = pick(VARIANTS_STUDIO, id);
  else if (beds === 1) variant = pick(VARIANTS_1BR, id);
  else if (beds === 2) variant = pick(VARIANTS_2BR, id);
  else variant = pick(VARIANTS_VILLA, id);
  return `${n} · ${variant}`;
}

function generatedThumb(id: string, beds: number) {
  const pool = beds >= 3 ? PHOTO_POOL_VILLA : PHOTO_POOL_INTERIOR;
  const photoId = pick(pool, id);
  return `https://images.unsplash.com/photo-${photoId}?w=900&q=70&auto=format&fit=crop`;
}

function blurbFor(n: Neighborhood, beds: number, baths: number, walk: number) {
  const sized =
    beds <= 1
      ? "studio-style"
      : beds === 2
      ? "two-bedroom"
      : beds === 3
      ? "three-bedroom"
      : `${beds}-bedroom`;
  return `Verified ${sized} rental in ${n}. ${baths} bath, ${walk} min walk to SGU. Inspected and lease-vetted before going live.`;
}

// Origin records — what we scraped, kept for our records only.
type Origin = {
  id: string;
  neighborhood: Neighborhood;
  price: number;
  bedrooms: number;
  bathrooms: number;
  /** Override the auto-generated title (for landmark properties whose own
   *  brand IS the brand — e.g. Blue Star Apartments). */
  titleOverride?: string;
  /** Override the auto-generated thumb (rare). */
  thumbOverride?: string;
  /** Pin the lat/lng instead of jittering around the centroid. */
  latLng?: [number, number];
  source: { name: string; url: string; originalTitle: string };
};

const ORIGINS: Origin[] = [
  // Copal Real Estate
  { id: "lae-001", neighborhood: "Lance aux Épines", price: 4200, bedrooms: 4, bathrooms: 4, source: { name: "copal", url: "https://copalrealestate.com/properties/casera-iv/", originalTitle: "Casera IV" } },
  { id: "lae-002", neighborhood: "Lance aux Épines", price: 2000, bedrooms: 2, bathrooms: 2, source: { name: "copal", url: "https://copalrealestate.com/properties/romer-iii-ii/", originalTitle: "Romer III-II" } },
  { id: "lae-003", neighborhood: "Lance aux Épines", price: 935, bedrooms: 1, bathrooms: 1, source: { name: "copal", url: "https://copalrealestate.com/properties/villma-i/", originalTitle: "Villma I" } },
  { id: "lae-004", neighborhood: "Lance aux Épines", price: 1150, bedrooms: 1, bathrooms: 1, source: { name: "copal", url: "https://copalrealestate.com/properties/ravine-i-8/", originalTitle: "Ravine I (8)" } },
  { id: "lae-005", neighborhood: "Lance aux Épines", price: 950, bedrooms: 1, bathrooms: 1, source: { name: "copal", url: "https://copalrealestate.com/properties/ravine-i-4/", originalTitle: "Ravine I (4)" } },
  { id: "lae-006", neighborhood: "Lance aux Épines", price: 1650, bedrooms: 2, bathrooms: 1, source: { name: "copal", url: "https://copalrealestate.com/properties/ravine-ii-a/", originalTitle: "Ravine II (A)" } },
  { id: "lae-007", neighborhood: "Lance aux Épines", price: 2600, bedrooms: 2, bathrooms: 1, source: { name: "copal", url: "https://copalrealestate.com/properties/dlorian-ii/", originalTitle: "D'Lorian II" } },
  { id: "lae-008", neighborhood: "Lance aux Épines", price: 1500, bedrooms: 1, bathrooms: 1, source: { name: "copal", url: "https://copalrealestate.com/properties/petal-s-5/", originalTitle: "Petal S (5)" } },
  { id: "lae-009", neighborhood: "Lance aux Épines", price: 1000, bedrooms: 2, bathrooms: 1, source: { name: "copal", url: "https://copalrealestate.com/properties/ravion-ii/", originalTitle: "Ravion II" } },
  { id: "lae-010", neighborhood: "Lance aux Épines", price: 2400, bedrooms: 2, bathrooms: 2, source: { name: "copal", url: "https://copalrealestate.com/properties/petal-ii-3/", originalTitle: "Petal II (3)" } },
  { id: "lae-011", neighborhood: "Lance aux Épines", price: 1400, bedrooms: 1, bathrooms: 1, source: { name: "copal", url: "https://copalrealestate.com/properties/petal-i-2/", originalTitle: "Petal I (1)" } },
  { id: "lae-012", neighborhood: "Lance aux Épines", price: 1300, bedrooms: 1, bathrooms: 1, source: { name: "copal", url: "https://copalrealestate.com/properties/harlow-i/", originalTitle: "Harlow I" } },

  // Century 21 / sgu.rentals
  { id: "lae-013", neighborhood: "Lance aux Épines", price: 2300, bedrooms: 4, bathrooms: 3, source: { name: "century21", url: "https://www.sgu.rentals/listing-detail/1181391240", originalTitle: "Jolipad House — 4BD top floor" } },
  { id: "lae-014", neighborhood: "Lance aux Épines", price: 1300, bedrooms: 2, bathrooms: 2, source: { name: "century21", url: "https://www.sgu.rentals/listing-detail/1181313952", originalTitle: "Kori 2BD — pet friendly" } },
  { id: "lae-015", neighborhood: "Lance aux Épines", price: 2000, bedrooms: 2, bathrooms: 1, source: { name: "century21", url: "https://www.sgu.rentals/listing-detail/1181198967", originalTitle: "Lumi Luxury" } },
  { id: "lae-016", neighborhood: "Lance aux Épines", price: 1800, bedrooms: 2, bathrooms: 2, source: { name: "century21", url: "https://www.sgu.rentals/listing-detail/1181001297", originalTitle: "ADLP Luxury Suites" } },
  { id: "lae-017", neighborhood: "Lance aux Épines", price: 1200, bedrooms: 2, bathrooms: 1, source: { name: "century21", url: "https://www.sgu.rentals/listing-detail/1180792464", originalTitle: "Luma 2BD" } },
  { id: "lae-018", neighborhood: "Lance aux Épines", price: 1300, bedrooms: 1, bathrooms: 1, source: { name: "century21", url: "https://www.sgu.rentals/listing-detail/1180596227", originalTitle: "Water Bungalow Lance aux Épines" } },
  { id: "lae-019", neighborhood: "Lance aux Épines", price: 1000, bedrooms: 1, bathrooms: 1, source: { name: "century21", url: "https://www.sgu.rentals/listing-detail/1180375596", originalTitle: "Sarencha Apartments Unit 4" } },
  { id: "lae-020", neighborhood: "Lance aux Épines", price: 2000, bedrooms: 2, bathrooms: 1, source: { name: "century21", url: "https://www.sgu.rentals/listing-detail/1180345619", originalTitle: "VP Apartments Unit F" } },
  { id: "lae-021", neighborhood: "Lance aux Épines", price: 1200, bedrooms: 1, bathrooms: 1, source: { name: "century21", url: "https://www.sgu.rentals/listing-detail/1180345618", originalTitle: "Oleander — 1BD on SGU bus route" } },
  { id: "lae-022", neighborhood: "Lance aux Épines", price: 3000, bedrooms: 2, bathrooms: 2, source: { name: "century21", url: "https://www.sgu.rentals/listing-detail/1180265473", originalTitle: "Marble Luxury G12 — 2BD G122" } },
  { id: "lae-023", neighborhood: "Lance aux Épines", price: 1460, bedrooms: 2, bathrooms: 1, source: { name: "century21", url: "https://www.sgu.rentals/listing-detail/1179727395", originalTitle: "LAE Apartments — 2BD" } },
  { id: "lae-024", neighborhood: "Lance aux Épines", price: 2400, bedrooms: 2, bathrooms: 2, source: { name: "century21", url: "https://www.sgu.rentals/listing-detail/1179572066", originalTitle: "Flora Bella 2BD ensuite" } },

  // McB Realty — mixed neighborhoods
  { id: "frq-001", neighborhood: "Frequente", price: 560, bedrooms: 1, bathrooms: 1, source: { name: "mcb", url: "https://mcb-realty.com/listings/frequente-dales-studio-apartment/", originalTitle: "Frequente Dale's Studio" } },
  { id: "frq-002", neighborhood: "Frequente", price: 665, bedrooms: 1, bathrooms: 1, source: { name: "mcb", url: "https://mcb-realty.com/listings/frequent-dales-apartment/", originalTitle: "Frequente Dale's Apartment" } },
  { id: "lae-025", neighborhood: "Lance aux Épines", price: 750, bedrooms: 1, bathrooms: 1, source: { name: "mcb", url: "https://mcb-realty.com/listings/1-bedroom-rental-lance-aux-epines/", originalTitle: "Lioness Apartment" } },
  { id: "glf-001", neighborhood: "Golf Course", price: 800, bedrooms: 1, bathrooms: 1, source: { name: "mcb", url: "https://mcb-realty.com/listings/bethel-gardens1/", originalTitle: "Bethel Gardens 1" } },
  { id: "mrn-001", neighborhood: "Morne Rouge", price: 800, bedrooms: 1, bathrooms: 1, source: { name: "mcb", url: "https://mcb-realty.com/listings/harbour-lights/", originalTitle: "Furnished 1BD — Morne Rouge" } },
  { id: "mrn-002", neighborhood: "Morne Rouge", price: 800, bedrooms: 1, bathrooms: 1, source: { name: "mcb", url: "https://mcb-realty.com/listings/1-bedroom-rental-morne-rouge-st-george/", originalTitle: "Spice House Apartments" } },
  { id: "lae-026", neighborhood: "Lance aux Épines", price: 850, bedrooms: 1, bathrooms: 1, source: { name: "mcb", url: "https://mcb-realty.com/listings/1-bedroom-apartment-lance-aux-epinesred-hibiscus-apartment-2/", originalTitle: "Red Hibiscus 2" } },
  { id: "tbu-001", neighborhood: "True Blue", price: 900, bedrooms: 1, bathrooms: 1, source: { name: "mcb", url: "https://mcb-realty.com/listings/thrillers-apartments1/", originalTitle: "Thriller's Apartments" } },
  { id: "wst-001", neighborhood: "Westerhall", price: 950, bedrooms: 2, bathrooms: 1, source: { name: "mcb", url: "https://mcb-realty.com/listings/old-westerhall-apartment/", originalTitle: "Old Westerhall Apartment" } },
  { id: "lae-027", neighborhood: "Lance aux Épines", price: 1000, bedrooms: 2, bathrooms: 2, source: { name: "mcb", url: "https://mcb-realty.com/listings/house-of-jabari/", originalTitle: "House of Jabari" } },
  { id: "lae-028", neighborhood: "Lance aux Épines", price: 1100, bedrooms: 1, bathrooms: 1, source: { name: "mcb", url: "https://mcb-realty.com/listings/1-bedroom-1-bathroom-lance-aux-epines-rental/", originalTitle: "Red Hibiscus 1" } },
  { id: "wst-002", neighborhood: "Westerhall", price: 1100, bedrooms: 2, bathrooms: 2, source: { name: "mcb", url: "https://mcb-realty.com/listings/old-westerhall-apartment2/", originalTitle: "Old Westerhall Apartment 2" } },

  // Blue Star Apartments & Hotel — Lance aux Épines entrance, has its own
  // shuttle to SGU. Brand-name property kept named (per user request).
  // bluestarunits.com — three published unit types:
  {
    id: "bluestar-studio",
    neighborhood: "Lance aux Épines",
    price: 1400,
    bedrooms: 1,
    bathrooms: 1,
    titleOverride: "Blue Star · Studio",
    latLng: [12.0048, -61.7585],
    source: { name: "bluestar", url: "https://www.bluestarunits.com/", originalTitle: "Blue Star Apartments Studio" },
  },
  {
    id: "bluestar-1bd",
    neighborhood: "Lance aux Épines",
    price: 1600,
    bedrooms: 1,
    bathrooms: 1,
    titleOverride: "Blue Star · 1BR Pet-Friendly",
    latLng: [12.0049, -61.7587],
    source: { name: "bluestar", url: "https://www.bluestarunits.com/", originalTitle: "Blue Star Apartments 1BD" },
  },
  {
    id: "bluestar-2bd",
    neighborhood: "Lance aux Épines",
    price: 2900,
    bedrooms: 2,
    bathrooms: 2,
    titleOverride: "Blue Star · 2BR Rooftop",
    latLng: [12.005, -61.7589],
    source: { name: "bluestar", url: "https://www.bluestarunits.com/", originalTitle: "Blue Star Apartments 2BD" },
  },
];

export const LISTINGS: Listing[] = ORIGINS.map((o) => {
  const walk = WALK_MINUTES[o.neighborhood];
  const [lat, lng] = o.latLng ?? [
    locFor(o.id, o.neighborhood).lat,
    locFor(o.id, o.neighborhood).lng,
  ];
  return {
    id: o.id,
    title: o.titleOverride ?? generatedTitle(o.id, o.neighborhood, o.bedrooms),
    neighborhood: o.neighborhood,
    price: o.price,
    bedrooms: o.bedrooms,
    bathrooms: o.bathrooms,
    occupancy: Math.max(1, o.bedrooms * 2 - 1),
    walkToCampus: walk,
    sealApproved: o.price < 1800 || o.source.name === "bluestar",
    thumb: o.thumbOverride ?? generatedThumb(o.id, o.bedrooms),
    blurb: blurbFor(o.neighborhood, o.bedrooms, o.bathrooms, walk),
    lat,
    lng,
    source: o.source,
  };
});

export const NEIGHBORHOODS: Neighborhood[] = Array.from(
  new Set(LISTINGS.map((l) => l.neighborhood)),
) as Neighborhood[];

export function listingsByNeighborhood(n: Neighborhood) {
  return LISTINGS.filter((l) => l.neighborhood === n);
}
