'use client'

import { useState }    from 'react'
import { useRouter }   from 'next/navigation'
import { estimateGrade } from '@/lib/valuationEngine'
import { CheckCircle2, AlertTriangle } from 'lucide-react'
import ReviewBadge from '@/components/ui/ReviewBadge'

const DIMS = [
  { key: 'score_code',     label: 'C — Code',     desc: 'Qualité code, dette technique, tests, CI/CD' },
  { key: 'score_ip',       label: 'I — IP & Droits', desc: 'Marques, licences, brevets, cessibilité juridique' },
  { key: 'score_finance',  label: 'F — Finance',  desc: 'ARR/MRR, croissance, marges, CAC/LTV, burn' },
  { key: 'score_security', label: 'S — Sécurité', desc: 'RGPD, pentest, MFA, zero-trust, secrets' },
] as const

type DimKey = typeof DIMS[number]['key']

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

const inputCls  = 'w-full border border-gray-200 bg-white px-3 py-2.5 text-[12px] font-mono focus:outline-none focus:border-gray-500 transition-colors'
const labelCls  = 'block text-[10px] font-semibold uppercase tracking-widest text-gray-400 mb-1.5'
const sectionCls = 'bg-white border border-gray-200 p-6 flex flex-col gap-4'

export default function GradeForm({
  assetId, adminToken, initialStatus, evaluationType, partnerReviewerType,
}: {
  assetId: string
  adminToken: string
  initialStatus: string
  evaluationType?: string
  partnerReviewerType?: string
}) {
  const router = useRouter()

  const [scores, setScores] = useState<Record<DimKey, number>>({
    score_code: 0, score_ip: 0, score_finance: 0, score_security: 0,
  })

  const [cosigners, setCosigners] = useState({
    cosigner_legal: '', cosigner_legal_date: '',
    cosigner_account: '', cosigner_account_date: '',
    cosigner_cyber: '', cosigner_cyber_date: '',
  })

  const [kryv_hash,      setKryvHash]     = useState('')
  const [public_summary, setPublicSummary]= useState('')
  const [internal_notes, setInternalNotes]= useState('')
  const [status,         setStatus]       = useState(initialStatus)

  const [loading, setLoading] = useState(false)
  const [saved,   setSaved]   = useState(false)
  const [error,   setError]   = useState('')

  const evalType    = evaluationType ?? 'full_certification'
  const isReview    = evalType === 'review_internal'
  const isReviewPlus = evalType === 'review_partner'
  const isFull      = evalType === 'full_certification'

  /* ── Grade en temps réel ── */
  const total = scores.score_code + scores.score_ip + scores.score_finance + scores.score_security
  const { grade, multLow, multHigh } = estimateGrade(total)
  const gradeLabel = `${multLow}x – ${multHigh}x ARR`

  function setScore(k: DimKey, v: number) {
    setScores(prev => ({ ...prev, [k]: Math.min(25, Math.max(0, v)) }))
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setSaved(false)
    setError('')
    try {
      const res = await fetch(`/api/admin/assets/${assetId}/grade`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...scores, ...cosigners, kryv_hash, public_summary, internal_notes, status,
          token: adminToken,
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

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-6">

      {/* ── Bandeau type d'évaluation ── */}
      {!isFull && (
        <div className="bg-blue-50 border border-blue-200 px-5 py-3 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-mono uppercase tracking-widest text-blue-500 mb-0.5">Type d’évaluation</p>
            <p className="text-[13px] font-semibold text-blue-800">
              {isReviewPlus
                ? `AEGRYN Review+ — ${partnerReviewerType === 'legal' ? 'Cabinet juridique' : 'Expert-comptable'}`
                : 'AEGRYN Review'}
            </p>
          </div>
          <ReviewBadge
            label={isReviewPlus ? 'AEGRYN Review+' : 'AEGRYN Review'}
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

      {/* ── 4 sous-scores ── */}
      <div className={sectionCls}>
        <h2 className="text-[11px] font-semibold uppercase tracking-widest text-gray-500">Scores CIFS (0-25 chacun)</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {DIMS.map(({ key, label, desc }) => (
            <div key={key}>
              <label className={labelCls}>{label}</label>
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
          ))}
        </div>
      </div>

      {/* ── Co-signataires (full_certification = 3 ; review_partner = 1 seul ; review = masqué) ── */}
      {!isReview && (
        <div className={sectionCls}>
          <h2 className="text-[11px] font-semibold uppercase tracking-widest text-gray-500">Co-signataires</h2>
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

      {/* ── KRYV + Publication (full_certification seulement) ── */}
      <div className={sectionCls}>
        <h2 className="text-[11px] font-semibold uppercase tracking-widest text-gray-500">
          {isFull ? 'KRYV Protocol & Publication' : 'Rapport interne'}
        </h2>
        {isFull && (
          <div>
            <label className={labelCls}>Hash KRYV (saisie manuelle MVP)</label>
            <input type="text" value={kryv_hash} onChange={e => setKryvHash(e.target.value)}
              placeholder="0x..." className={inputCls} />
          </div>
        )}
        {!isFull && (
          <div className="bg-blue-50 border border-blue-100 px-4 py-2 text-[11px] text-blue-600">
            Hash KRYV et publication catalogue non disponibles pour ce type d’évaluation.
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
  )
}
