import { Link } from "react-router-dom";
import PageShell from "../components/PageShell";

export default function ForStudents() {
  const perks = [
    "Verified listings within walking distance of SGU",
    "Roommate matching for incoming SOM/SAS terms",
    "Lease DNA Scanner included with every reservation",
    "SealShield deposit refund if a property misrepresents itself",
    "Move-in concierge: airport pickup, SIM, grocery run",
  ];
  return (
    <PageShell
      kicker="For Students"
      title="Built for SGU first"
      subtitle="We started with True Blue and Lance aux Épines because that's where you're going to be. Everything else gets layered on top of that."
    >
      <div
        className="liquid-glass p-8 max-w-3xl"
        style={{ borderRadius: "1.5rem" }}
      >
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 font-body text-white/95 text-sm">
          {perks.map((p) => (
            <li key={p} className="flex gap-2">
              <span className="text-white/60">›</span>
              <span>{p}</span>
            </li>
          ))}
        </ul>
        <div className="mt-8 flex flex-wrap items-center gap-4">
          <Link
            to="/listings"
            className="liquid-glass-strong rounded-full px-5 py-2.5 text-sm font-medium font-body text-white"
          >
            Browse listings
          </Link>
          <Link
            to="/lease-dna-scanner"
            className="text-sm font-body text-white/90 hover:text-white"
          >
            Try Lease DNA Scanner →
          </Link>
        </div>
      </div>
    </PageShell>
  );
}
