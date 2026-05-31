'use client'

import { useEffect, useRef } from 'react'
import { gsap }              from '@/lib/gsap'
import { AegrynLogo }        from '@/components/brand/AegrynLogo'

/**
 * Bloc Vision + ADN + Mission.
 * Logo Aegryn en fond flou progressif DERRIÈRE Vision + ADN (stacking naturel).
 * La section Mission arrive en clip-reveal depuis le bas à la fin du scrub.
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
  const outerRef   = useRef<HTMLDivElement>(null)
  const logoRef    = useRef<HTMLDivElement>(null)
  const missionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const outer   = outerRef.current
    const logo    = logoRef.current
    const mission = missionRef.current
    if (!outer || !logo || !mission) return

    const ctx = gsap.context(() => {
      /* Logo: blur s'intensifie en arrière-plan au scroll (pas pinné) */
      gsap.fromTo(logo,
        { scale: 1,   filter: 'blur(0px)',  opacity: 0.10 },
        { scale: 6.5, filter: 'blur(20px)', opacity: 0.20, ease: 'none',
          scrollTrigger: {
            trigger: outer,
            start:   'top 80%',
            end:     'bottom 30%',
            scrub:   1.2,
          },
        },
      )

      /* Mission: clip-reveal depuis le bas au scroll (pinné court) */
      gsap.fromTo(mission,
        { clipPath: 'inset(100% 0% 0% 0%)', pointerEvents: 'none' },
        { clipPath: 'inset(0% 0% 0% 0%)',   pointerEvents: 'auto', ease: 'expo.inOut',
          scrollTrigger: {
            trigger: outer,
            start:   'bottom 70%',
            end:     'bottom top',
            scrub:   1,
          },
        },
      )
    })

    return () => ctx.revert()
  }, [])

  return (
    /* Outer = déclenche les animations */
    <div ref={outerRef} className="relative">

      {/* ── Logo en fond absolu centré — visible derrière tout le contenu ── */}
      <div
        className="sticky top-0 h-0 overflow-visible pointer-events-none select-none z-0"
        aria-hidden="true"
      >
        <div className="absolute inset-x-0 top-0 flex items-center justify-center"
          style={{ height: '100vh' }}>
          <div
            ref={logoRef}
            className="will-change-transform"
            style={{ transformOrigin: 'center center', opacity: 0.10 }}
          >
            <AegrynLogo size={160} variant="mark" />
          </div>
        </div>
      </div>

      {/* ── Vision ── */}
      <section className="relative z-10 border-b border-ag-border bg-white/70 backdrop-blur-0">
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

      {/* ── ADN ── */}
      <div className="relative z-10">
        {dnaContent}
      </div>

      {/* ── Mission — clip-reveal depuis le bas ── */}
      <div
        ref={missionRef}
        className="relative z-20 bg-ag-white"
        style={{ clipPath: 'inset(100% 0% 0% 0%)' }}
      >
        {missionContent}
      </div>
    </div>
  )
}
