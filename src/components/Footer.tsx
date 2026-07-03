import { Link } from "react-router-dom";
import SealMark from "./SealMark";

const COLS: { heading: string; links: { label: string; to: string }[] }[] = [
  {
    heading: "Students",
    links: [
      { label: "Find housing", to: "/listings" },
      { label: "How it works", to: "/how-it-works" },
      { label: "Lease DNA Scanner", to: "/lease-dna-scanner" },
      { label: "Lease Relief", to: "/lease-relief" },
      { label: "Student Portal", to: "/student-portal" },
    ],
  },
  {
    heading: "Landlords",
    links: [
      { label: "List a property", to: "/list-property" },
      { label: "Claim a listing", to: "/claim-listing" },
      { label: "LandlordShield", to: "/landlord-shield" },
      { label: "Landlord Portal", to: "/landlord-portal" },
    ],
  },
  {
    heading: "Innovations",
    links: [
      { label: "SealScore", to: "/seal-score" },
      { label: "Innovations index", to: "/innovations" },
      { label: "Legal & compliance", to: "/legal-compliance" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="relative w-screen px-8 md:px-16 lg:px-20 pt-20 pb-10 border-t border-sealCharcoal/60">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-10 max-w-7xl">
        <div>
          <SealMark withTagline size={56} />
          <p className="mt-6 max-w-xs text-sm font-body font-light text-white/70 leading-snug">
            Verified student housing in Grenada — built around the SGU campus.
            Every listing inspected, every lease decoded.
          </p>
        </div>
        {COLS.map((col) => (
          <div key={col.heading}>
            <p className="text-[11px] font-body uppercase tracking-[0.22em] text-sealSky/70">
              {col.heading}
            </p>
            <ul className="mt-4 flex flex-col gap-2.5">
              {col.links.map((l) => (
                <li key={l.to}>
                  <Link
                    to={l.to}
                    className="text-sm font-body text-white/85 hover:text-sealSky transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="mt-16 pt-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
        <p className="text-[11px] font-body font-light text-white/55">
          © {new Date().getFullYear()} SealStay · Lance aux Épines, Grenada
        </p>
        <div className="flex items-center gap-5 text-[11px] font-body text-white/55">
          <a
            href="mailto:hi@sealstay.xyz"
            className="hover:text-white"
          >
            hi@sealstay.xyz
          </a>
          <Link to="/legal-compliance" className="hover:text-white">
            Privacy
          </Link>
          <Link to="/legal-compliance" className="hover:text-white">
            Terms
          </Link>
        </div>
      </div>
    </footer>
  );
}
