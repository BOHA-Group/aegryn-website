/**
 * /client/buyer/catalogue/[id]/diligence
 * ──────────────────────────────────────────────────────────────────
 * Flux complet data room — progression état par état :
 *
 *  1. KYC non approuvé → bloc KYC
 *  2. data_room_light_enabled = false → data room non disponible
 *  3. Pas de demande d'accès → formulaire de demande
 *  4. Demande pending → en attente de validation admin
 *  5. Demande rejected → refus avec note admin
 *  6. Demande approved → documents light disponibles + formulaire bid_amount_chf
 *  7. Bid pending_seller → en attente approbation vendeur
 *  8. Bid rejected → refus vendeur
 *  9. Bid approved → séquestre 10% à verser
 * 10. Bid sequester_received → data room complète + offre formelle
 */
import type { Metadata }      from 'next'
import { redirect, notFound } from 'next/navigation'
import Link                   from 'next/link'
import { getUser }            from '@/lib/supabaseServer'
import { createServiceClient } from '@/lib/supabase'
import {
  ArrowLeft, ShieldCheck, Clock, Lock, ChevronRight, AlertCircle,
  CheckCircle2, FolderOpen, Send,
} from 'lucide-react'
import LightDocumentViewer from './LightDocumentViewer'
import BidSubmitForm       from './BidSubmitForm'
import AccessRequestButton from './AccessRequestButton'

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

  /* ── 1. KYC + profil acquéreur ── */
  const { data: profile } = await supa
    .from('profiles')
    .select('kyc_status, full_name, email')
    .eq('id', user.id)
    .single() as { data: { kyc_status: string | null; full_name: string | null; email: string | null } | null }

  const kycApproved = profile?.kyc_status === 'approved'
  const userName    = profile?.full_name ?? profile?.email ?? user.email ?? 'Inconnu'
  const userEmail   = profile?.email ?? user.email ?? ''

  /* ── 2. Actif ── */
  const { data: asset } = await supa
    .from('assets')
    .select('id, company_name, asset_type, arr, official_grade, data_room_light_enabled, data_room_light_complete, status')
    .eq('id', assetId)
    .eq('status', 'published')
    .single() as {
      data: {
        id: string
        company_name: string | null
        asset_type: string | null
        arr: number | null
        official_grade: string | null
        data_room_light_enabled: boolean
        data_room_light_complete: boolean
        status: string
      } | null
    }

  if (!asset) notFound()

  /* ── 3. Demande d'accès light existante ── */
  const { data: accessRequest } = await supa
    .from('data_room_light_requests')
    .select('id, status, bid_amount_chf, admin_note, reviewed_at')
    .eq('asset_id', assetId)
    .eq('user_id', user.id)
    .maybeSingle() as {
      data: {
        id: string
        status: string
        bid_amount_chf: number | null
        admin_note: string | null
        reviewed_at: string | null
      } | null
    }

  const accessApproved = accessRequest?.status === 'approved'

  /* ── 4. Documents light (si accès approuvé + DR complète) ── */
  const lightAccessOk = kycApproved && asset.data_room_light_enabled && asset.data_room_light_complete && accessApproved
  const lightDocs = lightAccessOk
    ? await supa
        .from('data_room_documents')
        .select('id, file_name, document_type, category, is_sensitive, uploaded_at, room_level')
        .eq('asset_id', assetId)
        .eq('visible_to', 'light_buyers')
        .eq('room_level', 'light')
        .neq('file_path', '')
        .order('category')
        .then(r => (r.data ?? []) as {
          id: string; file_name: string; document_type: string
          category: string; is_sensitive: boolean; uploaded_at: string; room_level: string
        }[])
    : []

  /* ── 5. Offre de principe existante ── */
  const { data: existingBid } = await supa
    .from('data_room_light_bids')
    .select('id, status, bid_amount_chf, sequester_amount_chf, seller_note, created_at')
    .eq('asset_id', assetId)
    .eq('bidder_id', user.id)
    .maybeSingle() as {
      data: {
        id: string; status: string; bid_amount_chf: number
        sequester_amount_chf: number; seller_note: string | null; created_at: string
      } | null
    }

  const bidApproved       = existingBid?.status === 'approved'
  const sequesterSent     = existingBid?.status === 'sequester_sent'
  const sequesterReceived = existingBid?.status === 'sequester_received'

  /* ── Étapes de progression ── */
  const steps = [
    {
      n: '01', label: 'KYC validé',
      done: kycApproved,
      active: !kycApproved,
    },
    {
      n: '02', label: 'Accès data room light accordé (admin)',
      done: accessApproved,
      active: kycApproved && !accessApproved,
    },
    {
      n: '03', label: 'Consultation des documents + offre de principe',
      done: !!existingBid,
      active: lightAccessOk && !existingBid,
    },
    {
      n: '04', label: 'Offre approuvée par le vendeur',
      done: bidApproved || sequesterSent || sequesterReceived,
      active: !!existingBid && existingBid.status === 'pending_seller',
    },
    {
      n: '05', label: 'Séquestre 10% versé et confirmé',
      done: sequesterReceived,
      active: bidApproved && !sequesterSent && !sequesterReceived,
    },
    {
      n: '06', label: 'Data room complète + offre formelle',
      done: false,
      active: sequesterReceived,
    },
  ]

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
          Due Diligence — Data Room
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

      {/* ── Progression ── */}
      <div className="bg-gray-50 border border-gray-200 p-5 mb-6">
        <p className="font-mono text-[9px] uppercase tracking-widest text-gray-400 mb-4">Processus Aegryn TRANSACT</p>
        <ol className="flex flex-col gap-2.5">
          {steps.map(({ n, label, done, active }) => (
            <li key={n} className={`flex items-center gap-3 ${done ? 'text-gray-800' : active ? 'text-indigo-700' : 'text-gray-400'}`}>
              <span className={`font-mono text-[9px] font-bold shrink-0 w-7 h-7 flex items-center justify-center border transition-colors ${
                done    ? 'border-emerald-300 bg-emerald-50 text-emerald-700'
                : active  ? 'border-indigo-300 bg-indigo-50 text-indigo-600'
                : 'border-gray-200 bg-white text-gray-300'
              }`}>
                {done ? '✓' : n}
              </span>
              <span className="font-sans text-[12px]">{label}</span>
            </li>
          ))}
        </ol>
      </div>

      {/* ══ ÉTAPE 1 — KYC requis ══ */}
      {!kycApproved && (
        <div className="bg-amber-50 border border-amber-200 p-6 mb-6">
          <div className="flex items-start gap-3">
            <ShieldCheck size={16} className="text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-mono text-[10px] uppercase tracking-widest text-amber-600 mb-1">KYC requis</p>
              <p className="font-sans text-[13px] text-amber-800 mb-4">
                L&apos;accès à la data room nécessite la validation de votre KYC.
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

      {/* ══ ÉTAPE 2 — Data room non disponible ══ */}
      {kycApproved && !asset.data_room_light_enabled && (
        <div className="bg-gray-50 border border-gray-200 p-6 mb-6">
          <div className="flex items-start gap-3">
            <Lock size={15} className="text-gray-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-mono text-[10px] uppercase tracking-widest text-gray-400 mb-1">Data room en préparation</p>
              <p className="font-sans text-[13px] text-gray-600">
                La data room de cet actif est en cours de préparation. Revenez prochainement.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ══ ÉTAPE 2b — DR activée mais pas encore complète ══ */}
      {kycApproved && asset.data_room_light_enabled && !asset.data_room_light_complete && (
        <div className="bg-indigo-50 border border-indigo-200 p-6 mb-6">
          <div className="flex items-start gap-3">
            <Clock size={15} className="text-indigo-500 shrink-0 mt-0.5" />
            <div>
              <p className="font-mono text-[10px] uppercase tracking-widest text-indigo-600 mb-1">
                Documents en cours de validation
              </p>
              <p className="font-sans text-[13px] text-indigo-800">
                L&apos;équipe Aegryn finalise la validation des documents bloquants. L&apos;accès aux demandes sera ouvert prochainement.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ══ ÉTAPE 3 — Demande d'accès ══ */}
      {kycApproved && asset.data_room_light_enabled && asset.data_room_light_complete && (
        <>
          {/* Pas de demande encore */}
          {!accessRequest && (
            <div className="bg-white border border-gray-200 p-6 mb-6">
              <p className="font-mono text-[9px] uppercase tracking-widest text-gray-400 mb-2">
                Demande d&apos;accès à la data room light
              </p>
              <p className="font-sans text-[13px] text-gray-700 leading-relaxed mb-5">
                Votre KYC est validé. Soumettez une demande d&apos;accès à la data room light de cet actif.
                L&apos;équipe Aegryn la traitera sous 24–48h ouvrées.
              </p>
              <AccessRequestButton assetId={assetId} />
            </div>
          )}

          {/* Demande en attente */}
          {accessRequest?.status === 'pending' && (
            <div className="bg-blue-50 border border-blue-200 p-6 mb-6">
              <div className="flex items-start gap-3">
                <Clock size={15} className="text-blue-500 shrink-0 mt-0.5" />
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-widest text-blue-600 mb-1">
                    Demande en cours de traitement
                  </p>
                  <p className="font-sans text-[13px] text-blue-800">
                    Votre demande d&apos;accès a bien été reçue. L&apos;équipe Aegryn la traitera sous 24–48h ouvrées.
                    Vous recevrez une notification par email.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Demande refusée */}
          {accessRequest?.status === 'rejected' && (
            <div className="bg-red-50 border border-red-200 p-6 mb-6">
              <div className="flex items-start gap-3">
                <AlertCircle size={15} className="text-red-500 shrink-0 mt-0.5" />
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-widest text-red-600 mb-1">
                    Demande refusée
                  </p>
                  <p className="font-sans text-[13px] text-red-800">
                    Votre demande d&apos;accès à la data room light a été refusée.
                    {accessRequest.admin_note && (
                      <span className="block mt-1 italic text-red-700">{accessRequest.admin_note}</span>
                    )}
                  </p>
                  <p className="font-sans text-[12px] text-red-600 mt-3">
                    Pour toute question, contactez{' '}
                    <a href="mailto:contact@boha-group.com" className="underline">contact@boha-group.com</a>.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Demande révoquée */}
          {accessRequest?.status === 'revoked' && (
            <div className="bg-gray-100 border border-gray-200 p-6 mb-6">
              <p className="font-mono text-[10px] uppercase tracking-widest text-gray-500 mb-1">Accès révoqué</p>
              <p className="font-sans text-[13px] text-gray-600">
                Votre accès à la data room light a été révoqué. Contactez{' '}
                <a href="mailto:contact@boha-group.com" className="underline text-gray-700">contact@boha-group.com</a> pour en savoir plus.
              </p>
            </div>
          )}

          {/* ══ ÉTAPE 4 — Accès accordé : documents + bid ══ */}
          {accessApproved && (
            <>
              {/* Documents light */}
              <div className="bg-white border border-gray-200 p-6 mb-6">
                <div className="flex items-center gap-2 mb-4">
                  <FolderOpen size={14} className="text-indigo-500" />
                  <p className="font-mono text-[9px] uppercase tracking-widest text-gray-500 font-semibold">
                    Data Room Light — Documents disponibles
                  </p>
                </div>
                {lightDocs.length === 0 ? (
                  <div className="py-6 text-center">
                    <p className="font-sans text-[13px] text-gray-400">Aucun document accessible pour le moment.</p>
                  </div>
                ) : (
                  <LightDocumentViewer documents={lightDocs} userName={userName} userEmail={userEmail} />
                )}
              </div>

              {/* Offre de principe — formulaire si pas encore soumis */}
              {!existingBid && (
                <div className="bg-white border border-gray-200 p-6 mb-6">
                  <p className="font-mono text-[9px] uppercase tracking-widest text-gray-400 mb-2">
                    Étape suivante — Offre de principe
                  </p>
                  <p className="font-sans text-[13px] text-gray-700 leading-relaxed mb-5">
                    Après consultation des documents, soumettez votre <strong>offre de principe</strong>.
                    Le vendeur devra l&apos;approuver pour déclencher la phase de séquestre et l&apos;accès
                    à la data room complète.
                  </p>
                  <BidSubmitForm assetId={assetId} />
                </div>
              )}

              {/* Offre soumise — en attente vendeur */}
              {existingBid?.status === 'pending_seller' && (
                <div className="bg-blue-50 border border-blue-200 p-6 mb-6">
                  <div className="flex items-start gap-3">
                    <Clock size={15} className="text-blue-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-mono text-[10px] uppercase tracking-widest text-blue-600 mb-1">
                        Offre de principe en attente
                      </p>
                      <p className="font-sans text-[13px] text-blue-800">
                        Votre offre de <strong>{fmtChf(existingBid.bid_amount_chf)}</strong> est en cours
                        d&apos;examen par le vendeur. Vous serez notifié par email.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Offre refusée par le vendeur */}
              {existingBid?.status === 'rejected' && (
                <div className="bg-red-50 border border-red-200 p-6 mb-6">
                  <div className="flex items-start gap-3">
                    <AlertCircle size={15} className="text-red-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-mono text-[10px] uppercase tracking-widest text-red-600 mb-1">Offre refusée</p>
                      <p className="font-sans text-[13px] text-red-800">
                        Le vendeur a refusé votre offre de {fmtChf(existingBid.bid_amount_chf)}.
                        {existingBid.seller_note && (
                          <span className="block mt-1 italic text-red-700">{existingBid.seller_note}</span>
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Offre approuvée / séquestre */}
              {(bidApproved || sequesterSent || sequesterReceived) && (
                <div className={`border p-6 mb-6 ${sequesterReceived ? 'border-emerald-200 bg-emerald-50' : 'bg-ag-navy text-white'}`}>
                  {sequesterReceived ? (
                    <>
                      <div className="flex items-center gap-2 mb-3">
                        <CheckCircle2 size={15} className="text-emerald-600" />
                        <p className="font-mono text-[9px] uppercase tracking-widest text-emerald-700 font-semibold">
                          Séquestre confirmé — Data room complète débloquée
                        </p>
                      </div>
                      <p className="font-sans text-[13px] text-emerald-800 mb-4">
                        Votre séquestre de <strong>{fmtChf(existingBid?.sequester_amount_chf)}</strong> a
                        été reçu et confirmé. Vous avez désormais accès à l&apos;intégralité de la data room.
                      </p>
                      <Link
                        href={`/client/buyer/offres/new?asset=${assetId}`}
                        className="inline-flex items-center gap-2 bg-emerald-700 text-white font-mono text-[10px] uppercase tracking-widest px-5 py-2.5 hover:bg-emerald-800 transition-colors"
                      >
                        <Send size={11} /> Soumettre mon offre formelle
                      </Link>
                    </>
                  ) : (
                    <>
                      <p className="font-mono text-[9px] uppercase tracking-widest text-white/40 mb-3">
                        Séquestre obligatoire — {sequesterSent ? 'en attente de confirmation' : 'à verser'}
                      </p>
                      <div className="flex items-start justify-between gap-4 mb-5 flex-wrap">
                        <div>
                          <p className="font-sans text-[12px] text-white/60 mb-0.5">Offre de principe approuvée</p>
                          <p className="font-mono font-bold text-[26px] tracking-tight">{fmtChf(existingBid?.bid_amount_chf)}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-sans text-[12px] text-white/60 mb-0.5">Séquestre à verser (10%)</p>
                          <p className="font-mono font-bold text-[26px] tracking-tight text-ag-apex">
                            {fmtChf(existingBid?.sequester_amount_chf)}
                          </p>
                        </div>
                      </div>
                      <div className="border-t border-white/10 pt-4 space-y-2 text-[12px] text-white/60">
                        <p>
                          Pour accéder à la <strong className="text-white">data room complète</strong>, versez le
                          séquestre de <strong className="text-ag-apex">{fmtChf(existingBid?.sequester_amount_chf)}</strong> sur le compte fiduciaire Aegryn.
                          Ce montant sera déduit du prix d&apos;acquisition si votre offre est retenue.
                        </p>
                      </div>
                      <div className="mt-5 pt-4 border-t border-white/10">
                        <p className="font-mono text-[9px] uppercase tracking-widest text-white/40 mb-2">Instructions de virement</p>
                        <p className="font-sans text-[12px] text-white/70">
                          Contactez votre deal manager à{' '}
                          <a href="mailto:contact@boha-group.com" className="text-ag-apex underline">
                            contact@boha-group.com
                          </a>{' '}
                          pour recevoir les coordonnées bancaires et la référence de virement.
                        </p>
                      </div>
                      {sequesterSent && (
                        <div className="mt-4 border-t border-white/10 pt-4">
                          <p className="font-mono text-[9px] text-amber-400">
                            ⏳ Virement signalé — en attente de confirmation par l&apos;équipe Aegryn
                          </p>
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  )
}
