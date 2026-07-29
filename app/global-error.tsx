'use client'

import { useEffect } from 'react'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const isProd = process.env.NODE_ENV === 'production'

  useEffect(() => {
    if (isProd) {
      window.location.reload()
    }
  }, [isProd])

  if (isProd) {
    return (
      <html>
        <body style={{ margin: 0, background: '#fff' }} />
      </html>
    )
  }

  return (
    <html>
      <body style={{ margin: 0, background: '#0a0a0a', color: '#fff', fontFamily: 'monospace', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: 24 }}>
        <div style={{ maxWidth: 640, width: '100%' }}>
          <p style={{ color: '#ff4422', fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: 12 }}>
            Runtime Error — Debug Preview
          </p>
          <h1 style={{ fontSize: 20, fontWeight: 700, marginBottom: 16, color: '#fff' }}>
            {error.name}: {error.message}
          </h1>
          {error.digest && (
            <p style={{ fontSize: 11, color: '#666', marginBottom: 12 }}>digest: {error.digest}</p>
          )}
          <pre style={{ background: '#111', border: '1px solid #333', padding: 16, fontSize: 10, overflowX: 'auto', whiteSpace: 'pre-wrap', color: '#aaa', marginBottom: 20 }}>
            {error.stack ?? 'no stack available'}
          </pre>
          <button
            onClick={reset}
            style={{ background: '#fff', color: '#000', border: 'none', padding: '10px 20px', fontFamily: 'monospace', fontSize: 11, cursor: 'pointer', letterSpacing: '0.1em', textTransform: 'uppercase' }}
          >
            Réessayer
          </button>
        </div>
      </body>
    </html>
  )
}
