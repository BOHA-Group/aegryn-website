'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { CheckSquare, ShieldCheck, Loader2 } from 'lucide-react'

type Props = {
  ndaType:  'seller' | 'buyer' | 'partner'
  version:  string
  redirect: string
  fullName: string
}

export default function NdaAcceptForm({ ndaType, version, redirect: redirectPath, fullName }: Props) {
  const router   = useRouter()
  const [checked, setChecked] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState<string | null>(null)

  async function handleAccept() {
    if (!checked) return
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/client/nda/accept', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ nda_type: ndaType }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error ?? 'Erreur inconnue')
      router.push(redirectPath)
      router.refresh()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erreur inconnue')
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">

      <label className="flex items-start gap-3 cursor-pointer group">
        <button
          type="button"
          role="checkbox"
          aria-checked={checked}
          onClick={() => setChecked(v => !v)}
          className={`mt-0.5 w-5 h-5 shrink-0 border-2 flex items-center justify-center transition-colors ${
            checked ? 'border-ag-navy bg-ag-navy' : 'border-gray-300 group-hover:border-gray-500'
          }`}
        >
          {checked && <CheckSquare size={12} className="text-white" strokeWidth={3} />}
        </button>
        <span className="font-sans text-[13px] text-gray-700 leading-relaxed select-none">
          J'ai lu et j'accepte intégralement les présentes obligations de confidentialité.
          Je comprends que cette acceptation est horodatée et conservée à titre de preuve contractuelle.
          <span className="block mt-1 font-mono text-[10px] text-gray-400">
            Version {version} — signé en tant que : <strong>{fullName}</strong>
          </span>
        </span>
      </label>

      {error && (
        <div className="bg-red-50 border border-red-200 px-4 py-3 text-[12px] text-red-700">
          {error}
        </div>
      )}

      <button
        type="button"
        onClick={handleAccept}
        disabled={!checked || loading}
        className={`w-full flex items-center justify-center gap-2 font-mono text-[11px] uppercase tracking-widest px-6 py-4 transition-colors ${
          checked && !loading
            ? 'bg-ag-navy text-white hover:bg-ag-black cursor-pointer'
            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
        }`}
      >
        {loading
          ? <><Loader2 size={13} className="animate-spin" /> Enregistrement…</>
          : <><ShieldCheck size={13} /> Accepter et accéder à mon espace</>
        }
      </button>

      <p className="font-sans text-[11px] text-gray-400 leading-relaxed">
        En acceptant, vous confirmez avoir pris connaissance du document ci-dessus dans son intégralité.
        Votre adresse IP et l'horodatage sont enregistrés conformément au RGPD et à la LPD suisse.
        Ce consentement peut être consulté depuis votre espace ou sur demande à{' '}
        <a href="mailto:legal@boha-group.com" className="underline">legal@boha-group.com</a>.
      </p>
    </div>
  )
}
