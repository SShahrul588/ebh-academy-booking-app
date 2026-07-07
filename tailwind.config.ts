import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: { DEFAULT: "#061A3A", foreground: "#FFFFFF" },
        gold: { DEFAULT: "#D6A11F", light: "#F7C74D", dark: "#9B7418" },
        navy: { 50: "#EFF6FF", 100: "#DBEAFE", 500: "#143763", 700: "#061A3A", 900: "#020B1C" },
      },
      boxShadow: {
        premium: "0 28px 80px rgba(2, 11, 28, 0.18)",
        gold: "0 20px 50px rgba(214, 161, 31, 0.25)",
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.25rem",
        "3xl": "1.75rem",
      },
    },
  },
  plugins: [],
};

export default config;
