'use client'

import { useState } from 'react'
import Link         from 'next/link'
import { ArrowUpRight, ChevronDown } from 'lucide-react'

type DomainKey = 'strategy' | 'cyber' | 'finance' | 'growth' | 'ai' | 'architecture' | 'ux' | 'product'

type Position = {
  readonly title: string
  readonly domainKey: DomainKey
  readonly type: string
}

type Props = {
  positions:        readonly Position[]
  positionsLabel:   string
  domainLabel:      string
  typeLabel:        string
  applyLabel:       string
  spontaneousLabel: string
  allDomainsLabel:  string
  domainLabels:     Record<DomainKey, string>
}

export default function CareerPositions({
  positions,
  positionsLabel,
  applyLabel,
  spontaneousLabel,
  allDomainsLabel,
  domainLabels,
}: Props) {
  const [selected, setSelected] = useState<DomainKey | 'all'>('all')
  const [open, setOpen]         = useState(false)

  const filtered = selected === 'all'
    ? positions
    : positions.filter((p) => p.domainKey === selected)

  const currentLabel = selected === 'all' ? allDomainsLabel : domainLabels[selected]

  return (
    <section className="border-b border-ag-border py-24">
      <div className="max-w-7xl mx-auto px-6 md:px-12">

        {/* Header row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-ag-border pb-4 mb-0">
          <div className="flex items-center gap-4">
            <p className="font-sans font-semibold text-[10px] uppercase tracking-[0.2em] text-ag-gray-light">
              {positionsLabel}
            </p>
            <p className="font-sans font-semibold text-[10px] text-ag-gray-light">
              {String(filtered.length).padStart(2, '0')}
            </p>
          </div>

          {/* Domain filter dropdown */}
          <div className="relative">
            <button
              onClick={() => setOpen(!open)}
              className="flex items-center gap-2 font-sans font-semibold text-[10px] tracking-[0.14em] uppercase border border-ag-border px-4 py-2 text-ag-gray hover:border-ag-black hover:text-ag-black transition-all"
            >
              {currentLabel}
              <ChevronDown
                size={11}
                className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
              />
            </button>

            {open && (
              <div className="absolute right-0 top-full mt-1 z-30 bg-white border border-ag-border shadow-lg min-w-[200px]">
                <button
                  onClick={() => { setSelected('all'); setOpen(false) }}
                  className={`w-full text-left px-4 py-2.5 font-sans font-semibold text-[10px] tracking-[0.12em] uppercase transition-colors hover:bg-ag-off-white ${selected === 'all' ? 'text-ag-black bg-ag-off-white' : 'text-ag-gray'}`}
                >
                  {allDomainsLabel}
                </button>
                {(Object.entries(domainLabels) as [DomainKey, string][]).map(([key, label]) => (
                  <button
                    key={key}
                    onClick={() => { setSelected(key); setOpen(false) }}
                    className={`w-full text-left px-4 py-2.5 font-sans font-semibold text-[10px] tracking-[0.12em] uppercase transition-colors hover:bg-ag-off-white border-t border-ag-border/50 ${selected === key ? 'text-ag-black bg-ag-off-white' : 'text-ag-gray'}`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Position rows */}
        {filtered.map((pos, i) => (
          <div
            key={i}
            className="group flex items-center justify-between border-b border-ag-border py-6 hover:bg-ag-off-white transition-colors cursor-default"
          >
            <div className="flex items-start gap-6">
              <span className="font-sans font-semibold text-[10px] text-ag-gray-light w-6 shrink-0 pt-0.5">
                {String(i + 1).padStart(2, '0')}
              </span>
              <div>
                <p
                  className="font-sans font-bold text-ag-black tracking-[-0.02em] leading-tight group-hover:text-ag-navy transition-colors"
                  style={{ fontSize: 'clamp(15px,1.4vw,18px)' }}
                >
                  {pos.title}
                </p>
                <p className="font-sans font-semibold text-[10px] text-ag-apex mt-1 tracking-[0.1em] uppercase">
                  {domainLabels[pos.domainKey]}
                </p>
              </div>
            </div>
            <span className="shrink-0 font-sans font-semibold text-[10px] tracking-[0.12em] uppercase border border-ag-border px-3 py-1 text-ag-gray-light ml-6">
              {pos.type}
            </span>
          </div>
        ))}

        {/* CTA */}
        <div className="mt-12 flex flex-wrap items-center gap-4">
          <Link
            href="/contact"
            className="inline-flex items-center gap-3 bg-ag-black text-white font-sans font-semibold text-[11px] tracking-[0.16em] uppercase px-6 py-3.5 hover:bg-ag-navy transition-colors"
          >
            {applyLabel}
            <ArrowUpRight size={14} />
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center gap-3 font-sans font-semibold text-[11px] tracking-[0.16em] uppercase border border-ag-border px-6 py-3.5 text-ag-dark hover:border-ag-black hover:text-ag-black transition-all"
          >
            {spontaneousLabel}
            <ArrowUpRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  )
}
