import type { Metadata } from 'next'
import { cookies } from 'next/headers'
import { getTranslations } from 'next-intl/server'
import { redirect } from 'next/navigation'
import { getUser } from '@/lib/supabaseServer'
import { createServiceClient } from '@/lib/supabase'
import { CheckCircle2, Clock, XCircle, AlertCircle, ShieldCheck } from 'lucide-react'
import KycUploadForm  from './KycUploadForm'
import KycViewButton  from './KycViewButton'
import LockedSection from '@/app/client/LockedSection'

export const metadata: Metadata = {
  title: 'KYC — Buyer Space Aegryn',
  robots: { index: false, follow: false },
}

type DocDef = {
  type: string
  label: string
  desc: string
  conditional?: boolean
}

const BASE_DOCS: DocDef[] = [
  { type: 'id_card',                label: 'Pièce d\'identité',                    desc: 'Carte d\'identité ou passeport en cours de validité.' },
  { type: 'proof_of_address',       label: 'Justificatif de domicile',              desc: 'Moins de 3 mois (facture, relevé bancaire).' },
  { type: 'proof_of_funds',         label: 'Justificatif de capacité financière',   desc: 'Relevé bancaire, attestation de fonds propres ou LOI bancaire. Doit couvrir le ticket d\'acquisition déclaré à l\'inscription.' },
  { type: 'kbis',                   label: 'Extrait KBIS / RC',                    desc: 'Si acquisition au nom d\'une entité juridique. Moins de 3 mois.' },
  { type: 'articles_of_association',label: 'Statuts de la société',                 desc: 'Document constitutif de l\'entité acquéreuse.' },
  { type: 'ubo',                    label: 'Bénéficiaires effectifs (UBO)',         desc: 'Déclaration des ayants-droits économiques détenant plus de 25% des parts.' },
]

const REGULATORY_DOC: DocDef = {
  type:        'regulatory_approval',
  label:       'Agrément régulateur',
  desc:        'Agrément FINMA / AMF / FCA ou équivalent. Requis si vous gérez des capitaux tiers (fonds PE/VC, family office).',
  conditional: true,
}

const STATUS_CONFIG: Record<string, { label: string; renderIcon: () => React.ReactNode; color: string }> = {
  pending:   { label: 'En attente',         renderIcon: () => <Clock        size={14} className="text-gray-400"    />, color: 'text-gray-400'    },
  in_review: { label: 'En cours d\'examen', renderIcon: () => <Clock        size={14} className="text-blue-500"    />, color: 'text-blue-500'   },
  validated: { label: 'Validé',             renderIcon: () => <CheckCircle2 size={14} className="text-emerald-500" />, color: 'text-emerald-500' },
  rejected:  { label: 'Rejeté',             renderIcon: () => <XCircle      size={14} className="text-red-500"     />, color: 'text-red-500'    },
  expired:   { label: 'Expiré',             renderIcon: () => <AlertCircle  size={14} className="text-amber-500"   />, color: 'text-amber-500'  },
}

function fmtDate(d: unknown, locale: string) {
  if (!d || typeof d !== 'string') return '—'
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

export default async function BuyerKycPage() {
  const user = await getUser()
  if (!user) redirect('/client/login')

  /* ── SECTION VERROUILLÉE — retirer quand prêt ── */
  return <LockedSection title="Vérification d'identité" />
}
