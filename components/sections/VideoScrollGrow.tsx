'use client'

import { useLayoutEffect, useRef } from 'react'
import { gsap } from '@/lib/gsap'

interface VideoScrollGrowProps {
  srcWeb:    string
  srcMobile: string
  poster:    string
  label?:    string
}

/**
 * VideoScrollGrow — vidéo centrée, petite, angles arrondis, qui s'ouvre
 * en plein écran au scroll down (scrub GSAP) et revient en arrière au
 * scroll up. Même technique que AboutHeroScroll (clip-path inset→0,
 * round 16px→0px), appliquée à une vidéo plutôt qu'à une photo de hero.
 */
export function VideoScrollGrow({ srcWeb, srcMobile, poster, label }: VideoScrollGrowProps) {
  const wrapRef  = useRef<HTMLElement>(null)
  const frameRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  useLayoutEffect(() => {
    const wrap  = wrapRef.current
    const frame = frameRef.current
    if (!wrap || !frame) return

    const ctx = gsap.context(() => {
      const st = {
        trigger: wrap,
        start:   'top top',
        end:     'bottom bottom',
        scrub:   true,
      }

      const mm = gsap.matchMedia()
      mm.add({
        isDesktop: '(min-width: 768px)',
        isMobile:  '(max-width: 767px)',
      }, (mq) => {
        const start = mq.conditions?.isDesktop
          ? 'inset(32% 30% 32% 30% round 16px)'
          : 'inset(38% 8% 38% 8% round 16px)'
        gsap.fromTo(frame,
          { clipPath: start },
          { clipPath: 'inset(0% 0% 0% 0% round 0px)', ease: 'none', scrollTrigger: st },
        )
      })
    }, wrap)

    return () => ctx.revert()
  }, [])

  /* Vidéo chargée seulement quand la section approche du viewport */
  useLayoutEffect(() => {
    const video = videoRef.current
    if (!video) return
    const load = () => {
      if (video.dataset.loaded) return
      video.dataset.loaded = '1'
      const small = window.matchMedia('(max-width: 1023px)').matches
      video.src = small ? video.dataset.srcMobile ?? '' : video.dataset.srcDesktop ?? ''
      video.load()
      video.play().catch(() => {})
    }
    if (!('IntersectionObserver' in window)) { load(); return }
    const io = new IntersectionObserver((entries) => {
      if (entries.some(e => e.isIntersecting)) { load(); io.disconnect() }
    }, { rootMargin: '600px 0px' })
    io.observe(video)
    return () => io.disconnect()
  }, [])

  return (
    <section ref={wrapRef} className="relative h-[200vh] bg-ag-white" aria-hidden={!label}>
      <div className="sticky top-0 h-screen overflow-hidden bg-ag-white">
        <div ref={frameRef} className="absolute inset-0 will-change-[clip-path] overflow-hidden">
          <video
            ref={videoRef}
            className="absolute inset-0 w-full h-full object-cover object-center"
            autoPlay
            muted
            loop
            playsInline
            poster={poster}
            preload="metadata"
            data-src-desktop={srcWeb}
            data-src-mobile={srcMobile}
            aria-hidden="true"
          >
            <track kind="captions" />
          </video>
          {label && (
            <p className="absolute bottom-6 left-6 md:bottom-10 md:left-12 font-sans font-semibold text-[11px] uppercase tracking-[0.24em] text-white/70 z-10">
              {label}
            </p>
          )}
        </div>
      </div>
    </section>
  )
}
