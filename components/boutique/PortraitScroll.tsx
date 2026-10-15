'use client'

/** Vidéos verticales dans le corps de la page : lecture à l'écran, léger agrandissement au scroll. */
import { useEffect, useRef, useState } from 'react'
import { gsap } from '@/lib/gsap'
import { PORTRAIT_CLIPS, clipSrc } from '@/content/boutique/clips'

export function PortraitScroll({ caption }: { caption: string }) {
  const box = useRef<HTMLDivElement>(null)
  const media = useRef<(HTMLDivElement | null)[]>([])
  const videos = useRef<(HTMLVideoElement | null)[]>([])
  const [small, setSmall] = useState<boolean | null>(null)

  useEffect(() => { setSmall(window.matchMedia('(max-width: 899px)').matches) }, [])

  useEffect(() => {
    if (small === null || !box.current) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => { const v = e.target as HTMLVideoElement; if (e.isIntersecting && !reduced) v.play().catch(() => {}); else v.pause() })
    }, { threshold: 0.2 })
    videos.current.forEach(v => v && io.observe(v))
    const ctx = gsap.context(() => {
      if (reduced) return
      media.current.forEach(m => m && gsap.fromTo(m, { scale: 1 }, {
        scale: 1.12, ease: 'none',
        scrollTrigger: { trigger: box.current, start: 'top bottom', end: 'bottom top', scrub: true },
      }))
    }, box)
    return () => { io.disconnect(); ctx.revert() }
  }, [small])

  return (
    <section ref={box} className="bg-ag-navy py-24 md:py-32">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 md:grid-cols-12 md:px-12">
        <p className="font-sans text-[clamp(24px,2.8vw,40px)] font-semibold leading-[1.2] tracking-[-0.02em] text-white md:col-span-5">{caption}</p>
        <div className="grid grid-cols-2 gap-4 md:col-span-7 md:gap-6">
          {PORTRAIT_CLIPS.map((name, i) => (
            <div key={name} className={`relative aspect-[9/14] overflow-hidden rounded-3xl bg-ag-navy-mid ${i === 1 ? 'md:mt-16' : ''}`}>
              <div ref={el => { media.current[i] = el }} className="absolute inset-0 will-change-transform">
                {small !== null && (
                  <video
                    ref={el => { videos.current[i] = el }}
                    className="h-full w-full object-cover"
                    src={clipSrc(name, small)}
                    muted loop playsInline preload="metadata" aria-hidden="true" tabIndex={-1}
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
