'use client'

import { useEffect, useRef } from 'react'
import Image            from 'next/image'
import { Link }         from '@/i18n/navigation'
import { ArrowUpRight } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { gsap }         from '@/lib/gsap'

/* ── Slugs et photos par cluster ───────────────────────────── */
const CLUSTER_META: Record<string, { slug: string; img: string }> = {
  finance:   { slug: 'finance-capital',                      img: '/images/theme_fintech.jpg' },
  sante:     { slug: 'sante-sciences-de-la-vie',             img: '/images/grade-usecases/uc-due-diligence.jpg' },
  industrie: { slug: 'industrie-energie-infrastructure',     img: '/images/theme_marketplace.jpg' },
  commerce:  { slug: 'commerce-services-experience-client',  img: '/images/theme_saas.jpg' },
  tech:      { slug: 'tech-innovation-secteur-public',       img: '/images/theme_AI.jpg' },
}

interface Cluster { id: string; cluster: string; image: string; vision: string; sectors: { name: string }[] }

/* ═══════════════════════════════════════════════════════════ */
export default function IndustriesPage() {
  const t        = useTranslations('industries.page')
  const clusters = t.raw('clusters') as Cluster[]
  const gridRef  = useRef<HTMLDivElement>(null)

  /* Entrance GSAP */
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.ind-card',
        { opacity: 0, y: 22 },
        { opacity: 1, y: 0, stagger: 0.08, duration: 0.6, ease: 'expo.out',
          scrollTrigger: { trigger: gridRef.current, start: 'top 84%', once: true } },
      )
    }, gridRef)
    return () => ctx.revert()
  }, [])

  return (
    <main className="min-h-screen bg-ag-white">

      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="bg-ag-navy pt-36 pb-24 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-ag-apex/70 mb-7">
            {t('label')}
          </p>
          <h1 className="font-sans font-bold text-white leading-[1.02] tracking-[-0.03em] max-w-3xl mb-7 whitespace-pre-line"
            style={{ fontSize: 'clamp(40px,5.5vw,72px)' }}>
            {t('title')}
          </h1>
          <p className="font-sans text-[15px] text-white/45 max-w-xl leading-relaxed mb-12">
            {t('desc')}
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/grade"
              className="rounded-lg inline-flex items-center gap-2 bg-ag-apex text-ag-navy font-mono text-[10px] tracking-[0.18em] uppercase px-7 py-3 font-semibold hover:bg-white transition-colors">
              {t('certifCta')} <ArrowUpRight size={12} />
            </Link>
            <Link href="/contact"
              className="rounded-lg inline-flex items-center gap-2 border border-white/20 text-white/55 font-mono text-[10px] tracking-[0.18em] uppercase px-7 py-3 hover:border-white/50 hover:text-white transition-all">
              {t('contactCta')}
            </Link>
          </div>
        </div>
      </section>

      {/* ── Grille compacte ──────────────────────────────────── */}
      <section className="rounded-lg bg-ag-white border-t border-ag-border py-16 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <p className="font-mono text-[10px] tracking-[0.28em] uppercase text-ag-gray-light mb-8">
            {t('industriesTitle')}
          </p>

          {/* Ligne horizontale scrollable sur mobile, grille sur desktop */}
          <div
            ref={gridRef}
            className="flex flex-col sm:flex-row gap-3 sm:overflow-x-auto sm:pb-2 lg:grid lg:grid-cols-5 lg:overflow-visible lg:pb-0"
            style={{ scrollSnapType: 'x mandatory' }}
          >
            {clusters.map((cl, i) => {
              const meta   = CLUSTER_META[cl.id]
              const img    = meta?.img ?? cl.image
              const slug   = meta?.slug ?? cl.id
              return (
                <Link
                  key={cl.id}
                  href={`/industries/${slug}` as never}
                  className="ind-card group relative overflow-hidden rounded-xl shrink-0 sm:w-[240px] lg:w-auto flex flex-col justify-end focus:outline-none"
                  style={{
                    height: 'clamp(180px, 22vw, 260px)',
                    opacity: 0,
                    scrollSnapAlign: 'start',
                  }}
                >
                  {/* Photo pleine */}
                  <Image
                    src={img}
                    alt={cl.cluster}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(min-width: 1024px) 20vw, (min-width: 640px) 240px, 100vw"
                  />
                  {/* Dégradé */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent rounded-xl" />

                  {/* Numéro haut gauche */}
                  <span className="absolute top-4 left-4 font-mono text-[9px] tracking-[0.22em] text-white/40">
                    {String(i + 1).padStart(2, '0')}
                  </span>

                  {/* Icône haut droite */}
                  <div className="absolute top-4 right-4 w-7 h-7 rounded-full border border-white/25 flex items-center justify-center
                    group-hover:border-ag-apex group-hover:bg-ag-apex/15 transition-all duration-300">
                    <ArrowUpRight size={12} className="text-white/50 group-hover:text-ag-apex transition-colors" />
                  </div>

                  {/* Titre + compteur secteurs */}
                  <div className="relative z-10 p-5">
                    <p className="font-mono text-[8px] tracking-[0.2em] uppercase text-white/40 mb-1.5 group-hover:text-ag-apex/60 transition-colors">
                      {cl.sectors.length} secteurs
                    </p>
                    <h2 className="font-sans font-bold text-white leading-[1.1] tracking-[-0.02em]"
                      style={{ fontSize: 'clamp(14px,1.3vw,17px)' }}>
                      {cl.cluster}
                    </h2>
                  </div>
                </Link>
              )
            })}
          </div>

          {/* Hint scroll mobile */}
          <p className="sm:hidden lg:hidden font-mono text-[9px] tracking-[0.2em] uppercase text-ag-gray-light mt-4">
            ← Faire défiler →
          </p>
        </div>
      </section>

      {/* ── Bottom CTA — 3 lignes distinctes ────────────────── */}
      <section className="py-0 border-t border-ag-border">
        <div className="max-w-7xl mx-auto">

          {/* Ligne 1 — Benchmarks */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 px-6 md:px-12 py-6 border-b border-ag-border">
            <p className="font-sans text-[14px] text-ag-black leading-snug max-w-lg">
              Accéder à nos benchmarks de valorisation d'une organisation
            </p>
            <Link
              href={"/grade/whitepaper" as never}
              className="rounded-lg shrink-0 inline-flex items-center gap-2 border border-ag-border text-ag-gray font-mono text-[9px] tracking-[0.18em] uppercase px-5 py-2.5 hover:border-ag-black hover:text-ag-black transition-all whitespace-nowrap"
            >
              Accéder aux benchmarks <ArrowUpRight size={10} />
            </Link>
          </div>

          {/* Ligne 2 — Certification */}
          <div className="rounded-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 px-6 md:px-12 py-6 border-b border-ag-border bg-ag-navy">
            <p className="font-sans text-[14px] text-white leading-snug max-w-lg">
              Demander la Certification CIFSO 5000
            </p>
            <Link
              href="/grade"
              className="rounded-lg shrink-0 inline-flex items-center gap-2 bg-ag-apex text-ag-navy font-mono text-[9px] tracking-[0.18em] uppercase px-5 py-2.5 font-semibold hover:bg-white transition-colors whitespace-nowrap"
            >
              Demander la Certification CIFSO 5000 <ArrowUpRight size={10} />
            </Link>
          </div>

          {/* Ligne 3 — Publications */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 px-6 md:px-12 py-6">
            <p className="font-sans text-[14px] text-ag-black leading-snug max-w-lg">
              Consulter nos points de vue et publications
            </p>
            <Link
              href="/blog"
              className="rounded-lg shrink-0 inline-flex items-center gap-2 border border-ag-border text-ag-gray font-mono text-[9px] tracking-[0.18em] uppercase px-5 py-2.5 hover:border-ag-black hover:text-ag-black transition-all whitespace-nowrap"
            >
              Lire les analyses <ArrowUpRight size={10} />
            </Link>
          </div>

        </div>
      </section>
    </main>
  )
}
