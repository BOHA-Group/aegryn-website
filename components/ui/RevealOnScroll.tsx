'use client'

import { useEffect, useState } from 'react'

/**
 * Contenu de hero révélé uniquement après le premier scroll :
 * à l'arrivée sur la page, seul le grand titre est visible ; le sous-titre
 * et les boutons apparaissent en fondu dès que le visiteur descend,
 * puis restent affichés.
 */
export function RevealOnScroll({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => { if (window.scrollY > 40) { setScrolled(true); window.removeEventListener('scroll', onScroll) } }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div
      className={[
        'transition-all duration-700 ease-out',
        scrolled ? 'opacity-100 translate-y-0' : 'pointer-events-none translate-y-3 opacity-0',
        className,
      ].join(' ')}
    >
      {children}
    </div>
  )
}
