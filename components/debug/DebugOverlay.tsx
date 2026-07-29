'use client'

import { useEffect, useState } from 'react'
import { usePathname }         from 'next/navigation'
import { createBrowserClient } from '@supabase/ssr'

type Info = {
  path:      string
  hasUser:   boolean
  email:     string | null
  expiresAt: string | null
  expired:   boolean
  error:     string | null
  sbCookies: string[]
}

const IS_PREVIEW = process.env.NEXT_PUBLIC_VERCEL_ENV === 'preview' || process.env.NODE_ENV === 'development'

export default function DebugOverlay() {
  const [info, setInfo] = useState<Info | null>(null)
  const pathname = usePathname()

  useEffect(() => {
    if (!IS_PREVIEW) return
    const run = async () => {
      try {
        const supabase = createBrowserClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        )
        const { data: { session }, error } = await supabase.auth.getSession()
        const sbCookies = document.cookie
          .split(';')
          .map(c => c.trim().split('=')[0])
          .filter(c => c.startsWith('sb-'))
        const expiresAt = session?.expires_at
          ? new Date(session.expires_at * 1000).toISOString().slice(11, 19) + ' UTC'
          : null
        const expired = session?.expires_at
          ? session.expires_at * 1000 < Date.now()
          : false
        setInfo({
          path: pathname,
          hasUser:   !!session?.user,
          email:     session?.user?.email ?? null,
          expiresAt,
          expired,
          error:     error?.message ?? null,
          sbCookies,
        })
      } catch (e) {
        setInfo({
          path: pathname, hasUser: false, email: null,
          expiresAt: null, expired: false,
          error: e instanceof Error ? e.message : 'unknown',
          sbCookies: [],
        })
      }
    }
    run()
  }, [pathname])

  if (!IS_PREVIEW || !info) return null

  const ok = info.hasUser && !info.expired

  return (
    <div style={{
      position:       'fixed',
      bottom:         12,
      right:          12,
      background:     ok ? '#001a08' : '#1a0000',
      border:         `1px solid ${ok ? '#00cc44' : '#cc2200'}`,
      color:          ok ? '#00ff66' : '#ff5533',
      padding:        '10px 14px',
      fontSize:       10,
      fontFamily:     'monospace',
      zIndex:         2147483647,
      maxWidth:       360,
      borderRadius:   3,
      lineHeight:     1.65,
      pointerEvents:  'none',
    }}>
      <div style={{ fontWeight: 700, fontSize: 11, marginBottom: 4 }}>
        {ok ? '✓ AUTH OK' : info.hasUser ? '⚠ SESSION EXPIRED' : '✗ NO SESSION'}
      </div>
      <div style={{ color: '#aaa' }}>{info.path}</div>
      {info.email     && <div>email: {info.email}</div>}
      {info.expiresAt && (
        <div style={{ color: info.expired ? '#ff5533' : '#00ff66' }}>
          exp: {info.expiresAt}{info.expired ? ' ⚠ EXPIRED' : ' ✓'}
        </div>
      )}
      {info.error     && <div style={{ color: '#ff5533' }}>err: {info.error}</div>}
      <div style={{ color: '#666', marginTop: 3 }}>
        sb-cookies: {info.sbCookies.length > 0 ? info.sbCookies.join(', ') : 'aucun ⚠'}
      </div>
    </div>
  )
}
