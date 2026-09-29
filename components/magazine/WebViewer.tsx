'use client'

import { useEffect, useRef } from 'react'

interface Props {
  htmlSrc: string
  title?:  string
  /** Ancre (#id) a atteindre dans la web edition, pilotee par MagazineNav */
  anchor?: string | null
}

/**
 * WebViewer — iframe vers la version web longue du magazine (_web.html).
 * Affiche les 81 articles ; la navigation est assuree par la barre laterale de la page.
 */
export function WebViewer({ htmlSrc, title = 'Aegryn Magazine, Web Edition', anchor }: Props) {
  const ref = useRef<HTMLIFrameElement>(null)

  /* Navigation vers une ancre : on tente jusqu'a ce que le document de l'iframe
     soit pret et que l'element existe (le chargement peut etre asynchrone). */
  useEffect(() => {
    if (!anchor || !ref.current) return
    let tries = 0
    const timer = window.setInterval(() => {
      tries += 1
      try {
        const win = ref.current?.contentWindow
        const el  = win?.document?.getElementById(anchor)
        if (el && win) {
          /* scrollTo sur la fenetre de l'iframe : scrollIntoView remonterait aussi le parent */
          const top = el.getBoundingClientRect().top + win.scrollY
          win.scrollTo({ top, behavior: 'smooth' })
          window.clearInterval(timer); return
        }
      } catch { /* pas encore accessible */ }
      if (tries > 40) window.clearInterval(timer)
    }, 150)
    return () => window.clearInterval(timer)
  }, [anchor, htmlSrc])

  return (
    <div
      style={{
        position:  'relative',
        width:     '100%',
        height:    'calc(100vh - 52px)',
        minHeight: '800px',
        background: '#F7F5F1',
      }}
    >
      <iframe
        ref={ref}
        src={htmlSrc}
        title={title}
        style={{ width: '100%', height: '100%', border: 'none', display: 'block' }}
        allow="fullscreen"
      />
    </div>
  )
}
