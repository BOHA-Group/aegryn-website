'use client'

import { useLocale, useTranslations } from 'next-intl'
import Image from 'next/image'
import Link from 'next/link'
import { FileText, Check } from 'lucide-react'

const COVER = 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1600&auto=format&fit=crop'

export function GradeBrochure() {
  const locale = useLocale()
  const b = useTranslations('brochure')
  const features = b.raw('previewFeatures') as string[]

  return (
    <section className="py-28 px-6 border-t border-ag-border">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[minmax(0,380px)_1fr] gap-14 lg:gap-20 items-center">

        {/* Cover réel de la brochure (page 1 du PDF) */}
        <Link
          href={`/${locale}/grade/brochure`}
          aria-label={b('previewRead')}
          className="group relative block aspect-[1/1.414] w-full max-w-[380px] mx-auto lg:mx-0 rounded-lg overflow-hidden shadow-[0_24px_60px_-20px_rgba(11,31,58,0.45)] ring-1 ring-black/10 transition-transform duration-300 hover:-translate-y-1"
        >
          <Image src={COVER} alt="" fill className="object-cover" sizes="380px" />
          <div className="absolute inset-x-0 bottom-0 h-[58%] bg-gradient-to-t from-ag-navy via-ag-navy/95 to-transparent" />
          <div className="absolute inset-0 flex flex-col justify-between p-7">
            <div className="flex items-center justify-between">
              <span className="font-sans font-bold text-white text-[11px] tracking-[0.14em] drop-shadow-[0_2px_6px_rgba(0,0,0,0.6)]">AEGRYN</span>
              <span className="font-mono text-[8px] tracking-[0.24em] uppercase text-white bg-ag-navy/80 px-2.5 py-1 rounded-full border border-white/20">
                {b('docType')}
              </span>
            </div>
            <div>
              <div className="w-8 h-0.5 bg-ag-apex mb-4" />
              <h3 className="font-sans font-bold text-white text-[30px] leading-[0.95] tracking-[-0.04em] whitespace-pre-line mb-3">
                {b('coverTitle')}
              </h3>
              <p className="font-sans text-white/85 text-[11px] leading-relaxed">{b('coverSubtitle')}</p>
            </div>
          </div>
        </Link>

        {/* Contenu */}
        <div>
          <p className="font-mono text-[10px] tracking-[0.28em] uppercase text-ag-gray-light mb-4">{b('previewLabel')}</p>
          <h2 className="font-sans font-bold text-ag-black text-[38px] sm:text-[46px] tracking-[-0.03em] leading-[1.05] mb-5">
            {b('previewTitle')}
          </h2>
          <p className="font-sans text-[16px] text-ag-gray leading-relaxed mb-8 max-w-xl">{b('previewDesc')}</p>

          <div className="flex flex-col sm:flex-row gap-3 mb-10">
            <Link
              href={`/${locale}/grade/brochure`}
              className="inline-flex items-center justify-center gap-2 bg-ag-apex text-ag-navy font-sans font-semibold text-[11px] tracking-[0.14em] uppercase px-7 py-4 rounded-lg hover:bg-ag-apex/90 transition-colors"
            >
              <FileText size={15} />
              {b('previewRead')}
            </Link>
            {/* Téléchargement PDF masqué le temps de fiabiliser le format imprimé sur tous les navigateurs */}
          </div>

          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {features.map((f) => (
              <li key={f} className="flex items-center gap-3">
                <span className="shrink-0 w-5 h-5 rounded bg-ag-apex/15 flex items-center justify-center">
                  <Check size={13} className="text-ag-navy" />
                </span>
                <span className="font-sans text-[14px] text-ag-gray">{f}</span>
              </li>
            ))}
          </ul>
          <p className="font-mono text-[10px] tracking-[0.18em] uppercase text-ag-gray-light mt-8">15 {b('previewPages')} · PDF</p>
        </div>
      </div>
    </section>
  )
}
