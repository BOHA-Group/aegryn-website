'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { ChevronLeft, ChevronRight, Maximize2, Minimize2, Download, ZoomIn, ZoomOut, BookOpen } from 'lucide-react'

interface Props {
  htmlSrc:   string
  title?:    string
  label?:    string
  baseAsset?: string  // ex: /magazine/issue-01/ — pour réécrire les URLs relatives
}

const TOTAL_SPREADS = 30 // 60 pages = 30 spreads
const PAGE_W = 420
const PAGE_H = 595

/**
 * FlipbookViewer — style Barnes Publications.
 * Fond sombre, toolbar bas, sidebar miniatures, flip 3D CSS physique,
 * zoom, fullscreen natif. Sans iframe, sans sandbox.
 * Charge le HTML, extrait les 60 pages, réécrit les URLs relatives.
 */
export function FlipbookViewer({
  htmlSrc,
  title   = 'Aegryn Magazine',
  label   = 'Issue 01 — Built to Last — January 2027',
  baseAsset = '/magazine/issue-01/',
}: Props) {
  const [pages, setPages]               = useState<string[]>([])
  const [spread, setSpread]             = useState(0)
  const [flipping, setFlipping]         = useState(false)
  const [flipDir, setFlipDir]           = useState<'next'|'prev'|null>(null)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [zoom, setZoom]                 = useState(1)
  const [showSidebar, setShowSidebar]   = useState(false)
  const wrapRef     = useRef<HTMLDivElement>(null)
  const bookWrapRef = useRef<HTMLDivElement>(null)

  /* ── Rebase URLs relatives → absolues ── */
  function rebaseHtml(raw: string): string {
    return raw
      .replace(/url\((?!['"]?(?:https?:|data:|\/))(['"]?)([^)'"]+)\1\)/g,
        (_, q, p) => `url(${q}${baseAsset}${p}${q})`)
      .replace(/src=(['"])(?!https?:|data:|\/)/g,
        (_, q) => `src=${q}${baseAsset}`)
  }

  /* ── Charger et extraire les 60 pages ── */
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
          extracted.push(el ? rebaseHtml(el.innerHTML) : `<div style="width:${PAGE_W}px;height:${PAGE_H}px;background:#F4F3F0"></div>`)
        }
        setPages(extracted)
      })
  // eslint-disable-next-line react-hooks/exhaustive-deps
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
    }, 650)
  }, [flipping, pages.length])

  const next = useCallback(() => goTo(spread + 1, 'next'), [spread, goTo])
  const prev = useCallback(() => goTo(spread - 1, 'prev'), [spread, goTo])

  /* ── Clavier ── */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') next()
      if (e.key === 'ArrowLeft')  prev()
      if (e.key === 'Escape' && document.fullscreenElement) document.exitFullscreen()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [next, prev])

  /* ── Fullscreen ── */
  function toggleFullscreen() {
    const el = wrapRef.current
    if (!el) return
    if (!document.fullscreenElement) {
      el.requestFullscreen()
    } else {
      document.exitFullscreen()
    }
  }

  useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement)
    document.addEventListener('fullscreenchange', handler)
    return () => document.removeEventListener('fullscreenchange', handler)
  }, [])

  /* ── Zoom ── */
  function zoomIn()  { setZoom(z => Math.min(z + 0.25, 2)) }
  function zoomOut() { setZoom(z => Math.max(z - 0.25, 0.5)) }
  function zoomReset() { setZoom(1) }

  /* ── Download ── */
  function handleDownload() { window.open(htmlSrc, '_blank') }

  /* ── Pages courantes ── */
  const lp = pages[spread * 2]       ?? ''
  const rp = pages[spread * 2 + 1]   ?? ''

  /* ── Page animée ── */
  const ts  = flipDir === 'next' ? spread + 1 : spread - 1
  const frt = flipDir === 'next' ? rp : lp
  const bck = flipDir === 'next' ? (pages[ts * 2] ?? '') : (pages[ts * 2 + 1] ?? '')

  if (pages.length === 0) {
    return (
      <div style={{ display:'flex', alignItems:'center', justifyContent:'center',
        background:'#1a1a1a', height:'680px', color:'rgba(255,255,255,.3)',
        fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:'11px',
        letterSpacing:'.2em', textTransform:'uppercase' }}>
        Loading…
      </div>
    )
  }

  const TOOLBAR_H = 52

  return (
    <div
      ref={wrapRef}
      style={{ display:'flex', flexDirection:'column', background:'#1a1a1a',
        width:'100%', minHeight:'720px', position:'relative',
        fontFamily:"'Plus Jakarta Sans',sans-serif", userSelect:'none' }}
    >
      {/* ═══════════════════════════════════════
          CSS GLOBAL DU VIEWER (injecté une fois)
      ════════════════════════════════════════ */}
      <style>{`
        .fb-viewer-area{
          flex:1;display:flex;align-items:center;justify-content:center;
          padding:32px 20px;overflow:auto;
          background:radial-gradient(ellipse at 50% 40%,#2a2a2a 0%,#1a1a1a 70%);
        }
        :fullscreen .fb-viewer-area{min-height:calc(100vh - ${TOOLBAR_H}px)}
        /* Book */
        .fb-book-outer{
          position:relative;
          perspective:2800px;perspective-origin:50% 46%;
          transition:transform .3s ease;
        }
        .fb-book{
          display:flex;position:relative;
          box-shadow:0 32px 80px rgba(0,0,0,.7),0 8px 20px rgba(0,0,0,.5);
          transform-style:preserve-3d;
        }
        /* Gradient de courbure page gauche et droite */
        .fb-book::before{
          content:'';position:absolute;top:0;left:0;width:80px;height:100%;
          background:linear-gradient(to right,rgba(0,0,0,.22),transparent);
          z-index:8;pointer-events:none;
        }
        .fb-book::after{
          content:'';position:absolute;top:0;right:0;width:80px;height:100%;
          background:linear-gradient(to left,rgba(0,0,0,.22),transparent);
          z-index:8;pointer-events:none;
        }
        /* Pages */
        .fb-page{overflow:hidden;flex-shrink:0;position:relative;background:#F4F3F0}
        .fb-page-l{border-right:1px solid rgba(0,0,0,.12)}
        /* Reliure */
        .fb-spine{
          position:absolute;top:0;width:6px;height:100%;z-index:10;pointer-events:none;
          background:linear-gradient(to right,rgba(0,0,0,.35),rgba(0,0,0,.1) 40%,rgba(0,0,0,.2) 60%,rgba(0,0,0,.35));
        }
        /* ── Flip ── */
        .fb-flip{position:absolute;top:0;transform-style:preserve-3d;z-index:20;pointer-events:none}
        .fb-flip-next{right:0;transform-origin:left center;animation:fbNext .65s cubic-bezier(.42,0,.28,1) forwards}
        .fb-flip-prev{left:0;transform-origin:right center;animation:fbPrev .65s cubic-bezier(.42,0,.28,1) forwards}
        .fb-face,.fb-back{
          position:absolute;inset:0;overflow:hidden;
          backface-visibility:hidden;
        }
        /* Courbe de page flip : gradient simulant la courbure */
        .fb-face::after,.fb-back::after{
          content:'';position:absolute;inset:0;pointer-events:none;
          background:linear-gradient(to right,rgba(0,0,0,.0),rgba(0,0,0,.18) 40%,rgba(0,0,0,.32));
          animation:fbCurve .65s ease forwards;
        }
        .fb-back{transform:rotateY(180deg) scaleX(-1)}
        @keyframes fbNext{0%{transform:rotateY(0)}100%{transform:rotateY(-180deg)}}
        @keyframes fbPrev{0%{transform:rotateY(0)}100%{transform:rotateY(180deg)}}
        @keyframes fbCurve{0%{opacity:0}40%{opacity:1}100%{opacity:0}}
        /* Ombres flip sur pages fixes */
        .fb-sh-l,.fb-sh-r{
          position:absolute;top:0;height:100%;z-index:6;pointer-events:none;
          animation:fbShadow .65s ease forwards;
        }
        .fb-sh-l{left:0;background:linear-gradient(to left,rgba(0,0,0,.3),transparent 70%)}
        .fb-sh-r{right:0;background:linear-gradient(to right,rgba(0,0,0,.3),transparent 70%)}
        @keyframes fbShadow{0%{opacity:0}35%{opacity:1}100%{opacity:0}}
        /* ── Toolbar bas (style Barnes) ── */
        .fb-toolbar{
          height:${TOOLBAR_H}px;background:#111;
          border-top:1px solid rgba(255,255,255,.06);
          display:flex;align-items:center;justify-content:space-between;
          padding:0 20px;flex-shrink:0;
        }
        .fb-tb-btn{
          background:none;border:none;color:rgba(255,255,255,.5);cursor:pointer;
          display:flex;align-items:center;gap:6px;
          font-size:10px;font-weight:600;letter-spacing:.14em;text-transform:uppercase;
          padding:6px 10px;border-radius:2px;transition:color .15s,background .15s;
        }
        .fb-tb-btn:hover{color:#fff;background:rgba(255,255,255,.07)}
        .fb-tb-btn:disabled{opacity:.2;cursor:default;pointer-events:none}
        .fb-tb-btn.active{color:#2EAF7D}
        .fb-pg-ctr{
          font-size:10px;font-weight:600;letter-spacing:.16em;text-transform:uppercase;
          color:rgba(255,255,255,.35);min-width:100px;text-align:center;
        }
        .fb-progress{
          width:180px;height:1px;background:rgba(255,255,255,.1);
          position:relative;cursor:pointer;
        }
        .fb-progress-fill{height:100%;background:#2EAF7D;transition:width .3s}
        /* ── Sidebar miniatures (style Barnes) ── */
        .fb-sidebar{
          width:120px;flex-shrink:0;background:#111;border-left:1px solid rgba(255,255,255,.06);
          display:flex;flex-direction:column;overflow-y:auto;padding:12px 8px;gap:6px;
          scrollbar-width:thin;scrollbar-color:rgba(255,255,255,.1) transparent;
        }
        .fb-sidebar::-webkit-scrollbar{width:3px}
        .fb-sidebar::-webkit-scrollbar-thumb{background:rgba(255,255,255,.1);border-radius:2px}
        .fb-sth{
          flex-shrink:0;cursor:pointer;border:1px solid rgba(255,255,255,.08);
          overflow:hidden;opacity:.4;transition:opacity .2s,border-color .2s;
          position:relative;
        }
        .fb-sth:hover{opacity:.75;border-color:rgba(255,255,255,.2)}
        .fb-sth.active{opacity:1;border-color:#2EAF7D}
        .fb-sth-inner{transform-origin:top left;width:${PAGE_W}px;height:${PAGE_H}px;pointer-events:none}
        .fb-sth-num{
          position:absolute;bottom:2px;left:0;right:0;text-align:center;
          font-size:7px;font-weight:600;letter-spacing:.1em;color:rgba(255,255,255,.4);
        }
        /* Fullscreen */
        :fullscreen{background:#1a1a1a}
      `}</style>

      {/* ═══════════════════════════════════
          ZONE PRINCIPALE : viewer + sidebar
      ════════════════════════════════════ */}
      <div style={{ flex:1, display:'flex', overflow:'hidden' }}>

        {/* ── Viewer ── */}
        <div className="fb-viewer-area">
          {/* Flèche gauche */}
          <button
            onClick={prev} disabled={spread === 0 || flipping}
            className="fb-tb-btn" style={{ fontSize:'32px', padding:'0 12px', lineHeight:1 }}
          >‹</button>

          {/* Book */}
          <div ref={bookWrapRef} className="fb-book-outer"
            style={{ transform:`scale(${zoom})`, transformOrigin:'center center' }}>
            <div className="fb-book" style={{ width: PAGE_W * 2, height: PAGE_H }}>

              {/* Page gauche */}
              <div className="fb-page fb-page-l"
                style={{ width: PAGE_W, height: PAGE_H }}
                dangerouslySetInnerHTML={{ __html: lp }} />

              {/* Reliure */}
              <div className="fb-spine" style={{ left: PAGE_W - 3 }} />

              {/* Page droite */}
              <div className="fb-page"
                style={{ width: PAGE_W, height: PAGE_H }}
                dangerouslySetInnerHTML={{ __html: rp }} />

              {/* ── Page qui tourne ── */}
              {flipping && flipDir && (
                <>
                  <div
                    className={`fb-flip fb-flip-${flipDir}`}
                    style={{ width: PAGE_W, height: PAGE_H }}
                  >
                    <div className="fb-face" style={{ width: PAGE_W, height: PAGE_H }}
                      dangerouslySetInnerHTML={{ __html: frt }} />
                    <div className="fb-back" style={{ width: PAGE_W, height: PAGE_H }}
                      dangerouslySetInnerHTML={{ __html: bck }} />
                  </div>
                  {/* Ombre sur la page fixe */}
                  {flipDir === 'next'
                    ? <div className="fb-sh-l" style={{ width: PAGE_W }} />
                    : <div className="fb-sh-r" style={{ width: PAGE_W, left: PAGE_W }} />}
                </>
              )}
            </div>
          </div>

          {/* Flèche droite */}
          <button
            onClick={next} disabled={spread === TOTAL_SPREADS - 1 || flipping}
            className="fb-tb-btn" style={{ fontSize:'32px', padding:'0 12px', lineHeight:1 }}
          >›</button>
        </div>

        {/* ── Sidebar miniatures ── */}
        {showSidebar && (
          <div className="fb-sidebar">
            {Array.from({ length: TOTAL_SPREADS }, (_, i) => {
              const SCALE = 0.236 // 420 * 0.236 ≈ 99px width
              return (
                <div
                  key={i}
                  className={`fb-sth${i === spread ? ' active' : ''}`}
                  style={{ height: Math.round(PAGE_H * SCALE) }}
                  onClick={() => { if (!flipping && i !== spread) goTo(i, i > spread ? 'next' : 'prev') }}
                >
                  <div className="fb-sth-inner" style={{ transform:`scale(${SCALE})` }}
                    dangerouslySetInnerHTML={{ __html: pages[i * 2] ?? '' }} />
                  <span className="fb-sth-num">{i * 2 + 1}–{i * 2 + 2}</span>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* ═══════════════════════════════
          TOOLBAR BAS — style Barnes
      ════════════════════════════════ */}
      <div className="fb-toolbar">
        {/* Groupe gauche */}
        <div style={{ display:'flex', alignItems:'center', gap:'4px' }}>
          <button className={`fb-tb-btn${showSidebar ? ' active' : ''}`}
            onClick={() => setShowSidebar(s => !s)} title="Miniatures">
            <BookOpen size={13} />
          </button>
          <button className="fb-tb-btn" onClick={zoomOut} title="Dézoomer">
            <ZoomOut size={13} />
          </button>
          <button className="fb-tb-btn" onClick={zoomReset} title={`Zoom ${Math.round(zoom*100)}%`}
            style={{ minWidth:'42px', fontSize:'9px' }}>
            {Math.round(zoom * 100)}%
          </button>
          <button className="fb-tb-btn" onClick={zoomIn} title="Zoomer">
            <ZoomIn size={13} />
          </button>
        </div>

        {/* Centre : page + progress */}
        <div style={{ display:'flex', alignItems:'center', gap:'16px' }}>
          <button className="fb-tb-btn" onClick={prev} disabled={spread === 0 || flipping}>
            <ChevronLeft size={13} />
          </button>
          <span className="fb-pg-ctr">{spread * 2 + 1} — {spread * 2 + 2} / 60</span>
          <div className="fb-progress"
            onClick={e => {
              const rect = e.currentTarget.getBoundingClientRect()
              const pct  = (e.clientX - rect.left) / rect.width
              const target = Math.round(pct * (TOTAL_SPREADS - 1))
              if (!flipping && target !== spread) goTo(target, target > spread ? 'next' : 'prev')
            }}>
            <div className="fb-progress-fill"
              style={{ width:`${((spread + 1) / TOTAL_SPREADS) * 100}%` }} />
          </div>
          <button className="fb-tb-btn" onClick={next} disabled={spread === TOTAL_SPREADS - 1 || flipping}>
            <ChevronRight size={13} />
          </button>
        </div>

        {/* Groupe droit */}
        <div style={{ display:'flex', alignItems:'center', gap:'4px' }}>
          <button className="fb-tb-btn" onClick={handleDownload} title="Ouvrir dans un onglet → Ctrl+P pour PDF">
            <Download size={13} /> <span style={{ fontSize:'9px' }}>PDF</span>
          </button>
          <button className="fb-tb-btn" onClick={toggleFullscreen} title="Plein écran">
            {isFullscreen ? <Minimize2 size={13} /> : <Maximize2 size={13} />}
          </button>
        </div>
      </div>
    </div>
  )
}
