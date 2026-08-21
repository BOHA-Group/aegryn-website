'use client'

import { useEffect, useRef, useState } from 'react'
import { Maximize2, Minimize2 } from 'lucide-react'

interface Props {
  htmlSrc:    string
  title?:     string
  baseAsset?: string
}

/**
 * FlipbookViewer — iframe vers le HTML autonome StPageFlip.
 * Le HTML /magazine/issue-01/aegryn-magazine-issue-01_1.html
 * contient StPageFlip.js CDN + UI Barnes (dark bg, thumbs, toolbar).
 */
export function FlipbookViewer({ htmlSrc }: Props) {
  const wrapRef         = useRef<HTMLDivElement>(null)
  const [isFs, setIsFs] = useState(false)

  useEffect(() => {
    const handler = () => setIsFs(!!document.fullscreenElement)
    document.addEventListener('fullscreenchange', handler)
    return () => document.removeEventListener('fullscreenchange', handler)
  }, [])

  function toggleFs() {
    const el = wrapRef.current
    if (!el) return
    if (!document.fullscreenElement) el.requestFullscreen()
    else document.exitFullscreen()
  }

  return (
    <div
      ref={wrapRef}
      style={{
        position: 'relative',
        width: '100%',
        height: '88vh',
        minHeight: '600px',
        background: '#1e1e1e',
      }}
    >
      <iframe
        src={htmlSrc}
        title="Aegryn Magazine Flipbook"
        style={{
          width: '100%',
          height: '100%',
          border: 'none',
          display: 'block',
        }}
        allow="fullscreen"
      />
      <button
        onClick={toggleFs}
        title={isFs ? 'Quitter plein écran' : 'Plein écran'}
        style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          zIndex: 20,
          background: 'rgba(0,0,0,0.5)',
          border: '1px solid rgba(255,255,255,0.15)',
          color: '#fff',
          borderRadius: '3px',
          padding: '5px 7px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        {isFs ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
      </button>
    </div>
  )
}
