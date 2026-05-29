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
        ag: {
          white:       '#FFFFFF',
          'off-white': '#F7F6F4',
          'light-gray':'#EFEFEF',
          'mid-gray':  '#D0CECA',
          black:       '#0A0A0A',
          dark:        '#1A1A1A',
          gray:        '#6B6B6B',
          'gray-light':'#9B9B9B',
          navy:        '#0A1D2E',
          apex:        '#2EAF7D',
          border:      '#E8E6E2',
          'border-h':  '#BEBAB4',
          live:        '#16A34A',
          beta:        '#B45309',
          dev:         '#9B9B9B',
        },
        aegryn: {
          obsidian: '#050505',
          navy:     '#0A1D2E',
          apex:     '#2EAF7D',
          white:    '#F8FAFC',
          bg:       '#FFFFFF',
          bg2:      '#F7F6F4',
          bg3:      '#EFEFEF',
          cream:    '#0A0A0A',
          cream2:   '#6B6B6B',
          muted:    '#9B9B9B',
          live:     '#16A34A',
          beta:     '#B45309',
          border:   '#E8E6E2',
          'border-h':'#BEBAB4',
          glass:    'rgba(0,0,0,0.02)',
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
