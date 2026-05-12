import PageShell from "../components/PageShell";

type Props = {
  kicker?: string;
  title: string;
  subtitle?: string;
};

// Lightweight placeholder for routes whose full content lands later in the
// rebuild. Keeps the URL structure intact and the cinematic shell visible.
export default function SimpleStub({ kicker, title, subtitle }: Props) {
  return (
    <PageShell kicker={kicker} title={title} subtitle={subtitle}>
      <div
        className="liquid-glass p-8 max-w-2xl"
        style={{ borderRadius: "1.5rem" }}
      >
        <p className="text-white/80 font-body font-light text-sm leading-snug">
          This page is on the build queue. The cinematic redesign is being rolled
          out section by section — the route is wired up, full content lands
          shortly.
        </p>
      </div>
    </PageShell>
  );
}
