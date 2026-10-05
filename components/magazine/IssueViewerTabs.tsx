'use client'

import { useEffect, useState } from 'react'
import { FlipbookViewer } from './FlipbookViewer'
import { WebViewer }      from './WebViewer'
import { TOC_01 }         from '@/content/magazine/issue-01/toc'

interface Props {
  flipbookSrc: string
  webSrc:      string
  issueLabel:  string
}

/**
 * IssueViewerTabs — onglets Flipbook / Web Edition
 * Flipbook : version magazine a feuilleter (StPageFlip), pagination derivee du sommaire
 * Web Edition : le meme contenu, article par article (_web.html),
 * pilote par la barre laterale MagazineNav via l'evenement aegryn:magazine-navigate
 */
/* Derives du sommaire : derniere page referencee + 2 (page publicitaire et quatrieme de couverture), nombre d'articles */
const ARTICLE_COUNT = TOC_01.reduce((n, s) => n + s.articles.length, 0)
const PAGE_COUNT    = Math.max(...TOC_01.flatMap(s => s.articles.map(a => a.page))) + 2

export function IssueViewerTabs({ flipbookSrc, webSrc, issueLabel }: Props) {
  const [tab, setTab] = useState<'flipbook' | 'web'>('flipbook')
  const [anchor, setAnchor] = useState<string | null>(null)

  /* La barre laterale (MagazineNav) demande une section de la web edition */
  useEffect(() => {
    const onNav = (e: Event) => {
      const a = (e as CustomEvent<{ anchor: string }>).detail?.anchor
      if (!a) return
      setTab('web'); setAnchor(a)
    }
    window.addEventListener('aegryn:magazine-navigate', onNav)
    return () => window.removeEventListener('aegryn:magazine-navigate', onNav)
  }, [])

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
          {tab === 'flipbook' ? `${PAGE_COUNT} p. · Print format` : `Full edition · ${ARTICLE_COUNT} articles`}
        </span>
      </div>

      {/* Viewer */}
      {tab === 'flipbook'
        ? <FlipbookViewer htmlSrc={flipbookSrc} title="Aegryn Magazine 01 | Flipbook" />
        : <WebViewer      htmlSrc={webSrc}      anchor={anchor} title="Aegryn Magazine 01 | Web Edition" />
      }
    </div>
  )
}
