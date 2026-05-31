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
      /*
       * Pattern Rolex GMT Master II — scrub strict, ease: 'none' sur tout.
       * Vidéo STATIQUE — aucun Ken Burns, aucun zoom.
       * Texte : fade-up opacity+y scrubé linéairement.
       * Section suivante : clip-path inset reveal depuis le bas (pas de yPercent).
       */
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger:       wrap,
          start:         'top top',
          end:           '+=280%',
          pin:           true,
          scrub:         true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      })

      /*
       * Phase 0–15% — vidéo apparaît RAPIDEMENT (overlap temporaire avec texte Mission)
       * La vidéo monte en opacité pendant que la dernière section ManifestoSection
       * est encore visible → crée l'effet de superposition immersive demandé.
       */
      tl.fromTo(videoRef.current,
        { opacity: 0 },
        { opacity: 1, ease: 'none', duration: 0.15 },
        0,
      )

      /*
       * Phase 0–25% — overlay semi-transparent sur les premières secondes
       * Couvre temporairement le texte "Notre Mission" encore visible en dessous
       * lors du début du pin → effet de fondu immersif progressif
       */
      tl.fromTo(overlayRef.current,
        { opacity: 0.55 },
        { opacity: 0, ease: 'none', duration: 0.25 },
        0,
      )

      /* Phase 25–55% — blur progressif de la vidéo, ease: none */
      tl.fromTo(blurRef.current,
        { backdropFilter: 'blur(0px)', WebkitBackdropFilter: 'blur(0px)' },
        { backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', ease: 'none', duration: 0.30 },
        0.25,
      )

      /* Phase 40–60% — overlay sombre progressif avant reveal, ease: none */
      tl.fromTo(overlayRef.current,
        { opacity: 0 },
        { opacity: 0.45, ease: 'none', duration: 0.20 },
        0.40,
      )

      /* Phase 60–100% — clip-path inset reveal Rolex-style */
      tl.fromTo(nextRef.current,
        { clipPath: 'inset(100% 0 0 0)' },
        { clipPath: 'inset(0% 0 0 0)', ease: 'none', duration: 0.40 },
        0.60,
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
        <source src="/videos/assets-animation1-web.mp4" type="video/mp4" />
      </video>

      {/* ── Couche blur (GSAP scrub) ── */}
      <div
        ref={blurRef}
        className="absolute inset-0 pointer-events-none"
        style={{ backdropFilter: 'blur(0px)', WebkitBackdropFilter: 'blur(0px)' }}
      />

      {/* ── Overlay — démarre semi-opaque pour couvrir le texte Mission, puis se dissipe ── */}
      <div
        ref={overlayRef}
        className="absolute inset-0 bg-ag-navy pointer-events-none"
        style={{ opacity: 0.55 }}
      />

      {/* ── Section suivante (AssetGrid) — clip-path reveal Rolex-style ── */}
      <div
        ref={nextRef}
        className="absolute inset-x-0 bottom-0 top-0 overflow-auto"
        style={{ clipPath: 'inset(100% 0 0 0)' }}
      >
        {children}
      </div>
    </div>
  )
}
