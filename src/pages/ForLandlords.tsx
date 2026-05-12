import { Link } from "react-router-dom";
import PageShell from "../components/PageShell";

export default function ForLandlords() {
  const points = [
    {
      title: "Pre-vetted student tenants",
      body:
        "Only SGU students with verified enrollment status reach your inbox. Less back-and-forth, fewer no-shows.",
    },
    {
      title: "Lease support, not lease shopping",
      body:
        "We translate your existing lease into student-readable English. Your terms stay yours.",
    },
    {
      title: "On-time payments",
      body:
        "Rent flows through our escrow. Late payments are flagged before they become evictions.",
    },
  ];
  return (
    <PageShell
      kicker="For Landlords"
      title="List once, fill every term"
      subtitle="If your property is in St. George's, Lance aux Épines, True Blue, or Grand Anse — and you're tired of chasing roommate groups every August — list with us."
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-2">
        {points.map((p) => (
          <div
            key={p.title}
            className="liquid-glass p-6 min-h-[220px]"
            style={{ borderRadius: "1.25rem" }}
          >
            <h3 className="font-heading text-white text-3xl tracking-[-1px] leading-none">
              {p.title}
            </h3>
            <p className="mt-3 text-sm text-white/90 font-body font-light leading-snug max-w-[36ch]">
              {p.body}
            </p>
          </div>
        ))}
      </div>
      <div className="mt-10">
        <Link
          to="/list-property"
          className="liquid-glass-strong rounded-full px-5 py-2.5 inline-flex text-sm font-medium font-body text-white"
        >
          List a property
        </Link>
      </div>
    </PageShell>
  );
}
