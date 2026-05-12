import PageShell from "../components/PageShell";

const STEPS = [
  {
    n: "01",
    title: "Search & filter",
    body:
      "Browse only verified properties around SGU. Filter by walk time, occupancy, Seal Approved status, and SealScore.",
  },
  {
    n: "02",
    title: "Decode the lease",
    body:
      "Drop your lease into Lease DNA Scanner. Plain-English summary, risk flags, and a redline draft you can send back.",
  },
  {
    n: "03",
    title: "Reserve & pay safely",
    body:
      "Hold the property for 72 hours while you finish paperwork. Deposits sit in escrow and are refund-backed by SealShield.",
  },
  {
    n: "04",
    title: "Land in Grenada",
    body:
      "Pick up keys, get a Welcome Pack with the local taxi numbers, generator quirks, and grocery runs your landlord forgot to mention.",
  },
];

export default function HowItWorks() {
  return (
    <PageShell
      kicker="How It Works"
      title="From search to keys in hand"
      subtitle="Four steps. Every one of them protects you, not the listing agent."
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-2">
        {STEPS.map((s) => (
          <div
            key={s.n}
            className="liquid-glass p-6 min-h-[200px]"
            style={{ borderRadius: "1.25rem" }}
          >
            <div className="font-heading text-white/60 text-3xl">Step {s.n}</div>
            <h3 className="mt-2 font-heading text-white text-3xl tracking-[-1px] leading-none">
              {s.title}
            </h3>
            <p className="mt-3 text-sm text-white/90 font-body font-light leading-snug max-w-[44ch]">
              {s.body}
            </p>
          </div>
        ))}
      </div>
    </PageShell>
  );
}
