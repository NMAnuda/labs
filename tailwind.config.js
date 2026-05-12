/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0a1018",
        primary: "#f5f7fb",
        secondary: "#dbe3f1",
        tertiary: "#7d8ca6",
        accent: {
          slate: "#c7d1e0",
          steel: "#5d6c84",
          ink: "#0e141f",
        },
        surface: {
          DEFAULT: "rgba(12,18,28,0.58)",
          hover: "rgba(20,27,40,0.7)",
        },
      },
      fontFamily: {
        headline: ["Sora", "Instrument Sans", "sans-serif"],
        body: ["Instrument Sans", "SF Pro Text", "Segoe UI", "sans-serif"],
      },
      boxShadow: {
        'glow-cyan': '0 0 30px rgba(0,212,255,0.3)',
        'glow-blue': '0 0 30px rgba(0,102,255,0.3)',
        'glow-purple': '0 0 30px rgba(136,85,255,0.3)',
      },
    },
  },
  plugins: [],
}
