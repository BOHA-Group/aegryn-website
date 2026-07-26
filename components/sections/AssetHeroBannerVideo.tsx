'use client'

import { useEffect, useRef } from 'react'
import Image                  from 'next/image'
import { gsap, SplitText }    from '@/lib/gsap'

/**
 * AssetHeroBannerVideo — Page actifs. Standard Rolex 8.
 *
 * Séquence pinée (scrub) :
 *   Phase 0–35%  : image poster Ken Burns (scale 1.12→1.0) + vidéo fondue (opacity 0→1)
 *   Phase 30–55% : texte superposé clip-reveal ligne par ligne (SplitText lines)
 *   Phase 55–75% : blur progressif vidéo (0→12px) + overlay sombre
 *   Phase 75–100%: children (AssetGridWithDrawer) remonte par-dessus — chips visibles
 *                  sur fond vidéo floutée → effet immersif overlap
 */
interface AssetHeroBannerVideoProps {
  label?: string
  title?: string
  sub?:   string
}

export function AssetHeroBannerVideo({ label, title, sub }: AssetHeroBannerVideoProps = {}) {
  const wrapRef    = useRef<HTMLDivElement>(null)
  const photoRef   = useRef<HTMLDivElement>(null)
  const videoRef   = useRef<HTMLVideoElement>(null)
  const blurRef    = useRef<HTMLDivElement>(null)
  const overlayRef = useRef<HTMLDivElement>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const subRef     = useRef<HTMLParagraphElement>(null)
  const labelRef   = useRef<HTMLParagraphElement>(null)

  useEffect(() => {
    const wrap    = wrapRef.current
    const heading = headingRef.current
    if (!wrap || !heading) return

    /* ── SplitText lignes ── */
    const split = new SplitText(heading, { type: 'lines', linesClass: 'ahb-line' })

    const ctx = gsap.context(() => {
      /*
       * Pattern Rolex GMT Master II — scrub: true strict, ease: 'none' partout.
       * Image/vidéo STATIQUE — aucun Ken Burns.
       * Texte : fade-up opacity+y scrubé linéairement.
       * Section suivante : clip-path inset(100%→0%) depuis le bas.
       */
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger:       wrap,
          start:         'top top',
          end:           '+=300%',
          pin:           true,
          scrub:         true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      })

      /* Phase 0–30% — vidéo fondue opacity 0→1, ease: none */
      tl.fromTo(videoRef.current,
        { opacity: 0 },
        { opacity: 1, ease: 'none', duration: 0.30 },
        0,
      )

      /* Phase 20–35% — label fade-up scrubé */
      tl.fromTo(labelRef.current,
        { opacity: 0, y: 14 },
        { opacity: 1, y: 0, ease: 'none', duration: 0.15 },
        0.20,
      )

      /* Phase 28–50% — titre lignes fade-up scrubé, stagger inline */
      split.lines.forEach((line, i) => {
        tl.fromTo(line,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, ease: 'none', duration: 0.14 },
          0.28 + i * 0.06,
        )
      })

      /* Phase 48–60% — sous-texte fade-up scrubé */
      tl.fromTo(subRef.current,
        { opacity: 0, y: 14 },
        { opacity: 1, y: 0, ease: 'none', duration: 0.12 },
        0.48,
      )

      /* Phase 60–80% — légère vignette finale, ease: none */
      tl.fromTo(overlayRef.current,
        { opacity: 0 },
        { opacity: 0.20, ease: 'none', duration: 0.20 },
        0.60,
      )


    }, wrap)

    return () => { ctx.revert(); split.revert() }
  }, [])

  return (
    <div
      ref={wrapRef}
      className="relative overflow-hidden"
      style={{ height: '100vh' }}
    >
      {/* ── Couche 1 : image poster statique (pas de Ken Burns — Rolex standard) ── */}
      <div ref={photoRef} className="absolute inset-0">
        <Image
          src="/images/assets-intro.jpg"
          alt="Aegryn — Nos actifs numériques"
          fill
          priority
          quality={95}
          className="object-cover object-center"
          sizes="100vw"
        />
      </div>

      {/* ── Couche 2 : vidéo assets-animation2 — fondue immersive ── */}
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover object-center will-change-[opacity]"
        style={{ opacity: 0 }}
        autoPlay
        muted
        loop
        playsInline
        poster="/images/assets-intro.jpg"
        preload="auto"
      >
        <source src="/videos/assets-animation2-web.mp4" type="video/mp4" />
      </video>

      {/* ── Couche 3 : blur progressif (scrub GSAP) ── */}
      <div
        ref={blurRef}
        className="absolute inset-0 pointer-events-none"
        style={{ backdropFilter: 'blur(0px)', WebkitBackdropFilter: 'blur(0px)' }}
      />

      {/* ── Couche 4 : overlay sombre progressif ── */}
      <div
        ref={overlayRef}
        className="absolute inset-0 bg-ag-navy pointer-events-none"
        style={{ opacity: 0 }}
      />

      {/* ── Couche 5 : gradient texte permanent ── */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/20 to-black/75 pointer-events-none" />

      {/* ── Couche 6 : texte superposé ── */}
      <div className="absolute inset-0 flex flex-col justify-end pointer-events-none z-10">
        <div className="max-w-7xl mx-auto w-full px-6 md:px-12 pb-14">
          <p
            ref={labelRef}
            className="font-sans font-semibold text-[10px] tracking-[0.3em] uppercase text-white/70 mb-5 flex items-center gap-3"
            style={{ opacity: 0 }}
          >
            <span className="w-8 h-px bg-white/40 inline-block" />
            {label ?? 'Aegryn — Notre écosystème'}
          </p>
          <h2
            ref={headingRef}
            className="font-sans font-bold text-white tracking-[-0.03em] leading-[1.1] mb-6 overflow-hidden whitespace-pre-line [&_.ahb-line]:overflow-hidden"
            style={{ fontSize: 'clamp(40px,5.5vw,80px)' }}
          >
            {title ?? 'Ce que nous\nconstruisons.'}
          </h2>
          <p
            ref={subRef}
            className="font-sans font-normal text-[14px] text-white/75 leading-relaxed max-w-sm"
            style={{ opacity: 0 }}
          >
            {sub ?? '6 actifs · 3 catégories · Suisse & Europe'}
          </p>
        </div>
      </div>

    </div>
  )
}
