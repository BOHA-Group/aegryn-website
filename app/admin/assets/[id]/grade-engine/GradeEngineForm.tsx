'use client'

import { useState, useMemo, useEffect } from 'react'
import type { GradeInput, GradeResult, GradeLetter } from '@/lib/gradeEngine'
import { runGradeEngine } from '@/lib/gradeEngine'
import { ChevronDown, ChevronUp, AlertTriangle, CheckCircle2, Calculator, Send, Zap, FileText, XCircle } from 'lucide-react'
import type { AutoFillResult } from '@/lib/gradeAutoFill'
import { applyAutoFillToGradeInput } from '@/lib/gradeAutoFill'

export type DataRoomDocEntry = {
  id: string
  document_type: string
  file_name: string
  admin_quality: string
  required_level: string
  document_code: string | null
}

const DOC_QUALITY_COLORS: Record<string, string> = {
  sufficient:     'text-emerald-700 bg-emerald-50 border-emerald-200',
  pending_review: 'text-gray-500 bg-gray-50 border-gray-200',
  insufficient:   'text-amber-700 bg-amber-50 border-amber-200',
  missing:        'text-red-600 bg-red-50 border-red-200',
}
const DOC_QUALITY_LABELS: Record<string, string> = {
  sufficient: 'Suffisant', pending_review: 'À évaluer', insufficient: 'Insuffisant', missing: 'Manquant',
}
const CIFS_TO_CATEGORY: Record<string, string> = {
  C: 'code', I: 'ip', F: 'finance', S: 'security',
}

// ─────────────────────────────────────────────────────────────────────────────
// Types locaux
// ─────────────────────────────────────────────────────────────────────────────

type FormStep = 'input' | 'result'

const GRADE_COLORS: Record<string, string> = {
  star:    'text-ag-apex   bg-ag-apex/10   border-ag-apex/30',
  aaa:     'text-ag-grade-aaa  bg-ag-grade-aaa/10  border-ag-grade-aaa/30',
  aa:      'text-ag-grade-aa   bg-ag-grade-aa/10   border-ag-grade-aa/30',
  a:       'text-ag-grade-a    bg-ag-grade-a/10    border-ag-grade-a/30',
  b:       'text-ag-grade-b    bg-ag-grade-b/10    border-ag-grade-b/30',
  refused: 'text-red-600 bg-red-50 border-red-200',
}

// ─────────────────────────────────────────────────────────────────────────────
// Valeurs par défaut
// ─────────────────────────────────────────────────────────────────────────────

function defaultInput(): GradeInput {
  return {
    code: {
      testCoverage: 0, techDebtDocumented: 'no', criticalVulnOpen: 0,
      majorVulnOpen: 0, architecture: 'monolithic', ciCdFunctional: 'no',
      apiDocumentation: 'absent', obsoleteDependencies: 0, lastCodeAuditMonthsAgo: 9999,
    },
    ip: {
      trademarksJurisdictions: 0, activeIPLitigation: 'no', employeeIPRights: 'absent',
      openSourceRisk: 'no', thirdPartyAPIContracted: 'no', moat: 'none', rgpdCompliance: 'absent',
    },
    finance: {
      arr: 0, revenueAgeMonths: 0, arrAudited: 'no', nrr: null,
      monthlyChurn: 0, grossMargin: 0, yoyGrowth: 0, topClientConcentration: 0, runwayMonths: 0,
    },
    security: {
      lastPentestMonthsAgo: 9999, criticalVulnsResolved: 'na', mfaOnAdminAccess: 'no',
      encryption: 'none', rgpdDocumented: 'no', activeSecurityIncident: 'no', externalCertification: 'no',
    },
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Composants utilitaires
// ─────────────────────────────────────────────────────────────────────────────

function Section({ title, open, onToggle, children }: {
  title: string; open: boolean; onToggle: () => void; children: React.ReactNode
}) {
  return (
    <div className="border border-gray-200 bg-white">
      <button type="button" onClick={onToggle}
        className="w-full flex items-center justify-between px-5 py-3 bg-gray-50 hover:bg-gray-100 transition-colors">
        <p className="font-mono text-[10px] uppercase tracking-widest text-gray-600 font-semibold">{title}</p>
        {open ? <ChevronUp size={14} className="text-gray-400" /> : <ChevronDown size={14} className="text-gray-400" />}
      </button>
      {open && <div className="px-5 py-4 grid grid-cols-1 gap-4 sm:grid-cols-2">{children}</div>}
    </div>
  )
}

function Field({ label, hint, source, children }: { label: string; hint?: string; source?: SourceType; children: React.ReactNode }) {
  const srcInfo = source ? SOURCE_LABELS[source] : null
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <label className="font-sans text-[12px] text-gray-700">{label}</label>
        {srcInfo && (
          <span className={`inline-flex items-center text-[9px] font-mono px-1.5 py-0.5 border ${srcInfo.cls}`}>
            {srcInfo.label}
          </span>
        )}
      </div>
      {hint && <p className="font-sans text-[10px] text-gray-400 mb-1">{hint}</p>}
      {children}
    </div>
  )
}

type SourceType = 'declarative' | 'verified' | 'subcode'
const SOURCE_LABELS: Record<SourceType, { label: string; cls: string }> = {
  declarative: { label: 'Déclaratif vendeur',   cls: 'bg-gray-100 text-gray-500 border-gray-200' },
  verified:    { label: 'Data room vérifié',     cls: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  subcode:     { label: 'Calculé par sous-code', cls: 'bg-amber-50 text-amber-700 border-amber-200' },
}

const inputCls = 'w-full border border-gray-200 px-3 py-1.5 font-sans text-[13px] text-gray-900 focus:outline-none focus:border-ag-navy'
const selectCls = `${inputCls} bg-white`

function NumInput({ value, onChange, min = 0, max, step = 1 }: {
  value: number; onChange: (v: number) => void; min?: number; max?: number; step?: number
}) {
  return (
    <input type="number" value={value} min={min} max={max} step={step}
      onChange={e => onChange(Number(e.target.value))}
      className={inputCls} />
  )
}

function YesNoSelect({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <select value={value} onChange={e => onChange(e.target.value)} className={selectCls}>
      <option value="yes">Oui</option>
      <option value="no">Non</option>
    </select>
  )
}

function YesNoNASelect({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <select value={value} onChange={e => onChange(e.target.value)} className={selectCls}>
      <option value="yes">Oui</option>
      <option value="no">Non</option>
      <option value="na">N/A</option>
    </select>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// ScoreBar
// ─────────────────────────────────────────────────────────────────────────────

function ScoreBar({ label, score, max = 25, dim }: { label: string; score: number; max?: number; dim?: string }) {
  const pct = Math.round((score / max) * 100)
  const color = pct >= 80 ? 'bg-emerald-500' : pct >= 60 ? 'bg-blue-500' : pct >= 40 ? 'bg-amber-500' : 'bg-red-400'
  const dimLabel: Record<string, string> = { C: 'Code', I: 'IP', F: 'Finance', S: 'Sécurité' }
  return (
    <div className="flex items-center gap-3">
      <p className="font-mono text-[11px] text-gray-500 w-16 shrink-0">{dim ? dimLabel[dim] ?? label : label}</p>
      <div className="flex-1 h-2 bg-gray-100 overflow-hidden">
        <div className={`h-full ${color} transition-all duration-300`} style={{ width: `${pct}%` }} />
      </div>
      <p className="font-mono text-[11px] text-gray-700 w-12 text-right shrink-0">{score}/{max}</p>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// LiveScorePanel — aperçu temps réel pendant la saisie
// ─────────────────────────────────────────────────────────────────────────────

const GRADE_BADGE: Record<string, string> = {
  star:    'bg-amber-100 text-amber-700 border-amber-300',
  aaa:     'bg-blue-100 text-blue-800 border-blue-300',
  aa:      'bg-green-100 text-green-800 border-green-300',
  a:       'bg-yellow-100 text-yellow-700 border-yellow-300',
  b:       'bg-gray-100 text-gray-600 border-gray-300',
  refused: 'bg-red-100 text-red-700 border-red-300',
}
const GRADE_LABELS: Record<string, string> = {
  star: 'AEG ★', aaa: 'AAA', aa: 'AA', a: 'A', b: 'B', refused: 'NG',
}

function LiveScorePanel({ live }: { live: ReturnType<typeof runGradeEngine> }) {
  const badge = GRADE_BADGE[live.grade] ?? GRADE_BADGE.b
  return (
    <div className="sticky top-4 bg-white border border-gray-200 p-4 space-y-3">
      <div className="flex items-center gap-1.5 mb-2">
        <Zap size={11} className="text-ag-apex" />
        <p className="font-mono text-[9px] uppercase tracking-widest text-gray-400">Score live</p>
      </div>

      <ScoreBar label="Code"     score={live.dimensions.code.score} />
      <ScoreBar label="IP"       score={live.dimensions.ip.score} />
      <ScoreBar label="Finance"  score={live.dimensions.finance.score} />
      <ScoreBar label="Sécurité" score={live.dimensions.security.score} />

      <div className="border-t border-gray-100 pt-3 flex items-center justify-between">
        <div>
          <p className="font-mono text-[9px] text-gray-400 uppercase tracking-widest">Total</p>
          <p className="font-sans font-bold text-[22px] text-gray-900 leading-none mt-0.5">
            {live.totalScore}<span className="text-[13px] text-gray-400">/100</span>
          </p>
        </div>
        <div className={`border px-3 py-1.5 text-center ${badge}`}>
          <p className="font-mono text-[9px] uppercase tracking-widest opacity-70 mb-0.5">Grade estimé</p>
          <p className="font-sans font-bold text-[18px] leading-none">{GRADE_LABELS[live.grade]}</p>
        </div>
      </div>

      {live.autoRefusal && (
        <div className="bg-red-50 border border-red-200 p-2">
          <p className="font-mono text-[9px] text-red-600 uppercase tracking-widest mb-1">Refus auto</p>
          {live.refusalReasons.map((r, i) => (
            <p key={i} className="font-sans text-[10px] text-red-700">· {r}</p>
          ))}
        </div>
      )}

      {!live.autoRefusal && live.totalScore > 0 && (
        <div className="space-y-1">
          {(['code', 'ip', 'finance', 'security'] as const).map(dim => {
            const d = live.dimensions[dim]
            const dimNames: Record<string, string> = { code: 'Code', ip: 'IP', finance: 'Finance', security: 'Sécu' }
            return d.rationale.slice(0, 2).map((r, i) => (
              <p key={`${dim}-${i}`} className="font-sans text-[10px] text-gray-500 leading-tight">
                <span className="font-mono text-ag-navy text-[9px]">[{dimNames[dim]}]</span> {r}
              </p>
            ))
          })}
        </div>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// COMPOSANT PRINCIPAL
// ─────────────────────────────────────────────────────────────────────────────

function DocBadge({ doc }: { doc: DataRoomDocEntry }) {
  const cls = DOC_QUALITY_COLORS[doc.admin_quality] ?? DOC_QUALITY_COLORS.pending_review
  const label = DOC_QUALITY_LABELS[doc.admin_quality] ?? doc.admin_quality
  return (
    <span className={`inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 border font-mono ${cls}`}>
      <FileText size={9} />
      {doc.file_name.length > 28 ? doc.file_name.slice(0, 28) + '…' : doc.file_name}
      <span className="opacity-60">· {label}</span>
    </span>
  )
}

function DocList({ dims, docsByCategory }: { dims: string[]; docsByCategory: Record<string, DataRoomDocEntry[]> }) {
  const docs = dims.flatMap(d => docsByCategory[CIFS_TO_CATEGORY[d]] ?? [])
  if (!docs.length) return (
    <p className="flex items-center gap-1 text-[10px] text-red-500 mt-1">
      <XCircle size={10} /> Aucun justificatif en data room pour cette dimension
    </p>
  )
  return (
    <div className="flex flex-wrap gap-1 mt-1">
      {docs.map(d => <DocBadge key={d.id} doc={d} />)}
    </div>
  )
}

export default function GradeEngineForm({
  assetId, adminToken, docsByCategory = {}, autoFillOverrides,
}: {
  assetId: string
  adminToken: string
  docsByCategory?: Record<string, DataRoomDocEntry[]>
  autoFillOverrides?: AutoFillResult['gradeInputOverrides']
}) {
  const [step, setStep] = useState<FormStep>('input')
  const [open, setOpen] = useState({ code: true, ip: false, finance: false, security: false })
  const [input, setInput] = useState<GradeInput>(defaultInput())
  const [inputSources, setInputSources] = useState<Record<string, SourceType>>(() => {
    const defaults: Record<string, SourceType> = {}
    const keys = [
      'testCoverage','techDebtDocumented','criticalVulnOpen','majorVulnOpen','architecture',
      'ciCdFunctional','apiDocumentation','obsoleteDependencies','lastCodeAuditMonthsAgo',
      'trademarksJurisdictions','activeIPLitigation','employeeIPRights','openSourceRisk',
      'thirdPartyAPIContracted','moat','rgpdCompliance',
      'arr','revenueAgeMonths','arrAudited','nrr','monthlyChurn','grossMargin','yoyGrowth',
      'topClientConcentration','runwayMonths',
      'lastPentestMonthsAgo','criticalVulnsResolved','mfaOnAdminAccess','encryption',
      'rgpdDocumented','activeSecurityIncident','externalCertification',
    ]
    keys.forEach(k => { defaults[k] = 'declarative' })
    return defaults
  })

  function markSource(field: string, src: SourceType) {
    setInputSources(p => ({ ...p, [field]: src }))
  }

  /* ── Injection auto-fill depuis data room au mount ── */
  useEffect(() => {
    if (!autoFillOverrides) return
    const overrides = autoFillOverrides
    setInput(prev => applyAutoFillToGradeInput(prev, overrides))
    // Marquer les champs injectés comme "data room vérifié"
    const OVERRIDE_KEYS: (keyof typeof autoFillOverrides)[] = [
      'techDebtDocumented', 'ciCdFunctional', 'apiDocumentation', 'architecture',
      'activeIPLitigation', 'employeeIPRights', 'openSourceRisk', 'thirdPartyAPIContracted', 'rgpdCompliance',
      'arrAudited',
      'mfaOnAdminAccess', 'encryption', 'rgpdDocumented', 'activeSecurityIncident', 'externalCertification', 'criticalVulnsResolved',
    ]
    setInputSources(prev => {
      const next = { ...prev }
      for (const k of OVERRIDE_KEYS) {
        if (overrides[k] !== undefined) next[k] = 'verified'
      }
      return next
    })
  }, []) // mount only — applies initial overrides once

  const [computing, setComputing] = useState(false)
  const [result, setResult] = useState<GradeResult | null>(null)
  const [assessmentId, setAssessmentId] = useState<string | null>(null)
  const [overrideGrade, setOverrideGrade] = useState<GradeLetter | ''>('')
  const [overrideNote, setOverrideNote] = useState('')
  const [publicRationale, setPublicRationale] = useState('')
  const [validating, setValidating] = useState(false)
  const [publishing, setPublishing] = useState(false)
  const [statusMsg, setStatusMsg] = useState('')

  /* ── Score live recalculé à chaque changement d'input ── */
  const liveScore = useMemo(() => runGradeEngine(input), [input])

  function setCode<K extends keyof GradeInput['code']>(k: K, v: GradeInput['code'][K], src: SourceType = 'declarative') {
    setInput(p => ({ ...p, code: { ...p.code, [k]: v } }))
    markSource(k, src)
  }
  function setIP<K extends keyof GradeInput['ip']>(k: K, v: GradeInput['ip'][K], src: SourceType = 'declarative') {
    setInput(p => ({ ...p, ip: { ...p.ip, [k]: v } }))
    markSource(k, src)
  }
  function setFin<K extends keyof GradeInput['finance']>(k: K, v: GradeInput['finance'][K], src: SourceType = 'declarative') {
    setInput(p => ({ ...p, finance: { ...p.finance, [k]: v } }))
    markSource(k, src)
  }
  function setSec<K extends keyof GradeInput['security']>(k: K, v: GradeInput['security'][K], src: SourceType = 'declarative') {
    setInput(p => ({ ...p, security: { ...p.security, [k]: v } }))
    markSource(k, src)
  }

  async function compute() {
    setComputing(true)
    setStatusMsg('')
    try {
      const res = await fetch(`/api/admin/assets/${assetId}/grade-engine`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: adminToken, action: 'compute', input }),
      })
      const json = await res.json()
      if (!res.ok) { setStatusMsg(json.error ?? 'Erreur serveur'); return }
      setResult(json.result as GradeResult)
      setAssessmentId(json.assessmentId)
      setPublicRationale(json.result.publicRationale ?? '')
      setOverrideGrade('')
      setOverrideNote('')
      setStep('result')
    } finally {
      setComputing(false)
    }
  }

  async function validate() {
    if (!assessmentId || !result) return
    const finalGrade = (overrideGrade || result.grade) as GradeLetter
    const isOverride = finalGrade !== result.grade
    if (isOverride && !overrideNote.trim()) {
      setStatusMsg('Une justification est obligatoire en cas de modification du grade calculé.')
      return
    }
    setValidating(true)
    setStatusMsg('')
    try {
      const res = await fetch(`/api/admin/assets/${assetId}/grade-engine`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: adminToken, action: 'validate',
          assessmentId, finalGrade, overrideNote: overrideNote || undefined,
          publicRationale: publicRationale || undefined,
        }),
      })
      const json = await res.json()
      if (!res.ok) { setStatusMsg(json.error ?? 'Erreur'); return }
      setStatusMsg('✅ Grade validé. Vous pouvez maintenant le publier sur la fiche actif.')
    } finally {
      setValidating(false)
    }
  }

  async function publish() {
    if (!assessmentId) return
    setPublishing(true)
    setStatusMsg('')
    try {
      const res = await fetch(`/api/admin/assets/${assetId}/grade-engine`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: adminToken, action: 'publish', assessmentId }),
      })
      const json = await res.json()
      if (!res.ok) { setStatusMsg(json.error ?? 'Erreur'); return }
      setStatusMsg(`✅ Grade ${json.grade?.toUpperCase()} publié sur la fiche actif.`)
    } finally {
      setPublishing(false)
    }
  }

  // ── Rendu formulaire saisie ────────────────────────────────────────────────
  if (step === 'input') return (
    <div className="grid grid-cols-1 xl:grid-cols-[1fr_280px] gap-6 items-start">

      {/* Colonne gauche — formulaire */}
      <div className="space-y-3">

      {/* DIMENSION CODE */}
      <Section title="Dimension C — Code (25 pts)" open={open.code} onToggle={() => setOpen(p => ({ ...p, code: !p.code }))}>
        <Field label="Couverture de tests (%)" hint="0 = aucun test · 100 = couverture totale" source={inputSources['testCoverage'] as SourceType}>
          <NumInput value={input.code.testCoverage} onChange={v => setCode('testCoverage', v)} max={100} />
        </Field>
        <Field label="Dette technique documentée" source={inputSources['techDebtDocumented'] as SourceType}>
          <YesNoSelect value={input.code.techDebtDocumented} onChange={v => setCode('techDebtDocumented', v as 'yes' | 'no')} />
        </Field>
        <Field label="Vulnérabilités critiques ouvertes" hint="0 = aucune (idéal)" source={inputSources['criticalVulnOpen'] as SourceType}>
          <NumInput value={input.code.criticalVulnOpen} onChange={v => setCode('criticalVulnOpen', v)} />
        </Field>
        <Field label="Vulnérabilités majeures ouvertes" source={inputSources['majorVulnOpen'] as SourceType}>
          <NumInput value={input.code.majorVulnOpen} onChange={v => setCode('majorVulnOpen', v)} />
        </Field>
        <Field label="Architecture" source={inputSources['architecture'] as SourceType}>
          <select value={input.code.architecture} onChange={e => setCode('architecture', e.target.value as 'decoupled' | 'partial' | 'monolithic')} className={selectCls}>
            <option value="decoupled">Découplée / scalable</option>
            <option value="partial">Partiellement découplée</option>
            <option value="monolithic">Monolithique</option>
          </select>
        </Field>
        <Field label="CI/CD fonctionnel" source={inputSources['ciCdFunctional'] as SourceType}>
          <YesNoSelect value={input.code.ciCdFunctional} onChange={v => setCode('ciCdFunctional', v as 'yes' | 'no')} />
        </Field>
        <Field label="Documentation API / technique" source={inputSources['apiDocumentation'] as SourceType}>
          <select value={input.code.apiDocumentation} onChange={e => setCode('apiDocumentation', e.target.value as 'complete' | 'partial' | 'absent')} className={selectCls}>
            <option value="complete">Complète</option>
            <option value="partial">Partielle</option>
            <option value="absent">Absente</option>
          </select>
        </Field>
        <Field label="Dépendances obsolètes (>24 mois)" hint="Nombre ou estimation" source={inputSources['obsoleteDependencies'] as SourceType}>
          <NumInput value={input.code.obsoleteDependencies} onChange={v => setCode('obsoleteDependencies', v)} />
        </Field>
        <Field label="Dernier audit de code externe (mois)" hint="9999 = jamais réalisé" source={inputSources['lastCodeAuditMonthsAgo'] as SourceType}>
          <NumInput value={input.code.lastCodeAuditMonthsAgo} onChange={v => setCode('lastCodeAuditMonthsAgo', v)} />
        </Field>
      </Section>

      {/* DIMENSION IP */}
      <Section title="Dimension I — IP & Droits (25 pts)" open={open.ip} onToggle={() => setOpen(p => ({ ...p, ip: !p.ip }))}>
        <Field label="Marques déposées (nb de juridictions)" source={inputSources['trademarksJurisdictions'] as SourceType}>
          <NumInput value={input.ip.trademarksJurisdictions} onChange={v => setIP('trademarksJurisdictions', v)} />
        </Field>
        <Field label="Litige IP actif" source={inputSources['activeIPLitigation'] as SourceType}>
          <YesNoSelect value={input.ip.activeIPLitigation} onChange={v => setIP('activeIPLitigation', v as 'yes' | 'no')} />
        </Field>
        <Field label="Droits de cession employés / prestataires" source={inputSources['employeeIPRights'] as SourceType}>
          <select value={input.ip.employeeIPRights} onChange={e => setIP('employeeIPRights', e.target.value as 'complete' | 'partial' | 'absent')} className={selectCls}>
            <option value="complete">Complets</option>
            <option value="partial">Partiels</option>
            <option value="absent">Absents</option>
          </select>
        </Field>
        <Field label="Risque open source GPL critique" source={inputSources['openSourceRisk'] as SourceType}>
          <YesNoSelect value={input.ip.openSourceRisk} onChange={v => setIP('openSourceRisk', v as 'yes' | 'no')} />
        </Field>
        <Field label="API tierce critique contractualisée" source={inputSources['thirdPartyAPIContracted'] as SourceType}>
          <YesNoSelect value={input.ip.thirdPartyAPIContracted} onChange={v => setIP('thirdPartyAPIContracted', v as 'yes' | 'no')} />
        </Field>
        <Field label="Moat défensif identifié" source={inputSources['moat'] as SourceType}>
          <select value={input.ip.moat} onChange={e => setIP('moat', e.target.value as 'network' | 'data' | 'regulatory' | 'none')} className={selectCls}>
            <option value="network">Effet réseau</option>
            <option value="data">Data propriétaire</option>
            <option value="regulatory">Réglementaire</option>
            <option value="none">Aucun</option>
          </select>
        </Field>
        <Field label="Conformité RGPD / LPD" source={inputSources['rgpdCompliance'] as SourceType}>
          <select value={input.ip.rgpdCompliance} onChange={e => setIP('rgpdCompliance', e.target.value as 'complete' | 'partial' | 'absent')} className={selectCls}>
            <option value="complete">Complète</option>
            <option value="partial">Partielle</option>
            <option value="absent">Absente</option>
          </select>
        </Field>
      </Section>

      {/* DIMENSION FINANCE */}
      <Section title="Dimension F — Finance (25 pts)" open={open.finance} onToggle={() => setOpen(p => ({ ...p, finance: !p.finance }))}>
        <Field label="ARR (€)" source={inputSources['arr'] as SourceType}>
          <NumInput value={input.finance.arr} onChange={v => setFin('arr', v)} step={1000} />
        </Field>
        <Field label="Ancienneté des revenus (mois)" source={inputSources['revenueAgeMonths'] as SourceType}>
          <NumInput value={input.finance.revenueAgeMonths} onChange={v => setFin('revenueAgeMonths', v)} />
        </Field>
        <Field label="ARR audité par un tiers" source={inputSources['arrAudited'] as SourceType}>
          <YesNoSelect value={input.finance.arrAudited} onChange={v => setFin('arrAudited', v as 'yes' | 'no')} />
        </Field>
        <Field label="NRR (%)" hint="Laisser à 0 si non applicable (<12 mois d'historique)" source={inputSources['nrr'] as SourceType}>
          <NumInput value={input.finance.nrr ?? 0} onChange={v => setFin('nrr', v === 0 ? null : v)} />
        </Field>
        <Field label="Churn mensuel (%)" source={inputSources['monthlyChurn'] as SourceType}>
          <NumInput value={input.finance.monthlyChurn} onChange={v => setFin('monthlyChurn', v)} step={0.1} />
        </Field>
        <Field label="Marge brute (%)" source={inputSources['grossMargin'] as SourceType}>
          <NumInput value={input.finance.grossMargin} onChange={v => setFin('grossMargin', v)} />
        </Field>
        <Field label="Croissance YoY (%)" source={inputSources['yoyGrowth'] as SourceType}>
          <NumInput value={input.finance.yoyGrowth} onChange={v => setFin('yoyGrowth', v)} />
        </Field>
        <Field label="Concentration client — top 1 (%)" source={inputSources['topClientConcentration'] as SourceType}>
          <NumInput value={input.finance.topClientConcentration} onChange={v => setFin('topClientConcentration', v)} max={100} />
        </Field>
        <Field label="Runway (mois)" source={inputSources['runwayMonths'] as SourceType}>
          <NumInput value={input.finance.runwayMonths} onChange={v => setFin('runwayMonths', v)} />
        </Field>
      </Section>

      {/* DIMENSION SECURITE */}
      <Section title="Dimension S — Sécurité (25 pts)" open={open.security} onToggle={() => setOpen(p => ({ ...p, security: !p.security }))}>
        <Field label="Dernier pentest (mois)" hint="9999 = jamais réalisé" source={inputSources['lastPentestMonthsAgo'] as SourceType}>
          <NumInput value={input.security.lastPentestMonthsAgo} onChange={v => setSec('lastPentestMonthsAgo', v)} />
        </Field>
        <Field label="Vulnérabilités critiques résolues" source={inputSources['criticalVulnsResolved'] as SourceType}>
          <YesNoNASelect value={input.security.criticalVulnsResolved} onChange={v => setSec('criticalVulnsResolved', v as 'yes' | 'no' | 'na')} />
        </Field>
        <Field label="MFA sur tous les accès admin" source={inputSources['mfaOnAdminAccess'] as SourceType}>
          <YesNoSelect value={input.security.mfaOnAdminAccess} onChange={v => setSec('mfaOnAdminAccess', v as 'yes' | 'no')} />
        </Field>
        <Field label="Chiffrement (repos + transit)" source={inputSources['encryption'] as SourceType}>
          <select value={input.security.encryption} onChange={e => setSec('encryption', e.target.value as 'full' | 'partial' | 'none')} className={selectCls}>
            <option value="full">Complet</option>
            <option value="partial">Partiel</option>
            <option value="none">Absent</option>
          </select>
        </Field>
        <Field label="Conformité RGPD documentée" source={inputSources['rgpdDocumented'] as SourceType}>
          <YesNoSelect value={input.security.rgpdDocumented} onChange={v => setSec('rgpdDocumented', v as 'yes' | 'no')} />
        </Field>
        <Field label="Incident de sécurité actif en cours" source={inputSources['activeSecurityIncident'] as SourceType}>
          <YesNoSelect value={input.security.activeSecurityIncident} onChange={v => setSec('activeSecurityIncident', v as 'yes' | 'no')} />
        </Field>
        <Field label="Certification externe (ISO 27001 / SOC 2)" source={inputSources['externalCertification'] as SourceType}>
          <select value={input.security.externalCertification} onChange={e => setSec('externalCertification', e.target.value as 'yes' | 'in_progress' | 'no')} className={selectCls}>
            <option value="yes">Obtenue</option>
            <option value="in_progress">En cours</option>
            <option value="no">Non</option>
          </select>
        </Field>
      </Section>

      {/* SOUS-CODES DÉTAILLÉS CIFS */}
      <div className="border border-gray-200 bg-white">
        <div className="px-5 py-3 bg-gray-50 flex items-center justify-between">
          <p className="font-mono text-[10px] uppercase tracking-widest text-gray-600 font-semibold">
            Sous-codes détaillés
          </p>
          <p className="font-sans text-[10px] text-gray-400">
            Cochez toutes les remarques applicables — alimente la notation et le refus automatique.
          </p>
        </div>
        <div className="px-5 py-4 grid grid-cols-1 gap-6 sm:grid-cols-2">

          {/* C — Code */}
          <div>
            <p className="font-mono text-[10px] uppercase tracking-widest text-gray-500 mb-1 border-b border-gray-100 pb-2">
              C — Code
            </p>
            <DocList dims={['C']} docsByCategory={docsByCategory} />
            <div className="mb-3" />
            <p className="font-sans text-[10px] text-gray-400 mb-2 uppercase tracking-widest">Tests</p>
            {([
              { id: 'C-11', label: 'Tests unitaires complets (>80% coverage)', field: 'testCoverage', value: 85 },
              { id: 'C-12', label: 'Tests partiels (40-80% coverage)',          field: 'testCoverage', value: 60 },
              { id: 'C-13', label: 'Tests insuffisants (<40% coverage)',         field: 'testCoverage', value: 20 },
              { id: 'C-14', label: 'Tests absents',                              field: 'testCoverage', value: 0 },
            ] as const).map(item => {
              const isChecked = (() => {
                if (item.id === 'C-11') return input.code.testCoverage >= 80
                if (item.id === 'C-12') return input.code.testCoverage >= 40 && input.code.testCoverage < 80
                if (item.id === 'C-13') return input.code.testCoverage > 0 && input.code.testCoverage < 40
                return input.code.testCoverage === 0
              })()
              return (
                <label key={item.id} className="flex items-start gap-2 cursor-pointer mb-1.5">
                  <input type="checkbox" checked={isChecked}
                    onChange={() => setCode('testCoverage', item.value, 'subcode')}
                    className="mt-0.5 w-4 h-4 border border-gray-300 accent-ag-navy shrink-0"
                  />
                  <span className="font-sans text-[11px] text-gray-700">
                    <span className="font-mono text-[10px] text-gray-400 mr-1">{item.id}</span>
                    {item.label}
                  </span>
                </label>
              )
            })}

            <p className="font-sans text-[10px] text-gray-400 mt-3 mb-2 uppercase tracking-widest">CI/CD & Architecture</p>
            {([
              { id: 'C-21', label: 'CI/CD fonctionnel et automatisé',        action: () => setCode('ciCdFunctional', 'yes', 'subcode') },
              { id: 'C-22', label: 'CI/CD absent',                            action: () => setCode('ciCdFunctional', 'no', 'subcode') },
              { id: 'C-31', label: 'Architecture découplée / scalable',       action: () => setCode('architecture', 'decoupled', 'subcode') },
              { id: 'C-32', label: 'Architecture partiellement découplée',    action: () => setCode('architecture', 'partial', 'subcode') },
              { id: 'C-33', label: 'Architecture monolithique',               action: () => setCode('architecture', 'monolithic', 'subcode') },
            ] as const).map(item => {
              const isChecked = (() => {
                if (item.id === 'C-21') return input.code.ciCdFunctional === 'yes'
                if (item.id === 'C-22') return input.code.ciCdFunctional === 'no'
                if (item.id === 'C-31') return input.code.architecture === 'decoupled'
                if (item.id === 'C-32') return input.code.architecture === 'partial'
                if (item.id === 'C-33') return input.code.architecture === 'monolithic'
                return false
              })()
              return (
                <label key={item.id} className="flex items-start gap-2 cursor-pointer mb-1.5">
                  <input type="checkbox" checked={isChecked}
                    onChange={() => item.action()}
                    className="mt-0.5 w-4 h-4 border border-gray-300 accent-ag-navy shrink-0"
                  />
                  <span className="font-sans text-[11px] text-gray-700">
                    <span className="font-mono text-[10px] text-gray-400 mr-1">{item.id}</span>
                    {item.label}
                  </span>
                </label>
              )
            })}
          </div>

          {/* I — IP & Droits */}
          <div>
            <p className="font-mono text-[10px] uppercase tracking-widest text-gray-500 mb-1 border-b border-gray-100 pb-2">
              I — IP & Droits
            </p>
            <DocList dims={['I']} docsByCategory={docsByCategory} />
            <div className="mb-3" />
            <p className="font-sans text-[10px] text-gray-400 mb-2 uppercase tracking-widest">Marques & Identité</p>
            {([
              { id: 'I-11', label: 'Marque verbale déposée (pays principal)',           action: () => setIP('trademarksJurisdictions', Math.max(1, input.ip.trademarksJurisdictions), 'subcode') },
              { id: 'I-12', label: 'Marque combinée déposée',                           action: () => setIP('trademarksJurisdictions', Math.max(2, input.ip.trademarksJurisdictions), 'subcode') },
              { id: 'I-13', label: 'Marque déposée — extension internationale (EUIPO/WIPO)', action: () => setIP('trademarksJurisdictions', Math.max(3, input.ip.trademarksJurisdictions), 'subcode') },
              { id: 'I-14', label: 'Marque en cours de dépôt',                          action: () => setIP('trademarksJurisdictions', 0, 'subcode') },
            ] as const).map(item => {
              const isChecked = (() => {
                if (item.id === 'I-11') return input.ip.trademarksJurisdictions >= 1
                if (item.id === 'I-12') return input.ip.trademarksJurisdictions >= 2
                if (item.id === 'I-13') return input.ip.trademarksJurisdictions >= 3
                if (item.id === 'I-14') return input.ip.trademarksJurisdictions === 0
                return false
              })()
              return (
                <label key={item.id} className="flex items-start gap-2 cursor-pointer mb-1.5">
                  <input type="checkbox" checked={isChecked}
                    onChange={() => item.action()}
                    className="mt-0.5 w-4 h-4 border border-gray-300 accent-ag-navy shrink-0"
                  />
                  <span className="font-sans text-[11px] text-gray-700">
                    <span className="font-mono text-[10px] text-gray-400 mr-1">{item.id}</span>
                    {item.label}
                  </span>
                </label>
              )
            })}

            <p className="font-sans text-[10px] text-gray-400 mt-3 mb-2 uppercase tracking-widest">Droits & RGPD</p>
            {([
              { id: 'I-21', label: 'Droits IP employés complets',      action: () => setIP('employeeIPRights', 'complete', 'subcode') },
              { id: 'I-22', label: 'Droits IP partiels',               action: () => setIP('employeeIPRights', 'partial', 'subcode') },
              { id: 'I-23', label: 'Droits IP absents',                action: () => setIP('employeeIPRights', 'absent', 'subcode') },
              { id: 'I-31', label: 'Conformité RGPD complète',         action: () => setIP('rgpdCompliance', 'complete', 'subcode') },
              { id: 'I-32', label: 'Conformité RGPD partielle',        action: () => setIP('rgpdCompliance', 'partial', 'subcode') },
              { id: 'I-33', label: 'Conformité RGPD absente',          action: () => setIP('rgpdCompliance', 'absent', 'subcode') },
            ] as const).map(item => {
              const isChecked = (() => {
                if (item.id === 'I-21') return input.ip.employeeIPRights === 'complete'
                if (item.id === 'I-22') return input.ip.employeeIPRights === 'partial'
                if (item.id === 'I-23') return input.ip.employeeIPRights === 'absent'
                if (item.id === 'I-31') return input.ip.rgpdCompliance === 'complete'
                if (item.id === 'I-32') return input.ip.rgpdCompliance === 'partial'
                if (item.id === 'I-33') return input.ip.rgpdCompliance === 'absent'
                return false
              })()
              return (
                <label key={item.id} className="flex items-start gap-2 cursor-pointer mb-1.5">
                  <input type="checkbox" checked={isChecked}
                    onChange={() => item.action()}
                    className="mt-0.5 w-4 h-4 border border-gray-300 accent-ag-navy shrink-0"
                  />
                  <span className="font-sans text-[11px] text-gray-700">
                    <span className="font-mono text-[10px] text-gray-400 mr-1">{item.id}</span>
                    {item.label}
                  </span>
                </label>
              )
            })}
          </div>

          {/* F — Finance */}
          <div>
            <p className="font-mono text-[10px] uppercase tracking-widest text-gray-500 mb-1 border-b border-gray-100 pb-2">
              F — Finance
            </p>
            <DocList dims={['F']} docsByCategory={docsByCategory} />
            <div className="mb-3" />
            <p className="font-sans text-[10px] text-gray-400 mb-2 uppercase tracking-widest">ARR & Audit</p>
            {([
              { id: 'F-11', label: 'ARR audité par commissaire aux comptes',   action: () => setFin('arrAudited', 'yes', 'subcode') },
              { id: 'F-12', label: 'ARR non audité',                           action: () => setFin('arrAudited', 'no', 'subcode') },
              { id: 'F-21', label: 'Marge brute >70%',    action: () => setFin('grossMargin', 75, 'subcode') },
              { id: 'F-22', label: 'Marge brute 40-70%',  action: () => setFin('grossMargin', 55, 'subcode') },
              { id: 'F-23', label: 'Marge brute <40%',    action: () => setFin('grossMargin', 25, 'subcode') },
              { id: 'F-31', label: 'Churn mensuel <1%',   action: () => setFin('monthlyChurn', 0.5, 'subcode') },
              { id: 'F-32', label: 'Churn mensuel 1-3%',  action: () => setFin('monthlyChurn', 2, 'subcode') },
              { id: 'F-33', label: 'Churn mensuel >3%',   action: () => setFin('monthlyChurn', 5, 'subcode') },
            ] as const).map(item => {
              const isChecked = (() => {
                if (item.id === 'F-11') return input.finance.arrAudited === 'yes'
                if (item.id === 'F-12') return input.finance.arrAudited === 'no'
                if (item.id === 'F-21') return input.finance.grossMargin >= 70
                if (item.id === 'F-22') return input.finance.grossMargin >= 40 && input.finance.grossMargin < 70
                if (item.id === 'F-23') return input.finance.grossMargin < 40
                if (item.id === 'F-31') return input.finance.monthlyChurn < 1
                if (item.id === 'F-32') return input.finance.monthlyChurn >= 1 && input.finance.monthlyChurn <= 3
                if (item.id === 'F-33') return input.finance.monthlyChurn > 3
                return false
              })()
              return (
                <label key={item.id} className="flex items-start gap-2 cursor-pointer mb-1.5">
                  <input type="checkbox" checked={isChecked}
                    onChange={() => item.action()}
                    className="mt-0.5 w-4 h-4 border border-gray-300 accent-ag-navy shrink-0"
                  />
                  <span className="font-sans text-[11px] text-gray-700">
                    <span className="font-mono text-[10px] text-gray-400 mr-1">{item.id}</span>
                    {item.label}
                  </span>
                </label>
              )
            })}
          </div>

          {/* S — Sécurité */}
          <div>
            <p className="font-mono text-[10px] uppercase tracking-widest text-gray-500 mb-1 border-b border-gray-100 pb-2">
              S — Sécurité
            </p>
            <DocList dims={['S']} docsByCategory={docsByCategory} />
            <div className="mb-3" />
            <p className="font-sans text-[10px] text-gray-400 mb-2 uppercase tracking-widest">Pentest & MFA</p>
            {([
              { id: 'S-11', label: 'Pentest < 12 mois',   action: () => setSec('lastPentestMonthsAgo', 6, 'subcode') },
              { id: 'S-12', label: 'Pentest 12-24 mois',  action: () => setSec('lastPentestMonthsAgo', 18, 'subcode') },
              { id: 'S-13', label: 'Pentest > 24 mois',   action: () => setSec('lastPentestMonthsAgo', 36, 'subcode') },
              { id: 'S-14', label: 'Jamais de pentest',   action: () => setSec('lastPentestMonthsAgo', 9999, 'subcode') },
              { id: 'S-21', label: 'MFA sur tous les accès admin',    action: () => setSec('mfaOnAdminAccess', 'yes', 'subcode') },
              { id: 'S-22', label: 'MFA absent ou partiel',           action: () => setSec('mfaOnAdminAccess', 'no', 'subcode') },
              { id: 'S-31', label: 'Chiffrement complet (repos + transit)', action: () => setSec('encryption', 'full', 'subcode') },
              { id: 'S-32', label: 'Chiffrement partiel',             action: () => setSec('encryption', 'partial', 'subcode') },
              { id: 'S-33', label: 'Chiffrement absent',              action: () => setSec('encryption', 'none', 'subcode') },
              { id: 'S-41', label: 'Certification ISO 27001 / SOC 2 obtenue', action: () => setSec('externalCertification', 'yes', 'subcode') },
              { id: 'S-42', label: 'Certification en cours',          action: () => setSec('externalCertification', 'in_progress', 'subcode') },
              { id: 'S-43', label: 'Aucune certification',            action: () => setSec('externalCertification', 'no', 'subcode') },
            ] as const).map(item => {
              const isChecked = (() => {
                if (item.id === 'S-11') return input.security.lastPentestMonthsAgo < 12
                if (item.id === 'S-12') return input.security.lastPentestMonthsAgo >= 12 && input.security.lastPentestMonthsAgo < 24
                if (item.id === 'S-13') return input.security.lastPentestMonthsAgo >= 24 && input.security.lastPentestMonthsAgo < 9999
                if (item.id === 'S-14') return input.security.lastPentestMonthsAgo >= 9999
                if (item.id === 'S-21') return input.security.mfaOnAdminAccess === 'yes'
                if (item.id === 'S-22') return input.security.mfaOnAdminAccess === 'no'
                if (item.id === 'S-31') return input.security.encryption === 'full'
                if (item.id === 'S-32') return input.security.encryption === 'partial'
                if (item.id === 'S-33') return input.security.encryption === 'none'
                if (item.id === 'S-41') return input.security.externalCertification === 'yes'
                if (item.id === 'S-42') return input.security.externalCertification === 'in_progress'
                if (item.id === 'S-43') return input.security.externalCertification === 'no'
                return false
              })()
              return (
                <label key={item.id} className="flex items-start gap-2 cursor-pointer mb-1.5">
                  <input type="checkbox" checked={isChecked}
                    onChange={() => item.action()}
                    className="mt-0.5 w-4 h-4 border border-gray-300 accent-ag-navy shrink-0"
                  />
                  <span className="font-sans text-[11px] text-gray-700">
                    <span className="font-mono text-[10px] text-gray-400 mr-1">{item.id}</span>
                    {item.label}
                  </span>
                </label>
              )
            })}
          </div>

        </div>
      </div>

      {/* Hidden input pour pont vers GradeForm (P4) */}
      <input type="hidden" id="__engine_grade__" value={liveScore.grade} />

      {/* CTA */}
      <div className="pt-2">
        <button type="button" onClick={compute} disabled={computing}
          className="flex items-center gap-2 bg-ag-navy text-white font-mono text-[11px] uppercase tracking-widest px-6 py-3 hover:bg-ag-navy/80 transition-colors disabled:opacity-50">
          <Calculator size={14} />
          {computing ? 'Calcul en cours…' : 'Calculer le grade'}
        </button>
      </div>
      </div>{/* fin colonne gauche */}

      {/* Colonne droite — score live */}
      <LiveScorePanel live={liveScore} />

    </div>
  )

  // ── Rendu résultat ─────────────────────────────────────────────────────────
  if (step === 'result' && result) {
    const displayGrade = (overrideGrade || result.grade) as GradeLetter
    const gradeCls = GRADE_COLORS[displayGrade] ?? GRADE_COLORS.b

    return (
      <div className="space-y-5">

        {/* Score par dimension */}
        <div className="bg-white border border-gray-200 p-5">
          <p className="font-mono text-[9px] uppercase tracking-widest text-gray-400 mb-4">Résultat du calcul</p>
          <div className="space-y-2 mb-5">
            <ScoreBar label="Code"     score={result.dimensions.code.score} />
            <ScoreBar label="IP"       score={result.dimensions.ip.score} />
            <ScoreBar label="Finance"  score={result.dimensions.finance.score} />
            <ScoreBar label="Sécurité" score={result.dimensions.security.score} />
          </div>
          <div className="flex items-end justify-between border-t border-gray-100 pt-4">
            <div>
              <p className="font-mono text-[9px] uppercase tracking-widest text-gray-400 mb-0.5">Score total</p>
              <p className="font-sans font-bold text-[28px] text-gray-900">{result.totalScore}<span className="text-[16px] text-gray-400">/100</span></p>
            </div>
            <div className={`border px-4 py-2 text-center ${gradeCls}`}>
              <p className="font-mono text-[9px] uppercase tracking-widest mb-0.5 opacity-70">Grade calculé</p>
              <p className="font-sans font-bold text-[22px] tracking-tight">{result.gradeLabel}</p>
            </div>
          </div>
        </div>

        {/* Refus automatique */}
        {result.autoRefusal && (
          <div className="bg-red-50 border border-red-200 p-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle size={14} className="text-red-500" />
              <p className="font-mono text-[10px] uppercase tracking-widest text-red-600">Refus automatique déclenché</p>
            </div>
            <ul className="space-y-1">
              {result.refusalReasons.map((r, i) => (
                <li key={i} className="font-sans text-[12px] text-red-700">· {r}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Rationnel par dimension */}
        <div className="bg-white border border-gray-200 p-5 space-y-4">
          <p className="font-mono text-[9px] uppercase tracking-widest text-gray-400">Rationnel par dimension</p>
          {(['code', 'ip', 'finance', 'security'] as const).map(dim => {
            const d = result.dimensions[dim]
            const labels: Record<string, string> = { code: 'Code', ip: 'IP & Droits', finance: 'Finance', security: 'Sécurité' }
            return (
              <div key={dim}>
                <p className="font-sans font-semibold text-[12px] text-gray-700 mb-1">{labels[dim]} — {d.score}/25</p>
                <ul className="space-y-0.5">
                  {d.rationale.map((r, i) => (
                    <li key={i} className="font-sans text-[12px] text-gray-500">· {r}</li>
                  ))}
                </ul>
              </div>
            )
          })}
        </div>

        {/* Override admin */}
        <div className="bg-white border border-gray-200 p-5 space-y-4">
          <p className="font-mono text-[9px] uppercase tracking-widest text-gray-400">Ajustement administrateur</p>

          <div>
            <label className="block font-sans text-[12px] text-gray-700 mb-1">
              Grade final retenu <span className="text-gray-400">(laisser vide = grade calculé)</span>
            </label>
            <select value={overrideGrade} onChange={e => setOverrideGrade(e.target.value as GradeLetter | '')} className={selectCls}>
              <option value="">— Grade calculé ({result.gradeLabel})</option>
              <option value="star">AEG ★</option>
              <option value="aaa">AAA</option>
              <option value="aa">AA</option>
              <option value="a">A</option>
              <option value="b">B</option>
              <option value="refused">Non certifiable</option>
            </select>
          </div>

          {overrideGrade && overrideGrade !== result.grade && (
            <div>
              <label className="block font-sans text-[12px] text-gray-700 mb-1">
                Justification interne <span className="text-red-500">*</span>
                <span className="text-gray-400 ml-1">(usage interne uniquement, jamais visible client)</span>
              </label>
              <textarea value={overrideNote} onChange={e => setOverrideNote(e.target.value)}
                rows={3} placeholder="Ex : score code pénalisé par une migration en cours non capturée par les métriques statiques…"
                className={`${inputCls} resize-none`} />
            </div>
          )}

          {/* Rationnel public éditable */}
          <div>
            <label className="block font-sans text-[12px] text-gray-700 mb-1">
              Rationnel public <span className="text-gray-400">(affiché dans la fiche actif, éditable)</span>
            </label>
            <textarea value={publicRationale} onChange={e => setPublicRationale(e.target.value)}
              rows={4} className={`${inputCls} resize-none`} />
          </div>
        </div>

        {/* Status message */}
        {statusMsg && (
          <div className={`p-3 border text-[12px] font-sans ${statusMsg.startsWith('✅') ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-red-50 border-red-200 text-red-700'}`}>
            {statusMsg}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-3 flex-wrap">
          <button type="button" onClick={() => setStep('input')}
            className="font-mono text-[10px] uppercase tracking-widest text-gray-400 border border-gray-300 px-4 py-2 hover:border-gray-500 transition-colors">
            ← Modifier les données
          </button>
          <button type="button" onClick={validate} disabled={validating}
            className="flex items-center gap-2 bg-ag-navy text-white font-mono text-[11px] uppercase tracking-widest px-5 py-2.5 hover:bg-ag-navy/80 transition-colors disabled:opacity-50">
            <CheckCircle2 size={13} />
            {validating ? 'Validation…' : 'Valider le grade'}
          </button>
          <button type="button" onClick={publish} disabled={publishing}
            className="flex items-center gap-2 bg-ag-apex text-ag-navy font-mono text-[11px] uppercase tracking-widest px-5 py-2.5 hover:bg-ag-apex/80 transition-colors disabled:opacity-50">
            <Send size={13} />
            {publishing ? 'Publication…' : 'Publier sur la fiche actif'}
          </button>
        </div>
      </div>
    )
  }

  return null
}
