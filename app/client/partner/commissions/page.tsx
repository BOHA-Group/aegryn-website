import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { getUser } from '@/lib/supabaseServer'
import { createServiceClient } from '@/lib/supabase'
import { DollarSign } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Commissions — Espace Partenaire AEGRYN',
  robots: { index: false, follow: false },
}

const TYPE_LABELS: Record<string, string> = {
  cosignature:          'Co-signature CIFS',
  introduction_asset:   'Introduction actif',
  introduction_buyer:   'Introduction acquéreur',
}

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  pending:    { label: 'En attente',  color: 'text-gray-400 border-gray-200 bg-gray-50' },
  to_invoice: { label: 'À facturer', color: 'text-amber-600 border-amber-200 bg-amber-50' },
  invoiced:   { label: 'Facturée',   color: 'text-blue-600 border-blue-200 bg-blue-50' },
  paid:       { label: 'Payée',      color: 'text-emerald-600 border-emerald-200 bg-emerald-50' },
}

function fmtChf(n: number | null) {
  if (n == null) return '—'
  return new Intl.NumberFormat('fr-CH', { style: 'currency', currency: 'CHF', maximumFractionDigits: 0 }).format(n)
}

function fmtDate(d: unknown) {
  if (!d || typeof d !== 'string') return '—'
  return new Date(d).toLocaleDateString('fr-CH', { day: '2-digit', month: 'long', year: 'numeric' })
}

type Commission = {
  id: string
  type: string
  amount_chf: number | null
  status: string
  eligible_at: string | null
  invoiced_at: string | null
  paid_at: string | null
  admin_note: string | null
  created_at: string
}

export default async function PartnerCommissionsPage() {
  const user = await getUser()
  if (!user) redirect('/client/login')

  const supa = createServiceClient()
  const { data: commissions } = await supa
    .from('commissions')
    .select('id, type, amount_chf, status, eligible_at, invoiced_at, paid_at, admin_note, created_at')
    .eq('partner_id', user.id)
    .order('created_at', { ascending: false })

  const cs = (commissions ?? []) as Commission[]

  const totalPaid    = cs.filter(c => c.status === 'paid').reduce((s, c) => s + (c.amount_chf ?? 0), 0)
  const totalPending = cs.filter(c => ['pending', 'to_invoice', 'invoiced'].includes(c.status)).reduce((s, c) => s + (c.amount_chf ?? 0), 0)

  return (
    <div className="p-8 max-w-4xl">

      <div className="mb-8">
        <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-gray-400 mb-1">Espace Partenaire</p>
        <h1 className="font-sans font-bold text-gray-900 text-[24px] tracking-tight">Commissions</h1>
        <p className="font-sans text-[13px] text-gray-400 mt-1">
          Commissions dues au titre de vos co-signatures et introductions qualifiées.
        </p>
      </div>

      {/* Récap financier */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-emerald-50 border border-emerald-200 p-5">
          <p className="font-mono text-[9px] uppercase tracking-widest text-emerald-600 mb-1">Total perçu</p>
          <p className="font-sans font-bold text-[22px] text-emerald-700">{fmtChf(totalPaid || null)}</p>
        </div>
        <div className="bg-amber-50 border border-amber-200 p-5">
          <p className="font-mono text-[9px] uppercase tracking-widest text-amber-600 mb-1">En attente de règlement</p>
          <p className="font-sans font-bold text-[22px] text-amber-700">{fmtChf(totalPending || null)}</p>
        </div>
      </div>

      {!cs || cs.length === 0 ? (
        <div className="bg-white border border-gray-200 px-8 py-16 text-center">
          <DollarSign size={24} className="text-gray-300 mx-auto mb-4" />
          <p className="font-sans text-[14px] text-gray-400">
            Aucune commission enregistrée pour le moment.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {cs.map(c => {
            const statusCfg = STATUS_CONFIG[c.status] ?? STATUS_CONFIG.pending

            return (
              <div key={c.id} className="bg-white border border-gray-200 p-5">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div>
                    <p className="font-sans font-semibold text-gray-900 text-[13px]">
                      {TYPE_LABELS[c.type] ?? c.type}
                    </p>
                    <p className="font-mono text-[9px] text-gray-400 mt-0.5">
                      Enregistrée le {fmtDate(c.created_at)}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="font-mono font-bold text-[15px] text-gray-800">{fmtChf(c.amount_chf)}</span>
                    <span className={`border px-2.5 py-1 font-mono text-[9px] uppercase tracking-widest ${statusCfg.color}`}>
                      {statusCfg.label}
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-5">
                  {c.eligible_at && (
                    <div>
                      <p className="font-mono text-[8px] uppercase tracking-widest text-gray-300 mb-0.5">Date d&apos;éligibilité</p>
                      <p className="font-sans text-[11px] text-gray-600">{fmtDate(c.eligible_at)}</p>
                    </div>
                  )}
                  {c.invoiced_at && (
                    <div>
                      <p className="font-mono text-[8px] uppercase tracking-widest text-gray-300 mb-0.5">Facturée le</p>
                      <p className="font-sans text-[11px] text-gray-600">{fmtDate(c.invoiced_at)}</p>
                    </div>
                  )}
                  {c.paid_at && (
                    <div>
                      <p className="font-mono text-[8px] uppercase tracking-widest text-gray-300 mb-0.5">Payée le</p>
                      <p className="font-sans text-[11px] text-emerald-600">{fmtDate(c.paid_at)}</p>
                    </div>
                  )}
                </div>

                {c.status === 'to_invoice' && (
                  <div className="mt-3 bg-amber-50 border border-amber-200 px-4 py-2.5">
                    <p className="font-sans text-[11px] text-amber-800">
                      ⚠️ Cette commission est à facturer. Transmettez votre facture à{' '}
                      <a href="mailto:finance@boha-group.com" className="underline">finance@boha-group.com</a>{' '}
                      en mentionnant la référence <span className="font-mono text-[10px]">{c.id}</span>.
                    </p>
                  </div>
                )}

                {c.admin_note && (
                  <div className="mt-3 bg-gray-50 border border-gray-200 px-3 py-2">
                    <p className="font-mono text-[8px] uppercase tracking-widest text-gray-400 mb-1">Note AEGRYN</p>
                    <p className="font-sans text-[11px] text-gray-600">{c.admin_note}</p>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      <div className="mt-8 px-5 py-4 border border-gray-200 bg-gray-50">
        <p className="font-sans text-[11px] text-gray-400 leading-relaxed">
          Les commissions sont calculées conformément à votre contrat de partenariat AEGRYN et deviennent éligibles à la date de closing de la transaction. Pour toute question, contactez <a href="mailto:finance@boha-group.com" className="text-ag-navy underline">finance@boha-group.com</a>.
        </p>
      </div>
    </div>
  )
}
