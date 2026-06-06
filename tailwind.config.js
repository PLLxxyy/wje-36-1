/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'dashboard-bg': '#0b1120',
        'panel-bg': '#111827',
        'accent': '#3b82f6',
        'success': '#10b981',
        'warning': '#f59e0b',
        'danger': '#ef4444',
      },
      animation: {
        'flash-red': 'flashRed 1s ease-in-out infinite',
      },
      keyframes: {
        flashRed: {
          '0%, 100%': { backgroundColor: '#7f1d1d' },
          '50%': { backgroundColor: '#ef4444' },
        },
      },
    },
  },
  plugins: [],
}
