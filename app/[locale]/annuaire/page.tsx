import type { Metadata }  from 'next'
import { getTranslations } from 'next-intl/server'
import { redirect }        from 'next/navigation'
import { generateAegrynMetadata } from '@/lib/seo'
import { getUser }         from '@/lib/supabaseServer'
import { createServiceClient }    from '@/lib/supabase'
import { Suspense } from 'react'
import ExpertsContent from './ExpertsContent'

const BASE = 'https://aegryn.com'
const ANNUAIRE_SLUG: Record<string, string> = {
  fr: '/annuaire',
  en: '/annuaire',
  de: '/annuaire',
  es: '/annuaire',
  it: '/annuaire',
  nl: '/annuaire',
}

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'experts' })
  const slug = ANNUAIRE_SLUG[locale] ?? '/annuaire'
  const base = generateAegrynMetadata({
    title:       t('meta.title'),
    description: t('meta.desc'),
    path:        slug,
    locale,
    keywords:    ['réseau experts M&A', 'M&A expert network', 'due diligence tech'],
  })
  return {
    ...base,
    robots: { index: false, follow: false },
    alternates: {
      canonical:  `${BASE}/${locale}${slug}`,
      languages: {
        fr:          `${BASE}/fr/annuaire`,
        en:          `${BASE}/en/annuaire`,
        de:          `${BASE}/de/annuaire`,
        es:          `${BASE}/es/annuaire`,
        it:          `${BASE}/it/annuaire`,
        nl:          `${BASE}/nl/annuaire`,
        'x-default': `${BASE}/en/annuaire`,
      },
    },
  }
}

export const dynamic = 'force-dynamic'

export default async function ExpertsPage() {
  const user = await getUser()
  if (!user) redirect('/client/login')

  const supa = createServiceClient()
  const [{ data: expertProfile }, { data: profile }] = await Promise.all([
    supa
      .from('expert_profiles')
      .select('id')
      .eq('user_id', user.id)
      .not('verified_at', 'is', null)
      .maybeSingle(),
    supa
      .from('profiles')
      .select('role, roles')
      .eq('id', user.id)
      .maybeSingle(),
  ])

  const roles   = (profile?.roles ?? []) as string[]
  const isAdmin = user.app_metadata?.role === 'admin' ||
    profile?.role === 'admin' || profile?.role === 'super_admin' ||
    roles.includes('admin') || roles.includes('super_admin')

  if (!expertProfile && !isAdmin) redirect('/client')

  return (
    <Suspense>
      <ExpertsContent />
    </Suspense>
  )
}
