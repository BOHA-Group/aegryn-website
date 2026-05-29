'use client'

import Link from 'next/link'
import { useCookieConsent } from '@/hooks/useCookieConsent'

export default function CookieBanner() {
  const { status, ready, accept, refuse } = useCookieConsent()

  if (!ready || status !== 'pending') return null

  return (
    <div
      role="dialog"
      aria-label="Préférences cookies"
      className="fixed bottom-0 left-0 right-0 z-[100] border-t border-ag-border bg-ag-white"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex-1 min-w-0">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ag-gray-light mb-1">
            Aegryn — Cookies & Analytics
          </p>
          <p className="text-[13px] text-ag-gray leading-relaxed max-w-2xl">
            Nous utilisons Google Analytics (anonymisé) pour mesurer l&apos;audience et améliorer
            l&apos;expérience. Aucune donnée publicitaire. Conformité RGPD & LPD.{' '}
            <Link
              href="/privacy"
              className="underline underline-offset-2 hover:text-ag-black transition-colors"
            >
              En savoir plus
            </Link>
            .
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={refuse}
            className="font-mono text-[11px] tracking-[0.14em] uppercase text-ag-gray-light border border-ag-border px-4 py-2.5 hover:border-ag-border-h hover:text-ag-dark transition-all"
          >
            Refuser
          </button>
          <button
            onClick={accept}
            className="font-mono text-[11px] tracking-[0.14em] uppercase text-white bg-ag-black px-5 py-2.5 hover:bg-ag-navy transition-colors"
          >
            Accepter
          </button>
        </div>
      </div>
    </div>
  )
}
