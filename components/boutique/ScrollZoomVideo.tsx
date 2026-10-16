'use client'

/**
 * Bandeau vidéo pleine largeur : zoom avant progressif au scroll.
 * Plan de 5 secondes en boucle : la vidéo tourne tant que le bandeau est à l'écran, se met en
 * pause quand on le quitte et reprend où elle s'était arrêtée.
 */
import { useEffect, useRef, useState } from 'react'
import { gsap } from '@/lib/gsap'

export function ScrollZoomVideo({ src, srcMobile, caption, className = '', objectPosition }: { src: string; srcMobile?: string; caption?: string; className?: string; objectPosition?: string }) {
  const box = useRef<HTMLDivElement>(null)
  const media = useRef<HTMLDivElement>(null)
  const video = useRef<HTMLVideoElement>(null)
  const [source, setSource] = useState<string | null>(null)

  useEffect(() => { setSource(srcMobile && window.matchMedia('(max-width: 899px)').matches ? srcMobile : src) }, [src, srcMobile])

  useEffect(() => {
    if (!box.current || !media.current || source === null) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const v = video.current
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => { if (!v) return; if (e.isIntersecting && !reduced) v.play().catch(() => {}); else v.pause() })
    }, { threshold: 0.25 })
    if (v) io.observe(v)
    const ctx = gsap.context(() => {
      if (reduced) return
      gsap.fromTo(media.current, { scale: 1 }, {
        scale: 1.28, ease: 'none',
        scrollTrigger: { trigger: box.current, start: 'top bottom', end: 'bottom top', scrub: true },
      })
    }, box)
    return () => { io.disconnect(); ctx.revert() }
  }, [source])

  return (
    <div ref={box} className={`relative h-[70vh] min-h-[420px] overflow-hidden bg-ag-navy ${className}`}>
      <div ref={media} className="absolute inset-0 will-change-transform">
        {source && <video ref={video} className="h-full w-full object-cover" style={{ objectPosition }} src={source} muted loop playsInline preload="auto" aria-hidden="true" />}
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-ag-navy/70 via-transparent to-ag-navy/20" />
      {caption && (
        <p className="absolute bottom-10 left-6 right-6 mx-auto max-w-7xl whitespace-pre-line font-sans text-[clamp(20px,2.4vw,34px)] font-semibold leading-snug tracking-[-0.02em] text-white md:px-12" style={{ textShadow: '0 1px 12px rgba(0,0,0,.4)' }}>
          {caption}
        </p>
      )}
    </div>
  )
}
