'use client'

import { useEffect, useRef, useState } from 'react'
import { useTranslations } from 'next-intl'
import { gsap } from '@/lib/gsap'

const HERO_VIDEO   = '/images/home/hero-homepage.mp4'
const HERO_POSTER  = '/images/home/hero-homepage-poster.jpg'

/** Animation machine à écrire — style size.swiss : tape, pause, efface, phrase suivante. */
function useTypedPhrases(phrases: string[]) {
  const [text, setText] = useState('')

  useEffect(() => {
    if (!phrases.length) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) { setText(phrases[0]); return }

    let phrase = 0, char = 0, deleting = false, timer: ReturnType<typeof setTimeout>

    const tick = () => {
      const current = phrases[phrase]
      if (!deleting) {
        char++
        setText(current.slice(0, char))
        if (char === current.length) { deleting = true; timer = setTimeout(tick, 2400); return }
        timer = setTimeout(tick, 42 + Math.random() * 48)
      } else {
        char--
        setText(current.slice(0, char))
        if (char === 0) {
          deleting = false
          phrase = (phrase + 1) % phrases.length
          timer = setTimeout(tick, 500)
          return
        }
        timer = setTimeout(tick, 26)
      }
    }
    timer = setTimeout(tick, 900)
    return () => clearTimeout(timer)
  }, [phrases])

  return text
}

export function HeroMountain() {
  const t = useTranslations('hero')
  const phrases = t.raw('phrases') as string[]
  const typed = useTypedPhrases(phrases)
  const longest = phrases.reduce((a, b) => (b.length > a.length ? b : a), '')

  const sectionRef  = useRef<HTMLElement>(null)
  const mediaRef    = useRef<HTMLDivElement>(null)
  const labelRef    = useRef<HTMLParagraphElement>(null)
  const headingRef  = useRef<HTMLHeadingElement>(null)
  const ruleRef     = useRef<HTMLDivElement>(null)
  const marqueeRef  = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!sectionRef.current) return

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'expo.out' } })

      tl.from(labelRef.current, { opacity: 0, y: 8, duration: 0.5, delay: 0.1 })
        .from(headingRef.current, { opacity: 0, y: 24, duration: 0.9 }, '-=0.2')
        .from(ruleRef.current, { scaleX: 0, duration: 0.8, transformOrigin: 'left' }, '-=0.5')
        .from(marqueeRef.current, { opacity: 0, duration: 0.6 }, '-=0.4')

      gsap.to(mediaRef.current, {
        yPercent: -12, ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      })

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

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative h-[96vh] min-h-[640px] overflow-hidden pt-20"
      aria-labelledby="hero-title"
    >
      {/* Vidéo plein format — parallax */}
      <div ref={mediaRef} className="absolute inset-0 scale-[1.12] will-change-transform">
        <video
          className="absolute inset-0 w-full h-full object-cover object-center"
          src={HERO_VIDEO}
          poster={HERO_POSTER}
          autoPlay
          muted
          loop
          playsInline
          aria-hidden="true"
        />
        <div id="hero-overlay" className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/25 to-black/80" />
      </div>

      {/* Content — bottom anchored, left-aligned */}
      <div className="absolute bottom-0 left-0 right-0 z-10">
        <div className="max-w-7xl mx-auto px-6 md:px-12 pb-20 md:pb-14">

          {/* Eyebrow */}
          <p
            ref={labelRef}
            className="font-sans font-semibold text-[11px] tracking-[0.24em] uppercase text-ag-apex mb-6"
          >
            {t('eyebrow')}
          </p>

          {/* H1 — rotation machine à écrire, police conservée */}
          <h1
            ref={headingRef}
            id="hero-title"
            aria-label={phrases.join(' ')}
            className="font-sans font-bold text-white leading-[1.28] tracking-[-0.03em] max-w-4xl mb-8"
            style={{ fontSize: 'clamp(36px,6.5vw,104px)' }}
          >
            <span className="relative inline-block">
              {/* Réserve la hauteur de la phrase la plus longue — pas de saut de mise en page */}
              <span className="invisible" aria-hidden="true">{longest}</span>
              <span className="absolute inset-0" aria-hidden="true">
                {typed}
                <span className="typed-caret" />
              </span>
            </span>
          </h1>

          {/* Horizontal rule */}
          <div
            ref={ruleRef}
            className="w-full max-w-4xl h-px bg-white/20"
          />
        </div>

        {/* Bottom bar — marquee signature, droite → gauche */}
        <div
          ref={marqueeRef}
          className="border-t border-white/10 bg-ag-navy/80 backdrop-blur-sm overflow-hidden"
        >
          <div className="py-3 marquee-track" aria-hidden="true">
            {[0, 1].map((copy) => (
              <span key={copy} className="flex items-center shrink-0">
                {Array.from({ length: 4 }).map((_, i) => (
                  <span key={i} className="flex items-center shrink-0">
                    <span className="font-sans font-medium text-[13px] text-white/80 px-6">
                      {t('sub')}
                    </span>
                    <span className="w-1 h-1 rounded-full bg-ag-apex/70 shrink-0" />
                  </span>
                ))}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll indicator — vertical right */}
      <div className="absolute bottom-20 right-10 z-10 hidden lg:flex flex-col items-center gap-2">
        <div className="w-px h-14 bg-white/40" />
        <span
          className="font-sans font-semibold text-[10px] tracking-[0.28em] uppercase text-white/55"
          style={{ writingMode: 'vertical-rl' }}
        >
          {t('scroll')}
        </span>
      </div>
    </section>
  )
}
