'use client'

import { useRef } from 'react'
import { Download, Maximize2 } from 'lucide-react'

interface Props {
  htmlSrc: string   // chemin public vers le fichier HTML (ex: /magazine/issue-01/aegryn-magazine-issue-01_1.html)
  title?:  string
  label?:  string
}

/**
 * Embeds the self-contained HTML magazine viewer in an iframe.
 * The HTML file contains all 60 pages inline + its own JS navigation —
 * no dependencies, no build step, renders identically to the standalone file.
 */
export function HtmlMagazineViewer({ htmlSrc, title = 'Aegryn Magazine', label = 'Issue 01 — Built to Last — January 2027' }: Props) {
  const iframeRef = useRef<HTMLIFrameElement>(null)

  function handleFullscreen() {
    const el = iframeRef.current
    if (!el) return
    if (el.requestFullscreen) el.requestFullscreen()
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
          <a
            href={htmlSrc}
            download={`${title.toLowerCase().replace(/\s+/g, '-')}.html`}
            className="inline-flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-[0.16em]
                       text-magazine-accent border border-magazine-accent/30 px-3 py-1.5
                       hover:bg-magazine-accent hover:text-black transition-colors"
          >
            <Download size={11} /> Download
          </a>
        </div>
      </div>

      {/* ── Iframe viewer ── */}
      <iframe
        ref={iframeRef}
        src={htmlSrc}
        title={title}
        className="w-full border-0"
        style={{ height: 'calc(100vh - 120px)', minHeight: '680px' }}
        sandbox="allow-scripts allow-same-origin"
        loading="eager"
      />

    </div>
  )
}
