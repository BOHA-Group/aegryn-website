'use client'

import { useState } from 'react'
import { ArrowUpRight, CheckCircle2, X } from 'lucide-react'

interface Props {
  assetId: string
  grade:   string
  locale:  string
}

const BUYER_TYPES = [
  { value: 'pe',            label: 'Fonds PE / VC' },
  { value: 'strategic',     label: 'Acquéreur stratégique' },
  { value: 'family_office', label: 'Family office' },
  { value: 'individual',    label: 'Particulier / Indépendant' },
]

const CAPACITIES = [
  '< 100K€', '100K€ – 500K€', '500K€ – 2M€', '2M€ – 10M€', '> 10M€',
]

export default function NdaRequestForm({ assetId, grade, locale }: Props) {
  const [open,    setOpen]    = useState(false)
  const [done,    setDone]    = useState(false)
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState('')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const fd = new FormData(e.currentTarget)
    try {
      const res = await fetch('/api/nda/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          assetId,
          buyerEmail:   fd.get('buyerEmail'),
          buyerName:    fd.get('buyerName'),
          buyerCompany: fd.get('buyerCompany') || undefined,
          buyerType:    fd.get('buyerType')    || undefined,
          capacity:     fd.get('capacity')     || undefined,
          message:      fd.get('message')      || undefined,
          locale,
        }),
      })
      if (res.ok) setDone(true)
      else        setError('Une erreur est survenue. Veuillez réessayer.')
    } catch {
      setError('Erreur réseau. Veuillez réessayer.')
    } finally {
      setLoading(false)
    }
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-ag-black hover:text-ag-apex transition-colors"
      >
        Demander l&apos;accès NDA <ArrowUpRight size={10} />
      </button>
    )
  }

  if (done) {
    return (
      <div className="bg-ag-off-white border border-ag-border p-5 flex items-start gap-3">
        <CheckCircle2 size={16} className="text-ag-apex mt-0.5 shrink-0" />
        <div>
          <p className="font-sans font-semibold text-ag-black text-[13px]">Demande reçue</p>
          <p className="font-sans text-[12px] text-ag-gray mt-1">
            Notre équipe reviendra vers vous sous 24-48h pour valider votre profil et vous envoyer le NDA.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="border border-ag-border bg-ag-white">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-ag-border">
        <div>
          <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-ag-apex mb-0.5">Grade {grade}</p>
          <p className="font-sans font-semibold text-ag-black text-[13px]">Demande d&apos;accès NDA</p>
        </div>
        <button onClick={() => setOpen(false)} className="text-ag-gray-light hover:text-ag-black transition-colors">
          <X size={14} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="p-5 flex flex-col gap-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block font-sans text-[10px] uppercase tracking-[0.18em] text-ag-gray-light mb-1.5">
              Nom complet *
            </label>
            <input
              name="buyerName" required
              className="w-full border border-ag-border px-3 py-2.5 font-sans text-[13px] text-ag-black placeholder:text-ag-gray-light/50 focus:outline-none focus:border-ag-black transition-colors bg-white"
              placeholder="Jean Dupont"
            />
          </div>
          <div>
            <label className="block font-sans text-[10px] uppercase tracking-[0.18em] text-ag-gray-light mb-1.5">
              Email *
            </label>
            <input
              name="buyerEmail" type="email" required
              className="w-full border border-ag-border px-3 py-2.5 font-sans text-[13px] text-ag-black placeholder:text-ag-gray-light/50 focus:outline-none focus:border-ag-black transition-colors bg-white"
              placeholder="vous@exemple.com"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block font-sans text-[10px] uppercase tracking-[0.18em] text-ag-gray-light mb-1.5">
              Société
            </label>
            <input
              name="buyerCompany"
              className="w-full border border-ag-border px-3 py-2.5 font-sans text-[13px] text-ag-black placeholder:text-ag-gray-light/50 focus:outline-none focus:border-ag-black transition-colors bg-white"
              placeholder="Nom de votre structure"
            />
          </div>
          <div>
            <label className="block font-sans text-[10px] uppercase tracking-[0.18em] text-ag-gray-light mb-1.5">
              Profil acquéreur
            </label>
            <select
              name="buyerType"
              className="w-full border border-ag-border px-3 py-2.5 font-sans text-[13px] text-ag-black focus:outline-none focus:border-ag-black transition-colors bg-white"
            >
              <option value="">— Sélectionner —</option>
              {BUYER_TYPES.map(t => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block font-sans text-[10px] uppercase tracking-[0.18em] text-ag-gray-light mb-1.5">
            Capacité d&apos;acquisition déclarée
          </label>
          <select
            name="capacity"
            className="w-full border border-ag-border px-3 py-2.5 font-sans text-[13px] text-ag-black focus:outline-none focus:border-ag-black transition-colors bg-white"
          >
            <option value="">— Sélectionner —</option>
            {CAPACITIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        <div>
          <label className="block font-sans text-[10px] uppercase tracking-[0.18em] text-ag-gray-light mb-1.5">
            Message (optionnel)
          </label>
          <textarea
            name="message" rows={3}
            className="w-full border border-ag-border px-3 py-2.5 font-sans text-[13px] text-ag-black placeholder:text-ag-gray-light/50 focus:outline-none focus:border-ag-black transition-colors bg-white resize-none"
            placeholder="Contexte de votre intérêt pour cet actif..."
          />
        </div>

        {error && (
          <p className="font-sans text-[12px] text-red-600 bg-red-50 border border-red-200 px-3 py-2">
            {error}
          </p>
        )}

        <button
          type="submit" disabled={loading}
          className="w-full bg-ag-navy text-white font-mono text-[11px] tracking-[0.14em] uppercase px-6 py-3.5 font-semibold hover:bg-ag-black transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {loading ? 'Envoi...' : 'Soumettre ma demande'} {!loading && <ArrowUpRight size={12} />}
        </button>

        <p className="font-sans text-[10px] text-ag-gray-light text-center">
          Accès conditionnel à la validation de votre profil par notre équipe.
        </p>
      </form>
    </div>
  )
}
