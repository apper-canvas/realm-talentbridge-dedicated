/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
colors: {
        primary: '#EA580C',
        secondary: '#475569',
        accent: '#EA580C',
        surface: '#FFFFFF',
        background: '#F8FAFC',
success: '#10B981',
        warning: '#EA580C',
        error: '#EF4444',
        info: '#EA580C',
      },
      boxShadow: {
        'card': '0 2px 8px rgba(0,0,0,0.08)',
        'card-hover': '0 4px 16px rgba(0,0,0,0.12)',
      },
    },
  },
  plugins: [],
}