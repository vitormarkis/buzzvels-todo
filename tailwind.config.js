/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: "jit",
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    colors: {
      black: "rgba(var(--black) / <alpha-value>)",
      white: "rgba(var(--white) / <alpha-value>)",
      transparent: "transparent",
      background: {
        DEFAULT: "rgba(var(--background) / <alpha-value>)",
        shadow: "rgba(var(--background-shadow) / <alpha-value>)",
      },
      color: {
        DEFAULT: "rgba(var(--color) / <alpha-value>)",
        soft: "rgba(var(--color-soft) / <alpha-value>)",
        strong: "rgba(var(--color-strong) / <alpha-value>)",
      },
      heading: {
        DEFAULT: "rgba(var(--heading) / <alpha-value>)",
        soft: "rgba(var(--heading-soft) / <alpha-value>)",
        sub: "rgba(var(--heading-sub) / <alpha-value>)",
      },
      ring: {
        DEFAULT: "rgba(var(--ring) / <alpha-value>)",
      },
      symbol: {
        DEFAULT: "rgba(var(--symbol) / <alpha-value>)",
      },
      accent: {
        DEFAULT: "rgba(var(--accent) / <alpha-value>)",
        soft: "rgba(var(--accent-soft) / <alpha-value>)",
        strong: "rgba(var(--accent-strong) / <alpha-value>)",
      },
      block: {
        DEFAULT: "rgba(var(--block) / <alpha-value>)",
        soft: "rgba(var(--block-soft) / <alpha-value>)",
        strong: "rgba(var(--block-strong) / <alpha-value>)",
      },
      special: {
        back: {
          DEFAULT: "rgba(var(--special-back) / <alpha-value>)",
          weak: "rgba(var(--special-back-weak) / <alpha-value>)",
          soft: "rgba(var(--special-back-soft) / <alpha-value>)",
          strong: "rgba(var(--special-back-strong) / <alpha-value>)",
          bold: "rgba(var(--special-back-bold) / <alpha-value>)",
        },
        fore: {
          DEFAULT: "rgba(var(--special-fore) / <alpha-value>)",
          weak: "rgba(var(--special-fore-weak) / <alpha-value>)",
          soft: "rgba(var(--special-fore-soft) / <alpha-value>)",
          strong: "rgba(var(--special-fore-strong) / <alpha-value>)",
          bold: "rgba(var(--special-fore-bold) / <alpha-value>)",
        },
      },
    },
    extend: {
      screens: {
        xs: "480px",
        // => @media (min-width: 480px) { ... }
      },
      fontFamily: {
        poppins: ["Poppins", "Inter", "sans-serif"],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
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
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
