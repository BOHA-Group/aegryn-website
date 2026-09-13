'use client'

import { useState } from 'react'
import { RefreshCw, ShieldCheck, ShieldAlert } from 'lucide-react'
import type { Prescore } from '@/lib/prescore'

const STATE_CLS: Record<string, string> = {
  ready:   'text-emerald-700 bg-emerald-50 border-emerald-200',
  partial: 'text-amber-700 bg-amber-50 border-amber-200',
  blocked: 'text-red-700 bg-red-50 border-red-200',
}
const STATE_LABEL: Record<string, string> = { ready: 'Prêt', partial: 'À vérifier', blocked: 'Bloqué' }
const PQ_LABEL: Record<string, string> = { declarative: 'Déclaratif', verifiable: 'Vérifiable', audited: 'Audité' }

export default function PrescorePanel({ assetId, initial, kycStatus, dossierType }: {
  assetId: string; initial: Prescore | null; kycStatus: string | null; dossierType: string
}) {
  const [p, setP]       = useState<Prescore | null>(initial)
  const [busy, setBusy] = useState(false)

  async function refresh() {
    setBusy(true)
    const res = await fetch(`/api/admin/assets/${assetId}/prescore`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{}' })
    const json = await res.json()
    if (res.ok) setP(json.prescore)
    setBusy(false)
  }

  const kycOk = kycStatus === 'approved'

  return (
    <section className="bg-white border border-gray-200 p-6 mb-6">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-widest text-gray-400 mb-1">Pré-scoring documentaire automatique</p>
          <h2 className="font-sans font-bold text-gray-900 text-[14px]">
            Complétude {p ? `${p.completeness} %` : '—'} · {dossierType === 'certification' ? 'Certification CIFSO 5000' : 'Transaction'}
          </h2>
          <p className="font-sans text-[11px] text-gray-500 mt-0.5">
            Calculé à partir des pièces déposées et vérifiées dans la Data Room. La qualité de preuve suggérée plafonne le grade ; la revue manuelle (admin ou expert mandaté) reste décisive.
          </p>
        </div>
        <button onClick={refresh} disabled={busy}
          className="rounded-lg inline-flex items-center gap-1.5 border border-gray-200 px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest text-gray-600 hover:border-gray-900 disabled:opacity-50 shrink-0">
          <RefreshCw size={11} className={busy ? 'animate-spin' : ''} /> Recalculer
        </button>
      </div>

      {/* Garde KYC/KYB avant grading */}
      <div className={`rounded-lg border px-4 py-2.5 mb-4 flex items-center gap-2 text-[12px] ${kycOk ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-amber-50 border-amber-300 text-amber-900'}`}>
        {kycOk ? <ShieldCheck size={14} /> : <ShieldAlert size={14} />}
        {kycOk
          ? 'KYC/KYB du demandeur approuvé : le grade peut être publié.'
          : `KYC/KYB du demandeur non approuvé (${kycStatus ?? 'non démarré'}) : le calcul et la validation restent possibles, la publication du grade est bloquée.`}
      </div>

      {p ? (
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
          {p.dimensions.map(d => (
            <div key={d.dimension} className={`rounded-lg border px-3 py-2.5 ${STATE_CLS[d.state]}`}>
              <div className="flex items-center justify-between mb-1">
                <span className="font-sans font-bold text-[14px]">{d.letter}</span>
                <span className="font-mono text-[9px] uppercase tracking-widest">{STATE_LABEL[d.state]}</span>
              </div>
              <p className="font-sans text-[11px]">Bloquants {d.blockingOk}/{d.blockingTotal}{d.blockingPending ? ` (+${d.blockingPending} à vérifier)` : ''}</p>
              <p className="font-sans text-[11px]">Recommandés {d.recommendedOk}/{d.recommendedTotal}</p>
              <p className="font-mono text-[9px] uppercase tracking-widest mt-1 opacity-80">Preuve : {PQ_LABEL[d.proofQuality]}</p>
              {d.missingCodes.length > 0 && (
                <p className="font-mono text-[9px] mt-1 opacity-70 break-words">{d.missingCodes.join(' · ')}</p>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="font-sans text-[12px] text-gray-400">Aucun pré-scoring : cliquez sur « Recalculer » après le dépôt des premières pièces.</p>
      )}

      {p && (
        <p className={`font-sans text-[11px] mt-3 ${p.canGrade ? 'text-emerald-700' : 'text-red-700'}`}>
          {p.canGrade
            ? 'Aucune pièce bloquante manquante ou insuffisante : le dossier est gradable.'
            : 'Des pièces bloquantes manquent ou sont insuffisantes : la publication du grade est bloquée (Pre-Grade possible).'}
          {p.needsReview.length > 0 && ` ${p.needsReview.length} pièce(s) en attente de vérification.`}
        </p>
      )}
    </section>
  )
}
