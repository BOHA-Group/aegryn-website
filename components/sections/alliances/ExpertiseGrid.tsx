'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Scale, BarChart2, Shield, Users, Umbrella, Compass } from 'lucide-react'

const ICONS = [Scale, BarChart2, Shield, Users, Umbrella, Compass]

type DisciplineItem = {
  num: string
  id: string
  title: string
  desc: string
  tags: string[]
}

export default function ExpertiseGrid() {
  const t = useTranslations('alliances.disciplines')
  const items = t.raw('items') as DisciplineItem[]
  const [activeFilter, setActiveFilter] = useState<string>('all')

  const filters = [
    { id: 'all', label: t('filterAll') },
    ...items.map(item => ({ id: item.id, label: item.title })),
  ]

  const visible = activeFilter === 'all'
    ? items
    : items.filter(item => item.id === activeFilter)

  return (
    <section className="border-b border-ag-border bg-ag-off-white py-24">
      <div className="mx-auto max-w-7xl px-6 md:px-12">

        {/* Header */}
        <div className="mb-12">
          <p className="font-sans font-semibold text-[10px] uppercase tracking-[0.28em] text-ag-gray-light mb-4">
            / {t('label')}
          </p>
          <p className="font-sans text-[14px] text-ag-gray max-w-xl leading-relaxed">
            {t('intro')}
          </p>
        </div>

        {/* Filtres */}
        <div className="flex flex-wrap gap-2 mb-10">
          <p className="font-sans text-[10px] uppercase tracking-[0.18em] text-ag-gray-light self-center mr-2">
            {t('filterLabel')} :
          </p>
          {filters.map(f => (
            <button
              key={f.id}
              onClick={() => setActiveFilter(f.id)}
              className={`font-sans text-[11px] tracking-[0.12em] uppercase px-4 py-2 border transition-all ${
                activeFilter === f.id
                  ? 'bg-ag-black text-white border-ag-black'
                  : 'bg-ag-white text-ag-gray border-ag-border hover:border-ag-black hover:text-ag-black'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Grille */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-ag-border border border-ag-border">
          {visible.map((item, _idx) => {
            const originalIdx = items.findIndex(i => i.id === item.id)
            const Icon = ICONS[originalIdx] ?? Scale
            return (
              <div
                key={item.id}
                className="bg-ag-white p-8 group hover:bg-ag-off-white transition-colors duration-200"
              >
                {/* Top row */}
                <div className="flex items-start justify-between mb-6">
                  <div className="w-10 h-10 border border-ag-border flex items-center justify-center group-hover:border-ag-apex group-hover:text-ag-apex transition-colors">
                    <Icon size={18} strokeWidth={1.5} />
                  </div>
                  <span className="font-sans font-semibold text-[10px] tracking-[0.2em] text-ag-gray-light">
                    {item.num}
                  </span>
                </div>

                {/* Title + desc */}
                <h3 className="font-sans font-bold text-[16px] text-ag-black mb-2 tracking-[-0.01em]">
                  {item.title}
                </h3>
                <p className="font-sans text-[13px] text-ag-gray leading-relaxed mb-6">
                  {item.desc}
                </p>

                {/* Tags compétences */}
                <div className="flex flex-wrap gap-1.5">
                  {item.tags.map(tag => (
                    <span
                      key={tag}
                      className="font-sans text-[10px] tracking-[0.08em] text-ag-gray border border-ag-border px-2.5 py-1 group-hover:border-ag-apex/40 transition-colors"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
