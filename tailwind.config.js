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
        sealNavy: "#0a1426",        // base background — replaces pure black
        sealNavyDeep: "#050a14",    // deeper recess (modals, footers)
        sealNavyLight: "#0f1c33",   // raised surfaces
        sealGray: "#9ba3b3",        // body text on dark
        sealGrayDim: "#5a6478",     // muted/secondary
        sealCharcoal: "#1a2235",    // hairline borders, dividers
      },
    },
  },
  plugins: [],
};
