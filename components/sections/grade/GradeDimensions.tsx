'use client'

import { useEffect, useRef } from 'react'
import { useTranslations } from 'next-intl'
import { gsap } from '@/lib/gsap'

/* badgeAlign: où placer le badge dans la carte (coin extérieur) */
type BadgeAlign = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'top-left-default'

function CornerCard({
  code, name, desc, badgeAlign, className = '',
}: {
  code: string; name: string; desc: string; badgeAlign: BadgeAlign; className?: string
}) {
  const isRight  = badgeAlign === 'top-right'  || badgeAlign === 'bottom-right'
  const isBottom = badgeAlign === 'bottom-left' || badgeAlign === 'bottom-right'

  return (
    <div
      className={`dim-item flex flex-col bg-white p-6 ${className}`}
      style={{ border: '1px solid #b0b8c1' }}
    >
      {isBottom ? (
        /* Badge bas + texte au-dessus du badge */
        <>
          <div className="min-w-0 mb-4">
            <p className="font-sans font-semibold text-ag-black text-[14px] mb-1">{name}</p>
            <p className="font-sans text-[12px] leading-relaxed text-ag-gray">{desc}</p>
          </div>
          <div className={`flex ${isRight ? 'justify-end' : 'justify-start'}`}>
            <DimBadge code={code} />
          </div>
        </>
      ) : (
        /* Badge haut + texte en dessous */
        <>
          <div className={`flex mb-4 ${isRight ? 'justify-end' : 'justify-start'}`}>
            <DimBadge code={code} />
          </div>
          <div className="min-w-0">
            <p className="font-sans font-semibold text-ag-black text-[14px] mb-1">{name}</p>
            <p className="font-sans text-[12px] leading-relaxed text-ag-gray">{desc}</p>
          </div>
        </>
      )}
    </div>
  )
}

function DimBadge({ code, dark = false }: { code: string; dark?: boolean }) {
  return (
    <div
      className="w-9 h-9 flex items-center justify-center shrink-0"
      style={{ background: dark ? '#5ADDA4' : '#0D1F3C' }}
    >
      <span className="font-sans font-bold text-[13px]" style={{ color: dark ? '#0D1F3C' : '#5ADDA4' }}>
        {code}
      </span>
    </div>
  )
}

export function GradeDimensions() {
  const t     = useTranslations('grade.dimensions')
  const ref   = useRef<HTMLElement>(null)
  const items = t.raw('items') as { code: string; name: string; desc: string }[]

  const corners = items.slice(0, 4)  // C I F S
  const center  = items[4]           // O

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.dim-item', {
        opacity: 0, y: 20,
        stagger: 0.08, ease: 'expo.out', duration: 0.75,
        scrollTrigger: { trigger: ref.current, start: 'top 75%' },
      })
    }, ref)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={ref} className="bg-ag-white border-t border-ag-border py-24 px-6">
      <div className="max-w-4xl mx-auto">

        <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-ag-gray-light mb-4">
          {t('label')}
        </p>
        <h2
          className="font-sans font-bold text-ag-black tracking-[-0.03em] leading-[1.05] mb-16"
          style={{ fontSize: 'clamp(28px,3.5vw,48px)' }}
        >
          {t('title')}
        </h2>

        {/* Desktop — grille 2×2 + O absolument centré qui chevauche les 4 coins */}
        <div className="hidden md:block relative">
          {/* Grille 2×2 CIFSO */}
          <div className="grid grid-cols-2 gap-3">
            {/* C — haut gauche, badge top-left */}
            <CornerCard
              code={corners[0].code} name={corners[0].name} desc={corners[0].desc}
              badgeAlign="top-left" className="pb-28"
            />
            {/* I — haut droit, badge top-right */}
            <CornerCard
              code={corners[1].code} name={corners[1].name} desc={corners[1].desc}
              badgeAlign="top-right" className="pb-28"
            />
            {/* F — bas gauche, badge bottom-left */}
            <CornerCard
              code={corners[2].code} name={corners[2].name} desc={corners[2].desc}
              badgeAlign="bottom-left" className="pt-28"
            />
            {/* S — bas droit, badge bottom-right */}
            <CornerCard
              code={corners[3].code} name={corners[3].name} desc={corners[3].desc}
              badgeAlign="bottom-right" className="pt-28"
            />
          </div>

          {/* O — absolument centré, passe au-dessus des 4 coins */}
          {center && (
            <div
              className="dim-item absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
              style={{
                width: 'calc(50% - 6px)',
                background: '#0D1F3C',
                border: '1px solid rgba(90,221,164,0.5)',
                boxShadow: '0 12px 40px rgba(13,31,60,0.30), 0 2px 8px rgba(0,0,0,0.15)',
                zIndex: 10,
                padding: '1.5rem',
              }}
            >
              <div className="flex justify-center mb-3">
                <DimBadge code={center.code} dark />
              </div>
              <div>
                <p className="font-sans font-semibold text-white text-[14px] mb-1">{center.name}</p>
                <p className="font-sans text-[12px] leading-relaxed" style={{ color: 'rgba(255,255,255,0.65)' }}>{center.desc}</p>
              </div>
            </div>
          )}
        </div>

        {/* Mobile — liste verticale */}
        <div className="md:hidden flex flex-col gap-3">
          {corners.map(({ code, name, desc }) => (
            <CornerCard key={code} code={code} name={name} desc={desc} badgeAlign="top-left" />
          ))}
          {center && (
            <div className="dim-item p-6 flex flex-col gap-3" style={{ background: '#0D1F3C', border: '1px solid rgba(90,221,164,0.5)' }}>
              <DimBadge code={center.code} dark />
              <div>
                <p className="font-sans font-semibold text-white text-[14px] mb-1">{center.name}</p>
                <p className="font-sans text-[12px] leading-relaxed" style={{ color: 'rgba(255,255,255,0.65)' }}>{center.desc}</p>
              </div>
            </div>
          )}
        </div>

      </div>
    </section>
  )
}
