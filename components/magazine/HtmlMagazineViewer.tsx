'use client'

import { useRef } from 'react'
import { Download, Maximize2 } from 'lucide-react'

interface Props {
  htmlSrc: string
  title?:  string
  label?:  string
}

export function HtmlMagazineViewer({ htmlSrc, title = 'Aegryn Magazine', label = 'Issue 01 — Built to Last — January 2027' }: Props) {
  const iframeRef = useRef<HTMLIFrameElement>(null)

  function handleFullscreen() {
    const iframe = iframeRef.current
    if (!iframe) return
    const doc = iframe.contentDocument
    if (doc && doc.documentElement.requestFullscreen) {
      doc.documentElement.requestFullscreen().catch(() => {
        if (iframe.requestFullscreen) iframe.requestFullscreen()
      })
    } else if (iframe.requestFullscreen) {
      iframe.requestFullscreen()
    }
  }

  function handleDownloadPdf() {
    const iframe = iframeRef.current
    if (!iframe || !iframe.contentWindow) return
    iframe.contentWindow.print()
  }

  return (
    <div className="flex flex-col bg-magazine-ivory w-full">

      {/* ── Top bar ── */}
      <div className="flex items-center justify-between px-6 md:px-10 py-3 border-b border-magazine-black/10">
        <p className="font-mono text-[9px] tracking-[0.22em] uppercase text-magazine-black/40 select-none">
          {label}
        </p>
        <div className="flex items-center gap-4">
          <button
            onClick={handleFullscreen}
            className="inline-flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-[0.16em]
                       text-magazine-black/40 hover:text-magazine-black transition-colors"
            aria-label="Plein écran"
          >
            <Maximize2 size={11} /> Fullscreen
          </button>
          <button
            onClick={handleDownloadPdf}
            className="inline-flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-[0.16em]
                       text-magazine-accent border border-magazine-accent/30 px-3 py-1.5
                       hover:bg-magazine-accent hover:text-black transition-colors"
            title="Imprimer / Sauvegarder en PDF via le navigateur"
          >
            <Download size={11} /> Download PDF
          </button>
        </div>
      </div>

      {/* ── Iframe viewer ── hauteur suffisante pour voir les 60 pages + thumb strip */}
      <iframe
        ref={iframeRef}
        src={htmlSrc}
        title={title}
        className="w-full border-0"
        style={{ height: 'calc(100vh - 60px)', minHeight: '820px' }}
        sandbox="allow-scripts allow-same-origin allow-modals"
        loading="eager"
      />

    </div>
  )
}
