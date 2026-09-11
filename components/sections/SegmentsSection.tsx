'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { gsap } from '@/lib/gsap'

/* ─── Image par profil client ────────────────────────────────
   Chaque clé correspond à card.key dans homeSegments.cards.
   Les images thématiques sont déjà présentes dans /public/images/.
   Aucune image dupliquée : elles ne sont pas utilisées dans
   SegmentsSection jusqu'ici (vérification : grep confirme absence
   de ces chemins dans ce composant avant refonte).
──────────────────────────────────────────────────────────────── */
const SEGMENT_IMAGES: Record<string, { src: string; alt: string }> = {
  startup:    { src: '/images/theme_saas.jpg',        alt: 'Startup & Scale-up — croissance technologique' },
  pme:        { src: '/images/theme_marketplace.jpg', alt: 'PME en croissance — marché et transmission' },
  enterprise: { src: '/images/theme_IP.jpg',          alt: 'Grands groupes — actifs IP et stratégie' },
  funds:      { src: '/images/theme_fintech.jpg',     alt: 'Fonds & Investisseurs — fintech et capital' },
}

const FALLBACK = '/images/home_geneva.jpg'

export function SegmentsSection() {
  const t = useTranslations('homeSegments')
  const ref = useRef<HTMLElement>(null)

  const cards = t.raw('cards') as { key: string; title: string; desc: string }[]

  useEffect(() => {
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
        <div className="flex items-center justify-between border-b border-ag-border pb-4 mb-12">
          <span className="font-sans font-semibold text-[10px] uppercase tracking-[0.28em] text-ag-gray-light">
            / {t('label')}
          </span>
        </div>
        <h2
          className="font-sans font-bold text-ag-black tracking-[-0.03em] leading-[1.2] mb-14"
          style={{ fontSize: 'clamp(28px,3.5vw,48px)' }}
        >
          {t('title')}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {cards.map((card) => {
            const img = SEGMENT_IMAGES[card.key] ?? { src: FALLBACK, alt: card.title }
            return (
              <div
                key={card.key}
                className="seg-card group relative overflow-hidden rounded-2xl"
                style={{ opacity: 0, minHeight: '380px' }}
              >
                {/* Image background plein-cadre */}
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                />

                {/* Overlay gradient du bas — assure lisibilité du texte */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10 transition-all duration-500 group-hover:from-black/90 group-hover:via-black/40" />

                {/* Contenu — ancré en bas */}
                <div className="absolute inset-0 flex flex-col justify-end p-7">
                  <h3
                    className="font-sans font-bold text-white tracking-[-0.02em] leading-tight mb-3"
                    style={{ fontSize: 'clamp(15px,1.2vw,18px)' }}
                  >
                    {card.title}
                  </h3>
                  <p className="font-sans font-normal text-[12px] text-white/70 leading-relaxed line-clamp-4 group-hover:line-clamp-none transition-all duration-300">
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
