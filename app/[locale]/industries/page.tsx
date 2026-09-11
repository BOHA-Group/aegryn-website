'use client'

import { useEffect, useRef, useState } from 'react'
import Image            from 'next/image'
import { Link }         from '@/i18n/navigation'
import { ArrowUpRight, X } from 'lucide-react'
import { useTranslations }  from 'next-intl'
import { gsap }         from '@/lib/gsap'

/* ── Photo par cluster ──────────────────────────────────────── */
const CLUSTER_IMG: Record<string, string> = {
  finance:   '/images/theme_fintech.jpg',
  sante:     '/images/grade-usecases/uc-due-diligence.jpg',
  industrie: '/images/theme_marketplace.jpg',
  commerce:  '/images/theme_saas.jpg',
  tech:      '/images/theme_AI.jpg',
}

/* ── Types ──────────────────────────────────────────────────── */
interface Sector  { name: string; desc: string; tag: string }
interface Cluster { id: string; cluster: string; image: string; vision: string; sectors: Sector[] }

/* ════════════════════════════════════════════════════════════ */
export default function IndustriesPage() {
  const t        = useTranslations('industries.page')
  const clusters = t.raw('clusters') as Cluster[]

  const [active, setActive] = useState<string | null>(null)
  const panelRef  = useRef<HTMLDivElement>(null)
  const gridRef   = useRef<HTMLDivElement>(null)

  /* ── Grid cards entrance ─────────────────────────────────── */
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.ind-card',
        { opacity: 0, y: 28 },
        { opacity: 1, y: 0, stagger: 0.09, duration: 0.65, ease: 'expo.out',
          scrollTrigger: { trigger: gridRef.current, start: 'top 82%', once: true } },
      )
    }, gridRef)
    return () => ctx.revert()
  }, [])

  /* ── Panel open animation ────────────────────────────────── */
  useEffect(() => {
    if (!active || !panelRef.current) return
    gsap.fromTo(panelRef.current,
      { opacity: 0, y: -12 },
      { opacity: 1, y: 0, duration: 0.4, ease: 'expo.out' },
    )
    setTimeout(() => panelRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 80)
  }, [active])

  const cluster = clusters.find(c => c.id === active) ?? null

  return (
    <main className="min-h-screen bg-ag-white">

      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="bg-ag-navy pt-36 pb-24 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-ag-apex/70 mb-7">
            {t('label')}
          </p>
          <h1
            className="font-sans font-bold text-white leading-[1.0] tracking-[-0.03em] max-w-3xl mb-7 whitespace-pre-line"
            style={{ fontSize: 'clamp(40px,5.5vw,72px)' }}
          >
            {t('title')}
          </h1>
          <p className="font-sans text-[15px] text-white/45 max-w-xl leading-relaxed mb-12">
            {t('desc')}
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/grade"
              className="inline-flex items-center gap-2 bg-ag-apex text-ag-navy font-mono text-[10px] tracking-[0.18em] uppercase px-7 py-3 font-semibold hover:bg-white transition-colors">
              {t('certifCta')} <ArrowUpRight size={12} />
            </Link>
            <Link href="/contact"
              className="inline-flex items-center gap-2 border border-white/20 text-white/55 font-mono text-[10px] tracking-[0.18em] uppercase px-7 py-3 hover:border-white/50 hover:text-white transition-all">
              {t('contactCta')}
            </Link>
          </div>
        </div>
      </section>

      {/* ── Grille industries — style Flow Partners ───────────── */}
      <section className="bg-ag-white border-t border-ag-border">
        <div className="max-w-7xl mx-auto px-6 md:px-12 pt-20 pb-6">
          <p className="font-mono text-[10px] tracking-[0.28em] uppercase text-ag-gray-light mb-2">
            {t('industriesTitle')}
          </p>
        </div>

        {/* ── Grille 3 colonnes desktop, 2 tablette, 1 mobile ── */}
        <div
          ref={gridRef}
          className="max-w-7xl mx-auto px-6 md:px-12 pb-0"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {clusters.map((cl, i) => {
              const img     = CLUSTER_IMG[cl.id] ?? cl.image
              const isActive = active === cl.id
              return (
                <button
                  key={cl.id}
                  onClick={() => setActive(isActive ? null : cl.id)}
                  className={`ind-card group relative overflow-hidden text-left transition-all duration-300 focus:outline-none
                    ${isActive ? 'ring-2 ring-ag-apex ring-offset-0' : 'hover:ring-1 hover:ring-white/20'}`}
                  style={{ height: 'clamp(220px, 26vw, 340px)', opacity: 0 }}
                  aria-expanded={isActive}
                >
                  {/* Photo pleine */}
                  <Image
                    src={img}
                    alt={cl.cluster}
                    fill
                    className={`object-cover transition-all duration-500
                      ${isActive ? 'scale-105 brightness-50' : 'group-hover:scale-105 group-hover:brightness-75'}`}
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  />

                  {/* Dégradé bas → haut */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                  {/* Numéro */}
                  <span className="absolute top-5 left-5 font-mono text-[10px] tracking-[0.22em] text-white/50">
                    {String(i + 1).padStart(2, '0')}
                  </span>

                  {/* Icône état */}
                  <div className={`absolute top-5 right-5 w-8 h-8 flex items-center justify-center border transition-all duration-300
                    ${isActive ? 'border-ag-apex bg-ag-apex/15' : 'border-white/30 group-hover:border-white/70'}`}>
                    {isActive
                      ? <X size={13} className="text-ag-apex" />
                      : <ArrowUpRight size={13} className="text-white/50 group-hover:text-white transition-colors" />
                    }
                  </div>

                  {/* Titre + nb secteurs en bas */}
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <p className={`font-mono text-[9px] tracking-[0.2em] uppercase mb-2 transition-colors duration-300
                      ${isActive ? 'text-ag-apex' : 'text-white/40 group-hover:text-white/60'}`}>
                      {cl.sectors.length} secteurs
                    </p>
                    <h2
                      className="font-sans font-bold text-white leading-[1.1] tracking-[-0.025em]"
                      style={{ fontSize: 'clamp(17px,1.6vw,22px)' }}
                    >
                      {cl.cluster}
                    </h2>
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* ── Panneau détail ────────────────────────────────── */}
        {cluster && (
          <div
            ref={panelRef}
            className="max-w-7xl mx-auto px-6 md:px-12 mt-4 mb-0"
          >
            <div className="border border-ag-border bg-white">

              {/* ── En-tête panneau ── */}
              <div className="flex items-stretch border-b border-ag-border">
                {/* Photo identité */}
                <div className="relative hidden md:block shrink-0" style={{ width: 180 }}>
                  <Image
                    src={CLUSTER_IMG[cluster.id] ?? cluster.image}
                    alt={cluster.cluster}
                    fill
                    className="object-cover brightness-75"
                    sizes="180px"
                  />
                  <div className="absolute inset-0 bg-ag-navy/40" />
                </div>
                {/* Meta */}
                <div className="flex-1 px-8 py-7 flex flex-col justify-center gap-2">
                  <p className="font-mono text-[9px] tracking-[0.26em] uppercase text-ag-apex">
                    {String(clusters.findIndex(c => c.id === cluster.id) + 1).padStart(2, '0')} · {cluster.sectors.length} secteurs
                  </p>
                  <h3
                    className="font-sans font-bold text-ag-black tracking-[-0.025em] leading-tight"
                    style={{ fontSize: 'clamp(20px,2vw,28px)' }}
                  >
                    {cluster.cluster}
                  </h3>
                  <p className="font-sans text-[13px] text-ag-gray leading-relaxed max-w-2xl">
                    {cluster.vision}
                  </p>
                </div>
                {/* Fermer */}
                <button
                  onClick={() => setActive(null)}
                  className="shrink-0 flex items-center justify-center w-14 border-l border-ag-border hover:bg-ag-off-white transition-colors"
                  aria-label="Fermer"
                >
                  <X size={16} className="text-ag-gray" />
                </button>
              </div>

              {/* ── Grille secteurs ── */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 divide-x-0">
                {cluster.sectors.map((sector, si) => (
                  <div
                    key={sector.name}
                    className={`flex flex-col gap-2 px-7 py-6 border-b border-r border-ag-border hover:bg-ag-off-white transition-colors duration-150
                      ${si % 4 === 3 ? 'xl:border-r-0' : ''}
                      ${si % 3 === 2 ? 'lg:border-r-0 xl:border-r border-ag-border' : ''}
                      ${si % 2 === 1 ? 'sm:border-r-0 lg:border-r border-ag-border' : ''}`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <p className="font-sans font-semibold text-ag-black text-[13px] leading-snug">
                        {sector.name}
                      </p>
                      <span className="font-mono text-[8px] tracking-[0.1em] uppercase px-1.5 py-0.5 border border-ag-border text-ag-gray-light bg-ag-off-white shrink-0 whitespace-nowrap mt-0.5">
                        {sector.tag}
                      </span>
                    </div>
                    <p className="font-sans text-[12px] text-ag-gray leading-relaxed">
                      {sector.desc}
                    </p>
                  </div>
                ))}
              </div>

              {/* ── Footer panneau ── */}
              <div className="px-8 py-5 border-t border-ag-border bg-ag-off-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <p className="font-mono text-[9px] tracking-[0.2em] uppercase text-ag-gray-light">
                  Aegryn · {cluster.cluster}
                </p>
                <div className="flex gap-2.5">
                  <Link href="/grade"
                    className="inline-flex items-center gap-1.5 bg-ag-navy text-white font-mono text-[9px] tracking-[0.18em] uppercase px-5 py-2.5 hover:bg-ag-black transition-colors">
                    {t('certifCta')} <ArrowUpRight size={10} />
                  </Link>
                  <Link href="/contact"
                    className="inline-flex items-center gap-1.5 border border-ag-border text-ag-gray font-mono text-[9px] tracking-[0.18em] uppercase px-5 py-2.5 hover:border-ag-black hover:text-ag-black transition-all">
                    {t('contactCta')}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="pb-16" />
      </section>

      {/* ── Bottom CTA ───────────────────────────────────────── */}
      <section className="py-20 px-6 md:px-12 border-t border-ag-border">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div>
            <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-ag-gray-light mb-3">Aegryn</p>
            <p className="font-sans font-bold text-ag-black max-w-lg leading-snug tracking-[-0.025em]"
              style={{ fontSize: 'clamp(18px,2.2vw,30px)' }}>
              {t('certifCta')}
            </p>
          </div>
          <div className="flex flex-wrap gap-3 shrink-0">
            <Link href="/grade"
              className="inline-flex items-center gap-2 bg-ag-navy text-white font-mono text-[10px] tracking-[0.16em] uppercase px-6 py-3 font-semibold hover:bg-ag-black transition-colors">
              {t('certifCta')} <ArrowUpRight size={12} />
            </Link>
            <Link href="/blog"
              className="inline-flex items-center gap-2 border border-ag-border text-ag-gray font-mono text-[10px] tracking-[0.16em] uppercase px-6 py-3 hover:border-ag-black hover:text-ag-black transition-all">
              {t('articlesCta')} <ArrowUpRight size={12} />
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
