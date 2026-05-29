'use client'

import { useEffect, useRef } from 'react'
import { gsap, ScrollTrigger } from '@/lib/gsap'

const PILLARS = [
  {
    key:     'AEGIS',
    origin:  'Grec ancien — αἰγίς',
    meaning: 'Le bouclier divin de Zeus et Athéna.',
    apply:   'Aegryn couvre et protège chacun de ses actifs.',
  },
  {
    key:     'AEGIR',
    origin:  'Vieux norrois — Ægir',
    meaning: 'Dieu de la mer, maître des courants invisibles.',
    apply:   'Aegryn orchestre les flux de valeur entre ses actifs.',
  },
  {
    key:     'AEON',
    origin:  'Grec ancien — αἰών',
    meaning: "L'éternité. Une ère immense.",
    apply:   'Chaque actif est construit pour durer des décennies.',
  },
]

export function ManifestoSection() {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.pillar-col', {
        opacity: 0, y: 24, stagger: 0.12,
        ease: 'expo.out', duration: 0.7,
        scrollTrigger: {
          trigger: ref.current,
          start: 'top 75%',
        },
      })
    }, ref)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={ref} className="py-32 bg-ag-white border-t border-ag-border">
      <div className="max-w-7xl mx-auto px-6 md:px-12">

        <div className="mb-20">
          <p className="font-mono text-[11px] tracking-[0.2em] uppercase text-ag-gray-light mb-4">
            Le nom AEGRYN
          </p>
          <h2
            className="font-display font-black text-ag-black tracking-[-0.03em] leading-[0.95]"
            style={{ fontSize: 'clamp(32px,4vw,56px)' }}
          >
            Trois racines.<br />Une mission.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-ag-border">
          {PILLARS.map((p) => (
            <div
              key={p.key}
              className="pillar-col py-10 md:py-0 md:px-10 first:pl-0 last:pr-0"
            >
              <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-ag-gray-light mb-3">
                {p.origin}
              </p>
              <h3 className="font-display font-black text-ag-black text-[28px] tracking-[-0.02em] mb-4">
                {p.key}
              </h3>
              <p className="text-[14px] text-ag-gray leading-relaxed mb-3">
                {p.meaning}
              </p>
              <p className="font-mono text-[12px] text-ag-gray-light leading-relaxed">
                {p.apply}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
