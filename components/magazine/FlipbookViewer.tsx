'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { ChevronLeft, ChevronRight, Maximize2, Minimize2, Download } from 'lucide-react'

interface Props {
  htmlSrc: string
  title?:  string
  label?:  string
}

const TOTAL_SPREADS = 30 // 60 pages = 30 spreads

/**
 * FlipbookViewer — charge le HTML du magazine, extrait les 60 pages
 * et les affiche directement en React (sans iframe).
 * Flip 3D natif CSS via animation rotateY depuis la reliure centrale.
 */
export function FlipbookViewer({ htmlSrc, title = 'Aegryn Magazine', label = 'Issue 01 — Built to Last — January 2027' }: Props) {
  const [pages, setPages]         = useState<string[]>([])  // 60 pages HTML
  const [spread, setSpread]       = useState(0)              // spread courant (0-29)
  const [flipping, setFlipping]   = useState(false)
  const [flipDir, setFlipDir]     = useState<'next'|'prev'|null>(null)
  const [isFullscreen, setIsFullscreen]   = useState(false)
  const wrapRef = useRef<HTMLDivElement>(null)

  /* ── Charger et extraire les 60 pages du HTML ── */
  useEffect(() => {
    fetch(htmlSrc)
      .then(r => r.text())
      .then(html => {
        const parser = new DOMParser()
        const doc    = parser.parseFromString(html, 'text/html')
        const source = doc.getElementById('pg-source')
        if (!source) return
        const extracted: string[] = []
        for (let i = 1; i <= 60; i++) {
          const el = source.querySelector(`#p${i}`)
          extracted.push(el ? el.innerHTML : '<div style="width:420px;height:595px;background:#F4F3F0"></div>')
        }
        setPages(extracted)
      })
  }, [htmlSrc])

  /* ── Navigation ── */
  const goTo = useCallback((target: number, dir: 'next'|'prev') => {
    if (flipping || pages.length === 0) return
    if (target < 0 || target >= TOTAL_SPREADS) return
    setFlipDir(dir)
    setFlipping(true)
    setTimeout(() => {
      setSpread(target)
      setFlipDir(null)
      setFlipping(false)
    }, 600)
  }, [flipping, pages.length])

  const next = useCallback(() => goTo(spread + 1, 'next'), [spread, goTo])
  const prev = useCallback(() => goTo(spread - 1, 'prev'), [spread, goTo])

  /* ── Clavier ── */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') next()
      if (e.key === 'ArrowLeft')  prev()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [next, prev])

  /* ── Fullscreen ── */
  function toggleFullscreen() {
    const el = wrapRef.current
    if (!el) return
    if (!document.fullscreenElement) {
      el.requestFullscreen().then(() => setIsFullscreen(true))
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false))
    }
  }

  useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement)
    document.addEventListener('fullscreenchange', handler)
    return () => document.removeEventListener('fullscreenchange', handler)
  }, [])

  /* ── Download PDF (print dialog) ── */
  function handleDownload() {
    window.open(htmlSrc, '_blank')
  }

  /* ── Pages affichées ── */
  const leftIdx  = spread * 2      // index 0-based dans pages[]
  const rightIdx = spread * 2 + 1

  const leftPage  = pages[leftIdx]  ?? ''
  const rightPage = pages[rightIdx] ?? ''

  /* Pour le flip : page qui tourne */
  const flipTargetSpread = flipDir === 'next' ? spread + 1 : spread - 1
  const flipFront = flipDir === 'next' ? rightPage : leftPage
  const flipBack  = flipDir === 'next'
    ? (pages[flipTargetSpread * 2] ?? '')
    : (pages[flipTargetSpread * 2 + 1] ?? '')

  if (pages.length === 0) {
    return (
      <div className="flex items-center justify-center bg-magazine-ivory" style={{ height: '680px' }}>
        <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-magazine-black/30">Chargement…</p>
      </div>
    )
  }

  return (
    <div
      ref={wrapRef}
      className="flex flex-col items-center bg-[#F4F3F0] w-full select-none"
      style={{ padding: '24px 0 40px', fontFamily: "'Plus Jakarta Sans', sans-serif" }}
    >
      {/* ── CSS flip injecté ── */}
      <style>{`
        :root{--G:#2EAF7D}
        .fb-book{
          width:840px;height:595px;display:flex;position:relative;
          box-shadow:0 20px 60px rgba(0,0,0,.18);
          transform-style:preserve-3d;
        }
        .fb-page{width:420px;height:595px;overflow:hidden;flex-shrink:0;position:relative;background:#F4F3F0}
        .fb-page-left{border-right:1px solid rgba(0,0,0,.08)}
        .fb-spine{position:absolute;left:418px;top:0;width:4px;height:595px;
          background:linear-gradient(to right,rgba(0,0,0,.2),rgba(0,0,0,.03));z-index:10;pointer-events:none}
        /* Page qui tourne */
        .fb-flip{
          position:absolute;top:0;width:420px;height:595px;
          transform-style:preserve-3d;z-index:20;pointer-events:none;
        }
        .fb-flip-next{left:420px;transform-origin:left center;animation:fbFlipNext .6s cubic-bezier(.45,.02,.32,1) forwards}
        .fb-flip-prev{left:0;transform-origin:right center;animation:fbFlipPrev .6s cubic-bezier(.45,.02,.32,1) forwards}
        .fb-face,.fb-back{
          position:absolute;inset:0;width:420px;height:595px;
          overflow:hidden;backface-visibility:hidden;
        }
        .fb-back{transform:rotateY(180deg) scaleX(-1)}
        @keyframes fbFlipNext{0%{transform:rotateY(0deg)}100%{transform:rotateY(-180deg)}}
        @keyframes fbFlipPrev{0%{transform:rotateY(0deg)}100%{transform:rotateY(180deg)}}
        /* Ombre flip */
        .fb-shadow-l{position:absolute;inset:0;z-index:5;pointer-events:none;
          background:linear-gradient(to left,rgba(0,0,0,.25),transparent 70%);
          animation:fbFadeShad .6s ease forwards}
        .fb-shadow-r{position:absolute;inset:0;z-index:5;pointer-events:none;
          background:linear-gradient(to right,rgba(0,0,0,.25),transparent 70%);
          animation:fbFadeShad .6s ease forwards}
        @keyframes fbFadeShad{0%{opacity:0}30%{opacity:1}100%{opacity:0}}
        /* Thumb strip */
        .fb-thumb-strip{display:flex;gap:5px;max-width:840px;overflow-x:auto;padding-bottom:4px;scrollbar-width:none}
        .fb-thumb-strip::-webkit-scrollbar{display:none}
        .fb-thumb{width:40px;height:57px;border:1px solid rgba(0,0,0,.12);cursor:pointer;
          flex-shrink:0;overflow:hidden;opacity:.35;transition:opacity .2s}
        .fb-thumb:hover,.fb-thumb.active{opacity:1;border-color:var(--G)}
        .fb-thumb-inner{transform:scale(.095);transform-origin:top left;width:420px;height:595px;pointer-events:none}
        /* Fullscreen */
        :fullscreen .fb-book{width:calc(100vw - 120px);height:calc(100vh - 120px)}
        :fullscreen .fb-page{width:50%;height:100%}
      `}</style>

      {/* ── Label ── */}
      <p style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '.2em', textTransform: 'uppercase', opacity: .35, marginBottom: '16px' }}>
        {label}
      </p>

      {/* ── Viewer ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 0, perspective: '3000px', perspectiveOrigin: '50% 48%' }}>
        {/* Prev */}
        <button
          onClick={prev}
          disabled={spread === 0 || flipping}
          style={{ background: 'none', border: 'none', fontSize: '48px', cursor: 'pointer', padding: '0 16px', opacity: spread === 0 ? .12 : .35, transition: 'opacity .2s', lineHeight: 1 }}
          onMouseEnter={e => { if (spread > 0) (e.target as HTMLElement).style.opacity = '.8' }}
          onMouseLeave={e => { (e.target as HTMLElement).style.opacity = spread === 0 ? '.12' : '.35' }}
        >‹</button>

        {/* Book */}
        <div className="fb-book">
          {/* Page gauche */}
          <div className="fb-page fb-page-left" dangerouslySetInnerHTML={{ __html: leftPage }} />
          {/* Reliure */}
          <div className="fb-spine" />
          {/* Page droite */}
          <div className="fb-page" dangerouslySetInnerHTML={{ __html: rightPage }} />

          {/* Flip animé */}
          {flipping && flipDir && (
            <div className={`fb-flip fb-flip-${flipDir}`}>
              <div className="fb-face" dangerouslySetInnerHTML={{ __html: flipFront }} />
              <div className="fb-back"  dangerouslySetInnerHTML={{ __html: flipBack  }} />
            </div>
          )}

          {/* Ombre sur page fixe */}
          {flipping && flipDir === 'next' && <div className="fb-shadow-l" style={{ position: 'absolute', left: 0, top: 0, width: '420px', height: '595px', zIndex: 4, pointerEvents: 'none', background: 'linear-gradient(to left,rgba(0,0,0,.2),transparent 70%)', animation: 'fbFadeShad .6s ease forwards' }} />}
          {flipping && flipDir === 'prev' && <div className="fb-shadow-r" style={{ position: 'absolute', left: '420px', top: 0, width: '420px', height: '595px', zIndex: 4, pointerEvents: 'none', background: 'linear-gradient(to right,rgba(0,0,0,.2),transparent 70%)', animation: 'fbFadeShad .6s ease forwards' }} />}
        </div>

        {/* Next */}
        <button
          onClick={next}
          disabled={spread === TOTAL_SPREADS - 1 || flipping}
          style={{ background: 'none', border: 'none', fontSize: '48px', cursor: 'pointer', padding: '0 16px', opacity: spread === TOTAL_SPREADS - 1 ? .12 : .35, transition: 'opacity .2s', lineHeight: 1 }}
          onMouseEnter={e => { if (spread < TOTAL_SPREADS - 1) (e.target as HTMLElement).style.opacity = '.8' }}
          onMouseLeave={e => { (e.target as HTMLElement).style.opacity = spread === TOTAL_SPREADS - 1 ? '.12' : '.35' }}
        >›</button>
      </div>

      {/* ── Contrôles ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '24px', marginTop: '16px' }}>
        <span style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '.18em', textTransform: 'uppercase', opacity: .35, minWidth: '120px', textAlign: 'center' }}>
          {spread * 2 + 1} — {spread * 2 + 2} / 60
        </span>
        <div style={{ width: '280px', height: '1px', background: 'rgba(0,0,0,.1)' }}>
          <div style={{ height: '100%', background: '#2EAF7D', width: `${((spread + 1) / TOTAL_SPREADS) * 100}%`, transition: 'width .3s' }} />
        </div>
        <button onClick={toggleFullscreen} title="Plein écran" style={{ background: 'none', border: 'none', cursor: 'pointer', opacity: .35, display: 'flex', alignItems: 'center', gap: '6px', fontSize: '9px', letterSpacing: '.16em', textTransform: 'uppercase' }}>
          {isFullscreen ? <Minimize2 size={13} /> : <Maximize2 size={13} />}
        </button>
        <button onClick={handleDownload} title="Ouvrir en plein écran pour télécharger en PDF" style={{ background: 'none', border: '1px solid rgba(46,175,125,.4)', color: '#2EAF7D', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '9px', letterSpacing: '.16em', textTransform: 'uppercase', padding: '5px 12px' }}>
          <Download size={11} /> Download PDF
        </button>
      </div>

      {/* ── Thumb strip ── */}
      <div className="fb-thumb-strip" style={{ marginTop: '14px' }}>
        {Array.from({ length: TOTAL_SPREADS }, (_, i) => (
          <div
            key={i}
            className={`fb-thumb${i === spread ? ' active' : ''}`}
            onClick={() => {
              if (!flipping && i !== spread) goTo(i, i > spread ? 'next' : 'prev')
            }}
          >
            <div className="fb-thumb-inner" dangerouslySetInnerHTML={{ __html: pages[i * 2] ?? '' }} />
          </div>
        ))}
      </div>
    </div>
  )
}
