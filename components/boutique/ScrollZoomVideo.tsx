'use client'

/** Bandeau vidéo pleine largeur : zoom avant progressif au scroll (effet « plein cadre »). */
import { useEffect, useRef } from 'react'
import { gsap } from '@/lib/gsap'

export function ScrollZoomVideo({ src, caption, className = '' }: { src: string; caption?: string; className?: string }) {
  const box = useRef<HTMLDivElement>(null)
  const media = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!box.current || !media.current || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const ctx = gsap.context(() => {
      gsap.fromTo(media.current, { scale: 1 }, {
        scale: 1.28, ease: 'none',
        scrollTrigger: { trigger: box.current, start: 'top bottom', end: 'bottom top', scrub: true },
      })
    }, box)
    return () => ctx.revert()
  }, [])

  return (
    <div ref={box} className={`relative h-[70vh] min-h-[420px] overflow-hidden bg-ag-navy ${className}`}>
      <div ref={media} className="absolute inset-0 will-change-transform">
        <video className="h-full w-full object-cover" src={src} autoPlay muted loop playsInline aria-hidden="true" />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-ag-navy/70 via-transparent to-ag-navy/20" />
      {caption && (
        <p className="absolute bottom-10 left-6 right-6 mx-auto max-w-7xl font-sans text-[clamp(20px,2.4vw,34px)] font-semibold leading-snug tracking-[-0.02em] text-white md:px-12" style={{ textShadow: '0 1px 12px rgba(0,0,0,.4)' }}>
          {caption}
        </p>
      )}
    </div>
  )
}
