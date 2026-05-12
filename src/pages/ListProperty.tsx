import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Check } from "lucide-react";
import PageShell from "../components/PageShell";

type Step = 1 | 2 | 3 | 4;

const STEPS: { n: Step; label: string; sub: string }[] = [
  { n: 1, label: "Property", sub: "Address, beds, photos" },
  { n: 2, label: "Lease", sub: "Upload your standard lease" },
  { n: 3, label: "Inspection", sub: "Pick a window for the visit" },
  { n: 4, label: "Go live", sub: "Review & publish" },
];

export default function ListProperty() {
  const [step, setStep] = useState<Step>(1);
  const [form, setForm] = useState({
    title: "",
    neighborhood: "Lance aux Épines",
    bedrooms: 1,
    bathrooms: 1,
    monthly: 1200,
    petsAllowed: true,
    generator: true,
    inspectionDate: "",
    leaseFileName: "",
  });

  function next() {
    if (step < 4) setStep((step + 1) as Step);
  }
  function back() {
    if (step > 1) setStep((step - 1) as Step);
  }

  return (
    <PageShell
      kicker="List a property"
      title="Get verified, get listed"
      subtitle="Three steps then you're live. Photos, lease upload, on-site inspection — typically published inside 72 hours."
    >
      {/* Step indicator */}
      <ol className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {STEPS.map((s) => {
          const active = s.n === step;
          const done = s.n < step;
          return (
            <li
              key={s.n}
              className={`liquid-glass p-3 flex items-center gap-3 ${
                active ? "outline outline-1 outline-sealOrange" : ""
              }`}
              style={{ borderRadius: "1rem" }}
            >
              <span
                className={`w-7 h-7 rounded-full flex items-center justify-center font-body text-xs font-semibold ${
                  done
                    ? "bg-sealOrange text-white"
                    : active
                    ? "bg-white text-sealNavyDeep"
                    : "bg-white/10 text-white/70"
                }`}
              >
                {done ? <Check className="h-3.5 w-3.5" /> : s.n}
              </span>
              <div className="flex-1 min-w-0">
                <p className="font-body text-white text-sm leading-tight">
                  {s.label}
                </p>
                <p className="text-[10px] font-body font-light text-white/65 truncate">
                  {s.sub}
                </p>
              </div>
            </li>
          );
        })}
      </ol>

      <AnimatePresence mode="wait">
        <motion.section
          key={step}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.3 }}
          className="liquid-glass p-6 md:p-8"
          style={{ borderRadius: "1.5rem" }}
        >
          {step === 1 && <StepProperty form={form} setForm={setForm} />}
          {step === 2 && <StepLease form={form} setForm={setForm} />}
          {step === 3 && <StepInspection form={form} setForm={setForm} />}
          {step === 4 && <StepReview form={form} />}
        </motion.section>
      </AnimatePresence>

      <div className="mt-6 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={back}
          disabled={step === 1}
          className="text-sm font-body text-white/70 hover:text-white disabled:opacity-30"
        >
          ← Back
        </button>
        <button
          type="button"
          onClick={next}
          disabled={step === 4}
          className="liquid-glass-strong rounded-full px-5 py-2.5 text-sm font-medium font-body text-white inline-flex items-center gap-2 disabled:opacity-50"
        >
          {step === 4 ? "Submit for review" : "Continue"}
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </PageShell>
  );
}

type FormType = {
  title: string;
  neighborhood: string;
  bedrooms: number;
  bathrooms: number;
  monthly: number;
  petsAllowed: boolean;
  generator: boolean;
  inspectionDate: string;
  leaseFileName: string;
};

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-xs font-body text-white/70">{label}</span>
      <div className="mt-1.5">{children}</div>
    </label>
  );
}

function StepProperty({
  form,
  setForm,
}: {
  form: FormType;
  setForm: (f: FormType) => void;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Field label="Internal title (only you see this)">
        <input
          type="text"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          placeholder="e.g. Petal House — Lance aux Épines"
          className="w-full bg-white/5 text-white placeholder-white/40 px-4 py-3 outline-none border border-white/15 focus:border-white/40 transition"
          style={{ borderRadius: "0.75rem" }}
        />
      </Field>
      <Field label="Neighborhood">
        <select
          value={form.neighborhood}
          onChange={(e) => setForm({ ...form, neighborhood: e.target.value })}
          className="w-full bg-white/5 text-white px-4 py-3 outline-none border border-white/15 focus:border-white/40 transition"
          style={{ borderRadius: "0.75rem" }}
        >
          {[
            "Lance aux Épines",
            "True Blue",
            "Grand Anse",
            "Morne Rouge",
            "Frequente",
            "Westerhall",
            "Golf Course",
            "St. George's",
          ].map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>
      </Field>
      <Field label="Bedrooms">
        <input
          type="number"
          min={0}
          max={6}
          value={form.bedrooms}
          onChange={(e) => setForm({ ...form, bedrooms: +e.target.value })}
          className="w-full bg-white/5 text-white px-4 py-3 outline-none border border-white/15 focus:border-white/40"
          style={{ borderRadius: "0.75rem" }}
        />
      </Field>
      <Field label="Bathrooms">
        <input
          type="number"
          min={1}
          max={6}
          value={form.bathrooms}
          onChange={(e) => setForm({ ...form, bathrooms: +e.target.value })}
          className="w-full bg-white/5 text-white px-4 py-3 outline-none border border-white/15 focus:border-white/40"
          style={{ borderRadius: "0.75rem" }}
        />
      </Field>
      <Field label="Monthly rent (USD)">
        <input
          type="number"
          min={300}
          max={10000}
          step={25}
          value={form.monthly}
          onChange={(e) => setForm({ ...form, monthly: +e.target.value })}
          className="w-full bg-white/5 text-white px-4 py-3 outline-none border border-white/15 focus:border-white/40"
          style={{ borderRadius: "0.75rem" }}
        />
      </Field>
      <div className="flex items-center gap-3">
        <Toggle
          on={form.petsAllowed}
          set={(v) => setForm({ ...form, petsAllowed: v })}
          label="Pets allowed"
        />
        <Toggle
          on={form.generator}
          set={(v) => setForm({ ...form, generator: v })}
          label="Generator backup"
        />
      </div>
    </div>
  );
}

function StepLease({
  form,
  setForm,
}: {
  form: FormType;
  setForm: (f: FormType) => void;
}) {
  return (
    <div>
      <h3 className="font-heading text-white text-3xl tracking-[-1px] leading-none">
        Upload your standard lease
      </h3>
      <p className="mt-2 text-sm font-body font-light text-white/80 max-w-2xl">
        We run it through Lease DNA Scanner so students see exactly what they're
        signing. Your terms stay yours — we just translate the legalese.
      </p>
      <label
        htmlFor="landlord-lease"
        className="mt-5 block liquid-glass p-6 cursor-pointer text-center"
        style={{ borderRadius: "1.25rem", borderStyle: "dashed" }}
      >
        <p className="font-body text-white text-sm">
          {form.leaseFileName ? form.leaseFileName : "Drop your lease PDF or DOCX here"}
        </p>
        <p className="mt-1 text-xs font-body font-light text-white/60">
          or click to browse
        </p>
        <input
          id="landlord-lease"
          type="file"
          accept=".pdf,.docx,.txt"
          className="hidden"
          onChange={(e) =>
            setForm({ ...form, leaseFileName: e.target.files?.[0]?.name ?? "" })
          }
        />
      </label>
    </div>
  );
}

function StepInspection({
  form,
  setForm,
}: {
  form: FormType;
  setForm: (f: FormType) => void;
}) {
  return (
    <div>
      <h3 className="font-heading text-white text-3xl tracking-[-1px] leading-none">
        Schedule the inspection
      </h3>
      <p className="mt-2 text-sm font-body font-light text-white/80 max-w-2xl">
        45 minutes on-site. We photograph, test Wi-Fi, verify generator runtime,
        and walk through the unit. You don't need to be there — leave a key with
        your manager.
      </p>
      <Field label="Preferred date">
        <input
          type="date"
          value={form.inspectionDate}
          onChange={(e) => setForm({ ...form, inspectionDate: e.target.value })}
          className="w-full md:w-auto bg-white/5 text-white px-4 py-3 outline-none border border-white/15 focus:border-white/40 mt-3"
          style={{ borderRadius: "0.75rem" }}
        />
      </Field>
    </div>
  );
}

function StepReview({ form }: { form: FormType }) {
  return (
    <div>
      <h3 className="font-heading text-white text-3xl tracking-[-1px] leading-none">
        Review &amp; submit
      </h3>
      <ul className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-3 text-sm font-body text-white/90">
        <li className="liquid-glass p-3" style={{ borderRadius: "0.75rem" }}>
          {form.title || "Untitled property"}
        </li>
        <li className="liquid-glass p-3" style={{ borderRadius: "0.75rem" }}>
          {form.neighborhood}
        </li>
        <li className="liquid-glass p-3" style={{ borderRadius: "0.75rem" }}>
          {form.bedrooms} BR · {form.bathrooms} BA
        </li>
        <li className="liquid-glass p-3" style={{ borderRadius: "0.75rem" }}>
          ${form.monthly.toLocaleString()} / mo
        </li>
        <li className="liquid-glass p-3" style={{ borderRadius: "0.75rem" }}>
          Pets {form.petsAllowed ? "OK" : "no"} · Generator {form.generator ? "yes" : "no"}
        </li>
        <li className="liquid-glass p-3" style={{ borderRadius: "0.75rem" }}>
          Inspection: {form.inspectionDate || "not picked"}
        </li>
        <li
          className="md:col-span-2 liquid-glass p-3"
          style={{ borderRadius: "0.75rem" }}
        >
          Lease: {form.leaseFileName || "not uploaded"}
        </li>
      </ul>
      <p className="mt-5 text-[12px] font-body font-light text-white/65 leading-snug">
        On submit we'll route this to our verification team. You'll hear back
        within 24 hours with the inspection slot confirmation.
      </p>
    </div>
  );
}

function Toggle({
  on,
  set,
  label,
}: {
  on: boolean;
  set: (v: boolean) => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={() => set(!on)}
      className={`liquid-glass px-3 py-2 inline-flex items-center gap-2 text-xs font-body transition ${
        on ? "text-white" : "text-white/65"
      }`}
      style={{ borderRadius: "9999px" }}
    >
      <span
        className={`w-2.5 h-2.5 rounded-full transition ${
          on ? "bg-sealOrange" : "bg-white/30"
        }`}
      />
      {label}
    </button>
  );
}
