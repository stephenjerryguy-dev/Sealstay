import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Activity,
  BarChart3,
  Bell,
  ClipboardCheck,
  FileText,
  Gauge,
  Home,
  LogOut,
  Settings,
  Shield,
  Users,
} from "lucide-react";
import AIDisputeAgent from "../components/AIDisputeAgent";
import GrenadaMap from "../components/GrenadaMap";
import { LISTINGS } from "../data/listings";
import { clearAdminSession, getAdminSession, type AdminSession } from "./AdminLogin";

type TabId =
  | "overview"
  | "listings"
  | "students"
  | "landlords"
  | "disputes"
  | "notifications"
  | "analytics"
  | "settings"
  | "audit";

const tabs: Array<{
  id: TabId;
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  ownerOnly?: boolean;
}> = [
  { id: "overview", label: "Overview", icon: Gauge },
  { id: "listings", label: "Listings", icon: ClipboardCheck },
  { id: "students", label: "Students", icon: Users },
  { id: "landlords", label: "Landlords", icon: Home },
  { id: "disputes", label: "AI Disputes", icon: Shield },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "analytics", label: "Analytics", icon: BarChart3, ownerOnly: true },
  { id: "settings", label: "Settings", icon: Settings, ownerOnly: true },
  { id: "audit", label: "Audit Log", icon: Activity, ownerOnly: true },
];

const students = [
  { name: "Maya O.", tier: "Gold Seal", status: "Lease signed", listing: LISTINGS[0]?.title },
  { name: "Idris K.", tier: "Silver Seal", status: "Deposit pending", listing: LISTINGS[2]?.title },
  { name: "Rina P.", tier: "Flipper", status: "Lease review", listing: LISTINGS[5]?.title },
];

const landlords = [
  { name: "Blue Star Management", status: "Claim needed", listings: 3, risk: "low" },
  { name: "Copal Real Estate", status: "Source partner", listings: 12, risk: "medium" },
  { name: "MCB Realty", status: "Source partner", listings: 12, risk: "medium" },
];

const auditEntries = [
  { type: "listing", body: "Blue Star 2BR marked as verified pending photo rights review.", time: "12 min ago" },
  { type: "auth", body: "Staff user Kezia Morrison accessed disputes queue.", time: "46 min ago" },
  { type: "lease", body: "Lease DNA scan completed for Lance aux Epines 2BR.", time: "2h ago" },
  { type: "payment", body: "Escrow configuration checklist reviewed.", time: "4h ago" },
];

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [session, setSession] = useState<AdminSession | null>(null);
  const [active, setActive] = useState<TabId>("overview");

  useEffect(() => {
    const current = getAdminSession();
    if (!current) {
      navigate("/admin/login", { replace: true });
      return;
    }
    setSession(current);
  }, [navigate]);

  const stats = useMemo(() => {
    const total = LISTINGS.length;
    const verified = LISTINGS.filter((l) => l.sealApproved).length;
    const avgRent = Math.round(LISTINGS.reduce((s, l) => s + l.price, 0) / total);
    const minWalk = Math.min(...LISTINGS.map((l) => l.walkToCampus));
    return { total, verified, avgRent, minWalk };
  }, []);

  if (!session) return null;

  const isOwner = session.role === "owner";
  const visibleTabs = tabs.filter((tab) => !tab.ownerOnly || isOwner);

  function signOut() {
    clearAdminSession();
    navigate("/admin/login", { replace: true });
  }

  return (
    <main className="min-h-screen bg-sealNavyDeep text-white">
      <div className="grid min-h-screen grid-cols-1 lg:grid-cols-[280px_1fr]">
        <aside className="border-b border-white/10 bg-black/20 p-4 lg:border-b-0 lg:border-r">
          <div className="flex items-start justify-between gap-3 lg:block">
            <div>
              <p className="text-xs font-body text-white/45">// SealStay OS</p>
              <h1 className="mt-1 font-heading text-4xl leading-none tracking-[-1px]">
                Operations
              </h1>
              <div
                className={`mt-3 inline-flex rounded-full px-3 py-1 text-xs ${
                  isOwner ? "bg-sealOrange/15 text-sealOrange" : "bg-sky-400/15 text-sky-200"
                }`}
              >
                {isOwner ? "Owner Suite" : "Staff Portal"}
              </div>
            </div>
            <button
              type="button"
              onClick={signOut}
              className="rounded-full border border-white/10 p-3 text-white/65 transition hover:text-white lg:mt-5"
              aria-label="Sign out"
            >
              <LogOut size={16} />
            </button>
          </div>

          <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.03] p-3">
            <p className="text-sm text-white">{session.name}</p>
            <p className="mt-1 text-xs text-white/45">{session.email}</p>
          </div>

          <nav className="mt-5 flex gap-2 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible">
            {visibleTabs.map((tab) => {
              const Icon = tab.icon;
              const selected = active === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActive(tab.id)}
                  className={`flex shrink-0 items-center gap-3 rounded-full px-4 py-2 text-sm transition lg:rounded-2xl ${
                    selected
                      ? "bg-white text-black"
                      : "border border-white/10 bg-white/[0.03] text-white/70 hover:text-white"
                  }`}
                >
                  <Icon size={16} />
                  {tab.label}
                </button>
              );
            })}
          </nav>

          <Link
            to="/"
            className="mt-5 hidden rounded-full border border-white/10 px-4 py-2 text-center text-xs text-white/45 transition hover:text-white lg:block"
          >
            Return to public site
          </Link>
        </aside>

        <section className="min-w-0 p-4 pt-6 lg:p-8">
          {active === "overview" && <Overview stats={stats} />}
          {active === "listings" && <ListingsOps />}
          {active === "students" && <People title="Student pipeline" rows={students} />}
          {active === "landlords" && <People title="Landlord pipeline" rows={landlords} />}
          {active === "disputes" && <AIDisputeAgent />}
          {active === "notifications" && <Notifications />}
          {active === "analytics" && <Analytics />}
          {active === "settings" && <SettingsPanel />}
          {active === "audit" && <AuditLog />}
        </section>
      </div>
    </main>
  );
}

function Overview({ stats }: { stats: { total: number; verified: number; avgRent: number; minWalk: number } }) {
  return (
    <div>
      <Header title="Command overview" subtitle="Listings funnel, disputes, verification, and coverage across the SGU corridor." />
      <div className="mb-6 grid grid-cols-2 gap-4 xl:grid-cols-4">
        <Kpi label="Listings" value={stats.total.toString()} />
        <Kpi label="Seal Approved" value={`${stats.verified}`} sub={`/ ${stats.total}`} />
        <Kpi label="Avg. rent" value={`$${stats.avgRent.toLocaleString()}`} sub="USD/mo" />
        <Kpi label="Closest walk" value={`${stats.minWalk} min`} sub="to SGU" tint />
      </div>
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
        <section className="xl:col-span-2">
          <p className="mb-2 text-xs font-body text-white/55">// Coverage</p>
          <GrenadaMap listings={LISTINGS} height={460} />
        </section>
        <section className="liquid-glass p-5" style={{ borderRadius: "1.25rem" }}>
          <h2 className="font-heading text-3xl leading-none tracking-[-1px]">
            Today's focus
          </h2>
          <div className="mt-4 space-y-3">
            {[
              "Verify exact coordinates for every public listing.",
              "Replace stock photos where owners provide rights-cleared media.",
              "Move Blue Star from claim-needed to verified once availability is confirmed.",
              "Review active dispute SLA before student outreach.",
            ].map((item) => (
              <div key={item} className="rounded-2xl border border-white/10 bg-white/[0.03] p-3 text-sm text-white/70">
                {item}
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

function ListingsOps() {
  const queue = LISTINGS.slice(0, 9).map((listing, i) => ({
    listing,
    state: i % 3 === 0 ? "Coordinate audit" : i % 3 === 1 ? "Photo rights" : "Owner claim",
  }));

  return (
    <div>
      <Header title="Listings verification" subtitle="Every property needs a source, exact coordinate, availability state, and media rights check before full trust badges." />
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
        {queue.map(({ listing, state }) => (
          <Link
            key={listing.id}
            to={`/listings/${listing.id}`}
            className="liquid-glass flex items-center gap-3 p-3"
            style={{ borderRadius: "1rem" }}
          >
            <img src={listing.thumb} alt="" className="h-16 w-16 shrink-0 object-cover" style={{ borderRadius: "0.7rem" }} />
            <div className="min-w-0 flex-1">
              <p className="truncate font-heading text-xl leading-none text-white">{listing.title}</p>
              <p className="mt-1 truncate text-xs text-white/55">{listing.neighborhood} · ${listing.price.toLocaleString()}/mo</p>
            </div>
            <span className="rounded-full bg-sealOrange/15 px-2.5 py-1 text-[10px] text-sealOrange">
              {state}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}

function People({
  title,
  rows,
}: {
  title: string;
  rows: Array<Record<string, string | number | undefined>>;
}) {
  return (
    <div>
      <Header title={title} subtitle="Mock operational data restored from the original Make flow; ready to connect to the real backend later." />
      <div className="overflow-hidden rounded-3xl border border-white/10">
        {rows.map((row, index) => (
          <div
            key={`${row.name}-${index}`}
            className="grid grid-cols-1 gap-2 border-b border-white/10 bg-white/[0.03] p-4 last:border-b-0 md:grid-cols-4"
          >
            {Object.entries(row).map(([key, value]) => (
              <div key={key}>
                <p className="text-[10px] uppercase tracking-wide text-white/35">{key}</p>
                <p className="mt-1 text-sm text-white/80">{value}</p>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

function Notifications() {
  return (
    <div>
      <Header title="Notifications" subtitle="Operational alerts from the original OS concept." />
      <div className="space-y-3">
        {[
          ["high", "Three listings have neighborhood-level coordinates only."],
          ["medium", "Two owner claims need ID verification before portal access."],
          ["low", "Lease scanner queue is clear."],
        ].map(([severity, body]) => (
          <div key={body} className="liquid-glass flex items-center gap-3 p-4" style={{ borderRadius: "1rem" }}>
            <span className={`h-2.5 w-2.5 rounded-full ${severity === "high" ? "bg-red-400" : severity === "medium" ? "bg-amber-300" : "bg-emerald-300"}`} />
            <p className="text-sm text-white/75">{body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function Analytics() {
  return (
    <div>
      <Header title="Owner analytics" subtitle="Owner-only business intelligence, restored as the dashboard frame for future real metrics." />
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Kpi label="Projected GMV" value="$42.8k" sub="monthly" />
        <Kpi label="Verification yield" value="68%" sub="source to approved" />
        <Kpi label="Dispute risk" value="Low" sub="15 avg risk score" tint />
      </div>
    </div>
  );
}

function SettingsPanel() {
  return (
    <div>
      <Header title="Settings" subtitle="Owner-only operational toggles." />
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {["Require coordinate verification", "Hold unclaimed listings for review", "Enable AI dispute drafts", "Escrow launch checklist"].map((setting) => (
          <label key={setting} className="liquid-glass flex items-center justify-between gap-4 p-4" style={{ borderRadius: "1rem" }}>
            <span className="text-sm text-white/75">{setting}</span>
            <input type="checkbox" defaultChecked className="h-5 w-5 accent-sealOrange" />
          </label>
        ))}
      </div>
    </div>
  );
}

function AuditLog() {
  return (
    <div>
      <Header title="Audit log" subtitle="Owner-only action trail." />
      <div className="space-y-3">
        {auditEntries.map((entry) => (
          <div key={entry.body} className="liquid-glass flex items-start gap-3 p-4" style={{ borderRadius: "1rem" }}>
            <FileText className="mt-0.5 h-4 w-4 shrink-0 text-sealOrange" />
            <div>
              <p className="text-sm text-white/80">{entry.body}</p>
              <p className="mt-1 text-xs text-white/40">{entry.type} · {entry.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Header({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <header className="mb-6">
      <p className="text-xs font-body text-white/45">// Internal</p>
      <h1 className="mt-1 font-heading text-5xl leading-none tracking-[-1px] text-white">
        {title}
      </h1>
      <p className="mt-3 max-w-3xl text-sm font-body font-light leading-snug text-white/65">
        {subtitle}
      </p>
    </header>
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
  tint?: boolean;
}) {
  return (
    <div className="liquid-glass p-5" style={{ borderRadius: "1.25rem" }}>
      <p className="text-xs font-body font-light text-white/60">{label}</p>
      <p className={`mt-1 font-heading text-4xl leading-none tracking-[-1px] ${tint ? "text-sealOrange" : "text-white"}`}>
        {value}
      </p>
      {sub && <p className="mt-1 text-[11px] font-body text-white/45">{sub}</p>}
    </div>
  );
}
