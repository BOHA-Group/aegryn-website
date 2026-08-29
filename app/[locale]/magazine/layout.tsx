import type { ReactNode } from 'react'

/**
 * Layout magazine — pass-through sans gate global.
 * Le hub /magazine est ouvert à tous en production.
 * Le gate d'accès au contenu est appliqué par issue dans
 * app/[locale]/magazine/[issue]/page.tsx via canAccessIssue().
 */
export default function MagazineLayout({ children }: { children: ReactNode }) {
  return <>{children}</>
}
