'use client'

import { useEffect, useRef } from 'react'
import { gsap }              from '@/lib/gsap'
import { AegrynLogo }        from '@/components/brand/AegrynLogo'

/**
 * Bloc Vision + ADN + Mission.
 * Le logo Aegryn est en fond flou DERRIÈRE les sections Vision et ADN.
 * La section Mission slide par-dessus à la fin (clip reveal depuis le bas).
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
  const nextRef    = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const wrap = wrapRef.current
    const logo = logoRef.current
    const next = nextRef.current
    if (!wrap || !logo || !next) return

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: wrap,
          start:   'top top',
          end:     '+=280%',
          pin:     true,
          scrub:   1.4,
          anticipatePin: 1,
        },
      })

      /* Phase 1 (0→50%) — logo grandit + devient très flou */
      tl.fromTo(logo,
        { scale: 1,  filter: 'blur(0px)',  opacity: 0.12 },
        { scale: 9,  filter: 'blur(22px)', opacity: 0.22, ease: 'none', duration: 0.5 },
        0,
      )

      /* Phase 2 (55→100%) — section Mission monte depuis le bas */
      tl.fromTo(next,
        { yPercent: 100 },
        { yPercent: 0, ease: 'expo.out', duration: 0.5 },
        0.52,
      )
    })

    return () => ctx.revert()
  }, [])

  return (
    <div ref={wrapRef} className="relative w-full overflow-hidden" style={{ height: '100vh' }}>

      {/* ── Fond logo flou — centré derrière tout le contenu ── */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none bg-ag-off-white">
        <div
          ref={logoRef}
          className="will-change-transform"
          style={{ transformOrigin: 'center center', opacity: 0.12 }}
        >
          <AegrynLogo size={140} variant="mark" />
        </div>
      </div>

      {/* ── Contenu principal : Vision + ADN scrollable dans la fenêtre ── */}
      <div className="relative z-10 h-full overflow-y-auto">
        {/* Vision */}
        <section className="border-b border-ag-border">
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
        {dnaContent}
      </div>

      {/* ── Section Mission — démarre hors écran en bas ── */}
      <div
        ref={nextRef}
        className="absolute inset-x-0 bottom-0 top-0 bg-ag-white overflow-auto z-20"
        style={{ transform: 'translateY(100%)' }}
      >
        {missionContent}
      </div>
    </div>
  )
}
