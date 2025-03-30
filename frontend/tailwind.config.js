/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      height: {
        header: "5rem",
      },
      minHeight: {
        header: "5rem",
      },
      width: {
        siteWidth: "1200px",
      },
      maxWidth: {
        siteWidth: "1200px",
      },
      inset: {
        header: "5rem",
      },
      backgroundImage: {
        constellation: "url('/endless-constellation.svg')",
      },
      fontFamily: {
        pressStart: "var(--font-press-start)",
        lato: "var(--font-lato)",
        openSans: "var(--font-open-sans)",
        merriweather: "var(--font-merriweather)",
      },
      screens: {
        lg2: "1200px",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      colors: {
        orange900: "#b36b00",
        orange800: "#d97d00",
        orange700: "#ec8600",
        orange600: "#ff9d00",
        orange500: "#ffb400",
        orange400: "#ffcb00",

        dark700: "#1c1c1c",
        dark600: "#222222",
        dark500: "#3e3e3e",
        dark400: "#6e6e6e",
        dark300: "#b0b0b0",
        dark200: "#d0d0d0",
        dark100: "#f0f0f0",

        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          1: "hsl(var(--chart-1))",
          2: "hsl(var(--chart-2))",
          3: "hsl(var(--chart-3))",
          4: "hsl(var(--chart-4))",
          5: "hsl(var(--chart-5))",
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
