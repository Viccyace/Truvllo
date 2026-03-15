/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        cream:   '#FAF8F3',
        'cream-dark': '#F0EDE4',
        forest:  '#2D6A4F',
        'forest-light': '#40916C',
        'forest-dark':  '#1B4332',
        ink:     '#0A0A0A',
        'ink-light': '#1C1C1C',
        stone:   '#6B7280',
        amber:   '#D4A017',
        success: '#40916C',
        danger:  '#DC2626',
        warn:    '#D97706',
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Helvetica Neue', 'Arial', 'sans-serif'],
      },
      boxShadow: {
        'soft':  '0 2px 16px rgba(10,10,10,0.06)',
        'card':  '0 4px 24px rgba(10,10,10,0.08)',
        'glow':  '0 8px 32px rgba(45,106,79,0.25)',
        'glow-sm': '0 4px 16px rgba(45,106,79,0.2)',
      },
      backgroundImage: {
        'forest-gradient': 'linear-gradient(135deg, #1B4332 0%, #2D6A4F 50%, #40916C 100%)',
        'cream-gradient':  'linear-gradient(135deg, #FAF8F3 0%, #F0EDE4 100%)',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
    },
  },
  plugins: [],
};
