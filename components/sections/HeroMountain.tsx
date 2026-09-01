'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Link  from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { gsap, SplitText } from '@/lib/gsap'

const HERO_SLIDES = [
  { src: '/images/home_geneva.jpg',  alt: 'Genève — Aegryn Group' },
  { src: '/images/mountains.avif',   alt: 'Alpes suisses — Aegryn Group' },
]

const SLIDE_INTERVAL_MS = 3500

export function HeroMountain() {
  const t = useTranslations('hero')
  const sectionRef  = useRef<HTMLElement>(null)
  const headingRef  = useRef<HTMLHeadingElement>(null)
  const subtitleRef = useRef<HTMLParagraphElement>(null)
  const photoRef    = useRef<HTMLDivElement>(null)
  const labelRef    = useRef<HTMLParagraphElement>(null)
  const ctasRef     = useRef<HTMLDivElement>(null)
  const ruleRef     = useRef<HTMLDivElement>(null)

  const [activeSlide, setActiveSlide] = useState(0)

  useEffect(() => {
    const id = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % HERO_SLIDES.length)
    }, SLIDE_INTERVAL_MS)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    if (!headingRef.current || !sectionRef.current || !labelRef.current || !ruleRef.current || !subtitleRef.current) return

    /* Split by LINES — boha-group.com style: each line clips up from below */
    const split = new SplitText(headingRef.current, {
      type: 'lines',
      linesClass: 'hero-line-inner',
    })

    gsap.set(split.lines, { overflow: 'hidden', display: 'block' })

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

      /* Éclaircissement progressif au scroll — overlay s'estompe */
      gsap.to('#hero-overlay', {
        opacity: 0.45, ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '60% top',
          scrub: true,
        },
      })
    }, sectionRef)

    return () => {
      split.revert()
      ctx.revert()
    }
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative h-[96vh] min-h-[640px] overflow-hidden"
      aria-labelledby="hero-title"
    >
      {/* Photo plein format — carousel auto-rotatif + parallax */}
      <div ref={photoRef} className="absolute inset-0 scale-[1.12] will-change-transform">
        {HERO_SLIDES.map((slide, i) => (
          <Image
            key={slide.src}
            src={slide.src}
            alt={slide.alt}
            fill
            priority={i === 0}
            quality={95}
            className="object-cover object-center transition-opacity duration-1000"
            style={{ opacity: activeSlide === i ? 1 : 0 }}
            sizes="100vw"
          />
        ))}
        {/* Gradient foncé au départ — s'éclaircit au scroll via GSAP */}
        <div id="hero-overlay" className="absolute inset-0 bg-gradient-to-b from-black/65 via-black/50 to-black/95" />

        {/* Dots de navigation manuelle */}
        <div className="absolute bottom-28 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2">
          {HERO_SLIDES.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Photo ${i + 1}`}
              onClick={() => setActiveSlide(i)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                activeSlide === i ? 'w-6 bg-white' : 'w-1.5 bg-white/40 hover:bg-white/60'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Content — bottom anchored, left-aligned */}
      <div className="absolute bottom-0 left-0 right-0 z-10">
        <div className="max-w-7xl mx-auto px-6 md:px-12 pb-14">

          {/* H1 — Unbounded display */}
          <h1
            ref={headingRef}
            id="hero-title"
            className="font-sans font-bold text-white leading-[1.28] tracking-[-0.03em] max-w-4xl mb-6"
            style={{ fontSize: 'clamp(56px,7.5vw,116px)' }}
            dangerouslySetInnerHTML={{ __html: t('title').replace(/\n/g, '<br>') }}
          />

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

            <div ref={ctasRef} className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 w-full max-w-5xl">
              {/* CTA 1: Construire */}
              <Link
                href="/services/build"
                className="group bg-white/5 backdrop-blur-sm border border-white/20 p-4 hover:bg-white/10 hover:border-white/40 transition-all duration-300"
              >
                <h3 className="font-sans font-bold text-white text-[13px] tracking-[-0.01em] mb-2 uppercase">
                  {t('cta1Title')}
                </h3>
                <p className="font-sans text-[11px] text-white/70 leading-relaxed mb-3">
                  {t('cta1Desc')}
                </p>
                <span className="inline-flex items-center gap-1 font-sans text-[10px] text-white/90 uppercase tracking-[0.16em]">
                  {t('cta1Link')} <ArrowUpRight size={11} />
                </span>
              </Link>

              {/* CTA 2: Accompagner */}
              <Link
                href="/advisory"
                className="group bg-white/5 backdrop-blur-sm border border-white/20 p-4 hover:bg-white/10 hover:border-white/40 transition-all duration-300"
              >
                <h3 className="font-sans font-bold text-white text-[13px] tracking-[-0.01em] mb-2 uppercase">
                  {t('cta2Title')}
                </h3>
                <p className="font-sans text-[11px] text-white/70 leading-relaxed mb-3">
                  {t('cta2Desc')}
                </p>
                <span className="inline-flex items-center gap-1 font-sans text-[10px] text-white/90 uppercase tracking-[0.16em]">
                  {t('cta2Link')} <ArrowUpRight size={11} />
                </span>
              </Link>

              {/* CTA 3: Transiger */}
              <Link
                href="/grade"
                className="group bg-white/5 backdrop-blur-sm border border-white/20 p-4 hover:bg-white/10 hover:border-white/40 transition-all duration-300"
              >
                <h3 className="font-sans font-bold text-white text-[13px] tracking-[-0.01em] mb-2 uppercase">
                  {t('cta3Title')}
                </h3>
                <p className="font-sans text-[11px] text-white/70 leading-relaxed mb-3">
                  {t('cta3Desc')}
                </p>
                <span className="inline-flex items-center gap-1 font-sans text-[10px] text-white/90 uppercase tracking-[0.16em]">
                  {t('cta3Link')} <ArrowUpRight size={11} />
                </span>
              </Link>

              {/* CTA 4: Placer */}
              <Link
                href="/talent"
                className="group bg-white/5 backdrop-blur-sm border border-white/20 p-4 hover:bg-white/10 hover:border-white/40 transition-all duration-300"
              >
                <h3 className="font-sans font-bold text-white text-[13px] tracking-[-0.01em] mb-2 uppercase">
                  {t('cta4Title')}
                </h3>
                <p className="font-sans text-[11px] text-white/70 leading-relaxed mb-3">
                  {t('cta4Desc')}
                </p>
                <span className="inline-flex items-center gap-1 font-sans text-[10px] text-white/90 uppercase tracking-[0.16em]">
                  {t('cta4Link')} <ArrowUpRight size={11} />
                </span>
              </Link>

              {/* CTA 5: S'informer */}
              <Link
                href="/magazine"
                className="group bg-white/5 backdrop-blur-sm border border-white/20 p-4 hover:bg-white/10 hover:border-white/40 transition-all duration-300"
              >
                <h3 className="font-sans font-bold text-white text-[13px] tracking-[-0.01em] mb-2 uppercase">
                  {t('cta5Title')}
                </h3>
                <p className="font-sans text-[11px] text-white/70 leading-relaxed mb-3">
                  {t('cta5Desc')}
                </p>
                <span className="inline-flex items-center gap-1 font-sans text-[10px] text-white/90 uppercase tracking-[0.16em]">
                  {t('cta5Link')} <ArrowUpRight size={11} />
                </span>
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom bar — Rolex-style info strip */}
        <div className="border-t border-white/10 bg-ag-navy/80 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-6 md:px-12 py-3 flex items-center gap-8">
            <span className="font-sans font-semibold text-[10px] tracking-[0.2em] uppercase text-white/60">
              {t('strip')}
            </span>
            <span className="hidden sm:block w-px h-3 bg-white/25" />
            <span className="hidden sm:block font-sans font-semibold text-[10px] tracking-[0.2em] uppercase text-ag-apex">
              {t('chip2')}
            </span>
            <span className="hidden sm:block w-px h-3 bg-white/25" />
            <span className="hidden sm:block font-sans font-semibold text-[10px] tracking-[0.2em] uppercase text-white/60">
              {t('geo')}
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
          {t('scroll')}
        </span>
      </div>
    </section>
  )
}
