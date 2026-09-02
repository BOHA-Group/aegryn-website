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
          slate:       '#374151',   /* Additional — Slate (WCAG AA) */
          /* ── Backgrounds */
          white:       '#FFFFFF',
          'off-white': '#F8FAFC',
          'light-gray':'#EFEFEF',
          'mid-gray':  '#D0CECA',
          /* ── Texts */
          black:       '#050505',
          dark:        '#0A0A0A',
          gray:        '#374151',   /* WCAG AA on white */
          'gray-light':'#6B7280',   /* WCAG AA on white */
          /* ── Brand accent */
          navy:        '#0A1D2E',
          apex:        '#5ADDA4',
          'apex-ink':  '#0C7A52',   /* Apex foncé — texte sur fond blanc/beige, WCAG AA */
          /* ── Borders */
          border:      '#E2E8F0',
          'border-h':  '#CBD5E1',
          /* ── Status */
          live:        '#16A34A',
          beta:        '#B45309',
          dev:         '#94A3B8',
          /* ── Grade tokens */
          'grade-star':    '#5ADDA4',
          'grade-aaa':     '#C9A84C',
          'grade-aa':      '#9BA8B0',
          'grade-a':       '#4A90D9',
          'grade-b':       '#D4820A',
          'grade-refused': '#C0392B',
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
        magazine: {
          black:  '#0F1A2B',
          white:  '#FFFFFF',
          ivory:  '#F7F5F1',
          cream:  '#EDEAE4',
          accent: '#5ADDA4',
        },
      },
      fontFamily: {
        display: ['var(--font-body)', 'Plus Jakarta Sans', 'sans-serif'],
        sans:    ['var(--font-body)', 'Plus Jakarta Sans', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        mono:    ['var(--font-body)', 'Plus Jakarta Sans', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        unbounded: ['var(--font-unbounded)', 'sans-serif'],
      },
      fontSize: {
        'display':  ['clamp(64px,8vw,120px)', { lineHeight: '0.92', letterSpacing: '-0.03em', fontWeight: '800' }],
        'h1-mag':   ['clamp(36px,5vw,64px)',  { lineHeight: '1.08', letterSpacing: '-0.02em', fontWeight: '700' }],
        'h2-mag':   ['clamp(22px,3vw,36px)',  { lineHeight: '1.2',  letterSpacing: '-0.01em', fontWeight: '600' }],
        'body-mag': ['18px',                   { lineHeight: '1.7',  letterSpacing: '0',       fontWeight: '400' }],
        'label-mag':['12px',                   { lineHeight: '1.4',  letterSpacing: '0.08em',  fontWeight: '500' }],
      },
      maxWidth: {
        magazine: '1440px',
        prose:    '720px',
      },
      letterSpacing: {
        tighter: '-0.03em',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
      keyframes: {
        marquee: {
          '0%':   { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-100%)' },
        },
      },
      animation: {
        'pulse-slow':     'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'marquee':        'marquee 6s linear infinite',
        'marquee-pause':  'marquee 6s linear infinite paused',
      },
    },
  },
  plugins: [],
}

export default config
