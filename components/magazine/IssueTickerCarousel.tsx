'use client'

import { useEffect, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface IssueItem {
  issue: string
  date:  string
  theme: string
  desc:  string
}

interface Props {
  items: IssueItem[]
}

const CARD_W    = 320 // px, largeur d'une carte
const GAP       = 32  // px, gap entre cartes
const STEP      = CARD_W + GAP
const SPEED     = 0.6 // px par frame (~36px/s à 60fps)

export function IssueTickerCarousel({ items }: Props) {
  const trackRef  = useRef<HTMLDivElement>(null)
  const rafRef    = useRef<number>(0)
  const pausedRef = useRef(false)
  const xRef      = useRef(0)
  const [paused, setPaused] = useState(false)

  /* Largeur totale d'un "set" de cartes (on duplique pour loop infini) */
  const totalW = items.length * STEP

  function animate() {
    if (!pausedRef.current && trackRef.current) {
      xRef.current -= SPEED
      /* Reset dès qu'on a scrollé d'un set complet */
      if (Math.abs(xRef.current) >= totalW) xRef.current = 0
      trackRef.current.style.transform = `translateX(${xRef.current}px)`
    }
    rafRef.current = requestAnimationFrame(animate)
  }

  useEffect(() => {
    rafRef.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(rafRef.current)
  }, [totalW]) // animate est stable (refs uniquement)

  function pause()  { pausedRef.current = true;  setPaused(true)  }
  function resume() { pausedRef.current = false; setPaused(false) }

  function nudge(dir: -1 | 1) {
    xRef.current += dir * STEP
    if (xRef.current > 0)            xRef.current = -(totalW - STEP)
    if (Math.abs(xRef.current) >= totalW) xRef.current = 0
    if (trackRef.current) trackRef.current.style.transform = `translateX(${xRef.current}px)`
  }

  /* Dupliquer les items pour le loop infini */
  const doubled = [...items, ...items]

  return (
    <div className="relative border-t border-magazine-black/8 bg-magazine-white overflow-hidden">
      <div className="max-w-magazine mx-auto px-6 md:px-[120px] py-16">

        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <p className="font-mono text-[8px] tracking-[0.22em] uppercase text-magazine-black/30">
            Au sommaire
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => nudge(-1)}
              aria-label="Précédent"
              className="w-8 h-8 border border-magazine-black/15 flex items-center justify-center text-magazine-black/40 hover:border-magazine-black/50 hover:text-magazine-black transition-colors"
            >
              <ChevronLeft size={14} />
            </button>
            <button
              onClick={() => nudge(1)}
              aria-label="Suivant"
              className="w-8 h-8 border border-magazine-black/15 flex items-center justify-center text-magazine-black/40 hover:border-magazine-black/50 hover:text-magazine-black transition-colors"
            >
              <ChevronRight size={14} />
            </button>
            <button
              onClick={paused ? resume : pause}
              aria-label={paused ? 'Reprendre' : 'Pause'}
              className="font-mono text-[8px] tracking-[0.18em] uppercase text-magazine-black/30 border border-magazine-black/12 px-3 py-1.5 hover:border-magazine-black/35 hover:text-magazine-black/60 transition-colors ml-1"
            >
              {paused ? '▶ Play' : '⏸ Pause'}
            </button>
          </div>
        </div>

      </div>

      {/* Piste défilante — déborde des marges */}
      <div
        className="pb-14"
        onMouseEnter={pause}
        onMouseLeave={resume}
      >
        <div
          ref={trackRef}
          className="flex"
          style={{ gap: GAP, willChange: 'transform' }}
        >
          {doubled.map((item, i) => (
            <div
              key={i}
              style={{ width: CARD_W, flexShrink: 0 }}
              className="border-l-2 border-magazine-black/10 pl-6 py-2"
            >
              <p className="font-mono text-[8px] tracking-[0.2em] uppercase text-magazine-black/30 mb-1 whitespace-nowrap">
                {item.issue} — {item.date}
              </p>
              <p className="font-sans font-semibold text-magazine-black text-[15px] mb-2 leading-snug">
                {item.theme}
              </p>
              <p className="text-label-mag text-magazine-black/50 leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
