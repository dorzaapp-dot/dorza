import type { Config } from "tailwindcss";

const forest = "#1E3328";
const pine = "#3F6B47";
const moss = "#5C8264";
const sage = "#8FA890";
const haze = "#D0DCCF";
const paper = "#FBFAF5";
const chalk = "#F3F0E8";
const stone = "#E5E0D2";
const linen = "#CFC8B6";
const claret = "#7C2E3B";
const ochre = "#C9A24A";
const ink = "#1B1A14";
const inkSoft = "#43403A";
const inkMute = "#807A6D";
const rule = "#BFB7A4";
const ruleSoft = "#DCD5C2";

const config: Config = {
  content: [
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        forest, pine, moss, sage, haze, paper, chalk, stone, linen, claret, ochre,
        ink: { DEFAULT: ink, soft: inkSoft, mute: inkMute },
        rule: { DEFAULT: rule, soft: ruleSoft },

        // Legacy aliases. Do not use in new code. They keep onboarding, admin,
        // upload and the client demos on-brand without touching those files.
        primary: { DEFAULT: pine, light: sage, dark: forest, tint: haze },
        accent: { DEFAULT: moss, light: sage, dark: pine, tint: haze },
        dark: forest,
        surface: stone,
        warm: paper,
        border: ruleSoft,
        "border-strong": rule,
        "text-primary": ink,
        "text-secondary": inkSoft,
        "text-muted": inkMute,
        status: pine,
      },
      fontFamily: {
        display: ["var(--font-display)", "Times New Roman", "serif"],
        body: ["var(--font-body)"],
        mono: ["var(--font-mono)"],
      },
      borderRadius: {
        card: "2px",
        chip: "3px",
        btn: "999px",
        sm: "2px",
      },
      boxShadow: {
        hair: "var(--shadow-hair)",
        card: "var(--shadow-card)",
        lift: "var(--shadow-lift)",
        modal: "var(--shadow-modal)",
        // Legacy aliases
        soft: "var(--shadow-hair)",
        medium: "var(--shadow-card)",
        glow: "none",
        "glow-sm": "none",
      },
      maxWidth: {
        layout: "1200px",
        text: "640px",
      },
      spacing: {
        "section-tight": "56px",
        section: "96px",
        "section-large": "128px",
      },
      transitionTimingFunction: {
        dorza: "cubic-bezier(0.23, 1, 0.32, 1)",
        "out-expo": "cubic-bezier(0.16, 1, 0.3, 1)",
        "out-quart": "cubic-bezier(0.25, 1, 0.5, 1)",
      },
      transitionDuration: {
        fast: "160ms",
        base: "280ms",
        slow: "480ms",
        reveal: "600ms",
      },
    },
  },
  plugins: [],
};

export default config;
