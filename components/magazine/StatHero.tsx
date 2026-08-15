'use client'

import { useEffect, useRef } from 'react'
import { gsap }              from '@/lib/gsap'

interface StatHeroProps {
  value:      string
  text:       string
  source?:    string
  inverted?:  boolean
}

export function StatHero({ value, text, source, inverted = false }: StatHeroProps) {
  const numRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (!numRef.current) return
    const raw   = parseFloat(value.replace(/[^0-9.]/g, ''))
    const prefix = value.match(/^[^0-9]*/)?.[0] ?? ''
    const suffix = value.match(/[^0-9.]*$/)?.[0] ?? ''
    if (isNaN(raw)) return

    const proxy = { val: 0 }
    const ctx = gsap.context(() => {
      gsap.to(proxy, {
        val: raw, duration: 1.2, ease: 'power2.out',
        scrollTrigger: { trigger: numRef.current, start: 'top 85%', once: true },
        onUpdate() {
          if (!numRef.current) return
          numRef.current.textContent =
            prefix +
            (Number.isInteger(raw)
              ? Math.round(proxy.val).toLocaleString('en-US')
              : proxy.val.toFixed(1)) +
            suffix
        },
      })
    })
    return () => ctx.revert()
  }, [value])

  const bg   = inverted ? 'bg-magazine-black'  : 'bg-magazine-ivory'
  const txt  = inverted ? 'text-magazine-white' : 'text-magazine-black'
  const muted = inverted ? 'text-magazine-white/50' : 'text-magazine-black/50'

  return (
    <div className={`${bg} px-8 py-16 text-center`}>
      <p className={`text-display font-sans font-bold ${txt} tabular-nums`}>
        <span ref={numRef}>{value}</span>
      </p>
      <p className={`text-body-mag ${muted} mt-4 max-w-prose mx-auto`}>{text}</p>
      {source && (
        <p className={`text-label-mag uppercase tracking-[0.12em] ${muted} mt-3`}>
          Source — {source}
        </p>
      )}
    </div>
  )
}
