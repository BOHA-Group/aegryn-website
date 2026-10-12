'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'

interface Segment {
  label:    string
  story:    string
  problems: string[]
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
 */
export function IndustrySegments({ segments, problemsLabel, footnote }: Props) {
  const [hovered, setHovered] = useState<number | null>(null)
  const [pinned,  setPinned]  = useState<number | null>(null)

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {segments.map((seg, i) => {
          const expanded = hovered === i || pinned === i
          return (
            <div
              key={i}
              className="border border-ag-border rounded-2xl flex flex-col overflow-hidden cursor-pointer"
              onMouseEnter={() => { if (window.matchMedia('(hover: hover)').matches) setHovered(i) }}
              onMouseLeave={() => setHovered(null)}
              onClick={() => setPinned(pinned === i ? null : i)}
              aria-expanded={expanded}
            >
              {/* Header persona */}
              <div className="bg-ag-off-white px-6 pt-6 pb-5 border-b border-ag-border">
                <div className="flex items-center gap-3 mb-3">
                  <span className="font-mono text-[9px] tracking-[0.2em] text-ag-apex-ink shrink-0">{String(i + 1).padStart(2, '0')}</span>
                  <h3 className="font-sans font-semibold text-ag-black text-[15px] leading-snug flex-1">{seg.label}</h3>
                  <span
                    className={`shrink-0 w-7 h-7 rounded-full border flex items-center justify-center transition-colors duration-300 ${
                      expanded ? 'border-ag-apex bg-ag-apex/10 text-ag-apex-ink' : 'border-ag-border text-ag-gray-light'
                    }`}
                    aria-hidden="true"
                  >
                    <Plus size={13} strokeWidth={2} className={`transition-transform duration-300 ${expanded ? 'rotate-45' : ''}`} />
                  </span>
                </div>
                {/* Storytelling */}
                <p className="font-sans text-[15px] text-ag-gray leading-relaxed italic">
                  &ldquo;{seg.story}&rdquo;
                </p>
              </div>
              {/* Bloc repliable */}
              <div className="px-6 py-5 flex flex-col gap-2.5 bg-ag-white flex-1">
                <p className="font-mono text-[9px] tracking-[0.18em] uppercase text-ag-gray-light mb-1">{problemsLabel}</p>
                <div
                  className="grid transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
                  style={{ gridTemplateRows: expanded ? '1fr' : '0fr', opacity: expanded ? 1 : 0 }}
                >
                  <div className="overflow-hidden min-h-0">
                    <ul className="flex flex-col gap-3 pb-1">
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
