'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

const DOMAINS = [
  {
    label: 'Finance & Capital',
    items: [
      'Logiciels de gestion financière', 'Fintechs & néobanques', 'Gestion de patrimoine',
      'Assurance & InsurTech', 'Recouvrement & scoring crédit',
    ],
  },
  {
    label: 'Santé & Sciences',
    items: [
      'MedTech & dispositifs connectés', 'Logiciels de santé (LGO, DPI)', 'BioTech & recherche',
      'Bien-être & prévention', 'Télémédecine',
    ],
  },
  {
    label: 'Industrie',
    items: [
      'Automatisation & robotique', 'Logistique & supply chain', 'Construction & PropTech',
      'Énergie & CleanTech', 'Agriculture & AgroTech',
    ],
  },
  {
    label: 'Commerce & Services',
    items: [
      'E-commerce & marketplaces', 'Retail & distribution', 'Marketing & CRM',
      'RH & recrutement', 'Services professionnels B2B',
    ],
  },
  {
    label: 'Institutions',
    items: [
      'GovTech & administrations', 'EdTech & formation', 'LegalTech',
      'Organisations à but non lucratif', 'Fondations & family offices',
    ],
  },
]

export default function CatalogDomains() {
  const [open, setOpen] = useState<number | null>(null)

  return (
    <section className="rounded-lg py-16 px-6 border-t border-ag-border bg-ag-white">
      <div className="max-w-7xl mx-auto">
        <p className="font-mono text-[10px] tracking-[0.28em] uppercase text-ag-gray-light mb-8">
          DOMAINES COUVERTS
        </p>
        <div className="flex flex-col gap-px bg-ag-border border border-ag-border">
          {DOMAINS.map(({ label, items }, i) => (
            <div key={label} className="bg-ag-white">
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between px-8 py-5 text-left group"
                aria-expanded={open === i}
              >
                <span className="font-sans font-semibold text-[14px] text-ag-black tracking-[-0.01em] group-hover:text-ag-apex transition-colors">
                  {label}
                </span>
                <ChevronDown
                  size={14}
                  className={`text-ag-gray-light transition-transform duration-200 ${open === i ? 'rotate-180' : ''}`}
                />
              </button>
              {open === i && (
                <div className="px-8 pb-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 border-t border-ag-border/60">
                  {items.map((item) => (
                    <div key={item} className="flex items-start gap-2 pt-4">
                      <span className="w-1 h-1 rounded-full bg-ag-apex shrink-0 mt-2" />
                      <p className="font-sans text-[12px] text-ag-gray leading-relaxed">{item}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
