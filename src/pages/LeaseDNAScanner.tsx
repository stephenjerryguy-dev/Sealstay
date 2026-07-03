import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, Upload, X, AlertTriangle, CheckCircle2, Sparkles } from "lucide-react";
import PageShell from "../components/PageShell";

type Severity = "ok" | "watch" | "risk";
type Finding = {
  clause: string;
  severity: Severity;
  plain: string;
  redline?: string;
};

// Grenada-tenancy-flavored sample findings. Real impl streams from the
// model with the lease text as input.
const SAMPLE_FINDINGS: Finding[] = [
  {
    clause: "Security Deposit (¶ 4)",
    severity: "watch",
    plain:
      "Two months' rent up front, refundable within 60 days of move-out. Industry standard in Grenada is 1 month, refundable in 30.",
    redline:
      "Reduce to one month's rent and require return within 30 days, less a written itemized deduction.",
  },
  {
    clause: "Generator & Utilities (¶ 7)",
    severity: "risk",
    plain:
      "Tenant is responsible for fuel and maintenance of the on-site generator. With weekly outages this could add ~US$80–120/mo unbudgeted.",
    redline:
      "Cap tenant generator-fuel responsibility at US$50/mo; landlord covers servicing and parts.",
  },
  {
    clause: "Hurricane Clause (¶ 12)",
    severity: "risk",
    plain:
      "If the property is uninhabitable for >7 days due to a named storm, you still owe full rent and must give 30 days' written notice to terminate.",
    redline:
      "Pro-rate rent for any week the unit is uninhabitable; allow termination with 7 days' notice if damage is structural.",
  },
  {
    clause: "Roommate Substitution (¶ 9)",
    severity: "ok",
    plain:
      "You can swap roommates with landlord's reasonable, non-unreasonable consent — favorable for SGU students rolling over terms.",
  },
  {
    clause: "Quiet Enjoyment (¶ 14)",
    severity: "ok",
    plain:
      "Standard quiet-enjoyment clause. Landlord can only enter with 24h notice except for emergencies.",
  },
  {
    clause: "Late Fee (¶ 6)",
    severity: "watch",
    plain:
      "10% of monthly rent if more than 5 days late. Above the customary 5% in Grenada.",
    redline:
      "Reduce late fee to 5% and add a 7-day grace period.",
  },
];

export default function LeaseDNAScanner() {
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const [done, setDone] = useState(false);

  function onFile(f: File | null) {
    setFile(f);
    setDone(false);
    setProgress(0);
    if (!f) return;
    // Mock scan animation — real impl uploads to /api/lease-scan and streams
    // findings via SSE.
    const start = performance.now();
    const dur = 2200;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / dur);
      setProgress(p);
      if (p < 1) requestAnimationFrame(tick);
      else setDone(true);
    };
    requestAnimationFrame(tick);
  }

  return (
    <PageShell
      kicker="Lease DNA Scanner"
      title="Decode any Grenada lease"
      subtitle="Drop the PDF you were sent. We translate the legalese into plain English, flag the clauses that hurt students, and draft the redline you can send back."
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Drop zone */}
        <section
          className="lg:col-span-1 liquid-glass p-6 flex flex-col"
          style={{ borderRadius: "1.5rem", minHeight: 320 }}
        >
          <p className="text-xs font-body text-sealSky/80">// Upload</p>
          <h3 className="mt-1 font-heading text-white text-3xl tracking-[-1px] leading-none">
            Your lease
          </h3>

          {!file ? (
            <label
              htmlFor="lease-file"
              className="mt-5 flex-1 flex flex-col items-center justify-center liquid-glass p-6 cursor-pointer text-center"
              style={{ borderRadius: "1.25rem", borderStyle: "dashed" }}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                const f = e.dataTransfer.files?.[0];
                if (f) onFile(f);
              }}
            >
              <Upload className="h-7 w-7 text-white/70" />
              <p className="mt-3 font-body text-white text-sm">
                Drop your lease PDF here
              </p>
              <p className="mt-1 text-xs font-body font-light text-white/60">
                or click to browse · max 25 MB
              </p>
              <input
                id="lease-file"
                type="file"
                accept=".pdf,.docx,.txt"
                className="hidden"
                onChange={(e) => onFile(e.target.files?.[0] ?? null)}
              />
            </label>
          ) : (
            <div
              className="mt-5 flex-1 flex flex-col liquid-glass p-5"
              style={{ borderRadius: "1.25rem" }}
            >
              <div className="flex items-center gap-3">
                <FileText className="h-6 w-6 text-white/85 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="font-body text-white text-sm truncate">
                    {file.name}
                  </p>
                  <p className="text-[11px] font-body font-light text-white/60">
                    {(file.size / 1024).toFixed(0)} KB
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => onFile(null)}
                  aria-label="Remove file"
                  className="text-white/70 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="mt-5">
                <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-sealOrange transition-[width] duration-100"
                    style={{ width: `${progress * 100}%` }}
                  />
                </div>
                <p className="mt-2 text-[11px] font-body text-white/70">
                  {done ? "Scan complete." : `Reading clauses… ${Math.round(progress * 100)}%`}
                </p>
              </div>
            </div>
          )}
        </section>

        {/* Output */}
        <section
          className="lg:col-span-2 liquid-glass p-6 min-h-[400px]"
          style={{ borderRadius: "1.5rem" }}
        >
          {!done ? (
            <EmptyOutput />
          ) : (
            <ResultPanel />
          )}
        </section>
      </div>
    </PageShell>
  );
}

function EmptyOutput() {
  return (
    <div className="h-full flex flex-col items-center justify-center text-center px-6">
      <Sparkles className="h-8 w-8 text-white/40" />
      <p className="mt-4 font-heading italic text-white text-3xl tracking-[-1px] leading-none">
        Your decoded lease lands here
      </p>
      <p className="mt-3 max-w-md text-sm font-body font-light text-white/70 leading-snug">
        Upload a PDF and we'll surface every clause that matters, ranked by how
        much it'll cost you over a typical SGU term.
      </p>
    </div>
  );
}

function ResultPanel() {
  const risks = SAMPLE_FINDINGS.filter((f) => f.severity === "risk").length;
  const watches = SAMPLE_FINDINGS.filter((f) => f.severity === "watch").length;
  const oks = SAMPLE_FINDINGS.filter((f) => f.severity === "ok").length;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="result"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <div className="flex items-center gap-3 flex-wrap">
          <p className="text-xs font-body text-sealSky/80">// Findings</p>
          <span className="liquid-glass rounded-full px-2.5 py-1 text-[11px] font-body text-white">
            {risks} risk
          </span>
          <span className="liquid-glass rounded-full px-2.5 py-1 text-[11px] font-body text-white">
            {watches} watch
          </span>
          <span className="liquid-glass rounded-full px-2.5 py-1 text-[11px] font-body text-white">
            {oks} ok
          </span>
        </div>

        <ul className="mt-4 flex flex-col gap-3">
          {SAMPLE_FINDINGS.map((f, i) => (
            <motion.li
              key={f.clause}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.07 }}
              className="liquid-glass p-4 flex gap-4"
              style={{ borderRadius: "1rem" }}
            >
              <SeverityIcon sev={f.severity} />
              <div className="flex-1 min-w-0">
                <p className="font-body text-white text-sm font-medium">
                  {f.clause}
                </p>
                <p className="mt-1 text-sm font-body font-light text-white/85 leading-snug">
                  {f.plain}
                </p>
                {f.redline && (
                  <div
                    className="mt-3 px-3 py-2 text-[12px] font-body font-light text-white/90 leading-snug"
                    style={{
                      borderRadius: "0.65rem",
                      background: "rgba(255,106,26,0.10)",
                      border: "1px solid rgba(255,106,26,0.35)",
                    }}
                  >
                    <span className="text-sealOrange font-medium">Redline:</span>{" "}
                    {f.redline}
                  </div>
                )}
              </div>
            </motion.li>
          ))}
        </ul>

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="button"
            className="liquid-glass-strong rounded-full px-5 py-2.5 text-sm font-medium font-body text-white"
          >
            Download redline (.docx)
          </button>
          <button
            type="button"
            className="liquid-glass rounded-full px-4 py-2 text-sm font-medium font-body text-white/85 hover:text-white"
          >
            Email a copy to me
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

function SeverityIcon({ sev }: { sev: Severity }) {
  if (sev === "risk")
    return <AlertTriangle className="h-5 w-5 text-sealOrange shrink-0 mt-0.5" />;
  if (sev === "watch")
    return <AlertTriangle className="h-5 w-5 text-amber-300 shrink-0 mt-0.5" />;
  return <CheckCircle2 className="h-5 w-5 text-emerald-300 shrink-0 mt-0.5" />;
}
