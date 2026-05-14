/** @type {import('tailwindcss').Config} */
import { generateTailwindConfig } from '@studyflow/theme/adapters';

const themeConfig = generateTailwindConfig();

export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      ...themeConfig.theme.extend,
      boxShadow: {
        ...themeConfig.theme.extend.boxShadow,
        coral: '0 8px 24px rgba(232, 168, 124, 0.15)',
        soft: '0 2px 8px rgba(0, 0, 0, 0.05)',
        glass: '0 8px 32px rgba(0, 0, 0, 0.08)',
        mockup: '0 20px 60px rgba(0, 0, 0, 0.12)',
      },
      animation: {
        'fade-in': 'fade-in 0.6s ease-out forwards',
        'slide-up': 'slide-up 0.6s ease-out forwards',
        'slide-in-left': 'slide-in-left 0.6s ease-out forwards',
        'slide-in-right': 'slide-in-right 0.6s ease-out forwards',
        float: 'float 3s ease-in-out infinite',
      },
      keyframes: {
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        'slide-up': {
          from: { opacity: '0', transform: 'translateY(24px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-in-left': {
          from: { opacity: '0', transform: 'translateX(-24px)' },
          to: { opacity: '1', transform: 'translateX(0)' },
        },
        'slide-in-right': {
          from: { opacity: '0', transform: 'translateX(24px)' },
          to: { opacity: '1', transform: 'translateX(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
      },
    },
  },
  plugins: [],
}
