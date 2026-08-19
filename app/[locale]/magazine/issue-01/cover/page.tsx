/**
 * /magazine/issue-01/cover
 * Preview + download page for the Issue 01 PDF cover.
 *
 * — Server component (SSR metadata)
 * — The actual PDF is streamed from /api/magazine/issue-01/cover
 * — Preview via <iframe> (browser native PDF viewer)
 * — Download button triggers the API route
 */

import type { Metadata }    from 'next'
import Link                 from 'next/link'
import { ArrowLeft, Download, ExternalLink } from 'lucide-react'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  return {
    title:       'Cover Preview — Aegryn Magazine Issue 01',
    description: 'Preview and download the cover of Aegryn Magazine Issue 01 — The State of European Tech M&A',
    robots:      { index: false, follow: false },
    alternates:  { canonical: `/${locale}/magazine/issue-01/cover` },
  }
}

export const PDF_URL = '/api/magazine/issue-01/cover'

export default async function IssueCoverPage({ params }: Props) {
  const { locale } = await params

  return (
    <div className="min-h-screen bg-magazine-black flex flex-col">

      {/* ── Top bar ── */}
      <div className="sticky top-0 z-20 bg-magazine-black border-b border-white/8
                      flex items-center justify-between px-6 md:px-12 py-4">
        <Link
          href={`/${locale}/magazine/issue-01`}
          className="inline-flex items-center gap-2 text-label-mag uppercase tracking-[0.12em]
                     text-white/40 hover:text-white transition-colors"
        >
          <ArrowLeft size={13} /> Back to Issue
        </Link>

        <p className="hidden md:block font-mono text-[10px] tracking-[0.20em] uppercase text-white/25 select-none">
          Aegryn Magazine · Issue 01 · Cover
        </p>

        <div className="flex items-center gap-4">
          {/* Open in new tab */}
          <a
            href={PDF_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-label-mag uppercase tracking-[0.1em]
                       text-white/40 hover:text-white transition-colors"
          >
            <ExternalLink size={13} />
            <span className="hidden sm:inline">Open</span>
          </a>

          {/* Download */}
          <a
            href={PDF_URL}
            download="aegryn-magazine-issue-01-cover.pdf"
            className="inline-flex items-center gap-2 bg-magazine-accent text-magazine-black
                       font-mono text-[10px] uppercase tracking-[0.18em] px-5 py-2.5
                       hover:bg-magazine-accent/90 transition-colors font-semibold"
          >
            <Download size={13} /> Download PDF
          </a>
        </div>
      </div>

      {/* ── Notice ── */}
      <div className="border-b border-white/6 bg-white/[0.02] px-6 md:px-12 py-3
                      flex items-center justify-between gap-4">
        <p className="font-mono text-[9px] tracking-[0.18em] uppercase text-white/25">
          Proposal — cover image placeholder to be replaced
        </p>
        <p className="font-mono text-[9px] tracking-[0.18em] uppercase text-magazine-accent/60">
          A4 Portrait · 210 × 297 mm
        </p>
      </div>

      {/* ── PDF preview (iframe) ── */}
      <div className="flex-1 flex flex-col items-center justify-start py-8 px-4">
        <div className="w-full max-w-[700px] shadow-[0_8px_60px_rgba(0,0,0,0.6)]">
          <iframe
            src={PDF_URL}
            title="Aegryn Magazine Issue 01 — Cover Preview"
            className="w-full border-0 bg-magazine-black"
            style={{ height: 'calc(100vh - 160px)', minHeight: 600 }}
          />
        </div>

        {/* Meta line */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-6">
          {[
            ['Issue',      'N°01'],
            ['Title',      'The State of European Tech M&A'],
            ['Published',  'January 2027'],
            ['Format',     'A4 · Digital + Print'],
          ].map(([label, val]) => (
            <div key={label} className="text-center">
              <p className="font-mono text-[8px] tracking-[0.22em] uppercase text-white/20 mb-1">
                {label}
              </p>
              <p className="font-mono text-[10px] tracking-[0.12em] text-white/50">{val}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}
