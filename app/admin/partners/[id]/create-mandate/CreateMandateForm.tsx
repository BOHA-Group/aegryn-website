'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

type Props = {
  partnerId: string
  adminToken?: string
  assets: { id: string; name: string }[]
  backHref: string
}

export default function CreateMandateForm({ partnerId, adminToken, assets, backHref }: Props) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [error, setError]   = useState('')

  const [clientName,  setClientName]  = useState('')
  const [clientEmail, setClientEmail] = useState('')
  const [clientType,  setClientType]  = useState<'seller' | 'buyer' | 'other'>('seller')
  const [mandateType, setMandateType] = useState<'advisory' | 'due_diligence' | 'fundraising' | 'other'>('advisory')
  const [description, setDescription] = useState('')
  const [assetId,     setAssetId]     = useState('')
  const [retroPct,    setRetroPct]    = useState('15')
  const [startedAt,   setStartedAt]   = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError('')

    const res = await fetch('/api/admin/partner-mandates', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        token: adminToken ?? '',
        partner_id: partnerId,
        client_name: clientName,
        client_email: clientEmail,
        client_type: clientType,
        mandate_type: mandateType,
        description: description || undefined,
        asset_id: assetId || undefined,
        retrocession_pct: parseFloat(retroPct) || 15,
        started_at: startedAt || undefined,
        status: 'active',
      }),
    })

    const json = await res.json() as { error?: string; id?: string }

    if (!res.ok) {
      setError(json.error ?? 'Erreur lors de la création du mandat.')
      setSaving(false)
      return
    }

    router.push(backHref)
    router.refresh()
  }

  const inputCls = 'w-full border border-gray-200 bg-white px-3 py-2.5 text-[12px] font-mono focus:outline-none focus:border-gray-500 transition-colors'
  const labelCls = 'block text-[10px] font-semibold uppercase tracking-widest text-gray-400 mb-1.5'

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-gray-200 p-6 flex flex-col gap-5">
      {error && (
        <div className="bg-red-50 border border-red-200 p-3 text-[12px] text-red-700">{error}</div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelCls}>Nom du client *</label>
          <input required className={inputCls} value={clientName} onChange={e => setClientName(e.target.value)} placeholder="Nom complet / société" />
        </div>
        <div>
          <label className={labelCls}>Email du client *</label>
          <input required type="email" className={inputCls} value={clientEmail} onChange={e => setClientEmail(e.target.value)} placeholder="client@exemple.com" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelCls}>Type de client</label>
          <select className={inputCls} value={clientType} onChange={e => setClientType(e.target.value as typeof clientType)}>
            <option value="seller">Vendeur</option>
            <option value="buyer">Acquéreur</option>
            <option value="other">Autre</option>
          </select>
        </div>
        <div>
          <label className={labelCls}>Nature de la mission</label>
          <select className={inputCls} value={mandateType} onChange={e => setMandateType(e.target.value as typeof mandateType)}>
            <option value="advisory">Conseil stratégique</option>
            <option value="due_diligence">Due diligence</option>
            <option value="fundraising">Levée de fonds</option>
            <option value="other">Autre</option>
          </select>
        </div>
      </div>

      <div>
        <label className={labelCls}>Description de la mission</label>
        <textarea className={inputCls} rows={3} value={description} onChange={e => setDescription(e.target.value)} placeholder="Détail de la mission…" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelCls}>Actif AEGRYN associé (optionnel)</label>
          <select className={inputCls} value={assetId} onChange={e => setAssetId(e.target.value)}>
            <option value="">— Aucun —</option>
            {assets.map(a => (
              <option key={a.id} value={a.id}>{a.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelCls}>Date de démarrage</label>
          <input type="date" className={inputCls} value={startedAt} onChange={e => setStartedAt(e.target.value)} />
        </div>
      </div>

      <div>
        <label className={labelCls}>Rétrocession AEGRYN (%)</label>
        <input
          type="number"
          min="0"
          max="100"
          step="0.5"
          className={inputCls}
          value={retroPct}
          onChange={e => setRetroPct(e.target.value)}
        />
        <p className="text-[10px] text-gray-400 mt-1">Standard CAS 3 : 15% des honoraires facturés par le partenaire à son client.</p>
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={saving}
          className="bg-gray-900 text-white text-[11px] font-semibold uppercase tracking-wide px-5 py-2.5 hover:bg-gray-700 transition-colors disabled:opacity-50"
        >
          {saving ? 'Création…' : 'Créer le mandat'}
        </button>
        <a
          href={backHref}
          className="border border-gray-300 text-gray-600 text-[11px] font-semibold uppercase tracking-wide px-5 py-2.5 hover:border-gray-500 transition-colors"
        >
          Annuler
        </a>
      </div>
    </form>
  )
}
