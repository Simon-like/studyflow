/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "../../packages/ui/src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          DEFAULT: "#FDF8F3",
          50: "#FFFCFA",
          100: "#FDF8F3",
          200: "#FAF1E7",
          300: "#F7EADB",
        },
        warm: {
          DEFAULT: "#FAF5F0",
          50: "#FEFDFC",
          100: "#FAF5F0",
          200: "#F5EDE4",
        },
        coral: {
          DEFAULT: "#E8A87C",
          50: "#FDF6F1",
          100: "#FAEBE0",
          200: "#F5D6C1",
          300: "#F0C1A2",
          400: "#EBAC83",
          500: "#E8A87C",
          600: "#D4956A",
          700: "#C08258",
          800: "#AB6F46",
          900: "#965C34",
        },
        sage: {
          DEFAULT: "#9DB5A0",
          50: "#F4F7F4",
          100: "#E9EFE9",
          200: "#D3DFD4",
          300: "#BDCFBE",
          400: "#A7C0A9",
          500: "#9DB5A0",
          600: "#7A9A7E",
          700: "#5F7F63",
          800: "#456448",
          900: "#2A492D",
        },
        charcoal: {
          DEFAULT: "#3D3D3D",
          50: "#F5F5F5",
          100: "#E8E8E8",
          200: "#D1D1D1",
          300: "#B4B4B4",
          400: "#969696",
          500: "#8A8A8A",
          600: "#6D6D6D",
          700: "#505050",
          800: "#3D3D3D",
          900: "#2A2A2A",
        },
        stone: {
          DEFAULT: "#8A8A8A",
          400: "#A8A8A8",
          500: "#8A8A8A",
          600: "#6B6B6B",
        },
        mist: {
          DEFAULT: "#C9C5C1",
          300: "#D9D5D1",
          400: "#C9C5C1",
          500: "#B9B5B1",
        },
      },
      fontFamily: {
        display: ["Outfit", "sans-serif"],
        body: ["Noto Sans SC", "sans-serif"],
      },
      borderRadius: {
        "2xl": "16px",
        "3xl": "24px",
      },
      boxShadow: {
        coral: "0 8px 24px rgba(232, 168, 124, 0.15)",
      },
      animation: {
        float: "float 3s ease-in-out infinite",
        "pulse-soft": "pulse-soft 2s ease-in-out infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
        "pulse-soft": {
          "0%, 100%": { opacity: "0.6" },
          "50%": { opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};
