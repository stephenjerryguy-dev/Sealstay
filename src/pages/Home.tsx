import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { useRef } from "react";
import { ArrowUpRight, Play, Clock, Globe } from "lucide-react";
import { Link } from "react-router-dom";
import FadingVideo from "../components/FadingVideo";
import { LISTINGS } from "../data/listings";
import BlurText from "../components/BlurText";
import Navbar from "../components/Navbar";
import HorizontalRail from "../components/HorizontalRail";

const HERO_VIDEO =
  "https://videos.pexels.com/video-files/2169880/2169880-uhd_2560_1440_30fps.mp4";
const CAP_VIDEO =
  "https://videos.pexels.com/video-files/1409899/1409899-uhd_2560_1440_24fps.mp4";

const blur = (delay: number) => ({
  initial: { filter: "blur(10px)", opacity: 0, y: 20 },
  animate: { filter: "blur(0px)", opacity: 1, y: 0 },
  transition: { duration: 0.7, ease: "easeOut" as const, delay },
});

export default function Home() {
  return (
    <>
      <Hero />
      <RevealBand />
      <NeighborhoodsRail />
      <CapabilitiesStack />
      <Outro />
    </>
  );
}

/* -------------------------------------------------------------------------- */
/* Section 1: Pinned hero. Video zooms, headline disassembles, badge floats   */
/* away — all driven by a single scroll-progress value.                        */
/* -------------------------------------------------------------------------- */
function Hero() {
  const ref = useRef<HTMLElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  // Smooth scrub via spring
  const p = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 });

  // Background video: drift down + zoom in
  const videoY = useTransform(p, [0, 1], [0, 280]);
  const videoScale = useTransform(p, [0, 1], [1, 1.25]);
  const videoBlur = useTransform(p, [0, 1], ["blur(0px)", "blur(6px)"]);

  // Foreground content: drift up + fade
  const contentY = useTransform(p, [0, 1], [0, -120]);
  const contentOpacity = useTransform(p, [0, 0.55, 1], [1, 0.6, 0]);

  // Headline letter-spacing widens as you scroll past
  const letterSpacing = useTransform(p, [0, 1], ["-0.04em", "0.06em"]);
  const headlineScale = useTransform(p, [0, 1], [1, 1.08]);

  // Badge floats up faster than the rest
  const badgeY = useTransform(p, [0, 1], [0, -240]);
  const badgeOpacity = useTransform(p, [0, 0.4], [1, 0]);

  return (
    <section
      ref={ref}
      className="relative w-screen h-screen overflow-hidden bg-sealNavyDeep"
    >
      <motion.div
        className="absolute inset-0 z-0"
        style={{ y: videoY, scale: videoScale, filter: videoBlur }}
      >
        <FadingVideo
          src={HERO_VIDEO}
          className="absolute left-1/2 top-0 -translate-x-1/2 object-cover object-top"
          style={{ width: "120%", height: "120%" }}
        />
      </motion.div>

      <motion.div
        className="relative z-10 flex flex-col h-full"
        style={{ y: contentY, opacity: contentOpacity }}
      >
        <Navbar />

        <div className="flex-1 flex flex-col items-center justify-center pt-24 px-4 text-center">
          <motion.div
            {...blur(0.4)}
            style={{ y: badgeY, opacity: badgeOpacity }}
            className="liquid-glass rounded-full inline-flex items-center gap-2 pl-1 py-1 pr-3"
          >
            <span className="bg-sealOrange text-white rounded-full px-3 py-1 text-xs font-semibold font-body">
              New
            </span>
            <span className="text-sm text-white/90 font-body">
              Fall 2026 SGU intake — housing search open
            </span>
          </motion.div>

          <motion.div
            className="mt-6 max-w-2xl"
            style={{ scale: headlineScale, letterSpacing }}
          >
            <BlurText
              text="Find Your Stay in the Spice Isle"
              className="text-6xl md:text-7xl lg:text-[5.5rem] font-heading text-white leading-[0.8]"
            />
          </motion.div>

          <motion.p
            {...blur(0.8)}
            className="mt-4 text-sm md:text-base text-white max-w-2xl font-body font-light leading-tight"
          >
            Verified housing built around the SGU campus — every listing
            inspected, every lease decoded. Move from search to keys in hand
            without the guesswork that comes with a new island.
          </motion.p>

          <motion.div {...blur(1.1)} className="flex items-center gap-6 mt-6">
            <Link
              to="/listings"
              className="bg-sealOrange hover:bg-sealOrangeDeep transition-colors rounded-full px-5 py-2.5 text-sm font-medium font-body text-white inline-flex items-center gap-1.5"
            >
              Start Your Search
              <ArrowUpRight className="h-5 w-5" />
            </Link>
            <button
              type="button"
              className="text-white text-sm font-medium font-body inline-flex items-center gap-1.5"
            >
              Watch the Tour
              <Play className="h-4 w-4 fill-sealSky text-sealSky" />
            </button>
          </motion.div>

          <motion.div {...blur(1.3)} className="flex items-stretch gap-4 mt-8">
            <StatCard
              icon={<Clock className="w-7 h-7" />}
              value="4 Min"
              label="Walk to SGU from True Blue stays"
            />
            <StatCard
              icon={<Globe className="w-7 h-7" />}
              value={`${LISTINGS.length}`}
              label="Source-linked listings live now"
            />
          </motion.div>
        </div>

        <motion.div
          {...blur(1.4)}
          className="flex flex-col items-center gap-4 pb-8"
        >
          <span className="liquid-glass rounded-full px-3.5 py-1 text-xs font-medium font-body text-white">
            Built for the neighborhoods you'll actually live in
          </span>
        </motion.div>
      </motion.div>
    </section>
  );
}

function StatCard({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
}) {
  return (
    <div className="liquid-glass p-5 w-[220px] text-left" style={{ borderRadius: "1.25rem" }}>
      <div className="text-sealSky">{icon}</div>
      <div className="font-heading text-white text-4xl tracking-[-1px] leading-none mt-3">
        {value}
      </div>
      <div className="text-xs text-white font-body font-light mt-2">{label}</div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Section 2: Reveal band — a giant marquee word that slides opposite to      */
/* scroll, with mask-reveal of a second-level headline beneath it.            */
/* -------------------------------------------------------------------------- */
function RevealBand() {
  const ref = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  // Top word slides left, bottom word slides right (opposite directions)
  const xLeft = useTransform(scrollYProgress, [0, 1], ["20%", "-40%"]);
  const xRight = useTransform(scrollYProgress, [0, 1], ["-40%", "20%"]);
  // Finish the statement reveal near mid-scroll so it lands with the parallax,
  // instead of waiting until the section is almost gone.
  const reveal = useTransform(scrollYProgress, [0.12, 0.52], ["0%", "100%"]);
  const subOpacity = useTransform(scrollYProgress, [0.26, 0.5], [0, 1]);

  return (
    <section
      ref={ref}
      className="relative w-screen min-h-[80vh] overflow-hidden flex flex-col justify-center py-32"
    >
      <motion.div
        style={{ x: xLeft }}
        className="font-heading italic text-white/95 text-[18vw] leading-[0.85] tracking-[-0.04em] whitespace-nowrap will-change-transform"
      >
        an island
      </motion.div>
      <motion.div
        style={{ x: xRight }}
        className="font-heading italic text-sealSky/40 text-[18vw] leading-[0.85] tracking-[-0.04em] whitespace-nowrap will-change-transform mt-[-2vw]"
      >
        worth staying for
      </motion.div>

      <div className="px-8 md:px-16 lg:px-20 mt-16 max-w-3xl">
        <p className="text-sm font-body text-sealSky/80 mb-3">// What we built</p>
        <div className="relative">
          <motion.p
            className="text-2xl md:text-3xl font-body font-light text-white/90 leading-snug"
            style={{ clipPath: useTransform(reveal, (v) => `inset(0 calc(100% - ${v}) 0 0)`) }}
          >
            We came to Grenada to study. We stayed because the island earns it
            every day. SealStay is the housing layer underneath that
            — built by students, for students, with the people who live here.
          </motion.p>
        </div>
        <motion.p
          className="mt-6 text-sm font-body text-white/70"
          style={{ opacity: subOpacity }}
        >
          (You're already here. The hard part was finding a real bed.)
        </motion.p>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* Section 3: Horizontal rail — neighborhoods scroll sideways while the page  */
/* scrolls vertically. Each card has its own internal parallax photo.         */
/* -------------------------------------------------------------------------- */
function NeighborhoodsRail() {
  const hoods = [
    {
      name: "True Blue",
      walk: "4 min walk to SGU",
      copy: "Right next to campus. Where most first-years end up.",
      img: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1400&q=70",
    },
    {
      name: "Lance aux Épines",
      walk: "8 min from campus",
      copy: "Quieter, calmer, with the island's best beach club walks.",
      img: "https://images.unsplash.com/photo-1519046904884-53103b34b206?w=1400&q=70",
    },
    {
      name: "Grand Anse",
      walk: "14 min · 2 mi of beach",
      copy: "If you're going to live on a Caribbean island, do it properly.",
      img: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1400&q=70",
    },
    {
      name: "St. George's",
      walk: "20 min · into town",
      copy: "Capital. Markets. Boats. Drive in for groceries, a swim, a cocktail.",
      img: "https://images.unsplash.com/photo-1504806243650-43c1cc7d31fe?w=1400&q=70",
    },
  ];

  return (
    <HorizontalRail
      trackVh={3.5}
      header={
        <div className="max-w-3xl">
          <p className="text-sm font-body text-sealSky/80 mb-4">
            // Neighborhoods
          </p>
          <h2 className="font-heading text-white text-5xl md:text-6xl lg:text-7xl leading-[0.9] tracking-[-2px]">
            Where you'll
            <br />
            actually live
          </h2>
        </div>
      }
    >
      {hoods.map((h) => (
        <RailCard key={h.name} {...h} />
      ))}
      {/* trailing spacer so last card can rest mid-screen */}
      <div className="shrink-0 w-[40vw]" aria-hidden />
    </HorizontalRail>
  );
}

function RailCard({
  name,
  walk,
  copy,
  img,
}: {
  name: string;
  walk: string;
  copy: string;
  img: string;
}) {
  // Photo has its own subtle scale-on-hover; layout is the rail itself.
  return (
    <div
      className="liquid-glass shrink-0 w-[64vw] md:w-[44vw] lg:w-[36vw] overflow-hidden flex flex-col"
      style={{ borderRadius: "1.5rem", height: "60vh" }}
    >
      <div className="relative flex-1 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-700 hover:scale-[1.06]"
          style={{ backgroundImage: `url(${img})` }}
        />
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/80 to-transparent" />
      </div>
      <div className="p-6">
        <div className="flex items-baseline justify-between gap-3">
          <h3 className="font-heading text-white text-4xl tracking-[-1px] leading-none">
            {name}
          </h3>
          <span className="text-xs font-body font-medium text-sealSky whitespace-nowrap">
            {walk}
          </span>
        </div>
        <p className="mt-3 text-sm text-white/85 font-body font-light leading-snug max-w-[36ch]">
          {copy}
        </p>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Section 4: Capabilities — sticky-stacked cards. Scroll one card-height,    */
/* the next one slides up over the previous. Last one stays pinned.           */
/* -------------------------------------------------------------------------- */
function CapabilitiesStack() {
  const ref = useRef<HTMLElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const videoY = useTransform(scrollYProgress, [0, 1], [-100, 100]);

  const cards = [
    {
      eyebrow: "01",
      icon: ShieldIcon,
      accent: "text-sealGreen",
      title: "SealShield",
      tags: ["Inspected", "Insured", "Lease Vetted", "Refund Backed"],
      body: "Every listing is physically inspected and lease-reviewed before it goes live. If a verified property misrepresents itself, your deposit is refunded.",
    },
    {
      eyebrow: "02",
      icon: SparklesIcon,
      accent: "text-sealViolet",
      title: "Lease DNA Scanner",
      tags: ["Plain English", "Risk Flags", "Redline Draft", "Free"],
      body: "Drop your lease in. Our AI translates the legalese into plain English, flags clauses that hurt students, and drafts the redline back to your landlord.",
    },
    {
      eyebrow: "03",
      icon: BoltIcon,
      accent: "text-sealSky",
      title: "SealScore",
      tags: ["Walkability", "Generator", "Hurricane", "Wi-Fi Speed"],
      body: "Each property gets scored on walk to SGU, generator backup, hurricane history, and student-life fit — so the photo isn't the only thing telling the story.",
    },
  ];

  return (
    <section ref={ref} className="relative w-screen bg-sealNavyDeep">
      {/* Background video that pans through the stack */}
      <motion.div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{ y: videoY }}
      >
        <FadingVideo
          src={CAP_VIDEO}
          className="absolute inset-0 w-full h-full object-cover"
        />
      </motion.div>
      <div className="absolute inset-0 z-[1] bg-gradient-to-b from-black/40 via-black/20 to-black/70" />

      <div className="relative z-10 px-8 md:px-16 lg:px-20 pt-32">
        <p className="text-sm font-body text-sealSky/80 mb-4">// Capabilities</p>
        <h2 className="font-heading text-white text-6xl md:text-7xl lg:text-[6rem] leading-[0.9] tracking-[-3px] max-w-4xl">
          Housing
          <br />
          decoded
        </h2>
      </div>

      {/* sticky stack */}
      <div className="relative z-10 mt-16">
        {cards.map((c, i) => (
          <StickyCard key={c.title} index={i} total={cards.length} {...c} />
        ))}
      </div>

      <div className="h-[40vh]" aria-hidden />
    </section>
  );
}

function StickyCard({
  index,
  total,
  eyebrow,
  icon: Icon,
  accent,
  title,
  tags,
  body,
}: {
  index: number;
  total: number;
  eyebrow: string;
  icon: React.ComponentType<{ className?: string }>;
  accent: string;
  title: string;
  tags: string[];
  body: string;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end end"],
  });
  // Tiny scale-down as you scroll past, so cards don't look stamped on top
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1 - (total - 1 - index) * 0.02]);
  const opacity = useTransform(scrollYProgress, [0, 0.6, 1], [0.7, 1, 1]);
  const rotate = useTransform(scrollYProgress, [0, 1], [index % 2 ? -1.2 : 1.2, 0]);

  return (
    <div
      ref={ref}
      className="sticky px-8 md:px-16 lg:px-20"
      style={{ top: `${80 + index * 24}px`, paddingBottom: "30vh" }}
    >
      <motion.div
        className="liquid-glass-strong p-8 md:p-12 mx-auto max-w-5xl"
        style={{ borderRadius: "2rem", scale, opacity, rotate }}
      >
        <div className="flex items-start justify-between gap-6 flex-wrap">
          <div className="flex items-center gap-4">
            <div
              className="liquid-glass flex items-center justify-center"
              style={{ width: 56, height: 56, borderRadius: "1rem" }}
            >
              <Icon className={`h-7 w-7 ${accent}`} />
            </div>
            <div className="font-heading italic text-sealOrange/60 text-3xl tracking-[-1px] leading-none">
              {eyebrow}
            </div>
          </div>
          <div className="flex flex-wrap gap-1.5 max-w-[60%] justify-end">
            {tags.map((t) => (
              <span
                key={t}
                className="liquid-glass rounded-full px-3 py-1 text-[11px] text-white/90 font-body whitespace-nowrap"
              >
                {t}
              </span>
            ))}
          </div>
        </div>
        <h3 className="mt-8 font-heading text-white text-5xl md:text-6xl lg:text-7xl tracking-[-2px] leading-[0.9]">
          {title}
        </h3>
        <p className="mt-5 text-base md:text-lg text-white/90 font-body font-light leading-snug max-w-[52ch]">
          {body}
        </p>
      </motion.div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Section 5: Outro CTA                                                       */
/* -------------------------------------------------------------------------- */
function Outro() {
  const ref = useRef<HTMLElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [80, -80]);
  const scale = useTransform(scrollYProgress, [0, 1], [0.95, 1.05]);

  return (
    <section
      ref={ref}
      className="relative w-screen min-h-[80vh] overflow-hidden flex items-center justify-center px-8"
    >
      <motion.div className="text-center max-w-3xl" style={{ y, scale }}>
        <p className="text-sm font-body text-sealSky/80 mb-6">// Ready</p>
        <h2 className="font-heading italic text-white text-6xl md:text-7xl lg:text-[7rem] leading-[0.85] tracking-[-3px]">
          your stay,
          <br />
          <span className="text-sealSky">waiting</span>
        </h2>
        <div className="mt-10 flex items-center justify-center gap-4 flex-wrap">
          <Link
            to="/listings"
            className="bg-sealOrange hover:bg-sealOrangeDeep transition-colors rounded-full px-6 py-3 text-base font-medium font-body text-white inline-flex items-center gap-2"
          >
            Browse listings
            <ArrowUpRight className="h-5 w-5" />
          </Link>
          <Link
            to="/lease-dna-scanner"
            className="text-base font-body text-sealSky hover:text-white transition-colors"
          >
            Try the Lease DNA Scanner →
          </Link>
        </div>
      </motion.div>
    </section>
  );
}

/* Inline material-style icons */
function ShieldIcon({ className = "" }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 1 3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4Zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8Z" />
    </svg>
  );
}
function SparklesIcon({ className = "" }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="m12 2 1.91 5.59L19.5 9.5l-5.59 1.91L12 17l-1.91-5.59L4.5 9.5l5.59-1.91L12 2Zm6 12 1.05 3.07L22.13 18l-3.08 1.05L18 22.13l-1.05-3.08L13.87 18l3.08-.93L18 14ZM6 14l1.05 3.07L10.13 18l-3.08 1.05L6 22.13l-1.05-3.08L1.87 18l3.08-.93L6 14Z" />
    </svg>
  );
}
function BoltIcon({ className = "" }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M11 21h-1l1-7H7.5c-.88 0-.32-.75-.3-.78C8.48 10.94 10.42 7.54 13.01 3h1l-1 7h3.5c.4 0 .62.19.4.66C12.97 17.55 11 21 11 21Z" />
    </svg>
  );
}
