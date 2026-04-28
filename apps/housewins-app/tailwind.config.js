/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        felt: {
          DEFAULT: '#1B4332',
          light:   '#2D6A4F',
          dark:    '#0D2B1E',
        },
        cream:    '#F5F0E8',
        gold: {
          DEFAULT: '#C9A84C',
          light:   '#E8C96A',
        },
        burgundy: {
          DEFAULT: '#7B1D1D',
          light:   '#A63030',
        },
        chip: {
          red:   '#C0392B',
          blue:  '#2471A3',
          green: '#1E8449',
          black: '#212121',
          white: '#F0F0F0',
        },
      },
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        body:    ['"Inter"', 'system-ui', 'sans-serif'],
        mono:    ['"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        card:       '0 4px 24px rgba(0,0,0,0.4)',
        chip:       '0 2px 8px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1)',
        'glow-gold':'0 0 16px rgba(201,168,76,0.4)',
        'glow-win': '0 0 24px rgba(201,168,76,0.6)',
      },
    },
  },
  plugins: [],
}
