'use client'

import { useState } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { CheckCircle2, AlertCircle } from 'lucide-react'

/**
 * Formulaire d'inscription à la liste d'attente CIFSO Valuation Index (abonnement complet).
 * Extrait de CifsoValuationIndex.tsx pour être réutilisable (ex. étape 2 du test /valuation/index).
 */
export default function WaitlistForm({ variant = 'navy' }: { variant?: 'navy' | 'green' } = {}) {
  const t      = useTranslations('valuation.comingSoonBanner')
  const locale = useLocale()
  const [email, setEmail]     = useState('')
  const [status, setStatus]   = useState<'idle'|'loading'|'ok'|'err'>('idle')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email.includes('@')) return
    setStatus('loading')
    try {
      const res = await fetch('/api/valuation/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          org_type: 'unknown',
          locale,
          source_url: window.location.href,
        }),
      })
      setStatus(res.ok ? 'ok' : 'err')
    } catch {
      setStatus('err')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 mt-2">
      {status === 'ok' ? (
        <div className="flex items-center gap-2 text-emerald-700 font-mono text-[12px]">
          <CheckCircle2 size={14} />
          {t('ctaSuccess')}
        </div>
      ) : (
        <>
          <input
            type="email"
            required
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder={t('ctaPlaceholder')}
            className="flex-1 min-w-0 rounded-lg border border-ag-border bg-ag-off-white text-ag-black placeholder:text-ag-gray-light px-4 py-3 font-sans text-[13px] focus:outline-none focus:border-ag-navy transition-colors"
          />
          <button
            type="submit"
            disabled={status === 'loading'}
            className={`shrink-0 rounded-lg text-white font-mono font-semibold text-[11px] tracking-[0.14em] uppercase px-7 py-3 transition-colors disabled:opacity-60 ${variant === 'green' ? 'bg-emerald-600 hover:bg-emerald-500' : 'bg-ag-navy hover:bg-ag-navy/90'}`}
          >
            {status === 'loading' ? '...' : t('ctaSubmit')}
          </button>
        </>
      )}
      {status === 'err' && (
        <p className="text-red-600 font-sans text-[11px] flex items-center gap-1.5">
          <AlertCircle size={12} /> {t('ctaError')}
        </p>
      )}
    </form>
  )
}
