import { useMemo } from "react";
import { Link } from "react-router-dom";
import PageShell from "../components/PageShell";
import ProtectedPage from "../components/ProtectedPage";
import GrenadaMap from "../components/GrenadaMap";
import { LISTINGS } from "../data/listings";

export default function AdminDashboard() {
  return (
    <ProtectedPage roles={["admin"]}>
      <Inner />
    </ProtectedPage>
  );
}

function Inner() {
  const stats = useMemo(() => {
    const total = LISTINGS.length;
    const verified = LISTINGS.filter((l) => l.sealApproved).length;
    const avgRent = Math.round(
      LISTINGS.reduce((s, l) => s + l.price, 0) / total,
    );
    const minWalk = Math.min(...LISTINGS.map((l) => l.walkToCampus));
    return { total, verified, avgRent, minWalk };
  }, []);

  const queue = LISTINGS.slice(0, 6).map((l, i) => ({
    listing: l,
    state: i % 3 === 0 ? "Awaiting inspection" : i % 3 === 1 ? "Lease vetting" : "Photos pending",
  }));

  const disputes = [
    {
      id: "D-204",
      tenant: "Maya O.",
      property: LISTINGS[0].title,
      summary: "Generator outage cost dispute",
      sla: "4h",
      severity: "high",
    },
    {
      id: "D-203",
      tenant: "Idris K.",
      property: LISTINGS[2].title,
      summary: "Late-fee waiver request",
      sla: "1d",
      severity: "med",
    },
    {
      id: "D-202",
      tenant: "Rina P.",
      property: LISTINGS[5].title,
      summary: "Move-out deposit return",
      sla: "3d",
      severity: "low",
    },
  ];

  return (
    <PageShell
      kicker="Admin"
      title="Operations dashboard"
      subtitle="Listings funnel, dispute queue, payment health, and the live map. Internal — auth-gated to admins."
    >
      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Kpi label="Listings" value={stats.total.toString()} />
        <Kpi label="Seal Approved" value={`${stats.verified}`} sub={`/ ${stats.total}`} />
        <Kpi label="Avg. rent" value={`$${stats.avgRent.toLocaleString()}`} sub="USD/mo" />
        <Kpi label="Closest walk" value={`${stats.minWalk} min`} sub="to SGU" tint="orange" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Live map */}
        <section className="lg:col-span-2">
          <p className="text-xs font-body text-white/70 mb-2">// Coverage</p>
          <GrenadaMap listings={LISTINGS} height={420} />
        </section>

        {/* Disputes */}
        <section
          className="liquid-glass p-6 flex flex-col"
          style={{ borderRadius: "1.5rem" }}
        >
          <div className="flex items-baseline justify-between gap-3">
            <h2 className="font-heading text-white text-3xl tracking-[-1px] leading-none">
              Dispute queue
            </h2>
            <span className="text-xs font-body text-white/70">
              {disputes.length} open
            </span>
          </div>
          <ul className="mt-5 flex flex-col gap-3">
            {disputes.map((d) => (
              <li
                key={d.id}
                className="liquid-glass p-3"
                style={{ borderRadius: "0.85rem" }}
              >
                <div className="flex items-baseline justify-between gap-3">
                  <p className="font-body text-white text-sm">
                    {d.id} · {d.tenant}
                  </p>
                  <span
                    className={`text-[10px] font-body uppercase tracking-wide ${
                      d.severity === "high"
                        ? "text-sealOrange"
                        : d.severity === "med"
                        ? "text-amber-300"
                        : "text-white/60"
                    }`}
                  >
                    SLA {d.sla}
                  </span>
                </div>
                <p className="mt-1 text-[11px] font-body font-light text-white/70 truncate">
                  {d.summary} · {d.property}
                </p>
              </li>
            ))}
          </ul>
          <button
            type="button"
            className="mt-5 liquid-glass-strong rounded-full px-4 py-2 text-xs font-medium font-body text-white"
          >
            Open AI Dispute Agent →
          </button>
        </section>

        {/* Listings funnel */}
        <section
          className="lg:col-span-3 liquid-glass p-6"
          style={{ borderRadius: "1.5rem" }}
        >
          <h2 className="font-heading text-white text-3xl tracking-[-1px] leading-none">
            Listings funnel
          </h2>
          <p className="mt-2 text-xs font-body text-white/70">
            Properties moving through the verification pipeline before going
            live.
          </p>
          <div className="mt-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {queue.map(({ listing, state }) => (
              <Link
                key={listing.id}
                to={`/listings/${listing.id}`}
                className="liquid-glass p-3 flex items-center gap-3"
                style={{ borderRadius: "1rem" }}
              >
                <img
                  src={listing.thumb}
                  alt=""
                  className="w-14 h-14 object-cover shrink-0"
                  style={{ borderRadius: "0.6rem" }}
                />
                <div className="flex-1 min-w-0">
                  <p className="font-heading text-white text-lg tracking-[-0.5px] leading-none truncate">
                    {listing.title}
                  </p>
                  <p className="mt-1 text-[10px] font-body font-light text-white/70 truncate">
                    {listing.neighborhood}
                  </p>
                </div>
                <span
                  className="liquid-glass rounded-full px-2.5 py-1 text-[10px] font-body text-white whitespace-nowrap"
                  style={{ background: "rgba(255,106,26,0.15)" }}
                >
                  {state}
                </span>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </PageShell>
  );
}

function Kpi({
  label,
  value,
  sub,
  tint,
}: {
  label: string;
  value: string;
  sub?: string;
  tint?: "orange";
}) {
  return (
    <div className="liquid-glass p-5" style={{ borderRadius: "1.25rem" }}>
      <p className="text-xs font-body font-light text-white/70">{label}</p>
      <p
        className={`mt-1 font-heading text-4xl tracking-[-1px] leading-none ${
          tint === "orange" ? "text-sealOrange" : "text-white"
        }`}
      >
        {value}
      </p>
      {sub && (
        <p className="mt-1 text-[11px] font-body font-light text-white/60">
          {sub}
        </p>
      )}
    </div>
  );
}
