/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        heading: ['"Instrument Serif"', "serif"],
        body: ['"Barlow"', "sans-serif"],
      },
      borderRadius: {
        DEFAULT: "9999px",
      },
      colors: {
        // Brand palette (matches the seal mascot)
        sealOrange: "#ff6a1a",     // shirt
        sealOrangeDeep: "#e15410", // hover / pressed
        // Teal-navy base (original sigma palette) — warmer than pitch black
        sealNavy: "#0f1a26",        // base background
        sealNavyDeep: "#0a1520",    // deeper recess (modals, footers)
        sealNavyLight: "#1e3a4f",   // raised surfaces
        sealGray: "#9ba3b3",        // body text on dark
        sealGrayDim: "#5a6478",     // muted/secondary
        sealCharcoal: "#22384d",    // hairline borders, dividers
        // Sigma accents
        sealSky: "#38bdf8",         // primary accent — links, eyebrows, icons
        sealSkyDeep: "#0369a1",     // pressed / dark sky
        sealGreen: "#22c55e",       // verified / Seal Approved
        sealAmber: "#f59e0b",       // ratings, warnings
        sealViolet: "#8b5cf6",      // AI / Lease DNA features
        sealTeal: "#14b8a6",        // secondary feature accent
      },
    },
  },
  plugins: [],
};
