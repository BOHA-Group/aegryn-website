'use client'

import { useEffect, useLayoutEffect, useRef } from 'react'
import Image                  from 'next/image'
import { gsap, SplitText }    from '@/lib/gsap'

/**
 * AssetHeroBannerVideo : page actifs.
 *
 * La page n'est plus bloquée : le hero défile normalement (aucun pin).
 * La vidéo joue en continu à vitesse lente et sa vitesse de lecture suit la vitesse de scroll :
 * plus on défile vite, plus elle accélère, puis elle revient au calme quand on s'arrête.
 * L'image (homme qui marche sur les dalles) s'affiche seule d'abord ; la vidéo apparaît en fondu dès que l'on
 * défile, au rythme du scroll (pleine opacité à ~45 % de la hauteur d'écran).
 * Le texte se révèle au chargement (ligne par ligne).
 */
interface AssetHeroBannerVideoProps {
  label?: string
  title?: string
  sub?:   string
}

const BASE_RATE = 0.7
const MAX_RATE  = 4
const GAIN      = 1.1

export function AssetHeroBannerVideo({ label, title, sub }: AssetHeroBannerVideoProps = {}) {
  const wrapRef    = useRef<HTMLElement>(null)
  const videoRef   = useRef<HTMLVideoElement>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const subRef     = useRef<HTMLParagraphElement>(null)
  const labelRef   = useRef<HTMLParagraphElement>(null)

  /* Révélation du texte au chargement */
  useLayoutEffect(() => {
    const wrap = wrapRef.current
    const heading = headingRef.current
    if (!wrap || !heading) return
    const split = new SplitText(heading, { type: 'lines', linesClass: 'ahb-line' })
    ;(split.lines as HTMLElement[]).forEach(line => { line.style.paddingBottom = '0.18em'; line.style.marginBottom = '-0.18em' })
    const ctx = gsap.context(() => {
      gsap.timeline({ defaults: { ease: 'power3.out' } })
        .fromTo(labelRef.current, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.7 }, 0.2)
        .fromTo(split.lines, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.8, stagger: 0.12 }, 0.35)
        .fromTo(subRef.current, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.7 }, 0.75)
    }, wrap)
    return () => { ctx.revert(); split.revert() }
  }, [])

  /* Vitesse de lecture calée sur la vitesse de scroll */
  useEffect(() => {
    const v = videoRef.current
    if (!v) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    v.playbackRate = BASE_RATE
    v.play().catch(() => {})
    const fade = () => { v.style.opacity = String(Math.min(1, Math.max(0, (window.scrollY - 8) / (window.innerHeight * 0.45)))) }
    fade()
    window.addEventListener('scroll', fade, { passive: true })
    if (reduced) return () => window.removeEventListener('scroll', fade)
    let lastY = window.scrollY, lastT = performance.now(), rate = BASE_RATE, raf = 0, visible = true
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible) { rate = BASE_RATE; v.playbackRate = BASE_RATE; v.play().catch(() => {}) } else v.pause() })
    io.observe(v)
    const tick = (t: number) => {
      const dt = Math.max(1, t - lastT)
      const y = window.scrollY
      const velocity = Math.abs(y - lastY) / dt
      lastY = y; lastT = t
      const target = Math.min(MAX_RATE, BASE_RATE + velocity * GAIN)
      rate += (target - rate) * (target > rate ? 0.2 : 0.04)
      if (visible) v.playbackRate = Math.max(0.25, Math.min(16, rate))
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => { cancelAnimationFrame(raf); io.disconnect(); window.removeEventListener('scroll', fade) }
  }, [])

  return (
    <section
      ref={wrapRef}
      className="relative overflow-hidden bg-ag-navy pt-36 pb-24 px-6 md:px-12"
      style={{ minHeight: 'clamp(460px,50vw,620px)' }}
    >
      <Image
        src="/images/assets/assets-intro.webp"
        alt="Aegryn | Nos actifs numériques"
        fill
        priority
        fetchPriority="high"
        unoptimized
        className="object-cover object-center"
        sizes="100vw"
      />

      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover object-center"
        style={{ opacity: 0 }}
        autoPlay
        muted
        loop
        playsInline
        poster="/images/assets/assets-intro.webp"
        preload="auto"
      >
        <source src="/videos/assets-animation2-web.mp4" type="video/mp4" />
      </video>

      <div className="absolute inset-0 bg-gradient-to-b from-ag-navy/70 via-ag-navy/60 to-ag-navy/95 pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-7xl">
        <p
          ref={labelRef}
          className="mb-6 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.28em] text-ag-apex"
          style={{ opacity: 0 }}
        >
          <span className="inline-block h-px w-6 bg-ag-apex/50" />
          {label ?? 'Aegryn, notre écosystème'}
        </p>
        <h1
          ref={headingRef}
          className="mb-6 max-w-4xl font-sans font-bold leading-[1.05] tracking-[-0.03em] text-white [&_.ahb-line]:overflow-hidden"
          style={{ fontSize: 'clamp(36px,5vw,72px)' }}
          dangerouslySetInnerHTML={{ __html: (title ?? 'Ce que nous\nconstruisons.').replace(/\n/g, '<br>') }}
        />
        <p
          ref={subRef}
          className="max-w-xl text-[16px] leading-relaxed text-white/70"
          style={{ opacity: 0 }}
        >
          {sub ?? '6 actifs · 3 catégories · Suisse & Europe'}
        </p>
      </div>
    </section>
  )
}
