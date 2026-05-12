import { useState } from "react";

type Props = {
  /** Mascot height in px. Wordmark scales with it. */
  size?: number;
  /** Hide the wordmark — useful for tight spaces (mobile, splash). */
  iconOnly?: boolean;
  /** Show the small "GRENADA · GD" subline beneath the wordmark. */
  withTagline?: boolean;
  className?: string;
};

/**
 * SealStay logotype:
 *   1. Mascot inside a soft orange glow ring (drop shadow + inset disc)
 *   2. Italic Instrument Serif wordmark — "Seal" white, "Stay" in seal-orange
 *   3. Hand-drawn Caribbean wave underline beneath the wordmark
 *   4. Optional letterspaced "GRENADA · GD" tagline
 */
export default function SealMark({
  size = 48,
  iconOnly = false,
  withTagline = false,
  className = "",
}: Props) {
  const [broken, setBroken] = useState(false);
  const wordSize = Math.round(size * 0.62);

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Mascot disc */}
      <div
        className="relative flex items-center justify-center shrink-0"
        style={{
          width: size,
          height: size,
          borderRadius: 9999,
          background:
            "radial-gradient(circle at 30% 30%, rgba(255,106,26,0.35), transparent 70%)",
        }}
      >
        {!broken ? (
          <img
            src="/seal-mascot.png"
            alt=""
            width={size}
            height={size}
            onError={() => setBroken(true)}
            style={{
              width: size,
              height: size,
              objectFit: "contain",
              filter:
                "drop-shadow(0 2px 4px rgba(0,0,0,0.5)) drop-shadow(0 0 12px rgba(255,106,26,0.18))",
            }}
          />
        ) : (
          <div
            className="liquid-glass rounded-full flex items-center justify-center"
            style={{ width: size, height: size }}
          >
            <span
              className="font-heading text-white leading-none select-none"
              style={{ fontSize: size * 0.6, marginTop: -2 }}
            >
              s
            </span>
          </div>
        )}
      </div>

      {!iconOnly && (
        <div className="flex flex-col leading-none">
          {/* Wordmark */}
          <div
            className="flex items-baseline whitespace-nowrap select-none"
            style={{ fontSize: wordSize, letterSpacing: "-0.02em" }}
          >
            <span
              className="font-heading text-white"
              style={{ fontStyle: "italic" }}
            >
              Seal
            </span>
            <span
              className="font-heading"
              style={{
                fontStyle: "italic",
                color: "#ff6a1a",
                marginLeft: "-0.02em",
              }}
            >
              Stay
            </span>
          </div>

          {/* Wave underline */}
          <svg
            width={wordSize * 4.6}
            height={wordSize * 0.32}
            viewBox="0 0 100 8"
            preserveAspectRatio="none"
            aria-hidden
            style={{ marginTop: 2, opacity: 0.85 }}
          >
            <path
              d="M0 4 Q 8 0, 16 4 T 32 4 T 48 4 T 64 4 T 80 4 T 96 4"
              stroke="#ff6a1a"
              strokeWidth="1.4"
              strokeLinecap="round"
              fill="none"
            />
          </svg>

          {withTagline && (
            <span
              className="font-body uppercase text-white/55 mt-1.5"
              style={{
                fontSize: Math.max(9, Math.round(wordSize * 0.28)),
                letterSpacing: "0.22em",
              }}
            >
              Grenada · GD
            </span>
          )}
        </div>
      )}
    </div>
  );
}
