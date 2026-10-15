'use client'

import { useEffect, useRef } from 'react'
import { useTranslations }   from 'next-intl'
import { gsap }              from '@/lib/gsap'

export function MarketStatStrip() {
  const ref = useRef<HTMLElement>(null)
  const t   = useTranslations('marketStats')

  const stats = (t.raw('stats') as { value: string; label: string; source: string }[]) || []

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.market-stat', {
        opacity: 0, y: 20, stagger: 0.1,
        ease: 'expo.out', duration: 0.7,
        scrollTrigger: {
          trigger: ref.current, start: 'top 80%',
          onEnter: () => {
            ref.current?.querySelectorAll<HTMLElement>('[data-counter]').forEach(el => {
              const raw = el.getAttribute('data-counter') ?? ''
              const range = raw.match(/^(\D*)(\d+)(\D*)(\d+)(\D*)$/)
              if (range) {
                /* Plage à deux nombres (ex. « 30 à 50% ») : le premier compte
                   jusqu'à sa cible, puis le second enchaîne jusqu'à la sienne. */
                const [, p1, n1, mid, n2, suf] = range
                const t1 = parseInt(n1, 10)
                const t2 = parseInt(n2, 10)
                const obj = { a: 0, b: 0 }
                gsap.to(obj, {
                  a: t1, duration: 1.1, ease: 'power2.out',
                  onUpdate()   { el.textContent = `${p1}${Math.round(obj.a)}` },
                  onComplete() {
                    gsap.to(obj, {
                      b: t2, duration: 1.1, ease: 'power2.out',
                      onUpdate()   { el.textContent = `${p1}${t1}${mid}${Math.round(obj.b)}${suf}` },
                      onComplete() { el.textContent = raw },
                    })
                  },
                })
                return
              }
              const m = raw.match(/^(\D*)(\d+)([^\d]*)$/)
              if (!m) return
              const [, prefix, num, suffix] = m
              const target = parseInt(num, 10)
              const obj = { val: 0 }
              gsap.to(obj, {
                val: target, duration: 1.4, ease: 'power2.out',
                onUpdate()   { el.textContent = `${prefix}${Math.round(obj.val)}${suffix}` },
                onComplete() { el.textContent = raw },
              })
            })
          },
        },
      })
    }, ref)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={ref} className="py-20 bg-ag-off-white border-t border-ag-border">
      <div className="max-w-7xl mx-auto px-6 md:px-12">

        <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-ag-gray-light mb-12">
          {t('label')}
        </p>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          {stats.map((stat, i) => {
            /* Valeur à plage (« 30 à 50% ») : nowrap + taille réduite pour
               tenir sur une ligne dans les colonnes étroites */
            const isRange = /\d[^\d]+\d/.test(stat.value)
            return (
            <div key={i} className="market-stat">
              <p
                data-counter={stat.value}
                className={`font-display font-black text-ag-black tracking-[-0.03em] leading-none mb-2${isRange ? ' whitespace-nowrap' : ''}`}
                style={{ fontSize: isRange ? 'clamp(28px,3vw,44px)' : 'clamp(38px,4.5vw,60px)' }}
              >
                {stat.value}
              </p>
              <p className="text-[12px] text-ag-gray leading-snug mb-1.5 whitespace-pre-line">
                {stat.label}
              </p>
              {stat.source && (
                <p className="font-mono text-[10px] text-ag-gray-light tracking-wide">
                  {stat.source}
                </p>
              )}
            </div>
            )
          })}
        </div>

      </div>
    </section>
  )
}
