import type { Metadata } from 'next'
import { cookies } from 'next/headers'
import { getTranslations } from 'next-intl/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getUser } from '@/lib/supabaseServer'
import { createServiceClient } from '@/lib/supabase'
import { Award, ArrowUpRight } from 'lucide-react'
import LockedSection from '@/app/client/LockedSection'

export const metadata: Metadata = {
  title: 'Co-signatures — Partner Space Aegryn',
  robots: { index: false, follow: false },
}

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  assigned:  { label: 'Assignée',  color: 'text-gray-500 border-gray-200 bg-gray-50' },
  in_review: { label: 'En cours',  color: 'text-blue-600 border-blue-200 bg-blue-50' },
  submitted: { label: 'Soumise',   color: 'text-amber-600 border-amber-200 bg-amber-50' },
  validated: { label: 'Validée',   color: 'text-emerald-600 border-emerald-200 bg-emerald-50' },
  rejected:  { label: 'Refusée',   color: 'text-red-500 border-red-100 bg-red-50' },
  expired:   { label: 'Expirée',   color: 'text-gray-400 border-gray-200 bg-gray-50' },
}

const DIMENSION_LABELS: Record<string, string> = {
  code:     'Code & Architecture',
  ip:       'Propriété Intellectuelle',
  finance:  'Finance & Comptabilité',
  security: 'Sécurité & Conformité',
}

function fmtDate(d: unknown, locale: string) {
  if (!d || typeof d !== 'string') return '—'
  return new Date(d).toLocaleDateString(locale, { day: '2-digit', month: 'long', year: 'numeric' })
}

type Cert = {
  id: string
  dimension: string
  status: string
  score: number | null
  deadline_at: string | null
  signed_at: string | null
  validated_at: string | null
  rejection_reason: string | null
  observations: string | null
  cosignature_amount_chf: number | null
  created_at: string
  assets: { id: string; company_name: string | null; official_grade: string | null } | null
}

export default async function PartnerCertificationsPage() {
  const user = await getUser()
  if (!user) redirect('/client/login')

  /* ── SECTION VERROUILLÉE — retirer quand prêt ── */
  return <LockedSection title="Co-signatures CIFSO" />
}
