'use client'

import { useEffect, useRef } from 'react'
import { gsap } from '@/lib/gsap'
import Link from 'next/link'

const TEXT = 'AEGRYN'
const REPEAT = 14

/**
 * Two-line infinite marquee — line 1 RTL, line 2 LTR — Aegryn branding.
 * Centre: animated circular "Contact" medallion.
 */
export function FooterMarquee() {
  const line1Ref = useRef<HTMLDivElement>(null)
  const line2Ref = useRef<HTMLDivElement>(null)
  const medalRef = useRef<HTMLDivElement>(null)
  const dotRef   = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const l1 = line1Ref.current
    const l2 = line2Ref.current
    if (!l1 || !l2) return

    /* Measure one tile width */
    const tileW = l1.scrollWidth / 2

    /* Line 1 — right to left */
    const tl1 = gsap.fromTo(l1,
      { x: 0 },
      { x: -tileW, duration: 28, ease: 'none', repeat: -1 },
    )

    /* Line 2 — left to right (start at -tileW so it fills screen) */
    gsap.set(l2, { x: -tileW })
    const tl2 = gsap.fromTo(l2,
      { x: -tileW },
      { x: 0, duration: 28, ease: 'none', repeat: -1 },
    )

    /* Medal slow spin */
    gsap.to(medalRef.current, {
      rotation: 360,
      duration: 14,
      ease: 'none',
      repeat: -1,
    })

    /* Dot pulse */
    gsap.to(dotRef.current, {
      scale: 1.5,
      opacity: 0.4,
      duration: 0.8,
      ease: 'power1.inOut',
      yoyo: true,
      repeat: -1,
    })

    return () => { tl1.kill(); tl2.kill() }
  }, [])

  const tiles = Array.from({ length: REPEAT }, (_, i) => (
    <span key={i} className="inline-flex items-center shrink-0">
      <span className="font-sans font-black tracking-[0.22em] text-white/12 select-none"
        style={{ fontSize: 'clamp(40px,6vw,80px)' }}>
        {TEXT}
      </span>
      <span className="mx-6 w-1.5 h-1.5 rounded-full bg-ag-apex/30 shrink-0 inline-block" />
    </span>
  ))

  return (
    <div className="relative overflow-hidden py-2 border-t border-white/8 select-none">

      {/* Line 1 — RTL */}
      <div className="overflow-hidden">
        <div ref={line1Ref} className="flex whitespace-nowrap will-change-transform">
          {/* Duplicate for seamless loop */}
          {tiles}{tiles}
        </div>
      </div>

      {/* Line 2 — LTR */}
      <div className="overflow-hidden mt-1">
        <div ref={line2Ref} className="flex whitespace-nowrap will-change-transform">
          {tiles}{tiles}
        </div>
      </div>

      {/* Circular contact medallion — centred, floating above */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
        <Link
          href="/contact"
          className="relative flex items-center justify-center pointer-events-auto group"
          style={{ width: 96, height: 96 }}
          aria-label="Nous contacter"
        >
          {/* Spinning text ring */}
          <div
            ref={medalRef}
            className="absolute inset-0"
            aria-hidden="true"
          >
            <svg viewBox="0 0 96 96" className="w-full h-full">
              <defs>
                <path id="medal-circle" d="M 48,48 m -36,0 a 36,36 0 1,1 72,0 a 36,36 0 1,1 -72,0" />
              </defs>
              <text className="font-sans font-semibold" style={{ fontSize: 9.5 }} fill="rgba(255,255,255,0.65)" letterSpacing="3.2">
                <textPath href="#medal-circle">
                  CONTACT · AEGRYN · CONTACT · AEGRYN ·
                </textPath>
              </text>
            </svg>
          </div>

          {/* Inner circle */}
          <div className="relative w-14 h-14 rounded-full bg-ag-apex/15 border border-ag-apex/40 flex items-center justify-center
            group-hover:bg-ag-apex group-hover:border-ag-apex transition-all duration-400">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"
              className="text-ag-apex group-hover:text-ag-navy transition-colors duration-300">
              <path d="M2 8h12M9 3l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>

          {/* Live dot */}
          <span
            ref={dotRef}
            className="absolute top-2 right-2 w-2 h-2 rounded-full bg-ag-apex"
          />
        </Link>
      </div>
    </div>
  )
}
