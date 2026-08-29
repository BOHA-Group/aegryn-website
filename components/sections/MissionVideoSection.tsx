'use client'

import { useLayoutEffect, useRef } from 'react'
import { useTranslations }   from 'next-intl'
import { gsap, SplitText }   from '@/lib/gsap'

/**
 * MissionVideoSection
 *
 * Architecture :
 *   - Wrapper pin +=300vh
 *   - Couche 1 : vidéo assets-animation1 plein fond (opacity 0→1 scrubé)
 *   - Couche 2 : section "Notre Mission" sticky, bg transparent
 *               Texte dark→blanc progressivement via GSAP scrub (color interpolation)
 *               Borders dark→white/20
 *   - Après dépinning : AssetGrid apparaît en dessous normalement (normal flow)
 */
export function MissionVideoSection() {
  const wrapRef    = useRef<HTMLDivElement>(null)
  const videoRef   = useRef<HTMLVideoElement>(null)
  const sectionRef = useRef<HTMLDivElement>(null)

  const tM = useTranslations('missionSection')
  const missionItems = tM.raw('items') as { title: string; desc: string }[]

  useLayoutEffect(() => {
    const wrap    = wrapRef.current
    const section = sectionRef.current
    if (!wrap || !section) return

    const isMobile = window.innerWidth < 1024

    /* SplitText sur les titres Mission pour animer mot par mot */
    const splits: SplitText[] = []
    const titleEls = section.querySelectorAll<HTMLElement>('.mv-title')
    titleEls.forEach((el) => {
      const s = new SplitText(el, { type: 'words', wordsClass: 'mv-word' })
      splits.push(s)
    })

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger:       wrap,
          start:         'top top',
          end:           isMobile ? 'bottom bottom' : '+=300%',
          pin:           !isMobile,
          scrub:         true,
          anticipatePin: isMobile ? 0 : 1,
          invalidateOnRefresh: true,
        },
      })

      /* Phase 0–25% — vidéo monte en opacité */
      tl.fromTo(videoRef.current,
        { opacity: 0 },
        { opacity: 1, ease: 'none', duration: 0.25 },
        0,
      )

      /* Phase 0–40% — labels / borders : dark → white */
      tl.fromTo(section.querySelectorAll('.mv-label'),
        { color: 'rgb(148,163,184)' },
        { color: 'rgba(255,255,255,0.50)', ease: 'none', duration: 0.40 },
        0,
      )
      tl.fromTo(section.querySelectorAll('.mv-border'),
        { borderColor: 'rgba(226,232,240,1)' },
        { borderColor: 'rgba(255,255,255,0.15)', ease: 'none', duration: 0.40 },
        0,
      )
      tl.fromTo(section.querySelectorAll('.mv-num'),
        { color: 'rgb(90,221,164)' },
        { color: 'rgba(90,221,164,0.60)', ease: 'none', duration: 0.40 },
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
    /* Wrapper — desktop: 100vh pinné | mobile: hauteur auto (contenu complet visible) */
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
        poster="/images/home-mountains.png"
        preload="auto"
      >
        <source src="/videos/assets-animation1-web.mp4" type="video/mp4" />
      </video>

      {/* ── Couche 2 : section Mission sticky, bg transparent ── */}
      <div
        ref={sectionRef}
        className="relative lg:absolute lg:inset-0 z-10"
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:h-full flex flex-col justify-center py-16 lg:py-0">

          {/* Header row */}
          <div className="mv-border flex items-center justify-between border-b py-4 mb-0">
            <p className="mv-label font-sans font-semibold text-[10px] uppercase tracking-[0.28em]">
              / {tM('label')}
            </p>
            <p className="mv-label font-sans font-semibold text-[10px] uppercase tracking-[0.2em]">
              {tM('sub')}
            </p>
          </div>

          {/* 3 colonnes Mission */}
          <div className="mv-border grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x border-b" style={{ borderColor: 'rgba(226,232,240,1)' }}>
            {missionItems.map((item, i) => (
              <div key={item.title} className="py-12 md:px-10 first:pl-0 last:pr-0">
                <p className="mv-num font-sans font-semibold text-[10px] tracking-[0.2em] mb-8">
                  {String(i + 1).padStart(2, '0')}
                </p>
                <h3
                  className="mv-title font-sans font-bold tracking-[-0.02em] leading-[1.2] pb-[0.15em] mb-5 overflow-hidden"
                  style={{ fontSize: 'clamp(22px,2vw,28px)' }}
                  dangerouslySetInnerHTML={{ __html: item.title }}
                />
                <p className="mv-desc font-sans font-normal text-[14px] leading-[1.75]">
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
