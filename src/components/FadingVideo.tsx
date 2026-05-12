import { useEffect, useRef } from "react";

const FADE_MS = 500;
const FADE_OUT_LEAD = 0.55;

type Props = {
  src: string;
  className?: string;
  style?: React.CSSProperties;
};

export default function FadingVideo({ src, className, style }: Props) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const fadingOutRef = useRef(false);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    v.style.opacity = "0";

    const fadeTo = (target: number, duration: number) => {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
      const start = performance.now();
      const from = parseFloat(v.style.opacity || "0") || 0;
      const tick = (now: number) => {
        const t = Math.min(1, (now - start) / duration);
        v.style.opacity = String(from + (target - from) * t);
        if (t < 1) {
          rafRef.current = requestAnimationFrame(tick);
        } else {
          rafRef.current = null;
        }
      };
      rafRef.current = requestAnimationFrame(tick);
    };

    const onLoaded = () => {
      v.style.opacity = "0";
      v.play().catch(() => {});
      fadeTo(1, FADE_MS);
    };
    const onTimeUpdate = () => {
      if (!fadingOutRef.current && v.duration) {
        const remaining = v.duration - v.currentTime;
        if (remaining <= FADE_OUT_LEAD && remaining > 0) {
          fadingOutRef.current = true;
          fadeTo(0, FADE_OUT_LEAD * 1000);
        }
      }
    };
    const onEnded = () => {
      v.style.opacity = "0";
      window.setTimeout(() => {
        try {
          v.currentTime = 0;
          v.play().catch(() => {});
          fadingOutRef.current = false;
          fadeTo(1, FADE_MS);
        } catch {}
      }, 100);
    };

    v.addEventListener("loadeddata", onLoaded);
    v.addEventListener("timeupdate", onTimeUpdate);
    v.addEventListener("ended", onEnded);

    return () => {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
      v.removeEventListener("loadeddata", onLoaded);
      v.removeEventListener("timeupdate", onTimeUpdate);
      v.removeEventListener("ended", onEnded);
    };
  }, [src]);

  return (
    <video
      ref={videoRef}
      src={src}
      autoPlay
      muted
      playsInline
      preload="auto"
      className={className}
      style={{ opacity: 0, ...style }}
    />
  );
}
