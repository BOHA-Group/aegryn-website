'use client'

import { useEffect, useRef, useState } from 'react'

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
  const trackRef    = useRef<HTMLDivElement>(null)
  const rafRef      = useRef<number>(0)
  const pausedRef   = useRef(false)
  const xRef        = useRef(0)
  const draggingRef = useRef(false)
  const dragStartX  = useRef(0)
  const dragStartXRef = useRef(0)
  const [isDragging, setIsDragging] = useState(false)

  /* Largeur totale d'un "set" de cartes (on duplique pour loop infini) */
  const totalW = items.length * STEP

  function animate() {
    if (!pausedRef.current && !draggingRef.current && trackRef.current) {
      xRef.current -= SPEED
      if (Math.abs(xRef.current) >= totalW) xRef.current = 0
      trackRef.current.style.transform = `translateX(${xRef.current}px)`
    }
    rafRef.current = requestAnimationFrame(animate)
  }

  useEffect(() => {
    rafRef.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(rafRef.current)
  }, [totalW])

  function pause()  { pausedRef.current = true  }
  function resume() { if (!draggingRef.current) pausedRef.current = false }

  function onMouseDown(e: React.MouseEvent) {
    draggingRef.current = true
    pausedRef.current   = true
    setIsDragging(true)
    dragStartX.current  = e.clientX
    dragStartXRef.current = xRef.current
  }

  function onMouseMove(e: React.MouseEvent) {
    if (!draggingRef.current || !trackRef.current) return
    const delta = e.clientX - dragStartX.current
    let next = dragStartXRef.current + delta
    /* Garder dans la plage du loop */
    next = ((next % totalW) - totalW) % totalW
    xRef.current = next
    trackRef.current.style.transform = `translateX(${next}px)`
  }

  function onMouseUp() {
    draggingRef.current = false
    pausedRef.current   = false
    setIsDragging(false)
  }

  /* Dupliquer les items pour le loop infini */
  const doubled = [...items, ...items]

  return (
    <div className="relative border-t border-magazine-black/8 bg-magazine-white overflow-hidden">
      {/* Piste défilante — déborde des marges */}
      <div
        className="pt-6 pb-14 select-none"
        style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
        onMouseEnter={pause}
        onMouseLeave={onMouseUp}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
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
