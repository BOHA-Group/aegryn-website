import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { cookies } from 'next/headers'
import { getTranslations } from 'next-intl/server'
import { getUser } from '@/lib/supabaseServer'
import { createServiceClient } from '@/lib/supabase'
import { Award, Bell, ArrowUpRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Dashboard — Partner Space Aegryn',
  robots: { index: false, follow: false },
}

function fmtDate(d: unknown, locale: string) {
  if (!d || typeof d !== 'string') return '—'
  return new Date(d).toLocaleDateString(locale, { day: '2-digit', month: 'long', year: 'numeric' })
}

type Certification = {
  id: string
  dimension: string
  status: string
  deadline_at: string | null
  assets: { company_name: string | null } | null
}

export default async function PartnerDashboardPage() {
  const user = await getUser()
  if (!user) redirect('/client/login')

  const cookieStore = await cookies()
  const locale = cookieStore.get('ag-locale-pref')?.value ?? 'fr'
  const t = await getTranslations({ locale, namespace: 'client.partner' })
  const tc = await getTranslations({ locale, namespace: 'client.common' })

  const certStatusLabel = (s: string) => t(`certStatus.${s}` as Parameters<typeof t>[0]) || s

  const supa = createServiceClient()

  const [
    { data: profile },
    { data: certifications },
    { data: notifications },
  ] = await Promise.all([
    supa.from('profiles').select('full_name, expert_plan, expert_plan_start').eq('id', user.id).single(),
    supa.from('partner_certifications')
      .select('id, dimension, status, deadline_at, assets(company_name)')
      .eq('partner_id', user.id)
      .not('status', 'eq', 'signed')
      .order('created_at', { ascending: false })
      .limit(3),
    supa.from('user_notifications')
      .select('id, title, body, created_at, read_at')
      .eq('user_id', user.id)
      .or('target_role.eq.partner,target_role.is.null')
      .is('dismissed_at', null)
      .is('deleted_at', null)
      .order('created_at', { ascending: false })
      .limit(4),
  ])

  const displayName = profile?.full_name ?? user.email ?? ''
  const unreadCount = (notifications ?? []).filter(n => !n.read_at).length

  const activeCertCount = (certifications as unknown[] ?? []).filter(c =>
    ['assigned', 'in_review'].includes((c as Certification).status)
  ).length

  return (
    <div className="p-8 max-w-5xl">

      {/* Header */}
      <div className="mb-10">
        <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-gray-400 mb-1">{t('areaLabel')}</p>
        <h1 className="font-sans font-bold text-gray-900 text-[26px] tracking-tight">
          {t('hello', { name: displayName.split(' ')[0] || t('fallbackName') })}
        </h1>
        <p className="font-sans text-[13px] text-gray-400 mt-0.5">{user.email}</p>
      </div>

      {/* Alerte notifications */}
      {unreadCount > 0 && (
        <Link href="/client/partner/notifications"
          className="rounded-lg flex items-center gap-3 bg-blue-50 border border-blue-200 px-4 py-3 hover:bg-blue-100 transition-colors mb-8">
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
          <p className="font-sans text-[11px] text-gray-400 mt-0.5">{t('kpiCertifications')}</p>
        </Link>

      </div>

      {/* Co-signatures actives */}
      {certifications && certifications.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-sans font-semibold text-gray-900 text-[14px]">{t('activeCertifications')}</h2>
            <Link href="/client/partner/certifications"
              className="font-mono text-[10px] uppercase tracking-widest text-gray-400 hover:text-gray-700 flex items-center gap-1">
              {tc('viewAll')} <ArrowUpRight size={10} />
            </Link>
          </div>
          <div className="flex flex-col gap-2">
            {(certifications as unknown[] as Certification[]).map(cert => (
              <Link key={cert.id} href={`/client/partner/certifications/${cert.id}`}
                className="rounded-lg bg-white border border-gray-200 px-5 py-4 flex items-center justify-between hover:border-gray-300 transition-colors group">
                <div>
                  <p className="font-sans font-medium text-gray-900 text-[13px]">
                    {cert.assets?.company_name ?? `Actif #${cert.id.slice(0, 8)}`}
                    <span className="ml-2 font-mono text-[9px] text-gray-400 uppercase tracking-widest">
                      — {cert.dimension}
                    </span>
                  </p>
                  {cert.deadline_at && (
                    <p className="font-mono text-[10px] text-amber-600 mt-0.5">
                      Échéance : {fmtDate(cert.deadline_at, locale)}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-[9px] uppercase tracking-widest text-gray-400">
                    {certStatusLabel(cert.status)}
                  </span>
                  <ArrowUpRight size={12} className="text-gray-300 group-hover:text-gray-500 transition-colors" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

    </div>
  )
}
