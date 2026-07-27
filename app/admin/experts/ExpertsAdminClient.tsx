'use client'

import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'

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
  verified_at:   string | null
  created_at:    string
  profile: {
    email:              string
    roles:              string[]
    expert_plan:        string | null
    expert_plan_start:  string | null
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

  async function patchProfile(updates: Record<string, unknown>) {
    setLoading(true)
    await fetch(`/api/admin/experts${tokenQs}`, {
      method:  'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ table: 'expert_profiles', id: profile.id, ...updates }),
    })
    setLoading(false)
    onRefresh()
  }

  async function patchPlan(plan: 'active' | 'suspended' | null) {
    if (!profile.user_id) return
    setLoading(true)
    await fetch(`/api/admin/experts${tokenQs}`, {
      method:  'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ table: 'expert_plan', id: profile.user_id, plan }),
    })
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

  const plan = profile.profile?.expert_plan ?? null

  return (
    <div className="border border-gray-200 bg-white">
      <div
        className="flex items-center justify-between gap-4 px-5 py-4 cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={() => setExpanded(e => !e)}
      >
        <div className="flex items-center gap-4 min-w-0">
          <span className={`font-mono text-[9px] uppercase tracking-widest px-2 py-0.5 border ${
            profile.is_visible ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-gray-50 text-gray-400 border-gray-200'
          }`}>
            {profile.is_visible ? 'Publiée' : 'Masquée'}
          </span>
          <span className={`font-mono text-[9px] uppercase tracking-widest px-2 py-0.5 border ${
            plan === 'active' ? 'bg-ag-apex/10 text-ag-apex border-ag-apex/30' : 'bg-amber-50 text-amber-600 border-amber-200'
          }`}>
            {plan === 'active' ? 'Plan actif' : 'Sans plan'}
          </span>
          <span className="font-sans font-semibold text-[13px] text-gray-900 truncate">
            {profile.first_name} {profile.last_name}
          </span>
          <span className="font-mono text-[10px] text-ag-apex shrink-0 hidden sm:block">{profile.profession}</span>
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
          <div className="flex flex-wrap gap-2 mb-3">
            {!profile.is_visible && (
              <button onClick={() => patchProfile({ is_visible: true })} disabled={loading}
                className="font-mono text-[9px] uppercase tracking-widest px-3 py-1.5 border border-emerald-200 text-emerald-700 hover:bg-emerald-50 disabled:opacity-50 transition-colors">
                ✓ Approuver la fiche
              </button>
            )}
            {profile.is_visible && (
              <button onClick={() => patchProfile({ is_visible: false, hidden_reason: 'admin_hidden', skip_email: true })} disabled={loading}
                className="font-mono text-[9px] uppercase tracking-widest px-3 py-1.5 border border-gray-200 text-gray-500 hover:border-gray-400 disabled:opacity-50 transition-colors">
                Masquer (silencieux)
              </button>
            )}
            <button onClick={() => setShowRefuse(v => !v)} disabled={loading}
              className="font-mono text-[9px] uppercase tracking-widest px-3 py-1.5 border border-red-200 text-red-600 hover:bg-red-50 disabled:opacity-50 transition-colors">
              Refuser avec motif
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
                onClick={() => { patchProfile({ is_visible: false, hidden_reason: refuseReason }); setShowRefuse(false) }}
                disabled={loading || !refuseReason}
                className="font-mono text-[9px] uppercase tracking-widest px-3 py-2 bg-red-500 text-white hover:bg-red-600 disabled:opacity-50 transition-colors"
              >
                Confirmer
              </button>
            </div>
          )}

          {/* Actions plan */}
          <div className="flex flex-wrap gap-2 pt-3 border-t border-gray-100">
            <p className="w-full font-mono text-[9px] uppercase tracking-widest text-gray-300 mb-1">Abonnement</p>
            {plan !== 'active' && (
              <button onClick={() => patchPlan('active')} disabled={loading}
                className="font-mono text-[9px] uppercase tracking-widest px-3 py-1.5 border border-ag-apex/30 text-ag-apex hover:bg-ag-apex/10 disabled:opacity-50 transition-colors">
                Activer plan
              </button>
            )}
            {plan === 'active' && (
              <button onClick={() => patchPlan('suspended')} disabled={loading}
                className="font-mono text-[9px] uppercase tracking-widest px-3 py-1.5 border border-amber-200 text-amber-600 hover:bg-amber-50 disabled:opacity-50 transition-colors">
                Suspendre plan
              </button>
            )}
            {plan && (
              <button onClick={() => patchPlan(null)} disabled={loading}
                className="font-mono text-[9px] uppercase tracking-widest px-3 py-1.5 border border-gray-200 text-gray-400 hover:border-gray-400 disabled:opacity-50 transition-colors">
                Annuler plan
              </button>
            )}
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

type Props = {
  applications: Application[]
  profiles:     ExpertProfile[]
  tokenQs:      string
}

export default function ExpertsAdminClient({ applications, profiles, tokenQs }: Props) {
  const [apps,     setApps]     = useState(applications)
  const [profs,    setProfs]    = useState(profiles)
  const [filter,   setFilter]   = useState<'all' | 'pending' | 'visible' | 'hidden'>('all')
  const [loading,  setLoading]  = useState(false)

  async function refresh() {
    setLoading(true)
    const res  = await fetch(`/api/admin/experts${tokenQs}`)
    const data = await res.json()
    setApps(data.applications  ?? [])
    setProfs(data.profiles ?? [])
    setLoading(false)
  }

  const pendingCount = apps.filter(a => a.status === 'pending').length

  const filteredProfs = profs.filter(p => {
    if (filter === 'pending') return !p.is_visible && !p.hidden_reason
    if (filter === 'visible') return p.is_visible
    if (filter === 'hidden')  return !p.is_visible
    return true
  })

  const statCards = [
    { label: 'Total fiches',     value: profs.length,                        key: 'all' },
    { label: 'En attente',       value: profs.filter(p => !p.is_visible && !p.hidden_reason).length, key: 'pending' },
    { label: 'Publiées',         value: profs.filter(p => p.is_visible).length,  key: 'visible' },
    { label: 'Masquées / admin', value: profs.filter(p => !p.is_visible).length, key: 'hidden' },
  ]

  return (
    <main className="min-h-screen bg-gray-50 p-6 md:p-10">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="mb-8 flex items-end justify-between">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-widest text-gray-400 mb-1">AEGRYN Admin</p>
            <h1 className="text-[26px] font-bold text-gray-900 tracking-tight">Réseau d&apos;experts</h1>
          </div>
          <button
            onClick={refresh}
            disabled={loading}
            className="font-mono text-[9px] uppercase tracking-widest text-gray-400 border border-gray-200 px-3 py-1.5 hover:border-gray-400 disabled:opacity-50 transition-colors"
          >
            {loading ? 'Chargement…' : 'Actualiser'}
          </button>
        </div>

        {/* Section 1 — Candidatures */}
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
        <div>
          <h2 className="font-sans font-bold text-gray-900 text-[15px] mb-4">Fiches experts</h2>

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

      </div>
    </main>
  )
}
