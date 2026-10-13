'use client'

import { useEffect, useRef, useState } from 'react'

export interface VisionSegment {
  t: string
  bold?: boolean
}

/**
 * « Notre vision » : le texte se revele au rythme du scroll, pas au timer.
 * La portion visible est strictement proportionnelle a la position du
 * paragraphe dans le viewport, recalculee a chaque evenement de scroll :
 * descendre tape, remonter efface, a la vitesse du geste. Aucun etat
 * persistant : a chaque instant, l'affichage depend de la position de scroll.
 * Le curseur clignote tant que le texte est incomplet. La hauteur finale
 * est reservee par un rendu invisible du texte complet (pas de saut).
 * Les segments marques `bold` restent en gras pendant et apres la revelation.
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
      setStarted(true)
      return
    }
    let raf = 0
    const update = () => {
      raf = 0
      const r = el.getBoundingClientRect()
      const vh = window.innerHeight
      // 0% quand le haut du bloc entre en bas d'ecran,
      // 100% quand il approche du haut du viewport : la frappe
      // s'etale sur presque toute la traversee de l'ecran.
      const start = vh * 0.95
      const end   = vh * 0.08
      const p = Math.min(1, Math.max(0, (start - r.top) / (start - end)))
      const n = Math.round(p * full.length)
      setStarted(p > 0)
      setChars(n)
    }
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update) }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [full.length])

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
