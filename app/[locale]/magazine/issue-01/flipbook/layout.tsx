import type { ReactNode } from 'react'

/**
 * Layout pleine page pour le flipbook — supprime nav + footer du layout global.
 * overflow:hidden empêche tout scroll ou flash de contenu sous-jacent.
 */
export default function FlipbookLayout({ children }: { children: ReactNode }) {
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 9999, background: '#0F1A2B', overflow: 'hidden' }}>
      {children}
    </div>
  )
}
