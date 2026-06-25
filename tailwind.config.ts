import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // AgroTech palette
        "agro-olive": "#7BA05B",
        "agro-green": "#8FBF6B",
        "agro-beige": "#F5E6CC",
        "agro-sand": "#EADBC8",
        "agro-white": "#FAFAF7",
        "agro-pastel": "#DDECCF",
        "agro-yellow": "#F4D35E",
        "primary-light": "#8FBF6B",
      },
      borderColor: {
        DEFAULT: "hsl(var(--border))",
      },
      borderRadius: {
        sm: "0.25rem",
        md: "0.375rem",
        lg: "var(--radius)",
        xl: "0.75rem",
        "2xl": "1rem",
        "3xl": "1.5rem",
        full: "9999px",
      },
      boxShadow: {
        sm: "0 1px 2px 0 rgba(123, 160, 91, 0.08)",
        md: "0 4px 12px -1px rgba(123, 160, 91, 0.12), 0 2px 6px -1px rgba(0,0,0,0.04)",
        lg: "0 10px 24px -3px rgba(123, 160, 91, 0.15), 0 4px 8px -2px rgba(0,0,0,0.06)",
        xl: "0 20px 40px -5px rgba(123, 160, 91, 0.18), 0 10px 12px -5px rgba(0,0,0,0.06)",
        card: "0 2px 8px 0 rgba(123, 160, 91, 0.10)",
        "card-hover": "0 8px 24px 0 rgba(123, 160, 91, 0.20)",
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["Poppins", "Inter", "ui-sans-serif", "sans-serif"],
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-out",
        "slide-up": "slideUp 0.4s ease-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [animate],
};

export default config;
