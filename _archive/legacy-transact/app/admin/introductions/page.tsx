import { checkAdminAccess }   from '@/lib/adminAuth'
import { createServiceClient } from '@/lib/supabase'
import type { Metadata }       from 'next'
import IntroductionsAdminClient, { type IntroductionAdmin } from './IntroductionsAdminClient'

export const metadata: Metadata = {
  title: 'Introductions — Admin Aegryn',
  robots: { index: false, follow: false },
}

export default async function AdminIntroductionsPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>
}) {
  const params = await searchParams
  await checkAdminAccess(params.token)

  const supa = createServiceClient()

  const { data: introductions } = await supa
    .from('introductions')
    .select(`
      id,
      introduction_type,
      contact_name,
      contact_email,
      introduction_status,
      context_note,
      admin_note,
      created_at,
      partner:partner_id (
        email,
        full_name
      )
    `)
    .order('created_at', { ascending: false })
    .limit(200)


  return (
    <IntroductionsAdminClient
      introductions={(introductions ?? []) as unknown as IntroductionAdmin[]}
    />
  )
}
