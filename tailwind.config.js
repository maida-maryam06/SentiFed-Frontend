/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx}", "./components/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        bg:       "#080812",
        surface:  "#0f0f1e",
        card:     "#13132a",
        border:   "#1e1e3f",
        purple:   "#a855f7",
        violet:   "#7c3aed",
        pink:     "#ec4899",
        cyan:     "#06b6d4",
        green:    "#10b981",
        red:      "#ef4444",
        amber:    "#f59e0b",
        muted:    "#64748b",
        text:     "#e2e8f0",
        subtle:   "#94a3b8",
      },
      fontFamily: {
        sans:  ["Inter", "sans-serif"],
        mono:  ["JetBrains Mono", "monospace"],
        display: ["Syne", "sans-serif"],
      },
      backgroundImage: {
        "glow-purple": "radial-gradient(ellipse at top left, #7c3aed22, transparent 60%)",
        "glow-pink":   "radial-gradient(ellipse at bottom right, #ec489922, transparent 60%)",
      },
      boxShadow: {
        "glow-sm": "0 0 20px #a855f730",
        "glow-md": "0 0 40px #a855f740",
      },
    },
  },
  plugins: [],
};
