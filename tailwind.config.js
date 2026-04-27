/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          '"SF Pro Display"',
          '"SF Pro Text"',
          '"Segoe UI"',
          'Roboto',
          'Helvetica',
          'Arial',
          'sans-serif',
          '"Apple Color Emoji"',
          '"Segoe UI Emoji"',
        ],
      },
      letterSpacing: {
        tightest: '-0.04em',
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      colors: {
        // Apple-like activity colors
        move: {
          DEFAULT: '#FA114F',
          from: '#FF375F',
          to: '#F62E5C',
        },
        exercise: {
          DEFAULT: '#92E82A',
          from: '#A6FF31',
          to: '#33F58A',
        },
        stand: {
          DEFAULT: '#1FD3D9',
          from: '#1FD3FF',
          to: '#00C7BE',
        },
        // App sections
        yoga: '#FF6E5C',
        dieta: '#34C759',
        peso: '#0A84FF',
        meta: '#AF52DE',
        racha: '#FF9F0A',
      },
      boxShadow: {
        soft: '0 1px 2px rgba(15,23,42,0.04), 0 8px 24px -10px rgba(15,23,42,0.10)',
        card: '0 1px 0 rgba(255,255,255,0.6) inset, 0 12px 32px -16px rgba(15,23,42,0.18)',
        glow: '0 12px 40px -12px rgba(13,148,136,0.55)',
        moveGlow: '0 12px 40px -10px rgba(250,17,79,0.45)',
      },
    },
  },
  plugins: [],
}
