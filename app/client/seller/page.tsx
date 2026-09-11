import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { cookies } from 'next/headers'
import { getTranslations } from 'next-intl/server'
import { getUser } from '@/lib/supabaseServer'
import { createServiceClient } from '@/lib/supabase'
import { FileText, ArrowRightLeft, ShieldCheck, Bell, ArrowUpRight, Calculator, Clock, CheckCircle2, Tag, AlertTriangle, Zap } from 'lucide-react'
import { calcCommission, fmtEur } from '@/lib/calcCommission'
import LockedSection from '@/app/client/LockedSection'

export const metadata: Metadata = {
  title: 'Dashboard — Seller Space Aegryn',
  robots: { index: false, follow: false },
}

function fmtDate(d: unknown, locale: string) {
  if (!d || typeof d !== 'string') return '—'
  return new Date(d).toLocaleDateString(locale, { day: '2-digit', month: 'long', year: 'numeric' })
}

function fmtChf(n: number | null) {
  if (n == null) return '—'
  return new Intl.NumberFormat('fr-CH', { style: 'currency', currency: 'CHF', maximumFractionDigits: 0 }).format(n)
}

export default async function SellerDashboardPage() {
  const user = await getUser()
  if (!user) redirect('/client/login')

  /* ── SECTION VERROUILLÉE — retirer quand prêt ── */
  return <LockedSection title="Tableau de bord" />
}
