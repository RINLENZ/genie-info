import type { Config } from "tailwindcss";

// Direction artistique « Editorial-Tech » — cf. docs/00-cadrage/03-design-system.md
const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#0e1a14",
        "ink-2": "#16241d",
        paper: "#f4f1ea",
        accent: "#c8ff4d",
        "accent-warm": "#e3a857",
        line: "rgba(255,255,255,0.14)",
        "line-dark": "rgba(14,26,20,0.14)",
        muted: "rgba(244,241,234,0.6)",
      },
      fontFamily: {
        display: ["var(--font-display)", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      maxWidth: {
        editorial: "1200px",
      },
    },
  },
  plugins: [],
};

export default config;
