/**
 * /client/buyer/catalogue/[id]/diligence
 * ──────────────────────────────────────────────────────────────────
 * Page due diligence acquéreur.
 *
 * Flux :
 *  1. KYC non approuvé → bloc KYC
 *  2. data_room_light_enabled = false → data room non disponible
 *  3. Pas encore de demande → bouton "Demander l'accès"
 *  4. Demande pending → message d'attente
 *  5. Demande approved → documents light visibles + instruction séquestre 10%
 *  6. Séquestre 'received' → data room complète débloquée (via transaction/offre)
 */
import type { Metadata }     from 'next'
import { redirect, notFound } from 'next/navigation'
import Link                  from 'next/link'
import { getUser }           from '@/lib/supabaseServer'
import { createServiceClient } from '@/lib/supabase'
import {
  ArrowLeft, ShieldCheck, Clock, FileText, Lock, ChevronRight, AlertCircle,
} from 'lucide-react'
import DiligenceRequestButton from './DiligenceRequestButton'
import LightDocumentViewer   from './LightDocumentViewer'

export const metadata: Metadata = {
  title: 'Due Diligence — Espace Acquéreur Aegryn',
  robots: { index: false, follow: false },
}

function fmtChf(n: number | null | undefined) {
  if (n == null) return '—'
  return new Intl.NumberFormat('fr-CH', { style: 'currency', currency: 'CHF', maximumFractionDigits: 0 }).format(n)
}

export default async function DiligencePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const user = await getUser()
  if (!user) redirect('/client/login')

  const { id: assetId } = await params
  const supa = createServiceClient()

  /* ── 1. KYC check ── */
  const { data: profile } = await supa
    .from('profiles')
    .select('kyc_status, auction_nda_signed_at')
    .eq('id', user.id)
    .single() as { data: { kyc_status: string | null; auction_nda_signed_at: string | null } | null }

  const kycApproved = profile?.kyc_status === 'approved'

  /* ── 2. Actif ── */
  const { data: asset } = await supa
    .from('assets')
    .select('id, company_name, asset_type, arr, official_grade, score_total, data_room_light_enabled, status')
    .eq('id', assetId)
    .eq('status', 'published')
    .single() as {
      data: {
        id: string
        company_name: string | null
        asset_type: string | null
        arr: number | null
        official_grade: string | null
        score_total: number | null
        data_room_light_enabled: boolean
        status: string
      } | null
    }

  if (!asset) notFound()

  /* ── 3. Statut demande light ── */
  const { data: lightRequest } = await supa
    .from('data_room_light_requests')
    .select('id, status, bid_amount_chf, reviewed_at')
    .eq('asset_id', assetId)
    .eq('user_id', user.id)
    .maybeSingle() as {
      data: {
        id: string
        status: string
        bid_amount_chf: number | null
        reviewed_at: string | null
      } | null
    }

  /* ── 4. Documents light (si accès approuvé) ── */
  const lightDocs = lightRequest?.status === 'approved'
    ? await supa
        .from('data_room_documents')
        .select('id, file_name, document_type, category, is_sensitive, uploaded_at')
        .eq('asset_id', assetId)
        .eq('visible_to', 'light_buyers')
        .order('category')
        .then(r => (r.data ?? []) as {
          id: string
          file_name: string
          document_type: string
          category: string
          is_sensitive: boolean
          uploaded_at: string
        }[])
    : []

  /* ── 5. Séquestre existant ── */
  const { data: sequester } = await supa
    .from('auction_sequesters')
    .select('id, status, amount_chf, reference, received_at')
    .eq('asset_id', assetId)
    .eq('user_id', user.id)
    .maybeSingle() as {
      data: {
        id: string
        status: string
        amount_chf: number | null
        reference: string | null
        received_at: string | null
      } | null
    }

  const sequesterReceived = sequester?.status === 'received'

  /* ── Calcul montant séquestre ── */
  const bidAmount = lightRequest?.bid_amount_chf ?? null
  const sequesterAmount = bidAmount ? Math.round(bidAmount * 0.1) : null

  return (
    <div className="p-8 max-w-3xl">

      {/* Back */}
      <Link
        href={`/client/buyer/catalogue/${assetId}`}
        className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-gray-400 hover:text-gray-700 transition-colors mb-8"
      >
        <ArrowLeft size={12} /> Retour à la fiche
      </Link>

      {/* Header */}
      <div className="mb-8">
        <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-gray-400 mb-1">
          Due Diligence — Accès data room
        </p>
        <h1 className="font-sans font-bold text-gray-900 text-[22px] tracking-tight">
          {asset.company_name ?? `Actif #${assetId.slice(0, 8)}`}
        </h1>
        <div className="flex items-center gap-3 mt-2 flex-wrap">
          {asset.asset_type && (
            <span className="font-mono text-[9px] uppercase tracking-widest text-gray-400 border border-gray-200 px-2 py-0.5">
              {asset.asset_type}
            </span>
          )}
          {asset.official_grade && (
            <span className="font-mono text-[9px] font-bold text-gray-600 border border-gray-300 px-2 py-0.5">
              Grade {asset.official_grade}
            </span>
          )}
          {asset.arr != null && (
            <span className="font-sans text-[11px] text-gray-400">ARR {fmtChf(asset.arr)}</span>
          )}
        </div>
      </div>

      {/* ── Bloc KYC requis ── */}
      {!kycApproved && (
        <div className="bg-amber-50 border border-amber-200 p-6 mb-6">
          <div className="flex items-start gap-3">
            <ShieldCheck size={16} className="text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-mono text-[10px] uppercase tracking-widest text-amber-600 mb-1">KYC requis</p>
              <p className="font-sans text-[13px] text-amber-800 mb-4">
                L&apos;accès à la data room nécessite la validation complète de votre KYC.
                {profile?.kyc_status === 'in_review' && ' Votre dossier est en cours d\'examen.'}
              </p>
              <Link
                href="/client/buyer/kyc"
                className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest bg-amber-600 text-white px-4 py-2 hover:bg-amber-700 transition-colors"
              >
                Compléter mon KYC <ChevronRight size={11} />
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* ── Data room light non disponible ── */}
      {kycApproved && !asset.data_room_light_enabled && (
        <div className="bg-gray-50 border border-gray-200 p-6 mb-6">
          <div className="flex items-start gap-3">
            <Lock size={15} className="text-gray-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-mono text-[10px] uppercase tracking-widest text-gray-400 mb-1">Data room en préparation</p>
              <p className="font-sans text-[13px] text-gray-600">
                La data room light n&apos;est pas encore disponible pour cet actif. Revenez prochainement ou contactez votre deal manager.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ── Accès disponible : pas encore de demande ── */}
      {kycApproved && asset.data_room_light_enabled && !lightRequest && (
        <div className="bg-white border border-gray-200 p-6 mb-6">
          <p className="font-mono text-[9px] uppercase tracking-widest text-gray-300 mb-4">Étape 1 — Demande d&apos;accès</p>
          <p className="font-sans text-[13px] text-gray-700 leading-relaxed mb-6">
            Demandez l&apos;accès à la <strong>data room light</strong> de cet actif. Vous recevrez un accès aux documents préliminaires
            ainsi qu&apos;un <strong>montant indicatif</strong> servant de base au calcul du séquestre obligatoire (10%).
          </p>
          <DiligenceRequestButton assetId={assetId} />
        </div>
      )}

      {/* ── Demande en attente ── */}
      {kycApproved && lightRequest?.status === 'pending' && (
        <div className="bg-blue-50 border border-blue-200 p-6 mb-6">
          <div className="flex items-start gap-3">
            <Clock size={15} className="text-blue-500 shrink-0 mt-0.5" />
            <div>
              <p className="font-mono text-[10px] uppercase tracking-widest text-blue-600 mb-1">Demande en cours d&apos;examen</p>
              <p className="font-sans text-[13px] text-blue-800">
                Votre demande d&apos;accès est en cours de traitement par l&apos;équipe Aegryn. Vous serez notifié par email dès validation.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ── Demande rejetée ── */}
      {kycApproved && lightRequest?.status === 'rejected' && (
        <div className="bg-red-50 border border-red-200 p-6 mb-6">
          <div className="flex items-start gap-3">
            <AlertCircle size={15} className="text-red-500 shrink-0 mt-0.5" />
            <div>
              <p className="font-mono text-[10px] uppercase tracking-widest text-red-600 mb-1">Accès refusé</p>
              <p className="font-sans text-[13px] text-red-800">
                Votre demande d&apos;accès a été refusée. Contactez votre deal manager à{' '}
                <a href="mailto:contact@boha-group.com" className="underline">contact@boha-group.com</a>.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ── Accès approuvé ── */}
      {kycApproved && lightRequest?.status === 'approved' && (
        <>
          {/* Montant indicatif + instruction séquestre */}
          {bidAmount != null && !sequesterReceived && (
            <div className="bg-ag-navy text-white p-6 mb-6">
              <p className="font-mono text-[9px] uppercase tracking-widest text-white/40 mb-3">
                Étape 2 — Séquestre obligatoire
              </p>
              <div className="flex items-start justify-between gap-4 mb-5">
                <div>
                  <p className="font-sans text-[13px] text-white/70 mb-1">Montant indicatif communiqué</p>
                  <p className="font-mono font-bold text-[28px] tracking-tight">{fmtChf(bidAmount)}</p>
                </div>
                <div className="text-right">
                  <p className="font-sans text-[13px] text-white/70 mb-1">Séquestre à verser (10%)</p>
                  <p className="font-mono font-bold text-[28px] tracking-tight text-ag-apex">{fmtChf(sequesterAmount)}</p>
                </div>
              </div>
              <div className="border-t border-white/10 pt-4 space-y-2 text-[12px] text-white/60">
                <p>
                  Pour accéder à la <strong className="text-white">data room complète</strong> et soumettre votre offre formelle,
                  vous devez verser un séquestre de <strong className="text-ag-apex">{fmtChf(sequesterAmount)}</strong> sur le compte fiduciaire Aegryn.
                </p>
                <p>
                  Ce montant sera déduit du prix d&apos;acquisition si votre offre est retenue, ou restitué dans les 10 jours ouvrés en cas de non-adjudication.
                </p>
              </div>
              <div className="mt-5 pt-4 border-t border-white/10">
                <p className="font-mono text-[9px] uppercase tracking-widest text-white/40 mb-2">Instructions de virement</p>
                <p className="font-sans text-[12px] text-white/70">
                  Contactez votre deal manager à{' '}
                  <a href="mailto:contact@boha-group.com" className="text-ag-apex underline">contact@boha-group.com</a>{' '}
                  pour recevoir les coordonnées bancaires et la référence de virement à utiliser impérativement.
                </p>
              </div>
            </div>
          )}

          {/* Séquestre déjà versé */}
          {sequester && (
            <div className={`border p-5 mb-6 ${
              sequesterReceived
                ? 'bg-emerald-50 border-emerald-200'
                : 'bg-amber-50 border-amber-200'
            }`}>
              <p className={`font-mono text-[9px] uppercase tracking-widest mb-1 ${sequesterReceived ? 'text-emerald-600' : 'text-amber-600'}`}>
                Séquestre {sequesterReceived ? 'confirmé ✓' : 'en attente de confirmation'}
              </p>
              <p className="font-sans text-[13px] text-gray-700">
                {sequesterReceived
                  ? `Votre séquestre de ${fmtChf(sequester.amount_chf)} a été reçu et confirmé le ${sequester.received_at ? new Date(sequester.received_at).toLocaleDateString('fr-CH') : '—'}. La data room complète est accessible.`
                  : `Séquestre de ${fmtChf(sequester.amount_chf)} en attente de réception bancaire. Référence : ${sequester.reference ?? '—'}.`}
              </p>
            </div>
          )}

          {/* Documents light */}
          <div className="bg-white border border-gray-200 p-6 mb-6">
            <p className="font-mono text-[9px] uppercase tracking-widest text-gray-300 mb-4">
              Data Room Light — Documents préliminaires
            </p>
            {lightDocs.length === 0 ? (
              <div className="text-center py-8">
                <FileText size={24} className="text-gray-200 mx-auto mb-3" />
                <p className="font-sans text-[13px] text-gray-400">
                  Aucun document disponible pour le moment. L&apos;équipe Aegryn prépare les documents.
                </p>
              </div>
            ) : (
              <LightDocumentViewer documents={lightDocs} />
            )}
          </div>

          {/* Data room complète si séquestre reçu */}
          {sequesterReceived && (
            <div className="bg-emerald-50 border border-emerald-200 p-6 mb-6">
              <p className="font-mono text-[9px] uppercase tracking-widest text-emerald-600 mb-2">Data Room complète débloquée</p>
              <p className="font-sans text-[13px] text-emerald-800 mb-4">
                Votre séquestre a été confirmé. Vous avez désormais accès à l&apos;intégralité de la data room
                et pouvez soumettre votre offre formelle.
              </p>
              <Link
                href={`/client/buyer/offres/new?asset=${assetId}`}
                className="inline-flex items-center gap-2 bg-emerald-700 text-white font-mono text-[10px] uppercase tracking-widest px-5 py-2.5 hover:bg-emerald-800 transition-colors"
              >
                Soumettre mon offre <ChevronRight size={11} />
              </Link>
            </div>
          )}
        </>
      )}

      {/* ── Processus Aegryn ── */}
      <div className="bg-gray-50 border border-gray-200 p-6">
        <p className="font-mono text-[9px] uppercase tracking-widest text-gray-400 mb-4">Processus Aegryn TRANSACT</p>
        <ol className="flex flex-col gap-3">
          {[
            { n: '01', label: 'KYC validé', done: kycApproved },
            { n: '02', label: 'Accès data room light accordé', done: lightRequest?.status === 'approved' },
            { n: '03', label: 'Séquestre 10% versé et confirmé', done: sequesterReceived },
            { n: '04', label: 'Data room complète + offre formelle', done: false },
          ].map(({ n, label, done }) => (
            <li key={n} className={`flex items-center gap-3 ${done ? 'text-gray-800' : 'text-gray-400'}`}>
              <span className={`font-mono text-[10px] font-bold shrink-0 w-7 h-7 flex items-center justify-center border ${
                done ? 'border-emerald-300 bg-emerald-50 text-emerald-600' : 'border-gray-200 bg-white text-gray-300'
              }`}>
                {done ? '✓' : n}
              </span>
              <span className="font-sans text-[12px]">{label}</span>
            </li>
          ))}
        </ol>
      </div>

    </div>
  )
}
