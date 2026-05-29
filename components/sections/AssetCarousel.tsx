'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { gsap } from '@/lib/gsap'
import { AEGRYN_ASSETS } from '@/data/assets'

const STATUS_CONFIG = {
  live:  { label: 'Live',  dot: 'bg-ag-live',  pulse: true },
  beta:  { label: 'Beta',  dot: 'bg-ag-beta',  pulse: true },
  dev:   { label: 'Dev',   dot: 'bg-ag-dev',   pulse: false },
} as const

const VISIBLE = AEGRYN_ASSETS.slice()

/**
 * Horizontal scroll-snap carousel for assets.
 * GSAP ScrollTrigger pins the section while user scrolls horizontally
 * through asset cards, then unpins to continue page scroll.
 */
export function AssetCarousel() {
  const sectionRef = useRef<HTMLElement>(null)
  const trackRef   = useRef<HTMLDivElement>(null)
  const headerRef  = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    const track   = trackRef.current
    if (!section || !track) return

    const ctx = gsap.context(() => {
      /* Horizontal scroll distance = total width − one viewport */
      const getScrollAmount = () => -(track.scrollWidth - track.offsetWidth)

      const mm = gsap.matchMedia()

      /* Desktop only — on mobile, let CSS scroll-snap handle it natively */
      mm.add('(min-width: 768px)', () => {
        const st = gsap.to(track, {
          x: getScrollAmount,
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top top',
            end: () => `+=${Math.abs(getScrollAmount())}`,
            pin: true,
            scrub: 0.6,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        })
        return () => st.scrollTrigger?.kill()
      })

      /* Header fade-in */
      gsap.from(headerRef.current, {
        opacity: 0, y: 16,
        duration: 0.7, ease: 'expo.out',
        scrollTrigger: { trigger: section, start: 'top 85%' },
      })
    }, section)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="bg-ag-white border-t border-ag-border overflow-hidden"
    >
      {/* Section header */}
      <div ref={headerRef} className="max-w-7xl mx-auto px-6 md:px-12 pt-20 pb-10 flex items-end justify-between">
        <div>
          <p className="font-sans font-semibold text-[11px] tracking-[0.2em] uppercase text-ag-gray-light mb-3">
            Notre écosystème
          </p>
          <h2
            className="font-sans font-bold text-ag-black tracking-[-0.03em] leading-[0.95]"
            style={{ fontSize: 'clamp(32px,4vw,56px)' }}
          >
            Ce que nous construisons.
          </h2>
        </div>
        <span className="hidden md:block font-sans font-semibold text-[11px] tracking-[0.18em] uppercase text-ag-gray-light">
          ← scroll →
        </span>
      </div>

      {/* Scrollable track */}
      <div
        ref={trackRef}
        className="flex md:flex-nowrap flex-wrap gap-0 will-change-transform"
        style={{ width: `${(VISIBLE.length + 1) * 340}px` }}
      >
        {VISIBLE.map((asset) => {
          const status = STATUS_CONFIG[asset.status]
          const isKryv = asset.id === 'kryv'

          if (isKryv) {
            return (
              <div
                key={asset.id}
                className="group relative flex flex-col shrink-0 border-r border-white/10 p-10 bg-ag-navy overflow-hidden"
                style={{ width: '340px', minHeight: '420px' }}
              >
                <div
                  className="pointer-events-none absolute inset-0"
                  style={{
                    background: 'radial-gradient(ellipse 70% 50% at 50% 0%, rgba(90,221,164,0.08) 0%, transparent 70%)',
                  }}
                />
                <div className="flex justify-between items-start mb-auto relative z-10">
                  <span className="font-sans font-semibold text-[10px] tracking-[0.14em] uppercase text-ag-apex/60 border border-ag-apex/30 px-2.5 py-1">
                    CLASSIFIÉ
                  </span>
                  <span className="w-8 h-8 border border-white/20 flex items-center justify-center text-white/30">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                      <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                    </svg>
                  </span>
                </div>
                <div className="mt-16 relative z-10">
                  <h3
                    className="font-sans font-bold text-white tracking-[-0.03em] leading-none mb-2"
                    style={{ fontSize: 'clamp(22px,2vw,28px)' }}
                  >
                    {asset.name}
                  </h3>
                  <p className="font-sans font-normal text-[13px] text-white/50 leading-relaxed mb-3">
                    {asset.tagline}
                  </p>
                  <p className="font-sans font-normal text-[12px] text-white/30 leading-relaxed mb-5">
                    Protocole en développement confidentiel.
                    <br />Accès restreint aux partenaires accrédités.
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-ag-apex animate-pulse" />
                    <span className="font-sans font-semibold text-[10px] tracking-[0.14em] uppercase text-ag-apex/60">
                      Restricted
                    </span>
                  </div>
                </div>
              </div>
            )
          }

          return (
            <Link
              key={asset.id}
              href={`/assets/${asset.slug}`}
              className="group relative flex flex-col shrink-0 border-r border-ag-border p-10 bg-ag-white hover:bg-ag-off-white transition-colors duration-300 overflow-hidden"
              style={{ width: '340px', minHeight: '420px' }}
            >
              <div
                className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{
                  background: 'radial-gradient(ellipse 60% 40% at 50% 0%, rgba(90,221,164,0.07) 0%, transparent 70%)',
                }}
              />
              <div className="flex justify-between items-start mb-auto relative z-10">
                <span className="font-sans font-semibold text-[10px] tracking-[0.14em] uppercase text-ag-gray-light border border-ag-border px-2.5 py-1 group-hover:border-ag-apex group-hover:text-ag-apex transition-all duration-200">
                  {asset.badge}
                </span>
                <span className="w-8 h-8 border border-ag-border flex items-center justify-center text-ag-gray group-hover:border-ag-black group-hover:bg-ag-black group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300">
                  <ArrowUpRight size={13} />
                </span>
              </div>
              <div className="mt-16 relative z-10">
                <h3
                  className="font-sans font-bold text-ag-black tracking-[-0.03em] leading-none mb-2"
                  style={{ fontSize: 'clamp(22px,2vw,28px)' }}
                >
                  {asset.name}
                </h3>
                <p className="font-sans font-normal text-[13px] text-ag-gray leading-relaxed mb-3">
                  {asset.tagline}
                </p>
                <p className="font-sans font-normal text-[12px] text-ag-gray-light leading-relaxed mb-5 line-clamp-2">
                  {asset.description}
                </p>
                <div className="flex items-center gap-2">
                  <span className={`w-1.5 h-1.5 rounded-full ${status.dot} ${status.pulse ? 'animate-pulse' : ''}`} />
                  <span className="font-sans font-semibold text-[10px] tracking-[0.14em] uppercase text-ag-gray-light">
                    {status.label}
                  </span>
                </div>
              </div>
            </Link>
          )
        })}

        {/* End card — CTA */}
        <div
          className="shrink-0 flex flex-col items-center justify-center bg-ag-navy px-10"
          style={{ width: '340px', minHeight: '420px' }}
        >
          <p className="font-sans font-semibold text-[11px] tracking-[0.22em] uppercase text-white/60 mb-4 text-center">
            Aegryn Group
          </p>
          <p
            className="font-sans font-bold text-white tracking-[-0.03em] leading-[0.95] text-center mb-8"
            style={{ fontSize: 'clamp(22px,2vw,30px)' }}
          >
            All our assets.<br />Built to last.
          </p>
          <Link
            href="/what-we-build"
            className="inline-flex items-center gap-3 font-sans font-semibold text-[11px] tracking-[0.16em] uppercase text-white border border-white/30 px-6 py-3 hover:border-white hover:bg-white hover:text-ag-navy transition-all"
          >
            View all
            <ArrowUpRight size={14} />
          </Link>
        </div>
      </div>

      {/* Mobile scroll hint */}
      <div className="md:hidden px-6 pb-6">
        <p className="font-sans font-semibold text-[10px] tracking-[0.2em] uppercase text-ag-gray-light">
          Swipe to explore →
        </p>
      </div>
    </section>
  )
}
