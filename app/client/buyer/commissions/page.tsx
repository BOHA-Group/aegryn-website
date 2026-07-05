import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { getUser } from '@/lib/supabaseServer'
import { createServiceClient } from '@/lib/supabase'
import { Receipt, CheckCircle2, Clock, AlertCircle } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Commissions dues — Espace Acquéreur AEGRYN',
  robots: { index: false, follow: false },
}

type BuyerCommission = {
  id: string
  transaction_id: string | null
  amount_chf: number | null
  eligible_at: string | null
  status: string
  created_at: string
  asset_id: string | null
  transaction_stage: string | null
}

const STATUS_CFG: Record<string, { label: string; renderIcon: () => React.ReactNode; color: string }> = {
  pending:    { label: 'À régler',    renderIcon: () => <Clock        size={13} className="text-amber-500"   />, color: 'text-amber-500'   },
  to_invoice: { label: 'À facturer', renderIcon: () => <AlertCircle  size={13} className="text-blue-400"    />, color: 'text-blue-400'    },
  invoiced:   { label: 'Facturée',   renderIcon: () => <AlertCircle  size={13} className="text-blue-500"    />, color: 'text-blue-500'    },
  paid:       { label: 'Réglée',     renderIcon: () => <CheckCircle2 size={13} className="text-emerald-500" />, color: 'text-emerald-500' },
}

function fmtAmount(amount: number | null) {
  if (amount == null) return '—'
  return new Intl.NumberFormat('fr-CH', { style: 'currency', currency: 'CHF', maximumFractionDigits: 0 }).format(amount)
}

function fmtDate(d: string) {
  return new Date(d).toLocaleDateString('fr-CH', { day: '2-digit', month: 'long', year: 'numeric' })
}

export default async function BuyerCommissionsPage() {
  const user = await getUser()
  if (!user) redirect('/client/login')

  const supa = createServiceClient()
  const { data } = await supa
    .from('buyer_commission_dues')
    .select('id, transaction_id, amount_chf, eligible_at, status, created_at, asset_id, transaction_stage')
    .eq('buyer_id', user.id)
    .order('created_at', { ascending: false })

  const commissions = (data ?? []) as BuyerCommission[]

  const totalDue = commissions
    .filter(c => c.status !== 'paid')
    .reduce((s, c) => s + (c.amount_chf ?? 0), 0)

  return (
    <div className="p-8 max-w-3xl">
      <div className="mb-8">
        <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-gray-400 mb-1">Espace Acquéreur</p>
        <h1 className="font-sans font-bold text-gray-900 text-[24px] tracking-tight">Commissions dues</h1>
        <p className="font-sans text-[13px] text-gray-400 mt-1">
          Frais de transaction dus à AEGRYN sur vos acquisitions closées.
        </p>
      </div>

      {/* Encart montant total dû */}
      {commissions.length > 0 && totalDue > 0 && (
        <div className="bg-amber-50 border border-amber-200 p-4 mb-6 flex items-center justify-between">
          <div>
            <p className="font-mono text-[9px] uppercase tracking-widest text-amber-600 mb-0.5">Total restant dû</p>
            <p className="font-sans font-bold text-[22px] text-amber-700">{fmtAmount(totalDue)}</p>
          </div>
          <p className="font-sans text-[11px] text-amber-600 max-w-[200px] text-right">
            Contactez <a href="mailto:finance@aegryn.com" className="underline">finance@aegryn.com</a> pour régulariser.
          </p>
        </div>
      )}

      {commissions.length === 0 ? (
        <div className="bg-white border border-gray-200 px-8 py-16 text-center">
          <Receipt size={24} className="text-gray-300 mx-auto mb-4" />
          <p className="font-sans text-[14px] text-gray-400">
            Aucune commission de transaction enregistrée.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {commissions.map(c => {
            const cfg = STATUS_CFG[c.status] ?? STATUS_CFG.pending
            return (
              <div key={c.id} className="bg-white border border-gray-200 p-5">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div>
                    <p className="font-mono text-[9px] uppercase tracking-widest text-gray-400 mb-1">
                      Commission de transaction
                    </p>
                    {c.asset_id && (
                      <p className="font-sans text-[12px] text-gray-500">
                        Actif <span className="font-mono">{c.asset_id.slice(0, 8)}…</span>
                        {c.transaction_stage && (
                          <> · Étape : <span className="capitalize">{c.transaction_stage.replace(/_/g, ' ')}</span></>
                        )}
                      </p>
                    )}
                  </div>
                  <p className="font-sans font-bold text-[18px] text-gray-900 shrink-0">
                    {fmtAmount(c.amount_chf)}
                  </p>
                </div>

                {c.eligible_at && (
                  <p className="font-sans text-[11px] text-gray-400 mb-2">
                    Éligible depuis le {fmtDate(c.eligible_at)}
                  </p>
                )}

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    {cfg.renderIcon()}
                    <span className={`font-sans text-[12px] ${cfg.color}`}>{cfg.label}</span>
                  </div>
                  <p className="font-mono text-[9px] text-gray-300">{fmtDate(c.created_at)}</p>
                </div>
              </div>
            )
          })}
        </div>
      )}

      <p className="font-sans text-[11px] text-gray-400 mt-8 leading-relaxed">
        Ces frais correspondent à la commission de transaction due à AEGRYN conformément aux conditions
        générales d&apos;intermédiation. Pour toute contestation, contactez{' '}
        <a href="mailto:finance@aegryn.com" className="text-ag-navy underline">finance@aegryn.com</a>.
      </p>
    </div>
  )
}
