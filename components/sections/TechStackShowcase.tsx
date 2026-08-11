'use client'

import { useRef, useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import { gsap } from '@/lib/gsap'

/* ── Tech data ─────────────────────────────────────────────────────── */

type TechItem = {
  name: string
  /** inline SVG path or simple letter abbreviation fallback */
  abbr: string
  color: string
}

type TechCategory = {
  labelKey: string
  items: TechItem[]
}

const CATEGORIES: TechCategory[] = [
  {
    labelKey: 'frontend',
    items: [
      { name: 'Next.js',      abbr: 'N',  color: '#000000' },
      { name: 'React',        abbr: 'Re', color: '#61DAFB' },
      { name: 'Vue 3',        abbr: 'V',  color: '#42B883' },
      { name: 'Svelte',       abbr: 'Sv', color: '#FF3E00' },
      { name: 'Astro',        abbr: 'A',  color: '#FF5D01' },
      { name: 'Tailwind',     abbr: 'Tw', color: '#06B6D4' },
      { name: 'Framer',       abbr: 'Fr', color: '#0055FF' },
      { name: 'GSAP',         abbr: 'GS', color: '#88CE02' },
    ],
  },
  {
    labelKey: 'backend',
    items: [
      { name: 'Node.js',      abbr: 'No', color: '#339933' },
      { name: 'Python',       abbr: 'Py', color: '#3776AB' },
      { name: 'FastAPI',      abbr: 'Fa', color: '#009688' },
      { name: 'Payload CMS',  abbr: 'P',  color: '#5ADDA4' },
      { name: 'GraphQL',      abbr: 'GQ', color: '#E10098' },
      { name: 'tRPC',         abbr: 'tR', color: '#2596BE' },
    ],
  },
  {
    labelKey: 'database',
    items: [
      { name: 'PostgreSQL',   abbr: 'PG', color: '#336791' },
      { name: 'Supabase',     abbr: 'Su', color: '#3ECF8E' },
      { name: 'Redis',        abbr: 'Rd', color: '#DC382D' },
      { name: 'MongoDB',      abbr: 'Mo', color: '#47A248' },
      { name: 'Prisma',       abbr: 'Pr', color: '#0C344B' },
      { name: 'Drizzle',      abbr: 'Dr', color: '#C5F74F' },
    ],
  },
  {
    labelKey: 'mobile',
    items: [
      { name: 'React Native', abbr: 'RN', color: '#61DAFB' },
      { name: 'Expo',         abbr: 'Ex', color: '#000020' },
      { name: 'PWA',          abbr: 'PW', color: '#5A0FC8' },
    ],
  },
  {
    labelKey: 'infra',
    items: [
      { name: 'Docker',       abbr: 'Dk', color: '#2496ED' },
      { name: 'GitHub CI',    abbr: 'GH', color: '#24292E' },
      { name: 'Vercel',       abbr: 'Vc', color: '#000000' },
      { name: 'Cloudflare',   abbr: 'CF', color: '#F48120' },
      { name: 'Nginx',        abbr: 'Nx', color: '#009639' },
    ],
  },
  {
    labelKey: 'integrations',
    items: [
      { name: 'Stripe',       abbr: 'St', color: '#635BFF' },
      { name: 'OpenAI',       abbr: 'AI', color: '#10A37F' },
      { name: 'Resend',       abbr: 'Rs', color: '#000000' },
      { name: 'NextAuth',     abbr: 'Au', color: '#FF3E00' },
      { name: 'n8n',          abbr: 'n8', color: '#EA4B71' },
      { name: 'Puppeteer',    abbr: 'Pp', color: '#40B5A4' },
    ],
  },
]

/* ── Badge component ───────────────────────────────────────────────── */

function TechBadge({ item }: { item: TechItem }) {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      className="tech-badge flex flex-col items-center gap-1.5 cursor-default"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Circle — always slightly lit, full glow on hover */}
      <div
        className="w-9 h-9 rounded-full border flex items-center justify-center transition-all duration-250"
        style={{
          borderColor: hovered ? item.color : `${item.color}55`,
          backgroundColor: hovered ? `${item.color}22` : `${item.color}0A`,
          boxShadow: hovered ? `0 0 14px ${item.color}50` : 'none',
        }}
      >
        <span
          className="font-sans font-bold text-[10px] leading-none transition-colors duration-250"
          style={{ color: hovered ? item.color : `${item.color}99` }}
        >
          {item.abbr}
        </span>
      </div>
      {/* Label */}
      <span
        className="font-sans text-[9px] tracking-[0.04em] text-center leading-tight transition-colors duration-200"
        style={{ color: hovered ? '#0D1B2A' : '#6B7280', maxWidth: '48px' }}
      >
        {item.name}
      </span>
    </div>
  )
}

/* ── Main component ────────────────────────────────────────────────── */

export function TechStackShowcase() {
  const t   = useTranslations('techStack')
  const ref = useRef<HTMLElement>(null)
  const [activeCategory, setActiveCategory] = useState<number | null>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.tss-header', {
        opacity: 0, y: 16, duration: 0.5, ease: 'expo.out',
        scrollTrigger: { trigger: ref.current, start: 'top 80%' },
      })
      gsap.from('.tss-tab', {
        opacity: 0, y: 8, stagger: 0.04, duration: 0.4, ease: 'expo.out',
        scrollTrigger: { trigger: ref.current, start: 'top 76%' },
      })
      gsap.from('.tech-badge', {
        opacity: 0, scale: 0.8, stagger: 0.018, duration: 0.35, ease: 'back.out(1.6)',
        scrollTrigger: { trigger: '.tss-grid', start: 'top 82%' },
      })
    }, ref)
    return () => ctx.revert()
  }, [])

  const displayedCategories = activeCategory !== null
    ? [CATEGORIES[activeCategory]]
    : CATEGORIES

  return (
    <section ref={ref} className="border-b border-ag-border bg-ag-white">
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-12 md:py-16">

        {/* Header — compact horizontal */}
        <div className="tss-header flex flex-col md:flex-row md:items-end md:justify-between gap-3 mb-8">
          <div>
            <p className="font-sans font-semibold text-[10px] uppercase tracking-[0.28em] text-ag-gray-light mb-1.5">
              {t('label')}
            </p>
            <h2
              className="font-sans font-bold text-ag-black tracking-[-0.02em] leading-tight"
              style={{ fontSize: 'clamp(20px,2.8vw,34px)' }}
            >
              {t('title')}
            </h2>
          </div>
          <p className="font-sans text-[12px] text-ag-gray leading-relaxed max-w-sm md:text-right">
            {t('desc')}
          </p>
        </div>

        {/* Category filter tabs */}
        <div className="flex flex-wrap gap-1.5 mb-8">
          <button
            onClick={() => setActiveCategory(null)}
            className={`tss-tab font-mono text-[9px] tracking-[0.16em] uppercase px-3 py-1.5 border transition-colors duration-200 ${
              activeCategory === null
                ? 'bg-ag-navy text-white border-ag-navy'
                : 'bg-white text-ag-gray border-ag-border hover:border-ag-navy/50 hover:text-ag-navy'
            }`}
          >
            {t('all')}
          </button>
          {CATEGORIES.map((cat, i) => (
            <button
              key={cat.labelKey}
              onClick={() => setActiveCategory(activeCategory === i ? null : i)}
              className={`tss-tab font-mono text-[9px] tracking-[0.16em] uppercase px-3 py-1.5 border transition-colors duration-200 ${
                activeCategory === i
                  ? 'bg-ag-navy text-white border-ag-navy'
                  : 'bg-white text-ag-gray border-ag-border hover:border-ag-navy/50 hover:text-ag-navy'
              }`}
            >
              {t(cat.labelKey)}
            </button>
          ))}
        </div>

        {/* Grid by category — compact */}
        <div className="tss-grid flex flex-col gap-6">
          {displayedCategories.map((cat) => (
            <div key={cat.labelKey} className="flex flex-col sm:flex-row sm:items-start gap-4">
              {/* Category label — fixed width, navy, readable */}
              <p className="font-mono text-[9px] tracking-[0.20em] uppercase text-ag-navy font-semibold shrink-0 sm:w-28 pt-1">
                {t(cat.labelKey)}
              </p>
              {/* Badges row */}
              <div className="flex flex-wrap gap-4">
                {cat.items.map((item) => (
                  <TechBadge key={item.name} item={item} />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer note */}
        <p className="mt-10 font-sans text-[11px] text-ag-gray-light border-l-2 border-ag-border pl-3 max-w-xl leading-relaxed">
          {t('note')}
        </p>
      </div>
    </section>
  )
}
