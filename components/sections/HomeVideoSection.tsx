'use client'

import { useEffect, useRef } from 'react'
import { gsap } from '@/lib/gsap'

/**
 * HomeVideoSection — Page accueil, entre HeroMountain et AssetGrid.
 *
 * Séquence pinée (scrub) :
 *   Phase 0–40%  : vidéo apparaît en fondue (opacity 0→1), plein écran immersif
 *   Phase 40–70% : blur progressif de la vidéo (0→12px) + overlay sombre (0→0.55)
 *   Phase 70–100%: section "Notre Écosystème" (AssetGrid) remonte par-dessus —
 *                  la vidéo reste visible et floutée derrière
 *
 * Le conteneur children (AssetGrid) est rendu ICI pour que le pin fonctionne
 * correctement en un seul ScrollTrigger.
 */
export function HomeVideoSection({ children }: { children: React.ReactNode }) {
  const wrapRef    = useRef<HTMLDivElement>(null)
  const videoRef   = useRef<HTMLVideoElement>(null)
  const blurRef    = useRef<HTMLDivElement>(null)
  const overlayRef = useRef<HTMLDivElement>(null)
  const nextRef    = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const wrap = wrapRef.current
    if (!wrap) return

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger:       wrap,
          start:         'top top',
          end:           '+=280%',
          pin:           true,
          scrub:         1.2,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      })

      /* Phase 0–40% — vidéo apparaît en fondue immersive */
      tl.fromTo(videoRef.current,
        { opacity: 0 },
        { opacity: 1, ease: 'none', duration: 0.40 },
        0,
      )

      /* Phase 40–70% — blur vidéo + overlay sombre progressifs */
      tl.fromTo(blurRef.current,
        { backdropFilter: 'blur(0px)', WebkitBackdropFilter: 'blur(0px)' },
        { backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', ease: 'none', duration: 0.30 },
        0.40,
      )
      tl.fromTo(overlayRef.current,
        { opacity: 0 },
        { opacity: 0.55, ease: 'none', duration: 0.30 },
        0.40,
      )

      /* Phase 70–100% — section suivante remonte par-dessus */
      tl.fromTo(nextRef.current,
        { yPercent: 100 },
        { yPercent: 0, ease: 'expo.inOut', duration: 0.30 },
        0.70,
      )

    }, wrap)

    return () => ctx.revert()
  }, [])

  return (
    <div ref={wrapRef} className="relative overflow-hidden" style={{ height: '100vh' }}>

      {/* ── Vidéo plein fond — immersive ── */}
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover object-center will-change-[opacity]"
        style={{ opacity: 0 }}
        autoPlay
        muted
        loop
        playsInline
        poster="/images/home-mountains.png"
        preload="auto"
      >
        <source src="/videos/assets-animation1.mp4" type="video/mp4" />
      </video>

      {/* ── Couche blur (GSAP scrub) ── */}
      <div
        ref={blurRef}
        className="absolute inset-0 pointer-events-none"
        style={{ backdropFilter: 'blur(0px)', WebkitBackdropFilter: 'blur(0px)' }}
      />

      {/* ── Overlay sombre progressif ── */}
      <div
        ref={overlayRef}
        className="absolute inset-0 bg-ag-navy pointer-events-none"
        style={{ opacity: 0 }}
      />

      {/* ── Section suivante (AssetGrid) — slide depuis le bas ── */}
      <div
        ref={nextRef}
        className="absolute inset-x-0 bottom-0 top-0 overflow-auto"
        style={{ transform: 'translateY(100%)' }}
      >
        {children}
      </div>
    </div>
  )
}
