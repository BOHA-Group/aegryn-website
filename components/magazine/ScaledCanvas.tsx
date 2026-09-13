'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'

/**
 * Met à l'échelle un canevas de dimensions fixes (ex. cover 420 × 595) pour qu'il tienne
 * dans la largeur disponible sur mobile, sans changer sa composition interne.
 */
export function ScaledCanvas({ width, height, children, className = '' }: {
  width: number; height: number; children: ReactNode; className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(1)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const update = () => setScale(Math.min(1, el.clientWidth / width))
    update()
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => ro.disconnect()
  }, [width])

  return (
    <div ref={ref} className={className} style={{ width: '100%', maxWidth: width, height: height * scale, position: 'relative' }}>
      <div style={{ width, height, transform: `scale(${scale})`, transformOrigin: 'top left', position: 'absolute', top: 0, left: 0 }}>
        {children}
      </div>
    </div>
  )
}
