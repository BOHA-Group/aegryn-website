'use client'

import { useState, useMemo, lazy, Suspense, useEffect } from 'react'
import { useRouter }   from 'next/navigation'
import { estimateGrade } from '@/lib/valuationEngine'
import {
  scoreToNote, GRADE_NOTE_LABEL, SUBCODES_BY_DIMENSION, type DimensionKey,
  checkAutoRefusal, suggestAegFromScore, deriveMaturityTier, capAegByMaturity,
  MATURITY_RULES, AEG_LABEL, type AEGGrade, formatGradeNotation,
} from '@/lib/gradingSystem'
import { CheckCircle2, AlertTriangle, Calculator, ClipboardList, Database, RefreshCw } from 'lucide-react'
import ReviewBadge from '@/components/ui/ReviewBadge'
import type { DataRoomDocEntry } from '@/app/admin/assets/[id]/grade-engine/GradeEngineForm'
import type { AutoFillResult } from '@/lib/gradeAutoFill'

const GradeEngineForm = lazy(() => import('@/app/admin/assets/[id]/grade-engine/GradeEngineForm'))

const DIMS = [
  { key: 'score_code',     dim: 'code'     as DimensionKey, label: 'C — Code',        desc: 'Qualité code, dette technique, tests, CI/CD' },
  { key: 'score_ip',       dim: 'ip'       as DimensionKey, label: 'I — IP & Droits', desc: 'Marques, licences, brevets, cessibilité juridique' },
  { key: 'score_finance',  dim: 'finance'  as DimensionKey, label: 'F — Finance',     desc: 'ARR/MRR, croissance, marges, CAC/LTV, burn' },
  { key: 'score_security', dim: 'security' as DimensionKey, label: 'S — Sécurité',    desc: 'RGPD, pentest, MFA, zero-trust, secrets' },
] as const

type DimKey = typeof DIMS[number]['key']
const SUBCODE_KEY: Record<DimKey, keyof SubcodesState> = {
  score_code: 'subcodes_code', score_ip: 'subcodes_ip',
  score_finance: 'subcodes_finance', score_security: 'subcodes_security',
}

interface SubcodesState {
  subcodes_code: string[]
  subcodes_ip: string[]
  subcodes_finance: string[]
  subcodes_security: string[]
}

const GRADE_COLORS: Record<string, string> = {
  '★':   'bg-emerald-100 text-emerald-800 border-emerald-200',
  'AAA': 'bg-blue-100 text-blue-800 border-blue-200',
  'AA':  'bg-green-100 text-green-800 border-green-200',
  'A':   'bg-yellow-100 text-yellow-800 border-yellow-200',
  'B':   'bg-gray-100 text-gray-700 border-gray-200',
  'NG':  'bg-red-50 text-red-600 border-red-100',
}

const STATUS_OPTIONS = [
  { key: 'submitted',    label: 'Soumis' },
  { key: 'under_review', label: 'En cours d\'analyse' },
  { key: 'graded',       label: 'Gradé' },
  { key: 'published',    label: 'Publié au catalogue' },
  { key: 'sold',         label: 'Vendu' },
  { key: 'withdrawn',    label: 'Retiré' },
]

const BENCHMARK_CATEGORIES = [
  'saas_vertical', 'saas_horizontal', 'ai_native', 'marketplace', 'mobile_app',
  'fintech', 'legaltech', 'healthtech', 'regtech', 'web3',
] as const

const inputCls  = 'w-full border border-gray-200 bg-white px-3 py-2.5 text-[12px] font-mono focus:outline-none focus:border-gray-500 transition-colors'
const labelCls  = 'block text-[10px] font-semibold uppercase tracking-widest text-gray-400 mb-1.5'
const sectionCls = 'bg-white border border-gray-200 p-6 flex flex-col gap-4'

interface InitialAsset {
  score_code: number; score_ip: number; score_finance: number; score_security: number
  subcodes_code: string[]; subcodes_ip: string[]; subcodes_finance: string[]; subcodes_security: string[]
  revenue_track_months: number | null
  gross_margin: number | null
  nrr: number | null
  benchmark_category: string | null
  aeg_grade: string | null
  arr: number | null
  sector: string | null
}

interface BenchmarkRow {
  category: string; profile_tier: string
  nrr_min: number; growth_min: number; gross_margin_min: number
  multiple_low: number; multiple_high: number
  source: string; source_date: string
}

interface TransactionComp {
  grade_aeg: string; category: string; sector: string
  valuation_range: { min?: number; max?: number }
  closed_at: string
}

interface BlockingAlert {
  document_code: string | null
  admin_quality: string
  file_name: string
}

export default function GradeForm({
  assetId, initialStatus, evaluationType, partnerReviewerType,
  initialAsset, benchmarkRows = [], transactionComps = [], blockingAlerts = [],
  docsByCategory = {},
}: {
  assetId: string
  initialStatus: string
  evaluationType?: string
  partnerReviewerType?: string
  initialAsset?: InitialAsset
  benchmarkRows?: BenchmarkRow[]
  transactionComps?: TransactionComp[]
  blockingAlerts?: BlockingAlert[]
  docsByCategory?: Record<string, DataRoomDocEntry[]>
}) {
  const router = useRouter()

  const [scores, setScores] = useState<Record<DimKey, number>>({
    score_code:     initialAsset?.score_code     ?? 0,
    score_ip:       initialAsset?.score_ip       ?? 0,
    score_finance:  initialAsset?.score_finance  ?? 0,
    score_security: initialAsset?.score_security ?? 0,
  })

  const [subcodes, setSubcodes] = useState<SubcodesState>({
    subcodes_code:     initialAsset?.subcodes_code     ?? [],
    subcodes_ip:       initialAsset?.subcodes_ip       ?? [],
    subcodes_finance:  initialAsset?.subcodes_finance  ?? [],
    subcodes_security: initialAsset?.subcodes_security ?? [],
  })

  const [revenueTrackMonths, setRevenueTrackMonths] = useState<number | ''>(initialAsset?.revenue_track_months ?? '')
  const [grossMargin,        setGrossMargin]        = useState<number | ''>(initialAsset?.gross_margin ?? '')
  const [nrr,                setNrr]                = useState<number | ''>(initialAsset?.nrr ?? '')
  const [benchmarkCategory,  setBenchmarkCategory]  = useState(initialAsset?.benchmark_category ?? '')
  const [aegOverride,        setAegOverride]        = useState<AEGGrade | ''>((initialAsset?.aeg_grade as AEGGrade) ?? '')

  // Score partenaire — dimension P (0-25, même grille que CIFS)
  const [partnerScore,       setPartnerScore]       = useState(0)
  const [partnerEmail,       setPartnerEmail]       = useState('')
  const [partnerDim,         setPartnerDim]         = useState<'code' | 'ip' | 'finance' | 'security'>('code')
  const [partnerSubcodes,    setPartnerSubcodes]    = useState<string[]>([])
  const [partnerObservations,setPartnerObservations]= useState('')
  const [partnerSaving,      setPartnerSaving]      = useState(false)
  const [partnerSaved,       setPartnerSaved]       = useState(false)
  const [partnerError,       setPartnerError]       = useState('')

  // Conformité partenaire — sous-codes dédiés
  const PARTNER_CHECKS = [
    { code: 'P-DOC-OK',   group: 'Documentation', fr: 'Documentation technique remise complète et lisible' },
    { code: 'P-DOC-PART', group: 'Documentation', fr: 'Documentation partielle — manques identifiés' },
    { code: 'P-DOC-KO',   group: 'Documentation', fr: 'Documentation absente ou insuffisante' },
    { code: 'P-METH-OK',  group: 'Méthodologie',  fr: 'Méthodologie conforme au référentiel Aegryn' },
    { code: 'P-METH-DEV', group: 'Méthodologie',  fr: 'Déviation méthodologique signalée' },
    { code: 'P-CON-OK',   group: 'Conclusion',    fr: 'Conclusions cohérentes avec les données fournies' },
    { code: 'P-CON-WARN', group: 'Conclusion',    fr: 'Conclusions à nuancer — réserves formulées' },
    { code: 'P-CON-KO',   group: 'Conclusion',    fr: 'Conclusions non cohérentes — à rejeter' },
    { code: 'P-DELAY-OK', group: 'Délais',        fr: 'Rendu dans les délais convenus' },
    { code: 'P-DELAY-KO', group: 'Délais',        fr: 'Délai dépassé sans justification' },
  ]

  async function savePartnerScore() {
    setPartnerSaving(true)
    setPartnerSaved(false)
    setPartnerError('')
    try {
      const res = await fetch(`/api/admin/assets/${assetId}/partner-score`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          partner_email: partnerEmail,
          dimension: partnerDim,
          score: partnerScore,
          subcodes: partnerSubcodes,
          observations: partnerObservations || undefined,
        }),
      })
      const json = await res.json() as { error?: string }
      if (res.ok) setPartnerSaved(true)
      else setPartnerError(json.error ?? 'Erreur')
    } catch (err) { setPartnerError(String(err)) }
    finally { setPartnerSaving(false) }
  }

  const [cosigners, setCosigners] = useState({
    cosigner_legal: '', cosigner_legal_date: '',
    cosigner_account: '', cosigner_account_date: '',
    cosigner_cyber: '', cosigner_cyber_date: '',
  })

  const [kryv_hash,      setKryvHash]     = useState('')
  const [public_summary, setPublicSummary]= useState('')
  const [internal_notes, setInternalNotes]= useState('')
  const [status,         setStatus]       = useState(initialStatus)

  const [activeTab, setActiveTab] = useState<'grader' | 'moteur'>('grader')

  const [loading, setLoading] = useState(false)
  const [saved,   setSaved]   = useState(false)
  const [error,   setError]   = useState('')

  /* ── Auto-fill data room ── */
  const [autoFill,         setAutoFill]         = useState<AutoFillResult | null>(null)
  const [autoFillLoading,  setAutoFillLoading]  = useState(false)
  const [autoFillApplied,  setAutoFillApplied]  = useState(false)
  /** Ensemble des sous-codes pré-cochés depuis la data room (pour affichage badge) */
  const [docSubcodes,      setDocSubcodes]       = useState<Set<string>>(new Set())

  async function loadAutoFill() {
    setAutoFillLoading(true)
    try {
      const res  = await fetch(`/api/admin/assets/${assetId}/grade-autofill`)
      const data = await res.json() as AutoFillResult
      setAutoFill(data)
    } catch { /* silencieux */ }
    finally { setAutoFillLoading(false) }
  }

  useEffect(() => { void loadAutoFill() }, [assetId]) // mount only — loadAutoFill is stable

  function applyAutoFill() {
    if (!autoFill) return
    const flat = {
      subcodes_code:     autoFill.subcodes.code.map(s => s.subcode),
      subcodes_ip:       autoFill.subcodes.ip.map(s => s.subcode),
      subcodes_finance:  autoFill.subcodes.finance.map(s => s.subcode),
      subcodes_security: autoFill.subcodes.security.map(s => s.subcode),
    }
    setSubcodes(prev => ({
      subcodes_code:     [...new Set([...prev.subcodes_code,     ...flat.subcodes_code])],
      subcodes_ip:       [...new Set([...prev.subcodes_ip,       ...flat.subcodes_ip])],
      subcodes_finance:  [...new Set([...prev.subcodes_finance,  ...flat.subcodes_finance])],
      subcodes_security: [...new Set([...prev.subcodes_security, ...flat.subcodes_security])],
    }))
    setDocSubcodes(new Set([
      ...flat.subcodes_code, ...flat.subcodes_ip,
      ...flat.subcodes_finance, ...flat.subcodes_security,
    ]))
    setAutoFillApplied(true)
  }

  /* ── P3 : guard data room ── */
  const [blockingWarning, setBlockingWarning] = useState<string[]>([])
  const [blockingJustif,  setBlockingJustif]  = useState('')
  const [showBlockingModal, setShowBlockingModal] = useState(false)

  /* ── P4 : modal divergence moteur/grader ── */
  const [showDivergenceModal, setShowDivergenceModal] = useState(false)
  const [divergenceJustif, setDivergenceJustif] = useState('')
  const [divergenceLevel,  setDivergenceLevel]  = useState(0)

  /* Rang des grades pour calcul écart */
  const AEG_RANK_MAP: Record<string, number> = { refused: 0, b: 1, a: 2, aa: 3, aaa: 4, star: 5 }

  const evalType    = evaluationType ?? 'full_certification'
  const isReview    = evalType === 'review_internal'
  const isReviewPlus = evalType === 'review_partner'
  const isFull      = evalType === 'full_certification'

  /* ── Grade en temps réel (grille /valuation inchangée) ── */
  const total = scores.score_code + scores.score_ip + scores.score_finance + scores.score_security
  const { grade, multLow, multHigh } = estimateGrade(total)
  const gradeLabel = `${multLow}x – ${multHigh}x ARR`

  /* ── Refus automatique + AEG suggéré, plafonné par la maturité ── */
  const autoRefusal = useMemo(() => checkAutoRefusal({
    code: subcodes.subcodes_code, ip: subcodes.subcodes_ip,
    finance: subcodes.subcodes_finance, security: subcodes.subcodes_security,
  }), [subcodes])

  const maturityTier = deriveMaturityTier(revenueTrackMonths === '' ? null : revenueTrackMonths)
  const maturityRule = MATURITY_RULES.find(r => r.tier === maturityTier)

  const suggestedAeg: AEGGrade = useMemo(() => {
    let g = suggestAegFromScore(total)
    g = capAegByMaturity(g, maturityTier)
    if (autoRefusal.refused) g = 'refused'
    return g
  }, [total, maturityTier, autoRefusal.refused])

  const finalAeg: AEGGrade = autoRefusal.refused ? 'refused' : (aegOverride || suggestedAeg)

  const notation = formatGradeNotation({
    scoreCode: scores.score_code, scoreIp: scores.score_ip,
    scoreFinance: scores.score_finance, scoreSecurity: scores.score_security,
    subcodesCode: subcodes.subcodes_code, subcodesIp: subcodes.subcodes_ip,
    subcodesFinance: subcodes.subcodes_finance, subcodesSecurity: subcodes.subcodes_security,
  })

  /* ── Benchmark marché — comparables pour la catégorie sélectionnée ── */
  const benchmarkForCategory = benchmarkRows.filter(b => b.category === benchmarkCategory)
  const compsForCategory = transactionComps.filter(t =>
    benchmarkCategory ? t.category.toLowerCase().includes(initialAsset?.sector?.toLowerCase().slice(0, 4) ?? '___') || t.sector === initialAsset?.sector : false
  )

  function setScore(k: DimKey, v: number) {
    setScores(prev => ({ ...prev, [k]: Math.min(25, Math.max(0, v)) }))
  }

  function toggleSubcode(k: DimKey, code: string) {
    const field = SUBCODE_KEY[k]
    setSubcodes(prev => {
      const has = prev[field].includes(code)
      return { ...prev, [field]: has ? prev[field].filter(c => c !== code) : [...prev[field], code] }
    })
  }

  async function submitGrade(blockingOverride?: string, divergenceOverride?: string) {
    setLoading(true)
    setSaved(false)
    setError('')
    try {
      const notesAppend = [
        blockingOverride  ? `[DOCS BLOQUANTS] ${blockingOverride}` : '',
        divergenceOverride ? `[DIVERGENCE MOTEUR] ${divergenceOverride}` : '',
      ].filter(Boolean).join('\n')
      const res = await fetch(`/api/admin/assets/${assetId}/grade`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...scores, ...subcodes, ...cosigners, kryv_hash, public_summary,
          internal_notes: [internal_notes, notesAppend].filter(Boolean).join('\n'),
          status,
          revenue_track_months: revenueTrackMonths === '' ? undefined : revenueTrackMonths,
          gross_margin:         grossMargin        === '' ? undefined : grossMargin,
          nrr:                  nrr                === '' ? undefined : nrr,
          benchmark_category:   benchmarkCategory   || undefined,
          aeg_grade_override:   aegOverride         || undefined,
        }),
      })
      const json = await res.json()
      if (res.ok) {
        setSaved(true)
        router.refresh()
      } else {
        setError(json.error ?? 'Erreur inconnue')
      }
    } catch (err) {
      setError(String(err))
    } finally {
      setLoading(false)
    }
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()

    /* ── P3 : vérifier documents bloquants non validés ── */
    const unvalidatedBlocking = blockingAlerts.filter(d => d.admin_quality !== 'sufficient')
    if (unvalidatedBlocking.length > 0 && !showBlockingModal) {
      setBlockingWarning(unvalidatedBlocking.map(d => d.document_code ? `${d.document_code} — ${d.file_name}` : d.file_name))
      setShowBlockingModal(true)
      return
    }

    /* ── P4 : vérifier divergence moteur/grader > 1 grade ── */
    /* On récupère le dernier grade moteur stocké si dispo via data attribute */
    const lastEngineGrade = (document.getElementById('__engine_grade__') as HTMLInputElement | null)?.value ?? ''
    if (lastEngineGrade && finalAeg !== lastEngineGrade) {
      const diff = Math.abs((AEG_RANK_MAP[finalAeg] ?? 0) - (AEG_RANK_MAP[lastEngineGrade] ?? 0))
      if (diff > 1 && !showDivergenceModal) {
        setDivergenceLevel(diff)
        setShowDivergenceModal(true)
        return
      }
    }

    await submitGrade(
      showBlockingModal  ? blockingJustif  : undefined,
      showDivergenceModal ? divergenceJustif : undefined,
    )
    setShowBlockingModal(false)
    setShowDivergenceModal(false)
    setBlockingJustif('')
    setDivergenceJustif('')
  }

  return (
    <div className="flex flex-col gap-6">

      {/* ── Onglets Grader / Moteur ── */}
      <div className="bg-white border border-gray-200">
        <div className="flex items-stretch border-b border-gray-200">
          <button
            type="button"
            onClick={() => setActiveTab('grader')}
            className={`flex items-center gap-2 px-5 py-3 text-[11px] font-semibold border-b-2 transition-colors ${
              activeTab === 'grader'
                ? 'border-ag-navy text-ag-navy'
                : 'border-transparent text-gray-400 hover:text-gray-700'
            }`}
          >
            <ClipboardList size={13} /> Grade officiel
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('moteur')}
            className={`flex items-center gap-2 px-5 py-3 text-[11px] font-semibold border-b-2 transition-colors ${
              activeTab === 'moteur'
                ? 'border-amber-500 text-amber-700'
                : 'border-transparent text-gray-400 hover:text-gray-700'
            }`}
          >
            <Calculator size={13} /> Moteur algorithmique
            <span className="ml-1 text-[9px] font-mono uppercase tracking-widest bg-amber-100 text-amber-600 px-1.5 py-0.5">Algo</span>
          </button>
        </div>
        {/* Légende des onglets */}
        <div className="grid grid-cols-2 divide-x divide-gray-100 bg-gray-50 px-0">
          <div className={`px-5 py-2.5 ${ activeTab === 'grader' ? 'bg-white' : ''}`}>
            <p className="text-[10px] text-gray-500 leading-snug">
              <span className="font-semibold text-gray-700">Grade officiel</span> — Saisie manuelle des scores CIFS (0–25/dim). Chaque sous-code coché ajuste le score automatiquement. Le grade live se calcule en temps réel.
            </p>
          </div>
          <div className={`px-5 py-2.5 ${ activeTab === 'moteur' ? 'bg-white' : ''}`}>
            <p className="text-[10px] text-gray-500 leading-snug">
              <span className="font-semibold text-amber-700">Moteur algorithmique</span> — Saisie des métriques brutes (ARR, NRR, couverture tests…). Le moteur calcule un grade suggéré. Indique aussi les documents data room manquants.
            </p>
          </div>
        </div>
      </div>

      {/* ── Panneau Moteur ── */}
      {activeTab === 'moteur' && (
        <div className="bg-amber-50/40 border border-amber-200">
          <div className="bg-amber-50 border-b border-amber-200 px-5 py-3 flex items-center justify-between gap-4">
            <div>
              <p className="font-mono text-[9px] uppercase tracking-widest text-amber-600">Usage interne — logique propriétaire Aegryn</p>
              <p className="text-[12px] text-amber-800 mt-0.5">
                Saisissez les métriques brutes de l&apos;actif. Le moteur calcule un <strong>grade suggéré par dimension</strong>.
                Utilisez ce résultat pour alimenter votre saisie dans l&apos;onglet <em>Grade officiel</em>.
              </p>
            </div>
            <a
              href={`/admin/assets/${assetId}/documents`}
              className="shrink-0 inline-flex items-center gap-1.5 text-[10px] font-semibold text-amber-700 border border-amber-300 bg-white px-3 py-1.5 hover:border-amber-500 transition-colors whitespace-nowrap"
            >
              Documents / Data Room
              {blockingAlerts.length > 0 && (
                <span className="ml-1 bg-red-500 text-white text-[9px] font-mono px-1.5 py-0.5 rounded-full">
                  {blockingAlerts.length}
                </span>
              )}
            </a>
          </div>
          <div className="p-4">
            <Suspense fallback={<div className="text-[12px] text-gray-400 py-8 text-center">Chargement du moteur…</div>}>
              <GradeEngineForm assetId={assetId} docsByCategory={docsByCategory} autoFillOverrides={autoFill?.gradeInputOverrides} />
            </Suspense>
          </div>
        </div>
      )}

      {/* ── Panneau Grader ── */}
      {activeTab === 'grader' && (
    <form onSubmit={onSubmit} className="flex flex-col gap-6">

      {/* ── Bandeau auto-fill data room ── */}
      <div className="bg-indigo-50 border border-indigo-200 px-5 py-3.5 flex items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <Database size={14} className="shrink-0 mt-0.5 text-indigo-500" />
          <div>
            <p className="font-mono text-[9px] uppercase tracking-widest text-indigo-500 mb-0.5">Pré-remplissage data room</p>
            {autoFillLoading && (
              <p className="text-[11px] text-indigo-600">Analyse des documents en cours…</p>
            )}
            {!autoFillLoading && autoFill && (
              <p className="text-[11px] text-indigo-800">
                <strong>{autoFill.sufficientCount}</strong> doc{autoFill.sufficientCount !== 1 ? 's' : ''} validés sur {autoFill.docCount} évalués
                {' — '}
                {autoFill.sources.length > 0
                  ? <><strong>{autoFill.sources.length}</strong> sous-code{autoFill.sources.length !== 1 ? 's' : ''} déductibles</>  
                  : 'Aucun sous-code déductible'}
                {autoFill.blockingDocs.length > 0 && (
                  <span className="ml-2 text-red-600 font-semibold">
                    · {autoFill.blockingDocs.length} doc{autoFill.blockingDocs.length !== 1 ? 's' : ''} bloquant{autoFill.blockingDocs.length !== 1 ? 's' : ''} insuffisant{autoFill.blockingDocs.length !== 1 ? 's' : ''}
                  </span>
                )}
              </p>
            )}
            {!autoFillLoading && !autoFill && (
              <p className="text-[11px] text-indigo-400">Impossible de charger les données data room.</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={loadAutoFill}
            className="flex items-center gap-1 text-[9px] font-mono uppercase tracking-wider text-indigo-400 hover:text-indigo-700 border border-indigo-200 px-2 py-1 hover:border-indigo-400 transition-colors"
          >
            <RefreshCw size={9} /> Actualiser
          </button>
          {autoFill && autoFill.sources.length > 0 && (
            <button
              type="button"
              onClick={applyAutoFill}
              className={`flex items-center gap-1.5 text-[10px] font-semibold px-3 py-1.5 border transition-colors ${
                autoFillApplied
                  ? 'border-indigo-300 bg-indigo-100 text-indigo-600 cursor-default'
                  : 'border-indigo-400 bg-indigo-600 text-white hover:bg-indigo-700'
              }`}
            >
              {autoFillApplied ? '✓ Appliqué' : 'Appliquer les sous-codes data room'}
            </button>
          )}
        </div>
      </div>

      {/* ── Alerte documents bloquants ── */}
      {blockingAlerts.length > 0 && (
        <div className="bg-amber-50 border border-amber-300 px-5 py-4">
          <div className="flex items-start gap-3">
            <AlertTriangle size={15} className="shrink-0 mt-0.5 text-amber-600" />
            <div>
              <p className="text-[12px] font-semibold text-amber-800 mb-2">
                {blockingAlerts.length} document{blockingAlerts.length > 1 ? 's' : ''} bloquant{blockingAlerts.length > 1 ? 's' : ''} insuffisant{blockingAlerts.length > 1 ? 's' : ''} ou manquant{blockingAlerts.length > 1 ? 's' : ''}
              </p>
              <ul className="space-y-1">
                {blockingAlerts.map((a, i) => (
                  <li key={i} className="text-[11px] text-amber-700 flex items-center gap-2">
                    <span className="font-mono font-bold">{a.document_code ?? '—'}</span>
                    <span>{a.file_name}</span>
                    <span className={`font-mono text-[9px] uppercase font-bold ${
                      a.admin_quality === 'missing' ? 'text-red-500' : 'text-amber-600'
                    }`}>{a.admin_quality}</span>
                  </li>
                ))}
              </ul>
              <p className="text-[10px] text-amber-600 mt-2">
                Vous pouvez poursuivre la saisie du grade — ce n&apos;est pas un blocage dur. Corrigez les documents dans l&apos;onglet Documents avant d&apos;émettre le rapport officiel.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ── Bandeau type d'évaluation ── */}
      {!isFull && (
        <div className="bg-blue-50 border border-blue-200 px-5 py-3 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-mono uppercase tracking-widest text-blue-500 mb-0.5">Type d’évaluation</p>
            <p className="text-[13px] font-semibold text-blue-800">
              {isReviewPlus
                ? `Aegryn Review+ — ${partnerReviewerType === 'legal' ? 'Cabinet juridique' : 'Expert-comptable'}`
                : 'Aegryn Review'}
            </p>
          </div>
          <ReviewBadge
            label={isReviewPlus ? 'Aegryn Review+' : 'Aegryn Review'}
            sublabel={isReviewPlus
              ? (partnerReviewerType === 'legal' ? 'Co-revu — Cabinet juridique' : 'Co-revu — Expert-comptable')
              : undefined}
            score={total}
            showNotPublishable
          />
        </div>
      )}

      {/* ── Grade live ── */}
      <div className={`border p-6 flex items-center justify-between gap-6 ${isFull ? (GRADE_COLORS[grade] ?? 'bg-gray-50 border-gray-200') : 'bg-blue-50 border-blue-200'}`}>
        <div>
          <p className="text-[10px] font-mono uppercase tracking-widest opacity-60 mb-1">Score calculé (même grille que /valuation)</p>
          <div className="flex items-baseline gap-3">
            {isFull
              ? <span className="text-[52px] font-bold leading-none">{grade}</span>
              : <span className="text-[28px] font-bold text-blue-700 leading-none">Score analytique</span>
            }
            <span className="text-[13px] font-mono opacity-60">{isFull ? gradeLabel : 'Non publié'}</span>
          </div>
        </div>
        <div className="text-right">
          <p className="text-[10px] font-mono uppercase tracking-widest opacity-60 mb-1">Score total</p>
          <p className="text-[32px] font-bold font-mono leading-none">{total}<span className="text-[16px] opacity-50">/100</span></p>
        </div>
      </div>

      {/* ── 4 sous-scores + notation Antiquorum-style ── */}
      <div className={sectionCls}>
        <h2 className="text-[11px] font-semibold uppercase tracking-widest text-gray-500">Scores CIFS (0-25 chacun)</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {DIMS.map(({ key, label, desc }) => {
            const note = scoreToNote(scores[key])
            return (
              <div key={key}>
                <div className="flex items-center justify-between mb-0.5">
                  <label className={labelCls}>{label}</label>
                  <span className="text-[10px] font-mono text-gray-400">
                    Note {note} — {GRADE_NOTE_LABEL[note].fr}
                  </span>
                </div>
                <p className="text-[10px] text-gray-400 mb-2">{desc}</p>
                <div className="flex items-center gap-3">
                  <input
                    type="range" min={0} max={25} step={1}
                    value={scores[key]}
                    onChange={e => setScore(key, Number(e.target.value))}
                    className="flex-1 accent-gray-800"
                  />
                  <input
                    type="number" min={0} max={25}
                    value={scores[key]}
                    onChange={e => setScore(key, Number(e.target.value))}
                    className="w-14 border border-gray-200 text-center font-mono text-[13px] py-1.5 focus:outline-none focus:border-gray-500"
                  />
                </div>
              </div>
            )
          })}
        </div>
        <div className="pt-3 border-t border-gray-100">
          <p className="text-[9px] font-mono uppercase tracking-widest text-gray-400 mb-1">Notation Aegryn Grade (style Antiquorum)</p>
          <p className="font-mono text-[13px] text-gray-800 tracking-wide">{notation}</p>
        </div>
      </div>

      {/* ── Sous-codes par dimension ── */}
      <div className={sectionCls}>
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-[11px] font-semibold uppercase tracking-widest text-gray-500">Sous-codes détaillés</h2>
            <p className="text-[11px] text-gray-400 mt-0.5">Cochez toutes les remarques applicables — alimente la notation et le refus automatique.</p>
          </div>
          {docSubcodes.size > 0 && (
            <span className="shrink-0 text-[9px] font-mono uppercase tracking-widest text-indigo-500 bg-indigo-50 border border-indigo-200 px-2 py-1">
              <Database size={8} className="inline mr-1" />{docSubcodes.size} depuis data room
            </span>
          )}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {DIMS.map(({ key, dim, label }) => {
            const groups = Array.from(new Set(SUBCODES_BY_DIMENSION[dim].map(s => s.group)))
            return (
              <div key={key} className="border border-gray-100 p-4">
                <p className="text-[11px] font-semibold text-gray-700 mb-3">{label}</p>
                <div className="flex flex-col gap-4 max-h-72 overflow-y-auto pr-1">
                  {groups.map(group => (
                    <div key={group}>
                      <p className="text-[9px] font-mono uppercase tracking-widest text-gray-400 mb-1.5">{group}</p>
                      <div className="flex flex-col gap-1.5">
                        {SUBCODES_BY_DIMENSION[dim].filter(s => s.group === group).map(s => {
                          const isFromDoc = docSubcodes.has(s.code)
                          return (
                            <label key={s.code} className="flex items-start gap-2 cursor-pointer group">
                              <input
                                type="checkbox"
                                checked={subcodes[SUBCODE_KEY[key]].includes(s.code)}
                                onChange={() => toggleSubcode(key, s.code)}
                                className="mt-0.5 accent-gray-800"
                              />
                              <span className="text-[11px] text-gray-600 group-hover:text-gray-900 leading-snug flex items-center gap-1.5 flex-wrap">
                                <span className="font-mono font-semibold text-gray-800">{s.code}</span>
                                {' — '}{s.fr}
                                {isFromDoc && (
                                  <span className="inline-flex items-center gap-0.5 text-[8px] font-mono uppercase tracking-wider text-indigo-500 bg-indigo-50 border border-indigo-200 px-1 py-0.5">
                                    <Database size={7} />doc
                                  </span>
                                )}
                              </span>
                            </label>
                          )
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>

        {/* Récapitulatif sources data room */}
        {autoFillApplied && autoFill && autoFill.sources.length > 0 && (
          <details className="border-t border-gray-100 pt-3">
            <summary className="text-[9px] font-mono uppercase tracking-widest text-gray-400 cursor-pointer hover:text-gray-600">
              Sources data room ({autoFill.sources.length} correspondances)
            </summary>
            <div className="mt-2 flex flex-col gap-1">
              {autoFill.sources.map((src, i) => (
                <p key={i} className="text-[10px] text-gray-500 flex items-center gap-2">
                  <span className="font-mono text-indigo-600 w-12 shrink-0">{src.subcode}</span>
                  <span className="text-gray-300">←</span>
                  <span className="font-mono text-[9px] text-gray-400">{src.docCode}</span>
                  <span className="truncate text-gray-400 italic">{src.docName}</span>
                  <span className={`shrink-0 text-[8px] font-mono uppercase ${
                    src.quality === 'sufficient' ? 'text-emerald-600' : 'text-amber-600'
                  }`}>{src.quality}</span>
                </p>
              ))}
            </div>
          </details>
        )}
      </div>

      {/* ── Refus automatique ── */}
      {autoRefusal.refused && (
        <div className="bg-red-50 border border-red-200 px-5 py-4 flex flex-col gap-2">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-red-700 flex items-center gap-2">
            <AlertTriangle size={13} /> Refus automatique déclenché
          </p>
          <ul className="list-disc list-inside text-[12px] text-red-700">
            {autoRefusal.reasons.map(r => <li key={r}>{r}</li>)}
          </ul>
        </div>
      )}

      {/* ── Maturité & éligibilité ── */}
      <div className={sectionCls}>
        <h2 className="text-[11px] font-semibold uppercase tracking-widest text-gray-500">Maturité & éligibilité au catalogue</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Ancienneté des revenus (mois)</label>
            <input type="number" min={0} value={revenueTrackMonths}
              onChange={e => setRevenueTrackMonths(e.target.value === '' ? '' : Number(e.target.value))}
              placeholder="ex: 18" className={inputCls} />
          </div>
          <div className="flex flex-col justify-center">
            <p className="text-[10px] font-mono uppercase tracking-widest text-gray-400 mb-1">Tier de maturité détecté</p>
            <p className="text-[13px] font-semibold text-gray-800">{maturityRule?.label}</p>
          </div>
        </div>
        {maturityRule && (
          <p className="text-[11px] text-gray-500 leading-relaxed border-t border-gray-100 pt-3">
            {maturityRule.rule}
            {maturityRule.maxAeg && (
              <span className="block mt-1 font-semibold text-amber-700">
                Plafond appliqué : AEG maximum {AEG_LABEL[maturityRule.maxAeg].symbol}
              </span>
            )}
          </p>
        )}
      </div>

      {/* ── Benchmark marché ── */}
      <div className={sectionCls}>
        <h2 className="text-[11px] font-semibold uppercase tracking-widest text-gray-500">Benchmark marché</h2>
        <div>
          <label className={labelCls}>Catégorie de comparaison</label>
          <select value={benchmarkCategory} onChange={e => setBenchmarkCategory(e.target.value)}
            className={`${inputCls} appearance-none`}>
            <option value="">— Sélectionner —</option>
            {BENCHMARK_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        {benchmarkCategory && benchmarkForCategory.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full text-[11px]">
              <thead>
                <tr className="border-b border-gray-200 text-gray-400 font-mono uppercase tracking-widest text-[9px]">
                  <th className="text-left py-2 pr-3">Tier</th>
                  <th className="text-left py-2 pr-3">NRR min</th>
                  <th className="text-left py-2 pr-3">Croissance min</th>
                  <th className="text-left py-2 pr-3">Marge min</th>
                  <th className="text-left py-2 pr-3">Multiple ARR</th>
                  <th className="text-left py-2">Source</th>
                </tr>
              </thead>
              <tbody>
                {benchmarkForCategory.map(b => {
                  const inRange = nrr !== '' && grossMargin !== '' &&
                    Number(nrr) >= b.nrr_min && Number(grossMargin) >= b.gross_margin_min
                  return (
                    <tr key={b.profile_tier} className={`border-b border-gray-100 ${inRange ? 'bg-emerald-50' : ''}`}>
                      <td className="py-2 pr-3 font-semibold capitalize">{b.profile_tier}</td>
                      <td className="py-2 pr-3 font-mono">{b.nrr_min}%</td>
                      <td className="py-2 pr-3 font-mono">{b.growth_min}%</td>
                      <td className="py-2 pr-3 font-mono">{b.gross_margin_min}%</td>
                      <td className="py-2 pr-3 font-mono">{b.multiple_low}x–{b.multiple_high}x</td>
                      <td className="py-2 text-gray-400">{b.source} ({b.source_date})</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-gray-100">
          <div>
            <label className={labelCls}>Marge brute (%)</label>
            <input type="number" value={grossMargin}
              onChange={e => setGrossMargin(e.target.value === '' ? '' : Number(e.target.value))}
              className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>NRR (%)</label>
            <input type="number" value={nrr}
              onChange={e => setNrr(e.target.value === '' ? '' : Number(e.target.value))}
              className={inputCls} />
          </div>
        </div>
        {compsForCategory.length > 0 && (
          <div className="pt-2 border-t border-gray-100">
            <p className="text-[10px] font-mono uppercase tracking-widest text-gray-400 mb-2">Transactions comparables ({compsForCategory.length})</p>
            <ul className="flex flex-col gap-1.5">
              {compsForCategory.slice(0, 5).map((c, i) => (
                <li key={i} className="text-[11px] text-gray-600 flex items-center justify-between">
                  <span>{c.category} — {c.sector} — grade {c.grade_aeg.toUpperCase()}</span>
                  <span className="font-mono text-gray-400">
                    {c.valuation_range?.min ? `${(c.valuation_range.min / 1000).toFixed(0)}K–${((c.valuation_range.max ?? 0) / 1000).toFixed(0)}K€` : '—'}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* ── AEG — Aegryn Expert Grade ── */}
      <div className={`border p-6 flex flex-col gap-4 ${finalAeg === 'refused' ? 'bg-red-50 border-red-200' : 'bg-gray-50 border-gray-200'}`}>
        <h2 className="text-[11px] font-semibold uppercase tracking-widest text-gray-500">AEG — Aegryn Expert Grade</h2>
        <p className="text-[11px] text-gray-500 leading-relaxed">
          L'algorithme suggère <strong>{AEG_LABEL[suggestedAeg].symbol}</strong> ({AEG_LABEL[suggestedAeg].fr}) sur la base du score total et de la maturité.
          L'expert peut surclasser ou déclasser selon la rareté, l'unicité ou le potentiel stratégique de l'actif.
        </p>
        <div className="flex items-center gap-4">
          <select value={aegOverride} onChange={e => setAegOverride(e.target.value as AEGGrade | '')}
            disabled={autoRefusal.refused}
            className={`${inputCls} appearance-none max-w-xs disabled:opacity-50`}>
            <option value="">Suggestion algorithmique ({AEG_LABEL[suggestedAeg].symbol})</option>
            {(['star', 'aaa', 'aa', 'a', 'b', 'refused'] as AEGGrade[]).map(g => (
              <option key={g} value={g}>{AEG_LABEL[g].symbol} — {AEG_LABEL[g].fr}</option>
            ))}
          </select>
          <div className="text-right ml-auto">
            <p className="text-[9px] font-mono uppercase tracking-widest text-gray-400">AEG final</p>
            <p className="text-[28px] font-bold leading-none" style={{ color: finalAeg === 'refused' ? '#C0392B' : undefined }}>
              {AEG_LABEL[finalAeg].symbol}
            </p>
          </div>
        </div>
      </div>

      {/* ── Score partenaire — CAS 1 (co-certification CIFS) ── */}
      {(isFull || isReviewPlus) && (
        <div className={sectionCls}>
          <div>
            <h2 className="text-[11px] font-semibold uppercase tracking-widest text-gray-500">Score partenaire — Dimension P</h2>
            <p className="text-[10px] text-gray-400 mt-0.5">
              Évaluation de la contribution du partenaire co-signataire. Même grille 0-25 que les dimensions CIFS.
              Documenter les points de conformité et observations pour archive Aegryn.
            </p>
          </div>

          {partnerError && <div className="bg-red-50 border border-red-200 p-3 text-[11px] text-red-700">{partnerError}</div>}
          {partnerSaved && !partnerSaving && <div className="bg-emerald-50 border border-emerald-200 p-3 text-[11px] text-emerald-700">Score partenaire enregistré.</div>}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Email / nom du partenaire</label>
              <input
                className={inputCls}
                value={partnerEmail}
                onChange={e => setPartnerEmail(e.target.value)}
                placeholder="cabinet@exemple.com"
              />
            </div>
            <div>
              <label className={labelCls}>Dimension évaluée</label>
              <select
                className={`${inputCls} appearance-none`}
                value={partnerDim}
                onChange={e => setPartnerDim(e.target.value as typeof partnerDim)}
              >
                <option value="code">C — Code / technique</option>
                <option value="ip">I — IP & Juridique</option>
                <option value="finance">F — Finance / comptable</option>
                <option value="security">S — Sécurité / cyber</option>
              </select>
            </div>
          </div>

          {/* Score 0-25 — même format que CIFS */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className={labelCls}>Score 0-25</label>
              <span className="text-[10px] font-mono text-gray-400">
                Note {scoreToNote(partnerScore)} — {GRADE_NOTE_LABEL[scoreToNote(partnerScore)].fr}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="range" min={0} max={25} step={1}
                value={partnerScore}
                onChange={e => setPartnerScore(Number(e.target.value))}
                className="flex-1 accent-gray-800"
              />
              <input
                type="number" min={0} max={25}
                value={partnerScore}
                onChange={e => setPartnerScore(Math.min(25, Math.max(0, Number(e.target.value))))}
                className="w-14 border border-gray-200 text-center font-mono text-[13px] py-1.5 focus:outline-none focus:border-gray-500"
              />
            </div>
          </div>

          {/* Sous-codes conformité partenaire */}
          <div className="border border-gray-100 p-4">
            <p className="text-[11px] font-semibold text-gray-700 mb-3">Points de conformité</p>
            <div className="flex flex-col gap-4">
              {Array.from(new Set(PARTNER_CHECKS.map(c => c.group))).map(group => (
                <div key={group}>
                  <p className="text-[9px] font-mono uppercase tracking-widest text-gray-400 mb-1.5">{group}</p>
                  <div className="flex flex-col gap-1.5">
                    {PARTNER_CHECKS.filter(c => c.group === group).map(c => (
                      <label key={c.code} className="flex items-start gap-2 cursor-pointer group">
                        <input
                          type="checkbox"
                          checked={partnerSubcodes.includes(c.code)}
                          onChange={() => setPartnerSubcodes(prev =>
                            prev.includes(c.code) ? prev.filter(x => x !== c.code) : [...prev, c.code]
                          )}
                          className="mt-0.5 accent-gray-800"
                        />
                        <span className="text-[11px] text-gray-600 group-hover:text-gray-900 leading-snug">
                          <span className="font-mono font-semibold text-gray-800">{c.code}</span> — {c.fr}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Observations textuelles */}
          <div>
            <label className={labelCls}>Observations (archivées, non visibles client)</label>
            <textarea
              rows={4}
              className={`${inputCls} resize-none`}
              value={partnerObservations}
              onChange={e => setPartnerObservations(e.target.value)}
              placeholder="Points forts, réserves, recommandations internes…"
            />
          </div>

          <button
            type="button"
            disabled={partnerSaving || !partnerEmail}
            onClick={savePartnerScore}
            className="border border-gray-300 text-gray-600 text-[11px] font-semibold uppercase tracking-wide px-4 py-2 hover:border-gray-500 transition-colors self-start disabled:opacity-40"
          >
            {partnerSaving ? 'Enregistrement…' : 'Enregistrer score partenaire'}
          </button>
        </div>
      )}

      {/* ── Experts consultés (full_certification = 3 ; review_partner = 1 seul ; review = masqué) ── */}
      {!isReview && (
        <div className={sectionCls}>
          <h2 className="text-[11px] font-semibold uppercase tracking-widest text-gray-500">Experts consultés <span className="font-normal normal-case tracking-normal text-gray-400">(optionnel)</span></h2>
          <p className="text-[11px] text-gray-400 -mt-2">La mention de ces experts apparaîtra dans le rapport de grade uniquement si le champ est rempli. Leur contribution enrichit l&apos;analyse mais n&apos;implique pas de co-signature du grade Aegryn.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { nKey: 'cosigner_legal',   dKey: 'cosigner_legal_date',   label: 'Cabinet juridique',     show: isFull || (isReviewPlus && partnerReviewerType === 'legal') },
              { nKey: 'cosigner_account', dKey: 'cosigner_account_date', label: 'Expert-comptable',       show: isFull || (isReviewPlus && partnerReviewerType === 'accounting') },
              { nKey: 'cosigner_cyber',   dKey: 'cosigner_cyber_date',   label: 'Partenaire cyber (opt.)', show: isFull },
            ].filter(c => c.show).map(({ nKey, dKey, label }) => (
              <div key={nKey} className="flex flex-col gap-2">
                <label className={labelCls}>{label}</label>
                <input type="text" placeholder="Nom / cabinet" value={(cosigners as Record<string, string>)[nKey]}
                  onChange={e => setCosigners(p => ({ ...p, [nKey]: e.target.value }))}
                  className={inputCls} />
                <input type="date" value={(cosigners as Record<string, string>)[dKey]}
                  onChange={e => setCosigners(p => ({ ...p, [dKey]: e.target.value }))}
                  className={inputCls} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Code d'ancrage + Publication (full_certification seulement) ── */}
      <div className={sectionCls}>
        <h2 className="text-[11px] font-semibold uppercase tracking-widest text-gray-500">
          {isFull ? 'Code d\'ancrage & Publication' : 'Rapport interne'}
        </h2>
        {isFull && (
          <div>
            <label className={labelCls}>Code d'ancrage (saisie manuelle MVP)</label>
            <input type="text" value={kryv_hash} onChange={e => setKryvHash(e.target.value)}
              placeholder="0x..." className={inputCls} />
          </div>
        )}
        {!isFull && (
          <div className="bg-blue-50 border border-blue-100 px-4 py-2 text-[11px] text-blue-600">
            Code d'ancrage et publication catalogue non disponibles pour ce type d'évaluation.
          </div>
        )}
        <div>
          <label className={labelCls}>Résumé public (anonymisé — affiché au catalogue)</label>
          <textarea rows={4} value={public_summary} onChange={e => setPublicSummary(e.target.value)}
            placeholder="SaaS B2B vertical, Grade AA, ARR 600K€, croissance 40% YoY, équipe 4 pers..."
            className={`${inputCls} resize-none`} />
        </div>
        <div>
          <label className={labelCls}>Notes internes (jamais visibles client)</label>
          <textarea rows={3} value={internal_notes} onChange={e => setInternalNotes(e.target.value)}
            className={`${inputCls} resize-none`} />
        </div>
      </div>

      {/* ── Statut + Submit ── */}
      <div className={sectionCls}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex-1">
            <label className={labelCls}>Statut du dossier</label>
            <select value={status} onChange={e => setStatus(e.target.value)}
              className={`${inputCls} appearance-none`}>
              {STATUS_OPTIONS.map(({ key, label }) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
          </div>
          <button type="submit" disabled={loading}
            className="mt-auto bg-gray-900 text-white font-semibold text-[11px] uppercase tracking-widest px-8 py-3 hover:bg-gray-700 transition-colors disabled:opacity-50 whitespace-nowrap">
            {loading ? 'Enregistrement...' : 'Enregistrer le grade'}
          </button>
        </div>

        {saved && (
          <div className="flex items-center gap-2 text-emerald-700 text-[12px]">
            <CheckCircle2 size={14} /> Grade enregistré avec succès.
          </div>
        )}
        {error && (
          <div className="flex items-center gap-2 text-red-600 text-[12px]">
            <AlertTriangle size={14} /> {error}
          </div>
        )}
      </div>

    </form>
      )}

      {/* ── P3 : Modal docs bloquants non validés ── */}
      {showBlockingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white border border-amber-300 shadow-xl max-w-lg w-full mx-4 p-6 flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <AlertTriangle size={16} className="text-amber-600 shrink-0" />
              <p className="text-[12px] font-semibold text-amber-800 uppercase tracking-widest">Documents bloquants non validés</p>
            </div>
            <p className="text-[12px] text-gray-600">Les documents suivants ont un statut non validé (<code className="text-[11px] bg-gray-100 px-1">sufficient</code> requis) :</p>
            <ul className="list-disc list-inside text-[12px] text-amber-800 bg-amber-50 border border-amber-200 px-4 py-3">
              {blockingWarning.map(d => <li key={d}>{d}</li>)}
            </ul>
            <p className="text-[12px] text-gray-600">Vous pouvez tout de même enregistrer le grade en fournissant une justification documentée.</p>
            <div>
              <label className={labelCls}>Justification obligatoire <span className="text-red-500">*</span></label>
              <textarea
                rows={3}
                value={blockingJustif}
                onChange={e => setBlockingJustif(e.target.value)}
                placeholder="Ex : les documents financiers sont en cours de finalisation — ARR auto-déclaré vérifié par notre analyste via extraits bancaires..."
                className={`${inputCls} resize-none`}
              />
              <p className="text-[10px] text-gray-400 mt-1">{blockingJustif.length} / 80 caractères min</p>
            </div>
            <div className="flex items-center gap-3 pt-2 border-t border-gray-100">
              <button type="button" onClick={() => { setShowBlockingModal(false); setBlockingWarning([]) }}
                className="text-[11px] text-gray-500 border border-gray-300 px-4 py-2 hover:border-gray-500 transition-colors">
                Annuler
              </button>
              <button type="button"
                disabled={blockingJustif.trim().length < 80 || loading}
                onClick={() => submitGrade(blockingJustif, undefined).then(() => { setShowBlockingModal(false); setBlockingJustif('') })}
                className="flex-1 bg-amber-600 text-white text-[11px] font-semibold uppercase tracking-widest px-4 py-2 hover:bg-amber-700 transition-colors disabled:opacity-40">
                {loading ? 'Enregistrement…' : 'Confirmer et enregistrer malgré tout'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── P4 : Modal divergence moteur/grader ── */}
      {showDivergenceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white border border-red-300 shadow-xl max-w-lg w-full mx-4 p-6 flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <AlertTriangle size={16} className="text-red-600 shrink-0" />
              <p className="text-[12px] font-semibold text-red-700 uppercase tracking-widest">Divergence moteur / grade officiel</p>
            </div>
            <p className="text-[12px] text-gray-600">
              Le grade officiel <strong>{AEG_LABEL[finalAeg].symbol}</strong> diverge de <strong>{divergenceLevel} niveau{divergenceLevel > 1 ? 'x' : ''}</strong> avec le score algorithmique du Moteur.
              Cette divergence doit être documentée.
            </p>
            <div>
              <label className={labelCls}>Justification interne <span className="text-red-500">*</span></label>
              <textarea
                rows={4}
                value={divergenceJustif}
                onChange={e => setDivergenceJustif(e.target.value)}
                placeholder="Ex : le moteur ne capture pas la qualité de l'équipe fondatrice ni le pipeline commercial. Le grade officiel intègre ces éléments qualitatifs..."
                className={`${inputCls} resize-none`}
              />
              <p className="text-[10px] text-gray-400 mt-1">{divergenceJustif.length} / 100 caractères min</p>
            </div>
            <div className="flex items-center gap-3 pt-2 border-t border-gray-100">
              <button type="button" onClick={() => { setShowDivergenceModal(false); setDivergenceJustif('') }}
                className="text-[11px] text-gray-500 border border-gray-300 px-4 py-2 hover:border-gray-500 transition-colors">
                Annuler
              </button>
              <button type="button"
                disabled={divergenceJustif.trim().length < 100 || loading}
                onClick={() => submitGrade(showBlockingModal ? blockingJustif : undefined, divergenceJustif).then(() => { setShowDivergenceModal(false); setDivergenceJustif('') })}
                className="flex-1 bg-gray-900 text-white text-[11px] font-semibold uppercase tracking-widest px-4 py-2 hover:bg-gray-700 transition-colors disabled:opacity-40">
                {loading ? 'Enregistrement…' : 'Confirmer avec justification'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
