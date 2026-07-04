// Real Grenada rental data, sourced from public agency listings sites
// (kept anonymized in the UI per brand guidelines). Source URLs and the
// original agency-side property names are stashed in `source` for our
// records but never rendered.
//
// Photos: where the agency publishes a clean (watermark-free) photo of the
// property we hotlink it (`agency-source-photo`); watermarked or unusable
// photos are NEVER copied or de-watermarked — those listings keep a
// rights-cleared Unsplash placeholder until we shoot or generate our own
// (`generated-replica-needed`).
//
// Coordinates: `latLng` = the agency's own geocode for the property (exact
// pin). `areaLatLng` = the agency only published a shared area-level pin —
// we use it as the anchor with a small deterministic jitter and label the
// pin approximate. Entries with neither fall back to our hood centroids.

export type Neighborhood =
  | "Lance aux Épines"
  | "True Blue"
  | "Grand Anse"
  | "St. George's"
  | "Morne Rouge"
  | "Frequente"
  | "Westerhall"
  | "Golf Course"
  | "Calliste"
  | "Point Salines";

export type Listing = {
  id: string;
  title: string;
  neighborhood: Neighborhood;
  location: string;
  price: number; // USD per month
  priceDisplay?: string;
  bedrooms: number;
  bathrooms: number;
  occupancy: number; // sleeps
  walkToCampus: number; // minutes to SGU True Blue gate (rough)
  sealApproved: boolean;
  available: boolean;
  availableFrom: string;
  featured: boolean;
  /** Only present once real student reviews exist — never fabricated. */
  rating?: number;
  reviewCount: number;
  waitlistCount: number;
  hasLeaseBreak: boolean;
  claimStatus: "claimed" | "unclaimed";
  roomType: "Studio" | "1BR Apartment" | "2BR Apartment" | "3BR+ House";
  amenities: string[];
  thumb: string;
  mediaStatus: "rights-cleared-placeholder" | "owner-provided" | "generated-replica-needed" | "agency-source-photo";
  sourceLastChecked: string;
  blurb: string;
  lat: number;
  lng: number;
  coordinatePrecision: "exact" | "neighborhood";
  verificationStatus: "verified" | "source-linked" | "pending";
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
  Calliste: [12.0055, -61.7715],
  "Point Salines": [12.0065, -61.7838],
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
  Calliste: 11,
  "Point Salines": 18,
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
  "1484154218962-a197022b5858", // bright apartment kitchen
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
  return `Source-linked ${sized} rental in ${n}. ${baths} bath, roughly ${walk} min to the SGU True Blue gate. Listed by a local agency; SealStay field verification pending.`;
}

function roomTypeFor(beds: number): Listing["roomType"] {
  if (beds <= 0) return "Studio";
  if (beds === 1) return "1BR Apartment";
  if (beds === 2) return "2BR Apartment";
  return "3BR+ House";
}

// Only amenities we can stand behind market-wide. Per-unit amenities come
// from the agency page once we mirror them individually — never invented.
const BASELINE_AMENITIES = ["Furnished"];

// Origin records — what we scraped, kept for our records only.
type Origin = {
  id: string;
  neighborhood: Neighborhood;
  price: number;
  priceDisplay?: string;
  bedrooms: number;
  bathrooms: number;
  /** Override the auto-generated title (for landmark properties whose own
   *  brand IS the brand — e.g. Blue Star Apartments). */
  titleOverride?: string;
  /** Override the auto-generated thumb (rare). */
  thumbOverride?: string;
  /** Publicly visible media is never copied from agent sites unless licensed. */
  mediaStatus?: Listing["mediaStatus"];
  /** Pin the lat/lng instead of jittering around the centroid. */
  latLng?: [number, number];
  /** Agency-published area-level pin — anchor for jitter, precision stays
   *  "neighborhood". Used when the agency shares one pin across listings. */
  areaLatLng?: [number, number];
  sourceLastChecked?: string;
  source: { name: string; url: string; originalTitle: string };
};

const ORIGINS: Origin[] = [
  // Copal Real Estate — full /rent/ inventory re-checked 2026-07-03.
  // Lance aux Épines
  { id: "lae-003", neighborhood: "Lance aux Épines", price: 935, bedrooms: 1, bathrooms: 1, areaLatLng: [11.998833, -61.756109], thumbOverride: "https://copalrealestate.com/wp-content/uploads/2026/03/DSC_0858.jpg", mediaStatus: "agency-source-photo", source: { name: "copal", url: "https://copalrealestate.com/properties/villma-i/", originalTitle: "Villma I" } },
  { id: "lae-006", neighborhood: "Lance aux Épines", price: 1650, bedrooms: 2, bathrooms: 2, areaLatLng: [11.998833, -61.756109], thumbOverride: "https://copalrealestate.com/wp-content/uploads/2026/02/IMG_7774.jpg", mediaStatus: "agency-source-photo", source: { name: "copal", url: "https://copalrealestate.com/properties/ravine-ii-a/", originalTitle: "Ravine II (A)" } },
  { id: "lae-007", neighborhood: "Lance aux Épines", price: 2500, bedrooms: 2, bathrooms: 1, areaLatLng: [11.998833, -61.756109], thumbOverride: "https://copalrealestate.com/wp-content/uploads/2025/11/DSC_0305.jpg", mediaStatus: "agency-source-photo", source: { name: "copal", url: "https://copalrealestate.com/properties/dlorian-ii/", originalTitle: "D'Lorian II" } },
  { id: "lae-008", neighborhood: "Lance aux Épines", price: 1500, bedrooms: 1, bathrooms: 1, areaLatLng: [11.9980296603, -61.75618082561], thumbOverride: "https://copalrealestate.com/wp-content/uploads/2025/05/DSC_9327.jpg", mediaStatus: "agency-source-photo", source: { name: "copal", url: "https://copalrealestate.com/properties/petal-s-5/", originalTitle: "Petal S (5)" } },
  { id: "lae-010", neighborhood: "Lance aux Épines", price: 2400, bedrooms: 2, bathrooms: 2, areaLatLng: [11.9980296603, -61.75618082561], thumbOverride: "https://copalrealestate.com/wp-content/uploads/2025/01/DSC_8509.jpg", mediaStatus: "agency-source-photo", source: { name: "copal", url: "https://copalrealestate.com/properties/petal-ii-3/", originalTitle: "Petal II (3)" } },
  { id: "lae-011", neighborhood: "Lance aux Épines", price: 1650, bedrooms: 1, bathrooms: 1, areaLatLng: [11.9980296603, -61.75618082561], thumbOverride: "https://copalrealestate.com/wp-content/uploads/2025/01/DSC_8546.jpg", mediaStatus: "agency-source-photo", source: { name: "copal", url: "https://copalrealestate.com/properties/petal-i-1/", originalTitle: "Petal I (2)" } },
  { id: "lae-012", neighborhood: "Lance aux Épines", price: 1300, bedrooms: 1, bathrooms: 1, areaLatLng: [11.998833, -61.756109], thumbOverride: "https://copalrealestate.com/wp-content/uploads/2025/01/IMG-20250123-WA0001.jpg", mediaStatus: "agency-source-photo", source: { name: "copal", url: "https://copalrealestate.com/properties/harlow-i/", originalTitle: "Harlow I" } },
  { id: "lae-029", neighborhood: "Lance aux Épines", price: 900, bedrooms: 1, bathrooms: 1, latLng: [11.996434, -61.755923], thumbOverride: "https://copalrealestate.com/wp-content/uploads/2022/02/DSC_0210.jpg", mediaStatus: "agency-source-photo", source: { name: "copal", url: "https://copalrealestate.com/properties/victor-i-a-n/", originalTitle: "Victor I (A)" } },
  { id: "lae-030", neighborhood: "Lance aux Épines", price: 700, bedrooms: 1, bathrooms: 1, areaLatLng: [11.998833, -61.756109], thumbOverride: "https://copalrealestate.com/wp-content/uploads/2018/04/DSC_1280.jpg", mediaStatus: "agency-source-photo", source: { name: "copal", url: "https://copalrealestate.com/properties/howard-i/", originalTitle: "Howard I" } },
  { id: "lae-031", neighborhood: "Lance aux Épines", price: 1000, bedrooms: 1, bathrooms: 1, areaLatLng: [11.998833, -61.756109], thumbOverride: "https://copalrealestate.com/wp-content/uploads/2018/05/DSC_5387.jpg", mediaStatus: "agency-source-photo", source: { name: "copal", url: "https://copalrealestate.com/properties/iredale-i/", originalTitle: "Iredale I" } },
  { id: "lae-032", neighborhood: "Lance aux Épines", price: 1000, bedrooms: 2, bathrooms: 1, areaLatLng: [11.998833, -61.756109], thumbOverride: "https://copalrealestate.com/wp-content/uploads/2018/04/DSC_0988-1.jpg", mediaStatus: "agency-source-photo", source: { name: "copal", url: "https://copalrealestate.com/properties/allen-ii/", originalTitle: "Allen II" } },
  { id: "lae-033", neighborhood: "Lance aux Épines", price: 1000, bedrooms: 2, bathrooms: 2, areaLatLng: [11.998833, -61.756109], thumbOverride: "https://copalrealestate.com/wp-content/uploads/2017/07/DSC_0728.jpg", mediaStatus: "agency-source-photo", source: { name: "copal", url: "https://copalrealestate.com/properties/murray-ii/", originalTitle: "Murray II" } },
  { id: "lae-034", neighborhood: "Lance aux Épines", price: 1000, bedrooms: 1, bathrooms: 1, areaLatLng: [11.998833, -61.756109], thumbOverride: "https://copalrealestate.com/wp-content/uploads/2024/09/DSC_7807.jpg", mediaStatus: "agency-source-photo", source: { name: "copal", url: "https://copalrealestate.com/properties/harlow-s-l/", originalTitle: "Harlow S (L)" } },
  { id: "lae-035", neighborhood: "Lance aux Épines", price: 1200, bedrooms: 2, bathrooms: 2, areaLatLng: [11.998833, -61.756109], thumbOverride: "https://copalrealestate.com/wp-content/uploads/2018/04/DSC_0268.jpg", mediaStatus: "agency-source-photo", source: { name: "copal", url: "https://copalrealestate.com/properties/howard-ii/", originalTitle: "Howard II" } },
  { id: "lae-036", neighborhood: "Lance aux Épines", price: 1500, bedrooms: 1, bathrooms: 1, areaLatLng: [11.998833, -61.756109], thumbOverride: "https://copalrealestate.com/wp-content/uploads/2019/08/DSC_7265.jpg", mediaStatus: "agency-source-photo", source: { name: "copal", url: "https://copalrealestate.com/properties/botanic-view-i/", originalTitle: "Botanic View I" } },
  { id: "lae-037", neighborhood: "Lance aux Épines", price: 1500, bedrooms: 1, bathrooms: 1, areaLatLng: [11.998833, -61.756109], thumbOverride: "https://copalrealestate.com/wp-content/uploads/2024/09/DSC_7823.jpg", mediaStatus: "agency-source-photo", source: { name: "copal", url: "https://copalrealestate.com/properties/harlow-s-u/", originalTitle: "Harlow S (U)" } },
  { id: "lae-038", neighborhood: "Lance aux Épines", price: 1600, bedrooms: 2, bathrooms: 2, areaLatLng: [11.9980296603, -61.75618082561], thumbOverride: "https://copalrealestate.com/wp-content/uploads/2022/02/DSC_5332.jpg", mediaStatus: "agency-source-photo", source: { name: "copal", url: "https://copalrealestate.com/properties/jewel-ii/", originalTitle: "Jewel II" } },
  { id: "lae-039", neighborhood: "Lance aux Épines", price: 1600, bedrooms: 2, bathrooms: 2, areaLatLng: [11.998833, -61.756109], thumbOverride: "https://copalrealestate.com/wp-content/uploads/2020/01/DSC_5412.jpg", mediaStatus: "agency-source-photo", source: { name: "copal", url: "https://copalrealestate.com/properties/robbins-ii-4/", originalTitle: "Robbins II (4)" } },
  { id: "lae-040", neighborhood: "Lance aux Épines", price: 1800, bedrooms: 1, bathrooms: 1, areaLatLng: [11.9980296603, -61.75618082561], thumbOverride: "https://copalrealestate.com/wp-content/uploads/2025/01/DSC_8581.jpg", mediaStatus: "agency-source-photo", source: { name: "copal", url: "https://copalrealestate.com/properties/petal-i-4/", originalTitle: "Petal I (4)" } },
  { id: "lae-041", neighborhood: "Lance aux Épines", price: 1800, bedrooms: 2, bathrooms: 2, areaLatLng: [11.998833, -61.756109], thumbOverride: "https://copalrealestate.com/wp-content/uploads/2024/09/DSC_7850.jpg", mediaStatus: "agency-source-photo", source: { name: "copal", url: "https://copalrealestate.com/properties/harlow-ii/", originalTitle: "Harlow II" } },
  { id: "lae-042", neighborhood: "Lance aux Épines", price: 2000, bedrooms: 2, bathrooms: 1, areaLatLng: [11.998833, -61.756109], thumbOverride: "https://copalrealestate.com/wp-content/uploads/2020/02/DSC_5350.jpg", mediaStatus: "agency-source-photo", source: { name: "copal", url: "https://copalrealestate.com/properties/iredale-ii/", originalTitle: "Iredale II" } },
  { id: "lae-043", neighborhood: "Lance aux Épines", price: 2100, bedrooms: 2, bathrooms: 2, areaLatLng: [11.998833, -61.756109], thumbOverride: "https://copalrealestate.com/wp-content/uploads/2019/09/DSC_5282.jpg", mediaStatus: "agency-source-photo", source: { name: "copal", url: "https://copalrealestate.com/properties/lilly-grove-ii/", originalTitle: "Lilly Grove II (L)" } },
  { id: "lae-044", neighborhood: "Lance aux Épines", price: 2400, bedrooms: 2, bathrooms: 2, areaLatLng: [11.998833, -61.756109], thumbOverride: "https://copalrealestate.com/wp-content/uploads/2018/09/DSC_0781.jpg", mediaStatus: "agency-source-photo", source: { name: "copal", url: "https://copalrealestate.com/properties/pine-haven-ii/", originalTitle: "Pine Haven II" } },
  { id: "lae-045", neighborhood: "Lance aux Épines", price: 2600, bedrooms: 2, bathrooms: 2, areaLatLng: [11.998833, -61.756109], thumbOverride: "https://copalrealestate.com/wp-content/uploads/2023/08/DSC_7579.jpg", mediaStatus: "agency-source-photo", source: { name: "copal", url: "https://copalrealestate.com/properties/rivian-ii/", originalTitle: "Rivian II" } },
  { id: "lae-046", neighborhood: "Lance aux Épines", price: 2600, bedrooms: 3, bathrooms: 3, areaLatLng: [11.998833, -61.756109], thumbOverride: "https://copalrealestate.com/wp-content/uploads/2022/02/DSC_0210-1.jpg", mediaStatus: "agency-source-photo", source: { name: "copal", url: "https://copalrealestate.com/properties/jenner-b-iii-u/", originalTitle: "Jenner B III (U)" } },
  { id: "lae-047", neighborhood: "Lance aux Épines", price: 2700, bedrooms: 2, bathrooms: 1, areaLatLng: [11.998833, -61.756109], thumbOverride: "https://copalrealestate.com/wp-content/uploads/2024/02/DSC_4201.jpg", mediaStatus: "agency-source-photo", source: { name: "copal", url: "https://copalrealestate.com/properties/catalania-ii-b/", originalTitle: "Catalania II (B)" } },
  { id: "lae-048", neighborhood: "Lance aux Épines", price: 3100, bedrooms: 3, bathrooms: 3, areaLatLng: [12.0044598, -61.7721909], thumbOverride: "https://copalrealestate.com/wp-content/uploads/2020/02/Outside-Front-View-2.jpg", mediaStatus: "agency-source-photo", source: { name: "copal", url: "https://copalrealestate.com/properties/pine-haven-iii/", originalTitle: "Pine Haven III" } },
  { id: "lae-049", neighborhood: "Lance aux Épines", price: 5000, bedrooms: 4, bathrooms: 3, areaLatLng: [11.998833, -61.756109], thumbOverride: "https://copalrealestate.com/wp-content/uploads/2024/09/DSC_4197.jpg", mediaStatus: "agency-source-photo", source: { name: "copal", url: "https://copalrealestate.com/properties/catalania-iv/", originalTitle: "Catalania IV" } },
  // True Blue
  { id: "tbu-002", neighborhood: "True Blue", price: 1500, bedrooms: 1, bathrooms: 1, areaLatLng: [12.0044598, -61.7721909], thumbOverride: "https://copalrealestate.com/wp-content/uploads/2026/01/DSC_0476.jpg", mediaStatus: "agency-source-photo", source: { name: "copal", url: "https://copalrealestate.com/properties/janero-i/", originalTitle: "Janero I" } },
  { id: "tbu-003", neighborhood: "True Blue", price: 1200, bedrooms: 2, bathrooms: 1, areaLatLng: [12.0044598, -61.7721909], thumbOverride: "https://copalrealestate.com/wp-content/uploads/2022/07/DSC_7727.jpg", mediaStatus: "agency-source-photo", source: { name: "copal", url: "https://copalrealestate.com/properties/mariam-ii/", originalTitle: "Mariam II" } },
  { id: "tbu-004", neighborhood: "True Blue", price: 1700, bedrooms: 2, bathrooms: 2, areaLatLng: [12.0044598, -61.7721909], thumbOverride: "https://copalrealestate.com/wp-content/uploads/2021/04/DSC_7754.jpg", mediaStatus: "agency-source-photo", source: { name: "copal", url: "https://copalrealestate.com/properties/maldives-ii/", originalTitle: "Maldives II" } },
  { id: "tbu-005", neighborhood: "True Blue", price: 1400, bedrooms: 2, bathrooms: 2, areaLatLng: [12.0044598, -61.7721909], thumbOverride: "https://copalrealestate.com/wp-content/uploads/2019/03/DSC_0098.jpg", mediaStatus: "agency-source-photo", source: { name: "copal", url: "https://copalrealestate.com/properties/jenner-ii/", originalTitle: "Jenner II" } },
  { id: "tbu-006", neighborhood: "True Blue", price: 1090, bedrooms: 1, bathrooms: 1, areaLatLng: [12.0044598, -61.7721909], thumbOverride: "https://copalrealestate.com/wp-content/uploads/2021/03/DSC_1045.jpg", mediaStatus: "agency-source-photo", source: { name: "copal", url: "https://copalrealestate.com/properties/calabasas-i-a/", originalTitle: "Calabasas I (A)" } },
  // Grand Anse
  { id: "gra-001", neighborhood: "Grand Anse", price: 1200, bedrooms: 1, bathrooms: 1, latLng: [12.0321, -61.754002], thumbOverride: "https://copalrealestate.com/wp-content/uploads/2025/01/DSC_0431.jpg", mediaStatus: "agency-source-photo", source: { name: "copal", url: "https://copalrealestate.com/properties/khalifa-s/", originalTitle: "Khalifa S" } },
  { id: "gra-002", neighborhood: "Grand Anse", price: 720, bedrooms: 1, bathrooms: 1, areaLatLng: [12.0240255, -61.7623033], thumbOverride: "https://copalrealestate.com/wp-content/uploads/2021/08/DSC_3766.jpg", mediaStatus: "agency-source-photo", source: { name: "copal", url: "https://copalrealestate.com/properties/oceanic-s/", originalTitle: "Oceanic S" } },
  { id: "gra-003", neighborhood: "Grand Anse", price: 850, bedrooms: 1, bathrooms: 1, areaLatLng: [12.0166667, -61.7666667], thumbOverride: "https://copalrealestate.com/wp-content/uploads/2019/11/DSC_3509.jpg", mediaStatus: "agency-source-photo", source: { name: "copal", url: "https://copalrealestate.com/properties/holmes-i/", originalTitle: "Holmes I" } },
  { id: "gra-004", neighborhood: "Grand Anse", price: 800, bedrooms: 1, bathrooms: 1, areaLatLng: [12.0166667, -61.7666667], thumbOverride: "https://copalrealestate.com/wp-content/uploads/2018/11/DSC_3604.jpg", mediaStatus: "agency-source-photo", source: { name: "copal", url: "https://copalrealestate.com/properties/ponder-i/", originalTitle: "Ponder I" } },
  { id: "gra-005", neighborhood: "Grand Anse", price: 850, bedrooms: 1, bathrooms: 1, areaLatLng: [12.0166667, -61.7666667], thumbOverride: "https://copalrealestate.com/wp-content/uploads/2017/08/DSC_4942.jpg", mediaStatus: "agency-source-photo", source: { name: "copal", url: "https://copalrealestate.com/properties/meyen-i/", originalTitle: "Meyen I" } },
  { id: "gra-006", neighborhood: "Grand Anse", price: 1100, bedrooms: 2, bathrooms: 1, areaLatLng: [12.0240255, -61.7623033], thumbOverride: "https://copalrealestate.com/wp-content/uploads/2018/01/20250924_152850.jpg", mediaStatus: "agency-source-photo", source: { name: "copal", url: "https://copalrealestate.com/properties/courtenay-ii-2/", originalTitle: "Courtenay II (B4)" } },
  { id: "gra-007", neighborhood: "Grand Anse", price: 1200, bedrooms: 2, bathrooms: 2, areaLatLng: [12.0166667, -61.7666667], thumbOverride: "https://copalrealestate.com/wp-content/uploads/2018/04/DSC_6683.jpg", mediaStatus: "agency-source-photo", source: { name: "copal", url: "https://copalrealestate.com/properties/trivers-ii/", originalTitle: "Trivers II" } },
  { id: "gra-008", neighborhood: "Grand Anse", price: 1300, bedrooms: 2, bathrooms: 2, areaLatLng: [12.0240255, -61.7623033], thumbOverride: "https://copalrealestate.com/wp-content/uploads/2021/08/DSC_3733.jpg", mediaStatus: "agency-source-photo", source: { name: "copal", url: "https://copalrealestate.com/properties/oceanic-ii-b1/", originalTitle: "Oceanic II (B1)" } },
  { id: "gra-009", neighborhood: "Grand Anse", price: 1400, bedrooms: 2, bathrooms: 1, areaLatLng: [12.0240255, -61.7623033], thumbOverride: "https://copalrealestate.com/wp-content/uploads/2017/10/DSC_0632.jpg", mediaStatus: "agency-source-photo", source: { name: "copal", url: "https://copalrealestate.com/properties/holmes-ii-d/", originalTitle: "Holmes II (D)" } },
  { id: "gra-010", neighborhood: "Grand Anse", price: 1500, bedrooms: 2, bathrooms: 2, areaLatLng: [12.0166667, -61.7666667], thumbOverride: "https://copalrealestate.com/wp-content/uploads/2018/09/DSC_2854.jpg", mediaStatus: "agency-source-photo", source: { name: "copal", url: "https://copalrealestate.com/properties/ponder-ii/", originalTitle: "Ponder II" } },
  { id: "gra-011", neighborhood: "Grand Anse", price: 1500, bedrooms: 2, bathrooms: 2, areaLatLng: [12.0166667, -61.7666667], thumbOverride: "https://copalrealestate.com/wp-content/uploads/2025/11/DSC_0348.jpg", mediaStatus: "agency-source-photo", source: { name: "copal", url: "https://copalrealestate.com/properties/aristotle-ii-u-l/", originalTitle: "Aristotle II (U-L)" } },
  // Morne Rouge
  { id: "mrn-003", neighborhood: "Morne Rouge", price: 2000, bedrooms: 2, bathrooms: 2, areaLatLng: [12.0167233, -61.7663428], thumbOverride: "https://copalrealestate.com/wp-content/uploads/2026/06/DSC_0510.webp", mediaStatus: "agency-source-photo", source: { name: "copal", url: "https://copalrealestate.com/properties/valencia-iii-ii-a2/", originalTitle: "Valencia III-II (A2)" } },
  { id: "mrn-004", neighborhood: "Morne Rouge", price: 2800, bedrooms: 3, bathrooms: 3, areaLatLng: [12.0167233, -61.7663428], thumbOverride: "https://copalrealestate.com/wp-content/uploads/2020/02/DSC_0523.jpg", mediaStatus: "agency-source-photo", source: { name: "copal", url: "https://copalrealestate.com/properties/valencia-iii-a2/", originalTitle: "Valencia III (A2)" } },
  // Frequente
  { id: "frq-003", neighborhood: "Frequente", price: 850, bedrooms: 1, bathrooms: 1, latLng: [12.056216, -61.748679], thumbOverride: "https://copalrealestate.com/wp-content/uploads/2024/10/DSC_7891.jpg", mediaStatus: "agency-source-photo", source: { name: "copal", url: "https://copalrealestate.com/properties/savana-i-1c/", originalTitle: "Savana I (1C)" } },
  { id: "frq-004", neighborhood: "Frequente", price: 850, bedrooms: 1, bathrooms: 1, latLng: [12.055866, -61.748879], thumbOverride: "https://copalrealestate.com/wp-content/uploads/2024/10/DSC_7878.jpg", mediaStatus: "agency-source-photo", source: { name: "copal", url: "https://copalrealestate.com/properties/savana-i-1b/", originalTitle: "Savana I (1B)" } },
  { id: "frq-005", neighborhood: "Frequente", price: 1050, bedrooms: 2, bathrooms: 1, latLng: [12.030897, -61.752654], thumbOverride: "https://copalrealestate.com/wp-content/uploads/2017/08/DSC_5472-1.jpg", mediaStatus: "agency-source-photo", source: { name: "copal", url: "https://copalrealestate.com/properties/hamilton-ii/", originalTitle: "Hamilton II" } },
  { id: "frq-006", neighborhood: "Frequente", price: 1350, bedrooms: 3, bathrooms: 2, latLng: [12.024146, -61.756154], thumbOverride: "https://copalrealestate.com/wp-content/uploads/2017/07/DSC_0481.jpg", mediaStatus: "agency-source-photo", source: { name: "copal", url: "https://copalrealestate.com/properties/hamilton-iii/", originalTitle: "Hamilton III" } },
  { id: "frq-007", neighborhood: "Frequente", price: 1400, bedrooms: 2, bathrooms: 1, latLng: [12.031247, -61.752454], thumbOverride: "https://copalrealestate.com/wp-content/uploads/2026/02/DSC_0734.jpg", mediaStatus: "agency-source-photo", source: { name: "copal", url: "https://copalrealestate.com/properties/ibarra-ii-a/", originalTitle: "Ibarra II (A)" } },
  { id: "frq-008", neighborhood: "Frequente", price: 1400, bedrooms: 2, bathrooms: 1, latLng: [12.030597, -61.752904], thumbOverride: "https://copalrealestate.com/wp-content/uploads/2026/02/DSC_0763.jpg", mediaStatus: "agency-source-photo", source: { name: "copal", url: "https://copalrealestate.com/properties/ibarra-ii-b/", originalTitle: "Ibarra II (B)" } },
  { id: "frq-009", neighborhood: "Frequente", price: 1800, bedrooms: 3, bathrooms: 2, latLng: [12.012273, -61.765746], thumbOverride: "https://copalrealestate.com/wp-content/uploads/2026/02/IMG_7867.jpg", mediaStatus: "agency-source-photo", source: { name: "copal", url: "https://copalrealestate.com/properties/pearl-iii/", originalTitle: "Pearl III" } },
  // Golf Course
  { id: "glf-002", neighborhood: "Golf Course", price: 1200, bedrooms: 2, bathrooms: 1, latLng: [12.02648, -61.748837], thumbOverride: "https://copalrealestate.com/wp-content/uploads/2022/07/DSC_7836.jpg", mediaStatus: "agency-source-photo", source: { name: "copal", url: "https://copalrealestate.com/properties/autumn-ii/", originalTitle: "Autumn II" } },
  // Calliste
  { id: "cal-001", neighborhood: "Calliste", price: 700, bedrooms: 1, bathrooms: 1, areaLatLng: [12.0099402, -61.775115], thumbOverride: "https://copalrealestate.com/wp-content/uploads/2023/01/DSC_5917.jpg", mediaStatus: "agency-source-photo", source: { name: "copal", url: "https://copalrealestate.com/properties/windsor-s-ll-2/", originalTitle: "Windsor S (LL-2)" } },
  { id: "cal-002", neighborhood: "Calliste", price: 850, bedrooms: 2, bathrooms: 1, areaLatLng: [12.004167, -61.786111], thumbOverride: "https://copalrealestate.com/wp-content/uploads/2024/06/DSC_7179.jpg", mediaStatus: "agency-source-photo", source: { name: "copal", url: "https://copalrealestate.com/properties/persoon-ii-1/", originalTitle: "Persoon II (1)" } },
  { id: "cal-003", neighborhood: "Calliste", price: 1000, bedrooms: 1, bathrooms: 1, areaLatLng: [12.0099402, -61.775115], thumbOverride: "https://copalrealestate.com/wp-content/uploads/2024/06/DSC_7030.jpg", mediaStatus: "agency-source-photo", source: { name: "copal", url: "https://copalrealestate.com/properties/kadia-i/", originalTitle: "Kadia I" } },
  { id: "cal-004", neighborhood: "Calliste", price: 1000, bedrooms: 1, bathrooms: 1, areaLatLng: [12.004167, -61.786111], thumbOverride: "https://copalrealestate.com/wp-content/uploads/2017/08/DSC_8022.jpg", mediaStatus: "agency-source-photo", source: { name: "copal", url: "https://copalrealestate.com/properties/grant-i/", originalTitle: "Grant I" } },
  { id: "cal-005", neighborhood: "Calliste", price: 1200, bedrooms: 1, bathrooms: 1, areaLatLng: [12.0099402, -61.775115], thumbOverride: "https://copalrealestate.com/wp-content/uploads/2023/11/20240801_142755.jpg", mediaStatus: "agency-source-photo", source: { name: "copal", url: "https://copalrealestate.com/properties/teranova-i-7/", originalTitle: "Teranova I (4 & 7)" } },
  { id: "cal-006", neighborhood: "Calliste", price: 1400, bedrooms: 2, bathrooms: 1, areaLatLng: [12.0099402, -61.775115], thumbOverride: "https://copalrealestate.com/wp-content/uploads/2017/11/DSC_8250.jpg", mediaStatus: "agency-source-photo", source: { name: "copal", url: "https://copalrealestate.com/properties/grant-ii/", originalTitle: "Grant II" } },
  { id: "cal-007", neighborhood: "Calliste", price: 1600, bedrooms: 2, bathrooms: 1, areaLatLng: [12.0099402, -61.775115], thumbOverride: "https://copalrealestate.com/wp-content/uploads/2023/11/20240801_142755.jpg", mediaStatus: "agency-source-photo", source: { name: "copal", url: "https://copalrealestate.com/properties/teranova-ii-8/", originalTitle: "Teranova II (8)" } },
  { id: "cal-008", neighborhood: "Calliste", price: 1700, bedrooms: 2, bathrooms: 1, areaLatLng: [12.004167, -61.786111], thumbOverride: "https://copalrealestate.com/wp-content/uploads/2025/09/DSC_0106.jpg", mediaStatus: "agency-source-photo", source: { name: "copal", url: "https://copalrealestate.com/properties/nirvana-ii-b/", originalTitle: "Nirvana II (B)" } },
  // Point Salines
  { id: "psl-001", neighborhood: "Point Salines", price: 1200, bedrooms: 1, bathrooms: 1, areaLatLng: [12.004167, -61.786111], thumbOverride: "https://copalrealestate.com/wp-content/uploads/2023/09/DSC_5268.jpg", mediaStatus: "agency-source-photo", source: { name: "copal", url: "https://copalrealestate.com/properties/landon-i-ky/", originalTitle: "Landon I (KY)" } },
  { id: "psl-002", neighborhood: "Point Salines", price: 1240, bedrooms: 1, bathrooms: 1, latLng: [12.012125, -61.773212], thumbOverride: "https://copalrealestate.com/wp-content/uploads/2025/02/DSC_8836.jpg", mediaStatus: "agency-source-photo", source: { name: "copal", url: "https://copalrealestate.com/properties/zania-i/", originalTitle: "Zania I" } },
  { id: "psl-003", neighborhood: "Point Salines", price: 1520, bedrooms: 2, bathrooms: 1, areaLatLng: [12.004167, -61.786111], thumbOverride: "https://copalrealestate.com/wp-content/uploads/2023/10/DSC_5213.jpg", mediaStatus: "agency-source-photo", source: { name: "copal", url: "https://copalrealestate.com/properties/landon-ii-k3-2/", originalTitle: "Landon II (K3)" } },

  // Century 21 / sgu.rentals — old 2025 listing IDs now return 410 Gone;
  // replaced with the current featured inventory (checked 2026-07-03).
  { id: "lae-c21-roylyns", neighborhood: "Lance aux Épines", price: 3000, bedrooms: 3, bathrooms: 3, source: { name: "century21", url: "https://www.sgu.rentals/listing-detail/1184877361", originalTitle: "Roylyn's Residence — 3BD upper floor" } },
  { id: "lae-c21-whitehouse", neighborhood: "Lance aux Épines", price: 1800, bedrooms: 2, bathrooms: 1, source: { name: "century21", url: "https://www.sgu.rentals/listing-detail/1184877362", originalTitle: "White House Apartments" } },
  { id: "lae-c21-aqua", neighborhood: "Lance aux Épines", price: 1300, bedrooms: 2, bathrooms: 1.5, source: { name: "century21", url: "https://www.sgu.rentals/listing-detail/1184801616", originalTitle: "Aqua Sunshine — 2BD" } },
  { id: "mrn-c21-majestic", neighborhood: "Morne Rouge", price: 1350, bedrooms: 1, bathrooms: 2, source: { name: "century21", url: "https://www.sgu.rentals/listing-detail/1184801615", originalTitle: "The Majestic Suite — Morne Rouge" } },
  { id: "mrn-c21-studio10", neighborhood: "Morne Rouge", price: 850, bedrooms: 1, bathrooms: 1, source: { name: "century21", url: "https://www.sgu.rentals/listing-detail/1184801613", originalTitle: "Studio 10 — Study Stay & Beach" } },
  { id: "mrn-c21-studio9", neighborhood: "Morne Rouge", price: 850, bedrooms: 1, bathrooms: 1, source: { name: "century21", url: "https://www.sgu.rentals/listing-detail/1184801614", originalTitle: "Studio 9 — Study Stay & Beach" } },

  // McB Realty — mixed neighborhoods. Spot-checked 2026-07-03 where dated;
  // remaining entries last confirmed on the dates shown.
  { id: "frq-001", neighborhood: "Frequente", price: 560, bedrooms: 1, bathrooms: 1, sourceLastChecked: "2026-07-03", latLng: [12.013112, -61.76607], mediaStatus: "generated-replica-needed", source: { name: "mcb", url: "https://mcb-realty.com/listings/frequente-dales-studio-apartment/", originalTitle: "Frequente Dale's Studio" } },
  { id: "frq-002", neighborhood: "Frequente", price: 665, bedrooms: 1, bathrooms: 1, sourceLastChecked: "2026-07-03", latLng: [12.013108, -61.766093], mediaStatus: "generated-replica-needed", source: { name: "mcb", url: "https://mcb-realty.com/listings/frequent-dales-apartment/", originalTitle: "Frequente Dale's Apartment" } },
  { id: "lae-025", neighborhood: "Lance aux Épines", price: 750, bedrooms: 1, bathrooms: 1, sourceLastChecked: "2026-07-03", latLng: [12.011543, -61.756576], mediaStatus: "generated-replica-needed", source: { name: "mcb", url: "https://mcb-realty.com/listings/1-bedroom-rental-lance-aux-epines/", originalTitle: "Lioness Apartment" } },
  { id: "glf-001", neighborhood: "Golf Course", price: 800, bedrooms: 1, bathrooms: 1, sourceLastChecked: "2026-05-18", latLng: [12.028423, -61.74527], thumbOverride: "https://mcb-realty.com/wp-content/uploads/2024/02/1000206476-scaled.jpg", mediaStatus: "agency-source-photo", source: { name: "mcb", url: "https://mcb-realty.com/listings/bethel-gardens1/", originalTitle: "Bethel Gardens 1" } },
  { id: "mrn-001", neighborhood: "Morne Rouge", price: 800, bedrooms: 1, bathrooms: 1, sourceLastChecked: "2026-05-18", areaLatLng: [12.0167233, -61.7663428], mediaStatus: "generated-replica-needed", source: { name: "mcb", url: "https://mcb-realty.com/listings/harbour-lights/", originalTitle: "Furnished 1BD — Morne Rouge" } },
  { id: "mrn-002", neighborhood: "Morne Rouge", price: 800, bedrooms: 1, bathrooms: 1, sourceLastChecked: "2026-05-18", areaLatLng: [12.0167233, -61.7663428], mediaStatus: "generated-replica-needed", source: { name: "mcb", url: "https://mcb-realty.com/listings/1-bedroom-rental-morne-rouge-st-george/", originalTitle: "Spice House Apartments" } },
  { id: "lae-026", neighborhood: "Lance aux Épines", price: 850, bedrooms: 1, bathrooms: 1, sourceLastChecked: "2026-05-18", latLng: [11.997673, -61.755407], mediaStatus: "generated-replica-needed", source: { name: "mcb", url: "https://mcb-realty.com/listings/1-bedroom-apartment-lance-aux-epinesred-hibiscus-apartment-2/", originalTitle: "Red Hibiscus 2" } },
  { id: "tbu-001", neighborhood: "True Blue", price: 900, bedrooms: 1, bathrooms: 1, sourceLastChecked: "2026-07-03", latLng: [12.009696, -61.765099], thumbOverride: "https://mcb-realty.com/wp-content/uploads/2023/11/20210513_122507-1-scaled.jpg", mediaStatus: "agency-source-photo", source: { name: "mcb", url: "https://mcb-realty.com/listings/thrillers-apartments1/", originalTitle: "Thriller's Apartments" } },
  { id: "wst-001", neighborhood: "Westerhall", price: 950, bedrooms: 2, bathrooms: 1, sourceLastChecked: "2026-05-18", latLng: [12.023674, -61.712377], thumbOverride: "https://mcb-realty.com/wp-content/uploads/2023/11/1000175530.jpg", mediaStatus: "agency-source-photo", source: { name: "mcb", url: "https://mcb-realty.com/listings/old-westerhall-apartment/", originalTitle: "Old Westerhall Apartment" } },
  { id: "lae-027", neighborhood: "Lance aux Épines", price: 1000, bedrooms: 2, bathrooms: 2, sourceLastChecked: "2026-05-18", latLng: [12.009022, -61.76018], thumbOverride: "https://mcb-realty.com/wp-content/uploads/2024/03/1000218668-scaled.jpg", mediaStatus: "agency-source-photo", source: { name: "mcb", url: "https://mcb-realty.com/listings/house-of-jabari/", originalTitle: "House of Jabari" } },
  { id: "lae-028", neighborhood: "Lance aux Épines", price: 1100, bedrooms: 1, bathrooms: 1, sourceLastChecked: "2026-05-18", latLng: [11.997718, -61.755286], mediaStatus: "generated-replica-needed", source: { name: "mcb", url: "https://mcb-realty.com/listings/1-bedroom-1-bathroom-lance-aux-epines-rental/", originalTitle: "Red Hibiscus 1" } },
  { id: "wst-002", neighborhood: "Westerhall", price: 1100, bedrooms: 2, bathrooms: 2, sourceLastChecked: "2026-05-18", latLng: [12.023684, -61.712409], thumbOverride: "https://mcb-realty.com/wp-content/uploads/2023/11/1000175530.jpg", mediaStatus: "agency-source-photo", source: { name: "mcb", url: "https://mcb-realty.com/listings/old-westerhall-apartment2/", originalTitle: "Old Westerhall Apartment 2" } },
  { id: "lae-mcb-ellens", neighborhood: "Lance aux Épines", price: 750, bedrooms: 2, bathrooms: 1, sourceLastChecked: "2026-06-07", latLng: [12.007563, -61.759272], mediaStatus: "generated-replica-needed", source: { name: "mcb", url: "https://mcb-realty.com/listings/ellens-apartments-lance-aux-epines/", originalTitle: "Ellen's Apartments" } },
  { id: "lae-mcb-apartment3", neighborhood: "Lance aux Épines", price: 1600, bedrooms: 3, bathrooms: 2, sourceLastChecked: "2026-06-07", latLng: [12.010693, -61.756047], thumbOverride: "https://mcb-realty.com/wp-content/uploads/2024/07/1000324466-scaled.jpg", mediaStatus: "agency-source-photo", source: { name: "mcb", url: "https://mcb-realty.com/listings/lance-aux-epines-apartment3/", originalTitle: "Lance Aux Epines Apartment3" } },
  { id: "lae-mcb-coral", neighborhood: "Lance aux Épines", price: 2350, bedrooms: 3, bathrooms: 2, sourceLastChecked: "2026-07-03", latLng: [11.995675, -61.756625], thumbOverride: "https://mcb-realty.com/wp-content/uploads/2026/06/1-scaled.jpeg", mediaStatus: "agency-source-photo", source: { name: "mcb", url: "https://mcb-realty.com/listings/coral-cresent-apartment/", originalTitle: "Coral Cresent Apartment" } },
  { id: "lae-villamar", neighborhood: "Lance aux Épines", price: 0, priceDisplay: "Contact for rate", bedrooms: 1, bathrooms: 1, titleOverride: "Villamar Apartments · Furnished Studios", mediaStatus: "generated-replica-needed", sourceLastChecked: "2026-06-07", source: { name: "villamar", url: "https://www.villamargrenada.com/", originalTitle: "Villamar Apartments" } },

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
  const pinned = Boolean(o.latLng);
  const [lat, lng] = o.latLng
    ? o.latLng
    : o.areaLatLng
    ? [
        o.areaLatLng[0] + jitter(o.id + "lat", 0.0035),
        o.areaLatLng[1] + jitter(o.id + "lng", 0.0035),
      ]
    : [locFor(o.id, o.neighborhood).lat, locFor(o.id, o.neighborhood).lng];
  // Honesty rules: no fabricated ratings, waitlists, availability windows,
  // or claim states. A listing is "available" because it is live on the
  // source agency's site as of sourceLastChecked — nothing more granular.
  // Only Blue Star (owner-operated) is claimed / Seal Approved / verified.
  const ownerOperated = o.source.name === "bluestar";
  return {
    id: o.id,
    title: o.titleOverride ?? generatedTitle(o.id, o.neighborhood, o.bedrooms),
    neighborhood: o.neighborhood,
    location: `${o.neighborhood}, Saint George, Grenada`,
    price: o.price,
    priceDisplay: o.priceDisplay,
    bedrooms: o.bedrooms,
    bathrooms: o.bathrooms,
    occupancy: Math.max(1, o.bedrooms * 2 - 1),
    walkToCampus: walk,
    sealApproved: ownerOperated,
    available: true,
    availableFrom: "now",
    featured: ownerOperated || o.price < 1200 || pinned,
    rating: undefined,
    reviewCount: 0,
    waitlistCount: 0,
    hasLeaseBreak: false,
    claimStatus: ownerOperated ? "claimed" : "unclaimed",
    roomType: roomTypeFor(o.bedrooms),
    amenities: BASELINE_AMENITIES,
    thumb: o.thumbOverride ?? generatedThumb(o.id, o.bedrooms),
    mediaStatus: o.mediaStatus ?? "rights-cleared-placeholder",
    sourceLastChecked: o.sourceLastChecked ?? "2026-07-03",
    blurb: blurbFor(o.neighborhood, o.bedrooms, o.bathrooms, walk),
    lat,
    lng,
    coordinatePrecision: pinned ? "exact" : "neighborhood",
    verificationStatus: ownerOperated ? "verified" : "source-linked",
    source: o.source,
  };
});

export const NEIGHBORHOODS: Neighborhood[] = Array.from(
  new Set(LISTINGS.map((l) => l.neighborhood)),
) as Neighborhood[];

export function listingsByNeighborhood(n: Neighborhood) {
  return LISTINGS.filter((l) => l.neighborhood === n);
}

export function priceLabel(l: Pick<Listing, "price" | "priceDisplay">) {
  return l.priceDisplay ?? `$${l.price.toLocaleString()}/mo`;
}
