'use client'

/**
 * Shared utilities for the January 2027 edition of Aegryn Magazine.
 * Scroll-reveal hook + nav section config.
 */

import { useEffect, useRef, useState } from 'react'
import { gsap, SplitText } from '@/lib/gsap'

/* ── Section nav ────────────────────────────────────────── */
export const SECTIONS_2027 = [
  { id: 's-editorial',   label: 'Editorial'         },
  { id: 's-market',      label: 'The Market'        },
  { id: 's-ai',          label: 'AI Effect'         },
  { id: 's-perspective', label: 'Perspective'       },
  { id: 's-deals',       label: 'Deal Watch'        },
  { id: 's-buyers',      label: 'Buyer Landscape'   },
  { id: 's-outlook',     label: 'Perspectives 2027' },
  { id: 's-index',       label: 'AEGRYN Index'      },
] as const

/* ── Scrollspy nav ──────────────────────────────────────── */
export function ReportNav2027() {
  const [active, setActive] = useState<string>('')

  useEffect(() => {
    const ids = SECTIONS_2027.map(s => s.id)
    const observers: IntersectionObserver[] = []
    ids.forEach(id => {
      const el = document.getElementById(id)
      if (!el) return
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActive(id) },
        { rootMargin: '-40% 0px -55% 0px', threshold: 0 },
      )
      obs.observe(el)
      observers.push(obs)
    })
    return () => observers.forEach(o => o.disconnect())
  }, [])

  return (
    <nav className="fixed left-6 top-1/2 -translate-y-1/2 z-50 hidden xl:flex flex-col gap-3">
      {SECTIONS_2027.map(s => (
        <a
          key={s.id}
          href={`#${s.id}`}
          onClick={e => {
            e.preventDefault()
            document.getElementById(s.id)?.scrollIntoView({ behavior: 'smooth' })
          }}
          className="group flex items-center gap-2.5"
          aria-label={s.label}
        >
          <span className={`block w-5 h-px transition-all duration-300 ${
            active === s.id ? 'bg-magazine-accent w-7' : 'bg-white/25 group-hover:bg-white/50'
          }`} />
          <span className={`text-[9px] font-mono uppercase tracking-[0.16em] transition-all duration-300 whitespace-nowrap ${
            active === s.id ? 'text-magazine-accent opacity-100' : 'text-white/0 group-hover:text-white/50'
          }`}>
            {s.label}
          </span>
        </a>
      ))}
    </nav>
  )
}

/* ── Scroll reveal hook ─────────────────────────────────── */
export function useFadeUp(
  selector: string,
  triggerEl: React.RefObject<HTMLElement | null>,
) {
  useEffect(() => {
    if (!triggerEl.current) return
    const ctx = gsap.context(() => {
      gsap.fromTo(
        selector,
        { opacity: 0, y: 20 },
        {
          opacity: 1, y: 0, duration: 0.6, ease: 'power2.out', stagger: 0.1,
          scrollTrigger: { trigger: triggerEl.current, start: 'top 80%', once: true },
        },
      )
    }, triggerEl)
    return () => ctx.revert()
  }, [selector, triggerEl])
}

/* ── Cover title reveal ─────────────────────────────────── */
export function useCoverReveal(
  sectionRef: React.RefObject<HTMLElement | null>,
  titleRef: React.RefObject<HTMLHeadingElement | null>,
) {
  useEffect(() => {
    if (!sectionRef.current || !titleRef.current) return
    const split = new SplitText(titleRef.current, { type: 'lines', linesClass: 'cover-line' })
    const ctx = gsap.context(() => {
      gsap.fromTo(
        split.lines,
        { opacity: 0, y: 60 },
        { opacity: 1, y: 0, duration: 0.9, ease: 'expo.out', stagger: 0.12, delay: 0.15 },
      )
      gsap.fromTo('.cover-meta',
        { opacity: 0 },
        { opacity: 1, duration: 0.8, ease: 'power2.out', delay: 0.85 },
      )
    }, sectionRef)
    return () => { split.revert(); ctx.revert() }
  }, [sectionRef, titleRef])
}

/* ── CIFS animated bars ─────────────────────────────────── */
const CIFS_DIMS = [
  { dim: 'C', label: 'Code integrity',       score: 22 },
  { dim: 'I', label: 'IP ownership',         score: 19 },
  { dim: 'F', label: 'Financial reliability', score: 21 },
  { dim: 'S', label: 'Security posture',      score: 18 },
] as const

export function CifsBars() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return
    const bars = containerRef.current.querySelectorAll<HTMLElement>('.cifs-bar-fill')
    const ctx = gsap.context(() => {
      gsap.fromTo(
        bars,
        { scaleX: 0, transformOrigin: 'left center' },
        {
          scaleX: 1, duration: 0.8, ease: 'power2.out', stagger: 0.12,
          scrollTrigger: { trigger: containerRef.current, start: 'top 80%', once: true },
        },
      )
    }, containerRef)
    return () => ctx.revert()
  }, [])

  return (
    <div ref={containerRef} className="space-y-4">
      {CIFS_DIMS.map(({ dim, label, score }) => {
        const pct = (score / 25) * 100
        return (
          <div key={dim}>
            <div className="flex justify-between text-label-mag uppercase tracking-[0.1em] mb-2">
              <span className="text-magazine-black font-semibold">{dim} — {label}</span>
              <span className="text-magazine-black/40">{score}/25</span>
            </div>
            <div className="h-1.5 bg-magazine-black/10 w-full">
              <div
                className="cifs-bar-fill h-1.5 bg-magazine-accent"
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        )
      })}
      <p className="text-label-mag text-magazine-black/30 uppercase tracking-[0.08em] pt-2">
        Example — Illustrative certified asset
      </p>
    </div>
  )
}
