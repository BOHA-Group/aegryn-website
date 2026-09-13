'use client'

import { useTranslations } from 'next-intl'
import { FileCheck2, Check } from 'lucide-react'

/**
 * « Acte de propriété de la valeur » : analogie de la montre et de ses papiers.
 * Le CIFSO 5000 établit ce que l'organisation possède, maîtrise et vaut (source : CIFSO Valuation Index).
 */
export default function GradeDeed() {
  const t = useTranslations('grade.index.deed')
  const points = t.raw('points') as string[]
  return (
    <section className="bg-ag-off-white border-t border-ag-border py-24 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-12 items-center">
        <div>
          <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-ag-gray-light mb-4">{t('label')}</p>
          <h2 className="font-sans font-bold text-ag-black tracking-[-0.03em] leading-[1.05] mb-6 whitespace-pre-line" style={{ fontSize: 'clamp(28px,3.4vw,48px)' }}>{t('title')}</h2>
          <p className="font-sans text-[15px] text-ag-gray leading-relaxed max-w-xl">{t('desc')}</p>
        </div>
        <div className="rounded-2xl bg-ag-navy text-white p-8 md:p-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-ag-apex/15 border border-ag-apex/40 flex items-center justify-center"><FileCheck2 size={18} className="text-ag-apex" /></div>
            <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-white/60">CIFSO 5000</p>
          </div>
          <ul className="flex flex-col gap-4">
            {points.map(p => (
              <li key={p} className="flex items-start gap-3 font-sans text-[14px] leading-snug text-white/85">
                <Check size={15} className="text-ag-apex shrink-0 mt-0.5" /> {p}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
