'use client'

import { Download } from 'lucide-react'

interface MagazineFallbackProps {
  pdfUrl: string
}

/**
 * Shown when page images haven't been generated yet
 * (npm run magazine:generate not run, or Ghostscript unavailable).
 * Renders the PDF directly in an iframe.
 */
export function MagazineFallback({ pdfUrl }: MagazineFallbackProps) {
  return (
    <div className="flex flex-col items-center gap-6 bg-magazine-black min-h-screen py-16 px-4">

      {/* Header */}
      <div className="flex items-center justify-between w-full max-w-5xl">
        <p className="text-label-mag text-magazine-white/30 uppercase tracking-[0.2em]">
          The AEGRYN · Autumn 2026
        </p>
        <a
          href={pdfUrl}
          download="aegryn-report-2026.pdf"
          className="inline-flex items-center gap-2 text-label-mag uppercase tracking-[0.15em]
                     text-magazine-white/50 border border-magazine-white/15 px-4 py-2
                     hover:border-magazine-accent hover:text-magazine-accent transition-colors"
        >
          <Download size={12} /> Télécharger le PDF
        </a>
      </div>

      {/* PDF iframe */}
      <iframe
        src={pdfUrl}
        title="The AEGRYN Report 2026"
        className="w-full max-w-5xl border border-magazine-white/10"
        style={{ height: '85vh' }}
      />

      {/* Note développeur */}
      <p className="text-label-mag text-magazine-white/20 uppercase tracking-[0.1em] text-center max-w-prose">
        Flipbook non disponible — images non générées.
        Lancez <code className="text-magazine-accent">npm run magazine:generate</code> après avoir placé le PDF dans{' '}
        <code className="text-magazine-white/40">public/reports/aegryn-report-2026.pdf</code>.
      </p>

    </div>
  )
}
