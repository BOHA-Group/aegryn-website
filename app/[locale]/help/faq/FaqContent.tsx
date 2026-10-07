'use client'

import { useState }           from 'react'
import Link                   from 'next/link'
import { Plus }               from 'lucide-react'
import { useTranslations }    from 'next-intl'
import { FilterPills }        from '@/components/ui/FilterPills'

type FaqItem = {
  id: string
  cat: string[]
  q: string
  a: string
}

export default function FaqContent() {
  const t  = useTranslations('faq')
  const tN = useTranslations('legalNav')
  const items = t.raw('items') as FaqItem[]

  const FILTERS = [
    { key: 'all',            label: t('filterAll') },
    { key: 'certification',  label: t('filterCertification') },
    { key: 'lifecycle',      label: t('filterLifecycle') },
    { key: 'account',        label: t('filterAccount') },
  ] as const

  const [active, setActive]   = useState<string>('all')
  const [open, setOpen]       = useState<string | null>(null)

  const filtered = active === 'all'
    ? items
    : items.filter(item => item.cat.includes(active))

  return (
    <main className="bg-ag-white min-h-screen">
      {/* Hero */}
      <section className="bg-ag-navy pt-24 pb-14 px-6">
        <div className="max-w-4xl mx-auto">
          <p className="font-mono text-[10px] tracking-[0.28em] uppercase text-ag-apex mb-5">Aegryn — Help</p>
          <h1
            className="font-sans font-bold text-white leading-[1.05] tracking-[-0.03em]"
            style={{ fontSize: 'clamp(28px,3.5vw,52px)' }}
          >
            {t('label')}
          </h1>
        </div>
      </section>

      {/* Legal nav */}
      <div className="border-b border-ag-border bg-ag-off-white sticky top-16 z-20">
        <div className="max-w-4xl mx-auto px-6 py-3 flex flex-wrap gap-x-6 gap-y-1">
          {(['termsUse','termsCgv','privacy','security','faq'] as const).map((k, i) => (
            <Link
              key={k}
              href={['/terms/use','/terms/cgv','/privacy','/security','/help/faq'][i]}
              className={`font-mono text-[10px] tracking-[0.18em] uppercase transition-colors ${
                k === 'faq' ? 'text-ag-black' : 'text-ag-gray-light hover:text-ag-black'
              }`}
            >
              {tN(k)}
            </Link>
          ))}
        </div>
      </div>

      {/* Filter pills */}
      <div className="border-b border-ag-border bg-ag-white">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <FilterPills
            options={FILTERS as unknown as { key: string; label: string }[]}
            active={active}
            onChange={setActive}
          />
        </div>
      </div>

      {/* FAQ accordion */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="divide-y divide-ag-border">
          {filtered.map(item => (
            <div key={item.id}>
              <button
                onClick={() => setOpen(open === item.id ? null : item.id)}
                className="w-full flex items-start justify-between gap-6 py-6 text-left group"
                aria-expanded={open === item.id}
              >
                <span className="font-sans font-semibold text-[15px] text-ag-black leading-snug group-hover:text-ag-navy transition-colors">
                  {item.q}
                </span>
                <span
                  className={`shrink-0 w-7 h-7 rounded-full border flex items-center justify-center transition-colors duration-300 ${
                    open === item.id ? 'border-ag-apex bg-ag-apex/10 text-ag-apex-ink' : 'border-ag-border text-ag-gray-light'
                  }`}
                  aria-hidden="true"
                >
                  <Plus size={13} strokeWidth={2} className={`transition-transform duration-300 ${open === item.id ? 'rotate-45' : ''}`} />
                </span>
              </button>
              {open === item.id && (
                <div className="pb-6 pr-8">
                  <p className="font-sans text-[14px] text-ag-gray leading-relaxed">{item.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="font-sans text-[14px] text-ag-gray-light text-center py-16">
            Aucun résultat pour ce filtre.
          </p>
        )}
      </div>
    </main>
  )
}
