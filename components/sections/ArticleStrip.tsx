'use client'

/**
 * Bande défilante d'affiches d'articles, avec indicateur de défilement :
 * flèches gauche et droite (visibles seulement quand d'autres affiches existent de ce côté)
 * et dégradés sur les bords. Partagée par l'accueil du cabinet et celui de La Boutique.
 */
import { useCallback, useEffect, useRef, useState } from 'react'
import { useLocale } from 'next-intl'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const LABELS: Record<string, { prev: string; next: string }> = {
  fr: { prev: 'Articles précédents', next: 'Articles suivants' },
  en: { prev: 'Previous articles', next: 'Next articles' },
  de: { prev: 'Vorherige Artikel', next: 'Weitere Artikel' },
  es: { prev: 'Artículos anteriores', next: 'Artículos siguientes' },
  it: { prev: 'Articoli precedenti', next: 'Articoli successivi' },
  nl: { prev: 'Vorige artikelen', next: 'Volgende artikelen' },
}

export function ArticleStrip({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  const [canLeft, setCanLeft] = useState(false)
  const [canRight, setCanRight] = useState(false)
  const txt = LABELS[useLocale()] ?? LABELS.en

  const update = useCallback(() => {
    const el = ref.current
    if (!el) return
    setCanLeft(el.scrollLeft > 8)
    setCanRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 8)
  }, [])

  useEffect(() => {
    update()
    const el = ref.current
    el?.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    const ro = el ? new ResizeObserver(update) : null
    if (el && ro) { ro.observe(el); Array.from(el.children).forEach(c => ro.observe(c)) }
    return () => { el?.removeEventListener('scroll', update); window.removeEventListener('resize', update); ro?.disconnect() }
  }, [update])

  const scrollBy = (dir: 1 | -1) => ref.current?.scrollBy({ left: dir * 440, behavior: 'smooth' })
  const btn = 'absolute top-[105px] z-10 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-ag-border bg-ag-white text-ag-black shadow-md transition-all hover:bg-ag-black hover:text-white md:flex'

  return (
    <div className="relative">
      <div ref={ref} className="js-xscroll flex gap-5 overflow-x-auto snap-x snap-mandatory scroll-px-6 pb-4 -mx-6 px-[calc(50vw-118px)] md:mx-0 md:scroll-px-0 md:px-0" style={{ scrollbarWidth: 'thin' }}>
        {children}
      </div>
      <div aria-hidden="true" className={`pointer-events-none absolute inset-y-0 left-0 hidden w-12 bg-gradient-to-r from-ag-white to-transparent transition-opacity duration-300 md:block ${canLeft ? 'opacity-100' : 'opacity-0'}`} />
      <div aria-hidden="true" className={`pointer-events-none absolute inset-y-0 right-0 hidden w-16 bg-gradient-to-l from-ag-white to-transparent transition-opacity duration-300 md:block ${canRight ? 'opacity-100' : 'opacity-0'}`} />
      {canLeft && <button type="button" onClick={() => scrollBy(-1)} aria-label={txt.prev} className={`${btn} -left-5`}><ChevronLeft size={18} /></button>}
      {canRight && <button type="button" onClick={() => scrollBy(1)} aria-label={txt.next} className={`${btn} -right-5`}><ChevronRight size={18} /></button>}
    </div>
  )
}
