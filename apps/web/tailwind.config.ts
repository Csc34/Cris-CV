import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        page: "#f0f0ee",
        ink: "#141414",
        pill: "#e7e5e2",
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
        sans: ["var(--font-sans)", "sans-serif"],
      },
      backgroundImage: {
        stripes:
          "repeating-linear-gradient(135deg, rgba(0,0,0,0.035) 0px, rgba(0,0,0,0.035) 1px, transparent 1px, transparent 10px)",
      },
    },
  },
  plugins: [],
};

export default config;
