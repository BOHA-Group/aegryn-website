'use client'

import { useEffect, useRef, useState } from 'react'

type Props = {
  /** Target value as string: "6.8B", "4h12", "CH" etc. */
  value: string
  className?: string
}

/**
 * CountUp — animates numeric values when entering viewport.
 * Non-numeric strings (like "CH") display immediately without animation.
 */
export function CountUp({ value, className }: Props) {
  const ref = useRef<HTMLSpanElement>(null)
  const [displayed, setDisplayed] = useState('0')
  const hasAnimated = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    /* Parse number + suffix: "6.8B" → { num: 6.8, suffix: 'B', prefix: '' } */
    const match = value.match(/^([\d.]+)([A-Za-z%]*)$/)
    if (!match) {
      setDisplayed(value)
      return
    }

    const target  = parseFloat(match[1])
    const suffix  = match[2] ?? ''
    const isFloat = match[1].includes('.')
    const decimals = isFloat ? match[1].split('.')[1].length : 0

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated.current) {
            hasAnimated.current = true
            let start: number | null = null
            const duration = 1400

            const step = (ts: number) => {
              if (!start) start = ts
              const progress = Math.min((ts - start) / duration, 1)
              const ease = 1 - Math.pow(1 - progress, 3)
              const current = target * ease
              setDisplayed(current.toFixed(decimals) + suffix)
              if (progress < 1) requestAnimationFrame(step)
            }
            requestAnimationFrame(step)
          }
        })
      },
      { threshold: 0.4 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [value])

  return (
    <span ref={ref} className={className}>
      {displayed || value}
    </span>
  )
}
