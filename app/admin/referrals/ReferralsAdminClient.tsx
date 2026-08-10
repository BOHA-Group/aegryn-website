'use client'

import { useState } from 'react'
import { Loader2, Check, Gift, CreditCard } from 'lucide-react'

type Profile = { id: string; full_name: string | null; email: string }

export type ReferralRow = {
  id:                   string
  status:               'pending' | 'rewarded' | 'cancelled'
  code_used_at:         string
  code_expires_at:      string
  payment_confirmed_at: string | null
  rewarded_at:          string | null
  cancelled_at:         string | null
  referrer:             Profile | null
  referred:             Profile | null
}

export type CreditRow = {
  id:         string
  months:     number
  source:     'admin' | 'referral_sponsor' | 'referral_referred'
  note:       string | null
  applied:    boolean
  applied_at: string | null
  created_at: string
  user:       Profile | null
}

type Props = {
  referrals:      ReferralRow[]
  credits:        CreditRow[]
  activePartners: { id: string; full_name: string | null; email: string }[]
}

const STATUS_CFG = {
  pending:   { label: 'En attente',  cls: 'text-amber-700 bg-amber-50 border-amber-200' },
  rewarded:  { label: 'Récompensé', cls: 'text-emerald-700 bg-emerald-50 border-emerald-200' },
  cancelled: { label: 'Annulé',     cls: 'text-gray-500 bg-gray-50 border-gray-200' },
}

const SOURCE_LABELS: Record<string, string> = {
  admin:             'Crédit admin',
  referral_sponsor:  'Parrainage — parrain',
  referral_referred: 'Parrainage — filleul',
}

function fmtDate(d: string | null) {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('fr-CH', { day: '2-digit', month: '2-digit', year: '2-digit' })
}

function name(p: Profile | null) {
  if (!p) return '—'
  return p.full_name ?? p.email
}

export default function ReferralsAdminClient({ referrals, credits, activePartners }: Props) {
  const [tab,      setTab]      = useState<'referrals' | 'credits'>('referrals')
  const [filter,   setFilter]   = useState<'all' | 'pending' | 'rewarded' | 'cancelled'>('all')

  /* Formulaire crédit manuel */
  const [creditUserId,  setCreditUserId]  = useState('')
  const [creditMonths,  setCreditMonths]  = useState(1)
  const [creditNote,    setCreditNote]    = useState('')
  const [creditSaving,  setCreditSaving]  = useState(false)
  const [creditMsg,     setCreditMsg]     = useState<{ ok: boolean; text: string } | null>(null)

  const [localCredits, setLocalCredits] = useState(credits)

  async function submitCredit(e: React.FormEvent) {
    e.preventDefault()
    if (!creditUserId) return
    setCreditSaving(true)
    setCreditMsg(null)
    try {
      const res = await fetch(`/api/admin/expert/subscription`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ user_id: creditUserId, months: creditMonths, note: creditNote || undefined }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error ?? 'Erreur.')
      setCreditMsg({ ok: true, text: `${creditMonths} mois crédité(s) avec succès.` })
      setCreditUserId('')
      setCreditMonths(1)
      setCreditNote('')
      const partner = activePartners.find(p => p.id === creditUserId)
      setLocalCredits(prev => [{
        id: crypto.randomUUID(),
        months: creditMonths,
        source: 'admin',
        note: creditNote || null,
        applied: true,
        applied_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
        user: partner ?? null,
      }, ...prev])
    } catch (err: unknown) {
      setCreditMsg({ ok: false, text: err instanceof Error ? err.message : 'Erreur.' })
    } finally {
      setCreditSaving(false)
    }
  }

  const filteredReferrals = filter === 'all'
    ? referrals
    : referrals.filter(r => r.status === filter)

  const counts = {
    all:       referrals.length,
    pending:   referrals.filter(r => r.status === 'pending').length,
    rewarded:  referrals.filter(r => r.status === 'rewarded').length,
    cancelled: referrals.filter(r => r.status === 'cancelled').length,
  }

  return (
    <div className="p-8 max-w-6xl">

      <div className="mb-8">
        <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-gray-400 mb-1">Administration</p>
        <h1 className="font-sans font-bold text-gray-900 text-[24px] tracking-tight">Parrainages experts</h1>
        <p className="font-sans text-[13px] text-gray-400 mt-1">
          Suivi des parrainages entre experts et attribution manuelle de crédits abonnement.
        </p>
      </div>

      {/* Stats globales */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        {([
          { key: 'all',       label: 'Total',        cls: 'border-gray-200 bg-white' },
          { key: 'pending',   label: 'En attente',   cls: 'border-amber-200 bg-amber-50' },
          { key: 'rewarded',  label: 'Récompensés',  cls: 'border-emerald-200 bg-emerald-50' },
          { key: 'cancelled', label: 'Annulés',      cls: 'border-gray-200 bg-gray-50' },
        ] as const).map(s => (
          <div key={s.key}
            className={`border p-4 cursor-pointer transition-colors ${filter === s.key && tab === 'referrals' ? 'ring-2 ring-ag-navy' : ''} ${s.cls}`}
            onClick={() => { setTab('referrals'); setFilter(s.key) }}
          >
            <p className="font-mono text-[8px] uppercase tracking-widest text-gray-400 mb-1">{s.label}</p>
            <p className="font-sans font-bold text-[20px] text-gray-900">{counts[s.key]}</p>
          </div>
        ))}
      </div>

      {/* Onglets */}
      <div className="flex border-b border-gray-200 mb-6">
        {([
          { key: 'referrals', label: `Parrainages (${referrals.length})` },
          { key: 'credits',   label: `Crédits accordés (${localCredits.length})` },
        ] as const).map(t => (
          <button key={t.key} type="button"
            onClick={() => setTab(t.key)}
            className={`px-5 py-3 font-mono text-[10px] uppercase tracking-widest border-b-2 transition-colors ${
              tab === t.key ? 'border-ag-navy text-ag-navy' : 'border-transparent text-gray-400 hover:text-gray-700'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ── Onglet parrainages ── */}
      {tab === 'referrals' && (
        <>
          <div className="flex gap-2 flex-wrap mb-4">
            {(['all', 'pending', 'rewarded', 'cancelled'] as const).map(f => (
              <button key={f} type="button"
                onClick={() => setFilter(f)}
                className={`font-mono text-[9px] uppercase tracking-widest px-3 py-1.5 border transition-colors ${
                  filter === f ? 'bg-ag-navy text-white border-ag-navy' : 'border-gray-200 text-gray-500 hover:border-gray-400'
                }`}
              >
                {f === 'all' ? 'Tous' : STATUS_CFG[f].label} ({counts[f]})
              </button>
            ))}
          </div>

          {filteredReferrals.length === 0 ? (
            <div className="bg-white border border-gray-200 px-8 py-12 text-center">
              <Gift size={24} className="text-gray-300 mx-auto mb-3" />
              <p className="font-sans text-[13px] text-gray-400">Aucun parrainage dans cette catégorie.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {filteredReferrals.map(r => {
                const cfg     = STATUS_CFG[r.status]
                const expired = r.status === 'pending' && new Date(r.code_expires_at) < new Date()
                return (
                  <div key={r.id} className="bg-white border border-gray-200 p-5">
                    <div className="flex items-start gap-4 flex-wrap justify-between">
                      <div className="flex flex-col gap-1 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-sans font-semibold text-gray-900 text-[13px]">
                            {name(r.referrer)}
                          </span>
                          <span className="font-mono text-[9px] text-gray-400">→ parraine</span>
                          <span className="font-sans font-semibold text-gray-900 text-[13px]">
                            {name(r.referred)}
                          </span>
                        </div>
                        <div className="flex gap-4 flex-wrap">
                          <span className="font-mono text-[9px] text-gray-400">Code utilisé : {fmtDate(r.code_used_at)}</span>
                          {r.rewarded_at && <span className="font-mono text-[9px] text-emerald-600">Récompensé : {fmtDate(r.rewarded_at)}</span>}
                          {r.cancelled_at && <span className="font-mono text-[9px] text-red-400">Annulé : {fmtDate(r.cancelled_at)}</span>}
                          {expired && <span className="font-mono text-[9px] text-red-400">Code expiré ({fmtDate(r.code_expires_at)})</span>}
                        </div>
                      </div>
                      <span className={`border px-2.5 py-1 font-mono text-[9px] uppercase tracking-widest shrink-0 ${cfg.cls}`}>
                        {cfg.label}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </>
      )}

      {/* ── Onglet crédits ── */}
      {tab === 'credits' && (
        <div className="flex flex-col gap-6">

          {/* Formulaire crédit manuel */}
          <div className="bg-white border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-5">
              <CreditCard size={14} className="text-gray-400" />
              <p className="font-mono text-[10px] uppercase tracking-widest text-gray-500">Attribuer un crédit mois manuel</p>
            </div>
            <form onSubmit={submitCredit} className="flex flex-col gap-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="font-mono text-[9px] uppercase tracking-widest text-gray-500 block mb-1">Partenaire *</label>
                  <select
                    required
                    value={creditUserId}
                    onChange={e => setCreditUserId(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-300 px-3 py-2 font-sans text-[13px] focus:outline-none focus:border-ag-navy"
                  >
                    <option value="">-- Sélectionner --</option>
                    {activePartners.map(p => (
                      <option key={p.id} value={p.id}>
                        {p.full_name ?? p.email} — {p.email}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="font-mono text-[9px] uppercase tracking-widest text-gray-500 block mb-1">Mois *</label>
                  <input
                    type="number" required min={1} max={24}
                    value={creditMonths}
                    onChange={e => setCreditMonths(Number(e.target.value))}
                    className="w-full bg-gray-50 border border-gray-300 px-3 py-2 font-sans text-[13px] focus:outline-none focus:border-ag-navy"
                  />
                </div>
              </div>
              <div>
                <label className="font-mono text-[9px] uppercase tracking-widest text-gray-500 block mb-1">Note interne (optionnel)</label>
                <input
                  type="text" maxLength={300}
                  value={creditNote}
                  onChange={e => setCreditNote(e.target.value)}
                  placeholder="Motif du crédit…"
                  className="w-full bg-gray-50 border border-gray-300 px-3 py-2 font-sans text-[13px] focus:outline-none focus:border-ag-navy"
                />
              </div>
              <div className="flex items-center gap-4">
                <button
                  type="submit"
                  disabled={creditSaving || !creditUserId}
                  className="flex items-center gap-2 bg-ag-navy text-white font-mono text-[10px] uppercase tracking-widest px-5 py-2.5 hover:bg-ag-black transition-colors disabled:opacity-50"
                >
                  {creditSaving ? <Loader2 size={11} className="animate-spin" /> : <Check size={11} />}
                  Attribuer le crédit
                </button>
                {creditMsg && (
                  <p className={`font-sans text-[12px] ${creditMsg.ok ? 'text-emerald-700' : 'text-red-600'}`}>
                    {creditMsg.text}
                  </p>
                )}
              </div>
            </form>
          </div>

          {/* Historique crédits */}
          {localCredits.length === 0 ? (
            <div className="bg-white border border-gray-200 px-8 py-12 text-center">
              <p className="font-sans text-[13px] text-gray-400">Aucun crédit accordé.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {localCredits.map(c => (
                <div key={c.id} className="bg-white border border-gray-200 p-5 flex items-center justify-between gap-4 flex-wrap">
                  <div className="flex flex-col gap-0.5 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-sans font-semibold text-gray-900 text-[13px]">{name(c.user)}</span>
                      <span className="font-mono text-[9px] text-gray-400 border border-gray-200 px-1.5 py-0.5">
                        {SOURCE_LABELS[c.source] ?? c.source}
                      </span>
                    </div>
                    {c.note && <p className="font-sans text-[11px] text-gray-500 italic">{c.note}</p>}
                    <span className="font-mono text-[9px] text-gray-400">{fmtDate(c.created_at)}</span>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="font-sans font-bold text-[18px] text-gray-900">+{c.months} mois</span>
                    <span className={`border px-2 py-0.5 font-mono text-[9px] uppercase tracking-widest ${
                      c.applied ? 'text-emerald-700 bg-emerald-50 border-emerald-200' : 'text-amber-600 bg-amber-50 border-amber-200'
                    }`}>
                      {c.applied ? 'Appliqué' : 'En attente'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="mt-8 pt-6 border-t border-gray-100">
        <a href={`/admin`}
          className="font-mono text-[10px] uppercase tracking-widest text-gray-400 hover:text-gray-700 transition-colors">
          ← Retour au tableau de bord
        </a>
      </div>
    </div>
  )
}
