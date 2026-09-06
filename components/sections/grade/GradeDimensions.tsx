'use client'

import { useEffect, useRef } from 'react'
import { useTranslations } from 'next-intl'
import { gsap } from '@/lib/gsap'

/* Inclinaisons 3D de chaque coin vers le centre (effet pyramidal) */
const CORNER_TRANSFORMS = [
  'rotateX(6deg) rotateY(6deg)',   // C — haut gauche → incline vers bas-droite
  'rotateX(6deg) rotateY(-6deg)',  // I — haut droit  → incline vers bas-gauche
  'rotateX(-6deg) rotateY(6deg)',  // F — bas gauche  → incline vers haut-droite
  'rotateX(-6deg) rotateY(-6deg)',// S — bas droit   → incline vers haut-gauche
]

function DimBadge({ code, dark = false }: { code: string; dark?: boolean }) {
  return (
    <div
      className="w-9 h-9 flex items-center justify-center shrink-0"
      style={{ background: dark ? '#5ADDA4' : '#0D1F3C' }}
    >
      <span
        className="font-sans font-bold text-[13px]"
        style={{ color: dark ? '#0D1F3C' : '#5ADDA4' }}
      >
        {code}
      </span>
    </div>
  )
}

export function GradeDimensions() {
  const t     = useTranslations('grade.dimensions')
  const ref   = useRef<HTMLElement>(null)
  const items = t.raw('items') as { code: string; name: string; desc: string }[]

  const corners = items.slice(0, 4)
  const center  = items[4]

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.dim-corner', {
        opacity: 0, scale: 0.92,
        stagger: 0.1, ease: 'expo.out', duration: 0.8,
        scrollTrigger: { trigger: ref.current, start: 'top 72%' },
      })
      gsap.from('.dim-center', {
        opacity: 0, y: -16, scale: 0.9,
        ease: 'expo.out', duration: 0.85, delay: 0.4,
        scrollTrigger: { trigger: ref.current, start: 'top 72%' },
      })
    }, ref)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={ref} className="bg-ag-white border-t border-ag-border py-24 px-6">
      <div className="max-w-5xl mx-auto">

        <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-ag-gray-light mb-4">
          {t('label')}
        </p>
        <h2
          className="font-sans font-bold text-ag-black tracking-[-0.03em] leading-[1.05] mb-16"
          style={{ fontSize: 'clamp(28px,3.5vw,48px)' }}
        >
          {t('title')}
        </h2>

        {/* ── Desktop : layout pyramidal 3D ── */}
        <div className="hidden md:block" style={{ perspective: '1400px', perspectiveOrigin: '50% 40%' }}>

          {/* Conteneur grille — preserve-3d pour que les coins ET O vivent dans le même espace 3D */}
          <div
            style={{
              position: 'relative',
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gridTemplateRows: '240px 240px',
              gap: '2px',
              background: '#e2e6ea',
              border: '1px solid #e2e6ea',
              transformStyle: 'preserve-3d',
            }}
          >
            {/* 4 coins — inclinés vers le centre */}
            {corners.map(({ code, name, desc }, i) => (
              <div
                key={code}
                className="dim-corner bg-ag-white p-8 flex gap-5"
                style={{
                  transform: CORNER_TRANSFORMS[i],
                  transformOrigin:
                    i === 0 ? 'bottom right'
                    : i === 1 ? 'bottom left'
                    : i === 2 ? 'top right'
                    : 'top left',
                  boxShadow: 'inset 0 0 0 1px #e2e6ea',
                }}
              >
                <DimBadge code={code} />
                <div>
                  <p className="font-sans font-semibold text-ag-black text-[15px] mb-1.5">{name}</p>
                  <p className="font-sans text-[13px] text-ag-gray leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}

            {/* O — absolument centré dans la grille, soulevé en Z */}
            {center && (
              <div
                className="dim-center"
                style={{
                  position: 'absolute',
                  left: '50%',
                  top: '50%',
                  transform: 'translate(-50%, -50%) translateZ(60px)',
                  width: 'min(360px, 55%)',
                  zIndex: 10,
                  boxShadow: '0 32px 64px rgba(13,31,60,0.35), 0 8px 24px rgba(0,0,0,0.2)',
                  border: '2px solid rgba(90,221,164,0.65)',
                  background: '#0D1F3C',
                  padding: '1.75rem',
                  display: 'flex',
                  gap: '1.25rem',
                }}
              >
                <DimBadge code={center.code} dark />
                <div>
                  <p className="font-sans font-semibold text-white text-[15px] mb-1.5">{center.name}</p>
                  <p className="font-sans text-[13px] leading-relaxed" style={{ color: 'rgba(255,255,255,0.65)' }}>{center.desc}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── Mobile : liste verticale ── */}
        <div className="md:hidden flex flex-col gap-px" style={{ background: '#e2e6ea', border: '1px solid #e2e6ea' }}>
          {corners.map(({ code, name, desc }) => (
            <div key={code} className="dim-corner bg-ag-white p-7 flex gap-5">
              <DimBadge code={code} />
              <div>
                <p className="font-sans font-semibold text-ag-black text-[15px] mb-1.5">{name}</p>
                <p className="font-sans text-[13px] text-ag-gray leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
          {center && (
            <div className="dim-center p-7 flex gap-5" style={{ background: '#0D1F3C', borderTop: '2px solid rgba(90,221,164,0.6)' }}>
              <DimBadge code={center.code} dark />
              <div>
                <p className="font-sans font-semibold text-white text-[15px] mb-1.5">{center.name}</p>
                <p className="font-sans text-[13px] leading-relaxed" style={{ color: 'rgba(255,255,255,0.65)' }}>{center.desc}</p>
              </div>
            </div>
          )}
        </div>

      </div>
    </section>
  )
}
