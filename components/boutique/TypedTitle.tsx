'use client'

/**
 * Titre du hero La Boutique : même effet « machine à écrire » que le hero de l'accueil du cabinet
 * (frappe caractère par caractère, curseur clignotant). Ligne 1 en gras, ligne 2 en normal (comme le titre de l'accueil du cabinet).
 * Le texte complet est réservé en invisible pour que la mise en page ne bouge pas pendant la frappe.
 */
import { useEffect, useState } from 'react'

export function TypedTitle({ id, line1, line2, className, style }: { id?: string; line1: string; line2?: string; className?: string; style?: React.CSSProperties }) {
  const full = line2 ? `${line1}\n${line2}` : line1
  const [typed, setTyped] = useState('')

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { setTyped(full); return }
    setTyped('')
    let i = 0
    let timer: ReturnType<typeof setTimeout>
    const tick = () => {
      i++
      setTyped(full.slice(0, i))
      if (i < full.length) timer = setTimeout(tick, 55 + Math.random() * 25)
    }
    timer = setTimeout(tick, 600)
    return () => clearTimeout(timer)
  }, [full])

  const render = (text: string, caret: boolean) => {
    const lines = text.split('\n')
    return lines.map((line, j) => (
      <span key={j} className={j === 0 ? 'block' : 'block font-normal'}>
        {line}
        {caret && j === lines.length - 1 && <span className="typed-caret" />}
      </span>
    ))
  }

  return (
    <h1 id={id} aria-label={full.replace('\n', ' ')} className={className} style={style}>
      <span className="inline-grid">
        <span className="invisible col-start-1 row-start-1" aria-hidden="true">{render(full, false)}</span>
        <span className="col-start-1 row-start-1" aria-hidden="true">{render(typed, true)}</span>
      </span>
    </h1>
  )
}
