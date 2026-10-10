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
        if (char === current.length) { deleting = true; timer = setTimeout(tick, 3000); return }
        timer = setTimeout(tick, 110 + Math.random() * 70)
      } else {
        char--
        setText(current.slice(0, char))
        if (char === 0) {
          deleting = false
          phrase = (phrase + 1) % phrases.length
          timer = setTimeout(tick, 650)
          return
        }
        timer = setTimeout(tick, 55)
      }
    }
    timer = setTimeout(tick, 1100)
    return () => clearTimeout(timer)
  }, [phrases])

  return text
}

export function HeroMountain() {
  const t = useTranslations('hero')
  const phrases = t.raw('phrases') as string[]
  const typed = useTypedPhrases(phrases)

  const sectionRef  = useRef<HTMLElement>(null)
  const mediaRef    = useRef<HTMLDivElement>(null)
  const headingRef  = useRef<HTMLHeadingElement>(null)
  const ruleRef     = useRef<HTMLDivElement>(null)
  const marqueeRef  = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!sectionRef.current) return

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'expo.out' } })

      tl.from(headingRef.current, { opacity: 0, y: 24, duration: 0.9, delay: 0.15 })
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
      </div>

      {/* Content — bottom anchored, left-aligned */}
      <div className="absolute bottom-0 left-0 right-0 z-10">
        <div className="max-w-7xl mx-auto px-6 md:px-12 pb-20 md:pb-14">

          {/* H1 — rotation machine à écrire, police conservée.
              Verbe en ligne 1, complément en ligne 2 ; toutes les phrases
              invisibles dans la même cellule de grille réservent la hauteur max. */}
          <h1
            ref={headingRef}
            id="hero-title"
            aria-label={phrases.map((p) => p.replace('\n', ' ')).join(' ')}
            className="font-sans font-bold text-white leading-[1.15] tracking-[-0.03em] max-w-4xl mb-8"
            style={{ fontSize: 'clamp(26px,3.6vw,46px)', textShadow: '0 1px 10px rgba(0,0,0,0.35)' }}
          >
            <span className="inline-grid">
              {phrases.map((p, i) => (
                <span key={i} className="invisible col-start-1 row-start-1" aria-hidden="true">
                  {p.split('\n').map((line, j) => (
                    <span key={j} className="block">{line}</span>
                  ))}
                </span>
              ))}
              <span className="col-start-1 row-start-1" aria-hidden="true">
                {typed.split('\n').map((line, j) => (
                  <span key={j} className="block">
                    {line}
                    {j === typed.split('\n').length - 1 && <span className="typed-caret" />}
                  </span>
                ))}
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
