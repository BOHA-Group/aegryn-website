import type { Metadata } from 'next'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { getUser } from '@/lib/supabaseServer'
import { createServiceClient } from '@/lib/supabase'
import { ArrowLeft, ArrowUpRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Détail offre — Espace Acquéreur AEGRYN',
  robots: { index: false, follow: false },
}

const STATUS_LABELS: Record<string, { label: string; desc: string }> = {
  draft:     { label: 'Brouillon',    desc: 'Votre offre n\'a pas encore été soumise.' },
  submitted: { label: 'Soumise',      desc: 'Votre offre est en cours d\'examen par l\'équipe AEGRYN.' },
  retained:  { label: 'Retenue',      desc: 'Votre offre a été retenue. Un deal manager va vous contacter.' },
  rejected:  { label: 'Non retenue',  desc: 'Votre offre n\'a pas été retenue pour ce dossier.' },
  withdrawn: { label: 'Retirée',      desc: 'Vous avez retiré cette offre.' },
}

const STATUS_COLOR: Record<string, string> = {
  draft:     'border-gray-200 bg-gray-50 text-gray-500',
  submitted: 'border-blue-200 bg-blue-50 text-blue-700',
  retained:  'border-emerald-200 bg-emerald-50 text-emerald-700',
  rejected:  'border-red-200 bg-red-50 text-red-600',
  withdrawn: 'border-gray-200 bg-gray-50 text-gray-400',
}

function fmtChf(n: number | null) {
  if (n == null) return '—'
  return new Intl.NumberFormat('fr-CH', { style: 'currency', currency: 'CHF', maximumFractionDigits: 0 }).format(n)
}

function fmtDate(d: unknown) {
  if (!d || typeof d !== 'string') return '—'
  return new Date(d).toLocaleDateString('fr-CH', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

export default async function BuyerOfferDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const user = await getUser()
  if (!user) redirect('/client/login')

  const { id } = await params
  const supa = createServiceClient()

  const { data: bid } = await supa
    .from('auction_bids')
    .select('id, amount_chf, status, created_at, admin_note, asset_id, assets(id, company_name, asset_type, official_grade, arr, status)')
    .eq('id', id)
    .eq('bidder_id', user.id)
    .single()

  if (!bid) notFound()

  const asset = Array.isArray(bid.assets) ? bid.assets[0] : bid.assets

  const statusInfo = STATUS_LABELS[bid.status] ?? { label: bid.status, desc: '' }

  return (
    <div className="p-8 max-w-2xl">
      <Link href="/client/buyer/offres"
        className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-gray-400 hover:text-gray-700 transition-colors mb-8">
        <ArrowLeft size={12} /> Mes offres
      </Link>

      {/* Header */}
      <div className="mb-8">
        <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-gray-400 mb-1">Expression d&apos;Intérêt</p>
        <h1 className="font-sans font-bold text-gray-900 text-[22px] tracking-tight">
          {asset?.company_name ?? `Actif #${bid.asset_id?.slice(0, 8)}`}
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
              className="font-mono text-[9px] uppercase tracking-widest text-gray-400 hover:text-ag-navy transition-colors flex items-center gap-1">
              Voir la fiche <ArrowUpRight size={9} />
            </Link>
          )}
        </div>
      </div>

      {/* Statut */}
      <div className={`border p-5 mb-6 ${STATUS_COLOR[bid.status] ?? 'border-gray-200 bg-gray-50 text-gray-500'}`}>
        <p className="font-mono text-[9px] uppercase tracking-widest opacity-60 mb-1">Statut de l&apos;offre</p>
        <p className="font-sans font-semibold text-[15px] mb-1">{statusInfo.label}</p>
        <p className="font-sans text-[12px] opacity-80">{statusInfo.desc}</p>
      </div>

      {/* Détails */}
      <div className="bg-white border border-gray-200 p-6 mb-6">
        <div className="grid grid-cols-2 gap-6">
          <div>
            <p className="font-mono text-[9px] uppercase tracking-widest text-gray-400 mb-1">Montant proposé</p>
            <p className="font-sans font-bold text-[20px] text-gray-900">{fmtChf(bid.amount_chf)}</p>
          </div>
          <div>
            <p className="font-mono text-[9px] uppercase tracking-widest text-gray-400 mb-1">Date de soumission</p>
            <p className="font-sans text-[13px] text-gray-700">{fmtDate(bid.created_at)}</p>
          </div>
          {asset?.arr != null && (
            <div>
              <p className="font-mono text-[9px] uppercase tracking-widest text-gray-400 mb-1">ARR de la cible</p>
              <p className="font-sans text-[13px] text-gray-700">{fmtChf(asset.arr)}</p>
            </div>
          )}
          <div>
            <p className="font-mono text-[9px] uppercase tracking-widest text-gray-400 mb-1">Référence offre</p>
            <p className="font-mono text-[11px] text-gray-500">{bid.id}</p>
          </div>
        </div>
      </div>

      {/* Note admin */}
      {bid.admin_note && (
        <div className={`border px-5 py-4 mb-6 ${bid.status === 'rejected' ? 'border-red-200 bg-red-50' : 'border-gray-200 bg-gray-50'}`}>
          <p className="font-mono text-[9px] uppercase tracking-widest text-gray-400 mb-2">Message de l&apos;équipe AEGRYN</p>
          <p className="font-sans text-[13px] text-gray-700 leading-relaxed">{bid.admin_note}</p>
        </div>
      )}

      {/* Actions contextuelles */}
      {bid.status === 'retained' && (
        <div className="bg-ag-navy p-5">
          <p className="font-mono text-[9px] uppercase tracking-widest text-white/40 mb-1">Prochaine étape</p>
          <p className="font-sans text-white text-[13px] mb-3">
            Votre offre a été retenue. Un deal manager AEGRYN vous contactera par email pour organiser la suite du processus (data room, Accord de Principe).
          </p>
          <Link href="/client/buyer/transactions"
            className="inline-flex items-center gap-1.5 bg-ag-apex text-ag-navy font-mono text-[10px] uppercase tracking-widest px-4 py-2 hover:bg-ag-apex/90 transition-colors">
            Mes transactions <ArrowUpRight size={10} />
          </Link>
        </div>
      )}

      {bid.status === 'submitted' && (
        <div className="bg-gray-50 border border-gray-200 p-5">
          <p className="font-sans text-[12px] text-gray-500">
            Votre offre est en attente d&apos;examen. L&apos;équipe AEGRYN vous répondra dans les <strong>48h ouvrables</strong>. En cas d&apos;urgence, contactez <a href="mailto:contact@aegryn.com" className="text-ag-navy underline">contact@aegryn.com</a>.
          </p>
        </div>
      )}
    </div>
  )
}
