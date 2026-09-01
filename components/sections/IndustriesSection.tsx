'use client'

import { useTranslations } from 'next-intl'

export default function IndustriesSection() {
  const t = useTranslations('industries')
  
  const industries = t.raw('list') as string[]

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

        {/* Grid industries */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {industries.map((industry, index) => (
            <div
              key={index}
              className="group relative bg-white border border-ag-border rounded-lg px-5 py-4 hover:border-ag-apex hover:bg-ag-apex/5 transition-all duration-300"
            >
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-ag-apex group-hover:scale-125 transition-transform" />
                <p className="font-sans font-medium text-[14px] text-ag-navy group-hover:text-ag-apex transition-colors">
                  {industry}
                </p>
              </div>
            </div>
          ))}
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
