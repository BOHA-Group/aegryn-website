'use client'

import { useEffect } from 'react'

/**
 * Rendu dans le layout /admin — déclenche une fois par session le dépôt du
 * cookie ag-admin-proof (preuve admin signée, cf. lib/adminAuth.ts), qui
 * débloque les contenus réservés (magazine non publié) hors back-office.
 */
export function AdminProofMarker() {
  useEffect(() => {
    if (sessionStorage.getItem('ag-admin-proof')) return
    sessionStorage.setItem('ag-admin-proof', '1')
    fetch('/api/admin/proof', { method: 'POST' }).catch(() => {})
  }, [])
  return null
}
