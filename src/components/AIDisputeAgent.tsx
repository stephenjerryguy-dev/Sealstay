import { useMemo, useState } from "react";
import {
  AlertTriangle,
  Bot,
  CheckCircle,
  ChevronDown,
  Clock,
  FileText,
  Gavel,
  MessageSquare,
  Scale,
  Send,
  Shield,
  Sparkles,
} from "lucide-react";

type Ruling = "tenant_favored" | "landlord_favored" | "split" | "pending";
type Priority = "high" | "medium" | "low";

type Evidence = {
  label: string;
  by: "student" | "landlord" | "platform";
  relevance: number;
  summary: string;
};

type Dispute = {
  id: string;
  student: string;
  landlord: string;
  property: string;
  type: string;
  priority: Priority;
  daysOpen: number;
  description: string;
  depositAmount: number;
  monthlyRent: number;
  evidence: Evidence[];
  analysis: {
    confidence: number;
    recommendation: Ruling;
    riskScore: number;
    suggestedResolution: string;
    findings: string[];
    clauses: string[];
  } | null;
};

const disputes: Dispute[] = [
  {
    id: "D-2026-001",
    student: "Aisha Thompson",
    landlord: "Michael Forsythe",
    property: "Blue Star Studio - Unit 7",
    type: "Security Deposit",
    priority: "high",
    daysOpen: 3,
    depositAmount: 800,
    monthlyRent: 800,
    description:
      "Landlord is claiming $420 from the deposit for deep cleaning and wall damage. Tenant says the wall marks were pre-existing and the unit was reasonably cleaned.",
    evidence: [
      {
        label: "Move-in condition report",
        by: "platform",
        relevance: 95,
        summary: "Photos document existing wall scuffs near the entrance.",
      },
      {
        label: "Checkout condition report",
        by: "platform",
        relevance: 97,
        summary: "Photos show the same wall marks and reasonable cleanliness.",
      },
      {
        label: "Cleaning invoice",
        by: "landlord",
        relevance: 68,
        summary: "Invoice is valid, but does not prove tenant-level liability.",
      },
    ],
    analysis: {
      confidence: 91,
      recommendation: "tenant_favored",
      riskScore: 15,
      suggestedResolution:
        "Release the full $800 deposit to the tenant. The wall marks match move-in evidence and the cleaning charge appears to be turnover expense rather than damage beyond normal wear.",
      findings: [
        "Move-in and checkout photos are materially consistent.",
        "Wall marks appear pre-existing, not new damage.",
        "Lease requires documented damage beyond normal wear.",
      ],
      clauses: ["Deposit Return", "Normal Wear", "Checkout Procedure"],
    },
  },
  {
    id: "D-2026-002",
    student: "Raj Patel",
    landlord: "Patrice James",
    property: "Lance aux Epines Cottage - Unit B",
    type: "Property Condition",
    priority: "medium",
    daysOpen: 8,
    depositAmount: 800,
    monthlyRent: 800,
    description:
      "Mould in bedroom and bathroom was reported three times over 45 days. Landlord sent a handyman once and the mould returned.",
    evidence: [
      {
        label: "Bedroom mould photos",
        by: "student",
        relevance: 95,
        summary: "Three sets show progressive mould growth over 45 days.",
      },
      {
        label: "Maintenance requests",
        by: "platform",
        relevance: 92,
        summary: "Three reports with slow landlord response.",
      },
      {
        label: "Handyman receipt",
        by: "landlord",
        relevance: 55,
        summary: "Receipt indicates painting over mould, not remediation.",
      },
    ],
    analysis: {
      confidence: 87,
      recommendation: "split",
      riskScore: 42,
      suggestedResolution:
        "Credit the tenant 35% of rent for the affected 45-day period and require professional remediation within 10 business days.",
      findings: [
        "Mould was well documented and recurring.",
        "The repair was cosmetic rather than remedial.",
        "Full rent abatement is disproportionate because the unit was partly usable.",
      ],
      clauses: ["Habitability", "Maintenance Response", "Termination for Breach"],
    },
  },
  {
    id: "D-2026-004",
    student: "Priya Sharma",
    landlord: "Samuel Noel",
    property: "Belmont Heights 2BR",
    type: "Lease Terms",
    priority: "high",
    daysOpen: 1,
    depositAmount: 1400,
    monthlyRent: 1400,
    description:
      "Landlord changed parking rules mid-lease and began charging $75/mo for a previously included parking space.",
    evidence: [
      {
        label: "Signed lease parking clause",
        by: "platform",
        relevance: 98,
        summary: "One parking space included for the tenancy duration.",
      },
      {
        label: "Landlord WhatsApp notice",
        by: "student",
        relevance: 92,
        summary: "Message states parking will become $75/month.",
      },
    ],
    analysis: null,
  },
];

const rulingLabels: Record<Ruling, string> = {
  tenant_favored: "Tenant favored",
  landlord_favored: "Landlord favored",
  split: "Split resolution",
  pending: "Pending",
};

export default function AIDisputeAgent() {
  const [activeId, setActiveId] = useState(disputes[0].id);
  const [expanded, setExpanded] = useState<string | null>("findings");
  const [draft, setDraft] = useState("");
  const [messages, setMessages] = useState([
    {
      by: "ai",
      text: "I can summarize the evidence, explain a recommendation, or draft a resolution note for the selected dispute.",
    },
  ]);

  const active = useMemo(
    () => disputes.find((d) => d.id === activeId) ?? disputes[0],
    [activeId],
  );

  function runAnalysis() {
    setMessages((prev) => [
      ...prev,
      {
        by: "ai",
        text: "Triage complete. Evidence weight is strongest where platform records corroborate student or landlord claims. I recommend owner review before issuing any payout.",
      },
    ]);
  }

  function sendMessage(e: React.FormEvent) {
    e.preventDefault();
    if (!draft.trim()) return;
    const question = draft.trim();
    setDraft("");
    setMessages((prev) => [
      ...prev,
      { by: "owner", text: question },
      {
        by: "ai",
        text:
          active.analysis?.suggestedResolution ??
          "This dispute still needs evidence ingestion. Ask both parties for lease clauses, timestamped photos, and platform message records before making a ruling.",
      },
    ]);
  }

  return (
    <section className="grid grid-cols-1 gap-4 lg:grid-cols-[280px_1fr]">
      <aside className="liquid-glass p-3" style={{ borderRadius: "1.25rem" }}>
        <div className="mb-3 flex items-center gap-2 px-2 text-xs text-white/60">
          <Bot size={14} />
          SealMediator Queue
        </div>
        <div className="flex flex-col gap-2">
          {disputes.map((d) => (
            <button
              key={d.id}
              type="button"
              onClick={() => setActiveId(d.id)}
              className={`rounded-2xl border p-3 text-left transition ${
                d.id === active.id ? "border-sealOrange/50 bg-sealOrange/10" : "border-white/10 bg-white/[0.03] hover:bg-white/[0.06]"
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="font-body text-xs text-white">{d.id}</span>
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] ${
                    d.priority === "high"
                      ? "bg-red-500/15 text-red-200"
                      : d.priority === "medium"
                      ? "bg-amber-500/15 text-amber-200"
                      : "bg-white/10 text-white/55"
                  }`}
                >
                  {d.priority}
                </span>
              </div>
              <p className="mt-1 truncate text-xs text-white/55">{d.type}</p>
              <p className="mt-2 truncate font-heading text-lg leading-none text-white">
                {d.student}
              </p>
            </button>
          ))}
        </div>
      </aside>

      <div className="liquid-glass p-5" style={{ borderRadius: "1.25rem" }}>
        <div className="flex flex-col gap-4 border-b border-white/10 pb-4 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-xs text-white/55">{active.id} · {active.type}</p>
            <h2 className="mt-1 font-heading text-3xl leading-none tracking-[-1px] text-white">
              {active.property}
            </h2>
            <p className="mt-2 max-w-2xl text-sm font-body font-light leading-snug text-white/75">
              {active.description}
            </p>
          </div>
          <button
            type="button"
            onClick={runAnalysis}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-sealOrange px-4 py-2 text-xs font-semibold text-white"
          >
            <Sparkles size={14} />
            Run AI Triage
          </button>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
          <Metric icon={Clock} label="Days open" value={`${active.daysOpen}`} />
          <Metric icon={Shield} label="Deposit" value={`$${active.depositAmount}`} />
          <Metric icon={Scale} label="Rent" value={`$${active.monthlyRent}/mo`} />
          <Metric
            icon={Gavel}
            label="Recommendation"
            value={active.analysis ? rulingLabels[active.analysis.recommendation] : "Pending"}
          />
        </div>

        {active.analysis ? (
          <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-[1fr_300px]">
            <div className="space-y-3">
              <Panel
                id="findings"
                title="Key Findings"
                icon={CheckCircle}
                expanded={expanded}
                setExpanded={setExpanded}
              >
                <ul className="space-y-2">
                  {active.analysis.findings.map((finding) => (
                    <li key={finding} className="text-sm text-white/75">
                      {finding}
                    </li>
                  ))}
                </ul>
              </Panel>
              <Panel
                id="evidence"
                title="Evidence Weight"
                icon={FileText}
                expanded={expanded}
                setExpanded={setExpanded}
              >
                <div className="space-y-2">
                  {active.evidence.map((item) => (
                    <div key={item.label} className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-sm text-white">{item.label}</p>
                        <span className="text-xs text-sealOrange">{item.relevance}%</span>
                      </div>
                      <p className="mt-1 text-xs text-white/55">{item.summary}</p>
                    </div>
                  ))}
                </div>
              </Panel>
            </div>

            <aside className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <p className="text-xs text-white/55">Suggested Resolution</p>
              <p className="mt-2 text-sm leading-snug text-white/80">
                {active.analysis.suggestedResolution}
              </p>
              <div className="mt-4 grid grid-cols-2 gap-2">
                <div>
                  <p className="text-[10px] text-white/45">Confidence</p>
                  <p className="font-heading text-3xl text-white">{active.analysis.confidence}%</p>
                </div>
                <div>
                  <p className="text-[10px] text-white/45">Risk</p>
                  <p className="font-heading text-3xl text-sealOrange">{active.analysis.riskScore}</p>
                </div>
              </div>
            </aside>
          </div>
        ) : (
          <div className="mt-4 rounded-2xl border border-amber-300/20 bg-amber-300/10 p-4">
            <div className="flex items-center gap-2 text-sm text-amber-100">
              <AlertTriangle size={16} />
              Evidence has not been fully ingested yet.
            </div>
            <p className="mt-2 text-xs text-white/60">
              Collect lease clauses, timestamped photos, message history, and any platform payment records before issuing a decision.
            </p>
          </div>
        )}

        <div className="mt-4 rounded-2xl border border-white/10 bg-black/20 p-4">
          <div className="mb-3 flex items-center gap-2 text-xs text-white/55">
            <MessageSquare size={14} />
            Owner / AI Thread
          </div>
          <div className="max-h-56 space-y-2 overflow-y-auto pr-1">
            {messages.map((message, index) => (
              <div
                key={`${message.by}-${index}`}
                className={`rounded-2xl px-3 py-2 text-sm ${
                  message.by === "owner"
                    ? "ml-auto max-w-[80%] bg-sealOrange text-white"
                    : "max-w-[86%] bg-white/10 text-white/75"
                }`}
              >
                {message.text}
              </div>
            ))}
          </div>
          <form onSubmit={sendMessage} className="mt-3 flex gap-2">
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Ask SealMediator about the evidence..."
              className="min-w-0 flex-1 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white outline-none placeholder:text-white/35"
            />
            <button
              type="submit"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-black"
              aria-label="Send message"
            >
              <Send size={15} />
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

function Metric({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-3">
      <div className="mb-2 flex items-center gap-2 text-[10px] uppercase tracking-wide text-white/45">
        <Icon size={13} />
        {label}
      </div>
      <p className="font-heading text-2xl leading-none text-white">{value}</p>
    </div>
  );
}

function Panel({
  id,
  title,
  icon: Icon,
  expanded,
  setExpanded,
  children,
}: {
  id: string;
  title: string;
  icon: React.ComponentType<{ size?: number }>;
  expanded: string | null;
  setExpanded: (id: string | null) => void;
  children: React.ReactNode;
}) {
  const open = expanded === id;
  return (
    <section className="rounded-2xl border border-white/10 bg-white/[0.03]">
      <button
        type="button"
        onClick={() => setExpanded(open ? null : id)}
        className="flex w-full items-center justify-between gap-3 p-4 text-left"
      >
        <span className="inline-flex items-center gap-2 text-sm font-medium text-white">
          <Icon size={16} />
          {title}
        </span>
        <ChevronDown className={`h-4 w-4 text-white/55 transition ${open ? "rotate-180" : ""}`} />
      </button>
      {open && <div className="border-t border-white/10 p-4">{children}</div>}
    </section>
  );
}
