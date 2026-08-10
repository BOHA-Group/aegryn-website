'use client'

import { useEffect, useRef } from 'react'
import { gsap } from '@/lib/gsap'
import Link from 'next/link'

const TEXT     = 'Aegryn'
const REPEAT   = 20
/** Duration in seconds — very slow drift */
const DURATION = 90

interface FooterMarqueeProps {
  /** Localised text on the spinning medallion ring, e.g. "Discutons . Contactez-nous" */
  medallionText?: string
  /** Accessible aria-label for the link */
  contactLabel?: string
}

/**
 * Single-line infinite marquee (RTL) fused with footer bottom.
 * Medallion centred at 120px. No second line (avoids overlap).
 */
export function FooterMarquee({
  medallionText = 'Discutons . Contactez-nous . Discutons . Contactez-nous .',
  contactLabel  = 'Nous contacter',
}: FooterMarqueeProps) {
  const lineRef  = useRef<HTMLDivElement>(null)
  const medalRef = useRef<HTMLDivElement>(null)
  const dotRef   = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const l = lineRef.current
    if (!l) return

    const tileW = l.scrollWidth / 2

    /* Single line — RTL */
    const tw = gsap.fromTo(l,
      { x: 0 },
      { x: -tileW, duration: DURATION, ease: 'none', repeat: -1 },
    )

    /* Medallion slow spin */
    const twMedal = gsap.to(medalRef.current, {
      rotation: 360,
      duration: 22,
      ease: 'none',
      repeat: -1,
    })

    /* Dot pulse */
    const twDot = gsap.to(dotRef.current, {
      scale: 1.6,
      opacity: 0.35,
      duration: 1.1,
      ease: 'power1.inOut',
      yoyo: true,
      repeat: -1,
    })

    return () => { tw.kill(); twMedal.kill(); twDot.kill() }
  }, [])

  const tiles = Array.from({ length: REPEAT }, (_, i) => (
    <span key={i} className="inline-flex items-center shrink-0">
      <span
        className="font-sans font-black tracking-[0.22em] text-white/55 select-none"
        style={{ fontSize: 'clamp(32px,4.5vw,60px)' }}
      >
        {TEXT}
      </span>
      <span className="mx-6 w-1 h-1 rounded-full bg-ag-apex/30 shrink-0 inline-block" />
    </span>
  ))

  /* SVG circle — radius 48, viewBox 120×120 */
  const SIZE = 120
  const CX   = 60
  const CY   = 60
  const R    = 48

  return (
    <div className="relative overflow-hidden select-none border-t border-white/[0.06]" style={{ height: 100 }}>

      {/* Single RTL line — vertically centred */}
      <div className="overflow-hidden absolute inset-x-0 inset-y-0 flex items-center">
        <div ref={lineRef} className="flex whitespace-nowrap will-change-transform">
          {tiles}{tiles}
        </div>
      </div>

      {/* Medallion — centred */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
        <Link
          href="/contact"
          className="relative flex items-center justify-center pointer-events-auto group"
          style={{ width: SIZE, height: SIZE }}
          aria-label={contactLabel}
        >
          {/* Spinning text ring */}
          <div ref={medalRef} className="absolute inset-0" aria-hidden="true">
            <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="w-full h-full">
              <defs>
                <path
                  id="medal-ring"
                  d={`M ${CX},${CY} m -${R},0 a ${R},${R} 0 1,1 ${R * 2},0 a ${R},${R} 0 1,1 -${R * 2},0`}
                />
              </defs>
              <text
                style={{ fontSize: 8.5, fontFamily: 'inherit', fontWeight: 600 }}
                fill="rgba(255,255,255,0.65)"
                letterSpacing="2.4"
              >
                <textPath href="#medal-ring">
                  {medallionText}
                </textPath>
              </text>
            </svg>
          </div>

          {/* Inner circle */}
          <div className="relative w-14 h-14 rounded-full bg-ag-apex/15 border border-ag-apex/40 flex items-center justify-center
            group-hover:bg-ag-apex group-hover:border-ag-apex transition-all duration-300">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none"
              className="text-ag-apex group-hover:text-ag-navy transition-colors duration-300">
              <path d="M2 8h12M9 3l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>

          {/* Pulse dot */}
          <span
            ref={dotRef}
            className="absolute top-2.5 right-2.5 w-1.5 h-1.5 rounded-full bg-ag-apex"
          />
        </Link>
      </div>
    </div>
  )
}
