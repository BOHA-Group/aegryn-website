'use client'

import { useLayoutEffect, useRef } from 'react'
import Image from 'next/image'
import { Link } from '@/i18n/navigation'
import { useTranslations } from 'next-intl'
import { ArrowUpRight } from 'lucide-react'
import { gsap } from '@/lib/gsap'

type Pillar = { title: string; desc: string; href?: string }

/* Photo de chaque métier : celle du hero de sa page */
const IMAGES: Record<string, string> = {
  strategy:           '/images/advisory/strategy-towers.webp',
  riskCompliance:     '/images/advisory/risk-compliance.webp',
  finance:            '/images/advisory/finance.webp',
  technology:         '/images/advisory/technology.webp',
  operations:         '/images/advisory/operations.webp',
  talentOrganization: '/images/advisory/talent.webp',
  program:            '/images/advisory/program.webp',
  ma:                 '/images/advisory/ma.webp',
}

/**
 * Section « Cadrer et réaliser » de l'accueil : les huit métiers défilent vers la droite pendant que la page
 * défile vers le bas (section épinglée, défilement horizontal animé), chaque carte mène à la page du métier.
 * Mobile et mouvement réduit : défilement horizontal natif avec accroche.
 */
export function MetiersScroller() {
  const t = useTranslations('advisory')
  const sectionRef  = useRef<HTMLElement>(null)
  const viewportRef = useRef<HTMLDivElement>(null)
  const trackRef    = useRef<HTMLDivElement>(null)
  const barRef      = useRef<HTMLSpanElement>(null)
  const headRef     = useRef<HTMLDivElement>(null)

  const pillars = (t.raw('pillars') as Record<string, Pillar>) || {}
  const keys = Object.keys(pillars)

  useLayoutEffect(() => {
    const section = sectionRef.current, viewport = viewportRef.current, track = trackRef.current
    if (!section || !viewport || !track) return

    const ctx = gsap.context(() => {
      gsap.from(headRef.current, { opacity: 0, y: 16, duration: 0.7, ease: 'expo.out', scrollTrigger: { trigger: section, start: 'top 80%', once: true } })

      const mm = gsap.matchMedia()
      mm.add('(min-width: 768px) and (prefers-reduced-motion: no-preference)', () => {
        viewport.style.overflowX = 'visible'
        const distance = () => Math.max(0, track.scrollWidth - viewport.clientWidth)
        const tween = gsap.to(track, {
          x: () => -distance(),
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top top',
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 0.6,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: self => { if (barRef.current) barRef.current.style.transform = `scaleX(${self.progress})` },
          },
        })
        /* Léger parallaxe de chaque photo pendant son passage */
        track.querySelectorAll<HTMLElement>('[data-metier-img]').forEach(img => {
          gsap.fromTo(img, { xPercent: 7 }, {
            xPercent: -7, ease: 'none',
            scrollTrigger: { trigger: img.parentElement, containerAnimation: tween, start: 'left right', end: 'right left', scrub: true },
          })
        })
        return () => { viewport.style.overflowX = '' }
      })
    }, section)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} id="cadrer" className="relative overflow-hidden border-t border-ag-border bg-ag-white scroll-mt-20 md:flex md:h-[100svh] md:flex-col md:justify-center">
      <div ref={headRef} className="mx-auto flex w-full max-w-7xl flex-wrap items-end justify-between gap-6 px-6 pb-8 pt-20 md:px-12 md:pb-[clamp(16px,3vh,40px)] md:pt-[clamp(72px,10vh,110px)]">
        <div className="max-w-2xl">
          <p className="mb-4 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.28em] text-ag-apex-ink"><span className="inline-block h-px w-5 bg-ag-apex/50" />{t('label')}</p>
          <h2 className="font-sans font-bold leading-[1.15] tracking-[-0.03em] text-ag-black" style={{ fontSize: 'clamp(26px,3vw,44px)' }}>{t('hero.title')}</h2>
        </div>
        <Link href="/advisory" className="rounded-lg inline-flex items-center gap-2 bg-ag-navy px-6 py-3 font-sans text-[11px] font-semibold uppercase tracking-[0.14em] text-white transition-colors hover:bg-ag-black">
          {t('all')} <ArrowUpRight size={13} />
        </Link>
      </div>

      <div ref={viewportRef} className="overflow-x-auto overscroll-x-contain snap-x snap-mandatory md:snap-none [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div ref={trackRef} className="flex w-max gap-5 px-6 pb-4 md:gap-8 md:px-12 will-change-transform">
          {keys.map((key, i) => {
            const p = pillars[key]
            return (
              <Link key={key} href={(p.href ?? '/advisory') as never} className="group w-[78vw] shrink-0 snap-start sm:w-[46vw] md:w-[30vw] lg:w-[25vw]">
                <div className="relative overflow-hidden rounded-2xl bg-ag-navy" style={{ height: 'clamp(230px,46vh,480px)' }}>
                  <Image
                    data-metier-img
                    src={IMAGES[key] ?? '/images/advisory/strategy-towers.webp'}
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 25vw, (min-width: 768px) 30vw, 78vw"
                    className="scale-[1.18] object-cover transition-transform duration-700 ease-out group-hover:scale-[1.25]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ag-navy/70 via-transparent to-transparent" />
                  <span className="absolute left-5 top-5 font-mono text-[11px] tracking-[0.22em] text-white/90">{String(i + 1).padStart(2, '0')}</span>
                  <span className="absolute bottom-5 right-5 flex h-9 w-9 items-center justify-center rounded-full bg-white text-ag-navy opacity-0 transition-opacity duration-300 group-hover:opacity-100"><ArrowUpRight size={15} /></span>
                </div>
                <h3 className="mt-5 font-sans font-bold leading-snug tracking-[-0.02em] text-ag-black transition-colors group-hover:text-ag-apex-ink" style={{ fontSize: 'clamp(17px,1.4vw,21px)' }}>{p.title}</h3>
                <p className="mt-2 line-clamp-2 font-sans text-[14px] leading-relaxed text-ag-gray">{p.desc}</p>
              </Link>
            )
          })}
          <div aria-hidden className="w-6 shrink-0 md:w-12" />
        </div>
      </div>

      <div aria-hidden className="mx-auto mt-4 hidden h-px w-full max-w-7xl px-6 md:block md:px-12">
        <div className="h-px w-full bg-ag-border"><span ref={barRef} className="block h-px origin-left scale-x-0 bg-ag-apex" /></div>
      </div>
    </section>
  )
}
