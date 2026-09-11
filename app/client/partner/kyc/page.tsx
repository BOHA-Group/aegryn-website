import type { Metadata } from 'next'
import { cookies } from 'next/headers'
import { getTranslations } from 'next-intl/server'
import { redirect } from 'next/navigation'
import { getUser } from '@/lib/supabaseServer'
import { createServiceClient } from '@/lib/supabase'
import { CheckCircle2, Clock, XCircle, AlertCircle, ShieldCheck } from 'lucide-react'
import PartnerKycUploadForm from './PartnerKycUploadForm'
import KycViewButton        from '@/app/client/buyer/kyc/KycViewButton'
import LockedSection from '@/app/client/LockedSection'

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

function fmtDate(d: unknown, locale: string) {
  if (!d || typeof d !== 'string') return ''
  return new Date(d).toLocaleDateString(locale, { day: '2-digit', month: 'long', year: 'numeric' })
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

  /* ── SECTION VERROUILLÉE — retirer quand prêt ── */
  return <LockedSection title="Vérification d'identité" />
}
