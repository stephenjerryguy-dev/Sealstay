import { useEffect } from "react";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import { divIcon } from "leaflet";
import "leaflet/dist/leaflet.css";
import { Link } from "react-router-dom";
import type { Listing } from "../data/listings";

// Approximate centroid of southern Grenada (SGU + Lance aux Épines + Grand Anse)
const GRENADA_CENTER: [number, number] = [12.018, -61.748];

// Custom orange pin in HTML (matches the seal mascot)
function pinIcon(price: number) {
  return divIcon({
    className: "sealstay-pin",
    iconSize: [56, 28],
    iconAnchor: [28, 28],
    html: `<div style="
      display:inline-flex;align-items:center;justify-content:center;
      background:#ff6a1a;color:white;
      font-family:'Barlow',sans-serif;font-weight:600;font-size:12px;
      padding:4px 10px;border-radius:9999px;
      box-shadow:0 2px 6px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.25);
      white-space:nowrap;letter-spacing:-.01em;
    ">$${price.toLocaleString()}</div>`,
  });
}

function PaneTune() {
  // Tone down OSM tiles to match the dark UI
  const map = useMap();
  useEffect(() => {
    const root = map.getContainer();
    root.style.filter =
      "saturate(0.55) brightness(0.65) hue-rotate(-10deg) contrast(1.05)";
    return () => {
      root.style.filter = "";
    };
  }, [map]);
  return null;
}

type Props = {
  listings: Listing[];
  /** Optional override for initial center/zoom. */
  center?: [number, number];
  zoom?: number;
  /** Lock the user into a single marker (used on detail pages). */
  highlightId?: string;
  className?: string;
  height?: number | string;
};

export default function GrenadaMap({
  listings,
  center = GRENADA_CENTER,
  zoom = 13,
  highlightId,
  className = "",
  height = 460,
}: Props) {
  const visible = highlightId
    ? listings.filter((l) => l.id === highlightId)
    : listings;

  const heightCss = typeof height === "number" ? `${height}px` : height;

  return (
    <div
      className={`liquid-glass overflow-hidden ${className}`}
      style={{ borderRadius: "1.25rem", height: heightCss }}
    >
      <MapContainer
        center={highlightId && visible[0] ? [visible[0].lat, visible[0].lng] : center}
        zoom={highlightId ? 16 : zoom}
        scrollWheelZoom
        style={{ width: "100%", height: "100%", background: "#0a1426" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <PaneTune />

        {/* SGU campus marker */}
        <Marker
          position={[12.0083, -61.7752]}
          icon={divIcon({
            className: "sealstay-pin sealstay-pin--sgu",
            iconSize: [44, 22],
            iconAnchor: [22, 22],
            html: `<div style="
              display:inline-flex;align-items:center;justify-content:center;
              background:rgba(10,20,38,0.92);color:white;
              font-family:'Instrument Serif',serif;font-style:italic;font-size:13px;
              padding:3px 10px;border-radius:9999px;
              box-shadow:0 2px 6px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.18);
              border:1px solid rgba(255,255,255,0.25);
            ">SGU</div>`,
          })}
        >
          <Popup>St. George's University — True Blue campus</Popup>
        </Marker>

        {visible.map((l) => (
          <Marker
            key={l.id}
            position={[l.lat, l.lng]}
            icon={pinIcon(l.price)}
          >
            <Popup>
              <div style={{ minWidth: 200 }}>
                <div
                  style={{
                    fontFamily: "'Instrument Serif', serif",
                    fontStyle: "italic",
                    fontSize: 18,
                    color: "#0a1426",
                    lineHeight: 1.05,
                  }}
                >
                  {l.title}
                </div>
                <div
                  style={{
                    fontFamily: "Barlow, sans-serif",
                    fontSize: 12,
                    marginTop: 4,
                    color: "#5a6478",
                  }}
                >
                  {l.neighborhood} · {l.bedrooms} BR · {l.walkToCampus} min to SGU
                </div>
                <div
                  style={{
                    fontFamily: "Barlow, sans-serif",
                    marginTop: 6,
                    color: "#0a1426",
                  }}
                >
                  <strong>${l.price.toLocaleString()}</strong>
                  <span style={{ color: "#5a6478" }}> / mo</span>
                </div>
                <Link
                  to={`/listings/${l.id}`}
                  style={{
                    display: "inline-block",
                    marginTop: 8,
                    padding: "6px 12px",
                    background: "#ff6a1a",
                    color: "white",
                    fontFamily: "Barlow, sans-serif",
                    fontWeight: 500,
                    fontSize: 12,
                    borderRadius: 9999,
                    textDecoration: "none",
                  }}
                >
                  View listing →
                </Link>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
