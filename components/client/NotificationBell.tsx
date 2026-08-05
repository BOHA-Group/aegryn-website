'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { Bell, X, Check, CheckCheck } from 'lucide-react'

type Notification = {
  id:          string
  type:        string
  title:       string
  body:        string | null
  link:        string | null
  read_at:     string | null
  dismissed_at: string | null
  created_at:  string
  payload:     Record<string, unknown> | null
}

function relativeDate(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const min  = Math.floor(diff / 60000)
  if (min < 1)   return "à l'instant"
  if (min < 60)  return `il y a ${min} min`
  const h = Math.floor(min / 60)
  if (h < 24)    return `il y a ${h}h`
  const d = Math.floor(h / 24)
  if (d < 30)    return `il y a ${d}j`
  return new Date(iso).toLocaleDateString('fr-CH', { day: '2-digit', month: 'short' })
}

const URGENCY_DOT: Record<string, string> = {
  broadcast_alert:  'bg-amber-500',
  broadcast_action: 'bg-emerald-500',
  broadcast_info:   'bg-blue-500',
}

const POLL_INTERVAL = 30_000

export default function NotificationBell() {
  const [open,         setOpen]         = useState(false)
  const [notifs,       setNotifs]       = useState<Notification[]>([])
  const [unread,       setUnread]       = useState(0)
  const [filter,       setFilter]       = useState<'all' | 'unread'>('all')
  const [loading,      setLoading]      = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)
  const pollRef  = useRef<ReturnType<typeof setInterval> | null>(null)

  const fetchNotifs = useCallback(async () => {
    try {
      const res  = await fetch('/api/client/notifications')
      if (!res.ok) return
      const data = await res.json()
      setNotifs(data.notifications ?? [])
      setUnread(data.unread_count  ?? 0)
    } catch { /* silencieux */ }
  }, [])

  /* Polling 30s — s'arrête quand le panel est ouvert */
  useEffect(() => {
    fetchNotifs()
    if (!open) {
      pollRef.current = setInterval(fetchNotifs, POLL_INTERVAL)
    }
    return () => { if (pollRef.current) clearInterval(pollRef.current) }
  }, [open, fetchNotifs])

  /* Fermer au clic extérieur */
  useEffect(() => {
    function handle(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) setOpen(false)
    }
    if (open) document.addEventListener('mousedown', handle)
    return () => document.removeEventListener('mousedown', handle)
  }, [open])

  async function markRead(id: string) {
    setNotifs(prev => prev.map(n => n.id === id ? { ...n, read_at: new Date().toISOString() } : n))
    setUnread(prev => Math.max(0, prev - 1))
    await fetch('/api/client/notifications', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, action: 'read' }),
    })
  }

  async function markAllRead() {
    setLoading(true)
    setNotifs(prev => prev.map(n => ({ ...n, read_at: n.read_at ?? new Date().toISOString() })))
    setUnread(0)
    await fetch('/api/client/notifications', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'read_all' }),
    })
    setLoading(false)
  }

  async function dismiss(id: string) {
    setNotifs(prev => prev.filter(n => n.id !== id))
    if (notifs.find(n => n.id === id)?.read_at === null) setUnread(prev => Math.max(0, prev - 1))
    await fetch('/api/client/notifications/dismiss', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
  }

  const displayed = filter === 'unread' ? notifs.filter(n => !n.read_at) : notifs

  return (
    <div className="relative" ref={panelRef}>
      {/* Bouton cloche */}
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        className="relative flex items-center justify-center w-8 h-8 text-ag-gray hover:text-ag-black transition-colors"
        aria-label="Notifications"
      >
        <Bell size={16} className={unread > 0 ? 'text-ag-apex animate-[bell-ring_0.5s_ease-in-out]' : ''} />
        {unread > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 bg-red-500 text-white font-mono font-bold text-[9px] flex items-center justify-center px-1 leading-none">
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>

      {/* Panel */}
      {open && (
        <div className="absolute right-0 top-full mt-2 w-[340px] bg-white border border-gray-200 shadow-lg z-50 flex flex-col max-h-[480px]">

          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <p className="font-mono text-[10px] uppercase tracking-widest text-gray-700 font-semibold">Notifications</p>
              {unread > 0 && (
                <span className="bg-red-500 text-white font-mono text-[8px] font-bold px-1.5 py-0.5 min-w-[18px] text-center">
                  {unread}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              {unread > 0 && (
                <button
                  type="button"
                  onClick={markAllRead}
                  disabled={loading}
                  className="flex items-center gap-1 font-mono text-[8px] uppercase tracking-widest text-gray-400 hover:text-ag-navy transition-colors"
                  title="Tout marquer comme lu"
                >
                  <CheckCheck size={11} />
                  Tout lire
                </button>
              )}
              <button type="button" onClick={() => setOpen(false)} className="text-gray-300 hover:text-gray-600">
                <X size={14} />
              </button>
            </div>
          </div>

          {/* Filtres */}
          <div className="flex border-b border-gray-100">
            {(['all', 'unread'] as const).map(f => (
              <button
                key={f}
                type="button"
                onClick={() => setFilter(f)}
                className={`flex-1 py-2 font-mono text-[9px] uppercase tracking-widest transition-colors ${
                  filter === f ? 'text-ag-navy border-b-2 border-ag-navy' : 'text-gray-400 hover:text-gray-700'
                }`}
              >
                {f === 'all' ? 'Toutes' : `Non lues (${unread})`}
              </button>
            ))}
          </div>

          {/* Liste */}
          <div className="overflow-y-auto flex-1">
            {displayed.length === 0 ? (
              <div className="px-4 py-8 text-center">
                <Bell size={20} className="text-gray-200 mx-auto mb-2" />
                <p className="font-sans text-[12px] text-gray-400">Aucune notification.</p>
              </div>
            ) : (
              displayed.map(n => {
                const dotColor = URGENCY_DOT[n.type] ?? 'bg-gray-300'
                const isUnread = !n.read_at

                return (
                  <div
                    key={n.id}
                    className={`flex items-start gap-3 px-4 py-3 border-b border-gray-50 transition-colors ${
                      isUnread ? 'bg-blue-50/40' : 'bg-white hover:bg-gray-50'
                    }`}
                  >
                    {/* Dot urgence */}
                    <span className={`mt-1.5 w-2 h-2 rounded-full shrink-0 ${dotColor}`} />

                    {/* Contenu */}
                    <div className="flex-1 min-w-0">
                      <p className={`font-sans text-[12px] leading-snug ${isUnread ? 'font-semibold text-gray-900' : 'text-gray-700'}`}>
                        {n.title}
                      </p>
                      {n.body && (
                        <p className="font-sans text-[11px] text-gray-500 mt-0.5 line-clamp-2">{n.body}</p>
                      )}
                      <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                        <span className="font-mono text-[9px] text-gray-400">{relativeDate(n.created_at)}</span>
                        {n.link && (
                          <a
                            href={n.link}
                            onClick={() => { if (isUnread) markRead(n.id); setOpen(false) }}
                            className="font-mono text-[9px] uppercase tracking-widest text-ag-navy hover:text-ag-apex transition-colors"
                          >
                            Voir →
                          </a>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1 shrink-0 mt-0.5">
                      {isUnread && (
                        <button type="button" onClick={() => markRead(n.id)}
                          title="Marquer comme lu"
                          className="p-1 text-gray-300 hover:text-ag-navy transition-colors">
                          <Check size={11} />
                        </button>
                      )}
                      <button type="button" onClick={() => dismiss(n.id)}
                        title="Archiver"
                        className="p-1 text-gray-300 hover:text-red-400 transition-colors">
                        <X size={11} />
                      </button>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>
      )}
    </div>
  )
}
