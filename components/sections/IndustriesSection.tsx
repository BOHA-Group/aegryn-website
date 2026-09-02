'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Plus, Minus } from 'lucide-react'

type Industry = string | { name: string; desc?: string }

export default function IndustriesSection() {
  const t = useTranslations('industries')
  const industries = t.raw('list') as Industry[]
  const [open, setOpen] = useState<number | null>(null)

  return (
    <section className="py-20 bg-ag-off-white">
      <div className="mx-auto max-w-7xl px-6">

        {/* Header */}
        <div className="max-w-3xl mb-12">
          <h2 className="font-sans font-bold text-[32px] md:text-[40px] text-ag-navy leading-[1.15] mb-4">
            {t('title')}
          </h2>
          <p className="font-sans text-[15px] md:text-[16px] text-ag-gray leading-relaxed">
            {t('desc')}
          </p>
        </div>

        {/* Accordéon */}
        <div className="divide-y divide-ag-border border-y border-ag-border">
          {industries.map((industry, index) => {
            const name  = typeof industry === 'string' ? industry : industry.name
            const desc  = typeof industry === 'object' ? industry.desc : undefined
            const isOpen = open === index
            return (
              <div key={index}>
                <button
                  onClick={() => setOpen(isOpen ? null : index)}
                  className="w-full flex items-center justify-between gap-4 py-4 px-2 group text-left hover:bg-ag-white transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-sans font-semibold text-[10px] tracking-[0.18em] text-ag-gray-light w-6 shrink-0">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <span className="font-sans font-medium text-[14px] text-ag-navy group-hover:text-ag-black transition-colors">
                      {name}
                    </span>
                  </div>
                  <span className="shrink-0 text-ag-apex">
                    {isOpen ? <Minus size={14} strokeWidth={2} /> : <Plus size={14} strokeWidth={2} />}
                  </span>
                </button>
                {isOpen && desc && (
                  <div className="px-2 pb-4 pl-11">
                    <p className="font-sans text-[13px] text-ag-gray leading-relaxed">{desc}</p>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Footer note */}
        <div className="mt-12 max-w-3xl">
          <p className="font-sans text-[13px] text-ag-gray/70 leading-relaxed">
            {t.rich('footerNote', {
              strong: (chunks) => <strong className="font-semibold text-ag-navy">{chunks}</strong>,
            })}
          </p>
        </div>

      </div>
    </section>
  )
}
