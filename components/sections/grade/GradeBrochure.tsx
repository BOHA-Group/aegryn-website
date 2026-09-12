'use client'

import { useLocale, useTranslations } from 'next-intl'
import Image from 'next/image'
import Link from 'next/link'
import { FileText, Download, Check } from 'lucide-react'

export function GradeBrochure() {
  const locale = useLocale()
  const t = useTranslations('grade.index')

  return (
    <section className="py-28 px-6 border-t border-ag-border bg-gradient-to-b from-white to-ag-off-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Image cover brochure */}
          <div className="relative aspect-[3/4] max-w-md rounded-2xl overflow-hidden shadow-2xl border border-ag-border">
            {/* Image de fond - totalement visible */}
            <Image
              src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=2940&auto=format&fit=crop"
              alt="CIFSO 5000 Certification Brochure"
              fill
              className="object-cover"
              priority
            />
            
            {/* Contenu cover */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-10">
              {/* Badge version */}
              <div className="inline-flex items-center gap-3 mb-8 px-6 py-3 rounded-full border-2 border-white bg-white/95 shadow-xl">
                <div className="w-2 h-2 bg-ag-apex rounded-full animate-pulse" />
                <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-ag-navy font-bold">
                  Certification CIFSO 5000 v4.0
                </span>
              </div>

              {/* Titre */}
              <h3 className="font-sans font-bold text-white text-[clamp(36px,6vw,56px)] leading-[0.95] tracking-[-0.04em] mb-6" style={{ textShadow: '0 4px 20px rgba(0,0,0,0.8), 0 2px 8px rgba(0,0,0,0.6)' }}>
                Certification<br />
                <span className="text-ag-apex" style={{ textShadow: '0 4px 20px rgba(0,0,0,0.9), 0 2px 8px rgba(0,0,0,0.7)' }}>CIFSO 5000</span>
              </h3>

              {/* Sous-titre */}
              <p className="font-sans text-white text-[16px] sm:text-[18px] leading-relaxed font-medium max-w-sm" style={{ textShadow: '0 2px 12px rgba(0,0,0,0.8), 0 1px 4px rgba(0,0,0,0.6)' }}>
                Le standard de certification de la valeur organisationnelle
              </p>
            </div>
          </div>

          {/* Contenu */}
          <div>
            <p className="font-mono text-[10px] tracking-[0.28em] uppercase text-ag-gray-light mb-4">
              Documentation complète
            </p>
            <h2 className="font-sans font-bold text-ag-black text-[42px] sm:text-[48px] tracking-[-0.03em] leading-[1.05] mb-6">
              Brochure CIFSO 5000
            </h2>
            <p className="font-sans text-[17px] text-ag-gray leading-relaxed mb-8">
              {t('whitepaperDesc')}
            </p>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row gap-4 mb-10">
              <Link
                href={`/${locale}/grade/brochure`}
                className="inline-flex items-center justify-center gap-2 bg-ag-apex text-ag-navy font-sans font-semibold text-[12px] tracking-[0.14em] uppercase px-8 py-4 rounded-xl hover:bg-ag-apex/90 transition-all shadow-lg hover:shadow-xl"
              >
                <FileText size={16} />
                Consulter la brochure
              </Link>
              <button
                onClick={() => window.open(`/${locale}/grade/brochure`, '_blank')}
                className="inline-flex items-center justify-center gap-2 border-2 border-ag-border text-ag-gray hover:text-ag-black hover:border-ag-black font-sans font-semibold text-[12px] tracking-[0.14em] uppercase px-8 py-4 rounded-xl transition-all"
              >
                <Download size={16} />
                Télécharger PDF
              </button>
            </div>

            {/* Features list */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                'Processus détaillé',
                'Échelle de grades',
                'Cas d\'usage',
                'Méthodologie complète',
                'Bénéfices clients',
                'Exemples concrets'
              ].map((feature, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="shrink-0 w-5 h-5 bg-ag-apex/10 rounded flex items-center justify-center">
                    <Check size={14} className="text-ag-apex" />
                  </div>
                  <span className="font-sans text-[14px] text-ag-gray">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
