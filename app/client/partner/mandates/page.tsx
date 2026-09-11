import type { Metadata } from 'next'
import { cookies } from 'next/headers'
import { getTranslations } from 'next-intl/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getUser } from '@/lib/supabaseServer'
import { createServiceClient } from '@/lib/supabase'
import { Briefcase, ArrowUpRight } from 'lucide-react'
import LockedSection from '@/app/client/LockedSection'

export const metadata: Metadata = {
  title: 'Mandats clients — Espace Partenaire Aegryn',
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

function fmtDate(d: unknown, locale: string) {
  if (!d || typeof d !== 'string') return '—'
  return new Date(d).toLocaleDateString(locale, { day: '2-digit', month: 'long', year: 'numeric' })
}

type Mandate = {
  id: string
  client_name: string
  client_type: string
  mandate_type: string
  status: string
  retrocession_pct: number
  started_at: string | null
  ended_at: string | null
  created_at: string
  assets: { company_name: string | null } | null
}

export default async function PartnerMandatesPage() {
  const user = await getUser()
  if (!user) redirect('/client/login')

  /* ── SECTION VERROUILLÉE — retirer quand prêt ── */
  return <LockedSection title="Mandats" />
}
