import { motion, useScroll, useTransform } from "framer-motion";

type Layer = {
  /** Element to render. Receives the scroll progress 0..1. */
  render: (p: number) => React.ReactNode;
};

type Props = {
  /** How tall the scroll track is, in viewport heights. 3 = pinned for ~3 screens. */
  vh?: number;
  className?: string;
  children: React.ReactNode;
  /** Optional: render extra layered content tied to overall progress. */
  layers?: Layer[];
};

/**
 * A scroll-pinned section. Outer wrapper is N viewport-heights tall; an inner
 * `position: sticky` container fills the viewport and stays pinned while the
 * outer scrolls past. Children get a `data-progress` attribute updated to the
 * scrub progress (0..1) for inline animations, but typically you'll pass
 * Framer Motion children that bind to useScroll directly.
 */
export default function PinnedScrub({
  vh = 3,
  className = "",
  children,
}: Props) {
  return (
    <section
      className={`relative w-screen ${className}`}
      style={{ height: `${vh * 100}vh` }}
    >
      <div className="sticky top-0 w-screen h-screen overflow-hidden">
        {children}
      </div>
    </section>
  );
}

/** Convenience: read progress for a section as 0..1 across its full traversal. */
export function useSectionProgress(ref: React.RefObject<HTMLElement | null>) {
  return useScroll({
    target: ref,
    offset: ["start start", "end end"],
  }).scrollYProgress;
}

/** Wrap children with translateY tied to scrollYProgress mapping. */
export function ScrubY({
  progress,
  from,
  to,
  className,
  style,
  children,
}: {
  progress: ReturnType<typeof useScroll>["scrollYProgress"];
  from: number;
  to: number;
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
}) {
  const y = useTransform(progress, [0, 1], [from, to]);
  return (
    <motion.div className={className} style={{ ...style, y }}>
      {children}
    </motion.div>
  );
}
