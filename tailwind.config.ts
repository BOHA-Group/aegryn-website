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
          /* ── Brand palette */
          primary:     '#5ADDA4',   /* Primary — Emerald Mint  */
          secondary:   '#050505',   /* Secondary — Near Black  */
          tertiary:    '#F8FAFC',   /* Tertiary — Off White    */
          slate:       '#475569',   /* Additional — Slate      */
          /* ── Backgrounds */
          white:       '#FFFFFF',
          'off-white': '#F8FAFC',
          'light-gray':'#EFEFEF',
          'mid-gray':  '#D0CECA',
          /* ── Texts */
          black:       '#050505',
          dark:        '#0A0A0A',
          gray:        '#475569',
          'gray-light':'#94A3B8',
          /* ── Brand accent */
          navy:        '#0A1D2E',
          apex:        '#5ADDA4',
          /* ── Borders */
          border:      '#E2E8F0',
          'border-h':  '#CBD5E1',
          /* ── Status */
          live:        '#16A34A',
          beta:        '#B45309',
          dev:         '#94A3B8',
        },
        aegryn: {
          obsidian: '#050505',
          navy:     '#0A1D2E',
          apex:     '#5ADDA4',
          white:    '#F8FAFC',
          bg:       '#FFFFFF',
          bg2:      '#F8FAFC',
          bg3:      '#EFEFEF',
          cream:    '#050505',
          cream2:   '#475569',
          muted:    '#94A3B8',
          live:     '#16A34A',
          beta:     '#B45309',
          border:   '#E2E8F0',
          'border-h':'#CBD5E1',
          glass:    'rgba(0,0,0,0.02)',
        },
      },
      fontFamily: {
        display: ['var(--font-unbounded)', 'sans-serif'],
        sans:    ['var(--font-body)', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        mono:    ['var(--font-body)', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
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
