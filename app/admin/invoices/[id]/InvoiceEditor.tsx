'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Plus, Trash2, Download, Save, ArrowLeft } from 'lucide-react'

/* ── Types ─────────────────────────────────────────────────────────────────── */

export type LineItem = {
  description:   string
  unit:          string
  qty:           number
  unit_price_ht: number
}

export type InvoiceData = {
  id:                   string | null
  invoice_number:       string
  catalogue_request_id: string | null
  asset_id:             string | null
  seller_uid:           string | null
  recipient_name:       string
  recipient_email:      string
  recipient_address:    string | null
  recipient_company:    string | null
  recipient_vat_num:    string | null
  line_items:           LineItem[]
  subtotal_ht:          number
  vat_rate:             number
  vat_amount:           number
  total_ttc:            number
  currency:             string
  iban:                 string | null
  bic:                  string | null
  bank_name:            string | null
  account_holder:       string | null
  status:               string
  due_date:             string | null
  issued_at:            string
  pdf_storage_path:     string | null
}

type Props = {
  invoice: InvoiceData
  isNew:   boolean
}

const STATUS_OPTIONS = [
  { value: 'draft',     label: 'Brouillon' },
  { value: 'sent',      label: 'Envoyée' },
  { value: 'paid',      label: 'Payée' },
  { value: 'cancelled', label: 'Annulée' },
]

const VAT_OPTIONS = [
  { value: 0,    label: '0% (exonéré / hors champ)' },
  { value: 2.6,  label: '2.6% (TVA CH réduite)' },
  { value: 3.8,  label: '3.8% (TVA CH hébergement)' },
  { value: 8.1,  label: '8.1% (TVA CH normale)' },
  { value: 20,   label: '20% (TVA FR normale)' },
]

function fmtCHF(n: number, currency = 'CHF') {
  return new Intl.NumberFormat('fr-CH', { style: 'currency', currency, minimumFractionDigits: 2 }).format(n)
}

/* ── Composant principal ────────────────────────────────────────────────────── */

export default function InvoiceEditor({ invoice: initial, isNew }: Props) {
  const router = useRouter()

  const [inv, setInv]         = useState<InvoiceData>(initial)
  const [saving, setSaving]   = useState(false)
  const [pdfing, setPdfing]   = useState(false)
  const [saved,  setSaved]    = useState(false)
  const [error,  setError]    = useState<string | null>(null)

  /* ── Recalcul automatique des totaux ── */
  const recalc = useCallback((items: LineItem[], vatRate: number) => {
    const ht  = items.reduce((s, l) => s + l.qty * l.unit_price_ht, 0)
    const vat = Math.round(ht * vatRate) / 100
    return { subtotal_ht: ht, vat_amount: vat, total_ttc: ht + vat }
  }, [])

  function setItems(items: LineItem[]) {
    const totals = recalc(items, inv.vat_rate)
    setInv(p => ({ ...p, line_items: items, ...totals }))
  }

  function setVatRate(rate: number) {
    const totals = recalc(inv.line_items, rate)
    setInv(p => ({ ...p, vat_rate: rate, ...totals }))
  }

  function updateItem(idx: number, field: keyof LineItem, value: string | number) {
    const items = inv.line_items.map((l, i) =>
      i === idx ? { ...l, [field]: field === 'description' || field === 'unit' ? value : Number(value) } : l
    )
    setItems(items)
  }

  function addItem() {
    setItems([...inv.line_items, { description: '', unit: 'Forfait', qty: 1, unit_price_ht: 0 }])
  }

  function removeItem(idx: number) {
    setItems(inv.line_items.filter((_, i) => i !== idx))
  }

  /* ── Sauvegarde DB ── */
  async function save(andSend = false) {
    setSaving(true)
    setError(null)
    try {
      const method = isNew && !inv.id ? 'POST' : 'PATCH'
      const url    = isNew && !inv.id ? '/api/admin/invoices' : `/api/admin/invoices/${inv.id}`
      const res    = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...inv, send_email: andSend }),
      })
      if (!res.ok) { setError('Erreur lors de la sauvegarde.'); return }
      const json = await res.json()
      if (json.id) setInv(p => ({ ...p, id: json.id }))
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
      if (isNew && json.id) router.replace(`/admin/invoices/${json.id}`)
    } finally {
      setSaving(false)
    }
  }

  /* ── Génération PDF et téléchargement direct ── */
  async function downloadPdf() {
    setPdfing(true)
    setError(null)
    try {
      /* Sauvegarder d'abord si nouveau ou non persisté */
      if (!inv.id) { await save(); return }
      /* Appel API → reçoit le binaire PDF */
      const res = await fetch(`/api/admin/invoices/${inv.id}/pdf`, { method: 'POST' })
      if (!res.ok) { setError('Erreur génération PDF.'); return }
      const blob = await res.blob()
      const url  = URL.createObjectURL(blob)
      const a    = document.createElement('a')
      a.href     = url
      a.download = `${inv.invoice_number || 'facture'}.pdf`
      document.body.appendChild(a)
      a.click()
      a.remove()
      URL.revokeObjectURL(url)
    } finally {
      setPdfing(false)
    }
  }

  const inputCls  = 'w-full border border-gray-200 px-3 py-2 font-sans text-[13px] text-gray-900 focus:outline-none focus:border-ag-navy transition-colors bg-white'
  const labelCls  = 'block font-mono text-[9px] uppercase tracking-[0.18em] text-gray-400 mb-1'

  return (
    <div className="p-8 max-w-5xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-gray-400 mb-1">Admin / Factures</p>
          <h1 className="font-sans font-bold text-gray-900 text-[22px] tracking-tight">
            {isNew ? 'Nouvelle facture' : inv.invoice_number}
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/admin/invoices"
            className="inline-flex items-center gap-1.5 border border-gray-200 text-gray-500 font-mono text-[10px] uppercase tracking-widest px-3 py-2 hover:border-gray-400 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft size={10} /> Toutes les factures
          </Link>
          <button
            onClick={() => downloadPdf()}
            disabled={pdfing}
            className="inline-flex items-center gap-2 border border-gray-300 text-gray-600 font-mono text-[10px] uppercase tracking-widest px-3 py-2 hover:border-gray-500 hover:text-gray-900 transition-colors disabled:opacity-50"
          >
            <Download size={11} /> {pdfing ? 'PDF…' : 'Télécharger PDF'}
          </button>
          <button
            onClick={() => save()}
            disabled={saving}
            className="inline-flex items-center gap-2 bg-ag-navy text-white font-mono text-[10px] uppercase tracking-widest px-3 py-2 hover:bg-ag-black transition-colors disabled:opacity-50"
          >
            <Save size={11} /> {saving ? 'Enreg…' : saved ? '✓ Sauvé' : 'Enregistrer'}
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 px-4 py-3 font-sans text-[12px] text-red-700">{error}</div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-8">

        {/* ── Colonne gauche : formulaire ── */}
        <div className="space-y-6">

          {/* Méta */}
          <div className="bg-white border border-gray-200 p-5 grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>N° Facture</label>
              <input className={inputCls} value={inv.invoice_number}
                onChange={e => setInv(p => ({ ...p, invoice_number: e.target.value }))} />
            </div>
            <div>
              <label className={labelCls}>Statut</label>
              <select className={inputCls} value={inv.status}
                onChange={e => setInv(p => ({ ...p, status: e.target.value }))}>
                {STATUS_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
            <div>
              <label className={labelCls}>Date d&apos;émission</label>
              <input type="date" className={inputCls} value={inv.issued_at}
                onChange={e => setInv(p => ({ ...p, issued_at: e.target.value }))} />
            </div>
            <div>
              <label className={labelCls}>Date d&apos;échéance</label>
              <input type="date" className={inputCls} value={inv.due_date ?? ''}
                onChange={e => setInv(p => ({ ...p, due_date: e.target.value || null }))} />
            </div>
            <div>
              <label className={labelCls}>Devise</label>
              <select className={inputCls} value={inv.currency}
                onChange={e => setInv(p => ({ ...p, currency: e.target.value }))}>
                <option value="CHF">CHF</option>
                <option value="EUR">EUR</option>
              </select>
            </div>
            <div>
              <label className={labelCls}>TVA applicable</label>
              <select className={inputCls} value={inv.vat_rate}
                onChange={e => setVatRate(Number(e.target.value))}>
                {VAT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
          </div>

          {/* Destinataire */}
          <div className="bg-white border border-gray-200 p-5 space-y-4">
            <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-gray-400">Destinataire</p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Nom / Raison sociale</label>
                <input className={inputCls} value={inv.recipient_name}
                  onChange={e => setInv(p => ({ ...p, recipient_name: e.target.value }))} />
              </div>
              <div>
                <label className={labelCls}>Email</label>
                <input type="email" className={inputCls} value={inv.recipient_email}
                  onChange={e => setInv(p => ({ ...p, recipient_email: e.target.value }))} />
              </div>
              <div>
                <label className={labelCls}>Société (optionnel)</label>
                <input className={inputCls} value={inv.recipient_company ?? ''}
                  onChange={e => setInv(p => ({ ...p, recipient_company: e.target.value || null }))} />
              </div>
              <div>
                <label className={labelCls}>N° TVA (optionnel)</label>
                <input className={inputCls} value={inv.recipient_vat_num ?? ''}
                  onChange={e => setInv(p => ({ ...p, recipient_vat_num: e.target.value || null }))} />
              </div>
              <div className="col-span-2">
                <label className={labelCls}>Adresse</label>
                <textarea rows={2} className={`${inputCls} resize-none`} value={inv.recipient_address ?? ''}
                  onChange={e => setInv(p => ({ ...p, recipient_address: e.target.value || null }))} />
              </div>
            </div>
          </div>

          {/* Lignes de facturation */}
          <div className="bg-white border border-gray-200 p-5 space-y-4">
            <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-gray-400">Lignes de facturation</p>
            <div className="space-y-2">
              <div className="grid grid-cols-[1fr_80px_70px_100px_32px] gap-2 text-center">
                <span className={labelCls + ' text-left'}>Description</span>
                <span className={labelCls}>Unité</span>
                <span className={labelCls}>Qté</span>
                <span className={labelCls}>P.U. HT</span>
                <span />
              </div>
              {inv.line_items.map((item, idx) => (
                <div key={idx} className="grid grid-cols-[1fr_80px_70px_100px_32px] gap-2 items-center">
                  <input className={inputCls} value={item.description} placeholder="Description du service"
                    onChange={e => updateItem(idx, 'description', e.target.value)} />
                  <input className={inputCls + ' text-center'} value={item.unit}
                    onChange={e => updateItem(idx, 'unit', e.target.value)} />
                  <input type="number" min="1" className={inputCls + ' text-center'} value={item.qty}
                    onChange={e => updateItem(idx, 'qty', e.target.value)} />
                  <input type="number" min="0" step="0.01" className={inputCls + ' text-right'} value={item.unit_price_ht}
                    onChange={e => updateItem(idx, 'unit_price_ht', e.target.value)} />
                  <button onClick={() => removeItem(idx)}
                    className="flex items-center justify-center w-8 h-8 text-red-400 hover:text-red-600 hover:bg-red-50 transition-colors">
                    <Trash2 size={12} />
                  </button>
                </div>
              ))}
            </div>
            <button onClick={addItem}
              className="inline-flex items-center gap-2 font-mono text-[9px] uppercase tracking-widest text-gray-400 hover:text-ag-navy transition-colors">
              <Plus size={11} /> Ajouter une ligne
            </button>
          </div>

          {/* RIB — note sécurité */}
          <div className="bg-amber-50 border border-amber-200 p-4">
            <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-amber-700 mb-1">RIB / Coordonnées bancaires</p>
            <p className="font-sans text-[12px] text-amber-800 leading-relaxed">
              Les coordonnées bancaires Aegryn sont transmises <strong>séparément</strong> au destinataire par l&apos;équipe, par email sécurisé, afin de prévenir tout risque de fraude ou d&apos;interception. Elles <strong>n&apos;apparaissent pas</strong> sur la facture générée.
            </p>
          </div>
        </div>

        {/* ── Colonne droite : aperçu totaux ── */}
        <div className="space-y-4">
          <div className="bg-white border border-gray-200 p-5 space-y-3 sticky top-20">
            <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-gray-400 mb-3">Récapitulatif</p>

            <div className="flex justify-between font-sans text-[13px] text-gray-600">
              <span>Sous-total HT</span>
              <span className="font-semibold">{fmtCHF(inv.subtotal_ht, inv.currency)}</span>
            </div>
            <div className="flex justify-between font-sans text-[13px] text-gray-600">
              <span>TVA ({inv.vat_rate}%)</span>
              <span>{fmtCHF(inv.vat_amount, inv.currency)}</span>
            </div>
            <div className="border-t border-gray-200 pt-3 flex justify-between font-sans font-bold text-[15px] text-gray-900">
              <span>Total TTC</span>
              <span>{fmtCHF(inv.total_ttc, inv.currency)}</span>
            </div>

            {inv.vat_rate === 0 && (
              <p className="font-sans text-[11px] text-gray-400 mt-2">
                TVA non applicable — prestation exonérée ou opération hors champ.
              </p>
            )}

            {inv.pdf_storage_path && (
              <div className="border-t border-gray-100 pt-3 mt-3">
                <p className="font-mono text-[9px] uppercase tracking-widest text-gray-400 mb-1">PDF généré</p>
                <p className="font-sans text-[11px] text-gray-500 break-all">{inv.pdf_storage_path}</p>
              </div>
            )}
          </div>

          {/* Aperçu mini-facture */}
          <div className="bg-white border border-gray-200 p-6 space-y-4 text-[11px]">
            <div className="flex items-start justify-between">
              <div>
                <p className="font-sans font-semibold text-[12px] text-gray-900">Aegryn</p>
                <p className="font-sans text-[10px] text-gray-400">Rue du Centre 142, 1025 Saint-Sulpice, Suisse.</p>
                <p className="font-sans text-[10px] text-gray-400">CHE-402.011.821 TVA.</p>
                <p className="font-sans text-[10px] text-gray-400 mt-0.5">finance@boha-group.com · +41 (0) 79 590 18 81</p>
              </div>
              <div className="text-right">
                <p className="font-mono font-bold text-[13px] text-ag-navy">{inv.invoice_number}</p>
                <p className="font-sans text-[10px] text-gray-400">Émise le {inv.issued_at}</p>
                {inv.due_date && <p className="font-sans text-[10px] text-gray-400">Échéance : {inv.due_date}</p>}
              </div>
            </div>

            <div className="border-t border-gray-100 pt-3">
              <p className="font-mono text-[9px] uppercase tracking-widest text-gray-400 mb-1">Facturer à</p>
              <p className="font-sans font-semibold text-gray-900">{inv.recipient_name || '—'}</p>
              {inv.recipient_company && <p className="font-sans text-gray-600">{inv.recipient_company}</p>}
              {inv.recipient_address && <p className="font-sans text-gray-500 whitespace-pre-line">{inv.recipient_address}</p>}
              {inv.recipient_vat_num && <p className="font-sans text-gray-400">TVA : {inv.recipient_vat_num}</p>}
            </div>

            <table className="w-full border-collapse border-t border-gray-100 pt-3">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left font-mono text-[9px] uppercase tracking-widest text-gray-400 py-1 pr-2">Description</th>
                  <th className="text-center font-mono text-[9px] uppercase tracking-widest text-gray-400 py-1 w-12">Qté</th>
                  <th className="text-right font-mono text-[9px] uppercase tracking-widest text-gray-400 py-1 w-20">P.U. HT</th>
                  <th className="text-right font-mono text-[9px] uppercase tracking-widest text-gray-400 py-1 w-20">Total HT</th>
                </tr>
              </thead>
              <tbody>
                {inv.line_items.map((l, i) => (
                  <tr key={i} className="border-b border-gray-50">
                    <td className="py-1.5 pr-2 font-sans text-gray-700">{l.description || '—'}</td>
                    <td className="text-center font-mono text-gray-600">{l.qty}</td>
                    <td className="text-right font-mono text-gray-600">{fmtCHF(l.unit_price_ht, inv.currency)}</td>
                    <td className="text-right font-mono font-semibold text-gray-900">{fmtCHF(l.qty * l.unit_price_ht, inv.currency)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="border-t border-gray-200 pt-2 space-y-1 text-right">
              <p className="font-sans text-gray-600">Sous-total HT : <span className="font-semibold">{fmtCHF(inv.subtotal_ht, inv.currency)}</span></p>
              <p className="font-sans text-gray-600">TVA {inv.vat_rate}% : {fmtCHF(inv.vat_amount, inv.currency)}</p>
              <p className="font-sans font-bold text-[13px] text-gray-900">Total TTC : {fmtCHF(inv.total_ttc, inv.currency)}</p>
            </div>

            <div className="border-t border-gray-100 pt-3 space-y-0.5">
              <p className="font-mono text-[9px] uppercase tracking-widest text-gray-400">Modalités de paiement</p>
              <p className="font-sans text-[11px] text-gray-500">Les coordonnées bancaires seront transmises séparément. Référence à indiquer : <strong>{inv.invoice_number}</strong></p>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
