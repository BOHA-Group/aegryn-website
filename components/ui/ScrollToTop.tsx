'use client'

import { useEffect, useState } from 'react'
import { ChevronUp } from 'lucide-react'

/**
 * Bouton flottant scroll-to-top.
 * Apparaît dès 400px de scroll. Lenis-aware (window.scrollTo fonctionne avec Lenis).
 */
export function ScrollToTop() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const scrollUp = () => window.scrollTo({ top: 0, behavior: 'smooth' })

  return (
    <button
      onClick={scrollUp}
      aria-label="Remonter en haut"
      className={[
        'fixed bottom-8 right-8 z-50',
        'w-11 h-11 flex items-center justify-center',
        'bg-ag-navy border border-white/20 text-white',
        'hover:bg-ag-apex hover:border-ag-apex hover:text-ag-navy',
        'transition-all duration-300',
        'shadow-lg shadow-black/20',
        visible
          ? 'opacity-100 translate-y-0 pointer-events-auto'
          : 'opacity-0 translate-y-4 pointer-events-none',
      ].join(' ')}
    >
      <ChevronUp size={18} strokeWidth={2} />
    </button>
  )
}
