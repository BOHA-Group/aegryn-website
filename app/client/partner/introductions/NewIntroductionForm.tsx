'use client'

import { useState } from 'react'
import { Loader2, SendHorizonal, CheckCircle2 } from 'lucide-react'

export default function NewIntroductionForm() {
  const [type, setType] = useState<'asset' | 'buyer'>('asset')
  const [contactName,  setContactName]  = useState('')
  const [contactEmail, setContactEmail] = useState('')
  const [note,         setNote]         = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error,   setError]   = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (!contactName.trim() || !contactEmail.trim()) {
      setError('Nom et email du contact sont requis.')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/partner/introductions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          introduction_type: type,
          contact_name:  contactName.trim(),
          contact_email: contactEmail.trim(),
          context_note:  note.trim() || null,
        }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error ?? 'Erreur lors de la soumission.')
      setSuccess(true)
      setTimeout(() => window.location.reload(), 1500)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erreur inattendue.')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="flex items-center gap-2 text-emerald-600 py-2">
        <CheckCircle2 size={14} />
        <span className="font-sans text-[13px]">Introduction soumise — l&apos;équipe AEGRYN prend contact sous 48h.</span>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {/* Type */}
      <div>
        <p className="font-mono text-[9px] uppercase tracking-widest text-gray-500 mb-2">Type d&apos;introduction *</p>
        <div className="flex gap-2">
          {(['asset', 'buyer'] as const).map(t => (
            <button key={t} type="button"
              onClick={() => setType(t)}
              className={`font-mono text-[10px] uppercase tracking-widest px-4 py-2 border transition-colors ${
                type === t ? 'bg-ag-navy text-white border-ag-navy' : 'text-gray-500 border-gray-300 hover:border-gray-500'
              }`}>
              {t === 'asset' ? 'Apport actif' : 'Apport acquéreur'}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="font-mono text-[9px] uppercase tracking-widest text-gray-500 block mb-2">
            Nom du contact *
          </label>
          <input
            type="text" required
            value={contactName}
            onChange={e => setContactName(e.target.value)}
            placeholder={type === 'asset' ? 'Nom du dirigeant / cédant' : 'Nom de l\'acquéreur'}
            className="w-full bg-gray-50 border border-gray-300 px-4 py-2.5 font-sans text-[13px] text-gray-900 focus:outline-none focus:border-ag-navy transition-colors"
          />
        </div>
        <div>
          <label className="font-mono text-[9px] uppercase tracking-widest text-gray-500 block mb-2">
            Email du contact *
          </label>
          <input
            type="email" required
            value={contactEmail}
            onChange={e => setContactEmail(e.target.value)}
            placeholder="contact@exemple.com"
            className="w-full bg-gray-50 border border-gray-300 px-4 py-2.5 font-sans text-[13px] text-gray-900 focus:outline-none focus:border-ag-navy transition-colors"
          />
        </div>
      </div>

      <div>
        <label className="font-mono text-[9px] uppercase tracking-widest text-gray-500 block mb-2">
          Contexte et informations (optionnel)
        </label>
        <textarea
          rows={3}
          value={note}
          onChange={e => setNote(e.target.value)}
          placeholder={type === 'asset'
            ? 'Secteur, ARR estimé, raison de la cession, disponibilité du dirigeant…'
            : 'Profil de l\'acquéreur, capacité financière estimée, secteurs recherchés…'}
          className="w-full bg-gray-50 border border-gray-300 px-4 py-3 font-sans text-[12px] text-gray-900 focus:outline-none focus:border-ag-navy transition-colors resize-none"
        />
      </div>

      {error && (
        <p className="font-sans text-[12px] text-red-500 bg-red-50 border border-red-200 px-4 py-2.5">{error}</p>
      )}

      <div>
        <button
          type="submit"
          disabled={loading}
          className="flex items-center gap-2 bg-ag-navy text-white font-mono text-[10px] uppercase tracking-widest px-6 py-2.5 hover:bg-ag-black transition-colors disabled:opacity-50"
        >
          {loading ? <Loader2 size={11} className="animate-spin" /> : <SendHorizonal size={11} />}
          Soumettre l&apos;introduction
        </button>
      </div>
    </form>
  )
}
