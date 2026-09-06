'use client'

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

  return (
    <section className="border-b border-ag-border bg-ag-off-white py-24">
      <div className="mx-auto max-w-7xl px-6 md:px-12">

        {/* Header */}
        <div className="mb-10">
          <p className="font-sans font-semibold text-[10px] uppercase tracking-[0.28em] text-ag-gray-light mb-4">
            / {t('label')}
          </p>
          <p className="font-sans text-[14px] text-ag-gray max-w-xl leading-relaxed">
            {t('intro')}
          </p>
        </div>

        {/* Grille */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-ag-border border border-ag-border">
          {items.map((item, _idx) => {
            const originalIdx = items.findIndex(i => i.id === item.id)
            const Icon = ICONS[originalIdx] ?? Scale
            return (
              <div
                key={item.id}
                className="bg-ag-white p-5 group hover:bg-ag-off-white transition-colors duration-200"
              >
                {/* Top row */}
                <div className="flex items-start justify-between mb-4">
                  <div className="w-8 h-8 border border-ag-border flex items-center justify-center group-hover:border-ag-apex group-hover:text-ag-apex transition-colors">
                    <Icon size={15} strokeWidth={1.5} />
                  </div>
                  <span className="font-sans font-semibold text-[10px] tracking-[0.2em] text-ag-gray-light">
                    {item.num}
                  </span>
                </div>

                {/* Title + desc */}
                <h3 className="font-sans font-bold text-[14px] text-ag-black mb-1.5 tracking-[-0.01em]">
                  {item.title}
                </h3>
                <p className="font-sans text-[12px] text-ag-gray leading-relaxed mb-4">
                  {item.desc}
                </p>

                {/* Tags compétences */}
                <div className="flex flex-wrap gap-1">
                  {item.tags.map(tag => (
                    <span
                      key={tag}
                      className="font-sans text-[10px] tracking-[0.06em] text-ag-gray border border-ag-border px-2 py-0.5 group-hover:border-ag-apex/40 transition-colors"
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
