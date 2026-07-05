'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Bell, CheckCheck, ArrowUpRight } from 'lucide-react'
import type { Notification } from './page'

const TYPE_ICON_MAP: Record<string, string> = {
  kyc_validated:      '🛡️',
  kyc_rejected:       '⚠️',
  transaction_update: '🔄',
  offer_retained:     '✅',
  escrow_confirmed:   '🏦',
  dd_started:         '🔍',
  signing_ready:      '✍️',
  deal_closed:        '🎉',
  asset_published:    '📢',
  asset_graded:       '🏅',
}

function fmtDate(d: string) {
  return new Date(d).toLocaleDateString('fr-CH', {
    day: '2-digit', month: 'long', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

export default function SellerNotificationsClient({ notifications }: { notifications: Notification[] }) {
  const [items, setItems] = useState(notifications)
  const [markingAll, setMarkingAll] = useState(false)

  const unreadCount = items.filter(n => !n.read_at).length

  async function markAllRead() {
    setMarkingAll(true)
    try {
      await fetch('/api/buyer/notifications/read-all', { method: 'POST' })
      setItems(prev => prev.map(n => ({ ...n, read_at: n.read_at ?? new Date().toISOString() })))
    } finally {
      setMarkingAll(false)
    }
  }

  async function markRead(id: string) {
    await fetch('/api/buyer/notifications/read', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
    setItems(prev => prev.map(n => n.id === id ? { ...n, read_at: new Date().toISOString() } : n))
  }

  return (
    <div>
      {unreadCount > 0 && (
        <div className="flex items-center justify-between mb-4">
          <p className="font-sans text-[12px] text-gray-500">
            <strong>{unreadCount}</strong> non lue{unreadCount > 1 ? 's' : ''}
          </p>
          <button
            onClick={markAllRead}
            disabled={markingAll}
            className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest text-gray-400 hover:text-gray-700 transition-colors disabled:opacity-40"
          >
            <CheckCheck size={12} />
            Tout marquer comme lu
          </button>
        </div>
      )}

      <div className="flex flex-col gap-2">
        {items.map(n => (
          <div
            key={n.id}
            onClick={() => !n.read_at && markRead(n.id)}
            className={`bg-white border p-4 flex items-start gap-4 cursor-default transition-colors ${
              !n.read_at
                ? 'border-blue-200 bg-blue-50/30 hover:bg-blue-50/50'
                : 'border-gray-200 hover:bg-gray-50'
            }`}
          >
            <span className="text-[18px] shrink-0 mt-0.5" aria-hidden="true">
              {TYPE_ICON_MAP[n.type] ?? '🔔'}
            </span>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2 mb-1">
                <p className={`font-sans text-[13px] leading-tight ${!n.read_at ? 'font-semibold text-gray-900' : 'font-medium text-gray-700'}`}>
                  {n.title}
                </p>
                {!n.read_at && <span className="shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-1" />}
              </div>
              {n.body && (
                <p className="font-sans text-[12px] text-gray-500 leading-relaxed mb-2">{n.body}</p>
              )}
              <div className="flex items-center justify-between gap-3">
                <p className="font-mono text-[9px] text-gray-300">{fmtDate(n.created_at)}</p>
                {n.link && (
                  <Link href={n.link}
                    className="font-mono text-[9px] uppercase tracking-widest text-ag-navy hover:underline flex items-center gap-1">
                    Voir <ArrowUpRight size={9} />
                  </Link>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {items.length > 0 && items.every(n => n.read_at) && (
        <div className="mt-6 flex items-center justify-center gap-2 text-gray-300">
          <Bell size={14} />
          <p className="font-sans text-[12px]">Toutes les notifications sont lues.</p>
        </div>
      )}
    </div>
  )
}
