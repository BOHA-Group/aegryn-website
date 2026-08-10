'use client'

import { useState } from 'react'
import { calcCommission, fmtEur, DEFAULT_TIERS, type CommissionTier } from '@/lib/calcCommission'

type Transaction = {
  id:              string
  asset_name:      string | null
  transaction_price: number | null
  status:          string
  seller_name:     string | null
  seller_email:    string | null
  closed_at:       string | null
  created_at:      string
  commission_paid: boolean
}

type Props = {
  transactions: Transaction[]
  tiers:        CommissionTier[]
}

const TX_STATUS: Record<string, { label: string; color: string }> = {
  ei_submitted:   { label: 'EI reçue',       color: 'text-blue-600 bg-blue-50' },
  ap_signed:      { label: 'AP signé',        color: 'text-purple-600 bg-purple-50' },
  escrow_paid:    { label: 'Séquestre',       color: 'text-amber-600 bg-amber-50' },
  dd_in_progress: { label: 'Due Diligence',   color: 'text-orange-600 bg-orange-50' },
  signing:        { label: 'Signing',         color: 'text-indigo-600 bg-indigo-50' },
  closed:         { label: 'Clôturé',         color: 'text-emerald-600 bg-emerald-50' },
  cancelled:      { label: 'Annulé',          color: 'text-red-400 bg-red-50' },
}

function fmtDate(d: string | null) {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('fr-CH', { day: '2-digit', month: '2-digit', year: '2-digit' })
}

export default function CommissionsClient({ transactions, tiers }: Props) {
  const [calcInput, setCalcInput] = useState('')
  const activeTiers = tiers.length > 0 ? tiers : DEFAULT_TIERS

  const inputNum = parseFloat(calcInput.replace(/\s/g, '').replace(',', '.')) || 0
  const calcResult = inputNum > 0 ? calcCommission(inputNum, activeTiers) : null

  const closedWithPrice = transactions.filter(
    t => t.status === 'closed' && t.transaction_price != null
  )
  const totalDue = closedWithPrice.reduce((sum, t) => {
    const r = calcCommission(t.transaction_price!, activeTiers)
    return sum + (r.type === 'calculated' ? r.commission : 0)
  }, 0)
  const totalPaid = closedWithPrice
    .filter(t => t.commission_paid)
    .reduce((sum, t) => {
      const r = calcCommission(t.transaction_price!, activeTiers)
      return sum + (r.type === 'calculated' ? r.commission : 0)
    }, 0)

  return (
    <main className="min-h-screen bg-gray-50 p-6 md:p-10">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-8 flex items-start justify-between gap-4">
          <div>
            <p className="text-[10px] font-mono text-gray-400 uppercase tracking-widest mb-1">Aegryn ADMIN</p>
            <h1 className="text-[26px] font-bold text-gray-900 tracking-tight">Commissions Aegryn</h1>
            <p className="text-[12px] text-gray-400 mt-1">
              Suivi des honoraires de transaction dus à Aegryn — grille dégressive juillet 2026
            </p>
          </div>
          <a href={`/admin`} className="text-[11px] font-semibold text-gray-500 border border-gray-200 px-4 py-2 hover:border-gray-400 bg-white transition-colors">
            ← Dashboard
          </a>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-3 gap-4 mb-10">
          <div className="border border-gray-200 bg-white p-5">
            <p className="font-mono text-[10px] uppercase tracking-widest text-gray-400 mb-2">Transactions clôturées</p>
            <p className="font-mono text-[28px] font-bold text-gray-900">{closedWithPrice.length}</p>
          </div>
          <div className="border border-emerald-200 bg-emerald-50 p-5">
            <p className="font-mono text-[10px] uppercase tracking-widest text-emerald-600 mb-2">Commissions dues (total)</p>
            <p className="font-mono text-[28px] font-bold text-gray-900">{fmtEur(totalDue)}</p>
          </div>
          <div className="border border-blue-200 bg-blue-50 p-5">
            <p className="font-mono text-[10px] uppercase tracking-widest text-blue-600 mb-2">Encaissées</p>
            <p className="font-mono text-[28px] font-bold text-gray-900">{fmtEur(totalPaid)}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-[1fr_380px] gap-8 items-start">

          {/* Table transactions */}
          <div>
            <h2 className="font-sans font-bold text-gray-900 text-[14px] mb-4">Transactions</h2>
            {transactions.length === 0 ? (
              <div className="bg-white border border-gray-200 p-10 text-center">
                <p className="text-[13px] text-gray-400">Aucune transaction enregistrée.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-[12px] bg-white border border-gray-200">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      {['Actif', 'Cédant', 'Prix tx', 'Commission Aegryn', 'Net cédant', 'Statut', 'Clôture', 'Payée'].map(h => (
                        <th key={h} className="text-left px-4 py-3 text-[10px] font-semibold uppercase tracking-widest text-gray-500 whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {transactions.map(tx => {
                      const result = tx.transaction_price != null
                        ? calcCommission(tx.transaction_price, activeTiers)
                        : null
                      const st = TX_STATUS[tx.status] ?? { label: tx.status, color: 'text-gray-500 bg-gray-50' }
                      return (
                        <tr key={tx.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 font-semibold text-gray-800 max-w-[160px] truncate">
                            {tx.asset_name ?? `#${tx.id.slice(0,8)}`}
                          </td>
                          <td className="px-4 py-3 text-gray-500 text-[11px]">
                            <div>{tx.seller_name ?? '—'}</div>
                            <div className="text-gray-400">{tx.seller_email ?? ''}</div>
                          </td>
                          <td className="px-4 py-3 font-mono text-gray-700 whitespace-nowrap">
                            {tx.transaction_price != null ? fmtEur(tx.transaction_price) : '—'}
                          </td>
                          <td className="px-4 py-3 font-mono font-semibold whitespace-nowrap">
                            {result == null ? '—'
                              : result.type === 'calculated'
                              ? <span className="text-emerald-700">{fmtEur(result.commission)}</span>
                              : <span className="text-amber-600 text-[11px]">Taux mandat</span>
                            }
                          </td>
                          <td className="px-4 py-3 font-mono text-gray-600 whitespace-nowrap">
                            {result?.type === 'calculated' ? fmtEur(result.netSeller) : '—'}
                          </td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-0.5 text-[10px] font-semibold uppercase ${st.color}`}>
                              {st.label}
                            </span>
                          </td>
                          <td className="px-4 py-3 font-mono text-[11px] text-gray-400">{fmtDate(tx.closed_at)}</td>
                          <td className="px-4 py-3">
                            {tx.status === 'closed' && (
                              <a
                                href={`/admin/commissions?toggle=${tx.id}`}
                                className={`text-[10px] font-semibold px-2 py-1 border transition-colors ${
                                  tx.commission_paid
                                    ? 'border-emerald-200 text-emerald-700 bg-emerald-50'
                                    : 'border-gray-300 text-gray-600 hover:border-gray-500'
                                }`}
                              >
                                {tx.commission_paid ? '✓ Encaissée' : 'Marquer payée'}
                              </a>
                            )}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Calculateur + grille — panneau flottant */}
          <div className="sticky top-[calc(4rem+1.5rem)] space-y-6">

            {/* Note partenaires */}
            <div className="bg-blue-50 border border-blue-200 px-4 py-3">
              <p className="font-mono text-[9px] uppercase tracking-widest text-blue-500 mb-1">Nota bene</p>
              <p className="font-sans text-[11px] text-blue-700 leading-snug">
                Les partenaires paient un abonnement fixe (89 CHF/mois) pour afficher leur fiche expert.
                Aucune commission ne leur est due sur les transactions.
              </p>
            </div>

            {/* Calculateur */}
            <div className="bg-white border border-gray-200 p-6">
              <h2 className="font-sans font-bold text-gray-900 text-[14px] mb-4">Calculateur de commission</h2>
              <label className="block font-mono text-[10px] uppercase tracking-widest text-gray-400 mb-2">
                Prix de transaction (€)
              </label>
              <input
                type="text"
                value={calcInput}
                onChange={e => setCalcInput(e.target.value)}
                placeholder="ex: 750 000"
                className="w-full border border-gray-200 px-4 py-3 font-mono text-[14px] focus:outline-none focus:border-gray-900 transition-colors"
              />

              {calcResult && (
                <div className="mt-4 space-y-3">
                  {calcResult.type === 'calculated' ? (
                    <>
                      <div className="bg-emerald-50 border border-emerald-200 px-4 py-3">
                        <p className="font-mono text-[10px] uppercase tracking-widest text-emerald-600 mb-1">Commission Aegryn HT</p>
                        <p className="font-mono text-[22px] font-bold text-gray-900">{fmtEur(calcResult.commission)}</p>
                        <p className="font-mono text-[10px] text-emerald-600 mt-0.5">
                          Taux appliqué : {(calcResult.rate * 100).toFixed(0)}% — Tranche : {calcResult.tier.label}
                        </p>
                      </div>
                      <div className="bg-gray-50 border border-gray-200 px-4 py-3">
                        <p className="font-mono text-[10px] uppercase tracking-widest text-gray-400 mb-1">Net cédant estimé</p>
                        <p className="font-mono text-[18px] font-bold text-gray-800">{fmtEur(calcResult.netSeller)}</p>
                      </div>
                    </>
                  ) : (
                    <div className="bg-amber-50 border border-amber-200 px-4 py-3">
                      <p className="font-mono text-[10px] uppercase tracking-widest text-amber-600 mb-1">
                        {calcResult.reason === 'below_minimum' ? 'En dessous du seuil' : 'Au-dessus du barème'}
                      </p>
                      <p className="font-sans text-[12px] text-amber-700">
                        {calcResult.reason === 'below_minimum'
                          ? 'Prix inférieur à 100 000 € — taux convenu au mandat.'
                          : 'Prix supérieur à 5 000 000 € — taux convenu au mandat.'}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Grille tarifaire */}
            <div className="bg-white border border-gray-200 p-6">
              <h2 className="font-sans font-bold text-gray-900 text-[14px] mb-4">Grille tarifaire active</h2>
              <div className="divide-y divide-gray-100">
                {activeTiers.map((tier, i) => (
                  <div key={i} className="flex items-center justify-between py-2.5">
                    <span className="font-sans text-[12px] text-gray-600">{tier.label}</span>
                    <span className="font-mono text-[12px] font-semibold text-gray-900">
                      {tier.rate != null ? `${(tier.rate * 100).toFixed(0)}% HT` : 'Mandat'}
                    </span>
                  </div>
                ))}
                <div className="flex items-center justify-between pt-3">
                  <span className="font-sans text-[11px] text-gray-400">Commission minimum</span>
                  <span className="font-mono text-[12px] font-semibold text-gray-700">25 000 CHF HT</span>
                </div>
                <div className="flex items-center justify-between pt-2 pb-0">
                  <span className="font-sans text-[11px] text-gray-400">Earnout</span>
                  <span className="font-mono text-[12px] font-semibold text-gray-700">5% / versement</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </main>
  )
}
