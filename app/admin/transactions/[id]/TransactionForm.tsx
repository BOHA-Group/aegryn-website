'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

const STATUS_STEPS = [
  { key: 'ei_submitted',   label: 'EI soumise' },
  { key: 'ap_signed',      label: 'AP signé' },
  { key: 'escrow_paid',    label: 'Séquestre versé' },
  { key: 'dd_in_progress', label: 'DD en cours' },
  { key: 'signing',        label: 'Signing' },
  { key: 'closed',         label: 'Clôturé' },
] as const

const inputCls   = 'w-full border border-gray-200 bg-white px-3 py-2.5 text-[12px] font-mono focus:outline-none focus:border-gray-500 transition-colors'
const labelCls   = 'block text-[10px] font-semibold uppercase tracking-widest text-gray-400 mb-1.5'
const sectionCls = 'bg-white border border-gray-200 p-6 flex flex-col gap-4'

type Props = {
  transaction: Record<string, unknown>
  adminToken?: string
}

export default function TransactionForm({ transaction, adminToken }: Props) {
  const router = useRouter()
  const [saving, setSaving]   = useState(false)
  const [saved, setSaved]     = useState(false)
  const [error, setError]     = useState('')

  const [status, setStatus] = useState(String(transaction.status ?? 'ei_submitted'))
  const [escrowAmount, setEscrowAmount]     = useState(String(transaction.escrow_amount_chf ?? ''))
  const [escrowProvider, setEscrowProvider] = useState(String(transaction.escrow_provider ?? ''))
  const [escrowReference, setEscrowReference] = useState(String(transaction.escrow_reference ?? ''))
  const [escrowNote, setEscrowNote]         = useState(String(transaction.escrow_note ?? ''))
  const [ddStarted, setDdStarted]   = useState(String(transaction.dd_started_at ?? ''))
  const [ddDeadline, setDdDeadline] = useState(String(transaction.dd_deadline_at ?? ''))
  const [dataroomUrl, setDataroomUrl] = useState(String(transaction.dataroom_url ?? ''))
  const [signingDate, setSigningDate] = useState(String(transaction.signing_date ?? ''))
  const [spaUrl, setSpaUrl]           = useState(String(transaction.spa_document_url ?? ''))
  const [certUrl, setCertUrl]         = useState(String(transaction.certificate_url ?? ''))
  const [commSeller, setCommSeller]   = useState(String(transaction.commission_seller_pct ?? ''))
  const [commBuyer, setCommBuyer]     = useState(String(transaction.commission_buyer_premium_pct ?? ''))
  const [commReferrer, setCommReferrer] = useState(String(transaction.commission_referrer_chf ?? ''))
  const [netSeller, setNetSeller]     = useState(String(transaction.net_seller_proceeds_chf ?? ''))
  const [adminNote, setAdminNote]     = useState(String(transaction.admin_note ?? ''))

  async function patch(payload: Record<string, unknown>) {
    setSaving(true)
    setSaved(false)
    setError('')
    try {
      const res = await fetch(`/api/admin/transactions/${transaction.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: adminToken ?? '', ...payload }),
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
      setSaving(false)
    }
  }

  const currentStepIdx = STATUS_STEPS.findIndex(s => s.key === status)

  return (
    <div className="flex flex-col gap-6">

      {error && <div className="bg-red-50 border border-red-200 p-4 text-[12px] text-red-700">{error}</div>}
      {saved && !saving && <div className="bg-emerald-50 border border-emerald-200 p-3 text-[12px] text-emerald-700">Enregistré.</div>}

      {/* Timeline / statut */}
      <div className={sectionCls}>
        <h2 className="text-[11px] font-semibold uppercase tracking-widest text-gray-500">Statut de la transaction</h2>
        <div className="flex items-center gap-1 overflow-x-auto pb-2">
          {STATUS_STEPS.map((s, i) => (
            <button
              key={s.key}
              disabled={saving}
              onClick={() => { setStatus(s.key); patch({ status: s.key }) }}
              className={`shrink-0 px-3 py-2 text-[10px] font-semibold uppercase tracking-wide border transition-colors ${
                i <= currentStepIdx
                  ? 'bg-gray-900 text-white border-gray-900'
                  : 'bg-white text-gray-400 border-gray-200 hover:border-gray-400'
              }`}
            >
              {s.label}
            </button>
          ))}
          <button
            disabled={saving}
            onClick={() => { setStatus('cancelled'); patch({ status: 'cancelled' }) }}
            className={`shrink-0 px-3 py-2 text-[10px] font-semibold uppercase tracking-wide border transition-colors ${
              status === 'cancelled' ? 'bg-red-600 text-white border-red-600' : 'bg-white text-red-400 border-red-200 hover:border-red-400'
            }`}
          >
            Annuler
          </button>
        </div>
        <p className="text-[11px] text-gray-400">
          Accord de Principe (AP) : accepté manuellement par les deux parties via case à cocher (pas de signature électronique).
          Buyer : {transaction.ap_accepted_buyer ? '✅' : '—'} · Seller : {transaction.ap_accepted_seller ? '✅' : '—'}
        </p>
      </div>

      {/* Séquestre */}
      <div className={sectionCls}>
        <h2 className="text-[11px] font-semibold uppercase tracking-widest text-gray-500">Séquestre — géré manuellement par une banque/fiduciaire externe</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className={labelCls}>Montant (CHF)</label>
            <input className={inputCls} value={escrowAmount} onChange={e => setEscrowAmount(e.target.value)} />
          </div>
          <div>
            <label className={labelCls}>Banque / fiduciaire partenaire</label>
            <input className={inputCls} value={escrowProvider} onChange={e => setEscrowProvider(e.target.value)} placeholder="ex: Banque XYZ" />
          </div>
          <div>
            <label className={labelCls}>Référence de virement</label>
            <input className={inputCls} value={escrowReference} onChange={e => setEscrowReference(e.target.value)} />
          </div>
        </div>
        <div>
          <label className={labelCls}>Note (confirmation reçue, contact fiduciaire, etc.)</label>
          <textarea className={inputCls} rows={2} value={escrowNote} onChange={e => setEscrowNote(e.target.value)} />
        </div>
        <div className="flex items-center gap-3">
          {transaction.escrow_confirmed_at ? (
            <span className="text-[11px] text-emerald-600 font-semibold">Séquestre confirmé le {String(transaction.escrow_confirmed_at).slice(0,10)}</span>
          ) : (
            <button
              disabled={saving}
              onClick={() => patch({
                escrow_amount_chf: escrowAmount ? Number(escrowAmount) : undefined,
                escrow_provider: escrowProvider || undefined,
                escrow_reference: escrowReference || undefined,
                escrow_note: escrowNote || undefined,
                escrow_confirmed: true,
              })}
              className="bg-gray-900 text-white text-[11px] font-semibold uppercase tracking-wide px-4 py-2 hover:bg-gray-700 transition-colors"
            >
              Confirmer réception du séquestre
            </button>
          )}
          <button
            disabled={saving}
            onClick={() => patch({
              escrow_amount_chf: escrowAmount ? Number(escrowAmount) : undefined,
              escrow_provider: escrowProvider || undefined,
              escrow_reference: escrowReference || undefined,
              escrow_note: escrowNote || undefined,
            })}
            className="border border-gray-300 text-gray-600 text-[11px] font-semibold uppercase tracking-wide px-4 py-2 hover:border-gray-500 transition-colors"
          >
            Sauvegarder
          </button>
        </div>
      </div>

      {/* Due Diligence */}
      <div className={sectionCls}>
        <h2 className="text-[11px] font-semibold uppercase tracking-widest text-gray-500">Due Diligence</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className={labelCls}>Date de début</label>
            <input type="date" className={inputCls} value={ddStarted} onChange={e => setDdStarted(e.target.value)} />
          </div>
          <div>
            <label className={labelCls}>Date limite</label>
            <input type="date" className={inputCls} value={ddDeadline} onChange={e => setDdDeadline(e.target.value)} />
          </div>
          <div>
            <label className={labelCls}>Lien data room</label>
            <input className={inputCls} value={dataroomUrl} onChange={e => setDataroomUrl(e.target.value)} placeholder="URL data room sécurisée" />
          </div>
        </div>
        <button
          disabled={saving}
          onClick={() => patch({
            dd_started_at: ddStarted || undefined,
            dd_deadline_at: ddDeadline || undefined,
            dataroom_url: dataroomUrl || undefined,
          })}
          className="border border-gray-300 text-gray-600 text-[11px] font-semibold uppercase tracking-wide px-4 py-2 hover:border-gray-500 transition-colors self-start"
        >
          Sauvegarder
        </button>
      </div>

      {/* Signing */}
      <div className={sectionCls}>
        <h2 className="text-[11px] font-semibold uppercase tracking-widest text-gray-500">Signing — process manuel (documents échangés par email)</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className={labelCls}>Date de signing</label>
            <input type="date" className={inputCls} value={signingDate} onChange={e => setSigningDate(e.target.value)} />
          </div>
          <div>
            <label className={labelCls}>SPA / Acte de cession (URL)</label>
            <input className={inputCls} value={spaUrl} onChange={e => setSpaUrl(e.target.value)} />
          </div>
          <div>
            <label className={labelCls}>Certificat de Transaction AEGRYN (URL)</label>
            <input className={inputCls} value={certUrl} onChange={e => setCertUrl(e.target.value)} />
          </div>
        </div>
        <div className="flex gap-3">
          <button
            disabled={saving}
            onClick={() => patch({ signing_date: signingDate || undefined, spa_document_url: spaUrl || undefined, certificate_url: certUrl || undefined })}
            className="border border-gray-300 text-gray-600 text-[11px] font-semibold uppercase tracking-wide px-4 py-2 hover:border-gray-500 transition-colors"
          >
            Sauvegarder
          </button>
          {!transaction.certificate_issued_at && (
            <button
              disabled={saving || !certUrl}
              onClick={() => patch({ certificate_url: certUrl, issue_certificate: true })}
              className="bg-gray-900 text-white text-[11px] font-semibold uppercase tracking-wide px-4 py-2 hover:bg-gray-700 transition-colors disabled:opacity-40"
            >
              Émettre le certificat
            </button>
          )}
          {Boolean(transaction.certificate_issued_at) && (
            <span className="text-[11px] text-emerald-600 font-semibold self-center">Certificat émis le {String(transaction.certificate_issued_at).slice(0,10)}</span>
          )}
        </div>
      </div>

      {/* Commissions */}
      <div className={sectionCls}>
        <h2 className="text-[11px] font-semibold uppercase tracking-widest text-gray-500">Commissions (calcul interne)</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className={labelCls}>Commission vendeur (%)</label>
            <input className={inputCls} value={commSeller} onChange={e => setCommSeller(e.target.value)} />
          </div>
          <div>
            <label className={labelCls}>Buyer's premium (%)</label>
            <input className={inputCls} value={commBuyer} onChange={e => setCommBuyer(e.target.value)} />
          </div>
          <div>
            <label className={labelCls}>Commission apporteur (CHF)</label>
            <input className={inputCls} value={commReferrer} onChange={e => setCommReferrer(e.target.value)} />
          </div>
          <div>
            <label className={labelCls}>Solde net vendeur (CHF)</label>
            <input className={inputCls} value={netSeller} onChange={e => setNetSeller(e.target.value)} />
          </div>
        </div>
        <button
          disabled={saving}
          onClick={() => patch({
            commission_seller_pct: commSeller ? Number(commSeller) : undefined,
            commission_buyer_premium_pct: commBuyer ? Number(commBuyer) : undefined,
            commission_referrer_chf: commReferrer ? Number(commReferrer) : undefined,
            net_seller_proceeds_chf: netSeller ? Number(netSeller) : undefined,
          })}
          className="border border-gray-300 text-gray-600 text-[11px] font-semibold uppercase tracking-wide px-4 py-2 hover:border-gray-500 transition-colors self-start"
        >
          Sauvegarder
        </button>
      </div>

      {/* Note interne */}
      <div className={sectionCls}>
        <h2 className="text-[11px] font-semibold uppercase tracking-widest text-gray-500">Note interne</h2>
        <textarea className={inputCls} rows={3} value={adminNote} onChange={e => setAdminNote(e.target.value)} />
        <button
          disabled={saving}
          onClick={() => patch({ admin_note: adminNote || undefined })}
          className="border border-gray-300 text-gray-600 text-[11px] font-semibold uppercase tracking-wide px-4 py-2 hover:border-gray-500 transition-colors self-start"
        >
          Sauvegarder
        </button>
      </div>

    </div>
  )
}
