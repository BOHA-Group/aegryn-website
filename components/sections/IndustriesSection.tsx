'use client'

import { useState, useRef, useCallback } from 'react'
import { useTranslations } from 'next-intl'
import { Plus, Minus } from 'lucide-react'

type IndustryItem = { name: string; desc?: string }
type IndustryCluster = { cluster: string; items: IndustryItem[] }

export default function IndustriesSection() {
  const t = useTranslations('industries')
  const clusters = t.raw('clusters') as IndustryCluster[]
  const [openCluster, setOpenCluster] = useState<number | null>(null)
  const hoverTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const openItem = useCallback((ci: number) => {
    if (hoverTimer.current) clearTimeout(hoverTimer.current)
    setOpenCluster(ci)
  }, [])

  const closeItem = useCallback(() => {
    hoverTimer.current = setTimeout(() => setOpenCluster(null), 150)
  }, [])

  const cancelClose = useCallback(() => {
    if (hoverTimer.current) clearTimeout(hoverTimer.current)
  }, [])

  return (
    <div className="divide-y divide-ag-border border-t border-b border-ag-border">
      {clusters.map((cluster, ci) => {
        const isOpen = openCluster === ci
        return (
          <div key={ci}>
            <button
              onMouseEnter={() => openItem(ci)}
              onMouseLeave={closeItem}
              onClick={() => setOpenCluster(isOpen ? null : ci)}
              className="w-full flex items-center justify-between gap-4 py-5 px-2 group text-left hover:bg-ag-white transition-colors"
            >
              <span className="font-sans font-bold text-[14px] tracking-[-0.01em] text-ag-navy group-hover:text-ag-black transition-colors">
                {cluster.cluster}
              </span>
              <span className="shrink-0 text-ag-apex">
                {isOpen ? <Minus size={14} strokeWidth={2} /> : <Plus size={14} strokeWidth={2} />}
              </span>
            </button>
            {isOpen && (
              <div
                className="pb-5 pl-2 pr-2"
                onMouseEnter={cancelClose}
                onMouseLeave={closeItem}
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {cluster.items.map((item, ii) => (
                    <div key={ii} className="bg-ag-white p-4 border border-ag-border">
                      <p className="font-sans font-semibold text-[13px] text-ag-black mb-1">{item.name}</p>
                      {item.desc && (
                        <p className="font-sans text-[12px] text-ag-gray leading-snug">{item.desc}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
