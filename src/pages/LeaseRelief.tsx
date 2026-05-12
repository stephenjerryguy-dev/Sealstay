import { useState } from "react";
import { motion } from "framer-motion";
import PageShell from "../components/PageShell";

type Path =
  | "roommate-bailed"
  | "early-termination"
  | "sublet-term-break"
  | "deposit-stuck"
  | "landlord-vanished";

const PATHS: { id: Path; label: string; lede: string }[] = [
  {
    id: "roommate-bailed",
    label: "My roommate bailed",
    lede: "Cover their share or replace them — fast.",
  },
  {
    id: "early-termination",
    label: "I need to leave early",
    lede: "Withdraw, transfer, family, illness — clean exit options.",
  },
  {
    id: "sublet-term-break",
    label: "Sublet through term break",
    lede: "Earn back rent during summer / winter without breaching the lease.",
  },
  {
    id: "deposit-stuck",
    label: "Landlord won't return my deposit",
    lede: "Escrow, dispute path, small-claims escalation.",
  },
  {
    id: "landlord-vanished",
    label: "I can't reach my landlord",
    lede: "On-island contact intake, repair authorization while we find them.",
  },
];

const PLAYBOOKS: Record<Path, { steps: string[]; outcome: string }> = {
  "roommate-bailed": {
    steps: [
      "Tell us their move-out date and remaining months on the lease.",
      "We post the room privately to the SGU class group with verified profiles.",
      "Roommate DNA matches you with compatible candidates within 7 days.",
      "We draft the addendum and route landlord approval — no chain emails.",
    ],
    outcome: "Avg replacement time: 9 days. Cost: free if found via SealStay.",
  },
  "early-termination": {
    steps: [
      "Upload your lease — we surface the early-termination clause and the real cost.",
      "We propose three exit paths: paid buy-out, replacement tenant, hardship clause.",
      "We negotiate with the landlord on your behalf in writing.",
      "If terms agreed, we draft the release for both parties.",
    ],
    outcome: "Avg fee waived: 47%. SealStay legal review: included.",
  },
  "sublet-term-break": {
    steps: [
      "Confirm your lease permits sublets (we check ¶ 9 / ¶ 11 commonly).",
      "List your unit privately to incoming SGU students for the break.",
      "We collect rent in escrow and pay you weekly.",
      "Property re-inspected before you return.",
    ],
    outcome: "Avg recovered rent: US$1,800 / break. Turnover: handled.",
  },
  "deposit-stuck": {
    steps: [
      "Tell us when you moved out and what was deducted.",
      "We send a formal demand letter under Grenada tenancy ordinance.",
      "If unresolved in 14 days, we open a small-claims package for you.",
      "Refund routes through SealStay escrow once issued.",
    ],
    outcome: "Avg recovery: 92% of refundable balance. Filing time: 7 min.",
  },
  "landlord-vanished": {
    steps: [
      "We attempt 3-channel reach: WhatsApp, phone, registered email.",
      "Critical-repair authorization granted by SealStay if life-safety.",
      "On-island concierge dispatched for inspection.",
      "Cost is recovered from the landlord under the agency clause.",
    ],
    outcome: "Avg landlord re-engaged: 4 days. Repair coverage: 24h emergency.",
  },
};

export default function LeaseRelief() {
  const [path, setPath] = useState<Path>("roommate-bailed");
  const playbook = PLAYBOOKS[path];

  return (
    <PageShell
      kicker="Lease Relief"
      title="Help when the lease goes sideways"
      subtitle="Med school is hard enough. We walk students through the five worst lease situations on the island, with a real playbook for each."
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Path picker */}
        <section
          className="liquid-glass p-6 flex flex-col gap-3"
          style={{ borderRadius: "1.5rem" }}
        >
          <p className="text-xs font-body text-white/70">// Pick a situation</p>
          {PATHS.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => setPath(p.id)}
              className={`text-left p-4 transition ${
                path === p.id
                  ? "bg-sealOrange text-white"
                  : "liquid-glass text-white/85 hover:text-white"
              }`}
              style={{ borderRadius: "1rem" }}
            >
              <p className="font-heading text-2xl tracking-[-0.5px] leading-none">
                {p.label}
              </p>
              <p
                className={`mt-1.5 text-[12px] font-body font-light leading-snug ${
                  path === p.id ? "text-white/90" : "text-white/65"
                }`}
              >
                {p.lede}
              </p>
            </button>
          ))}
        </section>

        {/* Playbook */}
        <motion.section
          key={path}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="lg:col-span-2 liquid-glass p-6"
          style={{ borderRadius: "1.5rem" }}
        >
          <p className="text-xs font-body text-white/70">// Playbook</p>
          <h2 className="mt-1 font-heading text-white text-3xl md:text-4xl tracking-[-1px] leading-none">
            {PATHS.find((p) => p.id === path)?.label}
          </h2>
          <ol className="mt-6 flex flex-col gap-3">
            {playbook.steps.map((s, i) => (
              <li
                key={i}
                className="liquid-glass p-4 flex gap-4"
                style={{ borderRadius: "1rem" }}
              >
                <span
                  className="font-heading italic text-sealOrange text-3xl tracking-[-1px] shrink-0"
                  style={{ width: 36, lineHeight: 1 }}
                >
                  {(i + 1).toString().padStart(2, "0")}
                </span>
                <p className="text-sm font-body font-light text-white/90 leading-snug">
                  {s}
                </p>
              </li>
            ))}
          </ol>
          <div
            className="mt-6 px-4 py-3 text-sm font-body font-light text-white/90"
            style={{
              borderRadius: "0.85rem",
              background: "rgba(255,106,26,0.10)",
              border: "1px solid rgba(255,106,26,0.35)",
            }}
          >
            <span className="text-sealOrange font-medium">Outcome:</span>{" "}
            {playbook.outcome}
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              className="liquid-glass-strong rounded-full px-5 py-2.5 text-sm font-medium font-body text-white"
            >
              Start this playbook
            </button>
            <a
              href="mailto:relief@sealstay.xyz"
              className="text-sm font-body text-white/85 hover:text-white self-center"
            >
              Talk to a human →
            </a>
          </div>
        </motion.section>
      </div>
    </PageShell>
  );
}
