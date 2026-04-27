/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        phase1: '#a7f3d0',
        phase2: '#fcd34d',
        phase3: '#fb923c',
      },
    },
  },
  plugins: [],
}
