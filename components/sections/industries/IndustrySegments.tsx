'use client'

import { useLayoutEffect, useRef, useState } from 'react'
import { Plus, Store, Hotel, Radio, Users } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

const SEGMENT_ICONS: Record<string, LucideIcon> = {
  Store, Hotel, Radio,
}

interface Segment {
  label:    string
  story:    string
  problems: string[]
  icon?:    string
}

interface Props {
  segments:      Segment[]
  problemsLabel: string
  footnote?:     string
}

/**
 * Cartes profils segments — bloc « Ce que nous pilotons » pliable.
 * Desktop : se deplie au survol (meme animation grid-rows que la home).
 * Mobile : ouverture/fermeture manuelle au tap — le mouseenter synthetique
 * tactile est neutralise par matchMedia('(hover: hover)').
 * Les headers gris sont alignes sur la plus haute carte (md+ seulement).
 */
export function IndustrySegments({ segments, problemsLabel, footnote }: Props) {
  const [hovered, setHovered] = useState<number | null>(null)
  const [pinned,  setPinned]  = useState<number | null>(null)
  const headerRefs            = useRef<(HTMLDivElement | null)[]>([])
  const [headerMinH, setHeaderMinH] = useState(0)

  useLayoutEffect(() => {
    const measure = () => {
      if (!window.matchMedia('(min-width: 768px)').matches) { setHeaderMinH(0); return }
      const max = Math.max(...headerRefs.current.map(el => el?.scrollHeight ?? 0))
      setHeaderMinH(max)
    }
    measure()
    document.fonts?.ready.then(measure).catch(() => {})
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [segments])

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        {segments.map((seg, i) => {
          const expanded = hovered === i || pinned === i
          const Icon = (seg.icon && SEGMENT_ICONS[seg.icon]) || Users
          return (
            <div
              key={i}
              className="border border-ag-border rounded-2xl flex flex-col overflow-hidden cursor-pointer self-start"
              onMouseEnter={() => { if (window.matchMedia('(hover: hover)').matches) setHovered(i) }}
              onMouseLeave={() => setHovered(null)}
              onClick={() => setPinned(pinned === i ? null : i)}
              aria-expanded={expanded}
            >
              {/* Header persona — hauteur alignee sur la plus haute */}
              <div
                ref={el => { headerRefs.current[i] = el }}
                className="bg-ag-off-white px-6 pt-6 pb-5"
                style={headerMinH ? { minHeight: headerMinH } : undefined}
              >
                <div className="flex items-center justify-between gap-3 mb-4">
                  <Icon size={18} className="text-ag-apex-ink shrink-0" strokeWidth={1.5} aria-hidden="true" />
                  <span
                    className={`shrink-0 w-7 h-7 rounded-full border flex items-center justify-center transition-colors duration-300 ${
                      expanded ? 'border-ag-apex bg-ag-apex/10 text-ag-apex-ink' : 'border-ag-border text-ag-gray-light'
                    }`}
                    aria-hidden="true"
                  >
                    <Plus size={13} strokeWidth={2} className={`transition-transform duration-300 ${expanded ? 'rotate-45' : ''}`} />
                  </span>
                </div>
                <div className="flex items-center gap-3 mb-3">
                  <span className="font-mono text-[9px] tracking-[0.2em] text-ag-apex-ink shrink-0">{String(i + 1).padStart(2, '0')}</span>
                  <h3 className="font-sans font-semibold text-ag-black text-[15px] leading-snug flex-1">{seg.label}</h3>
                </div>
                {/* Storytelling */}
                <p className="font-sans text-[15px] text-ag-gray leading-relaxed italic">
                  &ldquo;{seg.story}&rdquo;
                </p>
              </div>
              {/* Bloc entierement repliable : libelle + liste */}
              <div
                className={`grid transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${expanded ? 'border-t border-ag-border' : ''}`}
                style={{ gridTemplateRows: expanded ? '1fr' : '0fr', opacity: expanded ? 1 : 0 }}
              >
                <div className="overflow-hidden min-h-0">
                  <div className="px-6 pt-5 pb-6 flex flex-col gap-2.5 bg-ag-white">
                    <p className="font-mono text-[9px] tracking-[0.18em] uppercase text-ag-gray-light mb-1">{problemsLabel}</p>
                    <ul className="flex flex-col gap-3">
                      {seg.problems.map((pb, j) => (
                        <li key={j} className="flex items-start gap-2.5">
                          <span className="mt-1.5 w-1 h-1 rounded-full bg-ag-apex shrink-0" />
                          <span className="font-sans text-[15px] text-ag-gray leading-relaxed">{pb}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
      {footnote && (
        <p className="mt-6 font-sans text-[13px] text-ag-gray italic">
          {footnote}
        </p>
      )}
    </>
  )
}
