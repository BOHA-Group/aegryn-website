'use client'

import { useLayoutEffect, useRef } from 'react'
import Image               from 'next/image'
import { useTranslations } from 'next-intl'
import { gsap }            from '@/lib/gsap'

/**
 * MissionVideoSection (Le Modèle Aegryn)
 *
 * Desktop : la section est épinglée quelques écrans. Une photo (voilier, cordage)
 * apparaît en carte arrondie, s'étend jusqu'au plein écran au scroll, s'assombrit
 * sous un voile navy, puis le contenu de la section se dévoile en superposition.
 * Le voile (navy 70 %) garantit le contraste du texte blanc sur le ciel clair et le pont blanc.
 * Mobile / mouvement réduit : photo plein fond avec voile, contenu visible, sans épinglage.
 */
export function MissionVideoSection() {
  const wrapRef    = useRef<HTMLDivElement>(null)
  const frameRef   = useRef<HTMLDivElement>(null)
  const imgRef     = useRef<HTMLDivElement>(null)
  const veilRef    = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  const tM = useTranslations('missionSection')
  const missionItems = tM.raw('items') as { title: string; desc: string }[]

  useLayoutEffect(() => {
    const wrap = wrapRef.current
    if (!wrap) return
    const mm = gsap.matchMedia()

    mm.add('(min-width: 1024px) and (prefers-reduced-motion: no-preference)', () => {
      const items = contentRef.current?.querySelectorAll('.mv-reveal') ?? []
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: wrap,
          start: 'top top',
          end: '+=140%',
          pin: true,
          scrub: 0.6,
          invalidateOnRefresh: true,
        },
      })
      /* 0 → 45 % : la carte s'étend jusqu'au plein écran, la photo se recadre */
      tl.fromTo(frameRef.current,
        { clipPath: 'inset(14% 10% 14% 10% round 28px)' },
        { clipPath: 'inset(0% 0% 0% 0% round 0px)', ease: 'power2.inOut', duration: 0.45 }, 0)
      tl.fromTo(imgRef.current, { scale: 1.14 }, { scale: 1, ease: 'none', duration: 0.6 }, 0)
      /* 35 → 60 % : voile navy pour le contraste */
      tl.fromTo(veilRef.current, { opacity: 0 }, { opacity: 1, ease: 'none', duration: 0.25 }, 0.35)
      /* 50 → 100 % : le contenu se dévoile, colonne par colonne */
      tl.fromTo(items, { opacity: 0, y: 36 }, { opacity: 1, y: 0, ease: 'power2.out', duration: 0.3, stagger: 0.08 }, 0.5)
    })

    return () => mm.revert()
  }, [])

  return (
    <div ref={wrapRef} className="relative min-h-screen overflow-hidden bg-white lg:h-screen">

      {/* Couche 1 : photo, carte arrondie qui s'étend au scroll (état final plein cadre hors desktop) */}
      <div
        ref={frameRef}
        className="absolute inset-0 overflow-hidden lg:[clip-path:inset(14%_10%_14%_10%_round_28px)]"
        aria-hidden="true"
      >
        <div ref={imgRef} className="absolute inset-0 will-change-transform">
          <Image
            src="/images/home/rope-boat.jpg"
            alt=""
            fill
            sizes="100vw"
            unoptimized
            className="object-cover object-center"
          />
        </div>
        <div ref={veilRef} className="absolute inset-0 bg-ag-navy/[0.7]" />
      </div>

      {/* Couche 2 : contenu en superposition */}
      <div ref={contentRef} className="relative z-10 lg:absolute lg:inset-0">
        <div className="mx-auto flex max-w-7xl flex-col justify-center px-6 py-16 md:px-12 lg:h-full lg:pb-0 lg:pt-20">

          <div className="mv-reveal flex flex-col items-start gap-2 border-b border-white/20 py-4 md:flex-row md:items-center md:justify-between">
            <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.28em] text-white/70">/ {tM('label')}</p>
            <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.2em] text-white/70">{tM('sub')}</p>
          </div>

          <div className="grid grid-cols-1 divide-y divide-white/20 border-b border-white/20 md:grid-cols-2 md:divide-x md:divide-y-0 lg:grid-cols-5">
            {missionItems.map((item, i) => (
              <div key={item.title} className="mv-reveal py-12 first:pl-0 last:pr-0 md:px-10" style={{ textShadow: '0 1px 14px rgba(5,15,35,0.45)' }}>
                <p className="mb-8 font-sans text-[10px] font-semibold tracking-[0.2em] text-ag-apex">{String(i + 1).padStart(2, '0')}</p>
                <h3
                  className="mb-5 pb-[0.15em] font-sans font-bold leading-[1.2] tracking-[-0.02em] text-white"
                  style={{ fontSize: 'clamp(13px,1.1vw,16px)' }}
                  dangerouslySetInnerHTML={{ __html: item.title }}
                />
                <p className="font-sans text-[15px] font-normal leading-[1.75] text-white/90">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
