'use client'

import { useState } from 'react'
import { Check }    from 'lucide-react'

type Category = 'notifications' | 'kyc_documents' | 'offers' | 'nda_requests' | 'commissions' | 'introductions' | 'partner_certs'

const ITEMS: { id: Category; label: string; desc: string; warn?: boolean }[] = [
  {
    id:    'notifications',
    label: 'Notifications',
    desc:  'Toutes vos notifications in-app (alertes, mises à jour dossier).',
  },
  {
    id:    'nda_requests',
    label: 'Demandes NDA',
    desc:  'Vos demandes d\'accès aux dossiers sous NDA.',
  },
  {
    id:    'offers',
    label: 'Offres d\'acquisition',
    desc:  'Vos offres soumises sur des actifs. L\'historique de transaction est conservé pour raison légale.',
  },
  {
    id:    'kyc_documents',
    label: 'Documents KYC',
    desc:  'Vos pièces KYC soumises. Votre statut KYC sera réinitialisé.',
    warn:  true,
  },
  {
    id:    'commissions',
    label: 'Commissions partenaire',
    desc:  'Historique de vos commissions.',
  },
  {
    id:    'introductions',
    label: 'Introductions partenaire',
    desc:  'Vos introductions client enregistrées.',
  },
  {
    id:    'partner_certs',
    label: 'Certifications partenaire',
    desc:  'Vos contributions aux certifications CIFS.',
    warn:  true,
  },
]

export default function DeletePartialSection() {
  const [open, setOpen]           = useState(false)
  const [selected, setSelected]   = useState<Set<Category>>(new Set())
  const [confirming, setConfirming] = useState(false)
  const [loading, setLoading]     = useState(false)
  const [done, setDone]           = useState<Category[]>([])
  const [error, setError]         = useState('')

  function toggle(id: Category) {
    setSelected(prev => {
      const next = new Set(prev)
      if (next.has(id)) { next.delete(id) } else { next.add(id) }
      return next
    })
  }

  async function handleSubmit() {
    if (selected.size === 0) return
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/client/account/delete-partial', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ categories: [...selected] }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setError(data.error || 'Une erreur est survenue.')
      } else {
        setDone(data.deleted ?? [...selected])
        setOpen(false)
        setConfirming(false)
        setSelected(new Set())
      }
    } catch {
      setError('Impossible de contacter le serveur.')
    } finally {
      setLoading(false)
    }
  }

  if (done.length > 0 && !open) {
    return (
      <p className="font-sans text-[12px] text-emerald-600">
        Données supprimées : {done.join(', ')}.
      </p>
    )
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="font-mono text-[10px] uppercase tracking-widest text-orange-500 border border-orange-200 px-3 py-1.5 hover:bg-orange-50 transition-colors"
      >
        Choisir les données à supprimer
      </button>
    )
  }

  return (
    <div className="border border-orange-200 bg-orange-50/40 p-4 mt-2">
      <p className="font-mono text-[9px] uppercase tracking-widest text-orange-600 mb-3">
        Sélectionnez les catégories à supprimer
      </p>

      <div className="flex flex-col gap-2 mb-4">
        {ITEMS.map(({ id, label, desc, warn }) => {
          const checked = selected.has(id)
          return (
            <button
              key={id}
              type="button"
              onClick={() => toggle(id)}
              className={`flex items-start gap-3 text-left px-3 py-2.5 border transition-colors ${
                checked
                  ? 'border-orange-300 bg-white'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              <span className={`mt-0.5 w-4 h-4 shrink-0 border flex items-center justify-center transition-colors ${
                checked ? 'border-orange-400 bg-orange-400' : 'border-gray-300'
              }`}>
                {checked && <Check size={10} className="text-white" strokeWidth={3} />}
              </span>
              <span className="flex flex-col gap-0.5">
                <span className={`font-sans text-[12px] font-semibold ${warn ? 'text-orange-700' : 'text-gray-800'}`}>
                  {label}{warn && ' ⚠'}
                </span>
                <span className="font-sans text-[11px] text-gray-500 leading-relaxed">{desc}</span>
              </span>
            </button>
          )
        })}
      </div>

      {error && <p className="font-sans text-[11px] text-red-600 mb-3">{error}</p>}

      {!confirming ? (
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setConfirming(true)}
            disabled={selected.size === 0}
            className="bg-orange-500 text-white font-mono text-[10px] uppercase tracking-[0.14em] px-4 py-2 hover:bg-orange-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Supprimer ({selected.size} catégorie{selected.size > 1 ? 's' : ''})
          </button>
          <button
            type="button"
            onClick={() => { setOpen(false); setSelected(new Set()) }}
            className="border border-gray-300 text-gray-500 font-mono text-[10px] uppercase tracking-[0.14em] px-4 py-2 hover:border-gray-500 transition-colors"
          >
            Annuler
          </button>
        </div>
      ) : (
        <div className="bg-white border border-orange-300 p-3">
          <p className="font-sans text-[12px] text-orange-800 mb-3">
            Cette suppression est irréversible. Confirmer ?
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="bg-orange-600 text-white font-mono text-[10px] uppercase tracking-[0.14em] px-4 py-2 hover:bg-orange-700 transition-colors disabled:opacity-50"
            >
              {loading ? 'Suppression...' : 'Confirmer'}
            </button>
            <button
              type="button"
              onClick={() => setConfirming(false)}
              disabled={loading}
              className="border border-gray-300 text-gray-500 font-mono text-[10px] uppercase tracking-[0.14em] px-4 py-2 hover:border-gray-500 transition-colors disabled:opacity-50"
            >
              Retour
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
