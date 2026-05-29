'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import Link  from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { gsap, SplitText } from '@/lib/gsap'

export function HeroMountain() {
  const sectionRef  = useRef<HTMLElement>(null)
  const headingRef  = useRef<HTMLHeadingElement>(null)
  const subtitleRef = useRef<HTMLParagraphElement>(null)
  const photoRef    = useRef<HTMLDivElement>(null)
  const labelRef    = useRef<HTMLParagraphElement>(null)
  const ctasRef     = useRef<HTMLDivElement>(null)
  const ruleRef     = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!headingRef.current || !sectionRef.current) return

    const split = new SplitText(headingRef.current, { type: 'chars,words' })

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'expo.out' } })

      tl.from(labelRef.current, { opacity: 0, y: 10, duration: 0.6, delay: 0.2 })
        .from(split.chars, {
          opacity: 0, yPercent: 110, rotationX: -90,
          stagger: 0.022, duration: 0.85,
        }, '-=0.35')
        .from(subtitleRef.current, { opacity: 0, y: 14, duration: 0.6 }, '-=0.45')
        .from(ruleRef.current,     { scaleX: 0, duration: 0.7, transformOrigin: 'left' }, '-=0.5')
        .from(ctasRef.current?.children ?? [], {
          opacity: 0, y: 10, stagger: 0.1, duration: 0.5,
        }, '-=0.4')

      gsap.to(photoRef.current, {
        yPercent: -12, ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      })
    }, sectionRef)

    return () => { ctx.revert(); split.revert() }
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative h-[96vh] min-h-[640px] overflow-hidden"
      aria-labelledby="hero-title"
    >
      {/* Photo plein format — parallax */}
      <div ref={photoRef} className="absolute inset-0 scale-[1.12] will-change-transform">
        <Image
          src="/images/mountains.avif"
          alt="Alpes suisses — Aegryn Group"
          fill priority quality={95}
          className="object-cover object-center"
          sizes="100vw"
        />
        {/* Gradient: transparent top → dark bottom — Rolex style */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/65" />
      </div>

      {/* Content — bottom anchored, left-aligned */}
      <div className="absolute bottom-0 left-0 right-0 z-10">
        <div className="max-w-7xl mx-auto px-6 md:px-12 pb-14">

          {/* Eyebrow label */}
          <p
            ref={labelRef}
            className="font-sans font-semibold text-[10px] tracking-[0.3em] uppercase text-white/50 mb-6 flex items-center gap-3"
          >
            <span className="w-10 h-px bg-white/30 inline-block" />
            Swiss Tech Asset Builder — Engineered to Last
          </p>

          {/* H1 — Unbounded display */}
          <h1
            ref={headingRef}
            id="hero-title"
            className="font-display font-black text-white leading-[0.88] tracking-[-0.03em] max-w-4xl mb-6"
            style={{ fontSize: 'clamp(56px,7.5vw,116px)' }}
          >
            Building<br />
            What Endures.
          </h1>

          {/* Horizontal rule — Rolex signature separator */}
          <div
            ref={ruleRef}
            className="w-full max-w-4xl h-px bg-white/20 mb-8"
          />

          {/* Subtitle + CTAs — side by side on desktop */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 max-w-4xl">
            <p
              ref={subtitleRef}
              className="font-sans font-normal text-[14px] text-white/55 leading-relaxed max-w-xs"
            >
              Aegryn conçoit, finance et opère des écosystèmes numériques
              construits pour durer.
            </p>

            <div ref={ctasRef} className="flex items-center gap-4 shrink-0">
              <Link
                href="/what-we-build"
                className="inline-flex items-center gap-3 bg-white text-ag-navy font-sans font-semibold text-[11px] tracking-[0.16em] uppercase px-7 py-3.5 hover:bg-ag-apex transition-colors duration-300"
              >
                Nos actifs
                <ArrowUpRight size={13} />
              </Link>
              <Link
                href="/about"
                className="inline-flex items-center gap-3 border border-white/40 text-white font-sans font-semibold text-[11px] tracking-[0.16em] uppercase px-7 py-3.5 hover:border-white hover:bg-white/10 transition-all duration-300"
              >
                Notre mission
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom bar — Rolex-style info strip */}
        <div className="border-t border-white/10 bg-ag-navy/80 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-6 md:px-12 py-3 flex items-center justify-between">
            <div className="flex items-center gap-8">
              <span className="font-sans font-semibold text-[10px] tracking-[0.2em] uppercase text-white/35">
                6 actifs — 3 catégories
              </span>
              <span className="hidden sm:block w-px h-3 bg-white/15" />
              <span className="hidden sm:block font-sans font-semibold text-[10px] tracking-[0.2em] uppercase text-white/35">
                Suisse · Europe · Global
              </span>
            </div>
            <span className="font-sans font-semibold text-[10px] tracking-[0.2em] uppercase text-white/35">
              Est. 2024
            </span>
          </div>
        </div>
      </div>

      {/* Scroll indicator — vertical right */}
      <div className="absolute bottom-20 right-10 z-10 hidden lg:flex flex-col items-center gap-2">
        <div className="w-px h-14 bg-white/20" />
        <span
          className="font-sans font-semibold text-[9px] tracking-[0.28em] uppercase text-white/25"
          style={{ writingMode: 'vertical-rl' }}
        >
          Scroll
        </span>
      </div>
    </section>
  )
}
