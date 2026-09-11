import type { Metadata } from 'next'
import { cookies } from 'next/headers'
import { getTranslations } from 'next-intl/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getUser } from '@/lib/supabaseServer'
import { createServiceClient } from '@/lib/supabase'
import { ArrowUpRight, Gavel } from 'lucide-react'
import LockedSection from '@/app/client/LockedSection'

export const metadata: Metadata = {
  title: 'My bids — Buyer Space Aegryn',
  robots: { index: false, follow: false },
}

const STATUS_LABELS: Record<string, string> = {
  draft:     'Brouillon',
  submitted: 'Soumise',
  retained:  'Retenue',
  rejected:  'Rejetée',
  withdrawn: 'Retirée',
}

const STATUS_COLOR: Record<string, string> = {
  draft:     'text-gray-400 bg-gray-50 border-gray-200',
  submitted: 'text-blue-600 bg-blue-50 border-blue-200',
  retained:  'text-emerald-600 bg-emerald-50 border-emerald-200',
  rejected:  'text-red-500 bg-red-50 border-red-100',
  withdrawn: 'text-gray-400 bg-gray-50 border-gray-200',
}

function fmtChf(n: number | null) {
  if (n == null) return '—'
  return new Intl.NumberFormat('fr-CH', { style: 'currency', currency: 'CHF', maximumFractionDigits: 0 }).format(n)
}

function fmtDate(d: unknown, locale: string) {
  if (!d || typeof d !== 'string') return '—'
  return new Date(d).toLocaleDateString(locale, { day: '2-digit', month: 'long', year: 'numeric' })
}

type Bid = {
  id: string
  amount_chf: number | null
  status: string
  created_at: string
  admin_note: string | null
  assets: { id: string; company_name: string | null; official_grade: string | null } | null
}

export default async function BuyerOffresPage() {
  const user = await getUser()
  if (!user) redirect('/client/login')

  /* ── SECTION VERROUILLÉE — retirer quand prêt ── */
  return <LockedSection title="Mes offres" />
}
