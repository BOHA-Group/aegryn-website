'use client'

import { useRef, useState } from 'react'
import HTMLFlipBook          from 'react-pageflip'
import { ArrowLeft, ArrowRight, Download } from 'lucide-react'

/* ── Types ──────────────────────────────────────────────── */
interface MagazineViewerProps {
  totalPages: number
  pdfUrl:     string
}

const SECTIONS = [
  { label: 'Cover',        page: 0  },
  { label: 'Editorial',    page: 2  },
  { label: 'The Market',   page: 4  },
  { label: 'AI Effect',    page: 6  },
  { label: 'Perspective',  page: 8  },
  { label: 'Deal Watch',   page: 10 },
  { label: '2027 Outlook', page: 14 },
  { label: 'Index',        page: 16 },
] as const

/* ── Page component (required by react-pageflip) ─────────── */
function MagazinePage({ src, num }: { src: string; num: number }) {
  return (
    <div className="bg-white overflow-hidden w-full h-full">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={`Page ${num}`}
        className="w-full h-full object-cover"
        loading={num <= 6 ? 'eager' : 'lazy'}
        onError={(e) => {
          ;(e.currentTarget as HTMLImageElement).style.visibility = 'hidden'
        }}
      />
    </div>
  )
}

/* ── Main viewer ────────────────────────────────────────── */
export function MagazineViewer({ totalPages, pdfUrl }: MagazineViewerProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const bookRef      = useRef<any>(null)
  const [current, setCurrent] = useState(0)

  const flip = bookRef.current?.pageFlip()

  const pages = Array.from({ length: totalPages }, (_, i) => {
    const num = String(i + 1).padStart(4, '0')
    return `/reports/2026/pages/page.${num}.jpg`
  })

  return (
    <div className="flex flex-col items-center gap-8 bg-magazine-black min-h-screen py-16 px-4">

      {/* ── Header ── */}
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
          <Download size={12} /> PDF
        </a>
      </div>

      {/* ── Flipbook ── */}
      <HTMLFlipBook
        ref={bookRef}
        width={550}
        height={778}
        size="stretch"
        minWidth={280}
        maxWidth={880}
        minHeight={400}
        maxHeight={1200}
        showCover={true}
        mobileScrollSupport={true}
        onFlip={(e) => setCurrent(e.data as number)}
        className=""
        style={{}}
        startPage={0}
        drawShadow={true}
        flippingTime={650}
        usePortrait={false}
        startZIndex={0}
        autoSize={true}
        maxShadowOpacity={0.4}
        showPageCorners={true}
        disableFlipByClick={false}
        clickEventForward={true}
        useMouseEvents={true}
        swipeDistance={30}
      >
        {pages.map((src, i) => (
          <MagazinePage key={src} src={src} num={i + 1} />
        ))}
      </HTMLFlipBook>

      {/* ── Pagination controls ── */}
      <div className="flex items-center gap-8">
        <button
          onClick={() => flip?.flipPrev()}
          disabled={current === 0}
          aria-label="Page précédente"
          className="text-magazine-white/50 hover:text-magazine-white
                     disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
        >
          <ArrowLeft size={18} />
        </button>

        <span className="text-label-mag text-magazine-white/30 uppercase tracking-[0.18em] tabular-nums w-24 text-center">
          {current + 1} / {totalPages}
        </span>

        <button
          onClick={() => flip?.flipNext()}
          disabled={current >= totalPages - 1}
          aria-label="Page suivante"
          className="text-magazine-white/50 hover:text-magazine-white
                     disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
        >
          <ArrowRight size={18} />
        </button>
      </div>

      {/* ── Section jump nav ── */}
      <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2 max-w-3xl">
        {SECTIONS.map((s) => (
          <button
            key={s.label}
            onClick={() => flip?.flip(s.page)}
            className={`text-label-mag uppercase tracking-[0.14em] transition-colors ${
              current >= s.page && current < (s.page + 2)
                ? 'text-magazine-accent'
                : 'text-magazine-white/25 hover:text-magazine-white/60'
            }`}
          >
            {s.label}
          </button>
        ))}
      </nav>

    </div>
  )
}
