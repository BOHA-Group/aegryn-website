'use client'

import { useEffect, useRef, useState } from 'react'
import Image         from 'next/image'
import { Link }      from '@/i18n/navigation'
import { ArrowUpRight, ChevronDown } from 'lucide-react'
import { useTranslations, useLocale } from 'next-intl'
import { gsap, SplitText }   from '@/lib/gsap'

/* ── Images par cluster ─────────────────────────────────────── */
const CLUSTER_IMAGES: Record<string, string> = {
  finance:   '/images/theme_fintech.jpg',
  sante:     '/images/grade-usecases/uc-due-diligence.jpg',
  industrie: '/images/theme_marketplace.jpg',
  commerce:  '/images/theme_saas.jpg',
  tech:      '/images/theme_AI.jpg',
}

/* ── Types ──────────────────────────────────────────────────── */
interface Sector {
  name: string
  desc: string
  tag:  string
}

interface Cluster {
  id:       string
  cluster:  string
  image:    string
  vision:   string
  sectors:  Sector[]
}

/* ── Page ───────────────────────────────────────────────────── */
export default function IndustriesPage() {
  const t       = useTranslations('industries.page')
  const locale  = useLocale()

  const clusters  = t.raw('clusters') as Cluster[]

  const [active, setActive] = useState<string | null>(null)
  const detailRef = useRef<HTMLDivElement>(null)
  const gridRef   = useRef<HTMLDivElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const h1Ref     = useRef<HTMLHeadingElement>(null)
  const labelRef  = useRef<HTMLParagraphElement>(null)

  /* ── GSAP header + cards ─────────────────────────────────── */
  useEffect(() => {
    const h1 = h1Ref.current
    if (!h1) return
    const split = new SplitText(h1, { type: 'lines', linesClass: 'ag-line-inner' })
    const ctx = gsap.context(() => {
      if (labelRef.current) {
        gsap.fromTo(labelRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.5, scrollTrigger: { trigger: headerRef.current, start: 'top 82%', once: true } },
        )
      }
      gsap.fromTo(split.lines,
        { yPercent: 110 },
        { yPercent: 0, stagger: 0.1, duration: 1.0, ease: 'expo.out',
          scrollTrigger: { trigger: headerRef.current, start: 'top 80%', once: true } },
      )
      clusters.forEach((_, i) => {
        gsap.fromTo(`.ind-card-${i}`,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.7, ease: 'expo.out', delay: (i % 3) * 0.05,
            scrollTrigger: { trigger: gridRef.current, start: 'top 85%', once: true } },
        )
      })
    }, gridRef)
    return () => { split.revert(); ctx.revert() }
  }, [])

  /* ── Scroll vers le détail à l'ouverture ───────────────────── */
  useEffect(() => {
    if (!active || !detailRef.current) return
    setTimeout(() => {
      detailRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 60)
  }, [active])

  const activeCluster = clusters.find(c => c.id === active) ?? null

  return (
    <main>
      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="bg-ag-navy pt-32 pb-24 px-6">
        <div className="max-w-7xl mx-auto">
          <p className="font-mono text-[10px] tracking-[0.28em] uppercase text-ag-apex mb-6 flex items-center gap-3">
            <span className="w-6 h-px bg-ag-apex/50 inline-block" />
            {t('label')}
          </p>
          <h1
            className="font-sans font-bold text-white leading-[1.05] tracking-[-0.03em] max-w-3xl mb-6 whitespace-pre-line"
            style={{ fontSize: 'clamp(36px,5vw,68px)' }}
          >
            {t('title')}
          </h1>
          <p className="font-sans text-[16px] text-white/55 max-w-2xl mb-12 leading-relaxed">
            {t('desc')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/grade"
              className="inline-flex items-center gap-2 bg-ag-apex text-ag-navy font-mono text-[11px] tracking-[0.14em] uppercase px-7 py-3.5 font-semibold hover:bg-ag-apex/90 transition-colors"
            >
              {t('certifCta')} <ArrowUpRight size={13} />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 border border-white/25 text-white/75 font-mono text-[11px] tracking-[0.14em] uppercase px-7 py-3.5 hover:border-white/50 hover:text-white transition-all"
            >
              {t('contactCta')}
            </Link>
          </div>
        </div>
      </section>

      {/* ── Grille clusters — style EcosystemDomains ─────────────── */}
      <section className="bg-ag-white border-t border-ag-border">
        <div ref={headerRef} className="max-w-7xl mx-auto px-6 md:px-12 pt-24 pb-12">
          <p ref={labelRef} className="font-sans font-semibold text-[11px] tracking-[0.24em] uppercase text-ag-gray-light mb-5">
            {t('industriesTitle')}
          </p>
          <h2
            ref={h1Ref}
            className="font-sans font-bold text-ag-black tracking-[-0.03em] leading-[1.2] overflow-hidden pb-2"
            style={{ fontSize: 'clamp(32px,4vw,60px)' }}
          >
            {t('title')}
          </h2>
        </div>

        <div ref={gridRef} className="max-w-7xl mx-auto px-6 md:px-12 pb-20">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 border border-ag-border mb-10">
            {clusters.map((cluster, i) => {
              const image        = CLUSTER_IMAGES[cluster.id] ?? cluster.image
              const borderRight  = i % 3 !== 2 ? 'lg:border-r border-ag-border' : ''
              const borderRightSm = i % 2 !== 1 ? 'sm:border-r border-ag-border' : ''
              const isActive     = active === cluster.id
              return (
                <button
                  key={cluster.id}
                  onClick={() => setActive(isActive ? null : cluster.id)}
                  className={`ind-card-${i} group relative flex flex-col justify-start overflow-hidden p-8 transition-all duration-500 text-left
                    bg-ag-navy border-b border-ag-border
                    ${borderRight} ${borderRightSm}
                    ${isActive ? 'ring-2 ring-inset ring-ag-apex' : ''}`}
                  style={{ minHeight: '260px', opacity: 0 }}
                  aria-expanded={isActive}
                  aria-controls={`detail-${cluster.id}`}
                >
                  {image && (
                    <>
                      <Image
                        src={image}
                        alt={cluster.cluster}
                        fill
                        className={`object-cover transition-opacity duration-500 ${isActive ? 'opacity-20' : 'opacity-60 group-hover:opacity-30'}`}
                        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                      />
                      <div className={`pointer-events-none absolute inset-0 transition-colors duration-500 ${isActive ? 'bg-ag-navy/80' : 'bg-ag-navy/20 group-hover:bg-ag-navy/75'}`} />
                    </>
                  )}

                  {/* Top row — numéro + arrow */}
                  <div className="relative z-10 w-full flex items-center justify-between mb-auto">
                    <span className="font-mono text-[9px] tracking-[0.22em] uppercase text-ag-apex/70">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className={`transition-all duration-300 ${isActive ? 'rotate-180' : 'group-hover:translate-x-0.5 group-hover:-translate-y-0.5'}`}>
                      {isActive
                        ? <ChevronDown size={14} className="text-ag-apex" />
                        : <ArrowUpRight size={14} className="text-white/40 group-hover:text-white/80" />
                      }
                    </span>
                  </div>

                  {/* Content */}
                  <div className="relative z-10 mt-12">
                    <h2
                      className="font-sans font-bold tracking-[-0.02em] leading-[1.1] mb-3 text-white"
                      style={{ fontSize: 'clamp(18px,1.8vw,22px)' }}
                    >
                      {cluster.cluster}
                    </h2>
                    <p className="font-sans text-[12.5px] leading-relaxed text-white/70 line-clamp-3">
                      {cluster.vision}
                    </p>
                  </div>

                  {/* Active indicator */}
                  {isActive && (
                    <div className="relative z-10 mt-4 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-ag-apex animate-pulse" />
                      <span className="font-mono text-[9px] tracking-[0.18em] uppercase text-ag-apex">
                        {t('seeDetail') || 'Détail ci-dessous'}
                      </span>
                    </div>
                  )}
                </button>
              )
            })}
          </div>

          {/* ── Détail du cluster actif ─────────────────────────── */}
          {activeCluster && (
            <div
              ref={detailRef}
              id={`detail-${activeCluster.id}`}
              className="border border-ag-apex/30 bg-ag-off-white mb-10 animate-in fade-in duration-300"
            >
              {/* Header détail */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
                <div className="lg:col-span-4 relative overflow-hidden" style={{ minHeight: 280 }}>
                  <Image
                    src={CLUSTER_IMAGES[activeCluster.id] ?? activeCluster.image}
                    alt={activeCluster.cluster}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-ag-navy/55" />
                  <div className="absolute bottom-0 left-0 p-8">
                    <p className="font-mono text-[9px] tracking-[0.22em] uppercase text-ag-apex mb-2">
                      {String(clusters.findIndex(c => c.id === activeCluster.id) + 1).padStart(2, '0')}
                    </p>
                    <h3 className="font-sans font-bold text-white text-[22px] leading-tight tracking-[-0.02em]">
                      {activeCluster.cluster}
                    </h3>
                  </div>
                </div>

                <div className="lg:col-span-8 p-8 lg:p-10 bg-ag-white flex flex-col gap-5">
                  <p className="font-sans text-[14px] text-ag-gray leading-relaxed max-w-2xl">
                    {activeCluster.vision}
                  </p>

                  {/* Grille secteurs */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-px bg-ag-border border border-ag-border mt-2">
                    {activeCluster.sectors.map(sector => (
                      <div key={sector.name} className="bg-ag-white p-5 flex flex-col gap-2 hover:bg-ag-off-white transition-colors">
                        <div className="flex items-start justify-between gap-2">
                          <p className="font-sans font-semibold text-ag-black text-[13px] leading-snug">
                            {sector.name}
                          </p>
                          <span className="font-mono text-[8px] tracking-[0.1em] uppercase px-2 py-0.5 bg-ag-off-white border border-ag-border text-ag-gray-light shrink-0">
                            {sector.tag}
                          </span>
                        </div>
                        <p className="font-sans text-[12px] text-ag-gray leading-relaxed">
                          {sector.desc}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Footer détail */}
              <div className="px-8 py-5 border-t border-ag-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <p className="font-mono text-[10px] tracking-[0.18em] uppercase text-ag-gray-light">
                  {activeCluster.sectors.length} {activeCluster.sectors.length > 1 ? 'secteurs' : 'secteur'}
                </p>
                <div className="flex gap-3">
                  <Link
                    href="/grade"
                    className="inline-flex items-center gap-2 bg-ag-navy text-white font-mono text-[10px] tracking-[0.14em] uppercase px-5 py-2.5 hover:bg-ag-black transition-colors"
                  >
                    {t('certifCta')} <ArrowUpRight size={11} />
                  </Link>
                  <Link
                    href={`/${locale}/contact`as never}
                    className="inline-flex items-center gap-2 border border-ag-border text-ag-gray font-mono text-[10px] tracking-[0.14em] uppercase px-5 py-2.5 hover:border-ag-black hover:text-ag-black transition-all"
                  >
                    {t('contactCta')}
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ── Bottom CTA ──────────────────────────────────────────── */}
      <section className="py-20 px-6 bg-ag-white border-t border-ag-border">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div>
            <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-ag-gray-light mb-3">Aegryn</p>
            <p className="font-sans font-bold text-ag-black text-[22px] max-w-lg leading-snug tracking-[-0.02em]">
              {t('certifCta')}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <Link
              href="/grade"
              className="inline-flex items-center gap-2 bg-ag-navy text-white font-mono text-[11px] tracking-[0.14em] uppercase px-6 py-3 font-semibold hover:bg-ag-black transition-colors"
            >
              {t('certifCta')} <ArrowUpRight size={13} />
            </Link>
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 border border-ag-border text-ag-gray font-mono text-[11px] tracking-[0.14em] uppercase px-6 py-3 hover:border-ag-black hover:text-ag-black transition-all"
            >
              {t('articlesCta')} <ArrowUpRight size={13} />
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
