'use client'

import { useEffect, useRef, useState } from 'react'

/**
 * « Notre vision » : frappe machine à écrire (~2x le rythme du hero home)
 * déclenchée au scroll, sans effacement une fois le texte complet.
 * Le premier segment reste en gras, le reste en corps normal.
 * Le texte complet est rendu invisible pour réserver la hauteur finale.
 */
export function VisionTypewriter({ bold, text }: { bold: string; text: string }) {
  const full = bold + text
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

  const typedBold = full.slice(0, Math.min(chars, bold.length))
  const typedRest = chars > bold.length ? full.slice(bold.length, chars) : ''

  return (
    <p
      ref={ref}
      className="relative font-sans font-normal text-ag-black tracking-[-0.02em] leading-[1.15] whitespace-pre-line"
      style={{ fontSize: 'clamp(22px,2.5vw,32px)' }}
    >
      <span aria-hidden="true" className="invisible">
        <strong className="font-bold">{bold}</strong>
        {text}
      </span>
      <span className="absolute inset-0">
        <strong className="font-bold">{typedBold}</strong>
        {typedRest}
        {started && !done && <span className="typed-caret" />}
      </span>
    </p>
  )
}
