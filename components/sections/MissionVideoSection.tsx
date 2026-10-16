'use client'

import { useLayoutEffect, useRef } from 'react'
import Image               from 'next/image'
import { useTranslations } from 'next-intl'
import { gsap }            from '@/lib/gsap'

/**
 * MissionVideoSection (Le Modèle Aegryn)
 *
 * Desktop : une photo (voilier, cordage) apparaît en carte arrondie (1/4 de la surface)
 * et s'agrandit progressivement dès l'entrée de la section, jusqu'au plein écran ; la section
 * s'épingle alors, la photo s'assombrit sous un voile navy et le contenu se dévoile en superposition.
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
      /* Phase 1 : dès que la section entre dans l'écran, la carte (1/4 de la surface)
         s'agrandit progressivement jusqu'au plein écran, au rythme du scroll */
      const grow = { trigger: wrap, start: 'top bottom', end: 'top top', scrub: 0.6, invalidateOnRefresh: true }
      gsap.fromTo(frameRef.current,
        { clipPath: 'inset(25% 25% 25% 25% round 28px)' },
        { clipPath: 'inset(0% 0% 0% 0% round 0px)', ease: 'none', scrollTrigger: grow })
      gsap.fromTo(imgRef.current, { scale: 1.3 }, { scale: 1, ease: 'none', scrollTrigger: grow })
      /* Phase 2 : section épinglée, voile navy puis contenu dévoilé colonne par colonne */
      const tl = gsap.timeline({
        scrollTrigger: { trigger: wrap, start: 'top top', end: '+=110%', pin: true, scrub: 0.6, invalidateOnRefresh: true },
      })
      tl.fromTo(veilRef.current, { opacity: 0 }, { opacity: 1, ease: 'none', duration: 0.35 }, 0)
      tl.fromTo(items, { opacity: 0, y: 36 }, { opacity: 1, y: 0, ease: 'power2.out', duration: 0.35, stagger: 0.08 }, 0.25)
    })

    return () => mm.revert()
  }, [])

  return (
    <div ref={wrapRef} className="relative min-h-screen overflow-hidden bg-white lg:h-screen">

      {/* Couche 1 : photo, carte arrondie qui s'étend au scroll (état final plein cadre hors desktop) */}
      <div
        ref={frameRef}
        className="absolute inset-0 overflow-hidden lg:[clip-path:inset(25%_25%_25%_25%_round_28px)]"
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
        <div className="mx-auto flex max-w-7xl flex-col justify-center px-6 py-16 md:px-12 lg:h-full lg:justify-start lg:pb-4 lg:pt-[26vh]">

          <div className="mv-reveal flex flex-col items-start gap-2 py-4 md:flex-row md:items-center md:justify-between">
            <p className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.28em] text-ag-apex"><span className="inline-block h-px w-5 bg-ag-apex/50" />{tM('label')}</p>
            <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.2em] text-white/70">{tM('sub')}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5">
            {missionItems.map((item, i) => (
              <div key={item.title} className="mv-reveal py-[clamp(14px,4.5vh,48px)] first:pl-0 last:pr-0 md:px-4 xl:px-4" style={{ textShadow: '0 1px 14px rgba(5,15,35,0.45)' }}>
                <p className="mb-[clamp(6px,2.6vh,32px)] font-sans text-[10px] font-semibold tracking-[0.2em] text-ag-apex">{String(i + 1).padStart(2, '0')}</p>
                <h3
                  className="mb-[clamp(6px,1.8vh,20px)] pb-[0.15em] font-sans font-bold leading-[1.2] tracking-[-0.02em] text-white"
                  style={{ fontSize: 'clamp(13px,1.1vw,16px)' }}
                  dangerouslySetInnerHTML={{ __html: item.title }}
                />
                <p className="font-sans font-normal text-white/90" style={{ fontSize: 'clamp(12.5px,min(1.05vw,2.3vh),15px)', lineHeight: 1.65 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
