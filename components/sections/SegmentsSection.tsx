'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { gsap } from '@/lib/gsap'

/* ─── Images dédiées à cette section uniquement ────────────────
   Téléchargées depuis Unsplash (licence gratuite), stockées dans
   /public/images/segments/segments-*.jpg — non partagées avec d'autres sections.
──────────────────────────────────────────────────────────────── */
const SEGMENT_IMAGES: Record<string, { src: string; alt: string }> = {
  startup:    { src: '/images/segments/segments-startup.jpg',    alt: 'Startup & Scale-up — équipe tech en open-space' },
  pme:        { src: '/images/segments/segments-pme.jpg',        alt: 'PME en croissance — réunion de direction' },
  enterprise: { src: '/images/segments/segments-enterprise.jpg', alt: 'Grands groupes — architecture corporative' },
  funds:      { src: '/images/segments/segments-funds.jpg',      alt: 'Fonds & Investisseurs — analyse financière' },
}

export function SegmentsSection() {
  const t = useTranslations('homeClients')
  const ref = useRef<HTMLElement>(null)

  const cards = t.raw('cards') as { key: string; title: string; desc: string }[]

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const ctx = gsap.context(() => {
      gsap.fromTo('.seg-card',
        { opacity: 0, y: 24 },
        {
          opacity: 1, y: 0,
          stagger: 0.1, duration: 0.75, ease: 'expo.out',
          scrollTrigger: { trigger: ref.current, start: 'top 76%', once: true },
        },
      )
    })
    return () => ctx.revert()
  }, [])

  return (
    <section ref={ref} className="border-t border-ag-border bg-ag-white py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="flex items-center justify-between pb-4 mb-12">
          <p className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.28em] text-ag-apex-ink "><span className="inline-block h-px w-5 bg-ag-apex/50" />{t('label')}</p>
        </div>
        <h2
          className="font-sans font-bold text-ag-black tracking-[-0.03em] leading-[1.2] mb-14"
          style={{ fontSize: 'clamp(26px,3vw,44px)' }}
        >
          {t('title')}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {cards.map((card) => {
            const img = SEGMENT_IMAGES[card.key]
            return (
              <div
                key={card.key}
                className="seg-card group relative overflow-hidden rounded-2xl"
                style={{ minHeight: '380px' }}
              >
                {/* Image background plein-cadre */}
                {img && (
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                  />
                )}

                {/* Gradient overlay — lisibilité du texte */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/10 transition-all duration-500 group-hover:from-black/90 group-hover:via-black/45" />

                {/* Contenu ancré en bas */}
                <div className="absolute inset-0 flex flex-col justify-end p-5">
                  <h3 className="font-sans font-bold text-white tracking-[-0.01em] leading-[1.15] mb-3 max-lg:whitespace-nowrap text-[15px] sm:text-[18px]">
                    {card.title}
                  </h3>
                  <p className="font-sans font-normal text-[15px] text-white/80 leading-relaxed line-clamp-4 group-hover:line-clamp-none transition-all duration-300">
                    {card.desc}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
