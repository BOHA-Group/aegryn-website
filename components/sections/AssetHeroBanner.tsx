'use client'

import { useEffect, useRef } from 'react'
import Image                  from 'next/image'
import { gsap, SplitText }    from '@/lib/gsap'

/**
 * Bannière image plein-largeur style boha-group.com.
 * - Image assets-intro.jpg avec effet Ken Burns (scale 1.08 → 1.0, scrub)
 * - Overlay gradient sombre
 * - Texte "Ce que nous construisons." reveal ligne par ligne (SplitText clip)
 * - Sous-texte fade-up
 * - Compteur actifs en bas
 */
export function AssetHeroBanner() {
  const sectionRef  = useRef<HTMLDivElement>(null)
  const photoRef    = useRef<HTMLDivElement>(null)
  const headingRef  = useRef<HTMLHeadingElement>(null)
  const subRef      = useRef<HTMLParagraphElement>(null)
  const labelRef    = useRef<HTMLParagraphElement>(null)

  useEffect(() => {
    if (!headingRef.current) return

    const split = new SplitText(headingRef.current, {
      type: 'lines',
      linesClass: 'ab-line',
    })

    gsap.set(split.lines, { overflow: 'hidden' })

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'expo.out' } })

      tl.from(labelRef.current,  { opacity: 0, y: 6,   duration: 0.5, delay: 0.2 })
        .from(split.lines, { yPercent: 105, duration: 1.0, stagger: 0.1 }, '-=0.2')
        .from(subRef.current,    { opacity: 0, y: 12,  duration: 0.6 }, '-=0.5')

      /* Ken Burns — léger dezoom scrubé */
      gsap.fromTo(photoRef.current,
        { scale: 1.08 },
        {
          scale: 1.0,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top top',
            end:   'bottom top',
            scrub: true,
          },
        },
      )
    }, sectionRef)

    return () => { ctx.revert(); split.revert() }
  }, [])

  return (
    <div
      ref={sectionRef}
      className="relative overflow-hidden"
      style={{ height: 'clamp(340px, 48vw, 640px)' }}
    >
      {/* Photo */}
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
        {/* Gradient sombre pour lisibilité du texte */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/30 to-black/75" />
      </div>

      {/* Contenu texte */}
      <div className="absolute inset-0 flex flex-col justify-end">
        <div className="max-w-7xl mx-auto w-full px-6 md:px-12 pb-12">
          <p
            ref={labelRef}
            className="font-sans font-semibold text-[10px] tracking-[0.3em] uppercase text-white/70 mb-5 flex items-center gap-3"
          >
            <span className="w-8 h-px bg-white/40 inline-block" />
            Aegryn — Notre écosystème
          </p>

          <h2
            ref={headingRef}
            suppressHydrationWarning
            className="font-sans font-bold text-white tracking-[-0.03em] leading-[1.05] mb-6"
            style={{ fontSize: 'clamp(40px,5.5vw,80px)' }}
          >
            Ce que nous<br />construisons.
          </h2>

          <p
            ref={subRef}
            className="font-sans font-normal text-[14px] text-white/75 leading-relaxed max-w-sm"
          >
            6 actifs · 3 catégories · Suisse &amp; Europe
          </p>
        </div>
      </div>
    </div>
  )
}
