import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      fontFamily: {
        syne:  ["Syne", "sans-serif"],
        inter: ["Inter", "sans-serif"],
        mono:  ["JetBrains Mono", "monospace"],
      },
      colors: {
        bg:      "#07070f",
        panel:   "#0f0f1f",
        border:  "#1e1e3a",
        purple:  "#a855f7",
        violet:  "#7c3aed",
        muted:   "#94a3b8",
        surface: "rgba(168,85,247,0.06)",
      },
      boxShadow: {
        glass: "0 0 0 1px rgba(168,85,247,0.15), inset 0 1px 0 rgba(255,255,255,0.04)",
        glow:  "0 0 24px rgba(168,85,247,0.25)",
      },
    },
  },
  plugins: [],
};
export default config;
