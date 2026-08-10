'use client'

import { useState } from 'react'
import { Loader2, SendHorizonal, CheckCircle2, Users, Mail } from 'lucide-react'

const TARGET_OPTIONS = [
  { value: 'all',     label: 'Tous les clients',          desc: 'Buyers + Sellers + Partners' },
  { value: 'buyer',   label: 'Acquéreurs uniquement',     desc: 'Espace Acquéreur' },
  { value: 'seller',  label: 'Cédants uniquement',        desc: 'Espace Cédant' },
  { value: 'partner', label: 'Partenaires uniquement',    desc: 'Espace Partenaire' },
] as const

const NOTIF_TYPES = [
  { value: 'broadcast_info',   label: 'Info',   color: 'text-blue-600 border-blue-200 bg-blue-50' },
  { value: 'broadcast_alert',  label: 'Alerte', color: 'text-amber-600 border-amber-200 bg-amber-50' },
  { value: 'broadcast_action', label: 'Action', color: 'text-emerald-600 border-emerald-200 bg-emerald-50' },
] as const

type Props = {
  roleCounts: Record<string, number>
}

type Result = {
  sent: number
  failed: number
  total: number
  status: string
  broadcast_id: string
}

export default function BroadcastForm({ roleCounts }: Props) {
  const [targetRole,  setTargetRole]  = useState<'all' | 'buyer' | 'seller' | 'partner'>('all')
  const [notifType,   setNotifType]   = useState<'broadcast_info' | 'broadcast_alert' | 'broadcast_action'>('broadcast_info')
  const [subject,     setSubject]     = useState('')
  const [title,       setTitle]       = useState('')
  const [bodyText,    setBodyText]    = useState('')
  const [ctaLabel,    setCtaLabel]    = useState('')
  const [ctaUrl,      setCtaUrl]      = useState('')
  const [createInApp, setCreateInApp] = useState(true)
  const [loading,     setLoading]     = useState(false)
  const [result,      setResult]      = useState<Result | null>(null)
  const [error,       setError]       = useState('')

  const estimatedCount = roleCounts[targetRole] ?? 0

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setResult(null)

    if (!subject.trim()) { setError('Le sujet email est requis.'); return }
    if (!title.trim())   { setError('Le titre est requis.'); return }
    if (!bodyText.trim()){ setError('Le corps du message est requis.'); return }

    const confirmed = window.confirm(
      `Envoyer ce message à ${estimatedCount} destinataire(s) (${TARGET_OPTIONS.find(t => t.value === targetRole)?.label}) ?\n\nSujet : ${subject}\nTitre : ${title}`
    )
    if (!confirmed) return

    setLoading(true)
    try {
      const res = await fetch('/api/admin/notifications/broadcast', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          target_role:   targetRole,
          subject:       subject.trim(),
          title:         title.trim(),
          body_text:     bodyText.trim(),
          cta_label:     ctaLabel.trim() || null,
          cta_url:       ctaUrl.trim()   || null,
          notif_type:    notifType,
          create_in_app: createInApp,
        }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error ?? 'Erreur lors de l\'envoi.')
      setResult(json as Result)
      setSubject('')
      setTitle('')
      setBodyText('')
      setCtaLabel('')
      setCtaUrl('')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erreur inattendue.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white border border-gray-200 p-6">
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">

        {/* Cible */}
        <div>
          <p className="font-mono text-[9px] uppercase tracking-widest text-gray-500 mb-3">Destinataires *</p>
          <div className="flex flex-col gap-2">
            {TARGET_OPTIONS.map(opt => (
              <label key={opt.value}
                className={`flex items-start gap-3 border px-4 py-3 cursor-pointer transition-colors ${
                  targetRole === opt.value
                    ? 'border-ag-navy bg-ag-navy/5'
                    : 'border-gray-200 hover:border-gray-300'
                }`}>
                <input
                  type="radio"
                  name="target_role"
                  value={opt.value}
                  checked={targetRole === opt.value}
                  onChange={() => setTargetRole(opt.value)}
                  className="mt-0.5 shrink-0"
                />
                <div className="flex-1">
                  <p className="font-sans font-medium text-[13px] text-gray-900">{opt.label}</p>
                  <p className="font-sans text-[11px] text-gray-400">{opt.desc}</p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <Users size={11} className="text-gray-400" />
                  <span className="font-mono text-[11px] font-bold text-gray-700">
                    {roleCounts[opt.value] ?? 0}
                  </span>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Type de notification in-app */}
        <div>
          <p className="font-mono text-[9px] uppercase tracking-widest text-gray-500 mb-2">Type de notification *</p>
          <div className="flex gap-2">
            {NOTIF_TYPES.map(t => (
              <button key={t.value} type="button"
                onClick={() => setNotifType(t.value)}
                className={`border px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest transition-colors ${
                  notifType === t.value ? t.color : 'text-gray-400 border-gray-200 hover:border-gray-400'
                }`}>
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Sujet email */}
        <div>
          <label className="font-mono text-[9px] uppercase tracking-widest text-gray-500 block mb-2">
            Sujet email *
          </label>
          <input
            type="text"
            value={subject}
            onChange={e => setSubject(e.target.value)}
            placeholder="Mise à jour de votre dossier Aegryn"
            maxLength={200}
            className="w-full bg-gray-50 border border-gray-300 px-4 py-2.5 font-sans text-[13px] text-gray-900 focus:outline-none focus:border-ag-navy transition-colors"
          />
        </div>

        {/* Titre */}
        <div>
          <label className="font-mono text-[9px] uppercase tracking-widest text-gray-500 block mb-2">
            Titre (email + notif in-app) *
          </label>
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="Votre dossier a été mis à jour"
            maxLength={200}
            className="w-full bg-gray-50 border border-gray-300 px-4 py-2.5 font-sans text-[13px] text-gray-900 focus:outline-none focus:border-ag-navy transition-colors"
          />
        </div>

        {/* Corps */}
        <div>
          <label className="font-mono text-[9px] uppercase tracking-widest text-gray-500 block mb-2">
            Corps du message * <span className="text-gray-300 normal-case tracking-normal">(sauts de ligne préservés)</span>
          </label>
          <textarea
            rows={5}
            value={bodyText}
            onChange={e => setBodyText(e.target.value)}
            placeholder="Bonjour,&#10;&#10;L'équipe Aegryn a le plaisir de vous informer..."
            maxLength={5000}
            className="w-full bg-gray-50 border border-gray-300 px-4 py-3 font-sans text-[13px] text-gray-900 focus:outline-none focus:border-ag-navy transition-colors resize-none"
          />
          <p className="font-mono text-[9px] text-gray-300 mt-1 text-right">{bodyText.length}/5000</p>
        </div>

        {/* CTA (optionnel) */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="font-mono text-[9px] uppercase tracking-widest text-gray-500 block mb-2">
              Bouton CTA (optionnel)
            </label>
            <input
              type="text"
              value={ctaLabel}
              onChange={e => setCtaLabel(e.target.value)}
              placeholder="Voir mon dossier →"
              className="w-full bg-gray-50 border border-gray-300 px-3 py-2 font-sans text-[12px] text-gray-900 focus:outline-none focus:border-ag-navy transition-colors"
            />
          </div>
          <div>
            <label className="font-mono text-[9px] uppercase tracking-widest text-gray-500 block mb-2">
              URL du CTA
            </label>
            <input
              type="url"
              value={ctaUrl}
              onChange={e => setCtaUrl(e.target.value)}
              placeholder="https://aegryn.com/client/…"
              className="w-full bg-gray-50 border border-gray-300 px-3 py-2 font-sans text-[12px] text-gray-900 focus:outline-none focus:border-ag-navy transition-colors"
            />
          </div>
        </div>

        {/* Options */}
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={createInApp}
            onChange={e => setCreateInApp(e.target.checked)}
          />
          <span className="font-sans text-[12px] text-gray-700">
            Créer aussi la notification in-app (visible dans l&apos;espace client)
          </span>
        </label>

        {/* Prévisualisation résumé */}
        <div className="bg-gray-50 border border-gray-200 px-4 py-3">
          <p className="font-mono text-[9px] uppercase tracking-widest text-gray-400 mb-2">Récapitulatif</p>
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-1.5">
              <Users size={11} className="text-gray-400" />
              <span className="font-sans text-[12px] text-gray-700">
                <strong>{estimatedCount}</strong> destinataire{estimatedCount > 1 ? 's' : ''}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <Mail size={11} className="text-gray-400" />
              <span className="font-sans text-[12px] text-gray-700">Email {createInApp ? '+ Notif in-app' : 'uniquement'}</span>
            </div>
          </div>
        </div>

        {error && (
          <p className="font-sans text-[12px] text-red-500 bg-red-50 border border-red-200 px-4 py-3">{error}</p>
        )}

        {result && (
          <div className={`flex items-start gap-3 border px-4 py-3 ${
            result.status === 'sent'    ? 'bg-emerald-50 border-emerald-200' :
            result.status === 'partial' ? 'bg-amber-50 border-amber-200' :
            'bg-red-50 border-red-200'
          }`}>
            <CheckCircle2 size={14} className="shrink-0 mt-0.5 text-emerald-600" />
            <div>
              <p className="font-sans font-semibold text-[13px] text-gray-900">
                {result.sent} email{result.sent > 1 ? 's' : ''} envoyé{result.sent > 1 ? 's' : ''}
                {result.failed > 0 && ` · ${result.failed} échec${result.failed > 1 ? 's' : ''}`}
              </p>
              <p className="font-mono text-[9px] text-gray-500 mt-0.5">ID broadcast : {result.broadcast_id}</p>
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={loading || estimatedCount === 0}
          className="flex items-center justify-center gap-2 bg-ag-navy text-white font-mono text-[10px] uppercase tracking-widest px-6 py-3 hover:bg-ag-black transition-colors disabled:opacity-40"
        >
          {loading
            ? <><Loader2 size={11} className="animate-spin" /> Envoi en cours…</>
            : <><SendHorizonal size={11} /> Envoyer à {estimatedCount} destinataire{estimatedCount > 1 ? 's' : ''}</>
          }
        </button>
      </form>
    </div>
  )
}
