'use client'

import { useEffect, useRef } from 'react'
import { gsap }              from '@/lib/gsap'
import { AegrynLogo }        from '@/components/brand/AegrynLogo'

/**
 * Section "Notre Vision" — effet cinématique Rolex-style.
 *
 * Pin sur 300vh :
 *   Phase 1 (0→60%)  : logo scale 1 → 12, blur 0 → 18px, overlay noir 0 → 0.55
 *   Phase 2 (60→100%): section "Notre Mission" remonte par-dessus (clip reveal depuis le bas)
 *
 * La section Mission est rendue ICI comme "next panel" pour que le pin
 * fonctionne correctement en un seul ScrollTrigger.
 */
export function LogoZoomSection({ missionSlot }: { missionSlot?: React.ReactNode }) {
  const wrapRef    = useRef<HTMLDivElement>(null)   // conteneur pin
  const stageRef   = useRef<HTMLDivElement>(null)   // fond logo (pané)
  const logoRef    = useRef<HTMLDivElement>(null)
  const overlayRef = useRef<HTMLDivElement>(null)
  const nextRef    = useRef<HTMLDivElement>(null)   // section suivante qui monte

  useEffect(() => {
    const wrap  = wrapRef.current
    const stage = stageRef.current
    const logo  = logoRef.current
    const over  = overlayRef.current
    const next  = nextRef.current
    if (!wrap || !stage || !logo || !over || !next) return

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: wrap,
          start:   'top top',
          end:     '+=300%',
          pin:     true,
          scrub:   1.4,
          anticipatePin: 1,
        },
      })

      /* Phase 1 — zoom logo + blur + overlay */
      tl.fromTo(logo,
        { scale: 1,    filter: 'blur(0px)' },
        { scale: 12,   filter: 'blur(18px)', ease: 'none', duration: 0.6 },
        0,
      )
      tl.fromTo(over,
        { opacity: 0 },
        { opacity: 0.58, ease: 'none', duration: 0.6 },
        0,
      )

      /* Phase 2 — section suivante monte depuis le bas */
      tl.fromTo(next,
        { yPercent: 100 },
        { yPercent: 0, ease: 'expo.out', duration: 0.5 },
        0.55,
      )
    })

    return () => ctx.revert()
  }, [])

  return (
    /* Hauteur totale = 100vh (visible) + espace scroll 300vh géré par pin */
    <div ref={wrapRef} className="relative w-full overflow-hidden" style={{ height: '100vh' }}>

      {/* Stage logo — centré, fond off-white */}
      <div
        ref={stageRef}
        className="absolute inset-0 flex items-center justify-center bg-ag-off-white"
      >
        <div
          ref={logoRef}
          className="will-change-transform"
          style={{ transformOrigin: 'center center' }}
        >
          <AegrynLogo size={120} variant="mark" />
        </div>

        {/* Overlay noir progressif */}
        <div
          ref={overlayRef}
          className="absolute inset-0 bg-black"
          style={{ opacity: 0 }}
        />
      </div>

      {/* Section suivante (Mission) — démarre hors écran en bas */}
      <div
        ref={nextRef}
        className="absolute inset-x-0 bottom-0 top-0 bg-ag-white overflow-auto"
        style={{ transform: 'translateY(100%)' }}
      >
        {missionSlot}
      </div>
    </div>
  )
}
