'use client'

import { useState } from 'react'
import Link from 'next/link'
import { CheckCircle2, XCircle, AlertTriangle, ChevronRight, FileText, Clock, Check, X, MessageSquare } from 'lucide-react'

// ─── Types ────────────────────────────────────────────────────────────────────

type TRSLevel = 'ready' | 'conditional' | 'remediation' | 'blocked'

type Recommendation = {
  subcode: string
  priority: 'blocking' | 'high' | 'medium' | 'low'
  action: string
  effort?: string
  impact?: string
}

type DeltaScores = { code: number; ip: number; finance: number; security: number; total: number }
export type Delta = {
  scoresDelta?: DeltaScores
  gradeBefore?: string | null
  gradeAfter?: string | null
  trsBefore?: string | null
  trsAfter?: string | null
}

type AssessmentVersion = {
  version_number: number
  computed_grade: string | null
  computed_score: number | null
  trs: string | null
  delta: Delta | null
  created_at: string | null
}

type TermSheetStatus = 'pending' | 'viewed' | 'accepted' | 'refused' | 'countered' | 'expired'

type TermSheet = {
  id: string
  buyer_rank: number
  version: number
  status: TermSheetStatus
  proposed_price_chf: number
  structure: string
  price_comment: string | null
  earnout: Record<string, unknown> | null
  management_contract: Record<string, unknown> | null
  non_compete: Record<string, unknown> | null
  warranties: Record<string, unknown> | null
  dd_duration_days: number | null
  closing_weeks: number | null
  conditions_precedent: string[] | null
  buyer_profile_note: string | null
  expires_at: string
  seller_response_note: string | null
  created_at: string
}

type DataRoomDoc = {
  id: string
  document_code: string
  file_name: string
  uploaded_at: string
  buyer_visibility: string
  admin_quality: string
}

type SectorBenchmark = {
  sector: string
  arr_multiple_median: number | null
  arr_multiple_top_quartile: number | null
  sample_size: number | null
  source: string | null
}

type Assessment = {
  computed_grade: string | null
  computed_score: number | null
  trs: TRSLevel | null
  trs_reasons: string[] | null
  recommendations: Recommendation[] | null
  dimensions: {
    code?:     { score?: number }
    ip?:       { score?: number }
    finance?:  { score?: number }
    security?: { score?: number }
  } | null
  grade_ceiling?: string | null
}

type Props = {
  assetId: string
  assetAegGrade: string | null
  assetArr: number | null
  assetAskingPrice: number | null
  assetSector: string | null
  auctionReady: boolean
  auctionReadyBlockers: string[] | null
  assessment: Assessment | null
  allVersions: AssessmentVersion[]
  docs: DataRoomDoc[]
  benchmark: SectorBenchmark | null
  termSheets: TermSheet[]
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

const GRADE_LABEL: Record<string, string> = {
  star: 'AEG ★', aaa: 'AAA', aa: 'AA', a: 'A', b: 'B', refused: 'Refusé',
}
const GRADE_CLS: Record<string, string> = {
  star:    'text-emerald-700 bg-emerald-50 border-emerald-300',
  aaa:     'text-yellow-700 bg-yellow-50 border-yellow-300',
  aa:      'text-slate-700 bg-slate-50 border-slate-300',
  a:       'text-blue-700 bg-blue-50 border-blue-300',
  b:       'text-orange-700 bg-orange-50 border-orange-300',
  refused: 'text-red-700 bg-red-50 border-red-300',
}
const TRS_META: Record<string, { label: string; cls: string; desc: string }> = {
  ready:       { label: 'Prêt à transiger',            cls: 'text-emerald-700 bg-emerald-50 border-emerald-300', desc: 'Votre actif remplit toutes les conditions pour entrer en session de transaction.' },
  conditional: { label: 'Conditionnel — actions requises', cls: 'text-amber-700 bg-amber-50 border-amber-300', desc: 'Des actions restent à réaliser avant que la transaction puisse démarrer.' },
  remediation: { label: 'Remédiation nécessaire',      cls: 'text-orange-700 bg-orange-50 border-orange-300', desc: 'Des points bloquants doivent être résolus avant mise en marché.' },
  blocked:     { label: 'Transaction bloquée',         cls: 'text-red-700 bg-red-50 border-red-300', desc: 'La transaction est bloquée. Une action immédiate est requise.' },
}
const PRIORITY_META: Record<string, { label: string; cls: string }> = {
  blocking: { label: 'Bloquant',    cls: 'text-red-700 bg-red-50 border-red-300' },
  high:     { label: 'Prioritaire', cls: 'text-orange-700 bg-orange-50 border-orange-300' },
  medium:   { label: 'À traiter',   cls: 'text-amber-700 bg-amber-50 border-amber-300' },
  low:      { label: 'Optionnel',   cls: 'text-gray-600 bg-gray-50 border-gray-300' },
}
const EFFORT_LABEL: Record<string, string> = {
  days:   'Quelques jours',
  weeks:  'Quelques semaines',
  months: 'Plusieurs mois',
}

const STRUCTURE_LABELS: Record<string, string> = {
  share_deal:   'Cession de titres',
  asset_deal:   'Cession d\'actifs',
  merger:       'Fusion',
  earnout_only: 'Earnout exclusif',
  mixed:        'Mixte',
}

const TS_STATUS_META: Record<TermSheetStatus, { label: string; cls: string }> = {
  pending:    { label: 'En attente',        cls: 'text-amber-700 bg-amber-50 border-amber-300' },
  viewed:     { label: 'Consultée',         cls: 'text-blue-700 bg-blue-50 border-blue-300' },
  accepted:   { label: 'Acceptée',          cls: 'text-emerald-700 bg-emerald-50 border-emerald-300' },
  refused:    { label: 'Refusée',           cls: 'text-red-700 bg-red-50 border-red-300' },
  countered:  { label: 'Contre-proposée',   cls: 'text-purple-700 bg-purple-50 border-purple-300' },
  expired:    { label: 'Expirée',           cls: 'text-gray-500 bg-gray-50 border-gray-300' },
}
const DOC_QUALITY: Record<string, { label: string; cls: string }> = {
  sufficient:     { label: '✓ Validé',               cls: 'text-emerald-700 bg-emerald-50 border-emerald-200' },
  insufficient:   { label: '⚠ Insuffisant',           cls: 'text-orange-700 bg-orange-50 border-orange-200' },
  pending_review: { label: 'En attente de validation', cls: 'text-blue-700 bg-blue-50 border-blue-200' },
  rejected:       { label: '✗ Rejeté',                cls: 'text-red-700 bg-red-50 border-red-200' },
}

function fmtDate(d: string | null) {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('fr-CH', { day: '2-digit', month: 'long', year: 'numeric' })
}
function deltaSign(n: number) {
  return n > 0 ? `+${n}` : String(n)
}
function deltaCls(n: number) {
  return n > 0 ? 'text-emerald-600' : n < 0 ? 'text-red-500' : 'text-gray-400'
}

// ─── Composant principal ──────────────────────────────────────────────────────

export default function SellerAssetTabs({
  assetId, assetAegGrade, assetArr, assetAskingPrice, assetSector,
  auctionReady, auctionReadyBlockers, assessment, allVersions, docs, benchmark, termSheets,
}: Props) {
  const [tab, setTab] = useState<'overview' | 'recommendations' | 'documents' | 'history' | 'termsheets'>('overview')
  const [tsLoading, setTsLoading] = useState<string | null>(null)
  const [tsError, setTsError] = useState('')
  const [tsResponseNote, setTsResponseNote] = useState<Record<string, string>>({})  
  const [tsSheets, setTsSheets] = useState<TermSheet[]>(termSheets)
  const [expandedTs, setExpandedTs] = useState<string | null>(null)

  async function handleTsAction(id: string, action: 'accepted' | 'refused' | 'countered') {
    setTsLoading(id)
    setTsError('')
    try {
      const res = await fetch(`/api/seller/term-sheets/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: action,
          seller_response_note: tsResponseNote[id] ?? undefined,
        }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error ?? 'Erreur')
      setTsSheets(prev => prev.map(ts => ts.id === id ? { ...ts, status: action } : ts))
    } catch (err: unknown) {
      setTsError(err instanceof Error ? err.message : 'Erreur inattendue')
    } finally {
      setTsLoading(null)
    }
  }

  const dims = assessment?.dimensions
  const dimScores: { label: string; key: keyof NonNullable<typeof dims>; color: string }[] = [
    { label: 'C — Code',      key: 'code',     color: 'bg-blue-500' },
    { label: 'I — IP',        key: 'ip',       color: 'bg-purple-500' },
    { label: 'F — Finance',   key: 'finance',  color: 'bg-amber-500' },
    { label: 'S — Sécurité',  key: 'security', color: 'bg-red-500' },
  ]

  const recs = assessment?.recommendations ?? []
  const recsByPriority = (['blocking', 'high', 'medium', 'low'] as const).map(p => ({
    priority: p,
    items: recs.filter(r => r.priority === p),
  })).filter(g => g.items.length > 0)

  // Benchmark
  let multiple: number | null = null
  if (assetArr && assetAskingPrice && assetArr > 0) {
    multiple = Math.round((assetAskingPrice / assetArr) * 10) / 10
  }
  const showBenchmark = benchmark && multiple !== null

  const activeTsCount = tsSheets.filter(ts => ts.status === 'pending' || ts.status === 'viewed').length

  const TABS = [
    { key: 'overview',         label: 'Vue d\'ensemble' },
    { key: 'recommendations',  label: `Recommandations${recs.length > 0 ? ` (${recs.length})` : ''}` },
    { key: 'documents',        label: 'Documents' },
    { key: 'history',          label: 'Historique' },
    { key: 'termsheets',       label: `Term Sheets${activeTsCount > 0 ? ` (${activeTsCount})` : ''}` },
  ] as const

  return (
    <div>
      {/* Tab bar */}
      <div className="flex border-b border-gray-200 mb-6 overflow-x-auto">
        {TABS.map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-5 py-3 font-mono text-[10px] uppercase tracking-widest shrink-0 border-b-2 transition-colors ${
              tab === t.key
                ? 'border-ag-navy text-ag-navy'
                : 'border-transparent text-gray-400 hover:text-gray-700'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ── ONGLET 1 — Vue d'ensemble ── */}
      {tab === 'overview' && (
        <div className="flex flex-col gap-6">

          {/* Grade + scores */}
          {assessment && (
            <div className="bg-white border border-gray-200 p-6">
              <p className="font-mono text-[9px] uppercase tracking-widest text-gray-300 mb-4">Grade CIFS</p>
              <div className="flex items-center gap-4 mb-6">
                {assetAegGrade && GRADE_LABEL[assetAegGrade] && (
                  <span className={`border px-4 py-2 font-mono font-bold text-[22px] ${GRADE_CLS[assetAegGrade] ?? ''}`}>
                    {GRADE_LABEL[assetAegGrade]}
                  </span>
                )}
                <div>
                  <p className="font-mono font-bold text-[28px] text-gray-900 leading-none">
                    {assessment.computed_score ?? '—'}<span className="text-[14px] font-normal text-gray-400">/100</span>
                  </p>
                  <p className="font-sans text-[11px] text-gray-400 mt-0.5">Score total</p>
                </div>
              </div>
              <div className="flex flex-col gap-3">
                {dimScores.map(d => {
                  const s = dims?.[d.key]?.score ?? 0
                  return (
                    <div key={d.key}>
                      <div className="flex items-center justify-between mb-1">
                        <p className="font-mono text-[9px] uppercase tracking-widest text-gray-500">{d.label}</p>
                        <p className="font-mono text-[11px] text-gray-700 font-bold">{s}<span className="font-normal text-gray-400">/25</span></p>
                      </div>
                      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${d.color}`} style={{ width: `${(s / 25) * 100}%` }} />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Grade ceiling */}
          {assessment?.grade_ceiling && (
            <div className="bg-amber-50 border border-amber-200 px-5 py-4">
              <p className="font-mono text-[9px] uppercase tracking-widest text-amber-600 mb-1">Grade plafonné</p>
              <p className="font-sans text-[13px] text-amber-800">
                Grade plafonné à <strong>{assessment.grade_ceiling.toUpperCase()}</strong> — niveau de preuve insuffisant.
                Consultez l&apos;onglet Recommandations pour débloquer un niveau supérieur.
              </p>
            </div>
          )}

          {/* TRS */}
          {assessment?.trs && TRS_META[assessment.trs] && (
            <div className="bg-white border border-gray-200 p-6">
              <p className="font-mono text-[9px] uppercase tracking-widest text-gray-300 mb-4">Transaction Readiness Score</p>
              <span className={`inline-block border px-3 py-1.5 font-mono text-[11px] uppercase tracking-widest font-bold mb-3 ${TRS_META[assessment.trs].cls}`}>
                {TRS_META[assessment.trs].label}
              </span>
              <p className="font-sans text-[13px] text-gray-600 mb-4">{TRS_META[assessment.trs].desc}</p>
              {(assessment.trs_reasons ?? []).length > 0 && (
                <ul className="flex flex-col gap-2">
                  {(assessment.trs_reasons ?? []).map((r, i) => (
                    <li key={i} className="flex items-start gap-2 font-sans text-[12px] text-gray-600">
                      <AlertTriangle size={12} className="text-amber-500 shrink-0 mt-0.5" />
                      {r}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {/* M&A Ready */}
          <div className="bg-white border border-gray-200 p-6">
            <p className="font-mono text-[9px] uppercase tracking-widest text-gray-300 mb-4">Eligibilité processus M&amp;A</p>
            {auctionReady ? (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle2 size={18} className="text-emerald-500" />
                  <span className="font-mono text-[12px] uppercase tracking-widest text-emerald-700 font-bold">M&amp;A Ready</span>
                </div>
                <p className="font-sans text-[13px] text-gray-600">
                  Votre actif remplit tous les critères pour entrer en processus de cession AEGRYN.
                </p>
              </div>
            ) : (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <XCircle size={18} className="text-gray-400" />
                  <span className="font-mono text-[11px] uppercase tracking-widest text-gray-500">Non encore prêt</span>
                </div>
                {(auctionReadyBlockers ?? []).length > 0 && (
                  <ul className="flex flex-col gap-1.5 mb-4">
                    {(auctionReadyBlockers ?? []).map((b, i) => (
                      <li key={i} className="flex items-start gap-2 font-sans text-[12px] text-gray-600">
                        <XCircle size={11} className="text-red-400 shrink-0 mt-0.5" />
                        {b}
                      </li>
                    ))}
                  </ul>
                )}
                <Link href={`/client/seller/actifs/${assetId}/documents`}
                  className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest text-ag-navy border border-ag-navy px-4 py-2 hover:bg-ag-navy hover:text-white transition-colors">
                  Compléter mon dossier <ChevronRight size={11} />
                </Link>
              </div>
            )}
          </div>

          {/* Benchmark sectoriel */}
          {showBenchmark && benchmark && (
            <div className="bg-white border border-gray-200 p-6">
              <p className="font-mono text-[9px] uppercase tracking-widest text-gray-300 mb-4">Benchmark sectoriel</p>
              <p className="font-sans text-[12px] text-gray-500 mb-3">
                Secteur <strong>{assetSector ?? benchmark.sector}</strong> — données {benchmark.source ?? 'Aventis Advisors Q2 2026'}
              </p>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="font-mono text-[9px] uppercase tracking-widest text-gray-400 mb-1">Votre multiple</p>
                  <p className="font-mono font-bold text-[20px] text-ag-navy">{multiple}x ARR</p>
                </div>
                <div>
                  <p className="font-mono text-[9px] uppercase tracking-widest text-gray-400 mb-1">Médiane marché</p>
                  <p className="font-mono font-bold text-[20px] text-gray-700">{benchmark.arr_multiple_median}x ARR</p>
                </div>
                <div>
                  <p className="font-mono text-[9px] uppercase tracking-widest text-gray-400 mb-1">Top quartile</p>
                  <p className="font-mono font-bold text-[20px] text-gray-700">{benchmark.arr_multiple_top_quartile}x ARR</p>
                </div>
              </div>
              {/* Indicateur visuel */}
              {benchmark.arr_multiple_top_quartile && benchmark.arr_multiple_median && (
                <div className="mt-4">
                  <div className="relative h-2 bg-gray-100 rounded-full">
                    {/* barre médiane */}
                    <div className="absolute top-0 bottom-0 bg-gray-300 rounded-full" style={{ width: `${(benchmark.arr_multiple_median / benchmark.arr_multiple_top_quartile) * 100}%` }} />
                    {/* position actif */}
                    <div className="absolute top-[-3px] w-3 h-3 bg-ag-navy rounded-full border-2 border-white shadow"
                      style={{ left: `${Math.min((multiple! / benchmark.arr_multiple_top_quartile) * 100, 100)}%`, transform: 'translateX(-50%)' }} />
                  </div>
                  <div className="flex justify-between mt-1">
                    <p className="font-mono text-[8px] text-gray-400">0x</p>
                    <p className="font-mono text-[8px] text-gray-400">Top quartile {benchmark.arr_multiple_top_quartile}x</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ── ONGLET 2 — Recommandations ── */}
      {tab === 'recommendations' && (
        <div className="flex flex-col gap-6">
          {recsByPriority.length === 0 ? (
            <div className="bg-white border border-gray-200 px-6 py-12 text-center">
              <CheckCircle2 size={24} className="text-emerald-400 mx-auto mb-3" />
              <p className="font-sans text-[14px] text-gray-500">Aucune recommandation — votre dossier est complet.</p>
            </div>
          ) : (
            recsByPriority.map(group => (
              <div key={group.priority}>
                <p className="font-mono text-[9px] uppercase tracking-widest text-gray-400 mb-3">
                  {group.priority === 'blocking' ? '🔴 Bloquant'
                    : group.priority === 'high' ? '🟠 Prioritaire'
                    : group.priority === 'medium' ? '🟡 À traiter'
                    : '⚪ Optionnel'}
                </p>
                <div className="flex flex-col gap-3">
                  {group.items.map((rec, i) => (
                    <div key={i} className="bg-white border border-gray-200 p-5">
                      <div className="flex items-center gap-2 mb-3 flex-wrap">
                        <span className="font-mono text-[9px] bg-gray-100 text-gray-600 px-2 py-0.5">{rec.subcode}</span>
                        {PRIORITY_META[rec.priority] && (
                          <span className={`border font-mono text-[8px] uppercase tracking-widest px-2 py-0.5 ${PRIORITY_META[rec.priority].cls}`}>
                            {PRIORITY_META[rec.priority].label}
                          </span>
                        )}
                        {rec.effort && EFFORT_LABEL[rec.effort] && (
                          <span className="font-mono text-[8px] text-gray-400 border border-gray-200 px-2 py-0.5">
                            {EFFORT_LABEL[rec.effort]}
                          </span>
                        )}
                      </div>
                      <p className="font-sans text-[13px] text-gray-800 mb-2">{rec.action}</p>
                      {rec.impact && (
                        <p className="font-sans text-[11px] text-gray-400 italic">Impact : {rec.impact}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}

          {/* CTAs */}
          <div className="bg-gray-50 border border-gray-200 p-6">
            <p className="font-sans text-[13px] text-gray-600 mb-4">Besoin d&apos;aide pour améliorer votre dossier ?</p>
            <div className="flex gap-3 flex-wrap">
              <Link href="/advisory"
                className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest bg-ag-navy text-white px-4 py-2.5 hover:bg-ag-navy/80 transition-colors">
                Advisory Tech <ChevronRight size={11} />
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* ── ONGLET 3 — Documents ── */}
      {tab === 'documents' && (
        <div className="flex flex-col gap-4">
          {docs.length === 0 ? (
            <div className="bg-white border border-gray-200 px-6 py-12 text-center">
              <p className="font-sans text-[14px] text-gray-400 mb-4">Aucun document déposé.</p>
              <Link href={`/client/seller/actifs/${assetId}/documents`}
                className="inline-flex items-center gap-2 bg-ag-navy text-white font-mono text-[10px] uppercase tracking-widest px-5 py-2.5 hover:bg-ag-navy/80 transition-colors">
                Déposer des documents <ChevronRight size={11} />
              </Link>
            </div>
          ) : (
            <div>
              <div className="flex flex-col gap-2">
                {docs.map(doc => (
                  <div key={doc.id} className="bg-white border border-gray-200 px-5 py-4 flex items-center justify-between gap-4 flex-wrap">
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="font-mono text-[9px] bg-gray-100 text-gray-500 px-2 py-0.5 shrink-0">{doc.document_code}</span>
                      <p className="font-sans text-[12px] text-gray-700 truncate">{doc.file_name}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {DOC_QUALITY[doc.admin_quality] && (
                        <span className={`border font-mono text-[8px] uppercase tracking-widest px-2 py-0.5 ${DOC_QUALITY[doc.admin_quality].cls}`}>
                          {DOC_QUALITY[doc.admin_quality].label}
                        </span>
                      )}
                      <span className="font-mono text-[8px] text-gray-400">{fmtDate(doc.uploaded_at)}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4">
                <Link href={`/client/seller/actifs/${assetId}/documents`}
                  className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest border border-gray-300 text-gray-600 px-4 py-2 hover:border-gray-500 transition-colors">
                  Gérer les documents <ChevronRight size={11} />
                </Link>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── ONGLET 5 — Term Sheets reçues ── */}
      {tab === 'termsheets' && (
        <div className="flex flex-col gap-4">

          {/* Notice */}
          <div className="bg-ag-navy/5 border border-ag-navy/20 px-5 py-4">
            <div className="flex items-start gap-2.5">
              <FileText size={13} className="text-ag-navy/60 shrink-0 mt-0.5" />
              <p className="font-sans text-[11px] text-gray-600 leading-relaxed">
                Les acheteurs sont anonymisés (<strong>Acheteur A, B…</strong>). Vous disposez de{' '}
                <strong>72h</strong> pour répondre à chaque term sheet active. Au-delà de 2 échanges,
                Aegryn facilitera un appel de médiation.
              </p>
            </div>
          </div>

          {tsError && (
            <p className="font-sans text-[12px] text-red-500 bg-red-50 border border-red-200 px-4 py-2.5">{tsError}</p>
          )}

          {tsSheets.length === 0 ? (
            <div className="bg-white border border-gray-200 px-6 py-12 text-center">
              <FileText size={24} className="text-gray-300 mx-auto mb-3" />
              <p className="font-sans text-[14px] text-gray-400">Aucune term sheet reçue pour cet actif.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {tsSheets.map(ts => {
                const meta = TS_STATUS_META[ts.status]
                const isActive = ts.status === 'pending' || ts.status === 'viewed'
                const isExpanded = expandedTs === ts.id
                const expiresIn = Math.max(0, Math.round((new Date(ts.expires_at).getTime() - Date.now()) / 3600000))

                return (
                  <div key={ts.id} className="bg-white border border-gray-200">
                    {/* En-tête term sheet */}
                    <button
                      type="button"
                      onClick={() => setExpandedTs(isExpanded ? null : ts.id)}
                      className="w-full px-6 py-4 flex items-center justify-between gap-4 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="font-mono text-[11px] font-bold text-gray-700 shrink-0">
                          Acheteur {String.fromCharCode(64 + ts.buyer_rank)}
                        </span>
                        {ts.version > 1 && (
                          <span className="font-mono text-[8px] bg-purple-100 text-purple-700 px-1.5 py-0.5">v{ts.version}</span>
                        )}
                        <span className={`border font-mono text-[8px] uppercase tracking-widest px-2 py-0.5 ${meta.cls}`}>
                          {meta.label}
                        </span>
                        <span className="font-mono font-bold text-[14px] text-gray-900">
                          CHF {ts.proposed_price_chf.toLocaleString('fr-CH')}
                        </span>
                        <span className="font-mono text-[9px] text-gray-400">
                          {STRUCTURE_LABELS[ts.structure] ?? ts.structure}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        {isActive && expiresIn > 0 && (
                          <span className="flex items-center gap-1 font-mono text-[9px] text-amber-600">
                            <Clock size={10} />{expiresIn}h restantes
                          </span>
                        )}
                        <ChevronRight size={13} className={`text-gray-400 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                      </div>
                    </button>

                    {/* Détail dépliable */}
                    {isExpanded && (
                      <div className="border-t border-gray-100 px-6 py-5 flex flex-col gap-5">

                        {/* Grille paramètres */}
                        <div className="grid grid-cols-2 gap-x-8 gap-y-3">
                          {ts.price_comment && (
                            <div className="col-span-2">
                              <p className="font-mono text-[8px] uppercase tracking-widest text-gray-300 mb-0.5">Commentaire prix</p>
                              <p className="font-sans text-[12px] text-gray-700">{ts.price_comment}</p>
                            </div>
                          )}
                          {ts.dd_duration_days && (
                            <div>
                              <p className="font-mono text-[8px] uppercase tracking-widest text-gray-300 mb-0.5">Due diligence</p>
                              <p className="font-sans text-[12px] text-gray-700">{ts.dd_duration_days} jours</p>
                            </div>
                          )}
                          {ts.closing_weeks && (
                            <div>
                              <p className="font-mono text-[8px] uppercase tracking-widest text-gray-300 mb-0.5">Délai closing</p>
                              <p className="font-sans text-[12px] text-gray-700">{ts.closing_weeks} semaines</p>
                            </div>
                          )}
                          {ts.earnout && (ts.earnout as { included?: boolean }).included && (
                            <div className="col-span-2">
                              <p className="font-mono text-[8px] uppercase tracking-widest text-gray-300 mb-0.5">Earnout</p>
                              <p className="font-sans text-[12px] text-gray-700">
                                {(ts.earnout as { percentage?: number }).percentage}% — {(ts.earnout as { duration_months?: number }).duration_months} mois
                                {(ts.earnout as { kpi?: string }).kpi && ` — ${(ts.earnout as { kpi?: string }).kpi}`}
                              </p>
                            </div>
                          )}
                          {ts.management_contract && (ts.management_contract as { included?: boolean }).included && (
                            <div className="col-span-2">
                              <p className="font-mono text-[8px] uppercase tracking-widest text-gray-300 mb-0.5">Management / Transition</p>
                              <p className="font-sans text-[12px] text-gray-700">
                                {(ts.management_contract as { role?: string }).role} — {(ts.management_contract as { duration_months?: number }).duration_months} mois
                              </p>
                            </div>
                          )}
                          {ts.non_compete && (ts.non_compete as { included?: boolean }).included && (
                            <div className="col-span-2">
                              <p className="font-mono text-[8px] uppercase tracking-widest text-gray-300 mb-0.5">Non-concurrence</p>
                              <p className="font-sans text-[12px] text-gray-700">
                                {(ts.non_compete as { duration_months?: number }).duration_months} mois — {(ts.non_compete as { geographic_scope?: string }).geographic_scope}
                              </p>
                            </div>
                          )}
                          {ts.buyer_profile_note && (
                            <div className="col-span-2">
                              <p className="font-mono text-[8px] uppercase tracking-widest text-gray-300 mb-0.5">Profil acheteur</p>
                              <p className="font-sans text-[12px] text-gray-700 leading-relaxed">{ts.buyer_profile_note}</p>
                            </div>
                          )}
                          {(ts.conditions_precedent ?? []).length > 0 && (
                            <div className="col-span-2">
                              <p className="font-mono text-[8px] uppercase tracking-widest text-gray-300 mb-1">Conditions suspensives</p>
                              <ul className="flex flex-col gap-1">
                                {(ts.conditions_precedent ?? []).map((c, i) => (
                                  <li key={i} className="font-sans text-[12px] text-gray-700 flex items-start gap-1.5">
                                    <span className="text-gray-300 shrink-0">—</span>{c}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>

                        {/* Réponse vendeur */}
                        {isActive && (
                          <div className="border-t border-gray-100 pt-5">
                            <p className="font-mono text-[9px] uppercase tracking-widest text-gray-300 mb-3">Votre réponse</p>

                            <div className="mb-3">
                              <label className="font-mono text-[9px] uppercase tracking-widest text-gray-500 block mb-2">
                                Message au cédant (optionnel)
                              </label>
                              <textarea
                                rows={3}
                                value={tsResponseNote[ts.id] ?? ''}
                                onChange={e => setTsResponseNote(prev => ({ ...prev, [ts.id]: e.target.value }))}
                                placeholder="Motif de refus, demande de précision, ou note pour la contre-proposition…"
                                className="w-full bg-white border border-gray-300 px-4 py-2.5 font-sans text-[13px] text-gray-900 placeholder-gray-300 focus:outline-none focus:border-ag-navy transition-colors resize-none"
                              />
                            </div>

                            <div className="flex items-center gap-3 flex-wrap">
                              <button
                                type="button"
                                disabled={tsLoading === ts.id}
                                onClick={() => handleTsAction(ts.id, 'accepted')}
                                className="flex items-center gap-1.5 bg-emerald-600 text-white font-mono text-[10px] uppercase tracking-widest px-4 py-2.5 hover:bg-emerald-700 transition-colors disabled:opacity-50"
                              >
                                <Check size={11} /> Accepter
                              </button>
                              <button
                                type="button"
                                disabled={tsLoading === ts.id}
                                onClick={() => handleTsAction(ts.id, 'refused')}
                                className="flex items-center gap-1.5 border border-red-300 text-red-600 font-mono text-[10px] uppercase tracking-widest px-4 py-2.5 hover:bg-red-50 transition-colors disabled:opacity-50"
                              >
                                <X size={11} /> Refuser
                              </button>
                              {ts.version < 2 && (
                                <button
                                  type="button"
                                  disabled={tsLoading === ts.id}
                                  onClick={() => handleTsAction(ts.id, 'countered')}
                                  className="flex items-center gap-1.5 border border-ag-navy text-ag-navy font-mono text-[10px] uppercase tracking-widest px-4 py-2.5 hover:bg-ag-navy hover:text-white transition-colors disabled:opacity-50"
                                >
                                  <MessageSquare size={11} /> Contre-proposer
                                </button>
                              )}
                              {ts.version >= 2 && (
                                <p className="font-sans text-[11px] text-gray-400 italic">
                                  Limite de rounds atteinte — Aegryn facilitera la prochaine étape.
                                </p>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Réponse déjà émise */}
                        {!isActive && ts.seller_response_note && (
                          <div className="border-t border-gray-100 pt-4">
                            <p className="font-mono text-[8px] uppercase tracking-widest text-gray-300 mb-1">Votre note</p>
                            <p className="font-sans text-[12px] text-gray-600 italic">{ts.seller_response_note}</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}

      {/* ── ONGLET 4 — Historique ── */}
      {tab === 'history' && (
        <div className="flex flex-col gap-4">
          {allVersions.length === 0 ? (
            <div className="bg-white border border-gray-200 px-6 py-12 text-center">
              <p className="font-sans text-[14px] text-gray-400">Aucune évaluation enregistrée.</p>
            </div>
          ) : allVersions.length === 1 ? (
            <div className="bg-white border border-gray-200 p-6">
              <p className="font-sans text-[13px] text-gray-600">
                Version 1 — Premier grade émis le {fmtDate(allVersions[0].created_at)}
              </p>
              <div className="flex items-center gap-3 mt-3">
                {allVersions[0].computed_grade && GRADE_LABEL[allVersions[0].computed_grade] && (
                  <span className={`border px-3 py-1 font-mono font-bold text-[14px] ${GRADE_CLS[allVersions[0].computed_grade] ?? ''}`}>
                    {GRADE_LABEL[allVersions[0].computed_grade]}
                  </span>
                )}
                <span className="font-mono text-[13px] text-gray-700">{allVersions[0].computed_score ?? '—'}/100</span>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {allVersions.map(v => (
                <div key={v.version_number} className="bg-white border border-gray-200 p-6">
                  <div className="flex items-center gap-3 mb-3 flex-wrap">
                    <span className="font-mono text-[9px] bg-ag-navy text-white px-2 py-0.5">v{v.version_number}</span>
                    {v.computed_grade && GRADE_LABEL[v.computed_grade] && (
                      <span className={`border px-2 py-0.5 font-mono font-bold text-[12px] ${GRADE_CLS[v.computed_grade] ?? ''}`}>
                        {GRADE_LABEL[v.computed_grade]}
                      </span>
                    )}
                    <span className="font-mono text-[11px] text-gray-700">{v.computed_score ?? '—'}/100</span>
                    <span className="font-mono text-[9px] text-gray-400">{fmtDate(v.created_at)}</span>
                  </div>

                  {v.delta?.scoresDelta && (
                    <div className="mt-3 border-t border-gray-100 pt-3">
                      <p className="font-mono text-[8px] uppercase tracking-widest text-gray-300 mb-2">Progression vs version précédente</p>
                      <div className="grid grid-cols-5 gap-2 text-center">
                        {(['code','ip','finance','security'] as const).map(dim => (
                          <div key={dim}>
                            <p className="font-mono text-[7px] uppercase text-gray-400 mb-0.5">{dim.charAt(0).toUpperCase()}</p>
                            <p className={`font-mono font-bold text-[12px] ${deltaCls(v.delta!.scoresDelta![dim])}`}>
                              {deltaSign(v.delta!.scoresDelta![dim])}
                            </p>
                          </div>
                        ))}
                        <div>
                          <p className="font-mono text-[7px] uppercase text-gray-400 mb-0.5">Total</p>
                          <p className={`font-mono font-bold text-[12px] ${deltaCls(v.delta.scoresDelta.total)}`}>
                            {deltaSign(v.delta.scoresDelta.total)}
                          </p>
                        </div>
                      </div>
                      {v.delta.gradeBefore && v.delta.gradeAfter && (
                        <p className="font-mono text-[9px] text-gray-400 mt-2">
                          Grade : {GRADE_LABEL[v.delta.gradeBefore] ?? v.delta.gradeBefore} → {GRADE_LABEL[v.delta.gradeAfter] ?? v.delta.gradeAfter}
                        </p>
                      )}
                      {v.delta.trsBefore && v.delta.trsAfter && (
                        <p className="font-mono text-[9px] text-gray-400">
                          TRS : {v.delta.trsBefore} → {v.delta.trsAfter}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
