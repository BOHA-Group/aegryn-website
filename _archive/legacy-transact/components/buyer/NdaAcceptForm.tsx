'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { CheckSquare, Square, Loader2, ShieldCheck } from 'lucide-react'

interface Props {
  redirectTo:    string
  ndaVersion:    string
  check1Label:   string
  check2Label:   string
  signingBtn:    string
  acceptBtn:     string
  versionFooter: string
  errorFallback: string
}

export function NdaAcceptForm({
  redirectTo, ndaVersion,
  check1Label, check2Label,
  signingBtn, acceptBtn, versionFooter, errorFallback,
}: Props) {
  const [check1, setCheck1] = useState(false)
  const [check2, setCheck2] = useState(false)
  const [error, setError]   = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const canSubmit = check1 && check2 && !isPending

  function handleSubmit() {
    if (!canSubmit) return
    setError(null)
    startTransition(async () => {
      const res = await fetch('/api/nda/sign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ndaVersion }),
      })
      if (!res.ok) {
        const d = await res.json() as { error?: string }
        setError(d.error ?? errorFallback)
        return
      }
      router.push(redirectTo)
      router.refresh()
    })
  }

  return (
    <div className="space-y-5">
      {/* Checkbox 1 */}
      <div
        role="checkbox"
        aria-checked={check1}
        tabIndex={0}
        onClick={() => setCheck1((v) => !v)}
        onKeyDown={(e) => (e.key === ' ' || e.key === 'Enter') && setCheck1((v) => !v)}
        className="flex items-start gap-3 cursor-pointer group"
      >
        <span className="shrink-0 mt-0.5">
          {check1
            ? <CheckSquare size={18} className="text-ag-navy" />
            : <Square size={18} className="text-gray-300 group-hover:text-gray-400 transition-colors" />
          }
        </span>
        <span className="text-[13px] text-gray-700 leading-relaxed">{check1Label}</span>
      </div>

      {/* Checkbox 2 */}
      <div
        role="checkbox"
        aria-checked={check2}
        tabIndex={0}
        onClick={() => setCheck2((v) => !v)}
        onKeyDown={(e) => (e.key === ' ' || e.key === 'Enter') && setCheck2((v) => !v)}
        className="flex items-start gap-3 cursor-pointer group"
      >
        <span className="shrink-0 mt-0.5">
          {check2
            ? <CheckSquare size={18} className="text-ag-navy" />
            : <Square size={18} className="text-gray-300 group-hover:text-gray-400 transition-colors" />
          }
        </span>
        <span className="text-[13px] text-gray-700 leading-relaxed">{check2Label}</span>
      </div>

      {error && (
        <p className="text-[12px] text-red-600 font-medium">{error}</p>
      )}

      {/* Bouton */}
      <button
        type="button"
        onClick={handleSubmit}
        disabled={!canSubmit}
        className={`w-full flex items-center justify-center gap-2 px-6 py-3.5 font-sans font-semibold text-[12px] uppercase tracking-[0.18em] transition-all ${
          canSubmit
            ? 'bg-ag-navy text-white hover:bg-ag-navy/90'
            : 'bg-gray-100 text-gray-300 cursor-not-allowed'
        }`}
      >
        {isPending
          ? <><Loader2 size={14} className="animate-spin" /> {signingBtn}</>
          : <><ShieldCheck size={14} /> {acceptBtn}</>
        }
      </button>

      <p className="text-[10px] text-gray-400 text-center leading-relaxed">
        {versionFooter} — {ndaVersion}
      </p>
    </div>
  )
}
