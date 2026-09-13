import type { Metadata } from 'next'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { getUser } from '@/lib/supabaseServer'
import { createServiceClient } from '@/lib/supabase'
import { ArrowLeft } from 'lucide-react'
import CertificationForm from './CertificationForm'
import ExpertDocuments, { type ExpertDoc } from './ExpertDocuments'
import WorkflowStepper from '@/components/workflow/WorkflowStepper'
import { getCertificationProgress } from '@/lib/certificationWorkflow'

export const metadata: Metadata = {
  title: 'Co-signature — Espace Partenaire Aegryn',
  robots: { index: false, follow: false },
}

const DIMENSION_LABELS: Record<string, string> = {
  code:         'C : Code & Architecture',
  ip:           'I : Propriété Intellectuelle',
  finance:      'F : Finance & Comptabilité',
  security:     'S : Sécurité & Conformité',
  organisation: 'O : Organisation & Talent',
}

const RECOMMENDATION_LABELS: Record<string, string> = {
  none:        'Aucune réserve',
  review:      'Révision recommandée',
  remediation: 'Remédiation nécessaire',
}

function fmtDate(d: unknown) {
  if (!d || typeof d !== 'string') return '—'
  return new Date(d).toLocaleDateString('fr-CH', { day: '2-digit', month: 'long', year: 'numeric' })
}

export default async function PartnerCertificationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const user = await getUser()
  if (!user) redirect('/client/login')

  const { id } = await params
  const supa = createServiceClient()

  const { data: cert } = await supa
    .from('partner_certifications')
    .select(`
      id, asset_id, dimension, status, score, subcodes, summary, reserves, recommendation,
      deadline_at, signed_by_checkbox, signed_at,
      validated_at, rejection_reason, observations, cosignature_amount_chf,
      created_at,
      assets(id, company_name, asset_type, official_grade, arr, public_summary)
    `)
    .eq('id', id)
    .eq('partner_id', user.id)
    .single()

  if (!cert) notFound()

  const asset = Array.isArray(cert.assets) ? (cert.assets as unknown[])[0] as {
    id: string; company_name: string | null; asset_type: string | null;
    official_grade: string | null; arr: number | null; public_summary: string | null
  } | null : cert.assets as {
    id: string; company_name: string | null; asset_type: string | null;
    official_grade: string | null; arr: number | null; public_summary: string | null
  } | null

  const canSubmit = cert.status === 'assigned' || cert.status === 'in_review'
  const isValidated = cert.status === 'validated'
  const isRejected  = cert.status === 'rejected'

  const progress = cert.asset_id ? await getCertificationProgress(String(cert.asset_id), 'expert', { expertCertId: id }) : null

  /* Pièces ouvertes à l'expert : sa dimension + transversales, visibilité assigned_partner / nda_buyers */
  const [{ data: expertDocs }, { data: me }] = await Promise.all([
    supa.from('data_room_documents')
      .select('id, document_code, file_name, uploaded_at, admin_quality, is_sensitive, dimension')
      .eq('asset_id', String(cert.asset_id))
      .in('visible_to', ['assigned_partner', 'nda_buyers'])
      .or(`dimension.eq.${cert.dimension},dimension.is.null`)
      .order('document_code'),
    supa.from('profiles').select('full_name, email').eq('id', user.id).maybeSingle(),
  ])

  return (
    <div className="p-8 max-w-3xl">
      <Link href="/client/partner/certifications"
        className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-gray-400 hover:text-gray-700 transition-colors mb-8">
        <ArrowLeft size={12} /> Co-signatures
      </Link>

      {progress && <WorkflowStepper progress={progress} title="Parcours du mandat expert" />}

      {/* Header */}
      <div className="mb-8">
        <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-gray-400 mb-1">
          Co-signature : {DIMENSION_LABELS[cert.dimension] ?? cert.dimension}
        </p>
        <h1 className="font-sans font-bold text-gray-900 text-[22px] tracking-tight">
          {asset?.company_name ?? `Actif #${id.slice(0, 8)}`}
        </h1>
        <div className="flex items-center gap-3 mt-2 flex-wrap">
          {asset?.asset_type && (
            <span className="rounded-lg font-mono text-[9px] uppercase tracking-widest text-gray-400 border border-gray-200 px-2 py-0.5">
              {asset.asset_type}
            </span>
          )}
          {asset?.official_grade && (
            <span className="rounded-lg font-mono text-[9px] font-bold text-gray-600 border border-gray-300 px-2 py-0.5">
              Grade {asset.official_grade}
            </span>
          )}
          {cert.deadline_at && (
            <span className={`font-mono text-[9px] ${new Date(cert.deadline_at) < new Date() ? 'text-red-500' : 'text-amber-600'}`}>
              Échéance : {fmtDate(cert.deadline_at)}
            </span>
          )}
        </div>
      </div>

      {/* Résumé public de l'actif */}
      {asset?.public_summary && (
        <div className="bg-white border border-gray-200 p-5 mb-6">
          <p className="font-mono text-[9px] uppercase tracking-widest text-gray-300 mb-3">Résumé certifié de l&apos;actif</p>
          <p className="font-sans text-[12px] text-gray-600 leading-relaxed border-l-2 border-ag-apex pl-3">
            {asset.public_summary}
          </p>
        </div>
      )}

      {/* Statut : validated */}
      {isValidated && (
        <div className="rounded-lg bg-emerald-50 border border-emerald-200 px-5 py-4 mb-6">
          <p className="font-sans font-semibold text-emerald-700 text-[13px]">✓ Contribution validée par Aegryn</p>
          {!!cert.validated_at && (
            <p className="font-sans text-[11px] text-emerald-600 mt-0.5">Validée le {fmtDate(cert.validated_at)}</p>
          )}
          <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-4">
            {cert.score != null && (
              <div>
                <p className="font-mono text-[9px] uppercase tracking-widest text-emerald-500 mb-0.5">Score retenu</p>
                <p className="font-sans font-bold text-[20px] text-emerald-700">{cert.score}<span className="text-[12px] opacity-60">/20</span></p>
              </div>
            )}
            {cert.cosignature_amount_chf != null && (
              <div>
                <p className="font-mono text-[9px] uppercase tracking-widest text-emerald-500 mb-0.5">Honoraires dûs</p>
                <p className="font-sans font-bold text-[20px] text-emerald-700">{Number(cert.cosignature_amount_chf).toLocaleString('fr-CH')} <span className="text-[12px] opacity-60">CHF</span></p>
              </div>
            )}
            {cert.recommendation && (
              <div>
                <p className="font-mono text-[9px] uppercase tracking-widest text-emerald-500 mb-0.5">Recommandation</p>
                <p className="font-sans text-[12px] text-emerald-700">{RECOMMENDATION_LABELS[String(cert.recommendation)] ?? String(cert.recommendation)}</p>
              </div>
            )}
          </div>
          {!!cert.observations && (
            <div className="mt-4 border-t border-emerald-200 pt-3">
              <p className="font-mono text-[9px] uppercase tracking-widest text-emerald-500 mb-1">Observations Aegryn</p>
              <p className="font-sans text-[12px] text-emerald-800 leading-relaxed">{String(cert.observations)}</p>
            </div>
          )}
          {cert.summary && (
            <div className="mt-3 border-t border-emerald-200 pt-3">
              <p className="font-mono text-[9px] uppercase tracking-widest text-emerald-500 mb-1">Votre avis soumis</p>
              <p className="font-sans text-[12px] text-emerald-700 leading-relaxed">{String(cert.summary)}</p>
            </div>
          )}
        </div>
      )}

      {/* Statut : rejected */}
      {isRejected && (
        <div className="rounded-lg bg-red-50 border border-red-200 px-5 py-4 mb-6">
          <p className="font-sans font-semibold text-red-700 text-[13px]">✗ Contribution refusée par Aegryn</p>
          {!!cert.rejection_reason && (
            <div className="mt-2">
              <p className="font-mono text-[9px] uppercase tracking-widest text-red-400 mb-1">Motif</p>
              <p className="font-sans text-[12px] text-red-700 leading-relaxed">{String(cert.rejection_reason)}</p>
            </div>
          )}
          {!!cert.observations && (
            <div className="mt-3 border-t border-red-200 pt-3">
              <p className="font-mono text-[9px] uppercase tracking-widest text-red-400 mb-1">Observations Aegryn</p>
              <p className="font-sans text-[12px] text-red-700 leading-relaxed">{String(cert.observations)}</p>
            </div>
          )}
        </div>
      )}

      {/* Statut legacy signed (ancien schéma) */}
      {cert.status === 'signed' && (
        <div className="rounded-lg bg-emerald-50 border border-emerald-200 px-5 py-4 mb-6">
          <p className="font-sans font-semibold text-emerald-700 text-[13px]">✓ Co-signature signée</p>
          {!!cert.signed_at && (
            <p className="font-sans text-[11px] text-emerald-600 mt-0.5">Signée le {fmtDate(cert.signed_at)}</p>
          )}
        </div>
      )}

      {cert.status === 'declined' && (
        <div className="rounded-lg bg-red-50 border border-red-200 px-5 py-4 mb-6">
          <p className="font-sans text-[13px] text-red-600">Vous avez décliné cette mission.</p>
        </div>
      )}

      {/* Pièces de la dimension (tant que le mandat est actif) */}
      {cert.status !== 'rejected' && cert.status !== 'expired' && (
        <ExpertDocuments
          docs={(expertDocs ?? []) as ExpertDoc[]}
          userName={me?.full_name ?? user.email ?? ''}
          userEmail={me?.email ?? user.email ?? ''}
          dimensionLabel={DIMENSION_LABELS[cert.dimension] ?? cert.dimension}
        />
      )}

      {/* Formulaire de soumission */}
      {canSubmit && (
        <CertificationForm certId={id} currentStatus={cert.status} dimension={cert.dimension} />
      )}

      {/* Info processus */}
      <div className="rounded-lg mt-6 bg-ag-navy/5 border border-ag-navy/20 px-5 py-4">
        <p className="font-mono text-[9px] uppercase tracking-widest text-ag-navy/50 mb-2">Processus CIFSO v4.0</p>
        <p className="font-sans text-[11px] text-gray-600 leading-relaxed">
          Votre co-signature porte sur la dimension <strong>{DIMENSION_LABELS[cert.dimension] ?? cert.dimension}</strong>. Votre score (0 à 20) et votre avis alimentent la revue manuelle du moteur de grade Aegryn. Le score global CIFSO 5000 sur 100 est la somme des cinq dimensions. Vous accédez uniquement aux pièces de votre dimension, via la Data Room.
        </p>
      </div>
    </div>
  )
}
