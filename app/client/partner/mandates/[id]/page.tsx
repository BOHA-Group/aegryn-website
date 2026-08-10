import type { Metadata } from 'next'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { getUser } from '@/lib/supabaseServer'
import { createServiceClient } from '@/lib/supabase'
import MandateDetailClient from './MandateDetailClient'

export const metadata: Metadata = {
  title: 'Mandat — Espace Partenaire Aegryn',
  robots: { index: false, follow: false },
}

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  active:    { label: 'Actif',    color: 'text-emerald-600 border-emerald-200 bg-emerald-50' },
  completed: { label: 'Terminé', color: 'text-gray-500 border-gray-200 bg-gray-50' },
  cancelled: { label: 'Annulé',  color: 'text-red-500 border-red-100 bg-red-50' },
}

const TYPE_LABELS: Record<string, string> = {
  advisory:      'Conseil stratégique',
  due_diligence: 'Due diligence',
  fundraising:   'Levée de fonds',
  other:         'Autre',
}

const CLIENT_TYPE_LABELS: Record<string, string> = {
  seller: 'Vendeur',
  buyer:  'Acquéreur',
  other:  'Autre',
}

const INVOICE_STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  declared:  { label: 'Déclarée',  color: 'text-amber-600 border-amber-200 bg-amber-50' },
  confirmed: { label: 'Confirmée', color: 'text-blue-600 border-blue-200 bg-blue-50' },
  received:  { label: 'Reçue',     color: 'text-emerald-600 border-emerald-200 bg-emerald-50' },
}

function fmtDate(d: unknown) {
  if (!d || typeof d !== 'string') return '—'
  return new Date(d).toLocaleDateString('fr-CH', { day: '2-digit', month: 'long', year: 'numeric' })
}

function fmtChf(n: number | null | undefined) {
  if (n == null) return '—'
  return new Intl.NumberFormat('fr-CH', { style: 'currency', currency: 'CHF', maximumFractionDigits: 0 }).format(n)
}

export default async function MandateDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const user = await getUser()
  if (!user) redirect('/client/login')

  const supa = createServiceClient()

  const { data: mandate } = await supa
    .from('partner_mandates')
    .select('*, assets(company_name, official_grade)')
    .eq('id', id)
    .eq('partner_id', user.id)
    .single()

  if (!mandate) notFound()

  const m = mandate as Record<string, unknown>

  const { data: invoices } = await supa
    .from('partner_mandate_invoices')
    .select('*')
    .eq('mandate_id', id)
    .order('invoice_date', { ascending: false })

  const { data: messages } = await supa
    .from('partner_mandate_messages')
    .select('id, body, is_admin, created_at, sender_id')
    .eq('mandate_id', id)
    .order('created_at', { ascending: true })

  const ivs = (invoices ?? []) as Record<string, unknown>[]
  const msgs = (messages ?? []) as Record<string, unknown>[]

  const totalInvoiced   = ivs.reduce((s, iv) => s + Number(iv.invoice_amount_chf ?? 0), 0)
  const totalRetro      = ivs.reduce((s, iv) => s + Number(iv.retrocession_amount_chf ?? 0), 0)
  const totalReceived   = ivs.filter(iv => iv.status === 'received').reduce((s, iv) => s + Number(iv.retrocession_amount_chf ?? 0), 0)

  const statusCfg = STATUS_CONFIG[String(m.status ?? 'active')] ?? STATUS_CONFIG.active
  const asset = Array.isArray(m.assets)
    ? (m.assets as Record<string, unknown>[])[0]
    : m.assets as Record<string, unknown> | null

  return (
    <div className="p-8 max-w-4xl">

      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Link
              href="/client/partner/mandates"
              className="font-mono text-[10px] tracking-[0.22em] uppercase text-gray-400 hover:text-gray-600 transition-colors"
            >
              ← Mandats
            </Link>
          </div>
          <h1 className="font-sans font-bold text-gray-900 text-[24px] tracking-tight">
            {String(m.client_name ?? '')}
          </h1>
          <div className="flex items-center gap-2 mt-1">
            <p className="font-mono text-[10px] text-gray-400 uppercase tracking-widest">
              {CLIENT_TYPE_LABELS[String(m.client_type ?? '')] ?? String(m.client_type ?? '')}
              {' · '}
              {TYPE_LABELS[String(m.mandate_type ?? '')] ?? String(m.mandate_type ?? '')}
              {asset?.company_name ? ` · ${String(asset.company_name)}` : ''}
            </p>
            <span className={`border px-2 py-0.5 font-mono text-[9px] uppercase tracking-widest ${statusCfg.color}`}>
              {statusCfg.label}
            </span>
          </div>
        </div>
      </div>

      {/* Infos mandat */}
      <div className="bg-white border border-gray-200 p-5 mb-6">
        <h2 className="font-mono text-[10px] uppercase tracking-widest text-gray-400 mb-4">Détails du mandat</h2>
        <dl className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <div>
            <dt className="font-mono text-[8px] uppercase tracking-widest text-gray-300 mb-0.5">Client</dt>
            <dd className="font-sans text-[13px] font-semibold text-gray-800">{String(m.client_name ?? '—')}</dd>
            <dd className="font-sans text-[11px] text-gray-400">{String(m.client_email ?? '')}</dd>
          </div>
          <div>
            <dt className="font-mono text-[8px] uppercase tracking-widest text-gray-300 mb-0.5">Rétrocession Aegryn</dt>
            <dd className="font-sans text-[13px] font-semibold text-gray-800">{String(m.retrocession_pct ?? 15)}% de vos honoraires</dd>
          </div>
          {!!m.started_at && (
            <div>
              <dt className="font-mono text-[8px] uppercase tracking-widest text-gray-300 mb-0.5">Démarré le</dt>
              <dd className="font-sans text-[13px] text-gray-700">{fmtDate(m.started_at)}</dd>
            </div>
          )}
          {!!m.description && (
            <div className="col-span-full">
              <dt className="font-mono text-[8px] uppercase tracking-widest text-gray-300 mb-0.5">Description</dt>
              <dd className="font-sans text-[12px] text-gray-600 leading-relaxed">{String(m.description)}</dd>
            </div>
          )}
        </dl>
      </div>

      {/* Récap financier */}
      {ivs.length > 0 && (
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-gray-50 border border-gray-200 p-4">
            <p className="font-mono text-[8px] uppercase tracking-widest text-gray-400 mb-1">Total facturé client</p>
            <p className="font-sans font-bold text-[18px] text-gray-900">{fmtChf(totalInvoiced)}</p>
          </div>
          <div className="bg-amber-50 border border-amber-200 p-4">
            <p className="font-mono text-[8px] uppercase tracking-widest text-amber-600 mb-1">Rétrocession due</p>
            <p className="font-sans font-bold text-[18px] text-amber-700">{fmtChf(totalRetro)}</p>
          </div>
          <div className="bg-emerald-50 border border-emerald-200 p-4">
            <p className="font-mono text-[8px] uppercase tracking-widest text-emerald-600 mb-1">Rétrocession reçue</p>
            <p className="font-sans font-bold text-[18px] text-emerald-700">{fmtChf(totalReceived)}</p>
          </div>
        </div>
      )}

      {/* Factures */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-mono text-[10px] uppercase tracking-widest text-gray-400">Factures déclarées</h2>
        </div>

        {ivs.length === 0 ? (
          <div className="bg-white border border-gray-200 px-6 py-10 text-center">
            <p className="font-sans text-[13px] text-gray-400">
              Aucune facture déclarée. Déclarez vos factures ci-dessous dès émission.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {ivs.map(iv => {
              const ivStatusCfg = INVOICE_STATUS_CONFIG[String(iv.status ?? 'declared')] ?? INVOICE_STATUS_CONFIG.declared
              return (
                <div key={String(iv.id)} className="bg-white border border-gray-200 p-4 flex items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="font-sans text-[13px] font-semibold text-gray-800">
                        {fmtChf(Number(iv.invoice_amount_chf ?? 0))}
                      </p>
                      {!!iv.invoice_ref && (
                        <span className="font-mono text-[9px] text-gray-400">— {String(iv.invoice_ref)}</span>
                      )}
                    </div>
                    <p className="font-mono text-[9px] text-gray-400">
                      Émise le {fmtDate(iv.invoice_date)} · rétrocession {fmtChf(Number(iv.retrocession_amount_chf ?? 0))}
                    </p>
                  </div>
                  <span className={`border px-2.5 py-1 font-mono text-[9px] uppercase tracking-widest shrink-0 ${ivStatusCfg.color}`}>
                    {ivStatusCfg.label}
                  </span>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Formulaire déclaration facture + messagerie — Client Component */}
      <MandateDetailClient
        mandateId={id}
        userId={user.id}
        mandateStatus={String(m.status ?? 'active')}
        retrocessionPct={Number(m.retrocession_pct ?? 15)}
        messages={msgs}
      />
    </div>
  )
}
