'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { useCallback, useState, useTransition } from 'react'
import { Trash2, CheckSquare, Square, Loader2 } from 'lucide-react'

const SOURCES = [
  { key: 'valuation',      label: 'Valuation'       },
  { key: 'catalog',        label: 'Catalogue'       },
  // assessment: archivé — API retourne 410, aucun nouveau lead possible
  { key: 'alliances',      label: 'Alliances'       },
  { key: 'prospects',      label: 'Waitlist Session'},
  { key: 'auction_access', label: 'Accès Catalogue' },
] as const

const GRADES   = ['all', '★', 'AAA', 'AA', 'A', 'B', 'NG'] as const
const STATUSES = ['all', 'new', 'pending', 'contacted', 'confirmed', 'submitted', 'closed', 'reviewed', 'accepted', 'declined'] as const

function fmtEur(n: unknown) {
  if (!n || typeof n !== 'number') return '—'
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)} M€`
  if (n >= 1_000)     return `${(n / 1_000).toFixed(0)} K€`
  return `${Math.round(n)} €`
}

function gradeColor(g: string) {
  return g === '★'  ? 'bg-emerald-100 text-emerald-800'
    : g === 'AAA'   ? 'bg-blue-100 text-blue-800'
    : g === 'AA'    ? 'bg-green-100 text-green-800'
    : g === 'A'     ? 'bg-yellow-100 text-yellow-800'
    : g === 'B'     ? 'bg-gray-100 text-gray-700'
    : 'bg-red-50 text-red-600'
}

function statusColor(s: string) {
  return s === 'new' || s === 'pending'   ? 'bg-blue-50 text-blue-700'
    : s === 'contacted' || s === 'reviewed' ? 'bg-yellow-50 text-yellow-700'
    : s === 'confirmed' || s === 'submitted' || s === 'accepted' ? 'bg-emerald-50 text-emerald-700'
    : 'bg-gray-100 text-gray-500'
}

function fmtDate(d: unknown) {
  if (!d || typeof d !== 'string') return '—'
  return new Date(d).toLocaleDateString('fr-CH', { day: '2-digit', month: '2-digit', year: '2-digit' })
}

/* ── Tables par source ── */
function ValuationTable({ rows, onDelete }: { rows: Record<string, unknown>[]; onDelete: (id: string) => void }) {
  if (!rows.length) return <EmptyState />
  return (
    <table className="w-full text-[12px] bg-white border border-gray-200">
      <thead className="bg-gray-50 border-b border-gray-200">
        <tr>{['Date','Email','Grade','Score /100','ARR','Valorisation','Statut','Locale',''].map(h => <Th key={h}>{h}</Th>)}</tr>
      </thead>
      <tbody className="divide-y divide-gray-100">
        {rows.map((r, i) => (
          <tr key={i} className="hover:bg-gray-50">
            <Td mono>{fmtDate(r.created_at)}</Td>
            <Td><a href={`mailto:${r.email}`} className="hover:text-blue-600">{String(r.email)}</a></Td>
            <Td><span className={`px-2 py-0.5 text-[11px] font-bold ${gradeColor(String(r.estimated_grade ?? ''))}`}>{String(r.estimated_grade ?? '—')}</span></Td>
            <Td mono>{String(r.score_total ?? '—')}</Td>
            <Td>{r.pre_revenue ? <em className="text-gray-400">pre-rev</em> : fmtEur(r.arr)}</Td>
            <Td>{r.valuation_low && r.valuation_high ? `${fmtEur(r.valuation_low)} — ${fmtEur(r.valuation_high)}` : '—'}</Td>
            <Td><span className={`px-2 py-0.5 text-[10px] font-semibold uppercase ${statusColor(String(r.status ?? ''))}`}>{String(r.status ?? '—')}</span></Td>
            <Td mono small>{String(r.locale ?? '—')}</Td>
            <td className="px-4 py-3">
              <button onClick={() => onDelete(String(r.id))} className="text-[10px] text-red-400 hover:text-red-700 font-mono transition-colors">
                <Trash2 size={11} />
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

function InviteButton({
  id, email, profileType, table,
}: {
  id: string
  email: string
  profileType?: string
  table?: 'catalog_waitlist' | 'prospects' | 'auction_access_requests'
}) {
  const router = useRouter()
  const [state, setState] = useState<'idle' | 'loading' | 'done' | 'error'>('idle')

  /* Partenaire → pas de magic link, lien admin manuel */
  if (profileType === 'partner') {
    return (
      <a
        href={`/admin/members/new?email=${encodeURIComponent(email)}`}
        className="px-3 py-1 text-[10px] font-semibold uppercase tracking-wide border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white transition-colors whitespace-nowrap"
      >
        Créer membre
      </a>
    )
  }

  const role = profileType === 'seller' ? 'seller' : 'buyer'
  const waitlistField = table === 'prospects' ? 'prospectId' : 'waitlistId'

  async function onInvite() {
    const roleLabel = role === 'seller' ? 'cédant' : 'acquéreur'
    if (!confirm(`Créer un compte ${roleLabel} pour ${email} et envoyer l'invitation par email ?`)) return
    setState('loading')
    try {
      const res = await fetch('/api/client/invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, role, [waitlistField]: id }),
      })
      if (res.ok) {
        setState('done')
        router.refresh()
      } else {
        setState('error')
      }
    } catch {
      setState('error')
    }
  }

  if (state === 'done') return <span className="text-[10px] font-semibold text-emerald-600">Invité ✓</span>

  return (
    <button
      onClick={onInvite}
      disabled={state === 'loading'}
      className="px-3 py-1 text-[10px] font-semibold uppercase tracking-wide border border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white transition-colors disabled:opacity-50 whitespace-nowrap"
    >
      {state === 'loading' ? '...' : state === 'error' ? 'Réessayer' : 'Inviter'}
    </button>
  )
}

function CatalogTable({ rows, onDelete }: { rows: Record<string, unknown>[]; onDelete: (id: string) => void }) {
  if (!rows.length) return <EmptyState />
  return (
    <table className="w-full text-[12px] bg-white border border-gray-200">
      <thead className="bg-gray-50 border-b border-gray-200">
        <tr>{['Date','Email','Type','Capacité','Secteurs','Statut','Action',''].map(h => <Th key={h}>{h}</Th>)}</tr>
      </thead>
      <tbody className="divide-y divide-gray-100">
        {rows.map((r, i) => (
          <tr key={i} className="hover:bg-gray-50">
            <Td mono>{fmtDate(r.created_at)}</Td>
            <Td><a href={`mailto:${r.email}`} className="hover:text-blue-600">{String(r.email)}</a></Td>
            <Td>{String(r.acquirer_type ?? '—')}</Td>
            <Td>{String(r.capacity_range ?? '—')}</Td>
            <Td small>{Array.isArray(r.sectors_interest) ? r.sectors_interest.join(', ') : '—'}</Td>
            <Td><span className={`px-2 py-0.5 text-[10px] font-semibold uppercase ${statusColor(String(r.status ?? ''))}`}>{String(r.status ?? '—')}</span></Td>
            <Td>
              {r.status === 'converted'
                ? <span className="text-[10px] font-semibold text-emerald-600">Invité ✓</span>
                : <InviteButton id={String(r.id)} email={String(r.email)} />}
            </Td>
            <td className="px-4 py-3">
              <button onClick={() => onDelete(String(r.id))} className="text-red-400 hover:text-red-700 transition-colors"><Trash2 size={11} /></button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

function AssessmentTable({ rows, onDelete }: { rows: Record<string, unknown>[]; onDelete: (id: string) => void }) {
  if (!rows.length) return <EmptyState />
  return (
    <table className="w-full text-[12px] bg-white border border-gray-200">
      <thead className="bg-gray-50 border-b border-gray-200">
        <tr>{['Date','Nom','Email','Entreprise','Ville','Format','ARR','Statut',''].map(h => <Th key={h}>{h}</Th>)}</tr>
      </thead>
      <tbody className="divide-y divide-gray-100">
        {rows.map((r, i) => (
          <tr key={i} className="hover:bg-gray-50">
            <Td mono>{fmtDate(r.created_at)}</Td>
            <Td>{String(r.name ?? '—')}</Td>
            <Td><a href={`mailto:${r.email}`} className="hover:text-blue-600">{String(r.email)}</a></Td>
            <Td>{String(r.company ?? '—')}</Td>
            <Td>{String(r.preferred_city ?? '—')}</Td>
            <Td>{String(r.preferred_format ?? '—')}</Td>
            <Td>{String(r.arr_range ?? '—')}</Td>
            <Td><span className={`px-2 py-0.5 text-[10px] font-semibold uppercase ${statusColor(String(r.status ?? ''))}`}>{String(r.status ?? '—')}</span></Td>
            <td className="px-4 py-3">
              <button onClick={() => onDelete(String(r.id))} className="text-red-400 hover:text-red-700 transition-colors"><Trash2 size={11} /></button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

function ProspectsTable({ rows, onDelete }: { rows: Record<string, unknown>[]; onDelete: (id: string) => void }) {
  if (!rows.length) return <EmptyState />
  const PROFILE_LABELS: Record<string, string> = { buyer: 'Acquéreur', seller: 'Cédant', partner: 'Partenaire', undecided: 'Non défini' }
  return (
    <table className="w-full text-[12px] bg-white border border-gray-200">
      <thead className="bg-gray-50 border-b border-gray-200">
        <tr>{['Date','Nom','Email','Profil','Ticket','Secteurs','Marketing','Statut','Action',''].map(h => <Th key={h}>{h}</Th>)}</tr>
      </thead>
      <tbody className="divide-y divide-gray-100">
        {rows.map((r, i) => (
          <tr key={i} className="hover:bg-gray-50">
            <Td mono>{fmtDate(r.created_at)}</Td>
            <Td>{[r.first_name, r.last_name].filter(Boolean).join(' ') || '—'}</Td>
            <Td><a href={`mailto:${r.email}`} className="hover:text-blue-600">{String(r.email)}</a></Td>
            <Td><span className="px-2 py-0.5 bg-gray-100 text-gray-700 text-[10px] font-semibold uppercase">{PROFILE_LABELS[String(r.profile_type ?? '')] ?? String(r.profile_type ?? '—')}</span></Td>
            <Td>{String(r.ticket_range ?? '—')}</Td>
            <Td small>{Array.isArray(r.sectors_interest) ? r.sectors_interest.join(', ') : '—'}</Td>
            <Td>{r.marketing_consent ? '✓' : '—'}</Td>
            <Td><span className={`px-2 py-0.5 text-[10px] font-semibold uppercase ${statusColor(String(r.status ?? ''))}`}>{String(r.status ?? '—')}</span></Td>
            <Td>
              {r.status === 'converted' || r.status === 'invited'
                ? <span className="text-[10px] font-semibold text-emerald-600">{r.status === 'invited' ? 'Invité ✓' : 'Converti ✓'}</span>
                : <InviteButton id={String(r.id)} email={String(r.email)} profileType={String(r.profile_type ?? '')} table="prospects" />}
            </Td>
            <td className="px-4 py-3">
              <button onClick={() => onDelete(String(r.id))} className="text-red-400 hover:text-red-700 transition-colors"><Trash2 size={11} /></button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

function ApproveAccessButton({ id, email }: { id: string; email: string }) {
  const router = useRouter()
  const [state, setState] = useState<'idle' | 'loading' | 'done' | 'error'>('idle')

  async function onApprove() {
    if (!confirm(`Approuver l'accès catalogue pour ${email} et envoyer un lien d'accès ?`)) return
    setState('loading')
    try {
      const res = await fetch('/api/client/invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, role: 'buyer', accessRequestId: id }),
      })
      if (res.ok) {
        setState('done')
        router.refresh()
      } else {
        setState('error')
      }
    } catch {
      setState('error')
    }
  }

  if (state === 'done') return <span className="text-[10px] font-semibold text-emerald-600">Approuvé ✓</span>

  return (
    <button
      onClick={onApprove}
      disabled={state === 'loading'}
      className="px-3 py-1 text-[10px] font-semibold uppercase tracking-wide border border-emerald-700 text-emerald-700 hover:bg-emerald-700 hover:text-white transition-colors disabled:opacity-50 whitespace-nowrap"
    >
      {state === 'loading' ? '...' : state === 'error' ? 'Réessayer' : 'Approuver'}
    </button>
  )
}

function TransactionAccessTable({ rows, onDelete }: { rows: Record<string, unknown>[]; onDelete: (id: string) => void }) {
  if (!rows.length) return <EmptyState />
  const BUYER_LABELS: Record<string, string> = { pe: 'PE/VC', strategic: 'Stratégique', family_office: 'Family Office', individual: 'Particulier' }
  return (
    <table className="w-full text-[12px] bg-white border border-gray-200">
      <thead className="bg-gray-50 border-b border-gray-200">
        <tr>{['Date','Nom','Email','Société','Profil','Capacité','Message','Statut','Action',''].map(h => <Th key={h}>{h}</Th>)}</tr>
      </thead>
      <tbody className="divide-y divide-gray-100">
        {rows.map((r, i) => (
          <tr key={i} className="hover:bg-gray-50">
            <Td mono>{fmtDate(r.created_at)}</Td>
            <Td>{String(r.full_name ?? '—')}</Td>
            <Td><a href={`mailto:${r.email}`} className="hover:text-blue-600">{String(r.email)}</a></Td>
            <Td>{String(r.company ?? '—')}</Td>
            <Td><span className="px-2 py-0.5 bg-gray-100 text-gray-700 text-[10px] font-semibold uppercase">{BUYER_LABELS[String(r.buyer_type ?? '')] ?? String(r.buyer_type ?? '—')}</span></Td>
            <Td>{String(r.capacity ?? '—')}</Td>
            <Td small>{r.message ? String(r.message).slice(0, 60) + (String(r.message).length > 60 ? '…' : '') : '—'}</Td>
            <Td><span className={`px-2 py-0.5 text-[10px] font-semibold uppercase ${statusColor(String(r.status ?? ''))}`}>{String(r.status ?? '—')}</span></Td>
            <Td>
              {r.status === 'approved'
                ? <span className="text-[10px] font-semibold text-emerald-600">Approuvé ✓</span>
                : <ApproveAccessButton id={String(r.id)} email={String(r.email)} />}
            </Td>
            <td className="px-4 py-3">
              <button onClick={() => onDelete(String(r.id))} className="text-red-400 hover:text-red-700 transition-colors"><Trash2 size={11} /></button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

function AlliancesTable({ rows, onDelete }: { rows: Record<string, unknown>[]; onDelete: (id: string) => void }) {
  if (!rows.length) return <EmptyState />
  return (
    <table className="w-full text-[12px] bg-white border border-gray-200">
      <thead className="bg-gray-50 border-b border-gray-200">
        <tr>{['Date','Organisation','Type','Email','Pays','Statut',''].map(h => <Th key={h}>{h}</Th>)}</tr>
      </thead>
      <tbody className="divide-y divide-gray-100">
        {rows.map((r, i) => (
          <tr key={i} className="hover:bg-gray-50">
            <Td mono>{fmtDate(r.created_at)}</Td>
            <Td>{String(r.organization_name ?? '—')}</Td>
            <Td><span className="px-2 py-0.5 bg-gray-100 text-gray-700 text-[10px] font-semibold uppercase">{String(r.alliance_type ?? '—')}</span></Td>
            <Td><a href={`mailto:${r.email}`} className="hover:text-blue-600">{String(r.email)}</a></Td>
            <Td>{String(r.country ?? '—')}</Td>
            <Td><span className={`px-2 py-0.5 text-[10px] font-semibold uppercase ${statusColor(String(r.status ?? ''))}`}>{String(r.status ?? '—')}</span></Td>
            <td className="px-4 py-3">
              <button onClick={() => onDelete(String(r.id))} className="text-red-400 hover:text-red-700 transition-colors"><Trash2 size={11} /></button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

/* ── Micro-composants ── */
function Th({ children }: { children: React.ReactNode }) {
  return <th className="text-left px-4 py-3 text-[10px] font-semibold uppercase tracking-widest text-gray-500 whitespace-nowrap">{children}</th>
}
function Td({ children, mono, small }: { children: React.ReactNode; mono?: boolean; small?: boolean }) {
  return <td className={`px-4 py-3 ${mono ? 'font-mono' : ''} ${small ? 'text-[10px]' : ''} text-gray-700`}>{children}</td>
}
function EmptyState() {
  return (
    <div className="bg-white border border-gray-200 p-12 text-center">
      <p className="text-[13px] text-gray-400">Aucun enregistrement.</p>
    </div>
  )
}

/* ── Main client component ── */
export default function AdminLeadsClient({
  rows: initialRows, source, counts, currentGrade, currentStatus,
}: {
  rows: Record<string, unknown>[]
  source: string
  counts: Record<string, number>
  currentGrade: string
  currentStatus: string
}) {
  const router   = useRouter()
  const pathname = usePathname()
  const sp       = useSearchParams()
  const [, startTransition] = useTransition()

  const [rows, setRows]       = useState<Record<string, unknown>[]>(initialRows)
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [deleting, setDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState<string | null>(null)

  const allIds = rows.map(r => String(r.id))
  const allSelected = allIds.length > 0 && allIds.every(id => selected.has(id))

  function toggleAll() {
    setSelected(allSelected ? new Set() : new Set(allIds))
  }
  async function deleteSelected() {
    const ids = [...selected]
    if (!ids.length) return
    if (!window.confirm(`Supprimer définitivement ${ids.length} enregistrement${ids.length > 1 ? 's' : ''} ? Action irréversible.`)) return
    setDeleting(true)
    setDeleteError(null)
    try {
      const res = await fetch(`/api/admin/leads`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ source, ids }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error ?? 'Erreur inconnue')
      setRows(prev => prev.filter(r => !ids.includes(String(r.id))))
      setSelected(new Set())
      startTransition(() => router.refresh())
    } catch (e) {
      setDeleteError(e instanceof Error ? e.message : 'Erreur inconnue')
    } finally {
      setDeleting(false)
    }
  }

  async function deleteOne(id: string) {
    if (!window.confirm('Supprimer cet enregistrement ? Action irréversible.')) return
    setDeleting(true)
    setDeleteError(null)
    try {
      const res = await fetch(`/api/admin/leads`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ source, ids: [id] }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error ?? 'Erreur inconnue')
      setRows(prev => prev.filter(r => String(r.id) !== id))
      setSelected(prev => { const n = new Set(prev); n.delete(id); return n })
      startTransition(() => router.refresh())
    } catch (e) {
      setDeleteError(e instanceof Error ? e.message : 'Erreur inconnue')
    } finally {
      setDeleting(false)
    }
  }

  const nav = useCallback((key: string, val: string) => {
    const p = new URLSearchParams(sp.toString())
    p.set(key, val)
    p.delete('token')
    setSelected(new Set())
    router.push(`${pathname}?${p.toString()}`)
  }, [sp, router, pathname])

  return (
    <div className="flex flex-col gap-6">

      {/* Source tabs */}
      <div className="flex flex-wrap gap-2">
        {SOURCES.map(({ key, label }) => {
          const pending = counts[key] ?? 0
          return (
            <button key={key} onClick={() => nav('source', key)}
              title={pending > 0 ? `${pending} lead${pending > 1 ? 's' : ''} non traité${pending > 1 ? 's' : ''}` : 'Aucun lead en attente'}
              className={`px-5 py-2.5 text-[12px] font-semibold border transition-colors flex items-center gap-2 ${
                source === key ? 'bg-gray-900 text-white border-gray-900' : 'border-gray-200 text-gray-600 hover:border-gray-400 bg-white'
              }`}>
              {label}
              {pending > 0 ? (
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                  source === key ? 'bg-red-500 text-white' : 'bg-red-100 text-red-700'
                }`}>
                  {pending}
                </span>
              ) : (
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                  source === key ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-400'
                }`}>
                  ✓
                </span>
              )}
            </button>
          )
        })}
      </div>

      {/* Filtres grade (valuation only) + statut */}
      <div className="flex flex-wrap gap-6 bg-white border border-gray-200 p-4">
        {source === 'valuation' && (
          <div className="flex flex-col gap-1.5">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">Grade</p>
            <div className="flex flex-wrap gap-1.5">
              {GRADES.map(g => (
                <button key={g} onClick={() => nav('grade', g)}
                  className={`px-3 py-1 text-[11px] font-semibold border transition-colors ${
                    currentGrade === g ? 'bg-gray-900 text-white border-gray-900' : 'border-gray-200 text-gray-600 hover:border-gray-400'
                  }`}>{g === 'all' ? 'Tous' : g}</button>
              ))}
            </div>
          </div>
        )}
        <div className="flex flex-col gap-1.5">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">Statut</p>
          <div className="flex flex-wrap gap-1.5">
            {STATUSES.map(s => (
              <button key={s} onClick={() => nav('status', s)}
                className={`px-3 py-1 text-[11px] font-semibold border transition-colors ${
                  currentStatus === s ? 'bg-gray-900 text-white border-gray-900' : 'border-gray-200 text-gray-600 hover:border-gray-400'
                }`}>{s === 'all' ? 'Tous' : s}</button>
            ))}
          </div>
        </div>
        <div className="ml-auto self-end font-mono text-[11px] text-gray-400">
          {rows.length} résultat{rows.length !== 1 ? 's' : ''}
        </div>
      </div>

      {/* Barre sélection + suppression */}
      {rows.length > 0 && (
        <div className="flex items-center gap-3 bg-white border border-gray-200 px-4 py-2.5">
          <button onClick={toggleAll} className="flex items-center gap-1.5 font-mono text-[10px] text-gray-500 hover:text-gray-800">
            {allSelected
              ? <CheckSquare size={14} className="text-red-600" />
              : <Square size={14} />}
            {allSelected ? 'Tout désélectionner' : 'Tout sélectionner'}
          </button>
          {selected.size > 0 && (
            <>
              <span className="font-mono text-[11px] text-red-700 font-semibold">
                {selected.size} sélectionné{selected.size > 1 ? 's' : ''}
              </span>
              <button
                onClick={deleteSelected}
                disabled={deleting}
                className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest text-white bg-red-600 hover:bg-red-700 px-3 py-1.5 transition-colors disabled:opacity-50"
              >
                {deleting ? <Loader2 size={11} className="animate-spin" /> : <Trash2 size={11} />}
                Supprimer
              </button>
              <button onClick={() => setSelected(new Set())} className="font-mono text-[10px] text-red-400 hover:text-red-600 underline">
                Annuler
              </button>
            </>
          )}
          <span className="ml-auto font-mono text-[11px] text-gray-400">{rows.length} enregistrement{rows.length !== 1 ? 's' : ''}</span>
        </div>
      )}

      {deleteError && (
        <div className="bg-red-50 border border-red-200 px-4 py-3 text-[12px] text-red-700">{deleteError}</div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        {source === 'valuation'      && <ValuationTable    rows={rows} onDelete={deleteOne} />}
        {source === 'catalog'        && <CatalogTable      rows={rows} onDelete={deleteOne} />}
        {source === 'assessment'     && <AssessmentTable   rows={rows} onDelete={deleteOne} />}
        {source === 'alliances'      && <AlliancesTable    rows={rows} onDelete={deleteOne} />}
        {source === 'prospects'      && <ProspectsTable    rows={rows} onDelete={deleteOne} />}
        {source === 'auction_access' && <TransactionAccessTable rows={rows} onDelete={deleteOne} />}
      </div>

    </div>
  )
}
