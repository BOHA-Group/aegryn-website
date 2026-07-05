import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getUser } from '@/lib/supabaseServer'
import { createServiceClient } from '@/lib/supabase'
import { Award, Users, DollarSign, Bell, ArrowUpRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Tableau de bord — Espace Partenaire AEGRYN',
  robots: { index: false, follow: false },
}

const CERT_STATUS_LABELS: Record<string, string> = {
  assigned:   'Assignée',
  in_review:  'En cours',
  submitted:  'Soumise',
  signed:     'Signée',
  declined:   'Refusée',
}

const COMMISSION_STATUS_LABELS: Record<string, string> = {
  pending:    'En attente',
  to_invoice: 'À facturer',
  invoiced:   'Facturée',
  paid:       'Payée',
}

const COMMISSION_STATUS_COLOR: Record<string, string> = {
  pending:    'text-gray-400',
  to_invoice: 'text-amber-600',
  invoiced:   'text-blue-600',
  paid:       'text-emerald-600',
}

function fmtChf(n: number | null) {
  if (n == null) return '—'
  return new Intl.NumberFormat('fr-CH', { style: 'currency', currency: 'CHF', maximumFractionDigits: 0 }).format(n)
}

function fmtDate(d: unknown) {
  if (!d || typeof d !== 'string') return '—'
  return new Date(d).toLocaleDateString('fr-CH', { day: '2-digit', month: 'long', year: 'numeric' })
}

type Commission = {
  id: string
  type: string
  amount_chf: number | null
  status: string
  eligible_at: string | null
}

type Certification = {
  id: string
  dimension: string
  status: string
  deadline_at: string | null
  assets: { company_name: string | null } | null
}

type Introduction = {
  id: string
  introduction_type: string
  contact_name: string
  introduction_status: string
  created_at: string
}

export default async function PartnerDashboardPage() {
  const user = await getUser()
  if (!user) redirect('/client/login')

  const supa = createServiceClient()

  const [
    { data: profile },
    { data: certifications },
    { data: introductions },
    { data: commissions },
    { data: notifications },
  ] = await Promise.all([
    supa.from('profiles').select('full_name').eq('id', user.id).single(),
    supa.from('partner_certifications')
      .select('id, dimension, status, deadline_at, assets(company_name)')
      .eq('partner_id', user.id)
      .not('status', 'eq', 'signed')
      .order('created_at', { ascending: false })
      .limit(3),
    supa.from('introductions')
      .select('id, introduction_type, contact_name, introduction_status, created_at')
      .eq('partner_id', user.id)
      .order('created_at', { ascending: false })
      .limit(3),
    supa.from('commissions')
      .select('id, type, amount_chf, status, eligible_at')
      .eq('partner_id', user.id)
      .order('created_at', { ascending: false })
      .limit(5),
    supa.from('user_notifications')
      .select('id, title, body, created_at, read_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(4),
  ])

  const displayName = profile?.full_name ?? user.email ?? ''
  const unreadCount = (notifications ?? []).filter(n => !n.read_at).length

  const totalEarned = (commissions ?? [])
    .filter(c => (c as Commission).status === 'paid')
    .reduce((sum, c) => sum + ((c as Commission).amount_chf ?? 0), 0)

  const pendingAmount = (commissions ?? [])
    .filter(c => ['pending', 'to_invoice', 'invoiced'].includes((c as Commission).status))
    .reduce((sum, c) => sum + ((c as Commission).amount_chf ?? 0), 0)

  const activeCertCount = (certifications as unknown[] ?? []).filter(c =>
    ['assigned', 'in_review'].includes((c as Certification).status)
  ).length

  return (
    <div className="p-8 max-w-5xl">

      {/* Header */}
      <div className="mb-10">
        <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-gray-400 mb-1">Espace Partenaire</p>
        <h1 className="font-sans font-bold text-gray-900 text-[26px] tracking-tight">
          Bonjour, {displayName.split(' ')[0] || 'Partenaire'}
        </h1>
        <p className="font-sans text-[13px] text-gray-400 mt-0.5">{user.email}</p>
      </div>

      {/* Alerte notifications */}
      {unreadCount > 0 && (
        <Link href="/client/partner/notifications"
          className="flex items-center gap-3 bg-blue-50 border border-blue-200 px-4 py-3 hover:bg-blue-100 transition-colors mb-8">
          <Bell size={14} className="text-blue-600 shrink-0" />
          <p className="font-sans text-[12px] text-blue-800">
            {unreadCount} nouvelle{unreadCount > 1 ? 's' : ''} notification{unreadCount > 1 ? 's' : ''}
          </p>
          <ArrowUpRight size={12} className="text-blue-500 ml-auto" />
        </Link>
      )}

      {/* KPI cards */}
      <div className="grid grid-cols-2 gap-4 mb-10 sm:grid-cols-4">
        <Link href="/client/partner/certifications"
          className="bg-white border border-gray-200 p-5 hover:border-gray-300 transition-colors group">
          <div className="flex items-center justify-between mb-3">
            <Award size={16} className="text-gray-400 group-hover:text-ag-navy transition-colors" />
            <ArrowUpRight size={12} className="text-gray-300 group-hover:text-gray-500 transition-colors" />
          </div>
          <p className={`font-mono font-bold text-[22px] ${activeCertCount > 0 ? 'text-amber-600' : 'text-gray-900'}`}>
            {activeCertCount}
          </p>
          <p className="font-sans text-[11px] text-gray-400 mt-0.5">Co-signatures actives</p>
        </Link>

        <Link href="/client/partner/introductions"
          className="bg-white border border-gray-200 p-5 hover:border-gray-300 transition-colors group">
          <div className="flex items-center justify-between mb-3">
            <Users size={16} className="text-gray-400 group-hover:text-ag-navy transition-colors" />
            <ArrowUpRight size={12} className="text-gray-300 group-hover:text-gray-500 transition-colors" />
          </div>
          <p className="font-mono font-bold text-[22px] text-gray-900">{introductions?.length ?? 0}</p>
          <p className="font-sans text-[11px] text-gray-400 mt-0.5">Introductions</p>
        </Link>

        <Link href="/client/partner/commissions"
          className="bg-white border border-gray-200 p-5 hover:border-gray-300 transition-colors group">
          <div className="flex items-center justify-between mb-3">
            <DollarSign size={16} className="text-gray-400 group-hover:text-ag-navy transition-colors" />
            <ArrowUpRight size={12} className="text-gray-300 group-hover:text-gray-500 transition-colors" />
          </div>
          <p className="font-mono font-bold text-[16px] text-emerald-600">{fmtChf(totalEarned || null)}</p>
          <p className="font-sans text-[11px] text-gray-400 mt-0.5">Commissions perçues</p>
        </Link>

        <Link href="/client/partner/commissions"
          className="bg-white border border-gray-200 p-5 hover:border-gray-300 transition-colors group">
          <div className="flex items-center justify-between mb-3">
            <DollarSign size={16} className="text-amber-400" />
            <ArrowUpRight size={12} className="text-gray-300 group-hover:text-gray-500 transition-colors" />
          </div>
          <p className="font-mono font-bold text-[16px] text-amber-600">{fmtChf(pendingAmount || null)}</p>
          <p className="font-sans text-[11px] text-gray-400 mt-0.5">En attente</p>
        </Link>
      </div>

      {/* Co-signatures actives */}
      {certifications && certifications.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-sans font-semibold text-gray-900 text-[14px]">Co-signatures en cours</h2>
            <Link href="/client/partner/certifications"
              className="font-mono text-[10px] uppercase tracking-widest text-gray-400 hover:text-gray-700 flex items-center gap-1">
              Voir tout <ArrowUpRight size={10} />
            </Link>
          </div>
          <div className="flex flex-col gap-2">
            {(certifications as unknown[] as Certification[]).map(cert => (
              <Link key={cert.id} href={`/client/partner/certifications/${cert.id}`}
                className="bg-white border border-gray-200 px-5 py-4 flex items-center justify-between hover:border-gray-300 transition-colors group">
                <div>
                  <p className="font-sans font-medium text-gray-900 text-[13px]">
                    {cert.assets?.company_name ?? `Actif #${cert.id.slice(0, 8)}`}
                    <span className="ml-2 font-mono text-[9px] text-gray-400 uppercase tracking-widest">
                      — {cert.dimension}
                    </span>
                  </p>
                  {cert.deadline_at && (
                    <p className="font-mono text-[10px] text-amber-600 mt-0.5">
                      Échéance : {fmtDate(cert.deadline_at)}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-[9px] uppercase tracking-widest text-gray-400">
                    {CERT_STATUS_LABELS[cert.status] ?? cert.status}
                  </span>
                  <ArrowUpRight size={12} className="text-gray-300 group-hover:text-gray-500 transition-colors" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Commissions récentes */}
      {commissions && commissions.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-sans font-semibold text-gray-900 text-[14px]">Commissions récentes</h2>
            <Link href="/client/partner/commissions"
              className="font-mono text-[10px] uppercase tracking-widest text-gray-400 hover:text-gray-700 flex items-center gap-1">
              Voir tout <ArrowUpRight size={10} />
            </Link>
          </div>
          <div className="flex flex-col gap-2">
            {(commissions as Commission[]).map(c => (
              <div key={c.id} className="bg-white border border-gray-200 px-5 py-3 flex items-center justify-between">
                <div>
                  <p className="font-sans text-[12px] text-gray-700">
                    {c.type === 'cosignature' ? 'Co-signature'
                      : c.type === 'introduction_asset' ? 'Introduction actif'
                      : 'Introduction acquéreur'}
                  </p>
                  {c.eligible_at && (
                    <p className="font-mono text-[9px] text-gray-400 mt-0.5">Éligible le {fmtDate(c.eligible_at)}</p>
                  )}
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-mono font-bold text-[13px] text-gray-800">{fmtChf(c.amount_chf)}</span>
                  <span className={`font-mono text-[9px] uppercase tracking-widest ${COMMISSION_STATUS_COLOR[c.status] ?? 'text-gray-400'}`}>
                    {COMMISSION_STATUS_LABELS[c.status] ?? c.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Introductions récentes */}
      {introductions && introductions.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-sans font-semibold text-gray-900 text-[14px]">Introductions récentes</h2>
            <Link href="/client/partner/introductions"
              className="font-mono text-[10px] uppercase tracking-widest text-gray-400 hover:text-gray-700 flex items-center gap-1">
              Voir tout <ArrowUpRight size={10} />
            </Link>
          </div>
          <div className="flex flex-col gap-2">
            {(introductions as Introduction[]).map(intro => (
              <Link key={intro.id} href={`/client/partner/introductions/${intro.id}`}
                className="bg-white border border-gray-200 px-5 py-3 flex items-center justify-between hover:border-gray-300 transition-colors group">
                <div>
                  <p className="font-sans text-[13px] text-gray-800 font-medium">{intro.contact_name}</p>
                  <p className="font-mono text-[9px] text-gray-400 uppercase tracking-widest mt-0.5">
                    {intro.introduction_type === 'asset' ? 'Apport actif' : 'Apport acquéreur'}
                    {' — '}{fmtDate(intro.created_at)}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-[9px] uppercase tracking-widest text-gray-400">
                    {intro.introduction_status}
                  </span>
                  <ArrowUpRight size={12} className="text-gray-300 group-hover:text-gray-500" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
