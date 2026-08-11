'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, CheckCircle2, XCircle } from 'lucide-react'

type Props = {
  certId: string
  currentStatus: string
  dimension: string
}

const SUBCODES: Record<string, { label: string; code: string }[]> = {
  ip: [
    { code: 'IP-REG', label: 'Droits enregistrés (brevets, marques, droits d\'auteur)' },
    { code: 'IP-ORIG', label: 'Originalité et non-contrefaçon vérifiées' },
    { code: 'IP-SCOPE', label: 'Périmètre géographique des droits' },
    { code: 'IP-RISK', label: 'Risques de litiges identifiés' },
    { code: 'IP-CHAIN', label: 'Chaîne de titre propre et documentée' },
  ],
  finance: [
    { code: 'FIN-REV', label: 'Récurrence des revenus vérifiée' },
    { code: 'FIN-MGMT', label: 'Cohérence des comptes de gestion' },
    { code: 'FIN-PROJ', label: 'Projections financières réalistes' },
    { code: 'FIN-DEBT', label: 'Passifs et dettes identifiés' },
    { code: 'FIN-CTRL', label: 'Contrôle interne adéquat' },
  ],
  security: [
    { code: 'SEC-INFRA', label: 'Sécurité de l\'infrastructure hébergée' },
    { code: 'SEC-DATA', label: 'Protection des données (RGPD / LPD)' },
    { code: 'SEC-PENTEST', label: 'Pentests récents et patch management' },
    { code: 'SEC-BCR', label: 'Plan de continuité (BCR/PRA)' },
    { code: 'SEC-CERT', label: 'Certifications de sécurité (ISO 27001, SOC 2…)' },
  ],
}

export default function CertificationForm({ certId, currentStatus, dimension }: Props) {
  const router = useRouter()
  const [score, setScore] = useState('')
  const [selectedSubcodes, setSelectedSubcodes] = useState<string[]>([])
  const [summary, setSummary] = useState('')
  const [reserves, setReserves] = useState('')
  const [recommendation, setRecommendation] = useState<'none' | 'review' | 'remediation'>('none')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  function toggleSubcode(code: string) {
    setSelectedSubcodes(prev =>
      prev.includes(code) ? prev.filter(c => c !== code) : [...prev, code]
    )
  }

  async function handleSubmit(action: 'submit' | 'decline') {
    setError('')
    if (action === 'submit') {
      const s = parseInt(score)
      if (isNaN(s) || s < 0 || s > 25) { setError('Le score doit être entre 0 et 25.'); return }
      if (!summary.trim()) { setError('L\'avis est obligatoire.'); return }
    }

    setLoading(true)
    try {
      const res = await fetch(`/api/partner/certifications/${certId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(action === 'decline'
          ? { action: 'decline' }
          : {
              action: 'submit',
              score: parseInt(score),
              subcodes: selectedSubcodes,
              summary,
              reserves: reserves || null,
              recommendation,
            }
        ),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error ?? 'Erreur lors de la soumission.')
      router.refresh()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erreur inattendue.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white border border-gray-200 p-6 mb-6">
      <p className="font-mono text-[9px] uppercase tracking-widest text-gray-300 mb-5">
        {currentStatus === 'assigned' ? 'Démarrer la co-signature' : 'Mettre à jour la co-signature'}
      </p>

      <div className="flex flex-col gap-5">
        {/* Score */}
        <div>
          <label className="font-mono text-[9px] uppercase tracking-widest text-gray-500 block mb-2">
            Score (0–25) *
          </label>
          <input
            type="number" min={0} max={25} step={1}
            value={score}
            onChange={e => setScore(e.target.value)}
            placeholder="ex. 21"
            className="w-32 bg-gray-50 border border-gray-300 px-3 py-2 font-mono text-[14px] text-gray-900 focus:outline-none focus:border-ag-navy transition-colors"
          />
        </div>

        {/* Sous-codes CIFS */}
        <div>
          <p className="font-mono text-[9px] uppercase tracking-widest text-gray-500 mb-3">
            Critères validés (sous-codes CIFS)
          </p>
          <div className="flex flex-col gap-2">
            {(SUBCODES[dimension as keyof typeof SUBCODES] ?? SUBCODES.ip).map(({ code, label }) => (
              <label key={code} className="flex items-start gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={selectedSubcodes.includes(code)}
                  onChange={() => toggleSubcode(code)}
                  className="mt-0.5 shrink-0"
                />
                <span className="font-sans text-[12px] text-gray-700 group-hover:text-gray-900 transition-colors">
                  <span className="font-mono text-[10px] text-gray-400 mr-2">{code}</span>
                  {label}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Avis */}
        <div>
          <label className="font-mono text-[9px] uppercase tracking-widest text-gray-500 block mb-2">
            Avis certifié (visible dans le rapport) *
          </label>
          <textarea
            rows={4}
            value={summary}
            onChange={e => setSummary(e.target.value)}
            placeholder="Décrivez votre analyse et les points clés validés sur cette dimension."
            className="w-full bg-gray-50 border border-gray-300 px-4 py-3 font-sans text-[12px] text-gray-900 focus:outline-none focus:border-ag-navy transition-colors resize-none"
          />
        </div>

        {/* Réserves */}
        <div>
          <label className="font-mono text-[9px] uppercase tracking-widest text-gray-500 block mb-2">
            Réserves (optionnel — visible si grade &lt; AAA)
          </label>
          <textarea
            rows={2}
            value={reserves}
            onChange={e => setReserves(e.target.value)}
            placeholder="Points d'attention ou conditions suspensives à mentionner."
            className="w-full bg-gray-50 border border-gray-300 px-4 py-3 font-sans text-[12px] text-gray-900 focus:outline-none focus:border-ag-navy transition-colors resize-none"
          />
        </div>

        {/* Recommandation */}
        <div>
          <p className="font-mono text-[9px] uppercase tracking-widest text-gray-500 mb-2">Recommandation globale</p>
          <div className="flex flex-wrap gap-2">
            {(['none', 'review', 'remediation'] as const).map(r => (
              <button key={r} type="button"
                onClick={() => setRecommendation(r)}
                className={`font-mono text-[10px] uppercase tracking-widest px-3 py-1.5 border transition-colors ${
                  recommendation === r
                    ? 'bg-ag-navy text-white border-ag-navy'
                    : 'text-gray-500 border-gray-300 hover:border-gray-500'
                }`}>
                {r === 'none' ? 'Aucune réserve' : r === 'review' ? 'Révision' : 'Remédiation'}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <p className="font-sans text-[12px] text-red-500 bg-red-50 border border-red-200 px-4 py-2.5">{error}</p>
        )}

        {/* Actions */}
        <div className="flex items-center gap-3 pt-2">
          <button
            onClick={() => handleSubmit('submit')}
            disabled={loading}
            className="flex items-center gap-2 bg-ag-navy text-white font-mono text-[10px] uppercase tracking-widest px-5 py-2.5 hover:bg-ag-black transition-colors disabled:opacity-50"
          >
            {loading ? <Loader2 size={11} className="animate-spin" /> : <CheckCircle2 size={11} />}
            Valider la co-signature
          </button>
          <button
            onClick={() => handleSubmit('decline')}
            disabled={loading}
            className="flex items-center gap-2 text-red-500 border border-red-200 font-mono text-[10px] uppercase tracking-widest px-5 py-2.5 hover:bg-red-50 transition-colors disabled:opacity-50"
          >
            <XCircle size={11} />
            Décliner la mission
          </button>
        </div>
      </div>
    </div>
  )
}
