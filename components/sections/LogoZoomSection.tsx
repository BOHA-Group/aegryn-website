'use client'

import { useEffect, useRef } from 'react'
import { gsap }              from '@/lib/gsap'
import { AegrynLogo }        from '@/components/brand/AegrynLogo'

/**
 * Section "Notre Vision" — logo Aegryn avec effet zoom au scroll (GSAP ScrollTrigger scrub).
 * Scale : 1 → 2.4 sur toute la hauteur de la section pinée.
 * L'apex #5ADDA4 devient plus visible à mesure que le logo grossit.
 */
export function LogoZoomSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const logoRef    = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    const logo    = logoRef.current
    if (!section || !logo) return

    const ctx = gsap.context(() => {
      gsap.fromTo(
        logo,
        { scale: 1, opacity: 0.85 },
        {
          scale:   2.4,
          opacity: 1,
          ease:    'none',
          scrollTrigger: {
            trigger:  section,
            start:    'top 60%',
            end:      'bottom 20%',
            scrub:    1.2,
          },
        },
      )
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <div
      ref={sectionRef}
      className="py-8 md:pl-8 flex items-center justify-center overflow-hidden"
      style={{ height: '320px' }}
    >
      <div
        ref={logoRef}
        className="will-change-transform origin-center"
        style={{ transformOrigin: 'center center' }}
      >
        <AegrynLogo size={100} variant="mark" />
      </div>
    </div>
  )
}
