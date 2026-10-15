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
  const wrapRef    = useRef<HTMLDivElement>(null)
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
    if (reduced) return
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
    return () => { cancelAnimationFrame(raf); io.disconnect() }
  }, [])

  return (
    <div ref={wrapRef} className="relative overflow-hidden" style={{ height: '100vh' }}>
      <div className="absolute inset-0">
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
      </div>

      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover object-center"
        autoPlay
        muted
        loop
        playsInline
        poster="/images/assets/assets-intro.webp"
        preload="auto"
      >
        <source src="/videos/assets-animation2-web.mp4" type="video/mp4" />
      </video>

      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/20 to-black/75 pointer-events-none" />

      <div className="absolute inset-0 flex flex-col justify-end pointer-events-none z-10">
        <div className="max-w-7xl mx-auto w-full px-6 md:px-12 pb-14">
          <p
            ref={labelRef}
            className="font-sans font-semibold text-[10px] tracking-[0.3em] uppercase text-white/70 mb-5 flex items-center gap-3"
            style={{ opacity: 0 }}
          >
            <span className="w-8 h-px bg-white/40 inline-block" />
            {label ?? 'Aegryn, notre écosystème'}
          </p>
          <h2
            ref={headingRef}
            className="font-sans font-bold text-white tracking-[-0.03em] leading-[1.2] mb-6 pb-[0.2em] [&_.ahb-line]:overflow-hidden"
            style={{ fontSize: 'clamp(26px,3vw,44px)' }}
            dangerouslySetInnerHTML={{ __html: (title ?? 'Ce que nous\nconstruisons.').replace(/\n/g, '<br>') }}
          />
          <p
            ref={subRef}
            className="font-sans font-normal text-[15px] text-white/70 leading-relaxed max-w-sm"
            style={{ opacity: 0 }}
          >
            {sub ?? '6 actifs · 3 catégories · Suisse & Europe'}
          </p>
        </div>
      </div>
    </div>
  )
}
