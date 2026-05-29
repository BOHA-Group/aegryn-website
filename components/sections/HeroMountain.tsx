'use client'

import { useEffect, useRef } from 'react'
import Image                  from 'next/image'
import { gsap, SplitText } from '@/lib/gsap'

export function HeroMountain() {
  const sectionRef = useRef<HTMLElement>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const subtitleRef = useRef<HTMLParagraphElement>(null)
  const photoRef   = useRef<HTMLDivElement>(null)
  const labelRef   = useRef<HTMLParagraphElement>(null)

  useEffect(() => {
    if (!headingRef.current || !sectionRef.current) return

    const split = new SplitText(headingRef.current, { type: 'chars,words' })

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'expo.out' } })

      tl.from(labelRef.current, {
        opacity: 0, y: 10, duration: 0.7, delay: 0.1,
      })
      .from(split.chars, {
        opacity: 0, yPercent: 110, rotationX: -90,
        stagger: 0.025, duration: 0.9,
      }, '-=0.4')
      .from(subtitleRef.current, {
        opacity: 0, y: 16, duration: 0.7,
      }, '-=0.5')

      gsap.to(photoRef.current, {
        yPercent: -10, ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      })
    }, sectionRef)

    return () => {
      ctx.revert()
      split.revert()
    }
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative h-[92vh] overflow-hidden"
      aria-labelledby="hero-title"
    >
      {/* Photo plein format — parallax */}
      <div ref={photoRef} className="absolute inset-0 scale-110 will-change-transform">
        <Image
          src="/images/mountains.avif"
          alt="Alpes suisses — Aegryn Group"
          fill
          priority
          quality={95}
          className="object-cover object-center"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-black/30" />
      </div>

      {/* Texte — bas gauche, pattern Rolex */}
      <div className="absolute bottom-16 left-0 right-0 z-10 max-w-7xl mx-auto px-6 md:px-12">
        <p
          ref={labelRef}
          className="font-mono text-[11px] tracking-[0.25em] uppercase text-white/60 mb-5 flex items-center gap-3"
        >
          <span className="w-8 h-px bg-white/40 inline-block" />
          Swiss Tech Asset Builder
        </p>

        <h1
          ref={headingRef}
          id="hero-title"
          className="font-display font-black text-white leading-[0.9] tracking-[-0.03em] max-w-3xl"
          style={{ fontSize: 'clamp(52px,7vw,108px)' }}
        >
          Swiss Tech<br />asset builder.
        </h1>

        <p
          ref={subtitleRef}
          className="font-mono text-[13px] text-white/55 leading-relaxed mt-6 max-w-sm"
        >
          We develop proprietary digital ecosystems<br />
          engineered for endurance and scale.
        </p>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 right-12 z-10 flex flex-col items-center gap-3">
        <div className="w-px h-12 bg-white/25" />
        <span
          className="font-mono text-[9px] tracking-[0.22em] uppercase text-white/30"
          style={{ writingMode: 'vertical-rl' }}
        >
          Scroll
        </span>
      </div>
    </section>
  )
}
