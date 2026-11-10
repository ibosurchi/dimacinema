/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: "#0B0B0F",
        surface: "#14141B",
        "surface-light": "#1A1A24",
        "surface-hover": "#222230",
        border: "rgba(255, 255, 255, 0.08)",
        "border-light": "rgba(255, 255, 255, 0.14)",
        primary: {
          DEFAULT: "#7C3AED",
          hover: "#8B50F5",
          dark: "#6D28D9",
          glow: "rgba(124, 58, 237, 0.35)",
        },
        accent: {
          DEFAULT: "#F5B544",
          hover: "#FBBF24",
          glow: "rgba(245, 181, 68, 0.35)",
        },
        text: {
          primary: "#F4F4F6",
          muted: "#9A9AA8",
          dim: "#6B6B7C",
        },
      },
      fontFamily: {
        vazir: ["var(--font-vazirmatn)", "Vazirmatn", "Noto Sans Arabic", "Tahoma", "sans-serif"],
      },
      borderRadius: {
        poster: "14px",
        btn: "12px",
      },
      aspectRatio: {
        poster: "2 / 3",
        video: "16 / 9",
      },
      boxShadow: {
        "purple-glow": "0 0 25px -5px rgba(124, 58, 237, 0.4)",
        "gold-glow": "0 0 25px -5px rgba(245, 181, 68, 0.4)",
        card: "0 10px 30px -10px rgba(0, 0, 0, 0.7)",
      },
    },
  },
  plugins: [],
};
