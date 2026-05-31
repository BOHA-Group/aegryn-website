'use client'

import { useEffect, useRef } from 'react'
import { gsap } from '@/lib/gsap'
import Link from 'next/link'

const TEXT   = 'AEGRYN'
const REPEAT = 16
/** Duration in seconds — slow drift */
const DURATION = 55

interface FooterMarqueeProps {
  /** Localised text on the spinning medallion ring, e.g. "Discutons . Contactez-nous" */
  medallionText?: string
  /** Accessible aria-label for the link */
  contactLabel?: string
}

/**
 * Two-line infinite marquee fused with bottom bar.
 * Line 1 → RTL, Line 2 → LTR. Medallion centred at 140 px.
 */
export function FooterMarquee({
  medallionText = 'Discutons . Contactez-nous . Discutons . Contactez-nous .',
  contactLabel  = 'Nous contacter',
}: FooterMarqueeProps) {
  const line1Ref = useRef<HTMLDivElement>(null)
  const line2Ref = useRef<HTMLDivElement>(null)
  const medalRef = useRef<HTMLDivElement>(null)
  const dotRef   = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const l1 = line1Ref.current
    const l2 = line2Ref.current
    if (!l1 || !l2) return

    const tileW = l1.scrollWidth / 2

    /* Line 1 — RTL */
    const tw1 = gsap.fromTo(l1,
      { x: 0 },
      { x: -tileW, duration: DURATION, ease: 'none', repeat: -1 },
    )

    /* Line 2 — LTR */
    gsap.set(l2, { x: -tileW })
    const tw2 = gsap.fromTo(l2,
      { x: -tileW },
      { x: 0, duration: DURATION, ease: 'none', repeat: -1 },
    )

    /* Medallion slow spin */
    const twMedal = gsap.to(medalRef.current, {
      rotation: 360,
      duration: 20,
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

    return () => { tw1.kill(); tw2.kill(); twMedal.kill(); twDot.kill() }
  }, [])

  const tiles = Array.from({ length: REPEAT }, (_, i) => (
    <span key={i} className="inline-flex items-center shrink-0">
      <span
        className="font-sans font-black tracking-[0.22em] text-white/60 select-none"
        style={{ fontSize: 'clamp(36px,5.5vw,72px)' }}
      >
        {TEXT}
      </span>
      <span className="mx-5 w-1 h-1 rounded-full bg-ag-apex/25 shrink-0 inline-block" />
    </span>
  ))

  /* SVG circle path radius = 57 (half of 140 - some margin) */
  const R  = 57
  const CX = 70
  const CY = 70

  return (
    <div className="relative overflow-hidden select-none" style={{ height: 140 }}>

      {/* Line 1 — RTL */}
      <div className="overflow-hidden absolute inset-x-0" style={{ top: 12 }}>
        <div ref={line1Ref} className="flex whitespace-nowrap will-change-transform">
          {tiles}{tiles}
        </div>
      </div>

      {/* Line 2 — LTR */}
      <div className="overflow-hidden absolute inset-x-0" style={{ bottom: 12 }}>
        <div ref={line2Ref} className="flex whitespace-nowrap will-change-transform">
          {tiles}{tiles}
        </div>
      </div>

      {/* Medallion — centred */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
        <Link
          href="/contact"
          className="relative flex items-center justify-center pointer-events-auto group"
          style={{ width: 140, height: 140 }}
          aria-label={contactLabel}
        >
          {/* Spinning text ring */}
          <div ref={medalRef} className="absolute inset-0" aria-hidden="true">
            <svg viewBox={`0 0 ${CX * 2} ${CY * 2}`} className="w-full h-full">
              <defs>
                <path
                  id="medal-ring"
                  d={`M ${CX},${CY} m -${R},0 a ${R},${R} 0 1,1 ${R * 2},0 a ${R},${R} 0 1,1 -${R * 2},0`}
                />
              </defs>
              <text
                style={{ fontSize: 9, fontFamily: 'inherit', fontWeight: 600 }}
                fill="rgba(255,255,255,0.6)"
                letterSpacing="2.8"
              >
                <textPath href="#medal-ring">
                  {medallionText}
                </textPath>
              </text>
            </svg>
          </div>

          {/* Inner circle */}
          <div className="relative w-16 h-16 rounded-full bg-ag-apex/15 border border-ag-apex/40 flex items-center justify-center
            group-hover:bg-ag-apex group-hover:border-ag-apex transition-all duration-300">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"
              className="text-ag-apex group-hover:text-ag-navy transition-colors duration-300">
              <path d="M2 8h12M9 3l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>

          {/* Pulse dot */}
          <span
            ref={dotRef}
            className="absolute top-3 right-3 w-2 h-2 rounded-full bg-ag-apex"
          />
        </Link>
      </div>
    </div>
  )
}
