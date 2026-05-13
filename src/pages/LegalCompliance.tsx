import { useMemo, useState } from "react";
import {
  AlertTriangle,
  Building2,
  CheckCircle,
  ChevronDown,
  FileText,
  Lock,
  Printer,
  Scale,
  Shield,
} from "lucide-react";
import PageShell from "../components/PageShell";

type Status = "required" | "caution" | "ok";

type ComplianceItem = {
  act: string;
  relevance: string;
  action: string;
  status: Status;
  priority: "critical" | "high" | "medium";
  obligations: string[];
};

const legislation: ComplianceItem[] = [
  {
    act: "Real Estate Dealers and Developers Act",
    relevance:
      "A platform facilitating leases for a fee may need a Real Estate Dealer licence in Grenada before charging commission.",
    action:
      "Confirm licensing requirements with Grenada counsel before monetizing lease transactions or collecting platform fees.",
    status: "required",
    priority: "critical",
    obligations: [
      "Apply for the correct real-estate licence if required.",
      "Display licence details on contracts and marketing where required.",
      "Use a trust account if client funds are handled.",
    ],
  },
  {
    act: "Landlord and Tenant Act",
    relevance:
      "Controls lease terms, notices, entry rights, deposits, and tenancy termination standards.",
    action:
      "Make every SealStay lease template mirror Grenada tenancy rules and avoid platform promises that conflict with local law.",
    status: "caution",
    priority: "high",
    obligations: [
      "Use written lease terms for rent, parties, premises, duration, and notice.",
      "Avoid deposit terms that exceed local standard practice.",
      "Require clear written notice before non-emergency landlord entry.",
    ],
  },
  {
    act: "Electronic Transactions Act",
    relevance:
      "Supports electronic records and signatures for digital lease workflows when parties consent.",
    action:
      "Add explicit e-signature consent and retention language to all digital lease flows.",
    status: "ok",
    priority: "medium",
    obligations: [
      "Keep electronic contracts accessible and retainable.",
      "Disclose the electronic signature process before signing.",
      "Record consent and timestamped acceptance.",
    ],
  },
  {
    act: "Proceeds of Crime / AML obligations",
    relevance:
      "Escrow deposits and rental payments can trigger KYC, suspicious-transaction, and recordkeeping duties.",
    action:
      "Do not launch escrow until KYC/AML process, banking setup, and responsible officer duties are confirmed.",
    status: "required",
    priority: "critical",
    obligations: [
      "Verify landlord identity and ownership/authority.",
      "Verify student identity and SGU affiliation.",
      "Maintain payment and identity records for the legally required period.",
    ],
  },
  {
    act: "Data Protection Act",
    relevance:
      "SealStay collects personal, student, financial, lease, and dispute data.",
    action:
      "Publish privacy policy, data retention rules, access/deletion workflow, and breach response process before real users onboard.",
    status: "required",
    priority: "critical",
    obligations: [
      "Collect explicit consent for personal data.",
      "Limit access to sensitive documents and disputes.",
      "Create a breach response and data deletion workflow.",
    ],
  },
  {
    act: "Consumer Protection Act",
    relevance:
      "SealStay guarantees like relocation support, deposit security, and verified listings must be accurate and deliverable.",
    action:
      "Only show protection guarantees that the operating team can fulfill with documented procedures and reserves.",
    status: "caution",
    priority: "high",
    obligations: [
      "Avoid misleading listing and verification claims.",
      "Disclose all student and landlord fees before commitment.",
      "Maintain a documented dispute resolution process.",
    ],
  },
];

const requiredDocs = [
  "Corporate registration / local operating authority",
  "Real estate licence analysis and licence if required",
  "Trust or escrow banking agreement",
  "AML/KYC operating procedure",
  "Privacy policy and data retention policy",
  "Landlord partnership agreement",
  "Student booking / lease terms",
  "Dispute resolution policy",
  "Listing source and media-rights agreements",
];

export default function LegalCompliance() {
  const [open, setOpen] = useState(legislation[0].act);
  const [tab, setTab] = useState<"law" | "docs" | "lease">("law");

  const counts = useMemo(
    () => ({
      required: legislation.filter((l) => l.status === "required").length,
      caution: legislation.filter((l) => l.status === "caution").length,
      ok: legislation.filter((l) => l.status === "ok").length,
    }),
    [],
  );

  return (
    <PageShell
      kicker="Legal & Compliance"
      title="Make the promise real"
      subtitle="The original Make version had a serious compliance layer. This page restores the operating checklist so SealStay does not make guarantees before the legal rails exist."
    >
      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        <StatusCard icon={AlertTriangle} label="Required before launch" value={counts.required} tone="red" />
        <StatusCard icon={Shield} label="Needs counsel review" value={counts.caution} tone="amber" />
        <StatusCard icon={CheckCircle} label="Usable with controls" value={counts.ok} tone="green" />
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        {[
          ["law", "Legislation"],
          ["docs", "Required Docs"],
          ["lease", "Lease Guardrails"],
        ].map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setTab(id as "law" | "docs" | "lease")}
            className={`rounded-full px-4 py-2 text-xs font-medium transition ${
              tab === id ? "bg-white text-black" : "liquid-glass text-white/80 hover:text-white"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === "law" && (
        <div className="space-y-3">
          {legislation.map((item) => (
            <section
              key={item.act}
              className="liquid-glass overflow-hidden"
              style={{ borderRadius: "1.25rem" }}
            >
              <button
                type="button"
                onClick={() => setOpen(open === item.act ? "" : item.act)}
                className="flex w-full items-center justify-between gap-4 p-5 text-left"
              >
                <div className="flex items-start gap-3">
                  <Scale className={`mt-1 h-5 w-5 ${toneClass(item.status)}`} />
                  <div>
                    <h2 className="font-heading text-2xl leading-none tracking-[-0.5px] text-white">
                      {item.act}
                    </h2>
                    <p className="mt-2 text-sm font-body font-light text-white/65">
                      {item.relevance}
                    </p>
                  </div>
                </div>
                <ChevronDown className={`h-4 w-4 shrink-0 text-white/55 transition ${open === item.act ? "rotate-180" : ""}`} />
              </button>
              {open === item.act && (
                <div className="border-t border-white/10 p-5">
                  <div className="rounded-2xl border border-sealOrange/20 bg-sealOrange/10 p-4">
                    <p className="text-xs uppercase tracking-wide text-sealOrange">SealStay action</p>
                    <p className="mt-1 text-sm leading-snug text-white/80">{item.action}</p>
                  </div>
                  <ul className="mt-4 grid grid-cols-1 gap-2 md:grid-cols-3">
                    {item.obligations.map((obligation) => (
                      <li key={obligation} className="rounded-2xl border border-white/10 bg-white/[0.03] p-3 text-sm text-white/70">
                        {obligation}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </section>
          ))}
        </div>
      )}

      {tab === "docs" && (
        <div className="liquid-glass p-5" style={{ borderRadius: "1.25rem" }}>
          <div className="mb-4 flex items-center justify-between gap-4">
            <div>
              <h2 className="font-heading text-3xl leading-none text-white">Launch document checklist</h2>
              <p className="mt-2 text-sm text-white/60">These are operating prerequisites before real deposits, claims, and guarantees go live.</p>
            </div>
            <Printer className="hidden h-5 w-5 text-white/45 md:block" />
          </div>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {requiredDocs.map((doc, index) => (
              <div key={doc} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-3">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-sealOrange/15 text-xs text-sealOrange">
                  {index + 1}
                </span>
                <span className="text-sm text-white/75">{doc}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === "lease" && (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {[
            {
              icon: FileText,
              title: "Plain-language lease summary",
              body: "Every lease should have a student-readable summary before payment or commitment.",
            },
            {
              icon: Lock,
              title: "Deposit controls",
              body: "Do not market escrow or refund-backed deposits until banking, trust-account, and dispute rules are signed off.",
            },
            {
              icon: Building2,
              title: "Verified listing standard",
              body: "A listing should not say verified until exact location, landlord authority, availability, and photo rights are confirmed.",
            },
          ].map(({ icon: Icon, title, body }) => (
            <section key={title} className="liquid-glass p-5" style={{ borderRadius: "1.25rem" }}>
              <Icon className="h-5 w-5 text-sealOrange" />
              <h2 className="mt-4 font-heading text-3xl leading-none text-white">{title}</h2>
              <p className="mt-3 text-sm font-body font-light leading-snug text-white/70">{body}</p>
            </section>
          ))}
        </div>
      )}
    </PageShell>
  );
}

function StatusCard({
  icon: Icon,
  label,
  value,
  tone,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: number;
  tone: "red" | "amber" | "green";
}) {
  const color =
    tone === "red" ? "text-red-200" : tone === "amber" ? "text-amber-200" : "text-emerald-200";
  return (
    <section className="liquid-glass p-5" style={{ borderRadius: "1.25rem" }}>
      <Icon className={`h-5 w-5 ${color}`} />
      <p className="mt-4 text-xs font-body text-white/55">{label}</p>
      <p className="mt-1 font-heading text-5xl leading-none text-white">{value}</p>
    </section>
  );
}

function toneClass(status: Status) {
  if (status === "required") return "text-red-200";
  if (status === "caution") return "text-amber-200";
  return "text-emerald-200";
}
