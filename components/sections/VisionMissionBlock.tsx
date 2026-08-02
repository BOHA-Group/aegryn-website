'use client'

import { useLayoutEffect, useRef } from 'react'
import { gsap }              from '@/lib/gsap'

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
  const missionRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const wrap    = wrapRef.current
    const mission = missionRef.current
    if (!wrap || !mission) return

    const ctx = gsap.context(() => {

      /* Pin + Mission slide depuis le bas */
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger:       wrap,
          start:         'top top',
          end:           '+=90%',
          pin:           true,
          scrub:         0.8,
          anticipatePin: 1,
        },
      })

      /* (75–100%) : Mission slide depuis le bas */
      tl.fromTo(mission,
        { yPercent: 100 },
        { yPercent: 0, ease: 'expo.inOut', duration: 0.25 },
        0.75,
      )
    })

    return () => ctx.revert()
  }, [])

  return (
    <div ref={wrapRef} className="relative overflow-hidden" style={{ minHeight: '100vh' }}>

      {/* ── Contenu Vision + ADN ── */}
      <div className="relative z-10">

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
