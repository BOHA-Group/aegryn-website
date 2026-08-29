'use client'

import { useEffect, useRef } from 'react'

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

  function pause()  { pausedRef.current = true  }
  function resume() { pausedRef.current = false }

  /* Dupliquer les items pour le loop infini */
  const doubled = [...items, ...items]

  return (
    <div className="relative border-t border-magazine-black/8 bg-magazine-white overflow-hidden">
      <div className="max-w-magazine mx-auto px-6 md:px-[120px] pt-12 pb-2">
        <p className="font-mono text-[8px] tracking-[0.22em] uppercase text-magazine-black/30">
          Au sommaire
        </p>
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
