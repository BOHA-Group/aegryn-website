'use client'

import { useEffect, useRef } from 'react'
import { gsap }              from '@/lib/gsap'
import { AegrynLogo }        from '@/components/brand/AegrynLogo'

/**
 * Bloc Vision + ADN + Mission.
 * Séquence logo pinné 3 phases :
 *   1. Logo net + clair (opacity 0.45)
 *   2. Zoom in + flou progressif (scale → 8, blur → 24px)
 *   3. Fondu sortie (opacity → 0)
 * Vision + ADN s'affichent par-dessus (bg semi-transparent).
 * Mission arrive en clip-reveal depuis le bas.
 */
export function VisionMissionBlock({
  visionLabel,
  visionText,
  dnaContent,
  missionContent,
}: {
  visionLabel:    React.ReactNode
  visionText:     React.ReactNode
  dnaContent:     React.ReactNode
  missionContent: React.ReactNode
}) {
  const wrapRef    = useRef<HTMLDivElement>(null)
  const logoRef    = useRef<HTMLDivElement>(null)
  const missionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const wrap    = wrapRef.current
    const logo    = logoRef.current
    const mission = missionRef.current
    if (!wrap || !logo || !mission) return

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger:       wrap,
          start:         'top top',
          end:           '+=260%',
          pin:           true,
          scrub:         1.4,
          anticipatePin: 1,
        },
      })

      /* Phase 1 (0–30%) : logo visible net, pas de flou */
      tl.fromTo(logo,
        { scale: 1,   filter: 'blur(0px)',  opacity: 0.45 },
        { scale: 2.5, filter: 'blur(0px)',  opacity: 0.45, ease: 'none', duration: 0.30 },
        0,
      )

      /* Phase 2 (30–70%) : zoom + flou s'intensifie */
      tl.to(logo,
        { scale: 8, filter: 'blur(24px)', opacity: 0.22, ease: 'none', duration: 0.40 },
        0.30,
      )

      /* Phase 3 (70–85%) : logo disparaît */
      tl.to(logo,
        { opacity: 0, ease: 'none', duration: 0.15 },
        0.70,
      )

      /* Phase 4 (80–100%) : Mission slide depuis le bas */
      tl.fromTo(mission,
        { yPercent: 100 },
        { yPercent: 0, ease: 'expo.inOut', duration: 0.22 },
        0.80,
      )
    })

    return () => ctx.revert()
  }, [])

  return (
    <div ref={wrapRef} className="relative overflow-hidden" style={{ minHeight: '100vh' }}>

      {/* ── Logo fond centré ── */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
        aria-hidden="true"
      >
        <div
          ref={logoRef}
          className="will-change-transform"
          style={{ transformOrigin: 'center center', opacity: 0.45 }}
        >
          <AegrynLogo size={180} variant="mark" />
        </div>
      </div>

      {/* ── Contenu scrollable Vision + ADN ── */}
      <div className="relative z-10 overflow-y-auto" style={{ maxHeight: '100vh' }}>

        {/* Vision */}
        <section className="border-b border-ag-border bg-ag-off-white/80 backdrop-blur-sm">
          <div className="mx-auto max-w-7xl px-6 md:px-12">
            <div className="grid md:grid-cols-[280px_1fr] divide-y md:divide-y-0 md:divide-x divide-ag-border">
              <div className="py-16 md:pr-16 flex items-start">
                {visionLabel}
              </div>
              <div className="py-16 md:px-16">
                {visionText}
              </div>
            </div>
          </div>
        </section>

        {/* ADN */}
        <div className="bg-ag-white/80 backdrop-blur-sm">
          {dnaContent}
        </div>
      </div>

      {/* ── Mission — slide depuis le bas ── */}
      <div
        ref={missionRef}
        className="absolute inset-0 z-20 bg-ag-white overflow-auto"
        style={{ transform: 'translateY(100%)' }}
      >
        {missionContent}
      </div>
    </div>
  )
}
