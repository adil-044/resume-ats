import type { Config } from "tailwindcss";

/**
 * HireReady tokens — graphite / paper / copper.
 * Primary source of truth is `@theme` in globals.css (Tailwind v4).
 * This file stays aligned for plugins / tooling that still read config.
 */
const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-source)", "system-ui", "sans-serif"],
        display: ["var(--font-instrument)", "ui-serif", "Georgia", "serif"],
        mono: ["var(--font-jetbrains)", "monospace"],
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: {
          DEFAULT: "#C4A574",
          foreground: "#0C0C0B",
        },
        accent: {
          DEFAULT: "#C4A574",
          light: "#D4B88A",
          glow: "rgba(196, 165, 116, 0.2)",
        },
        signal: "#C4A574",
        paper: "#EDE6D9",
        "paper-ink": "#1A1814",
        cyan: "#8A9A8E",
        coral: "#C4785A",
        success: "#6B9B7A",
        danger: "#C45C5C",
        muted: "#A39E93",
        tertiary: "#6B675F",
        border: "#2A2824",
        "border-hover": "#3D3A34",
        "bg-base": "#0C0C0B",
        "bg-surface": "#161614",
        "bg-elevated": "#1E1C19",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
export default config;
