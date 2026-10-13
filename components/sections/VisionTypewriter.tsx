'use client'

import { useEffect, useRef, useState } from 'react'

export interface VisionSegment {
  t: string
  bold?: boolean
}

// Persiste tant que la session SPA vit : le texte deja entierement
// revele ne rejoue pas apres navigation, seulement apres un reload.
let played = false

/**
 * « Notre vision » : le texte se revele au rythme du scroll, pas au timer.
 * La hauteur finale est reservee par un rendu invisible du texte complet ;
 * la portion visible est proportionnelle a la progression du paragraphe
 * dans le viewport. Monotone : le texte revele ne s'efface pas en remontant.
 * Les segments marques `bold` restent en gras pendant et apres la revelation.
 */
export function VisionTypewriter({ segments }: { segments: VisionSegment[] }) {
  const full = segments.map((s) => s.t).join('')
  const [chars, setChars] = useState(played ? full.length : 0)
  const [started, setStarted] = useState(played)
  const ref = useRef<HTMLParagraphElement>(null)
  const done = chars >= full.length

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (played || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      played = true
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
      // 100% quand il atteint ~30% de la hauteur du viewport.
      const start = vh * 0.92
      const end   = vh * 0.30
      const p = Math.min(1, Math.max(0, (start - r.top) / (start - end)))
      const n = Math.round(p * full.length)
      if (n > 0) setStarted(true)
      setChars((c) => {
        const next = Math.max(c, n)
        if (next >= full.length) played = true
        return next
      })
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
