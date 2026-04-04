/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./App.{js,jsx,ts,tsx}', './src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        primary: '#0F172A',
        secondary: '#1E293B',
        accent: '#E50914',
        background: '#020617',
        surface: '#0B1220',
        'text-primary': '#F8FAFC',
        'text-secondary': '#94A3B8',
        border: '#1F2937',
        success: '#22C55E',
        warning: '#F59E0B',
        error: '#EF4444',
      },
    },
  },
  plugins: [],
};
