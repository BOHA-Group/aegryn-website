'use client'

import { useState, useEffect, useCallback } from 'react'
import { Gift, Users, Copy, Check, Loader2, ChevronDown, ChevronUp, X } from 'lucide-react'

type ReferralItem = {
  id: string
  referred_id: string
  status: 'pending' | 'rewarded' | 'cancelled'
  code_used_at: string
  code_expires_at: string
  payment_confirmed_at: string | null
  rewarded_at: string | null
}

type CreditItem = {
  id: string
  months: number
  source: 'admin' | 'referral_sponsor' | 'referral_referred'
  note: string | null
  applied: boolean
  applied_at: string | null
  created_at: string
}

type ReferralData = {
  referral_code: string
  referral_link: string
  referral_months_credit: number
  months_cap: number
  referrals: ReferralItem[]
  credits: CreditItem[]
  filleul_status: {
    status: string
    rewarded_at: string | null
    code_expires_at: string
  } | null
}

function fmtDate(d: string | null) {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('fr-CH', { day: '2-digit', month: 'long', year: 'numeric' })
}

const SOURCE_LABELS: Record<string, string> = {
  admin:             'Crédit admin',
  referral_sponsor:  'Parrainage — parrain',
  referral_referred: 'Parrainage — filleul',
}

const STATUS_LABELS: Record<string, { label: string; cls: string }> = {
  pending:   { label: 'En attente',  cls: 'text-amber-700 bg-amber-50 border-amber-200' },
  rewarded:  { label: 'Récompensé', cls: 'text-emerald-700 bg-emerald-50 border-emerald-200' },
  cancelled: { label: 'Annulé',     cls: 'text-gray-500 bg-gray-50 border-gray-200' },
}

export default function ReferralSection({ isActive }: { isActive: boolean }) {
  const [data,       setData]       = useState<ReferralData | null>(null)
  const [loading,    setLoading]    = useState(true)
  const [copied,     setCopied]     = useState(false)
  const [codeInput,  setCodeInput]  = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitMsg,  setSubmitMsg]  = useState<{ ok: boolean; text: string } | null>(null)
  const [showCredits, setShowCredits] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    const res = await fetch('/api/partner/referral')
    if (res.ok) setData(await res.json())
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  async function copyLink() {
    if (!data) return
    await navigator.clipboard.writeText(data.referral_code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  async function submitCode(e: React.FormEvent) {
    e.preventDefault()
    if (!codeInput.trim()) return
    setSubmitting(true)
    setSubmitMsg(null)
    const res  = await fetch('/api/partner/referral', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ code: codeInput.trim().toUpperCase(), consent: true }),
    })
    const json = await res.json() as { ok?: boolean; error?: string }
    if (json.ok) {
      setSubmitMsg({ ok: true, text: 'Code validé — votre parrain a été enregistré.' })
      setCodeInput('')
      load()
    } else {
      const ERRORS: Record<string, string> = {
        already_referred:               'Vous avez déjà un parrain.',
        already_referred_by_this_sponsor: 'Ce parrain vous a déjà parrainé.',
        self_referral:                  'Vous ne pouvez pas vous auto-parrainer.',
        cross_referral:                 'Parrainage croisé interdit.',
        invalid_code:                   'Code invalide ou introuvable.',
        sponsor_not_active:             'Le parrain doit avoir une fiche active.',
      }
      setSubmitMsg({ ok: false, text: ERRORS[json.error ?? ''] ?? 'Erreur inconnue.' })
    }
    setSubmitting(false)
  }

  async function revoke(id: string) {
    await fetch(`/api/partner/referral?id=${id}`, { method: 'DELETE' })
    load()
  }

  if (loading) return (
    <div className="flex items-center gap-2 py-6 text-gray-400">
      <Loader2 size={14} className="animate-spin" />
      <span className="font-mono text-[10px] uppercase tracking-widest">Chargement…</span>
    </div>
  )

  if (!data) return null

  const rewarded  = data.referrals.filter(r => r.status === 'rewarded').length
  const pending   = data.referrals.filter(r => r.status === 'pending').length

  return (
    <div className="space-y-6 mt-2">

      {/* ── Bannière filleul (si l'utilisateur a lui-même été parrainé) ── */}
      {data.filleul_status && data.filleul_status.status !== 'rewarded' && (
        <div className="bg-blue-50 border border-blue-200 px-5 py-4">
          <p className="font-sans text-[12px] text-blue-800">
            <strong>Vous avez été parrainé.</strong>{' '}
            {data.filleul_status.status === 'pending'
              ? 'Votre mois offert sera crédité dès activation de votre abonnement.'
              : 'Statut : ' + data.filleul_status.status}
          </p>
        </div>
      )}

      {/* ── Section parrainage ── */}
      <div className="bg-white border border-gray-200 p-6 space-y-5">
        <div className="flex items-center gap-2 mb-1">
          <Gift size={16} className="text-ag-apex shrink-0" />
          <p className="font-mono text-[10px] uppercase tracking-widest text-gray-400">Programme de parrainage</p>
        </div>

        <p className="font-sans text-[13px] text-gray-700 leading-relaxed">
          Parrainez d&apos;autres experts AEGRYN et gagnez{' '}
          <strong>1 mois d&apos;abonnement offert</strong> pour vous et votre filleul
          dès son premier paiement. Plafond : <strong>6 mois</strong> par parrain.
        </p>

        {/* Compteur */}
        <div className="flex gap-4 flex-wrap">
          <div className="border border-gray-200 px-4 py-3 flex flex-col gap-0.5">
            <span className="font-mono text-[10px] uppercase tracking-widest text-gray-400">Mois gagnés</span>
            <span className="font-sans font-bold text-gray-900 text-[20px]">
              {data.referral_months_credit}
              <span className="text-[13px] font-normal text-gray-400"> / {data.months_cap}</span>
            </span>
          </div>
          <div className="border border-gray-200 px-4 py-3 flex flex-col gap-0.5">
            <span className="font-mono text-[10px] uppercase tracking-widest text-gray-400">Filleuls actifs</span>
            <span className="font-sans font-bold text-gray-900 text-[20px]">{rewarded}</span>
          </div>
          {pending > 0 && (
            <div className="border border-amber-200 bg-amber-50 px-4 py-3 flex flex-col gap-0.5">
              <span className="font-mono text-[10px] uppercase tracking-widest text-amber-600">En attente</span>
              <span className="font-sans font-bold text-amber-800 text-[20px]">{pending}</span>
            </div>
          )}
        </div>

        {/* Code + lien */}
        {isActive && (
          <div className="space-y-2">
            <p className="font-mono text-[10px] uppercase tracking-widest text-gray-400">Votre code parrain</p>
            <div className="flex items-center gap-3">
              <span className="font-mono text-[18px] font-bold text-ag-navy tracking-[0.2em] bg-gray-50 border border-gray-200 px-4 py-2">
                {data.referral_code}
              </span>
              <button
                onClick={copyLink}
                className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest border border-gray-300 px-3 py-2 text-gray-500 hover:border-ag-navy hover:text-ag-navy transition-colors"
              >
                {copied ? <Check size={12} /> : <Copy size={12} />}
                {copied ? 'Copié' : 'Copier le code'}
              </button>
            </div>
          </div>
        )}

        {!isActive && (
          <p className="font-sans text-[12px] text-amber-700 bg-amber-50 border border-amber-200 px-4 py-3">
            Activez votre abonnement pour générer votre code parrain et participer au programme.
          </p>
        )}

        {/* Liste filleuls */}
        {data.referrals.length > 0 && (
          <div className="space-y-2">
            <p className="font-mono text-[10px] uppercase tracking-widest text-gray-400 flex items-center gap-1.5">
              <Users size={11} /> Filleuls ({data.referrals.length})
            </p>
            {data.referrals.map(r => {
              const s = STATUS_LABELS[r.status] ?? STATUS_LABELS.pending
              const expired = r.status === 'pending' && new Date(r.code_expires_at) < new Date()
              return (
                <div key={r.id} className="flex items-center justify-between gap-3 border border-gray-100 px-4 py-3 text-[12px]">
                  <div className="flex flex-col gap-0.5">
                    <span className="font-mono text-gray-500 text-[10px]">Inscrit le {fmtDate(r.code_used_at)}</span>
                    {r.rewarded_at && (
                      <span className="font-sans text-gray-400">Récompensé le {fmtDate(r.rewarded_at)}</span>
                    )}
                    {expired && r.status === 'pending' && (
                      <span className="font-sans text-red-500 text-[11px]">Code expiré le {fmtDate(r.code_expires_at)}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`font-mono text-[9px] uppercase tracking-widest border px-2 py-0.5 ${s.cls}`}>
                      {s.label}
                    </span>
                    {r.status === 'pending' && !expired && (
                      <button
                        onClick={() => revoke(r.id)}
                        title="Révoquer"
                        className="text-gray-300 hover:text-red-400 transition-colors"
                      >
                        <X size={13} />
                      </button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* ── Formulaire saisir un code ami ── */}
      {!data.filleul_status && isActive && (
        <div className="bg-white border border-gray-200 p-6">
          <p className="font-mono text-[10px] uppercase tracking-widest text-gray-400 mb-4">Saisir un code parrain</p>
          <form onSubmit={submitCode} className="flex gap-3 items-start flex-wrap">
            <input
              type="text"
              maxLength={8}
              value={codeInput}
              onChange={e => setCodeInput(e.target.value.toUpperCase())}
              placeholder="CODE8CHR"
              className="font-mono text-[14px] uppercase tracking-[0.18em] border border-gray-300 px-4 py-2 w-36 focus:outline-none focus:border-ag-navy"
            />
            <button
              type="submit"
              disabled={submitting || codeInput.length < 8}
              className="font-mono text-[10px] uppercase tracking-widest border border-ag-navy text-ag-navy px-4 py-2 hover:bg-ag-navy hover:text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {submitting && <Loader2 size={11} className="animate-spin" />}
              Valider
            </button>
          </form>
          {submitMsg && (
            <p className={`font-sans text-[12px] mt-3 ${submitMsg.ok ? 'text-emerald-700' : 'text-red-600'}`}>
              {submitMsg.text}
            </p>
          )}
          <p className="font-sans text-[11px] text-gray-400 mt-2">
            En validant, vous acceptez que votre relation de parrainage soit enregistrée.
          </p>
        </div>
      )}

      {/* ── Historique des crédits ── */}
      {data.credits.length > 0 && (
        <div className="bg-white border border-gray-200 p-6">
          <button
            onClick={() => setShowCredits(v => !v)}
            className="flex items-center justify-between w-full"
          >
            <p className="font-mono text-[10px] uppercase tracking-widest text-gray-400">
              Historique des crédits ({data.credits.length})
            </p>
            {showCredits ? <ChevronUp size={13} className="text-gray-400" /> : <ChevronDown size={13} className="text-gray-400" />}
          </button>
          {showCredits && (
            <div className="mt-4 divide-y divide-gray-100">
              {data.credits.map(c => (
                <div key={c.id} className="py-3 flex items-center justify-between gap-3 text-[12px]">
                  <div className="flex flex-col gap-0.5">
                    <span className="font-sans text-gray-700">
                      +{c.months} mois — {SOURCE_LABELS[c.source] ?? c.source}
                    </span>
                    {c.note && <span className="font-sans text-gray-400 text-[11px]">{c.note}</span>}
                    <span className="font-mono text-[10px] text-gray-400">{fmtDate(c.created_at)}</span>
                  </div>
                  <span className={`font-mono text-[9px] uppercase tracking-widest border px-2 py-0.5 ${
                    c.applied ? 'text-emerald-700 bg-emerald-50 border-emerald-200' : 'text-amber-600 bg-amber-50 border-amber-200'
                  }`}>
                    {c.applied ? 'Appliqué' : 'En attente'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

    </div>
  )
}
