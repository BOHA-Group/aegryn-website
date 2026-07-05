import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { getUser } from '@/lib/supabaseServer'
import { createServiceClient } from '@/lib/supabase'
import { Bell } from 'lucide-react'
import SellerNotificationsClient from './SellerNotificationsClient'

export const metadata: Metadata = {
  title: 'Notifications — Espace Cédant AEGRYN',
  robots: { index: false, follow: false },
}

export type Notification = {
  id: string
  type: string
  title: string
  body: string | null
  link: string | null
  payload: Record<string, unknown>
  read_at: string | null
  created_at: string
}

export default async function SellerNotificationsPage() {
  const user = await getUser()
  if (!user) redirect('/client/login')

  const supa = createServiceClient()
  const { data } = await supa
    .from('user_notifications')
    .select('id, type, title, body, link, payload, read_at, created_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(50)

  const notifications = (data ?? []) as Notification[]

  return (
    <div className="p-8 max-w-3xl">
      <div className="mb-8">
        <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-gray-400 mb-1">Espace Cédant</p>
        <h1 className="font-sans font-bold text-gray-900 text-[24px] tracking-tight">Notifications</h1>
        <p className="font-sans text-[13px] text-gray-400 mt-1">
          Alertes et mises à jour liées à votre dossier.
        </p>
      </div>

      {notifications.length === 0 ? (
        <div className="bg-white border border-gray-200 px-8 py-16 text-center">
          <Bell size={24} className="text-gray-300 mx-auto mb-4" />
          <p className="font-sans text-[14px] text-gray-400">Aucune notification pour le moment.</p>
        </div>
      ) : (
        <SellerNotificationsClient notifications={notifications} />
      )}
    </div>
  )
}
