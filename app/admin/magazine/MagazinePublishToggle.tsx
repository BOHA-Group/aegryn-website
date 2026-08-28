'use client'

import { useState, useTransition } from 'react'
import { Loader2 } from 'lucide-react'

interface Props {
  issueKey:    string
  issueLabel:  string
  initialValue: boolean
}

export default function MagazinePublishToggle({ issueKey, issueLabel, initialValue }: Props) {
  const [isPublic, setIsPublic]   = useState(initialValue)
  const [isPending, startTransition] = useTransition()
  const [error, setError]         = useState<string | null>(null)

  async function toggle() {
    const next = !isPublic
    setError(null)
    startTransition(async () => {
      try {
        const res = await fetch('/api/admin/site-settings', {
          method:  'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body:    JSON.stringify({ key: issueKey, value: next }),
        })
        const data = await res.json()
        if (!res.ok) throw new Error(data?.error ?? 'Erreur serveur')
        setIsPublic(next)
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Erreur inconnue')
      }
    })
  }

  return (
    <div className="flex items-center justify-between gap-6 bg-white border border-gray-200 px-6 py-5">
      <div>
        <p className="font-semibold text-[14px] text-gray-900">{issueLabel}</p>
        <p className="text-[12px] text-gray-400 mt-0.5">
          {isPublic
            ? 'Publié publiquement — QR code actif, accès flipbook & web edition ouvert'
            : 'Non publié — QR code affiche "Coming soon", accès restreint'}
        </p>
        {error && <p className="text-[11px] text-red-600 mt-1">{error}</p>}
      </div>
      <button
        onClick={toggle}
        disabled={isPending}
        className={[
          'relative inline-flex h-7 w-12 items-center rounded-full transition-colors shrink-0 focus:outline-none',
          isPublic ? 'bg-emerald-500' : 'bg-gray-300',
          isPending ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
        ].join(' ')}
        role="switch"
        aria-checked={isPublic}
      >
        {isPending && (
          <Loader2 size={12} className="absolute inset-0 m-auto animate-spin text-white" />
        )}
        <span
          className={[
            'inline-block h-5 w-5 rounded-full bg-white shadow transition-transform',
            isPublic ? 'translate-x-6' : 'translate-x-1',
          ].join(' ')}
        />
      </button>
    </div>
  )
}
