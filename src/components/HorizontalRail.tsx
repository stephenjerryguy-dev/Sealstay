import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

type Props = {
  /** Track height — bigger = slower horizontal pan. Default 3vh per card. */
  trackVh?: number;
  className?: string;
  children: React.ReactNode;
  /** Optional sticky header rendered above the rail (does not scroll with it). */
  header?: React.ReactNode;
};

/**
 * Vertical scroll → horizontal pan ("scrolljacking" rail).
 * Outer section is tall (trackVh * 100 vh); inner is sticky to viewport and
 * the rail translates X based on scroll progress within the outer section.
 */
export default function HorizontalRail({
  trackVh = 3,
  className = "",
  header,
  children,
}: Props) {
  const ref = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  // Pan from 0 → -(rail width - viewport width). We don't know the rail width
  // at compile time, so use a CSS calc.
  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-66%"]);

  return (
    <section
      ref={ref}
      className={`relative w-screen ${className}`}
      style={{ height: `${trackVh * 100}vh` }}
    >
      <div className="sticky top-0 w-screen h-screen overflow-hidden flex flex-col">
        {header && <div className="px-8 md:px-16 lg:px-20 pt-32 pb-8">{header}</div>}
        <div className="flex-1 flex items-center">
          <motion.div
            style={{ x }}
            className="flex items-stretch gap-6 pl-8 md:pl-16 lg:pl-20 will-change-transform"
          >
            {children}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
