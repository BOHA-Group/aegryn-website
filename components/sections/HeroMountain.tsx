'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import Link  from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { gsap, SplitText } from '@/lib/gsap'

export function HeroMountain() {
  const t = useTranslations('hero')
  const sectionRef  = useRef<HTMLElement>(null)
  const headingRef  = useRef<HTMLHeadingElement>(null)
  const subtitleRef = useRef<HTMLParagraphElement>(null)
  const photoRef    = useRef<HTMLDivElement>(null)
  const labelRef    = useRef<HTMLParagraphElement>(null)
  const ctasRef     = useRef<HTMLDivElement>(null)
  const ruleRef     = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!headingRef.current || !sectionRef.current) return

    /* Split by LINES — boha-group.com style: each line clips up from below */
    const split = new SplitText(headingRef.current, {
      type: 'lines',
      linesClass: 'hero-line-inner',
    })

    /* Wrap each line in a clip container */
    split.lines.forEach((line) => {
      const wrapper = document.createElement('div')
      wrapper.style.overflow = 'hidden'
      wrapper.style.display  = 'block'
      line.parentNode?.insertBefore(wrapper, line)
      wrapper.appendChild(line)
    })

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'expo.out' } })

      tl.from(labelRef.current, { opacity: 0, y: 8, duration: 0.5, delay: 0.1 })
        .from(split.lines, {
          yPercent: 105,
          duration: 1.0,
          stagger: 0.12,
          ease: 'expo.out',
        }, '-=0.2')
        .from(ruleRef.current, { scaleX: 0, duration: 0.8, transformOrigin: 'left' }, '-=0.6')
        .from(subtitleRef.current, { opacity: 0, y: 12, duration: 0.6 }, '-=0.55')
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
          src="/images/home-mountains.png"
          alt="Alpes suisses — Aegryn Group"
          fill priority quality={95}
          className="object-cover object-center"
          sizes="100vw"
        />
        {/* Gradient: transparent top → dark bottom — Rolex style */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/92" />
      </div>

      {/* Content — bottom anchored, left-aligned */}
      <div className="absolute bottom-0 left-0 right-0 z-10">
        <div className="max-w-7xl mx-auto px-6 md:px-12 pb-14">

          {/* Eyebrow label */}
          <p
            ref={labelRef}
            className="font-sans font-semibold text-[10px] tracking-[0.3em] uppercase text-white/75 mb-6 flex items-center gap-3"
          >
            <span className="w-10 h-px bg-white/30 inline-block" />
            Swiss Tech Asset Builder — Engineered to Last
          </p>

          {/* H1 — Unbounded display */}
          <h1
            ref={headingRef}
            id="hero-title"
            className="font-sans font-bold text-white leading-[1.05] tracking-[-0.03em] max-w-4xl mb-6"
            style={{ fontSize: 'clamp(56px,7.5vw,116px)' }}
          >
            {t('title').split('\n').map((line, i, arr) => (
              <span key={i}>{line}{i < arr.length - 1 && <br />}</span>
            ))}
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
              className="font-sans font-normal text-[14px] text-white/80 leading-relaxed max-w-xs"
            >
              {t('sub').split('\n').join(' ')}
            </p>

            <div ref={ctasRef} className="flex items-center gap-4 shrink-0">
              <Link
                href="/what-we-build"
                className="inline-flex items-center gap-3 bg-white text-ag-navy font-sans font-semibold text-[11px] tracking-[0.16em] uppercase px-7 py-3.5 hover:bg-ag-apex transition-colors duration-300"
              >
                {t('cta')}
                <ArrowUpRight size={13} />
              </Link>
              <Link
                href="/about"
                className="inline-flex items-center gap-3 border border-white/40 text-white font-sans font-semibold text-[11px] tracking-[0.16em] uppercase px-7 py-3.5 hover:border-white hover:bg-white/10 transition-all duration-300"
              >
                {t('tagline')}
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom bar — Rolex-style info strip */}
        <div className="border-t border-white/10 bg-ag-navy/80 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-6 md:px-12 py-3 flex items-center justify-between">
            <div className="flex items-center gap-8">
              <span className="font-sans font-semibold text-[10px] tracking-[0.2em] uppercase text-white/60">
                6 actifs — 3 catégories
              </span>
              <span className="hidden sm:block w-px h-3 bg-white/25" />
              <span className="hidden sm:block font-sans font-semibold text-[10px] tracking-[0.2em] uppercase text-white/60">
                Suisse · Europe · Global
              </span>
            </div>
            <span className="font-sans font-semibold text-[10px] tracking-[0.2em] uppercase text-white/60">
              Est. 2024
            </span>
          </div>
        </div>
      </div>

      {/* Scroll indicator — vertical right */}
      <div className="absolute bottom-20 right-10 z-10 hidden lg:flex flex-col items-center gap-2">
        <div className="w-px h-14 bg-white/40" />
        <span
          className="font-sans font-semibold text-[9px] tracking-[0.28em] uppercase text-white/55"
          style={{ writingMode: 'vertical-rl' }}
        >
          Scroll
        </span>
      </div>
    </section>
  )
}
