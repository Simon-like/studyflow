/** @type {import('tailwindcss').Config} */
import { generateTailwindConfig } from '@studyflow/theme/adapters';

const themeConfig = generateTailwindConfig();

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      ...themeConfig.theme.extend,
      // Web 特定的扩展
      boxShadow: {
        ...themeConfig.theme.extend.boxShadow,
        coral: "0 8px 24px rgba(232, 168, 124, 0.15)",
        soft: "0 2px 8px rgba(0, 0, 0, 0.05)",
        medium: "0 4px 16px rgba(0, 0, 0, 0.1)",
        strong: "0 8px 24px rgba(0, 0, 0, 0.15)",
      },
      animation: {
        float: "float 3s ease-in-out infinite",
        "pulse-soft": "pulse-soft 2s ease-in-out infinite",
        "slide-up": "slide-up 0.6s ease-out forwards",
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
        "slide-up": {
          "from": { opacity: "0", transform: "translateY(20px)" },
          "to": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};
