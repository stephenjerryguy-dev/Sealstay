import { useMemo, useState } from "react";
import PageShell from "../components/PageShell";
import { LISTINGS } from "../data/listings";

export default function ClaimListing() {
  const [q, setQ] = useState("");
  const [claimedId, setClaimedId] = useState<string | null>(null);

  const matches = useMemo(() => {
    if (q.length < 2) return [];
    const needle = q.toLowerCase();
    return LISTINGS.filter(
      (l) =>
        l.title.toLowerCase().includes(needle) ||
        l.neighborhood.toLowerCase().includes(needle),
    ).slice(0, 8);
  }, [q]);

  return (
    <PageShell
      kicker="Claim a listing"
      title="Already on the map?"
      subtitle="If your property is already in our system, claim it to update photos, pricing, and availability — and to receive direct enquiries from verified students."
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Search */}
        <section
          className="lg:col-span-2 liquid-glass p-6"
          style={{ borderRadius: "1.5rem" }}
        >
          <p className="text-xs font-body text-white/70">
            // Search by name or neighborhood
          </p>
          <input
            type="text"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="e.g. Lance aux Épines, Garden Suite, Blue Star…"
            className="mt-3 w-full bg-white/5 text-white placeholder-white/40 px-4 py-3 outline-none border border-white/15 focus:border-white/40 transition"
            style={{ borderRadius: "0.75rem" }}
          />

          <ul className="mt-5 flex flex-col gap-3">
            {matches.map((l) => (
              <li
                key={l.id}
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
                <button
                  type="button"
                  onClick={() => setClaimedId(l.id)}
                  className="liquid-glass-strong rounded-full px-4 py-2 text-xs font-medium font-body text-white"
                >
                  Claim
                </button>
              </li>
            ))}
            {q.length >= 2 && matches.length === 0 && (
              <li
                className="liquid-glass p-4 text-sm font-body font-light text-white/80"
                style={{ borderRadius: "1rem" }}
              >
                No matches. Your property may not be on SealStay yet — list it
                in 4 steps from the List Property page.
              </li>
            )}
          </ul>
        </section>

        {/* Verification */}
        <section
          className="liquid-glass p-6"
          style={{ borderRadius: "1.5rem" }}
        >
          <p className="text-xs font-body text-white/70">// How we verify</p>
          <ol className="mt-3 flex flex-col gap-3">
            {[
              "We send a confirmation code to a phone number on file with the registry.",
              "On-island team makes a 5-minute verification visit.",
              "Listing routes to your portal once both checks pass.",
            ].map((s, i) => (
              <li
                key={i}
                className="flex gap-3 text-sm font-body font-light text-white/85"
              >
                <span className="font-heading italic text-sealOrange text-2xl tracking-[-1px] shrink-0 leading-none">
                  {(i + 1).toString().padStart(2, "0")}
                </span>
                <p className="leading-snug pt-1.5">{s}</p>
              </li>
            ))}
          </ol>
          <p className="mt-5 text-[11px] font-body font-light text-white/60 leading-snug">
            Average end-to-end claim time: 36 hours. No fee unless we send you a
            verified lead.
          </p>
        </section>
      </div>

      {claimedId && (
        <div
          className="mt-6 liquid-glass-strong p-5 flex items-center gap-4"
          style={{ borderRadius: "1.25rem" }}
        >
          <div className="font-heading italic text-sealOrange text-3xl">
            Sent
          </div>
          <p className="text-sm font-body font-light text-white/90 flex-1">
            Claim request submitted for{" "}
            <span className="text-white font-medium">
              {LISTINGS.find((l) => l.id === claimedId)?.title}
            </span>
            . You'll hear from us within 24 hours.
          </p>
          <button
            type="button"
            onClick={() => setClaimedId(null)}
            className="text-xs font-body text-white/70 hover:text-white"
          >
            Dismiss
          </button>
        </div>
      )}
    </PageShell>
  );
}
