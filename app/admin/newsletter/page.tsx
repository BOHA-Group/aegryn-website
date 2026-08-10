import type { Metadata }      from 'next'
import { createServiceClient } from '@/lib/supabase'
import { checkAdminAccess }    from '@/lib/adminAuth'
import NewsletterClient        from './NewsletterClient'

export const metadata: Metadata = {
  title: 'Newsletter — Aegryn Admin',
  robots: { index: false, follow: false },
}

export default async function AdminNewsletterPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>
}) {
  const params = await searchParams
  await checkAdminAccess(params.token)

  const supa    = createServiceClient()

  const { data: subscribers, error } = await supa
    .from('newsletter_subscribers')
    .select('id, email, user_id, locale, status, last_sent_slug, last_sent_at, subscribed_at, unsubscribed_at')
    .order('subscribed_at', { ascending: false })

  return (
    <main className="min-h-screen bg-gray-50 p-6 md:p-10">
      <div className="max-w-6xl mx-auto">

        <div className="mb-8">
          <p className="text-[10px] font-mono text-gray-400 uppercase tracking-widest mb-1">Aegryn ADMIN</p>
          <h1 className="text-[26px] font-bold text-gray-900 tracking-tight">Newsletter</h1>
          <p className="text-[12px] text-gray-400 mt-1">Abonnés actifs, prospects sans compte, historique d&apos;envoi</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 p-4 mb-6 text-[12px] text-red-700">
            Erreur Supabase : {(error as { message: string }).message}
          </div>
        )}

        <NewsletterClient subscribers={subscribers ?? []} />

      </div>
    </main>
  )
}
