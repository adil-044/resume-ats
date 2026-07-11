import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-dm-sans)", "system-ui", "sans-serif"],
        display: ["var(--font-syne)", "system-ui", "sans-serif"],
        mono: ["var(--font-jetbrains)", "monospace"],
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        accent: {
          DEFAULT: "#7C3AED",
          light: "#9D6FFF",
          glow: "rgba(124, 58, 237, 0.25)",
        },
        cyan: "#22D3EE",
        coral: "#F97316",
        success: "#10B981",
        danger: "#EF4444",
        muted: "#9090A8",
        tertiary: "#52525E",
        border: "#1E1E30",
        "border-hover": "#2E2E48",
        "bg-base": "#0B0B12",
        "bg-surface": "#12121C",
        "bg-elevated": "#1C1C2A",
      },
    },
  },
  plugins: [
    require("@tailwindcss/typography"),
  ],
};
export default config;
