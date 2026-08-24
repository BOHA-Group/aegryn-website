import type { ReactNode } from 'react'

/**
 * Layout minimal pour la page "Explorer en ligne".
 * Override complet : pas de Nav, pas de Footer, pas de padding.
 * L'iframe _web.html prend toute la fenêtre.
 */
export default function WebMagazineLayout({ children }: { children: ReactNode }) {
  return (
    <div style={{ position: 'fixed', inset: 0, width: '100%', height: '100%', overflow: 'hidden' }}>
      {children}
    </div>
  )
}
