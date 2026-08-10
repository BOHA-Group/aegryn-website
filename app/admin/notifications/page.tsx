import { checkAdminAccess } from '@/lib/adminAuth'
import type { Metadata }  from 'next'
import { createServiceClient } from '@/lib/supabase'
import BroadcastForm      from './BroadcastForm'
import { Mail, CheckCircle2, AlertTriangle, Clock, XCircle } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Notifications Email — Admin Aegryn',
  robots: { index: false, follow: false },
}

const STATUS_CFG: Record<string, { label: string; color: string; renderIcon: () => React.ReactNode }> = {
  sending: { label: 'En cours',  color: 'text-blue-600',    renderIcon: () => <Clock        size={12} /> },
  sent:    { label: 'Envoyé',    color: 'text-emerald-600', renderIcon: () => <CheckCircle2 size={12} /> },
  partial: { label: 'Partiel',   color: 'text-amber-600',   renderIcon: () => <AlertTriangle size={12} /> },
  failed:  { label: 'Échec',     color: 'text-red-500',     renderIcon: () => <XCircle      size={12} /> },
  draft:   { label: 'Brouillon', color: 'text-gray-400',    renderIcon: () => <Clock        size={12} /> },
}

const TARGET_LABELS: Record<string, string> = {
  all:     'Tous les clients',
  buyer:   'Acquéreurs',
  seller:  'Cédants',
  partner: 'Partenaires',
}

function fmtDate(d: unknown) {
  if (!d || typeof d !== 'string') return '—'
  return new Date(d).toLocaleDateString('fr-CH', {
    day: '2-digit', month: 'long', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

type Broadcast = {
  id: string
  target_role: string
  subject: string
  title: string
  recipient_count: number
  sent_count: number
  failed_count: number
  status: string
  sent_at: string | null
  created_at: string
}

export default async function AdminNotificationsPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>
}) {
  const params     = await searchParams
  await checkAdminAccess(params.token)

  const supa    = createServiceClient()

  const { data: broadcasts } = await supa
    .from('email_broadcasts')
    .select('id, target_role, subject, title, recipient_count, sent_count, failed_count, status, sent_at, created_at')
    .order('created_at', { ascending: false })
    .limit(30)

  const bs = (broadcasts ?? []) as Broadcast[]

  // Compter les profils par rôle pour prévisualiser la cible
  const { data: roleStats } = await supa
    .from('profiles')
    .select('roles, email_notifications_enabled')
    .eq('email_notifications_enabled', true)

  const profilesData = roleStats ?? []
  const roleCounts: Record<string, number> = {
    buyer:   profilesData.filter(p => Array.isArray(p.roles) && p.roles.includes('buyer')).length,
    seller:  profilesData.filter(p => Array.isArray(p.roles) && p.roles.includes('seller')).length,
    partner: profilesData.filter(p => Array.isArray(p.roles) && p.roles.includes('partner')).length,
    all:     profilesData.length,
  }

  return (
    <div className="p-8 max-w-5xl">

      <div className="mb-8">
        <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-gray-400 mb-1">Administration</p>
        <h1 className="font-sans font-bold text-gray-900 text-[24px] tracking-tight">Notifications Email</h1>
        <p className="font-sans text-[13px] text-gray-400 mt-1">
          Envoi groupé d&apos;emails + notifications in-app vers les espaces clients.
        </p>
      </div>

      {/* Audience preview */}
      <div className="grid grid-cols-4 gap-3 mb-8">
        {(['all', 'buyer', 'seller', 'partner'] as const).map(role => (
          <div key={role} className="bg-white border border-gray-200 p-4">
            <p className="font-mono text-[8px] uppercase tracking-widest text-gray-400 mb-1">{TARGET_LABELS[role]}</p>
            <p className="font-sans font-bold text-[20px] text-gray-900">{roleCounts[role]}</p>
            <p className="font-mono text-[9px] text-gray-300 mt-0.5">avec notifs activées</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">

        {/* Formulaire broadcast */}
        <div>
          <div className="flex items-center gap-2 mb-5">
            <Mail size={14} className="text-gray-500" />
            <p className="font-mono text-[9px] uppercase tracking-widest text-gray-500">Nouveau broadcast</p>
          </div>
          <BroadcastForm roleCounts={roleCounts} />
        </div>

        {/* Historique */}
        <div>
          <p className="font-mono text-[9px] uppercase tracking-widest text-gray-400 mb-5">Historique ({bs.length})</p>
          {bs.length === 0 ? (
            <div className="bg-white border border-gray-200 px-6 py-10 text-center">
              <Mail size={20} className="text-gray-300 mx-auto mb-3" />
              <p className="font-sans text-[13px] text-gray-400">Aucun broadcast envoyé.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {bs.map(b => {
                const cfg    = STATUS_CFG[b.status] ?? STATUS_CFG.draft
                const rate   = b.recipient_count > 0
                  ? Math.round((b.sent_count / b.recipient_count) * 100)
                  : 0

                return (
                  <div key={b.id} className="bg-white border border-gray-200 p-4">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="min-w-0">
                        <p className="font-sans font-semibold text-gray-900 text-[13px] truncate">{b.title}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="font-mono text-[8px] uppercase tracking-widest text-gray-400 border border-gray-200 px-1.5 py-0.5">
                            {TARGET_LABELS[b.target_role] ?? b.target_role}
                          </span>
                        </div>
                      </div>
                      <div className={`flex items-center gap-1.5 shrink-0 ${cfg.color}`}>
                        {cfg.renderIcon()}
                        <span className="font-mono text-[9px] uppercase tracking-widest">{cfg.label}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 mt-2">
                      <div>
                        <p className="font-mono text-[8px] uppercase text-gray-300">Destinataires</p>
                        <p className="font-sans text-[12px] text-gray-700">{b.recipient_count}</p>
                      </div>
                      <div>
                        <p className="font-mono text-[8px] uppercase text-gray-300">Envoyés</p>
                        <p className="font-sans text-[12px] text-emerald-600">{b.sent_count}</p>
                      </div>
                      {b.failed_count > 0 && (
                        <div>
                          <p className="font-mono text-[8px] uppercase text-gray-300">Échecs</p>
                          <p className="font-sans text-[12px] text-red-500">{b.failed_count}</p>
                        </div>
                      )}
                      {b.recipient_count > 0 && (
                        <div>
                          <p className="font-mono text-[8px] uppercase text-gray-300">Taux</p>
                          <p className="font-sans text-[12px] text-gray-700">{rate}%</p>
                        </div>
                      )}
                    </div>

                    <p className="font-mono text-[8px] text-gray-300 mt-2">
                      {b.sent_at ? fmtDate(b.sent_at) : fmtDate(b.created_at)}
                    </p>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* Nav retour */}
      <div className="mt-10 pt-6 border-t border-gray-100">
        <a href={`/admin`}
          className="font-mono text-[10px] uppercase tracking-widest text-gray-400 hover:text-gray-700 transition-colors">
          ← Retour au tableau de bord
        </a>
      </div>
    </div>
  )
}
