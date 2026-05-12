import { useMemo } from "react";
import { Link } from "react-router-dom";
import PageShell from "../components/PageShell";
import ProtectedPage from "../components/ProtectedPage";
import { useAuth } from "../context/AuthContext";
import { LISTINGS } from "../data/listings";

export default function LandlordPortal() {
  return (
    <ProtectedPage roles={["landlord", "admin"]}>
      <Inner />
    </ProtectedPage>
  );
}

function Inner() {
  const { user } = useAuth();
  // Pretend the landlord owns the first 3 properties.
  const portfolio = useMemo(() => LISTINGS.slice(0, 3), []);
  const totalRent = portfolio.reduce((s, l) => s + l.price, 0);
  const occupied = portfolio.length;
  const tenants = [
    { name: "Maya O.", listingId: portfolio[0].id, status: "Paid · May" },
    { name: "Idris K.", listingId: portfolio[1].id, status: "Paid · May" },
    { name: "Rina P.", listingId: portfolio[2].id, status: "Pending · 3 days late" },
  ];
  const tickets = [
    { property: portfolio[0].title, type: "Generator service due", priority: "low" },
    { property: portfolio[1].title, type: "AC filter replaced", priority: "done" },
    { property: portfolio[2].title, type: "Window seal — leak after rain", priority: "high" },
  ];

  return (
    <PageShell
      kicker="Landlord Portal"
      title={`Welcome, ${user?.name?.split(" ")[0] || "Owner"}`}
      subtitle="Your portfolio at a glance — listings, tenants, rent, maintenance — kept tidy."
    >
      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Kpi label="Listings" value={portfolio.length.toString()} />
        <Kpi label="Occupied" value={`${occupied} / ${portfolio.length}`} />
        <Kpi label="MRR" value={`$${totalRent.toLocaleString()}`} />
        <Kpi label="On-time rent (90d)" value="94%" tint="orange" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Portfolio */}
        <section
          className="lg:col-span-2 liquid-glass p-6"
          style={{ borderRadius: "1.5rem" }}
        >
          <div className="flex items-baseline justify-between gap-3 flex-wrap">
            <h2 className="font-heading text-white text-3xl tracking-[-1px] leading-none">
              Your portfolio
            </h2>
            <Link
              to="/list-property"
              className="liquid-glass-strong rounded-full px-4 py-2 text-xs font-medium font-body text-white"
            >
              + Add property
            </Link>
          </div>
          <ul className="mt-5 flex flex-col gap-3">
            {portfolio.map((l) => (
              <Link
                key={l.id}
                to={`/listings/${l.id}`}
                className="liquid-glass p-3 flex items-center gap-4"
                style={{ borderRadius: "1rem" }}
              >
                <img
                  src={l.thumb}
                  alt=""
                  className="w-16 h-16 object-cover shrink-0"
                  style={{ borderRadius: "0.6rem" }}
                />
                <div className="flex-1 min-w-0">
                  <p className="font-heading text-white text-xl tracking-[-0.5px] leading-none truncate">
                    {l.title}
                  </p>
                  <p className="mt-1 text-[11px] font-body font-light text-white/70">
                    {l.neighborhood} · {l.bedrooms} BR · ${l.price.toLocaleString()}/mo
                  </p>
                </div>
                <span className="liquid-glass rounded-full px-2.5 py-1 text-[10px] font-body text-white whitespace-nowrap">
                  Occupied
                </span>
              </Link>
            ))}
          </ul>
        </section>

        {/* Tenants + tickets */}
        <section
          className="liquid-glass p-6 flex flex-col gap-5"
          style={{ borderRadius: "1.5rem" }}
        >
          <div>
            <p className="text-xs font-body text-white/70">// Tenants</p>
            <ul className="mt-3 flex flex-col gap-2">
              {tenants.map((t) => {
                const property = portfolio.find((p) => p.id === t.listingId);
                return (
                  <li
                    key={t.name}
                    className="liquid-glass p-3 flex items-center gap-3"
                    style={{ borderRadius: "0.85rem" }}
                  >
                    <div
                      className="w-9 h-9 bg-sealOrange text-white flex items-center justify-center font-heading text-lg shrink-0"
                      style={{ borderRadius: "9999px" }}
                      aria-hidden
                    >
                      {t.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-body text-white text-sm">{t.name}</p>
                      <p className="text-[10px] font-body font-light text-white/65 truncate">
                        {property?.title}
                      </p>
                    </div>
                    <span
                      className={`text-[10px] font-body whitespace-nowrap ${
                        t.status.startsWith("Pending")
                          ? "text-sealOrange"
                          : "text-emerald-300"
                      }`}
                    >
                      {t.status}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>

          <div>
            <p className="text-xs font-body text-white/70">// Maintenance</p>
            <ul className="mt-3 flex flex-col gap-2">
              {tickets.map((t, i) => (
                <li
                  key={i}
                  className="liquid-glass p-3 flex items-center gap-3"
                  style={{ borderRadius: "0.85rem" }}
                >
                  <span
                    className={`w-2 h-2 rounded-full shrink-0 ${
                      t.priority === "high"
                        ? "bg-sealOrange"
                        : t.priority === "done"
                        ? "bg-emerald-300"
                        : "bg-white/40"
                    }`}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-body text-white text-sm">{t.type}</p>
                    <p className="text-[10px] font-body font-light text-white/65 truncate">
                      {t.property}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </div>
    </PageShell>
  );
}

function Kpi({
  label,
  value,
  tint,
}: {
  label: string;
  value: string;
  tint?: "orange";
}) {
  return (
    <div
      className="liquid-glass p-5"
      style={{ borderRadius: "1.25rem" }}
    >
      <p className="text-xs font-body font-light text-white/70">{label}</p>
      <p
        className={`mt-1 font-heading text-4xl tracking-[-1px] leading-none ${
          tint === "orange" ? "text-sealOrange" : "text-white"
        }`}
      >
        {value}
      </p>
    </div>
  );
}
