'use client'

import { useRef } from 'react'
import { useTranslations } from 'next-intl'
import { Download, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export function CifsoBrochure() {
  const t = useTranslations('gradingSystem')
  const contentRef = useRef<HTMLDivElement>(null)

  const handleDownload = () => {
    if (typeof window !== 'undefined') {
      window.print()
    }
  }

  const grades = t.raw('grades') as Array<{
    grade: string
    name: string
    desc: string
    color: string
  }>

  const process = t.raw('process') as Array<{
    num: string
    title: string
    desc: string
    inputs: string
    outputs: string
    outcomes: string
  }>

  const useCases = t.raw('useCases') as Array<{
    title: string
    desc: string
  }>

  return (
    <main className="min-h-screen bg-white">
      {/* Toolbar fixe */}
      <div className="fixed top-0 left-0 right-0 bg-white border-b border-ag-border z-50 print:hidden">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link
            href="/grade/methodology"
            className="inline-flex items-center gap-2 text-ag-gray hover:text-ag-black transition-colors text-sm"
          >
            <ArrowLeft size={16} />
            {t('wpNavBack')}
          </Link>
          <button
            onClick={handleDownload}
            className="inline-flex items-center gap-2 bg-ag-apex text-ag-navy font-sans font-semibold text-[11px] tracking-[0.14em] uppercase px-6 py-3 rounded-lg hover:bg-ag-apex/90 transition-colors"
          >
            <Download size={14} />
            {t('wpNavPrint')}
          </button>
        </div>
      </div>

      {/* Contenu scrollable */}
      <div ref={contentRef} className="pt-20 print:pt-0">
        
        {/* COVER PAGE */}
        <section className="relative h-screen flex items-center justify-center bg-gradient-to-br from-ag-navy via-ag-navy to-[#1a2332] overflow-hidden">
          {/* Grille de fond */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0" style={{
              backgroundImage: `
                linear-gradient(to right, rgba(90, 221, 164, 0.3) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(90, 221, 164, 0.3) 1px, transparent 1px)
              `,
              backgroundSize: '60px 60px'
            }} />
          </div>

          {/* Cercles décoratifs */}
          <div className="absolute top-20 right-20 w-96 h-96 bg-ag-apex/10 rounded-full blur-3xl" />
          <div className="absolute bottom-20 left-20 w-80 h-80 bg-ag-apex/5 rounded-full blur-3xl" />

          <div className="relative z-10 text-center px-6 max-w-4xl">
            {/* Logo/Badge */}
            <div className="inline-flex items-center gap-3 mb-8 px-6 py-3 rounded-full border border-ag-apex/30 bg-ag-apex/5">
              <div className="w-2 h-2 bg-ag-apex rounded-full animate-pulse" />
              <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-ag-apex">
                {t('version')}
              </span>
            </div>

            {/* Titre principal */}
            <h1 className="font-sans font-bold text-white text-[clamp(48px,8vw,96px)] leading-[0.95] tracking-[-0.04em] mb-6">
              Certification<br />
              <span className="text-ag-apex">CIFSO 5000</span>
            </h1>

            {/* Sous-titre */}
            <p className="font-sans text-white/70 text-[clamp(16px,2vw,20px)] leading-relaxed mb-12 max-w-2xl mx-auto">
              Valorisation d'actifs entreprises
            </p>

            {/* Tagline */}
            <div className="inline-block px-8 py-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <p className="font-sans text-white text-[15px] leading-relaxed">
                {t('whyDesc')}
              </p>
            </div>

            {/* Footer cover */}
            <div className="absolute bottom-12 left-0 right-0 flex items-center justify-center gap-8 text-white/40 text-sm">
              <span>Aegryn SA</span>
              <span>•</span>
              <span>Genève, Suisse</span>
              <span>•</span>
              <span>aegryn.com</span>
            </div>
          </div>
        </section>

        {/* PAGE 1 : Introduction */}
        <section className="min-h-screen bg-white px-6 py-20 flex items-center">
          <div className="max-w-4xl mx-auto">
            <p className="font-mono text-[10px] tracking-[0.28em] uppercase text-ag-apex mb-8">
              Introduction
            </p>
            <h2 className="font-sans font-bold text-ag-black text-[42px] tracking-[-0.03em] leading-[1.1] mb-8">
              {t('whyTitle')}
            </h2>
            <div className="prose prose-lg max-w-none">
              <p className="font-sans text-[18px] text-ag-gray leading-relaxed mb-6">
                {t('intro')}
              </p>
              <p className="font-sans text-[18px] text-ag-gray leading-relaxed">
                {t('whyDesc')}
              </p>
            </div>
          </div>
        </section>

        {/* PAGE 2 : Cas d'usage */}
        <section className="min-h-screen bg-ag-off-white px-6 py-20">
          <div className="max-w-6xl mx-auto">
            <p className="font-mono text-[10px] tracking-[0.28em] uppercase text-ag-apex mb-8">
              {t('useCasesTitle')}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
              {useCases.map((useCase, i) => (
                <div key={i} className="bg-white border border-ag-border rounded-xl p-8 hover:border-ag-apex transition-colors">
                  <div className="flex items-start gap-4">
                    <div className="shrink-0 w-10 h-10 bg-ag-apex/10 rounded-lg flex items-center justify-center">
                      <span className="font-mono text-ag-apex font-bold text-sm">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-sans font-semibold text-ag-black text-[17px] mb-3">
                        {useCase.title}
                      </h3>
                      <p className="font-sans text-[14px] text-ag-gray leading-relaxed">
                        {useCase.desc}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* PAGE 3 : Échelle de grades */}
        <section className="min-h-screen bg-white px-6 py-20">
          <div className="max-w-6xl mx-auto">
            <p className="font-mono text-[10px] tracking-[0.28em] uppercase text-ag-apex mb-8">
              Échelle de notation
            </p>
            <h2 className="font-sans font-bold text-ag-black text-[36px] tracking-[-0.03em] mb-12">
              Grades CIFSO 5000
            </h2>
            <div className="space-y-6">
              {grades.map((grade) => (
                <div
                  key={grade.grade}
                  className="flex items-start gap-6 p-6 rounded-xl border border-ag-border hover:border-ag-apex transition-colors"
                >
                  <div
                    className="shrink-0 w-16 h-16 rounded-lg flex items-center justify-center font-mono font-bold text-white text-lg"
                    style={{ backgroundColor: grade.color }}
                  >
                    {grade.grade}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-sans font-semibold text-ag-black text-[17px] mb-2">
                      {grade.name}
                    </h3>
                    <p className="font-sans text-[14px] text-ag-gray leading-relaxed">
                      {grade.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* PAGE 4 : Processus */}
        <section className="min-h-screen bg-ag-off-white px-6 py-20">
          <div className="max-w-6xl mx-auto">
            <p className="font-mono text-[10px] tracking-[0.28em] uppercase text-ag-apex mb-8">
              Processus de certification
            </p>
            <h2 className="font-sans font-bold text-ag-black text-[36px] tracking-[-0.03em] mb-12">
              6 étapes structurées
            </h2>
            <div className="space-y-8">
              {process.map((step) => (
                <div key={step.num} className="bg-white rounded-xl p-8 border border-ag-border">
                  <div className="flex items-start gap-6 mb-6">
                    <div className="shrink-0 w-14 h-14 bg-ag-apex rounded-lg flex items-center justify-center">
                      <span className="font-mono font-bold text-ag-navy text-sm">
                        {step.num}
                      </span>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-sans font-semibold text-ag-black text-[17px] mb-2">
                        {step.title}
                      </h3>
                      <p className="font-sans text-[14px] text-ag-gray leading-relaxed">
                        {step.desc}
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-ag-border">
                    <div>
                      <p className="font-mono text-[9px] tracking-[0.2em] uppercase text-ag-apex mb-2 font-semibold">
                        Inputs
                      </p>
                      <p className="font-sans text-[12px] text-ag-gray leading-relaxed">
                        {step.inputs}
                      </p>
                    </div>
                    <div>
                      <p className="font-mono text-[9px] tracking-[0.2em] uppercase text-ag-apex mb-2 font-semibold">
                        Outputs
                      </p>
                      <p className="font-sans text-[12px] text-ag-gray leading-relaxed">
                        {step.outputs}
                      </p>
                    </div>
                    <div>
                      <p className="font-mono text-[9px] tracking-[0.2em] uppercase text-ag-apex mb-2 font-semibold">
                        Outcomes
                      </p>
                      <p className="font-sans text-[12px] text-ag-gray leading-relaxed">
                        {step.outcomes}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* PAGE FINALE : Contact */}
        <section className="min-h-screen bg-ag-navy px-6 py-20 flex items-center justify-center">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-3 mb-8 px-6 py-3 rounded-full border border-ag-apex/30 bg-ag-apex/5">
              <div className="w-2 h-2 bg-ag-apex rounded-full animate-pulse" />
              <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-ag-apex">
                Prêt à certifier votre organisation ?
              </span>
            </div>

            <h2 className="font-sans font-bold text-white text-[48px] tracking-[-0.03em] leading-[1.1] mb-8">
              Obtenez votre<br />
              <span className="text-ag-apex">Certification CIFSO 5000</span>
            </h2>

            <p className="font-sans text-white/70 text-[16px] leading-relaxed mb-12 max-w-xl mx-auto">
              Soumettez votre organisation pour certification et recevez votre grade officiel sous 15 à 35 jours ouvrés.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/grade/submit"
                className="inline-flex items-center justify-center gap-2 bg-ag-apex text-ag-navy font-sans font-semibold text-[11px] tracking-[0.14em] uppercase px-8 py-4 rounded-lg hover:bg-ag-apex/90 transition-colors"
              >
                Soumettre pour certification
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 border border-white/25 text-white/70 font-sans font-semibold text-[11px] tracking-[0.14em] uppercase px-8 py-4 rounded-lg hover:border-white/60 hover:text-white transition-all"
              >
                Nous contacter
              </Link>
            </div>

            <div className="mt-20 pt-12 border-t border-white/10">
              <p className="font-sans text-white/40 text-sm mb-4">
                Aegryn SA — Certification indépendante d'actifs entreprises
              </p>
              <p className="font-sans text-white/30 text-xs">
                Genève, Suisse • aegryn.com • contact@aegryn.com
              </p>
            </div>
          </div>
        </section>

      </div>

      {/* Styles d'impression */}
      <style jsx global>{`
        @media print {
          @page {
            size: A4;
            margin: 0;
          }
          body {
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
          }
          section {
            page-break-after: always;
            page-break-inside: avoid;
          }
        }
      `}</style>
    </main>
  )
}
