import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { getUser } from '@/lib/supabaseServer'
import { createServiceClient } from '@/lib/supabase'
import { CheckCircle2, Clock, XCircle, AlertCircle, ShieldCheck } from 'lucide-react'
import PartnerKycUploadForm from './PartnerKycUploadForm'
import KycViewButton        from '@/app/client/buyer/kyc/KycViewButton'

export const metadata: Metadata = {
  title: 'KYC — Espace Partenaire Aegryn',
  robots: { index: false, follow: false },
}

type DocDef = {
  type: string
  label: string
  desc: string
  optional?: boolean
  recommended?: boolean
}

const REQUIRED_DOCS: DocDef[] = [
  {
    type:  'id_card',
    label: 'Pièce d\'identité du représentant',
    desc:  'Carte d\'identité nationale ou passeport en cours de validité du contact désigné.',
  },
  {
    type:  'proof_of_address',
    label: 'Justificatif de domicile',
    desc:  'Moins de 3 mois (facture, relevé bancaire).',
  },
  {
    type:  'kbis',
    label: 'Extrait KBIS / RC',
    desc:  'Extrait officiel du registre du commerce de votre cabinet ou société. Moins de 3 mois.',
  },
  {
    type:  'articles_of_association',
    label: 'Statuts de la société',
    desc:  'Document constitutif de votre entité partenaire.',
  },
  {
    type:  'director_id',
    label: 'Identité des associés / dirigeants',
    desc:  'Pièces d\'identité des associés ou dirigeants détenant plus de 25% des parts, si différents du contact principal.',
  },
  {
    type:  'ubo',
    label: 'Bénéficiaires effectifs (UBO)',
    desc:  'Déclaration des ayants-droits économiques détenant plus de 25% des parts.',
  },
  {
    type:        'professional_insurance',
    label:       'RC Pro / Assurance professionnelle',
    desc:        'Attestation d\'assurance responsabilité civile professionnelle. Requis pour les partenaires impliqués dans la co-validation de grade.',
    recommended: true,
  },
]

const REQUIRED_COUNT = REQUIRED_DOCS.filter(d => !d.recommended).length

const STATUS_CONFIG: Record<string, { label: string; renderIcon: () => React.ReactNode; color: string }> = {
  pending:   { label: 'En attente',         renderIcon: () => <Clock        size={14} className="text-gray-400"    />, color: 'text-gray-400'    },
  in_review: { label: 'En cours d\'examen', renderIcon: () => <Clock        size={14} className="text-blue-500"    />, color: 'text-blue-500'   },
  validated: { label: 'Validé',             renderIcon: () => <CheckCircle2 size={14} className="text-emerald-500" />, color: 'text-emerald-500' },
  rejected:  { label: 'Rejeté',             renderIcon: () => <XCircle      size={14} className="text-red-500"     />, color: 'text-red-500'    },
  expired:   { label: 'Expiré',             renderIcon: () => <AlertCircle  size={14} className="text-amber-500"   />, color: 'text-amber-500'  },
}

function fmtDate(d: unknown) {
  if (!d || typeof d !== 'string') return ''
  return new Date(d).toLocaleDateString('fr-CH', { day: '2-digit', month: 'long', year: 'numeric' })
}

type KycDoc = {
  id: string
  doc_type: string
  status: string
  rejection_reason: string | null
  expires_at: string | null
  file_url: string | null
  created_at: string
  validated_at: string | null
}

export default async function PartnerKycPage() {
  const user = await getUser()
  if (!user) redirect('/client/login')

  const supa = createServiceClient()
  const { data: docs } = await supa
    .from('kyc_documents')
    .select('id, doc_type, status, rejection_reason, expires_at, file_url, created_at, validated_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  const docsByType = (docs ?? []).reduce<Record<string, KycDoc[]>>((acc, d) => {
    const doc = d as KycDoc
    acc[doc.doc_type] = [...(acc[doc.doc_type] ?? []), doc]
    return acc
  }, {})

  const validatedTypes = new Set(
    (docs ?? []).filter(d => (d as KycDoc).status === 'validated').map(d => (d as KycDoc).doc_type)
  )

  const mandatoryDocs   = REQUIRED_DOCS.filter(d => !d.recommended)
  const completedCount  = mandatoryDocs.filter(r => validatedTypes.has(r.type)).length
  const progressPct     = Math.round((completedCount / REQUIRED_COUNT) * 100)
  const isComplete      = completedCount === REQUIRED_COUNT

  return (
    <div className="p-8 max-w-3xl">

      <div className="mb-8">
        <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-gray-400 mb-1">Espace Partenaire</p>
        <h1 className="font-sans font-bold text-gray-900 text-[24px] tracking-tight">KYC — Vérification partenaire</h1>
        <p className="font-sans text-[13px] text-gray-400 mt-1">
          Documents requis pour valider votre identité et activer votre compte partenaire Aegryn.
        </p>
      </div>

      {/* Progression */}
      <div className={`border p-5 mb-8 ${isComplete ? 'border-emerald-200 bg-emerald-50' : 'border-amber-200 bg-amber-50'}`}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <ShieldCheck size={16} className={isComplete ? 'text-emerald-500' : 'text-amber-500'} />
            <p className="font-sans font-semibold text-[13px] text-gray-900">
              {isComplete ? 'Dossier KYC complet' : 'Dossier KYC en cours'}
            </p>
          </div>
          <p className="font-mono text-[11px] text-gray-600">{completedCount}/{REQUIRED_COUNT} validés</p>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-1.5">
          <div
            className={`h-1.5 rounded-full transition-all ${isComplete ? 'bg-emerald-500' : 'bg-amber-400'}`}
            style={{ width: `${progressPct}%` }}
          />
        </div>
        {!isComplete && (
          <p className="font-sans text-[11px] text-amber-700 mt-2">
            Complétez votre dossier KYC pour que l&apos;équipe Aegryn puisse activer votre espace partenaire.
          </p>
        )}
      </div>

      {/* Documents */}
      <div className="flex flex-col gap-4">
        {REQUIRED_DOCS.map(({ type, label, desc, recommended }) => {
          const latestDoc = docsByType[type]?.[0] ?? null
          const status    = latestDoc?.status ?? 'missing'
          const statusCfg = STATUS_CONFIG[status]

          return (
            <div key={type} className={`bg-white border ${recommended ? 'border-blue-100' : 'border-gray-200'}`}>
              <div className="p-5 flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    {statusCfg ? statusCfg.renderIcon() : <AlertCircle size={14} className="text-gray-300" />}
                    <p className="font-sans font-semibold text-gray-900 text-[13px]">{label}</p>
                    {recommended && (
                      <span className="font-mono text-[8px] uppercase tracking-widest text-blue-500 border border-blue-200 px-1.5 py-0.5">
                        Recommandé
                      </span>
                    )}
                  </div>
                  <p className="font-sans text-[11px] text-gray-400">{desc}</p>
                  {latestDoc && (
                    <div className="mt-2 flex flex-wrap gap-4">
                      <p className="font-mono text-[9px] text-gray-400">Soumis le {fmtDate(latestDoc.created_at)}</p>
                      {latestDoc.expires_at && (
                        <p className="font-mono text-[9px] text-gray-400">Expire le {fmtDate(latestDoc.expires_at)}</p>
                      )}
                      {latestDoc.validated_at && (
                        <p className="font-mono text-[9px] text-emerald-500">Validé le {fmtDate(latestDoc.validated_at)}</p>
                      )}
                    </div>
                  )}
                  {latestDoc?.rejection_reason && status === 'rejected' && (
                    <p className="font-sans text-[11px] text-red-500 mt-2 italic">
                      Motif : {latestDoc.rejection_reason}
                    </p>
                  )}
                </div>
                <div className="shrink-0 flex flex-col items-end gap-2">
                  {statusCfg && (
                    <span className={`font-mono text-[9px] uppercase tracking-widest ${statusCfg.color}`}>
                      {statusCfg.label}
                    </span>
                  )}
                  {latestDoc?.file_url && latestDoc.id && (
                    <KycViewButton docId={latestDoc.id} />
                  )}
                </div>
              </div>

              <div className="border-t border-gray-100 p-5 bg-gray-50">
                {status === 'pending' || status === 'in_review' ? (
                  <p className="font-sans text-[11px] text-gray-400 mb-3">
                    Document en cours d&apos;examen. Vous pouvez soumettre une version corrigée si nécessaire.
                  </p>
                ) : status === 'validated' ? (
                  <p className="font-sans text-[11px] text-amber-600 mb-3">
                    Ce document est validé. Un nouveau dépôt remplacera la version actuelle et relancera la validation.
                  </p>
                ) : null}
                <PartnerKycUploadForm docType={type} userId={user.id} />
              </div>
            </div>
          )
        })}
      </div>

      <div className="mt-8 px-5 py-4 border border-gray-200 bg-gray-50">
        <p className="font-sans text-[11px] text-gray-400 leading-relaxed">
          <strong>Protection des données :</strong> Vos documents sont traités dans le respect de la réglementation LBA et des obligations KYC/AML suisses. Suppression sur demande à <a href="mailto:legal@boha-group.com" className="text-ag-navy underline">legal@boha-group.com</a>.
        </p>
      </div>
    </div>
  )
}
