'use client'

import { useState } from 'react'
import { FlipbookViewer } from './FlipbookViewer'
import { WebViewer }      from './WebViewer'

interface Props {
  flipbookSrc: string
  webSrc:      string
  issueLabel:  string
}

/**
 * IssueViewerTabs — onglets Flipbook / Web Edition
 * Flipbook : version imprimée condensée 60 pages (StPageFlip)
 * Web Edition : version web longue complète (_web.html)
 */
export function IssueViewerTabs({ flipbookSrc, webSrc, issueLabel }: Props) {
  const [tab, setTab] = useState<'flipbook' | 'web'>('flipbook')

  return (
    <div className="bg-[#EDEAE4]">
      {/* Tab bar */}
      <div className="flex items-center gap-0 px-6 md:px-10 border-b border-black/10 bg-[#F7F5F1]">
        <span className="font-mono text-[9px] tracking-[0.2em] uppercase text-black/30 mr-6 py-3 hidden sm:block">
          {issueLabel}
        </span>
        <button
          onClick={() => setTab('flipbook')}
          className={`font-mono text-[8px] tracking-[0.18em] uppercase px-4 py-3 border-b-2 transition-colors ${
            tab === 'flipbook'
              ? 'border-[#5ADDA4] text-[#0F1A2B] font-bold'
              : 'border-transparent text-black/35 hover:text-black/60'
          }`}
        >
          ⊞ Flipbook
        </button>
        <button
          onClick={() => setTab('web')}
          className={`font-mono text-[8px] tracking-[0.18em] uppercase px-4 py-3 border-b-2 transition-colors ${
            tab === 'web'
              ? 'border-[#5ADDA4] text-[#0F1A2B] font-bold'
              : 'border-transparent text-black/35 hover:text-black/60'
          }`}
        >
          ≡ Web Edition
        </button>
        <span className="ml-auto font-mono text-[7px] tracking-[0.14em] uppercase text-black/20 py-3 hidden md:block">
          {tab === 'flipbook' ? '60 p. · Print format' : 'Full edition · 80+ sections'}
        </span>
      </div>

      {/* Viewer */}
      {tab === 'flipbook'
        ? <FlipbookViewer htmlSrc={flipbookSrc} title="Aegryn Magazine Issue 01 — Flipbook" />
        : <WebViewer      htmlSrc={webSrc}      title="Aegryn Magazine Issue 01 — Web Edition" />
      }
    </div>
  )
}
