'use client'

import { useEffect, useRef }   from 'react'
import { useRouter, useParams } from 'next/navigation'
import { X }                    from 'lucide-react'

/**
 * /[locale]/magazine/issue-01/flipbook
 * Flipbook pleine page dans Next.js — iframe StPageFlip.
 * - Bouton "Quitter" + touche ESC → retour à /magazine/issue-01
 * - Layout dédié (flipbook/layout.tsx) masque nav + footer
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
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') handleQuit() }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onKey)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locale])

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>

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
        style={{ width: '100%', height: '100%', border: 'none', display: 'block' }}
        allow="fullscreen"
        allowFullScreen
      />
    </div>
  )
}
