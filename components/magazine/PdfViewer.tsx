'use client'

import { useState, useCallback } from 'react'
import { Document, Page, pdfjs } from 'react-pdf'
import 'react-pdf/dist/Page/AnnotationLayer.css'
import 'react-pdf/dist/Page/TextLayer.css'
import {
  ChevronLeft, ChevronRight, Download,
  ZoomIn, ZoomOut, Loader2, AlertTriangle,
} from 'lucide-react'

pdfjs.GlobalWorkerOptions.workerSrc =
  `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`

interface Props {
  src:       string
  fileName?: string
}

const SCALES = [0.7, 0.85, 1, 1.25, 1.5, 2]

export function PdfViewer({ src, fileName = 'the-aegryn-2026.pdf' }: Props) {
  const [numPages, setNumPages] = useState(0)
  const [page,     setPage]     = useState(1)
  const [scaleIdx, setScaleIdx] = useState(2)
  const [loading,  setLoading]  = useState(true)
  const [error,    setError]    = useState(false)

  const scale    = SCALES[scaleIdx]
  const pageWidth = Math.round(900 * scale)

  const onLoadSuccess = useCallback(({ numPages: n }: { numPages: number }) => {
    setNumPages(n)
    setLoading(false)
    setError(false)
  }, [])

  const onLoadError = useCallback(() => {
    setLoading(false)
    setError(true)
  }, [])

  return (
    <div className="flex flex-col bg-magazine-ivory min-h-screen">

      {/* ── Toolbar ── */}
      <div className="sticky top-0 z-10 flex items-center justify-between px-4 md:px-8 py-3
                      bg-magazine-white border-b border-magazine-black/10">

        {/* Pagination */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1 || loading}
            className="text-magazine-black/40 hover:text-magazine-black disabled:opacity-20 transition-colors"
            aria-label="Page précédente"
          >
            <ChevronLeft size={18} />
          </button>
          <span className="text-label-mag uppercase tracking-[0.1em] text-magazine-black/60 tabular-nums w-20 text-center">
            {loading ? '—' : `${page} / ${numPages}`}
          </span>
          <button
            onClick={() => setPage(p => Math.min(numPages, p + 1))}
            disabled={page === numPages || loading}
            className="text-magazine-black/40 hover:text-magazine-black disabled:opacity-20 transition-colors"
            aria-label="Page suivante"
          >
            <ChevronRight size={18} />
          </button>
        </div>

        {/* Centre — titre */}
        <p className="hidden md:block text-label-mag uppercase tracking-[0.15em] text-magazine-black/40 select-none">
          The AEGRYN · 2026
        </p>

        {/* Zoom + download */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setScaleIdx(i => Math.max(0, i - 1))}
            disabled={scaleIdx === 0}
            className="text-magazine-black/40 hover:text-magazine-black disabled:opacity-20 transition-colors"
            aria-label="Réduire"
          >
            <ZoomOut size={16} />
          </button>
          <span className="text-label-mag text-magazine-black/40 tabular-nums w-10 text-center">
            {Math.round(scale * 100)}%
          </span>
          <button
            onClick={() => setScaleIdx(i => Math.min(SCALES.length - 1, i + 1))}
            disabled={scaleIdx === SCALES.length - 1}
            className="text-magazine-black/40 hover:text-magazine-black disabled:opacity-20 transition-colors"
            aria-label="Agrandir"
          >
            <ZoomIn size={16} />
          </button>
          <div className="w-px h-4 bg-magazine-black/10 mx-1" />
          <a
            href={src}
            download={fileName}
            className="inline-flex items-center gap-1.5 text-label-mag uppercase tracking-[0.1em]
                       text-magazine-black/60 hover:text-magazine-black transition-colors"
          >
            <Download size={14} />
            <span className="hidden sm:inline">PDF</span>
          </a>
        </div>
      </div>

      {/* ── Document zone ── */}
      <div className="flex-1 flex flex-col items-center py-10 px-4 overflow-x-auto">
        {loading && !error && (
          <div className="flex items-center gap-3 text-magazine-black/40 mt-20">
            <Loader2 size={18} className="animate-spin" />
            <span className="text-label-mag uppercase tracking-[0.1em]">Chargement…</span>
          </div>
        )}

        {error && (
          <div className="flex flex-col items-center gap-4 mt-20 text-center">
            <AlertTriangle size={24} className="text-magazine-black/30" />
            <p className="text-body-mag text-magazine-black/50">
              Le PDF n&apos;est pas encore disponible.
            </p>
            <p className="text-label-mag text-magazine-black/30 uppercase tracking-[0.1em]">
              Publication prévue — Automne 2026
            </p>
          </div>
        )}

        {!error && (
          <Document
            file={src}
            onLoadSuccess={onLoadSuccess}
            onLoadError={onLoadError}
            loading={null}
            className="shadow-[0_4px_40px_rgba(0,0,0,0.12)]"
          >
            <Page
              pageNumber={page}
              width={pageWidth}
              renderTextLayer={false}
              renderAnnotationLayer={false}
            />
          </Document>
        )}

        {/* Pagination bottom */}
        {numPages > 1 && !loading && !error && (
          <div className="flex items-center gap-6 mt-8">
            <button
              onClick={() => { setPage(p => Math.max(1, p - 1)); window.scrollTo({ top: 0 }) }}
              disabled={page === 1}
              className="inline-flex items-center gap-2 text-label-mag uppercase tracking-[0.1em]
                         text-magazine-black/50 hover:text-magazine-black disabled:opacity-20 transition-colors"
            >
              <ChevronLeft size={14} /> Précédent
            </button>
            <span className="text-label-mag text-magazine-black/30 tabular-nums">
              {page} / {numPages}
            </span>
            <button
              onClick={() => { setPage(p => Math.min(numPages, p + 1)); window.scrollTo({ top: 0 }) }}
              disabled={page === numPages}
              className="inline-flex items-center gap-2 text-label-mag uppercase tracking-[0.1em]
                         text-magazine-black/50 hover:text-magazine-black disabled:opacity-20 transition-colors"
            >
              Suivant <ChevronRight size={14} />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
