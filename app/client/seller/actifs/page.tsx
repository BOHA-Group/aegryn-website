import type { Metadata } from 'next'
import { cookies } from 'next/headers'
import { getTranslations } from 'next-intl/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getUser } from '@/lib/supabaseServer'
import { createServiceClient } from '@/lib/supabase'
import { ArrowUpRight, FileText } from 'lucide-react'
import LockedSection from '@/app/client/LockedSection'

export const metadata: Metadata = {
  title: 'Mes dossiers — Espace Cédant Aegryn',
  robots: { index: false, follow: false },
}

const STATUS_STEPS = [
  { key: 'submitted',    label: 'Reçu' },
  { key: 'under_review', label: 'Analyse' },
  { key: 'pre_grade',    label: 'Pre-Grade' },
  { key: 'graded',       label: 'Gradé' },
  { key: 'published',    label: 'Publié' },
  { key: 'sold',         label: 'Vendu' },
]

const TRS_BADGE: Record<string, { label: string; cls: string }> = {
  ready:       { label: 'Prêt',          cls: 'text-emerald-700 bg-emerald-50 border-emerald-200' },
  conditional: { label: 'Conditionnel',  cls: 'text-amber-700 bg-amber-50 border-amber-200' },
  remediation: { label: 'Remédiation',   cls: 'text-orange-700 bg-orange-50 border-orange-200' },
  blocked:     { label: 'Bloqué',        cls: 'text-red-700 bg-red-50 border-red-200' },
}

function getStepIndex(status: string) {
  return STATUS_STEPS.findIndex(s => s.key === status)
}

function gradeColor(g: string) {
  return g === '★'   ? 'text-emerald-600 border-emerald-200 bg-emerald-50'
    : g === 'AAA'    ? 'text-blue-700 border-blue-200 bg-blue-50'
    : g === 'AA'     ? 'text-green-700 border-green-200 bg-green-50'
    : g === 'A'      ? 'text-yellow-700 border-yellow-200 bg-yellow-50'
    : g === 'B'      ? 'text-gray-600 border-gray-200 bg-gray-50'
    : 'text-red-500 border-red-100 bg-red-50'
}

function fmtDate(d: unknown, locale: string) {
  if (!d || typeof d !== 'string') return '—'
  return new Date(d).toLocaleDateString(locale, { day: '2-digit', month: 'long', year: 'numeric' })
}

function fmtChf(n: number | null) {
  if (n == null) return '—'
  return new Intl.NumberFormat('fr-CH', { style: 'currency', currency: 'CHF', maximumFractionDigits: 0 }).format(n)
}

type Asset = {
  id: string
  company_name: string | null
  asset_type: string | null
  arr: number | null
  official_grade: string | null
  score_total: number | null
  status: string
  trs: string | null
  auction_ready: boolean | null
  public_summary: string | null
  submitted_at: string | null
  graded_at: string | null
  published_at: string | null
}

export default async function SellerActifsPage() {
  const user = await getUser()
  if (!user) redirect('/client/login')

  /* ── SECTION VERROUILLÉE — retirer quand prêt ── */
  return <LockedSection title="Mes actifs" />
}
