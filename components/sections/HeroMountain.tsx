'use client'

import { useEffect, useRef, useState } from 'react'
import { useTranslations } from 'next-intl'
import { gsap } from '@/lib/gsap'
import { Link } from '@/i18n/navigation'
import { RevealOnScroll } from '@/components/ui/RevealOnScroll'
import { useDecorativeVideo } from '@/hooks/useDecorativeVideo'
import { useTypedPhrases } from '@/hooks/useTypedPhrases'

const HERO_VIDEO   = '/images/home/hero-homepage.mp4'
const HERO_POSTER  = '/images/home/hero-homepage-poster.jpg'

export function HeroMountain() {
  const t = useTranslations('hero')
  const phrases = t.raw('phrases') as string[]
  const [videoMs, setVideoMs] = useState(23700)
  const { text: typed, restart } = useTypedPhrases(phrases, { videoMs })
  const lastVideoTime = useRef(0)

  const sectionRef  = useRef<HTMLElement>(null)
  const mediaRef    = useRef<HTMLDivElement>(null)
  const headingRef  = useRef<HTMLHeadingElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  useDecorativeVideo(videoRef, HERO_VIDEO, '/images/home/hero-homepage-mobile.mp4')

  useEffect(() => {
    if (!sectionRef.current) return
    const motion = gsap.matchMedia()
    motion.add('(prefers-reduced-motion: no-preference)', () => {

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'expo.out' } })

      tl.from(headingRef.current, { opacity: 0, y: 24, duration: 0.9, delay: 0.15 })

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
    })
    return () => motion.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      data-nav-hero
      className="relative -mt-16 h-[calc(96vh+4rem)] min-h-[704px] overflow-hidden pt-20"
      aria-labelledby="hero-title"
    >
      {/* Vidéo plein format — parallax */}
      <div ref={mediaRef} className="absolute inset-0 scale-[1.12] will-change-transform">
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover object-center"
          poster={HERO_POSTER}
          preload="none"
          muted
          loop
          playsInline
          aria-hidden="true"
          onLoadedMetadata={(e) => setVideoMs(e.currentTarget.duration * 1000)}
          onTimeUpdate={(e) => {
            const ct = e.currentTarget.currentTime
            if (ct < lastVideoTime.current - 0.5) restart()
            lastVideoTime.current = ct
          }}
        />
      </div>

      {/* Voile de lisibilité : le titre reste net sur le lac clair */}
      <div className="absolute inset-0 bg-gradient-to-t from-ag-navy/80 via-ag-navy/10 to-ag-navy/35" />

      {/* Content — bottom anchored, left-aligned */}
      <div className="absolute bottom-0 left-0 right-0 z-10">
        <div className="max-w-7xl mx-auto px-6 md:px-12 pb-16 md:pb-20">

          {/* H1 — rotation machine à écrire, police conservée.
              Verbe en ligne 1, complément en ligne 2 ; toutes les phrases
              invisibles dans la même cellule de grille réservent la hauteur max. */}
          <h1
            ref={headingRef}
            id="hero-title"
            aria-label={phrases.map((p) => p.replace('\n', ' ')).join(' ')}
            className="font-sans font-bold text-white leading-[1.15] tracking-[-0.03em] max-w-4xl mb-8"
            style={{ fontSize: 'clamp(30px,4.2vw,58px)', textShadow: '0 1px 10px rgba(0,0,0,0.35)' }}
          >
            <span className="inline-grid">
              {phrases.map((p, i) => (
                <span key={i} className="invisible col-start-1 row-start-1" aria-hidden="true">
                  {p.split('\n').map((line, j) => (
                    <span key={j} className={j === 0 ? 'block' : 'block font-normal'}>{line}</span>
                  ))}
                </span>
              ))}
              <span data-typed-text className="col-start-1 row-start-1" aria-hidden="true">
                {typed.split('\n').map((line, j) => (
                  <span key={j} className={j === 0 ? 'block' : 'block font-normal'}>
                    {line}
                    {j === typed.split('\n').length - 1 && <span className="typed-caret" />}
                  </span>
                ))}
              </span>
            </span>
          </h1>

          <RevealOnScroll>
            <p className="max-w-2xl text-[16px] leading-relaxed text-white/85">{t('sub')}</p>
            <div className="mt-8">
              <Link
                href={{ pathname: '/contact', query: { action: 'echange' } }}
                className="inline-block rounded-full bg-ag-apex px-7 py-3.5 font-sans text-sm font-bold text-ag-navy transition-colors hover:bg-white"
              >
                {t('cta')}
              </Link>
            </div>
          </RevealOnScroll>
        </div>
      </div>

      {/* Scroll indicator — vertical right */}
      <div className="absolute bottom-20 right-10 z-10 hidden lg:flex flex-col items-center gap-2">
        <div className="w-px h-14 bg-white/40" />
        <span
          className="font-sans font-semibold text-[10px] tracking-[0.28em] uppercase text-white/70"
          style={{ writingMode: 'vertical-rl' }}
        >
          {t('scroll')}
        </span>
      </div>
    </section>
  )
}
