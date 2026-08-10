'use client'

import { useState, useEffect, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronDown, ChevronUp, Loader2, PlusCircle, TrendingUp, Mail, Globe, Clock, Trash2 } from 'lucide-react'

type Application = {
  id:           string
  prenom:       string
  nom:          string
  email:        string
  profession:   string
  specialties:  string[]
  city:         string | null
  country:      string | null
  bio:          string | null
  organization: string | null
  website:      string | null
  status:       string
  admin_note:   string | null
  created_at:   string
}

type ExpertProfile = {
  id:            string
  user_id:       string
  first_name:    string
  last_name:     string
  profession:    string
  specialties:   string[]
  city:          string | null
  country_code:  string
  bio:           string | null
  organization:  string | null
  is_visible:    boolean
  hidden_reason: string | null
  review_status: string | null
  verified_at:   string | null
  created_at:    string
  profile: {
    email:              string
    roles:              string[]
    kyc_status:         string | null
    expert_plan:        string | null
    expert_plan_start:  string | null
    expert_plan_end:    string | null
  } | null
}

const STATUS_COLORS: Record<string, string> = {
  pending:   'bg-yellow-50 text-yellow-700 border-yellow-200',
  contacted: 'bg-blue-50 text-blue-700 border-blue-200',
  approved:  'bg-emerald-50 text-emerald-700 border-emerald-200',
  rejected:  'bg-red-50 text-red-600 border-red-200',
}

function fmtDate(d: string) {
  return new Date(d).toLocaleDateString('fr-CH', { day: '2-digit', month: '2-digit', year: '2-digit' })
}

function ApplicationRow({
  app,
  tokenQs,
  onRefresh,
}: {
  app: Application
  tokenQs: string
  onRefresh: () => void
}) {
  const [expanded, setExpanded] = useState(false)
  const [loading,  setLoading]  = useState(false)

  async function patch(status: string) {
    setLoading(true)
    await fetch(`/api/admin/experts${tokenQs}`, {
      method:  'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ table: 'expert_applications', id: app.id, status }),
    })
    setLoading(false)
    onRefresh()
  }

  async function del() {
    if (!confirm('Supprimer définitivement cette candidature ?')) return
    setLoading(true)
    await fetch(`/api/admin/experts${tokenQs}`, {
      method:  'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ table: 'expert_applications', id: app.id }),
    })
    setLoading(false)
    onRefresh()
  }

  return (
    <div className="border border-gray-200 bg-white">
      <div
        className="flex items-center justify-between gap-4 px-5 py-4 cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={() => setExpanded(e => !e)}
      >
        <div className="flex items-center gap-4 min-w-0">
          <span className={`font-mono text-[9px] uppercase tracking-widest px-2 py-0.5 border ${STATUS_COLORS[app.status] ?? 'bg-gray-50 text-gray-400 border-gray-200'}`}>
            {app.status}
          </span>
          <span className="font-sans font-semibold text-[13px] text-gray-900 truncate">
            {app.prenom} {app.nom}
          </span>
          <span className="font-sans text-[12px] text-gray-400 truncate hidden sm:block">{app.email}</span>
          <span className="font-mono text-[10px] text-ag-apex shrink-0">{app.profession}</span>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <span className="font-mono text-[10px] text-gray-300">{fmtDate(app.created_at)}</span>
          {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </div>
      </div>

      {expanded && (
        <div className="px-5 pb-5 border-t border-gray-100 pt-4">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-[12px] mb-4">
            <div><span className="text-gray-400">Organisation</span><br /><span className="text-gray-700">{app.organization ?? '—'}</span></div>
            <div><span className="text-gray-400">Ville / Pays</span><br /><span className="text-gray-700">{[app.city, app.country].filter(Boolean).join(', ') || '—'}</span></div>
            <div><span className="text-gray-400">Site</span><br />{app.website ? <a href={app.website} target="_blank" rel="noopener" className="text-ag-apex underline truncate block">{app.website}</a> : '—'}</div>
            {app.specialties.length > 0 && (
              <div className="col-span-2 md:col-span-3">
                <span className="text-gray-400">Spécialités</span><br />
                <span className="text-gray-700">{app.specialties.join(', ')}</span>
              </div>
            )}
            {app.bio && (
              <div className="col-span-2 md:col-span-3">
                <span className="text-gray-400">Bio</span><br />
                <span className="text-gray-700">{app.bio}</span>
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            {app.status !== 'contacted' && (
              <button onClick={() => patch('contacted')} disabled={loading}
                className="font-mono text-[9px] uppercase tracking-widest px-3 py-1.5 border border-blue-200 text-blue-600 hover:bg-blue-50 disabled:opacity-50 transition-colors">
                Contacté
              </button>
            )}
            {app.status !== 'approved' && (
              <button onClick={() => patch('approved')} disabled={loading}
                className="font-mono text-[9px] uppercase tracking-widest px-3 py-1.5 border border-emerald-200 text-emerald-700 hover:bg-emerald-50 disabled:opacity-50 transition-colors">
                ✓ Approuver
              </button>
            )}
            {app.status !== 'rejected' && (
              <button onClick={() => patch('rejected')} disabled={loading}
                className="font-mono text-[9px] uppercase tracking-widest px-3 py-1.5 border border-red-200 text-red-600 hover:bg-red-50 disabled:opacity-50 transition-colors">
                Rejeter
              </button>
            )}
            {app.status !== 'pending' && (
              <button onClick={() => patch('pending')} disabled={loading}
                className="font-mono text-[9px] uppercase tracking-widest px-3 py-1.5 border border-gray-200 text-gray-400 hover:border-gray-400 disabled:opacity-50 transition-colors">
                Réinitialiser
              </button>
            )}
            <button onClick={del} disabled={loading}
              className="font-mono text-[9px] uppercase tracking-widest px-3 py-1.5 border border-red-100 text-red-300 hover:bg-red-50 hover:text-red-500 disabled:opacity-50 transition-colors ml-auto">
              Supprimer
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

function ProfileRow({
  profile,
  tokenQs,
  onRefresh,
}: {
  profile: ExpertProfile
  tokenQs: string
  onRefresh: () => void
}) {
  const [expanded,     setExpanded]     = useState(false)
  const [loading,      setLoading]      = useState(false)
  const [refuseReason, setRefuseReason] = useState('')
  const [showRefuse,   setShowRefuse]   = useState(false)
  const [patchError,   setPatchError]   = useState<string | null>(null)

  async function patchProfile(updates: Record<string, unknown>) {
    setLoading(true)
    setPatchError(null)
    const res  = await fetch(`/api/admin/experts${tokenQs}`, {
      method:  'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ table: 'expert_profiles', id: profile.id, ...updates }),
    })
    if (!res.ok) {
      const data = await res.json() as { error?: string; message?: string }
      setPatchError(data.message ?? data.error ?? 'Erreur inconnue.')
      setLoading(false)
      return
    }
    setLoading(false)
    onRefresh()
  }

  async function del() {
    if (!confirm('Supprimer définitivement cette fiche ?')) return
    setLoading(true)
    await fetch(`/api/admin/experts${tokenQs}`, {
      method:  'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ table: 'expert_profiles', id: profile.id }),
    })
    setLoading(false)
    onRefresh()
  }

  const plan        = profile.profile?.expert_plan ?? null
  const planEnd     = profile.profile?.expert_plan_end ?? null
  const kycStatus   = profile.profile?.kyc_status ?? null
  const kycOk       = kycStatus === 'approved'
  const hasCredit   = planEnd ? new Date(planEnd) > new Date() : false
  const planOk      = plan === 'active' || hasCredit

  return (
    <div id={`expert-${profile.user_id}`} className="border border-gray-200 bg-white scroll-mt-4">
      <div
        className="flex items-center justify-between gap-4 px-5 py-4 cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={() => setExpanded(e => !e)}
      >
        <div className="flex items-center gap-4 min-w-0">
          <span className={`font-mono text-[9px] uppercase tracking-widest px-2 py-0.5 border ${
            profile.is_visible
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
              : profile.review_status === 'rejected'
              ? 'bg-red-50 text-red-600 border-red-200'
              : profile.hidden_reason === 'admin_hidden'
              ? 'bg-gray-50 text-gray-400 border-gray-200'
              : profile.review_status === 'approved'
              ? 'bg-blue-50 text-blue-700 border-blue-200'
              : profile.review_status === 'pending_review'
              ? 'bg-orange-50 text-orange-700 border-orange-200'
              : 'bg-gray-50 text-gray-400 border-gray-200'
          }`}>
            {profile.is_visible
              ? 'Publiée'
              : profile.review_status === 'rejected'
              ? 'Refusée'
              : profile.hidden_reason === 'admin_hidden'
              ? 'Masquée (admin)'
              : profile.review_status === 'approved'
              ? 'Approuvée — en attente'
              : profile.review_status === 'pending_review'
              ? 'À réviser'
              : 'Brouillon'}
          </span>
          <span className={`font-mono text-[9px] uppercase tracking-widest px-2 py-0.5 border ${
            plan === 'active'  ? 'bg-ag-apex/10 text-ag-apex border-ag-apex/30'
            : hasCredit        ? 'bg-blue-50 text-blue-600 border-blue-200'
            : 'bg-amber-50 text-amber-600 border-amber-200'
          }`}>
            {plan === 'active' ? 'Plan actif' : hasCredit ? 'Crédit admin' : 'Sans plan'}
          </span>
          <span className="font-sans font-semibold text-[13px] text-gray-900 truncate">
            {profile.first_name} {profile.last_name}
          </span>
          <span className="font-mono text-[10px] text-ag-apex shrink-0 hidden sm:block">{profile.profession}</span>
          <span className={`font-mono text-[9px] uppercase tracking-widest px-2 py-0.5 border ${
            kycOk
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
              : 'bg-amber-50 text-amber-600 border-amber-200'
          }`}>
            KYC {kycOk ? '✓' : kycStatus ?? 'pending'}
          </span>
          <span className="font-sans text-[12px] text-gray-400 truncate hidden md:block">{profile.profile?.email ?? '—'}</span>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <span className="font-mono text-[10px] text-gray-300">{fmtDate(profile.created_at)}</span>
          {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </div>
      </div>

      {expanded && (
        <div className="px-5 pb-5 border-t border-gray-100 pt-4">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-[12px] mb-4">
            <div><span className="text-gray-400">Organisation</span><br /><span className="text-gray-700">{profile.organization ?? '—'}</span></div>
            <div><span className="text-gray-400">Localisation</span><br /><span className="text-gray-700">{[profile.city, profile.country_code].filter(Boolean).join(', ')}</span></div>
            <div><span className="text-gray-400">Roles compte</span><br /><span className="text-gray-700">{profile.profile?.roles?.join(', ') ?? '—'}</span></div>
            {profile.hidden_reason && (
              <div className="col-span-2 md:col-span-3">
                <span className="text-gray-400">Motif masquage</span><br />
                <span className="text-red-500">{profile.hidden_reason}</span>
              </div>
            )}
            {profile.bio && (
              <div className="col-span-2 md:col-span-3">
                <span className="text-gray-400">Bio</span><br />
                <span className="text-gray-600 line-clamp-3">{profile.bio}</span>
              </div>
            )}
          </div>

          {/* Actions fiche */}
          {patchError && (
            <div className="mb-3 bg-red-50 border border-red-200 px-3 py-2 text-[11px] text-red-700">
              {patchError}
            </div>
          )}
          {profile.review_status === 'approved' && !profile.is_visible && profile.hidden_reason !== 'admin_hidden' && (!kycOk || !planOk) && (
            <p className="mb-3 font-sans text-[11px] text-blue-600 bg-blue-50 border border-blue-100 px-3 py-2">
              Fiche approuvée — prérequis manquants : {!kycOk && 'KYC'}{!kycOk && !planOk && ' + '}{!planOk && 'abonnement'}. Publication automatique dès qu&apos;ils seront actifs, ou utilisez &quot;Publier directement&quot;.
            </p>
          )}

          <div className="flex flex-wrap gap-2 mb-3">
            {profile.review_status !== 'approved' && profile.review_status !== 'rejected' && (
              <button
                onClick={() => patchProfile({ review_status: 'approved', hidden_reason: null })}
                disabled={loading}
                className="font-mono text-[9px] uppercase tracking-widest px-3 py-1.5 border border-emerald-200 text-emerald-700 hover:bg-emerald-50 disabled:opacity-50 transition-colors">
                ✓ Approuver la fiche
              </button>
            )}
            {profile.review_status === 'approved' && !profile.is_visible && (
              <button
                onClick={() => { if (confirm('Publier manuellement cette fiche sans vérifier les prérequis ?')) patchProfile({ is_visible: true, verified_at: new Date().toISOString(), hidden_reason: null }) }}
                disabled={loading}
                className="font-mono text-[9px] uppercase tracking-widest px-3 py-1.5 border border-blue-300 text-blue-700 bg-blue-50 hover:bg-blue-100 disabled:opacity-50 transition-colors">
                ⚡ Publier directement
              </button>
            )}
            {profile.is_visible && (
              <button onClick={() => patchProfile({ hidden_reason: 'admin_hidden', skip_email: true })} disabled={loading}
                className="font-mono text-[9px] uppercase tracking-widest px-3 py-1.5 border border-gray-200 text-gray-500 hover:border-gray-400 disabled:opacity-50 transition-colors">
                Masquer (silencieux)
              </button>
            )}
            {!profile.is_visible && profile.hidden_reason === 'admin_hidden' && (
              <button onClick={() => patchProfile({ hidden_reason: null })} disabled={loading}
                className="font-mono text-[9px] uppercase tracking-widest px-3 py-1.5 border border-blue-200 text-blue-600 hover:bg-blue-50 disabled:opacity-50 transition-colors">
                Réafficher
              </button>
            )}
            {profile.review_status !== 'rejected' && (
              <button onClick={() => setShowRefuse(v => !v)} disabled={loading}
                className="font-mono text-[9px] uppercase tracking-widest px-3 py-1.5 border border-red-200 text-red-600 hover:bg-red-50 disabled:opacity-50 transition-colors">
                Refuser avec motif
              </button>
            )}
            {profile.review_status === 'rejected' && (
              <button onClick={() => patchProfile({ review_status: 'pending_review', hidden_reason: null })} disabled={loading}
                className="font-mono text-[9px] uppercase tracking-widest px-3 py-1.5 border border-gray-200 text-gray-500 hover:border-gray-400 disabled:opacity-50 transition-colors">
                Réinitialiser (repasser en révision)
              </button>
            )}
            <button
              onClick={() => { if (confirm('Vider tout le contenu de cette fiche ? Le partenaire devra la reconstruire depuis zéro.')) patchProfile({ reset: true }) }}
              disabled={loading}
              className="font-mono text-[9px] uppercase tracking-widest px-3 py-1.5 border border-red-100 text-red-300 hover:bg-red-50 hover:text-red-500 disabled:opacity-50 transition-colors">
              Vider la fiche
            </button>
          </div>

          {showRefuse && (
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                placeholder="Motif du refus…"
                value={refuseReason}
                onChange={e => setRefuseReason(e.target.value)}
                className="flex-1 border border-gray-200 px-3 py-2 font-sans text-[12px] focus:outline-none focus:border-gray-400"
              />
              <button
                onClick={() => { patchProfile({ review_status: 'rejected', hidden_reason: refuseReason }); setShowRefuse(false) }}
                disabled={loading || !refuseReason}
                className="font-mono text-[9px] uppercase tracking-widest px-3 py-2 bg-red-500 text-white hover:bg-red-600 disabled:opacity-50 transition-colors"
              >
                Confirmer
              </button>
            </div>
          )}

          {/* Actions plan — lecture seule, l'admin ne contrôle pas l'abonnement Stripe */}
          <div className="flex flex-wrap gap-2 pt-3 border-t border-gray-100">
            <p className="w-full font-mono text-[9px] uppercase tracking-widest text-gray-300 mb-1">
              Abonnement — <span className="text-gray-400 normal-case tracking-normal">géré par le partenaire via Stripe. Les crédits manuels sont dans le bloc ci-dessous.</span>
            </p>
            <button onClick={del} disabled={loading}
              className="font-mono text-[9px] uppercase tracking-widest px-3 py-1.5 border border-red-100 text-red-300 hover:bg-red-50 hover:text-red-500 disabled:opacity-50 transition-colors ml-auto">
              Supprimer fiche
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────────────────────
 * AdminSubscriptionPanel — attribution manuelle de mois d'abonnement expert
 * ───────────────────────────────────────────────────────────────────────────── */

function AdminSubscriptionPanel({ profiles }: { profiles: ExpertProfile[] }) {
  const [open,      setOpen]      = useState(true)
  const [userId,    setUserId]    = useState('')
  const [months,    setMonths]    = useState('1')
  const [note,      setNote]      = useState('')
  const [loading,   setLoading]   = useState(false)
  const [msg,       setMsg]       = useState<{ ok: boolean; text: string } | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!userId || !months) return
    setLoading(true)
    setMsg(null)
    const res  = await fetch('/api/admin/expert/subscription', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ user_id: userId, months: parseInt(months, 10), note: note || undefined }),
    })
    const data = await res.json() as { ok?: boolean; error?: string; expert_plan_end?: string }
    if (data.ok) {
      setMsg({ ok: true, text: `Abonnement prolongé jusqu'au ${data.expert_plan_end ? new Date(data.expert_plan_end).toLocaleDateString('fr-CH') : '—'}.` })
      setNote('')
    } else {
      setMsg({ ok: false, text: data.error ?? 'Erreur inconnue.' })
    }
    setLoading(false)
  }

  const sortedProfiles = [...profiles].sort((a, b) =>
    (a.profile?.email ?? '').localeCompare(b.profile?.email ?? '')
  )

  return (
    <div className="bg-white border border-gray-200">
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <PlusCircle size={14} className="text-ag-navy" />
          <h2 className="font-sans font-bold text-gray-900 text-[14px]">Attribution manuelle d&apos;abonnement</h2>
        </div>
        {open ? <ChevronUp size={14} className="text-gray-400" /> : <ChevronDown size={14} className="text-gray-400" />}
      </button>

      {open && (
        <div className="px-5 pb-6 border-t border-gray-100">
          <p className="font-sans text-[12px] text-gray-500 mt-4 mb-5">
            Crédite N mois sur un partenaire (avec ou sans abonnement Stripe actif).
            L&apos;admin peut agir même si le partenaire n&apos;a jamais souscrit via Stripe.
          </p>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-lg">
            <div>
              <label className="font-mono text-[10px] uppercase tracking-widest text-gray-400 block mb-1">
                Partenaire
              </label>
              <select
                value={userId}
                onChange={e => setUserId(e.target.value)}
                className="w-full border border-gray-300 px-3 py-2 font-sans text-[13px] focus:outline-none focus:border-ag-navy"
                required
              >
                <option value="">— Sélectionner —</option>
                {sortedProfiles.map(p => (
                  <option key={p.user_id} value={p.user_id}>
                    {p.first_name} {p.last_name} — {p.profile?.email ?? p.user_id}
                    {p.profile?.expert_plan === 'active' ? ' ✓ actif' : ' ✗ inactif'}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex gap-4">
              <div>
                <label className="font-mono text-[10px] uppercase tracking-widest text-gray-400 block mb-1">
                  Mois à créditer
                </label>
                <input
                  type="number"
                  min={1}
                  max={24}
                  value={months}
                  onChange={e => setMonths(e.target.value)}
                  className="w-24 border border-gray-300 px-3 py-2 font-mono text-[14px] focus:outline-none focus:border-ag-navy"
                  required
                />
              </div>
              <div className="flex-1">
                <label className="font-mono text-[10px] uppercase tracking-widest text-gray-400 block mb-1">
                  Note (facultatif)
                </label>
                <input
                  type="text"
                  maxLength={300}
                  value={note}
                  onChange={e => setNote(e.target.value)}
                  placeholder="Raison du crédit…"
                  className="w-full border border-gray-300 px-3 py-2 font-sans text-[13px] focus:outline-none focus:border-ag-navy"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading || !userId}
                className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest bg-ag-navy text-white px-5 py-3 hover:bg-ag-black transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {loading && <Loader2 size={12} className="animate-spin" />}
                Créditer les mois
              </button>
            </div>

            {msg && (
              <p className={`font-sans text-[12px] ${msg.ok ? 'text-emerald-700' : 'text-red-600'}`}>
                {msg.text}
              </p>
            )}
          </form>
        </div>
      )}
    </div>
  )
}

type ClickStat = {
  expert_id:      string
  first_name:     string
  last_name:      string
  profession:     string
  is_visible:     boolean
  total_clicks:   number
  email_clicks:   number
  website_clicks: number
  last_click_at:  string | null
}

const PERIODS: { key: string; label: string }[] = [
  { key: '1d',  label: '1J'  },
  { key: '1w',  label: '1S'  },
  { key: '1m',  label: '1M'  },
  { key: '3m',  label: '3M'  },
  { key: '6m',  label: '6M'  },
  { key: 'ytd', label: 'AAJ' },
  { key: '1y',  label: '1A'  },
  { key: '2y',  label: '2A'  },
  { key: '5y',  label: '5A'  },
  { key: '10y', label: '10A' },
  { key: 'all', label: 'Tout'},
]

type Props = {
  applications: Application[]
  profiles:     ExpertProfile[]
  clickStats:   ClickStat[]
  tokenQs:      string
  initialPeriod?: string
}

function TractionPanel({
  stats, tokenQs, onRefresh, period, onPeriodChange,
}: {
  stats: ClickStat[]; tokenQs: string; onRefresh: () => void
  period: string; onPeriodChange: (p: string) => void
}) {
  const [open,       setOpen]       = useState(true)
  const [purgingId,  setPurgingId]  = useState<string | null>(null)
  const [purgingAll, setPurgingAll] = useState(false)

  async function purgeClicks(expertId: string, name: string) {
    if (!confirm(`Supprimer tous les clics de ${name} sur cette période ?`)) return
    setPurgingId(expertId)
    await fetch(`/api/admin/experts${tokenQs}`, {
      method:  'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ table: 'expert_contact_clicks', expert_id: expertId }),
    })
    setPurgingId(null)
    onRefresh()
  }

  async function purgeAll() {
    if (!confirm('Supprimer TOUS les clics enregistrés ? Cette action est irréversible.')) return
    setPurgingAll(true)
    await fetch(`/api/admin/experts${tokenQs}`, {
      method:  'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ table: 'expert_contact_clicks', purge_all: true }),
    })
    setPurgingAll(false)
    onRefresh()
  }

  const publishedStats = stats.filter(r => r.is_visible)
  const totalClicks   = publishedStats.reduce((s, r) => s + (r.total_clicks ?? 0), 0)
  const totalAll      = stats.reduce((s, r) => s + (r.total_clicks ?? 0), 0)
  const sorted        = [...stats].sort((a, b) => (b.total_clicks ?? 0) - (a.total_clicks ?? 0))
  const activeExperts = publishedStats.filter(r => (r.total_clicks ?? 0) > 0).length
  const periodLabel   = PERIODS.find(p => p.key === period)?.label ?? period

  return (
    <div className="bg-white border border-gray-200 mb-6">
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <TrendingUp size={14} className="text-ag-apex" />
          <h2 className="font-sans font-bold text-gray-900 text-[14px]">Traction réseau — Suivi des clics fiches</h2>
          {totalClicks > 0 && (
            <span className="font-mono text-[9px] font-bold px-2 py-0.5 bg-ag-apex/10 text-ag-apex border border-ag-apex/30">
              {totalClicks} clics total
            </span>
          )}
        </div>
        {open ? <ChevronUp size={14} className="text-gray-400" /> : <ChevronDown size={14} className="text-gray-400" />}
      </button>

      {open && (
        <div className="px-5 pb-6 border-t border-gray-100">

          {/* Sélecteur de période */}
          <div className="flex flex-wrap items-center gap-2 mt-5 mb-5">
            <span className="font-mono text-[9px] uppercase tracking-widest text-gray-400 mr-1">Période :</span>
            {PERIODS.map(p => (
              <button
                key={p.key}
                onClick={() => onPeriodChange(p.key)}
                className={`font-mono text-[10px] px-2.5 py-1 border transition-colors ${
                  period === p.key
                    ? 'border-ag-navy bg-ag-navy text-white'
                    : 'border-gray-200 text-gray-500 hover:border-gray-400'
                }`}
              >
                {p.label}
              </button>
            ))}
            <button
              onClick={purgeAll}
              disabled={purgingAll || totalAll === 0}
              className="ml-auto flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-widest px-3 py-1.5 border border-red-100 text-red-300 hover:bg-red-50 hover:text-red-500 disabled:opacity-40 transition-colors"
            >
              {purgingAll ? <Loader2 size={9} className="animate-spin" /> : <Trash2 size={9} />}
              Purger tous les clics
            </button>
          </div>

          {/* KPIs globaux */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            {[
              { label: `Clics (${periodLabel})`,   value: totalClicks,   color: 'text-gray-900' },
              { label: 'Fiches publiées',           value: publishedStats.length, color: 'text-blue-700' },
              { label: 'Experts sollicités',        value: activeExperts, color: 'text-ag-apex'  },
              { label: 'Clics total (toutes périodes)', value: totalAll,  color: 'text-emerald-700' },
            ].map(kpi => (
              <div key={kpi.label} className="border border-gray-100 bg-gray-50 p-4">
                <p className={`font-mono text-[22px] font-bold leading-none ${kpi.color}`}>{kpi.value}</p>
                <p className="font-mono text-[9px] uppercase tracking-widest text-gray-400 mt-1.5">{kpi.label}</p>
              </div>
            ))}
          </div>

          {/* Tableau par expert */}
          {sorted.length === 0 ? (
            <p className="font-sans text-[12px] text-gray-400 py-4">Aucun clic enregistré pour l&apos;instant.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-[12px]">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    {['Expert', 'Profession', 'Statut', `Clics (${periodLabel})`, 'Email', 'Site', 'Dernier clic', ''].map(h => (
                      <th key={h} className="text-left px-4 py-2.5 font-mono text-[9px] uppercase tracking-widest text-gray-400 whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {sorted.filter(r => (r.total_clicks ?? 0) > 0).map(r => (
                    <tr key={r.expert_id} className="hover:bg-gray-50/60">
                      <td className="px-4 py-3 font-semibold text-gray-800 whitespace-nowrap">
                        {r.first_name} {r.last_name}
                      </td>
                      <td className="px-4 py-3 font-mono text-[10px] text-ag-apex">{r.profession}</td>
                      <td className="px-4 py-3">
                        <span className={`font-mono text-[9px] uppercase px-2 py-0.5 border ${
                          r.is_visible
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-gray-50 text-gray-400 border-gray-200'
                        }`}>
                          {r.is_visible ? 'Publiée' : 'Masquée'}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-mono font-bold text-gray-900">{r.total_clicks}</td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center gap-1 font-mono text-[10px] text-gray-500">
                          <Mail size={9} /> {r.email_clicks}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center gap-1 font-mono text-[10px] text-gray-500">
                          <Globe size={9} /> {r.website_clicks}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {r.last_click_at ? (
                          <span className="inline-flex items-center gap-1 font-mono text-[10px] text-gray-400">
                            <Clock size={9} />
                            {new Date(r.last_click_at).toLocaleDateString('fr-CH', { day: '2-digit', month: '2-digit', year: '2-digit' })}
                            {' '}
                            {new Date(r.last_click_at).toLocaleTimeString('fr-CH', { hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Zurich' })}
                          </span>
                        ) : '—'}
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => purgeClicks(r.expert_id, `${r.first_name} ${r.last_name}`)}
                          disabled={purgingId === r.expert_id || r.total_clicks === 0}
                          title="Supprimer les clics de cet expert"
                          className="inline-flex items-center gap-1 font-mono text-[9px] uppercase tracking-widest px-2 py-1 border border-red-100 text-red-300 hover:bg-red-50 hover:text-red-500 disabled:opacity-30 transition-colors"
                        >
                          {purgingId === r.expert_id ? <Loader2 size={9} className="animate-spin" /> : <Trash2 size={9} />}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default function ExpertsAdminClient({ applications, profiles, clickStats, tokenQs, initialPeriod }: Props) {
  const [apps,   setApps]   = useState(applications)
  const [profs,  setProfs]  = useState(profiles)
  const [stats,  setStats]  = useState(clickStats)
  const [period, setPeriod] = useState(initialPeriod ?? 'all')
  const [filter, setFilter] = useState<'all' | 'pending' | 'visible' | 'hidden'>('all')
  const router = useRouter()
  const [isRefreshing, startTransition] = useTransition()

  /* Sync state quand router.refresh() pousse de nouvelles props SSR */
  useEffect(() => { setApps(applications) },  [applications])
  useEffect(() => { setProfs(profiles) },     [profiles])
  useEffect(() => { setStats(clickStats) },   [clickStats])

  /* Scroll vers anchor après hydratation (ex: lien notif /admin/experts#expert-xxx) */
  useEffect(() => {
    const hash = window.location.hash
    if (!hash) return
    const el = document.querySelector(hash)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [])

  function refresh(p?: string) {
    void (p ?? period)
    startTransition(() => { router.refresh() })
  }

  async function handlePeriodChange(p: string) {
    setPeriod(p)
    await refresh(p)
  }

  const pendingCount = apps.filter(a => a.status === 'pending').length

  // «En attente / à réviser» : uniquement les fiches soumises par le partenaire
  // et pas encore traitées par un admin (approuvées ou refusées).
  const isPending = (p: ExpertProfile) => p.review_status === 'pending_review'

  const filteredProfs = profs.filter(p => {
    if (filter === 'pending') return isPending(p)
    if (filter === 'visible') return p.is_visible
    if (filter === 'hidden')  return !p.is_visible
    return true
  })

  const statCards = [
    { label: 'Total fiches',         value: profs.length,                          key: 'all' },
    { label: 'En attente / révision', value: profs.filter(p => isPending(p)).length, key: 'pending' },
    { label: 'Publiées',             value: profs.filter(p => p.is_visible).length, key: 'visible' },
    { label: 'Masquées / admin',     value: profs.filter(p => !p.is_visible && !!p.hidden_reason).length, key: 'hidden' },
  ]

  return (
    <main className="min-h-screen bg-gray-50 p-6 md:p-10">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="mb-8 flex items-end justify-between">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-widest text-gray-400 mb-1">Aegryn Admin</p>
            <h1 className="text-[26px] font-bold text-gray-900 tracking-tight">Réseau d&apos;experts</h1>
          </div>
          <button
            onClick={() => refresh()}
            disabled={isRefreshing}
            className="font-mono text-[9px] uppercase tracking-widest text-gray-400 border border-gray-200 px-3 py-1.5 hover:border-gray-400 disabled:opacity-50 transition-colors"
          >
            {isRefreshing ? 'Chargement…' : 'Actualiser'}
          </button>
        </div>

        {/* Section 1 — Candidatures formulaire */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <h2 className="font-sans font-bold text-gray-900 text-[15px]">Candidatures formulaire</h2>
            {pendingCount > 0 && (
              <span className="bg-red-500 text-white font-mono text-[9px] font-bold px-2 py-0.5">
                {pendingCount} en attente
              </span>
            )}
          </div>

          {apps.length === 0 ? (
            <p className="font-sans text-[12px] text-gray-400 border border-gray-200 bg-white px-5 py-4">Aucune candidature.</p>
          ) : (
            <div className="flex flex-col gap-2">
              {apps.map(app => (
                <ApplicationRow key={app.id} app={app} tokenQs={tokenQs} onRefresh={refresh} />
              ))}
            </div>
          )}
        </div>

        {/* Section 2 — Fiches experts */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <h2 className="font-sans font-bold text-gray-900 text-[15px]">Fiches experts</h2>
            {profs.filter(p => isPending(p)).length > 0 && (
              <span className="bg-orange-500 text-white font-mono text-[9px] font-bold px-2 py-0.5">
                {profs.filter(p => isPending(p)).length} à réviser
              </span>
            )}
          </div>

          {/* Stat cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
            {statCards.map(c => (
              <button
                key={c.key}
                onClick={() => setFilter(c.key as typeof filter)}
                className={`border p-4 text-left transition-colors ${
                  filter === c.key
                    ? 'border-gray-900 bg-white'
                    : 'border-gray-200 bg-white hover:border-gray-400'
                }`}
              >
                <p className="font-mono text-[9px] uppercase tracking-widest text-gray-400 mb-1">{c.label}</p>
                <p className="font-mono text-[22px] font-bold text-gray-900 leading-none">{c.value}</p>
              </button>
            ))}
          </div>

          {filteredProfs.length === 0 ? (
            <p className="font-sans text-[12px] text-gray-400 border border-gray-200 bg-white px-5 py-4">Aucune fiche.</p>
          ) : (
            <div className="flex flex-col gap-2">
              {filteredProfs.map(p => (
                <ProfileRow key={p.id} profile={p} tokenQs={tokenQs} onRefresh={refresh} />
              ))}
            </div>
          )}
        </div>

        {/* Section 3 — Attribution manuelle abonnement */}
        <AdminSubscriptionPanel profiles={profs} />

        <div className="mb-10" />

        {/* Section 4 — Traction réseau (clics) */}
        <TractionPanel
          stats={stats}
          tokenQs={tokenQs}
          onRefresh={refresh}
          period={period}
          onPeriodChange={handlePeriodChange}
        />

      </div>
    </main>
  )
}
