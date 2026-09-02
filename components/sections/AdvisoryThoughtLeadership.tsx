import { useTranslations } from 'next-intl'

export function AdvisoryThoughtLeadership() {
  const t = useTranslations('advisory.thoughtLeadership')
  
  const pillars = t.raw('pillars') as { label: string; desc: string }[]

  return (
    <section className="border-b border-ag-border bg-ag-cream">
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-24">
        {/* Header */}
        <div className="max-w-4xl mb-16">
          <h2 className="font-sans font-bold tracking-[-0.02em] leading-[1.2] text-ag-navy mb-6"
              style={{ fontSize: 'clamp(32px,4vw,48px)' }}>
            {t('title')}
          </h2>
          <p className="text-[15px] text-ag-gray leading-relaxed">
            {t('desc')}
          </p>
        </div>

        {/* 3 Pillars */}
        <div className="grid md:grid-cols-3 gap-12 mb-16">
          {pillars.map((pillar, idx) => (
            <div key={idx} className="bg-white border border-ag-border p-8">
              <div className="font-sans font-semibold text-[10px] tracking-[0.2em] text-ag-apex mb-6">
                {String(idx + 1).padStart(2, '0')}
              </div>
              <h3 className="font-sans font-bold text-[20px] text-ag-navy mb-4 leading-tight">
                {pillar.label}
              </h3>
              <p className="text-[14px] text-ag-gray leading-relaxed">
                {pillar.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Conclusion */}
        <div className="max-w-3xl border-l-2 border-ag-apex pl-8">
          <p className="text-[15px] text-ag-navy leading-relaxed font-medium">
            {t('conclusion')}
          </p>
        </div>
      </div>
    </section>
  )
}
