'use client'

import { useEffect, useRef, useState } from 'react'

export interface VisionSegment {
  t: string
  bold?: boolean
}

/**
 * « Notre vision » : frappe machine à écrire (~2x le rythme du hero home)
 * déclenchée au scroll, sans effacement une fois le texte complet.
 * Les segments marqués `bold` restent en gras pendant et après la frappe.
 * Le texte complet est rendu invisible pour réserver la hauteur finale.
 */
export function VisionTypewriter({ segments }: { segments: VisionSegment[] }) {
  const full = segments.map((s) => s.t).join('')
  const [chars, setChars] = useState(0)
  const [started, setStarted] = useState(false)
  const ref = useRef<HTMLParagraphElement>(null)
  const done = chars >= full.length

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setChars(full.length)
      return
    }
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        setStarted(true)
        obs.disconnect()
      }
    }, { threshold: 0.35 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [full.length])

  useEffect(() => {
    if (!started || done) return
    const t = setTimeout(
      () => setChars((c) => Math.min(c + 1, full.length)),
      38 + Math.random() * 14,
    )
    return () => clearTimeout(t)
  }, [started, chars, done, full.length])

  const renderSegments = (n: number) => {
    let off = 0
    return segments.map((s, i) => {
      const slice = s.t.slice(0, Math.max(0, Math.min(n - off, s.t.length)))
      off += s.t.length
      return s.bold
        ? <strong key={i} className="font-bold">{slice}</strong>
        : <span key={i}>{slice}</span>
    })
  }

  return (
    <p
      ref={ref}
      className="relative font-sans font-normal text-ag-black tracking-[-0.02em] leading-[1.15] whitespace-pre-line"
      style={{ fontSize: 'clamp(19px,2vw,26px)' }}
    >
      <span aria-hidden="true" className="invisible">
        {renderSegments(full.length)}
      </span>
      <span className="absolute inset-0">
        {renderSegments(chars)}
        {started && !done && <span className="typed-caret" />}
      </span>
    </p>
  )
}
