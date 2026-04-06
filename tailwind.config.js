/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // NEXA Black + Gold system
        'nexa-black':    '#0a0a0f',
        'nexa-surface':  '#0d0d14',
        'nexa-border':   '#1a1a24',
        'nexa-gold':     '#d4a017',
        'nexa-gold-dim': '#8a6a0f',
        'nexa-text':     '#e8e4d9',
        'nexa-muted':    '#4a4a6a',
        'nexa-green':    '#22c55e',
        'nexa-red':      '#e24b4a',
        'nexa-amber':    '#EF9F27',
        // Legacy aliases
        cmd: {
          950: '#0a0a0f',
          900: '#0d0d14',
          800: '#111118',
          700: '#16161f',
          600: '#1a1a24',
        },
      },
      fontFamily: {
        sans: ['DM Sans', 'system-ui', 'sans-serif'],
        mono: ['Space Mono', 'monospace'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4,0,0.6,1) infinite',
        'blink': 'blink 1s step-end infinite',
      },
      keyframes: {
        blink: { '0%,100%': { opacity: 1 }, '50%': { opacity: 0 } },
      },
    },
  },
  plugins: [],
}
