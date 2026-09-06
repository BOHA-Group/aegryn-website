'use client'

import { useEffect, useRef } from 'react'
import { useTranslations } from 'next-intl'
import { gsap } from '@/lib/gsap'

function Card({ code, name, desc, dark = false, className = '' }: {
  code: string; name: string; desc: string; dark?: boolean; className?: string
}) {
  return (
    <div
      className={`dim-item flex flex-col gap-3 p-6 border border-ag-border ${className}`}
      style={{ background: dark ? '#0D1F3C' : '#ffffff' }}
    >
      <DimBadge code={code} dark={dark} />
      <div>
        <p className={`font-sans font-semibold text-[14px] mb-1 ${dark ? 'text-white' : 'text-ag-black'}`}>{name}</p>
        <p className="font-sans text-[12px] leading-relaxed" style={{ color: dark ? 'rgba(255,255,255,0.6)' : '#6b7280' }}>{desc}</p>
      </div>
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

        {/* Desktop — grille 3×3, 5 cartes aux positions C/I/F/S/O */}
        <div
          className="hidden md:grid"
          style={{
            gridTemplateColumns: 'repeat(3, 1fr)',
            gridTemplateRows: 'repeat(3, 160px)',
            gap: '12px',
          }}
        >
          {/* C — haut gauche [1,1] */}
          <div style={{ gridColumn: 1, gridRow: 1 }}>
            <Card code={corners[0].code} name={corners[0].name} desc={corners[0].desc} className="h-full" />
          </div>
          {/* I — haut droit [3,1] */}
          <div style={{ gridColumn: 3, gridRow: 1 }}>
            <Card code={corners[1].code} name={corners[1].name} desc={corners[1].desc} className="h-full" />
          </div>
          {/* O — centre [2,2] */}
          {center && (
            <div style={{ gridColumn: 2, gridRow: 2 }}>
              <Card code={center.code} name={center.name} desc={center.desc} dark className="h-full" />
            </div>
          )}
          {/* F — bas gauche [1,3] */}
          <div style={{ gridColumn: 1, gridRow: 3 }}>
            <Card code={corners[2].code} name={corners[2].name} desc={corners[2].desc} className="h-full" />
          </div>
          {/* S — bas droit [3,3] */}
          <div style={{ gridColumn: 3, gridRow: 3 }}>
            <Card code={corners[3].code} name={corners[3].name} desc={corners[3].desc} className="h-full" />
          </div>
        </div>

        {/* Mobile — liste verticale */}
        <div className="md:hidden flex flex-col gap-3">
          {corners.map(({ code, name, desc }) => (
            <Card key={code} code={code} name={name} desc={desc} />
          ))}
          {center && (
            <Card code={center.code} name={center.name} desc={center.desc} dark />
          )}
        </div>

      </div>
    </section>
  )
}
