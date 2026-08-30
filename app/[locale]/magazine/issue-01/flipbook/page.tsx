'use client'

import { useEffect, useRef }   from 'react'
import { useRouter, useParams } from 'next/navigation'
import { X }                    from 'lucide-react'

/**
 * /[locale]/magazine/issue-01/flipbook
 * Flipbook pleine page dans Next.js — iframe StPageFlip.
 * - Bouton "Quitter" + touche ESC → retour à /magazine/issue-01
 * - position:fixed inset:0 couvre nav + footer — pas de layout séparé
 * - Aucun flash de contenu sous-jacent
 */
export default function MagazineFlipbookPage() {
  const router = useRouter()
  const params = useParams()
  const locale = typeof params.locale === 'string' ? params.locale : 'fr'
  const iframeRef = useRef<HTMLIFrameElement>(null)

  const handleQuit = () => router.push(`/${locale}/magazine/issue-01`)

  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const quit = () => router.push(`/${locale}/magazine/issue-01`)
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') quit() }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onKey)
    }
  }, [locale, router])

  return (
    <div style={{ position: 'fixed', top: 0, right: 0, bottom: 0, left: 0, zIndex: 9999, background: '#0F1A2B', width: '100vw', height: '100vh' }}>

      {/* Quit button */}
      <button
        onClick={handleQuit}
        aria-label="Quitter le flipbook"
        style={{
          position:    'absolute',
          top:         16,
          right:       16,
          zIndex:      10000,
          display:     'flex',
          alignItems:  'center',
          gap:         6,
          background:  'rgba(15,26,43,0.85)',
          border:      '1px solid rgba(255,255,255,0.15)',
          color:       'rgba(255,255,255,0.7)',
          fontFamily:  'monospace',
          fontSize:    10,
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          padding:     '7px 14px',
          cursor:      'pointer',
          backdropFilter: 'blur(4px)',
        }}
        onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
        onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.7)')}
      >
        <X size={12} />
        Quitter
      </button>

      {/* Flipbook iframe */}
      <iframe
        ref={iframeRef}
        src="/magazine/issue-01/aegryn-magazine-issue-01_1.html"
        title="Aegryn Magazine — Issue 01 Flipbook"
        style={{ width: '100vw', height: '100vh', border: 'none', display: 'block' }}
        allow="fullscreen"
        allowFullScreen
      />
    </div>
  )
}
