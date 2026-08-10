import type { Metadata } from 'next'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { getUser } from '@/lib/supabaseServer'
import { createServiceClient } from '@/lib/supabase'
import { ArrowLeft, CheckCircle2, Clock, XCircle } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Transaction — Espace Acquéreur Aegryn',
  robots: { index: false, follow: false },
}

const TX_STEPS = [
  { key: 'ei_submitted',   label: 'EI reçue',        desc: 'Expression d\'Intérêt acceptée par Aegryn.' },
  { key: 'ap_signed',      label: 'AP signé',         desc: 'Accord de Principe validé par les deux parties.' },
  { key: 'escrow_paid',    label: 'Séquestre versé',  desc: 'Montant séquestre confirmé auprès du partenaire fiduciaire.' },
  { key: 'dd_in_progress', label: 'Due Diligence',    desc: 'Accès à la data room et vérification des éléments.' },
  { key: 'signing',        label: 'Signing',          desc: 'Documents de transfert en cours de signature.' },
  { key: 'closed',         label: 'Transaction clôturée', desc: 'Transfert de propriété finalisé.' },
]

function fmtChf(n: number | null) {
  if (n == null) return '—'
  return new Intl.NumberFormat('fr-CH', { style: 'currency', currency: 'CHF', maximumFractionDigits: 0 }).format(n)
}

function fmtDate(d: unknown) {
  if (!d || typeof d !== 'string') return '—'
  return new Date(d).toLocaleDateString('fr-CH', { day: '2-digit', month: 'long', year: 'numeric' })
}

export default async function BuyerTransactionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const user = await getUser()
  if (!user) redirect('/client/login')

  const { id } = await params
  const supa = createServiceClient()

  const { data: tx } = await supa
    .from('transactions')
    .select(`
      id, status, created_at,
      ap_accepted_buyer, ap_accepted_seller, ap_accepted_at,
      escrow_amount_chf, escrow_provider, escrow_bank_iban, escrow_reference, escrow_confirmed_at,
      escrow_release_validated_admin, escrow_release_validated_external, escrow_released_at,
      dd_started_at, dd_deadline_at, dd_extended_to, dataroom_url,
      signing_date, spa_document_url, certificate_url, certificate_issued_at,
      commission_buyer_premium_pct, net_seller_proceeds_chf,
      closed_at, admin_note,
      assets(id, company_name, asset_type, official_grade, arr)
    `)
    .eq('id', id)
    .eq('buyer_id', user.id)
    .single()

  if (!tx) notFound()

  const asset = Array.isArray(tx.assets) ? tx.assets[0] : tx.assets
  const stepIdx = TX_STEPS.findIndex(s => s.key === tx.status)
  const isCancelled = tx.status === 'cancelled'

  return (
    <div className="p-8 max-w-3xl">
      <Link href="/client/buyer/transactions"
        className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-gray-400 hover:text-gray-700 transition-colors mb-8">
        <ArrowLeft size={12} /> Mes transactions
      </Link>

      {/* Header */}
      <div className="mb-8">
        <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-gray-400 mb-1">Transaction PTT</p>
        <h1 className="font-sans font-bold text-gray-900 text-[22px] tracking-tight">
          {asset?.company_name ?? `Transaction #${tx.id.slice(0, 8)}`}
        </h1>
        <div className="flex items-center gap-3 mt-2 flex-wrap">
          {asset?.asset_type && (
            <span className="font-mono text-[9px] uppercase tracking-widest text-gray-400 border border-gray-200 px-2 py-0.5">
              {asset.asset_type}
            </span>
          )}
          {asset?.official_grade && (
            <span className="font-mono text-[9px] font-bold text-gray-600 border border-gray-300 px-2 py-0.5">
              Grade {asset.official_grade}
            </span>
          )}
          {asset?.id && (
            <Link href={`/client/buyer/catalogue/${asset.id}`}
              className="font-mono text-[9px] uppercase tracking-widest text-gray-400 hover:text-ag-navy transition-colors">
              Fiche actif →
            </Link>
          )}
        </div>
      </div>

      {/* Timeline */}
      {!isCancelled ? (
        <div className="bg-white border border-gray-200 p-6 mb-6">
          <p className="font-mono text-[9px] uppercase tracking-widest text-gray-300 mb-4">Avancement du processus</p>
          <div className="flex items-start">
            {TX_STEPS.map((step, i) => {
              const done    = i < stepIdx
              const current = i === stepIdx
              return (
                <div key={step.key} className="flex-1 flex flex-col items-center relative">
                  {i < TX_STEPS.length - 1 && (
                    <div className={`absolute top-3 left-1/2 w-full h-px ${done ? 'bg-ag-apex' : 'bg-gray-200'}`} />
                  )}
                  <div className={`relative z-10 w-6 h-6 rounded-full border-2 flex items-center justify-center mb-2 ${
                    done    ? 'bg-ag-apex border-ag-apex'
                    : current ? 'bg-white border-ag-apex'
                    : 'bg-white border-gray-200'
                  }`}>
                    {done    && <div className="w-2 h-2 bg-ag-navy rounded-full" />}
                    {current && <div className="w-2 h-2 bg-ag-apex rounded-full" />}
                  </div>
                  <p className={`font-sans text-[9px] text-center leading-tight px-1 ${
                    current ? 'text-ag-black font-semibold' : done ? 'text-gray-400' : 'text-gray-300'
                  }`}>{step.label}</p>
                  {current && (
                    <p className="font-sans text-[8px] text-ag-apex text-center mt-0.5 px-1 leading-tight">{step.desc}</p>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      ) : (
        <div className="bg-red-50 border border-red-200 px-5 py-4 mb-6">
          <p className="font-sans text-[13px] text-red-600">Cette transaction a été annulée.</p>
        </div>
      )}

      {/* Accord de Principe */}
      <div className="bg-white border border-gray-200 p-6 mb-4">
        <p className="font-mono text-[9px] uppercase tracking-widest text-gray-300 mb-4">Accord de Principe (AP)</p>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            {tx.ap_accepted_buyer
              ? <CheckCircle2 size={15} className="text-emerald-500 shrink-0" />
              : <Clock size={15} className="text-amber-400 shrink-0" />}
            <span className="font-sans text-[12px] text-gray-700">
              {tx.ap_accepted_buyer ? 'Votre validation reçue' : 'En attente de votre validation'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {tx.ap_accepted_seller
              ? <CheckCircle2 size={15} className="text-emerald-500 shrink-0" />
              : <Clock size={15} className="text-gray-300 shrink-0" />}
            <span className="font-sans text-[12px] text-gray-600">
              {tx.ap_accepted_seller ? 'Cédant validé' : 'Cédant en attente'}
            </span>
          </div>
        </div>
        {tx.ap_accepted_at && (
          <p className="font-mono text-[9px] text-gray-300 mt-3">AP finalisé le {fmtDate(tx.ap_accepted_at)}</p>
        )}
      </div>

      {/* Séquestre */}
      {tx.escrow_amount_chf != null && (
        <div className="bg-white border border-gray-200 p-6 mb-4">
          <p className="font-mono text-[9px] uppercase tracking-widest text-gray-300 mb-4">Séquestre</p>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <p className="font-mono text-[9px] uppercase tracking-widest text-gray-400 mb-1">Montant</p>
              <p className="font-sans font-bold text-[16px] text-gray-900">{fmtChf(tx.escrow_amount_chf)}</p>
            </div>
            {tx.escrow_provider && (
              <div>
                <p className="font-mono text-[9px] uppercase tracking-widest text-gray-400 mb-1">Partenaire fiduciaire</p>
                <p className="font-sans text-[13px] text-gray-700">{tx.escrow_provider}</p>
              </div>
            )}
            {tx.escrow_bank_iban && (
              <div>
                <p className="font-mono text-[9px] uppercase tracking-widest text-gray-400 mb-1">IBAN séquestre</p>
                <p className="font-mono text-[11px] text-gray-600">{tx.escrow_bank_iban}</p>
              </div>
            )}
            {tx.escrow_reference && (
              <div>
                <p className="font-mono text-[9px] uppercase tracking-widest text-gray-400 mb-1">Référence</p>
                <p className="font-mono text-[11px] text-gray-600">{tx.escrow_reference}</p>
              </div>
            )}
          </div>
          {tx.escrow_confirmed_at && (
            <div className="flex items-center gap-2">
              <CheckCircle2 size={13} className="text-emerald-500" />
              <p className="font-sans text-[11px] text-gray-600">Séquestre confirmé le {fmtDate(tx.escrow_confirmed_at)}</p>
            </div>
          )}
          {tx.escrow_released_at && (
            <div className="flex items-center gap-2 mt-1">
              <CheckCircle2 size={13} className="text-emerald-600" />
              <p className="font-sans text-[11px] text-gray-600">Séquestre libéré le {fmtDate(tx.escrow_released_at)}</p>
            </div>
          )}
          {!tx.escrow_released_at && (tx.escrow_release_validated_admin || tx.escrow_release_validated_external) && (
            <div className="mt-3 flex flex-col gap-1">
              <p className="font-mono text-[9px] uppercase tracking-widest text-gray-300 mb-1">Libération double-validation</p>
              <div className={`flex items-center gap-2 ${tx.escrow_release_validated_admin ? 'text-emerald-600' : 'text-gray-300'}`}>
                {tx.escrow_release_validated_admin ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                <span className="font-sans text-[11px]">Validation Aegryn</span>
              </div>
              <div className={`flex items-center gap-2 ${tx.escrow_release_validated_external ? 'text-emerald-600' : 'text-gray-300'}`}>
                {tx.escrow_release_validated_external ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                <span className="font-sans text-[11px]">Validation partenaire externe</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Due Diligence */}
      {(tx.dd_started_at || tx.dataroom_url) && (
        <div className="bg-white border border-gray-200 p-6 mb-4">
          <p className="font-mono text-[9px] uppercase tracking-widest text-gray-300 mb-4">Due Diligence</p>
          <div className="grid grid-cols-2 gap-4 mb-4">
            {tx.dd_started_at && (
              <div>
                <p className="font-mono text-[9px] uppercase tracking-widest text-gray-400 mb-1">Démarrée le</p>
                <p className="font-sans text-[13px] text-gray-700">{fmtDate(tx.dd_started_at)}</p>
              </div>
            )}
            {tx.dd_deadline_at && (
              <div>
                <p className="font-mono text-[9px] uppercase tracking-widest text-gray-400 mb-1">
                  {tx.dd_extended_to ? 'Prolongée au' : 'Échéance'}
                </p>
                <p className="font-sans text-[13px] text-gray-700">
                  {fmtDate(tx.dd_extended_to ?? tx.dd_deadline_at)}
                </p>
              </div>
            )}
          </div>
          {tx.dataroom_url && (
            <a href={tx.dataroom_url} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-ag-navy border border-ag-navy px-4 py-2 hover:bg-ag-navy hover:text-white transition-colors">
              Accéder à la data room →
            </a>
          )}
        </div>
      )}

      {/* Signing & Documents */}
      {(tx.signing_date || tx.spa_document_url || tx.certificate_url) && (
        <div className="bg-white border border-gray-200 p-6 mb-4">
          <p className="font-mono text-[9px] uppercase tracking-widest text-gray-300 mb-4">Documents de transfert</p>
          <div className="flex flex-col gap-3">
            {tx.signing_date && (
              <div>
                <p className="font-mono text-[9px] uppercase tracking-widest text-gray-400 mb-1">Date de signing</p>
                <p className="font-sans text-[13px] text-gray-700">{fmtDate(tx.signing_date)}</p>
              </div>
            )}
            {tx.spa_document_url && (
              <a href={tx.spa_document_url} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-gray-600 border border-gray-300 px-4 py-2 hover:border-gray-500 transition-colors w-fit">
                SPA / Acte de cession →
              </a>
            )}
            {tx.certificate_url && (
              <a href={tx.certificate_url} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-ag-navy border border-ag-navy px-4 py-2 hover:bg-ag-navy hover:text-white transition-colors w-fit">
                Certificat de Transaction Aegryn →
              </a>
            )}
          </div>
        </div>
      )}

      {/* Note admin */}
      {tx.admin_note && (
        <div className="bg-gray-50 border border-gray-200 px-5 py-4 mb-4">
          <p className="font-mono text-[9px] uppercase tracking-widest text-gray-400 mb-2">Message de l&apos;équipe Aegryn</p>
          <p className="font-sans text-[13px] text-gray-700 leading-relaxed">{tx.admin_note}</p>
        </div>
      )}

      {/* Contact */}
      <div className="bg-ag-navy/5 border border-ag-navy/20 px-5 py-4">
        <p className="font-sans text-[12px] text-gray-600">
          Pour toute question sur cette transaction, contactez votre deal manager à{' '}
          <a href="mailto:contact@boha-group.com" className="text-ag-navy underline">contact@boha-group.com</a>{' '}
          en mentionnant la référence <span className="font-mono text-[10px]">{tx.id}</span>.
        </p>
      </div>
    </div>
  )
}
