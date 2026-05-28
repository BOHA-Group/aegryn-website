import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        aegryn: {
          obsidian: '#050505',
          navy: '#0A1D2E',
          apex: '#5ADDA4',
          white: '#F8FAFC',
          bg: '#FFFFFF',
          bg2: '#FAFAF8',
          bg3: '#F0EBE2',
          cream: '#0D0C0B',
          cream2: '#4A4640',
          muted: '#9A9590',
          live: '#00C950',
          beta: '#D97706',
          border: 'rgba(0, 0, 0, 0.08)',
          'border-h': 'rgba(0, 0, 0, 0.18)',
          glass: 'rgba(0, 0, 0, 0.03)',
        },
      },
      fontFamily: {
        display: ['var(--font-unbounded)', 'sans-serif'],
        sans: ['var(--font-dm-sans)', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        mono: ['var(--font-dm-mono)', 'monospace'],
      },
      letterSpacing: {
        tighter: '-0.03em',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
}

export default config
