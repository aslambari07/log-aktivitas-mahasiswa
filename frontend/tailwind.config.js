/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#2563eb",
        secondary: "#7c3aed",
        background: "#f8f9ff",
        surface: "#ffffff",
        surfaceAlt: "#eff4ff",
        outline: "#c3c6d7",
        textMain: "#0b1c30",
        textSoft: "#667085",
        darkBg: "#07111f",
        darkPanel: "#0f1d31",
        darkSoft: "#8ea3c7",
      },
      boxShadow: {
        glass: "0 20px 45px -22px rgba(37, 99, 235, 0.35)",
      },
      backdropBlur: {
        xl2: "24px",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
      animation: {
        floatIn: "floatIn 0.55s ease-out both",
        pulseSoft: "pulseSoft 1.6s ease-in-out infinite",
      },
      keyframes: {
        floatIn: {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        pulseSoft: {
          "0%, 100%": { opacity: "0.55" },
          "50%": { opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};
