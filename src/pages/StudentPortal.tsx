import { Link } from "react-router-dom";
import PageShell from "../components/PageShell";
import ProtectedPage from "../components/ProtectedPage";
import { useAuth } from "../context/AuthContext";
import { LISTINGS } from "../data/listings";

export default function StudentPortal() {
  return (
    <ProtectedPage roles={["student"]}>
      <Inner />
    </ProtectedPage>
  );
}

function Inner() {
  const { user } = useAuth();
  const reservation = LISTINGS[0];
  const roommates = [
    { name: "Maya O.", program: "MD term 2", quietHours: "10p–7a" },
    { name: "Idris K.", program: "MD term 2", quietHours: "9p–7a" },
  ];
  return (
    <PageShell
      kicker="Student Portal"
      title={`Welcome, ${user?.name?.split(" ")[0] || "Student"}`}
      subtitle="Your stay at a glance — bookings, lease status, roommates, and support."
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Reservation */}
        <section
          className="lg:col-span-2 liquid-glass p-6"
          style={{ borderRadius: "1.5rem" }}
        >
          <p className="text-xs font-body text-white/70">Reservation</p>
          <div className="mt-2 flex items-baseline gap-3 flex-wrap">
            <h3 className="font-heading text-white text-4xl tracking-[-1px] leading-none">
              {reservation.title}
            </h3>
            <span className="liquid-glass rounded-full px-3 py-1 text-[11px] font-body text-white">
              Hold · 72 hr
            </span>
          </div>
          <p className="mt-2 text-sm font-body font-light text-white/80">
            {reservation.neighborhood} · {reservation.bedrooms} BR ·{" "}
            {reservation.walkToCampus} min to SGU · ${reservation.price.toLocaleString()}/mo
          </p>
          <div className="mt-5 grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
            <Step label="Lease decoded" done />
            <Step label="Deposit escrow" done />
            <Step label="Move-in date" />
            <Step label="Welcome pack" />
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              to={`/listings/${reservation.id}`}
              className="liquid-glass-strong rounded-full px-4 py-2 text-sm font-medium font-body text-white"
            >
              View listing
            </Link>
            <Link
              to="/lease-dna-scanner"
              className="text-sm font-body text-white/85 hover:text-white self-center"
            >
              Re-run lease scan →
            </Link>
          </div>
        </section>

        {/* Roommates */}
        <section
          className="liquid-glass p-6"
          style={{ borderRadius: "1.5rem" }}
        >
          <p className="text-xs font-body text-white/70">Roommates</p>
          <h3 className="mt-1 font-heading text-white text-3xl tracking-[-1px] leading-none">
            You + 2
          </h3>
          <ul className="mt-4 flex flex-col gap-3">
            {roommates.map((r) => (
              <li
                key={r.name}
                className="flex items-center gap-3 liquid-glass px-3 py-2"
                style={{ borderRadius: "0.85rem" }}
              >
                <div
                  className="w-9 h-9 bg-white text-black flex items-center justify-center font-heading text-lg"
                  style={{ borderRadius: "9999px" }}
                  aria-hidden
                >
                  {r.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-body text-white text-sm">{r.name}</p>
                  <p className="text-[11px] font-body text-white/70">
                    {r.program} · quiet {r.quietHours}
                  </p>
                </div>
              </li>
            ))}
          </ul>
          <button
            type="button"
            className="mt-4 text-sm font-body text-white/85 hover:text-white"
          >
            Run Roommate DNA →
          </button>
        </section>

        {/* Saved listings */}
        <section
          className="lg:col-span-2 liquid-glass p-6"
          style={{ borderRadius: "1.5rem" }}
        >
          <div className="flex items-baseline justify-between gap-3 flex-wrap">
            <h3 className="font-heading text-white text-3xl tracking-[-1px] leading-none">
              Saved listings
            </h3>
            <Link
              to="/listings"
              className="text-xs font-body text-white/70 hover:text-white"
            >
              Browse all →
            </Link>
          </div>
          <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-3">
            {LISTINGS.slice(0, 3).map((l) => (
              <Link
                key={l.id}
                to={`/listings/${l.id}`}
                className="liquid-glass overflow-hidden flex flex-col"
                style={{ borderRadius: "1rem" }}
              >
                <div
                  className="aspect-[4/3] bg-cover bg-center"
                  style={{ backgroundImage: `url(${l.thumb})` }}
                />
                <div className="p-3">
                  <p className="font-heading text-white text-lg leading-none tracking-[-0.5px]">
                    {l.title}
                  </p>
                  <p className="mt-1 text-[11px] font-body font-light text-white/75">
                    {l.neighborhood} · ${l.price.toLocaleString()}/mo
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Support */}
        <section
          className="liquid-glass p-6 flex flex-col"
          style={{ borderRadius: "1.5rem" }}
        >
          <p className="text-xs font-body text-white/70">Support</p>
          <h3 className="mt-1 font-heading text-white text-3xl tracking-[-1px] leading-none">
            On the island
          </h3>
          <p className="mt-3 text-sm font-body font-light text-white/85 leading-snug">
            Local concierge for airport pickup, SIM, taxi, generator quirks,
            grocery — anything we can answer in under an hour.
          </p>
          <div className="mt-auto pt-4 flex flex-wrap gap-2">
            <a
              href="https://wa.me/14735551234"
              target="_blank"
              rel="noreferrer"
              className="liquid-glass-strong rounded-full px-4 py-2 text-xs font-medium font-body text-white"
            >
              WhatsApp
            </a>
            <a
              href="mailto:hi@sealstay.xyz"
              className="liquid-glass rounded-full px-4 py-2 text-xs font-medium font-body text-white"
            >
              Email
            </a>
          </div>
        </section>
      </div>
    </PageShell>
  );
}

function Step({ label, done }: { label: string; done?: boolean }) {
  return (
    <div
      className="liquid-glass p-3 text-center"
      style={{ borderRadius: "0.85rem" }}
    >
      <div
        className={`mx-auto mb-2 w-2 h-2 rounded-full ${done ? "bg-emerald-300" : "bg-white/30"}`}
      />
      <p className="text-[11px] font-body font-light text-white/85 leading-tight">
        {label}
      </p>
    </div>
  );
}
