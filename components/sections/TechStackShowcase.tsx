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

function TechBadge({ item, delay }: { item: TechItem; delay: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const [hovered, setHovered] = useState(false)

  return (
    <div
      ref={ref}
      className="tech-badge group relative flex flex-col items-center gap-2 cursor-default"
      style={{ animationDelay: `${delay}ms` }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Circle */}
      <div
        className="w-11 h-11 md:w-12 md:h-12 rounded-full border flex items-center justify-center transition-all duration-300"
        style={{
          borderColor: hovered ? item.color : '#E5E7EB',
          backgroundColor: hovered ? `${item.color}18` : 'white',
          boxShadow: hovered ? `0 0 16px ${item.color}40` : 'none',
        }}
      >
        <span
          className="font-sans font-bold text-[11px] leading-none transition-colors duration-300"
          style={{ color: hovered ? item.color : '#9BA8B0' }}
        >
          {item.abbr}
        </span>
      </div>
      {/* Label */}
      <span
        className="font-sans text-[10px] tracking-[0.06em] text-center leading-tight transition-colors duration-200"
        style={{ color: hovered ? '#0D1B2A' : '#9BA8B0', maxWidth: '52px' }}
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
        opacity: 0, y: 20, duration: 0.6, ease: 'expo.out',
        scrollTrigger: { trigger: ref.current, start: 'top 78%' },
      })
      gsap.from('.tss-tab', {
        opacity: 0, y: 10, stagger: 0.05, duration: 0.5, ease: 'expo.out',
        scrollTrigger: { trigger: ref.current, start: 'top 72%' },
      })
      gsap.from('.tech-badge', {
        opacity: 0, scale: 0.85, stagger: 0.025, duration: 0.45, ease: 'back.out(1.4)',
        scrollTrigger: { trigger: '.tss-grid', start: 'top 80%' },
      })
    }, ref)
    return () => ctx.revert()
  }, [])

  const displayedCategories = activeCategory !== null
    ? [CATEGORIES[activeCategory]]
    : CATEGORIES

  return (
    <section ref={ref} className="border-b border-ag-border bg-ag-white">
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-20 md:py-28">

        {/* Header */}
        <div className="tss-header mb-10">
          <p className="font-sans font-semibold text-[11px] uppercase tracking-[0.28em] text-ag-gray-light mb-4">
            {t('label')}
          </p>
          <h2
            className="font-sans font-bold text-ag-black tracking-[-0.02em] leading-tight whitespace-pre-line"
            style={{ fontSize: 'clamp(28px,4vw,52px)' }}
          >
            {t('title')}
          </h2>
          <p className="mt-4 font-sans text-[13px] text-ag-gray leading-relaxed max-w-xl">
            {t('desc')}
          </p>
        </div>

        {/* Category filter tabs */}
        <div className="flex flex-wrap gap-2 mb-12">
          <button
            onClick={() => setActiveCategory(null)}
            className={`tss-tab font-mono text-[9px] tracking-[0.18em] uppercase px-4 py-2 border transition-colors duration-200 ${
              activeCategory === null
                ? 'bg-ag-navy text-white border-ag-navy'
                : 'bg-white text-ag-gray border-ag-border hover:border-ag-navy/40 hover:text-ag-navy'
            }`}
          >
            {t('all')}
          </button>
          {CATEGORIES.map((cat, i) => (
            <button
              key={cat.labelKey}
              onClick={() => setActiveCategory(activeCategory === i ? null : i)}
              className={`tss-tab font-mono text-[9px] tracking-[0.18em] uppercase px-4 py-2 border transition-colors duration-200 ${
                activeCategory === i
                  ? 'bg-ag-navy text-white border-ag-navy'
                  : 'bg-white text-ag-gray border-ag-border hover:border-ag-navy/40 hover:text-ag-navy'
              }`}
            >
              {t(cat.labelKey)}
            </button>
          ))}
        </div>

        {/* Grid by category */}
        <div className="tss-grid flex flex-col gap-10">
          {displayedCategories.map((cat) => (
            <div key={cat.labelKey}>
              <p className="font-mono text-[9px] tracking-[0.22em] uppercase text-ag-apex mb-5 flex items-center gap-3">
                <span className="w-5 h-px bg-ag-apex/40 inline-block" />
                {t(cat.labelKey)}
              </p>
              <div className="flex flex-wrap gap-5">
                {cat.items.map((item, j) => (
                  <TechBadge key={item.name} item={item} delay={j * 30} />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer note */}
        <p className="mt-14 font-sans text-[11px] text-ag-gray-light border-l-2 border-ag-apex/30 pl-4 max-w-xl leading-relaxed">
          {t('note')}
        </p>
      </div>
    </section>
  )
}
