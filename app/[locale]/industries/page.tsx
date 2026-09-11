'use client'

import { useEffect, useRef, useState } from 'react'
import Image         from 'next/image'
import { Link }      from '@/i18n/navigation'
import { ArrowUpRight, Plus, Minus } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { gsap }      from '@/lib/gsap'

/* ── Images ─────────────────────────────────────────────────── */
const CLUSTER_IMAGES: Record<string, string> = {
  finance:   '/images/theme_fintech.jpg',
  sante:     '/images/grade-usecases/uc-due-diligence.jpg',
  industrie: '/images/theme_marketplace.jpg',
  commerce:  '/images/theme_saas.jpg',
  tech:      '/images/theme_AI.jpg',
}

/* Secteurs → image légère (masque ~15% opacity) */
const SECTOR_IMAGES: Record<string, string> = {
  finance:   '/images/grade-usecases/uc-bank-financing.jpg',
  sante:     '/images/grade-usecases/uc-annual-report.jpg',
  industrie: '/images/grade-usecases/uc-succession.jpg',
  commerce:  '/images/grade-usecases/uc-fundraising.jpg',
  tech:      '/images/theme_IP.jpg',
}

/* ── Types ──────────────────────────────────────────────────── */
interface Sector  { name: string; desc: string; tag: string }
interface Cluster { id: string; cluster: string; image: string; vision: string; sectors: Sector[] }

/* ── Component ──────────────────────────────────────────────── */
export default function IndustriesPage() {
  const t        = useTranslations('industries.page')
  const clusters = t.raw('clusters') as Cluster[]

  const [open, setOpen] = useState<string | null>(null)

  const heroRef    = useRef<HTMLDivElement>(null)
  const listRef    = useRef<HTMLDivElement>(null)
  const detailsRef = useRef<Record<string, HTMLDivElement | null>>({})

  /* ── Hero entrance ──────────────────────────────────────────── */
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.ind-hero-label', { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.5, delay: 0.1 })
      gsap.fromTo('.ind-hero-h1',   { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.7, delay: 0.25, ease: 'expo.out' })
      gsap.fromTo('.ind-hero-desc', { opacity: 0 },        { opacity: 1, duration: 0.6, delay: 0.5 })
      gsap.fromTo('.ind-hero-ctas', { opacity: 0 },        { opacity: 1, duration: 0.5, delay: 0.7 })
    }, heroRef)
    return () => ctx.revert()
  }, [])

  /* ── Scroll list entrance ───────────────────────────────────── */
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.ind-row',
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, stagger: 0.08, duration: 0.6, ease: 'expo.out',
          scrollTrigger: { trigger: listRef.current, start: 'top 82%', once: true } },
      )
    }, listRef)
    return () => ctx.revert()
  }, [])

  /* ── Accordion GSAP ─────────────────────────────────────────── */
  function toggle(id: string) {
    const next = open === id ? null : id
    setOpen(next)
    if (next) {
      requestAnimationFrame(() => {
        const el = detailsRef.current[next]
        if (!el) return
        gsap.fromTo(el,
          { opacity: 0, y: -10 },
          { opacity: 1, y: 0, duration: 0.4, ease: 'expo.out' },
        )
        setTimeout(() => el.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 80)
      })
    }
  }

  return (
    <main className="bg-ag-white">

      {/* ════════════════════════════════════════════════════════
          HERO — plein fond navy, titre large
      ════════════════════════════════════════════════════════ */}
      <section ref={heroRef} className="relative bg-ag-navy overflow-hidden pt-36 pb-28 px-6 md:px-12">
        {/* Grille décorative légère */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: 'linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)',
            backgroundSize: '80px 80px',
          }}
        />
        <div className="max-w-7xl mx-auto relative z-10">
          <p className="ind-hero-label font-mono text-[10px] tracking-[0.3em] uppercase text-ag-apex mb-7 flex items-center gap-3">
            <span className="w-8 h-px bg-ag-apex/50" />
            {t('label')}
          </p>
          <h1
            className="ind-hero-h1 font-sans font-bold text-white leading-[1.02] tracking-[-0.03em] max-w-4xl mb-8"
            style={{ fontSize: 'clamp(38px,5.5vw,72px)' }}
          >
            {t('title')}
          </h1>
          <p className="ind-hero-desc font-sans text-[15px] text-white/50 max-w-xl mb-12 leading-relaxed">
            {t('desc')}
          </p>
          <div className="ind-hero-ctas flex flex-wrap gap-3">
            <Link
              href="/grade"
              className="inline-flex items-center gap-2 bg-ag-apex text-ag-navy font-mono text-[10px] tracking-[0.16em] uppercase px-7 py-3 font-semibold hover:bg-white transition-colors"
            >
              {t('certifCta')} <ArrowUpRight size={12} />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 border border-white/20 text-white/60 font-mono text-[10px] tracking-[0.16em] uppercase px-7 py-3 hover:border-white/50 hover:text-white transition-all"
            >
              {t('contactCta')}
            </Link>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          LISTE MASTER — une ligne par cluster
      ════════════════════════════════════════════════════════ */}
      <div ref={listRef} className="border-b border-ag-border">
        {clusters.map((cluster, ci) => {
          const isOpen   = open === cluster.id
          const imgSrc   = CLUSTER_IMAGES[cluster.id] ?? cluster.image
          const sectImg  = SECTOR_IMAGES[cluster.id]

          return (
            <div key={cluster.id} className="ind-row border-t border-ag-border" id={cluster.id}>

              {/* ── Ligne master cluster ────────────────────── */}
              <button
                onClick={() => toggle(cluster.id)}
                className={`w-full group flex items-stretch text-left transition-colors duration-300
                  ${isOpen ? 'bg-ag-navy' : 'bg-ag-white hover:bg-ag-off-white'}`}
                aria-expanded={isOpen}
              >
                {/* Photo couleur (master) */}
                <div className="relative shrink-0 hidden md:block" style={{ width: 200 }}>
                  <Image
                    src={imgSrc}
                    alt={cluster.cluster}
                    fill
                    className={`object-cover transition-opacity duration-500 ${isOpen ? 'opacity-40' : 'opacity-100 group-hover:opacity-90'}`}
                    sizes="200px"
                  />
                  {/* Overlay léger quand fermé, fort quand ouvert */}
                  <div className={`absolute inset-0 transition-colors duration-500 ${isOpen ? 'bg-ag-navy/60' : 'bg-ag-navy/10'}`} />
                </div>

                {/* Numéro + titre + description + toggle */}
                <div className="flex-1 flex items-center gap-6 px-7 md:px-10 py-7 md:py-8">
                  <span className={`font-mono text-[11px] tracking-[0.24em] shrink-0 transition-colors duration-300 ${isOpen ? 'text-ag-apex' : 'text-ag-gray-light'}`}>
                    {String(ci + 1).padStart(2, '0')}
                  </span>

                  <div className="flex-1 min-w-0">
                    <h2
                      className={`font-sans font-bold tracking-[-0.025em] leading-[1.1] transition-colors duration-300 ${isOpen ? 'text-white' : 'text-ag-black'}`}
                      style={{ fontSize: 'clamp(20px,2.2vw,30px)' }}
                    >
                      {cluster.cluster}
                    </h2>
                    <p className={`font-sans text-[13px] mt-1.5 leading-relaxed line-clamp-1 transition-colors duration-300 ${isOpen ? 'text-white/50' : 'text-ag-gray'}`}>
                      {cluster.vision}
                    </p>
                  </div>

                  {/* Compteur secteurs */}
                  <span className={`hidden sm:block font-mono text-[10px] tracking-[0.14em] uppercase shrink-0 mr-4 transition-colors duration-300 ${isOpen ? 'text-white/40' : 'text-ag-gray-light'}`}>
                    {cluster.sectors.length} secteurs
                  </span>

                  {/* +/− */}
                  <div className={`w-9 h-9 flex items-center justify-center border shrink-0 transition-all duration-300
                    ${isOpen ? 'border-ag-apex bg-ag-apex/10' : 'border-ag-border group-hover:border-ag-black'}`}>
                    {isOpen
                      ? <Minus size={14} className="text-ag-apex" />
                      : <Plus  size={14} className={`transition-colors duration-300 text-ag-gray group-hover:text-ag-black`} />
                    }
                  </div>
                </div>
              </button>

              {/* ── Panneau détail (accordéon) ──────────────── */}
              {isOpen && (
                <div
                  ref={el => { detailsRef.current[cluster.id] = el }}
                  className="overflow-hidden"
                >
                  {/* Vision band */}
                  <div className="bg-ag-navy/95 px-7 md:px-10 py-6 border-t border-white/10">
                    <p className="font-sans text-[13px] text-white/60 max-w-3xl leading-relaxed">
                      {cluster.vision}
                    </p>
                  </div>

                  {/* Grille secteurs compacte */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-px bg-ag-border border-t border-ag-border">
                    {cluster.sectors.map((sector) => (
                      <div
                        key={sector.name}
                        className="relative bg-ag-white overflow-hidden group/sect flex flex-col hover:bg-ag-off-white transition-colors duration-200"
                        style={{ minHeight: 130 }}
                      >
                        {/* Photo très légère en fond */}
                        {sectImg && (
                          <Image
                            src={sectImg}
                            alt=""
                            fill
                            className="object-cover opacity-[0.07] group-hover/sect:opacity-[0.12] transition-opacity duration-300 pointer-events-none"
                            sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                            aria-hidden
                          />
                        )}
                        <div className="relative z-10 p-5 flex flex-col gap-2 h-full">
                          <div className="flex items-start justify-between gap-2">
                            <p className="font-sans font-semibold text-ag-black text-[13px] leading-snug">
                              {sector.name}
                            </p>
                            <span className="font-mono text-[8px] tracking-[0.1em] uppercase px-1.5 py-0.5 border border-ag-border text-ag-gray-light bg-white shrink-0 whitespace-nowrap">
                              {sector.tag}
                            </span>
                          </div>
                          <p className="font-sans text-[11.5px] text-ag-gray leading-relaxed flex-1">
                            {sector.desc}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Footer détail */}
                  <div className="bg-ag-off-white border-t border-ag-border px-7 md:px-10 py-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <p className="font-mono text-[10px] tracking-[0.18em] uppercase text-ag-gray-light">
                      {cluster.sectors.length} {cluster.sectors.length > 1 ? 'secteurs couverts' : 'secteur couvert'}
                    </p>
                    <div className="flex gap-3">
                      <Link
                        href="/grade"
                        className="inline-flex items-center gap-2 bg-ag-navy text-white font-mono text-[9px] tracking-[0.16em] uppercase px-5 py-2.5 hover:bg-ag-black transition-colors"
                      >
                        {t('certifCta')} <ArrowUpRight size={10} />
                      </Link>
                      <Link
                        href="/contact"
                        className="inline-flex items-center gap-2 border border-ag-border text-ag-gray font-mono text-[9px] tracking-[0.16em] uppercase px-5 py-2.5 hover:border-ag-black hover:text-ag-black transition-all"
                      >
                        {t('contactCta')}
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* ════════════════════════════════════════════════════════
          BOTTOM CTA
      ════════════════════════════════════════════════════════ */}
      <section className="py-20 px-6 md:px-12 border-t border-ag-border">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div>
            <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-ag-gray-light mb-3">Aegryn</p>
            <p
              className="font-sans font-bold text-ag-black max-w-lg leading-snug tracking-[-0.025em]"
              style={{ fontSize: 'clamp(18px,2vw,28px)' }}
            >
              {t('certifCta')}
            </p>
          </div>
          <div className="flex flex-wrap gap-3 shrink-0">
            <Link
              href="/grade"
              className="inline-flex items-center gap-2 bg-ag-navy text-white font-mono text-[10px] tracking-[0.14em] uppercase px-6 py-3 font-semibold hover:bg-ag-black transition-colors"
            >
              {t('certifCta')} <ArrowUpRight size={12} />
            </Link>
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 border border-ag-border text-ag-gray font-mono text-[10px] tracking-[0.14em] uppercase px-6 py-3 hover:border-ag-black hover:text-ag-black transition-all"
            >
              {t('articlesCta')} <ArrowUpRight size={12} />
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
