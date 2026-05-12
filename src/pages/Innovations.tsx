import PageShell from "../components/PageShell";

const FEATURES = [
  {
    name: "Lease DNA Scanner",
    sub: "AI lease translator",
    body: "Upload any Grenada lease. Risks flagged. Plain-English summary. Negotiation redline drafted.",
  },
  {
    name: "SealScore",
    sub: "Property fitness rating",
    body: "Walkability to SGU, generator backup, hurricane history, Wi-Fi performance, student-life fit.",
  },
  {
    name: "SealShield",
    sub: "Deposit refund guarantee",
    body: "If a verified property misrepresents itself, your deposit is refunded — no arbitration required.",
  },
  {
    name: "Roommate DNA",
    sub: "Compatibility matching",
    body: "Quiet hours, overnight guests, study habits, dietary restrictions — surfaced before you sign together.",
  },
];

export default function Innovations() {
  return (
    <PageShell
      kicker="Innovations"
      title="Tools you didn't know housing needed"
      subtitle="Real estate hasn't changed in 50 years. Med-school housing in another country shouldn't be the same experience as renting your first apartment in your hometown."
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-2">
        {FEATURES.map((f) => (
          <div
            key={f.name}
            className="liquid-glass p-6"
            style={{ borderRadius: "1.25rem" }}
          >
            <p className="text-xs font-body text-white/70">{f.sub}</p>
            <h3 className="mt-1 font-heading text-white text-4xl tracking-[-1px] leading-none">
              {f.name}
            </h3>
            <p className="mt-4 text-sm text-white/90 font-body font-light leading-snug max-w-[44ch]">
              {f.body}
            </p>
          </div>
        ))}
      </div>
    </PageShell>
  );
}
