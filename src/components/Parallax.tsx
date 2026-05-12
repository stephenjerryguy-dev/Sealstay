import { useScroll, useTransform, motion, type MotionValue } from "framer-motion";
import { useRef } from "react";

type ParallaxProps = {
  /** Pixels to translate at the top vs. bottom of the viewport. e.g. 80 means
   *  the layer travels 80px slower than the page on the way down. */
  amount?: number;
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
};

/**
 * Wraps content in a Framer Motion layer whose y-translation is bound to its
 * own viewport progress (igloo.com-style). When the section enters from the
 * bottom of the viewport, content is offset by +amount; as it scrolls past,
 * it eases to -amount.
 */
export function Parallax({ amount = 80, className, style, children }: ParallaxProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [amount, -amount]);

  return (
    <motion.div ref={ref} style={{ ...style, y }} className={className}>
      {children}
    </motion.div>
  );
}

/** Same hook but raw — for layers that need different transforms. */
export function useParallaxY(target: React.RefObject<HTMLElement>, amount = 80): MotionValue<number> {
  const { scrollYProgress } = useScroll({
    target,
    offset: ["start end", "end start"],
  });
  return useTransform(scrollYProgress, [0, 1], [amount, -amount]);
}
