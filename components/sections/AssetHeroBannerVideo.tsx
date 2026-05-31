'use client'

import { useEffect, useRef } from 'react'
import Image                  from 'next/image'
import { gsap, SplitText }    from '@/lib/gsap'

/**
 * AssetHeroBannerVideo — Standard Rolex 8 appliqué à la page actifs.
 *
 * Séquence (pin sur ≈3s de scroll = 300vh) :
 *   Phase 0–30%  : image assets-intro visible, Ken Burns scale 1.08→1.0
 *   Phase 30–65% : vidéo cross-fade opacity 0→1 par-dessus l'image (fondue)
 *   Phase 65–85% : texte clip-reveal ligne par ligne (SplitText lines, stagger 0.08)
 *   Phase 85–100%: sub-texte + compteur fade-up — section dépinne → cartes apparaissent
 *
 * Si aucune vidéo n'est disponible (videoSrc absent), la section se comporte
 * exactement comme AssetHeroBanner (Ken Burns + texte reveal).
 *
 * Usage :
 *   <AssetHeroBannerVideo videoSrc="/videos/assets-reel.mp4" />
 */
export function AssetHeroBannerVideo({ videoSrc }: { videoSrc?: string }) {
  const wrapRef     = useRef<HTMLDivElement>(null)
  const photoRef    = useRef<HTMLDivElement>(null)
  const videoRef    = useRef<HTMLVideoElement>(null)
  const headingRef  = useRef<HTMLHeadingElement>(null)
  const subRef      = useRef<HTMLParagraphElement>(null)
  const labelRef    = useRef<HTMLParagraphElement>(null)
  const textRef     = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const wrap    = wrapRef.current
    const heading = headingRef.current
    if (!wrap || !heading) return

    /* ── SplitText lignes ── */
    const split = new SplitText(heading, { type: 'lines', linesClass: 'ahb-line' })
    split.lines.forEach((line) => {
      const w = document.createElement('div')
      w.style.overflow = 'hidden'
      w.style.display  = 'block'
      ;(line as HTMLElement).parentNode?.insertBefore(w, line)
      w.appendChild(line)
    })

    const ctx = gsap.context(() => {

      /* ── Timeline principale — scrub (1 unité = scroll 300vh) ── */
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger:       wrap,
          start:         'top top',
          end:           '+=300%',
          pin:           true,
          scrub:         1.2,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      })

      /* Phase 0–30% — Ken Burns dezoom image */
      tl.fromTo(photoRef.current,
        { scale: 1.12 },
        { scale: 1.0, ease: 'none', duration: 0.30 },
        0,
      )

      /* Phase 30–65% — cross-fade vidéo par-dessus image (si disponible) */
      if (videoSrc && videoRef.current) {
        tl.fromTo(videoRef.current,
          { opacity: 0 },
          { opacity: 1, ease: 'none', duration: 0.35 },
          0.30,
        )
      }

      /* Phase 55–75% — label fade */
      tl.fromTo(labelRef.current,
        { opacity: 0, y: 6 },
        { opacity: 1, y: 0, ease: 'expo.out', duration: 0.12 },
        0.55,
      )

      /* Phase 62–85% — titre clip reveal ligne par ligne */
      tl.fromTo(split.lines,
        { yPercent: 110 },
        { yPercent: 0, stagger: 0.08, ease: 'expo.out', duration: 0.16 },
        0.62,
      )

      /* Phase 78–92% — sous-texte fade-up */
      tl.fromTo(subRef.current,
        { opacity: 0, y: 14 },
        { opacity: 1, y: 0, ease: 'expo.out', duration: 0.13 },
        0.78,
      )

    }, wrap)

    return () => { ctx.revert(); split.revert() }
  }, [videoSrc])

  return (
    <div
      ref={wrapRef}
      className="relative overflow-hidden"
      style={{ height: '100vh' }}
    >
      {/* ── Couche 1 : image fond (toujours présente, sert de poster) ── */}
      <div ref={photoRef} className="absolute inset-0 will-change-transform">
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

      {/* ── Couche 2 : vidéo cross-fade (Standard 8 — optionnelle) ── */}
      {videoSrc && (
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover object-center will-change-[opacity]"
          style={{ opacity: 0 }}
          autoPlay
          muted
          loop
          playsInline
          poster="/images/assets-intro.jpg"
        >
          <source src={videoSrc.replace(/\.mp4$/, '.webm')} type="video/webm" />
          <source src={videoSrc} type="video/mp4" />
        </video>
      )}

      {/* ── Couche 3 : gradient de lisibilité texte ── */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/25 to-black/80 pointer-events-none" />

      {/* ── Couche 4 : texte superposé ── */}
      <div
        ref={textRef}
        className="absolute inset-0 flex flex-col justify-end pointer-events-none"
      >
        <div className="max-w-7xl mx-auto w-full px-6 md:px-12 pb-14">
          <p
            ref={labelRef}
            className="font-sans font-semibold text-[10px] tracking-[0.3em] uppercase text-white/70 mb-5 flex items-center gap-3"
            style={{ opacity: 0 }}
          >
            <span className="w-8 h-px bg-white/40 inline-block" />
            Aegryn — Notre écosystème
          </p>

          <h2
            ref={headingRef}
            className="font-sans font-bold text-white tracking-[-0.03em] leading-[0.9] mb-6 overflow-hidden"
            style={{ fontSize: 'clamp(40px,5.5vw,80px)' }}
          >
            Ce que nous<br />construisons.
          </h2>

          <p
            ref={subRef}
            className="font-sans font-normal text-[14px] text-white/75 leading-relaxed max-w-sm"
            style={{ opacity: 0 }}
          >
            6 actifs · 3 catégories · Suisse &amp; Europe
          </p>
        </div>
      </div>
    </div>
  )
}
