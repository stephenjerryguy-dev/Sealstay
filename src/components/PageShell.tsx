import Navbar from "./Navbar";
import FadingVideo from "./FadingVideo";

const AMBIENT_VIDEO =
  "https://videos.pexels.com/video-files/1409899/1409899-uhd_2560_1440_24fps.mp4";

type Props = {
  kicker?: string;
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
};

// Reusable page chrome for non-Home routes — same cinematic backdrop, navbar,
// liquid-glass kicker + serif headline, then page content beneath.
export default function PageShell({ kicker, title, subtitle, children }: Props) {
  return (
    <section className="relative w-screen min-h-screen overflow-hidden bg-sealNavyDeep">
      <FadingVideo
        src={AMBIENT_VIDEO}
        className="absolute inset-0 w-full h-full object-cover z-0"
        style={{ opacity: 0 }}
      />
      {/* Subtle vignette for content legibility — keeps the cinematic look */}
      <div className="absolute inset-0 z-[1] bg-sealNavyDeep/35" aria-hidden />

      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar />

        <header className="px-8 md:px-16 lg:px-20 pt-32 pb-10">
          {kicker && (
            <p className="text-sm font-body text-white/80 mb-4">// {kicker}</p>
          )}
          <h1 className="font-heading text-white text-5xl md:text-6xl lg:text-7xl leading-[0.9] tracking-[-2px] max-w-4xl">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-5 max-w-2xl text-white/90 font-body font-light text-base md:text-lg leading-snug">
              {subtitle}
            </p>
          )}
        </header>

        <div className="flex-1 px-8 md:px-16 lg:px-20 pb-24">{children}</div>
      </div>
    </section>
  );
}
