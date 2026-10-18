'use client'

/**
 * Titre du hero La Boutique : même effet « machine à écrire » que le hero de l'accueil du cabinet
 * (frappe caractère par caractère, curseur clignotant). Ligne 1 en gras, ligne 2 en normal (comme le titre de l'accueil du cabinet).
 * La hauteur des trois titres est réservée pour éviter tout déplacement à la transition.
 */
import { useTypedPhrases } from '@/hooks/useTypedPhrases'
import { useBoutiqueClock } from './BoutiqueAudio'

export function TypedTitle({ id, phrases, className, style }: { id?: string; phrases: string[]; className?: string; style?: React.CSSProperties }) {
  const { ready } = useBoutiqueClock()
  const { text: typed } = useTypedPhrases(phrases, { loop: true, enabled: ready })

  const render = (text: string, caret: boolean) => {
    const lines = text.split('\n')
    return lines.map((line, j) => (
      <span key={j} className={j === 0 ? 'block' : 'block font-normal'}>
        <span>{line}</span>
        {caret && j === lines.length - 1 && <span className="typed-caret" />}
      </span>
    ))
  }

  return (
    <h1 translate="no" id={id} aria-label={phrases.map(p => p.replace(/\n/g, ' ')).join(' ')} className={className} style={style}>
      <span className="inline-grid">
        {phrases.map(phrase => (
          <span key={phrase} className="invisible col-start-1 row-start-1" aria-hidden="true">{render(phrase, false)}</span>
        ))}
        <span data-typed-text className="col-start-1 row-start-1" aria-hidden="true">{render(typed, true)}</span>
      </span>
    </h1>
  )
}
