'use client'

import { useLayoutEffect, useRef, useEffect } from 'react'
import { useTranslations }   from 'next-intl'
import { gsap, SplitText }   from '@/lib/gsap'

/**
 * MissionVideoSection
 *
 * Architecture :
 *   - Pas de pinning : la section suit le flux normal
 *   - Couche 1 : vidéo assets-animation1 plein fond (opacity 0→1 scrubé)
 *   - Couche 2 : contenu au-dessus, bg transparent
 *               Texte dark→blanc via GSAP scrub lissé (0.6) pendant
 *               la traversée du viewport — jouable dans les deux sens
 */
export function MissionVideoSection() {
  const wrapRef    = useRef<HTMLDivElement>(null)
  const videoRef   = useRef<HTMLVideoElement>(null)
  const sectionRef = useRef<HTMLDivElement>(null)

  const tM = useTranslations('missionSection')
  const missionItems = tM.raw('items') as { title: string; desc: string }[]

  /* Vidéo chargée seulement quand la section approche du viewport (8 Mo desktop,
     1,7 Mo mobile) : évite de télécharger la vidéo pendant le chargement initial. */
  useEffect(() => {
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

  useLayoutEffect(() => {
    const wrap    = wrapRef.current
    const section = sectionRef.current
    if (!wrap || !section) return

    /* SplitText sur les titres Mission pour animer mot par mot */
    const splits: SplitText[] = []
    const titleEls = section.querySelectorAll<HTMLElement>('.mv-title')
    titleEls.forEach((el) => {
      const s = new SplitText(el, { type: 'words', wordsClass: 'mv-word' })
      splits.push(s)
    })

    const ctx = gsap.context(() => {
      /* Scrub non pinné : la transition suit la traversée du viewport,
         dans les deux sens, lissée (0.6) pour épouser la vitesse du scroll */
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger:       wrap,
          start:         'top bottom',
          end:           'top 20%',
          scrub:         0.6,
          invalidateOnRefresh: true,
        },
      })

      /* Phase 0–55% — vidéo monte en opacité progressivement */
      tl.fromTo(videoRef.current,
        { opacity: 0 },
        { opacity: 1, ease: 'sine.in', duration: 0.55 },
        0,
      )

      /* Phase 0–40% — labels / borders : dark → white */
      tl.fromTo(section.querySelectorAll('.mv-label'),
        { color: 'rgb(100,116,139)' },
        { color: 'rgba(255,255,255,0.50)', ease: 'none', duration: 0.40 },
        0,
      )
      tl.fromTo(section.querySelectorAll('.mv-border'),
        { borderColor: 'rgba(226,232,240,1)' },
        { borderColor: 'rgba(255,255,255,0.15)', ease: 'none', duration: 0.40 },
        0,
      )
      tl.fromTo(section.querySelectorAll('.mv-num'),
        { color: 'rgb(12,122,82)' },
        { color: 'rgba(90,221,164,0.85)', ease: 'none', duration: 0.40 },
        0,
      )

      /* Phase 0–45% — titres : dark → blanc */
      tl.fromTo(section.querySelectorAll('.mv-word'),
        { color: 'rgb(5,5,5)' },
        { color: 'rgb(255,255,255)', ease: 'none', duration: 0.45 },
        0,
      )

      /* Phase 0–45% — descriptions : gray → white/75 */
      tl.fromTo(section.querySelectorAll('.mv-desc'),
        { color: 'rgb(71,85,105)' },
        { color: 'rgba(255,255,255,0.70)', ease: 'none', duration: 0.45 },
        0,
      )

    }, wrap)

    return () => {
      splits.forEach(s => {
        try { s.revert() } catch { /* nœud déjà unmounté */ }
      })
      ctx.revert()
    }
  }, [])

  return (
    /* Wrapper — 100vh desktop, hauteur auto mobile ; flux normal, pas de pin */
    <div ref={wrapRef} className="relative min-h-screen lg:h-screen">

      {/* ── Couche 1 : vidéo plein fond ── */}
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover object-center"
        style={{ opacity: 0 }}
        autoPlay
        muted
        loop
        playsInline
        poster="/images/home/home-mountains-poster.webp"
        preload="none"
        aria-hidden="true"
        data-src-mobile="/videos/assets-animation1-mobile.mp4"
        data-src-desktop="/videos/assets-animation1-web.mp4"
      >
        <track kind="captions" />
      </video>

      {/* ── Couche 2 : section Mission sticky, bg transparent ── */}
      <div
        ref={sectionRef}
        className="relative lg:absolute lg:inset-0 z-10"
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:h-full flex flex-col justify-center py-16 lg:pt-20 lg:pb-0">

          {/* Header row */}
          <div className="mv-border flex items-center justify-between border-b py-4 mb-0">
            <p className="mv-label font-sans font-semibold text-[10px] uppercase tracking-[0.28em]">
              / {tM('label')}
            </p>
            <p className="mv-label font-sans font-semibold text-[10px] uppercase tracking-[0.2em]">
              {tM('sub')}
            </p>
          </div>

          {/* 5 colonnes Mission */}
          <div className="mv-border grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 divide-y md:divide-y-0 md:divide-x border-b" style={{ borderColor: 'rgba(226,232,240,1)' }}>
            {missionItems.map((item, i) => (
              <div key={item.title} className="py-12 md:px-10 first:pl-0 last:pr-0">
                <p className="mv-num font-sans font-semibold text-[10px] tracking-[0.2em] mb-8">
                  {String(i + 1).padStart(2, '0')}
                </p>
                <h3
                  className="mv-title font-sans font-bold tracking-[-0.02em] leading-[1.2] pb-[0.15em] mb-5"
                  style={{ fontSize: 'clamp(13px,1.1vw,16px)' }}
                  dangerouslySetInnerHTML={{ __html: item.title }}
                />
                <p className="mv-desc font-sans font-normal text-[15px] leading-[1.75]">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
