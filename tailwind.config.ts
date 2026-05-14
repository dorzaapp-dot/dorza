import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#D4845A",
          light: "#E8A87C",
          dark: "#B8673F",
          tint: "#FBEDE3",
        },
        accent: {
          DEFAULT: "#6B8F71",
          light: "#A4C2A8",
          dark: "#4A6B4E",
          tint: "#E8EFE9",
        },
        dark: "#1A1A2E",
        surface: "#F9F7F5",
        warm: "#FDFAF7",
        border: "#F0EBE4",
        "border-strong": "#E5DFD6",
        "text-primary": "#1A1A2E",
        "text-secondary": "#555555",
        "text-muted": "#888888",
        status: "#24CB71",
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        body: ["var(--font-body)", "system-ui", "sans-serif"],
        mono: [
          "ui-monospace",
          "Cascadia Code",
          "Source Code Pro",
          "Menlo",
          "Consolas",
          "DejaVu Sans Mono",
          "monospace",
        ],
      },
      borderRadius: {
        card: "20px",
        btn: "999px",
        sm: "8px",
      },
      boxShadow: {
        soft: "0 1px 0 rgba(26, 26, 46, 0.06)",
        medium: "0 12px 32px rgba(26, 26, 46, 0.08)",
        card: "0 12px 32px rgba(26, 26, 46, 0.08)",
      },
      maxWidth: {
        layout: "1200px",
      },
      transitionTimingFunction: {
        "out-expo": "cubic-bezier(0.16, 1, 0.3, 1)",
        "out-quart": "cubic-bezier(0.25, 1, 0.5, 1)",
        dorza: "cubic-bezier(0.23, 1, 0.32, 1)",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-4px)" },
        },
        "marquee-scroll": {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        "pulse-ring": {
          "0%": { boxShadow: "0 0 0 0px rgba(212, 132, 90, 0.4)" },
          "100%": { boxShadow: "0 0 0 8px rgba(212, 132, 90, 0)" },
        },
        "bounce-gentle": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(8px)" },
        },
        breathe: {
          "0%, 100%": { transform: "scale(1)", opacity: "0.6" },
          "50%": { transform: "scale(1.02)", opacity: "1" },
        },
        "pulse-subtle": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.7" },
        },
      },
      animation: {
        float: "float 8s ease-in-out infinite",
        "float-delay-1": "float 7s ease-in-out 1s infinite",
        "float-delay-2": "float 9s ease-in-out 2s infinite",
        "float-delay-3": "float 6s ease-in-out 0.5s infinite",
        "float-delay-4": "float 8s ease-in-out 3s infinite",
        "float-delay-5": "float 7s ease-in-out 1.5s infinite",
        "marquee-scroll": "marquee-scroll 40s linear infinite",
        marquee: "marquee 30s linear infinite",
        "pulse-ring": "pulse-ring 0.8s ease-out forwards",
        "bounce-gentle": "bounce-gentle 2s ease-in-out infinite",
        breathe: "breathe 4s ease-in-out infinite",
        "pulse-subtle": "pulse-subtle 2s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
export default config;
