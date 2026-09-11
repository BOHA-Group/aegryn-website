import type { Metadata } from 'next'
import { cookies } from 'next/headers'
import { getTranslations } from 'next-intl/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getUser } from '@/lib/supabaseServer'
import { createServiceClient } from '@/lib/supabase'
import { ArrowUpRight, ArrowRightLeft } from 'lucide-react'
import LockedSection from '@/app/client/LockedSection'

export const metadata: Metadata = {
  title: 'Transactions — Buyer Space Aegryn',
  robots: { index: false, follow: false },
}

const TX_STEPS = [
  { key: 'ei_submitted',   label: 'EI reçue' },
  { key: 'ap_signed',      label: 'AP signé' },
  { key: 'escrow_paid',    label: 'Séquestre' },
  { key: 'dd_in_progress', label: 'Due Diligence' },
  { key: 'signing',        label: 'Signing' },
  { key: 'closed',         label: 'Clôturé' },
]

function getStepIndex(status: string) {
  return TX_STEPS.findIndex(s => s.key === status)
}

function fmtChf(n: number | null) {
  if (n == null) return '—'
  return new Intl.NumberFormat('fr-CH', { style: 'currency', currency: 'CHF', maximumFractionDigits: 0 }).format(n)
}

function fmtDate(d: unknown, locale: string) {
  if (!d || typeof d !== 'string') return '—'
  return new Date(d).toLocaleDateString(locale, { day: '2-digit', month: 'long', year: 'numeric' })
}

type Transaction = {
  id: string
  status: string
  created_at: string
  escrow_amount_chf: number | null
  ap_accepted_buyer: boolean
  ap_accepted_seller: boolean
  dd_deadline_at: string | null
  signing_date: string | null
  closed_at: string | null
  assets: { company_name: string | null; official_grade: string | null } | null
}

export default async function BuyerTransactionsPage() {
  const user = await getUser()
  if (!user) redirect('/client/login')

  /* ── SECTION VERROUILLÉE — retirer quand prêt ── */
  return <LockedSection title="Transactions" />
}
