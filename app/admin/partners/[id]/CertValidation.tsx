'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { CheckCircle2, XCircle, ChevronDown, ChevronUp } from 'lucide-react'

type Cert = {
  id: string
  dimension: string
  status: string
  score: number | null
  observations: string | null
  subcodes: string[]
  deadline_at: string | null
  cosignature_amount_chf: number | null
  assets: { name?: string; company_name?: string; official_grade?: string | null } | null
}

const DIMENSION_LABELS: Record<string, string> = {
  code:     'Code',
  ip:       'IP & Juridique',
  finance:  'Finance',
  security: 'Sécurité',
}

const STATUS_COLORS: Record<string, string> = {
  assigned:  'bg-gray-100 text-gray-600',
  in_review: 'bg-blue-100 text-blue-700',
  submitted: 'bg-amber-100 text-amber-700',
  validated: 'bg-emerald-100 text-emerald-700',
  rejected:  'bg-red-100 text-red-600',
  expired:   'bg-gray-100 text-gray-400',
}

function CertRow({ cert, adminToken }: { cert: Cert; adminToken: string }) {
  const router = useRouter()
  const [open,      setOpen]      = useState(false)
  const [saving,    setSaving]    = useState(false)
  const [error,     setError]     = useState('')
  const [amount,    setAmount]    = useState(String(cert.cosignature_amount_chf ?? ''))
  const [reason,    setReason]    = useState('')

  const asset = cert.assets
  const assetName = asset?.name ?? asset?.company_name ?? `#${cert.id.slice(0, 8)}`
  const canValidate = cert.status === 'submitted'

  async function act(action: 'validate' | 'reject') {
    setSaving(true)
    setError('')
    const res = await fetch(`/api/admin/partner-certifications/${cert.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        token: adminToken,
        action,
        cosignature_amount_chf: amount ? parseFloat(amount) : undefined,
        rejection_reason: reason || undefined,
      }),
    })
    const json = await res.json() as { error?: string }
    if (!res.ok) { setError(json.error ?? 'Erreur'); setSaving(false); return }
    router.refresh()
  }

  return (
    <div className="border-b border-gray-100 last:border-0">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors text-left"
      >
        <div className="flex items-center gap-4">
          <div>
            <p className="font-semibold text-gray-800 text-[13px]">
              {assetName} — <span className="font-mono text-[11px] text-gray-500">{DIMENSION_LABELS[cert.dimension] ?? cert.dimension}</span>
            </p>
            <div className="flex items-center gap-3 mt-0.5">
              {cert.score != null && (
                <span className="font-mono text-[11px] text-gray-500">Score : {cert.score}/25</span>
              )}
              {cert.deadline_at && (
                <span className="font-mono text-[10px] text-gray-400">Délai : {cert.deadline_at.slice(0, 10)}</span>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <span className={`px-2 py-0.5 text-[10px] uppercase font-semibold ${STATUS_COLORS[cert.status] ?? STATUS_COLORS.assigned}`}>
            {cert.status}
          </span>
          {open ? <ChevronUp size={13} className="text-gray-400" /> : <ChevronDown size={13} className="text-gray-400" />}
        </div>
      </button>

      {open && (
        <div className="px-6 pb-5 flex flex-col gap-4 bg-gray-50/50">
          {/* Détails soumis */}
          {cert.observations && (
            <div>
              <p className="text-[9px] font-mono uppercase tracking-widest text-gray-400 mb-1">Observations admin enregistrées</p>
              <p className="text-[12px] text-gray-700 leading-relaxed bg-white border border-gray-100 px-3 py-2">{cert.observations}</p>
            </div>
          )}
          {cert.subcodes && cert.subcodes.length > 0 && (
            <div>
              <p className="text-[9px] font-mono uppercase tracking-widest text-gray-400 mb-1">Sous-codes</p>
              <div className="flex flex-wrap gap-1.5">
                {cert.subcodes.map(code => (
                  <span key={code} className="font-mono text-[10px] border border-gray-200 bg-white px-2 py-0.5 text-gray-600">{code}</span>
                ))}
              </div>
            </div>
          )}

          {error && <p className="text-[11px] text-red-600">{error}</p>}

          {/* Actions de validation */}
          {canValidate && (
            <div className="flex flex-col sm:flex-row gap-3 pt-2 border-t border-gray-200">
              <div className="flex items-center gap-2 flex-1">
                <label className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 shrink-0">Honoraires CHF</label>
                <input
                  type="number"
                  min="0"
                  step="50"
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
                  placeholder="ex: 800"
                  className="border border-gray-200 px-3 py-1.5 text-[12px] font-mono w-32 focus:outline-none focus:border-gray-500"
                />
              </div>
              <div className="flex gap-2">
                <button
                  disabled={saving}
                  onClick={() => act('validate')}
                  className="flex items-center gap-1.5 bg-emerald-600 text-white text-[10px] font-semibold uppercase tracking-wide px-4 py-2 hover:bg-emerald-700 transition-colors disabled:opacity-50"
                >
                  <CheckCircle2 size={12} /> Valider
                </button>
                <button
                  disabled={saving}
                  onClick={() => act('reject')}
                  className="flex items-center gap-1.5 border border-red-200 text-red-600 text-[10px] font-semibold uppercase tracking-wide px-4 py-2 hover:border-red-400 transition-colors disabled:opacity-50"
                >
                  <XCircle size={12} /> Refuser
                </button>
              </div>
            </div>
          )}

          {canValidate && (
            <div>
              <label className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 mb-1 block">Motif de refus (optionnel)</label>
              <input
                type="text"
                value={reason}
                onChange={e => setReason(e.target.value)}
                placeholder="Méthodologie insuffisante, délai dépassé…"
                className="w-full border border-gray-200 px-3 py-1.5 text-[12px] focus:outline-none focus:border-gray-500"
              />
            </div>
          )}

          {!canValidate && cert.status === 'validated' && (
            <div className="flex items-center gap-2 text-[12px] text-emerald-700">
              <CheckCircle2 size={13} />
              Validé · Honoraires : {cert.cosignature_amount_chf != null ? `${Number(cert.cosignature_amount_chf).toLocaleString('fr-CH')} CHF` : 'non renseignés'}
            </div>
          )}
          {!canValidate && cert.status === 'rejected' && (
            <p className="text-[12px] text-red-600 flex items-center gap-1.5"><XCircle size={13} /> Refusé</p>
          )}
        </div>
      )}
    </div>
  )
}

export default function CertValidation({
  certs,
  adminToken,
}: {
  certs: Cert[]
  adminToken: string
}) {
  const submittedCount = certs.filter(c => c.status === 'submitted').length

  return (
    <div className="bg-white border border-gray-200 mb-6">
      <div className="px-6 py-4 bg-gray-50 flex items-center justify-between">
        <div>
          <p className="text-[11px] font-semibold text-gray-600 uppercase tracking-wide">
            Co-signatures assignées ({certs.length})
          </p>
          {submittedCount > 0 && (
            <p className="text-[10px] text-amber-600 mt-0.5">{submittedCount} en attente de validation</p>
          )}
        </div>
      </div>
      {certs.length === 0 ? (
        <div className="p-8 text-center text-[12px] text-gray-400">Aucune assignation pour le moment.</div>
      ) : (
        <div>
          {certs.map(c => (
            <CertRow key={c.id} cert={c} adminToken={adminToken} />
          ))}
        </div>
      )}
    </div>
  )
}
