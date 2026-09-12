'use client'

import { useRef } from 'react'
import { useTranslations } from 'next-intl'
import { Download, ArrowLeft, Check, TrendingUp, Shield, Award, Users, FileCheck, Target } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

export function CifsoBrochure() {
  const t = useTranslations('gradingSystem')
  const tG = useTranslations('grade.index')
  const contentRef = useRef<HTMLDivElement>(null)

  const handleDownload = () => {
    if (typeof window !== 'undefined') {
      window.print()
    }
  }

  const grades = t.raw('grades') as Array<{
    grade: string
    label: string
    profile: string
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
            {tG('wpNavBack')}
          </Link>
          <button
            onClick={handleDownload}
            className="inline-flex items-center gap-2 bg-ag-apex text-ag-navy font-sans font-semibold text-[11px] tracking-[0.14em] uppercase px-6 py-3 rounded-lg hover:bg-ag-apex/90 transition-colors"
          >
            <Download size={14} />
            {tG('wpNavPrint')}
          </button>
        </div>
      </div>

      {/* Contenu scrollable */}
      <div ref={contentRef} className="pt-20 print:pt-0">
        
        {/* COVER PAGE - Premium */}
        <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-ag-navy via-[#1a2845] to-ag-navy overflow-hidden">
          {/* Image de fond premium */}
          <div className="absolute inset-0">
            <Image
              src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2940&auto=format&fit=crop"
              alt="Business analytics and valuation"
              fill
              className="object-cover opacity-20"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-br from-ag-navy/95 via-[#1a2845]/90 to-ag-navy/95" />
          </div>

          {/* Motif géométrique */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: `
                linear-gradient(to right, rgba(90, 221, 164, 0.4) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(90, 221, 164, 0.4) 1px, transparent 1px)
              `,
              backgroundSize: '80px 80px'
            }} />
          </div>

          {/* Cercles décoratifs */}
          <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-ag-apex/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-ag-apex/5 rounded-full blur-3xl" />

          <div className="relative z-10 text-center px-6 max-w-5xl">
            {/* Badge premium */}
            <div className="inline-flex items-center gap-3 mb-8 px-8 py-4 rounded-full border border-ag-apex/40 bg-ag-apex/10 backdrop-blur-sm">
              <div className="w-2 h-2 bg-ag-apex rounded-full animate-pulse" />
              <span className="font-mono text-[11px] tracking-[0.3em] uppercase text-ag-apex font-semibold">
                {t('version')}
              </span>
            </div>

            {/* Titre principal */}
            <h1 className="font-sans font-bold text-white text-[clamp(56px,10vw,120px)] leading-[0.9] tracking-[-0.05em] mb-8">
              Certification<br />
              <span className="text-ag-apex">CIFSO 5000</span>
            </h1>

            {/* Sous-titre premium */}
            <p className="font-sans text-white/80 text-[clamp(18px,2.5vw,28px)] leading-relaxed mb-6 font-light">
              Le standard de certification<br className="hidden sm:block" /> de la valeur organisationnelle
            </p>

            {/* Tagline */}
            <div className="max-w-3xl mx-auto px-10 py-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md mb-24">
              <p className="font-sans text-white text-[15px] sm:text-[16px] leading-relaxed">
                {t('whyDesc')}
              </p>
            </div>
          </div>

          {/* Footer cover */}
          <div className="absolute bottom-10 left-0 right-0 z-20">
            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-white/40 text-xs sm:text-sm px-6">
              <span className="whitespace-nowrap font-medium">Aegryn SA</span>
              <span className="hidden sm:inline">•</span>
              <span className="whitespace-nowrap">Genève, Suisse</span>
              <span className="hidden sm:inline">•</span>
              <span className="whitespace-nowrap">aegryn.com</span>
            </div>
          </div>
        </section>

        {/* PAGE 1 : Value Proposition */}
        <section className="min-h-screen bg-white px-6 py-24 flex items-center">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              {/* Image */}
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=2940&auto=format&fit=crop"
                  alt="Business meeting"
                  fill
                  className="object-cover"
                />
              </div>

              {/* Contenu */}
              <div>
                <p className="font-mono text-[10px] tracking-[0.28em] uppercase text-ag-gray-light mb-4">
                  Introduction
                </p>
                <h2 className="font-sans font-bold text-ag-black text-[42px] tracking-[-0.03em] leading-[1.1] mb-8">
                  {t('whyTitle')}
                </h2>
                <div className="space-y-6">
                  <p className="font-sans text-[18px] text-ag-gray leading-relaxed">
                    {t('intro')}
                  </p>
                  <p className="font-sans text-[16px] text-ag-gray leading-relaxed">
                    {t('whyDesc')}
                  </p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-6 mt-12 pt-8 border-t border-ag-border">
                  <div>
                    <p className="font-sans font-bold text-ag-apex text-[32px] mb-2">5</p>
                    <p className="font-sans text-[13px] text-ag-gray">Dimensions évaluées</p>
                  </div>
                  <div>
                    <p className="font-sans font-bold text-ag-apex text-[32px] mb-2">100</p>
                    <p className="font-sans text-[13px] text-ag-gray">Points de notation</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* PAGE 2 : Cas d'usage avec images */}
        <section className="min-h-screen bg-gradient-to-b from-ag-off-white to-white px-6 py-24">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <p className="font-mono text-[10px] tracking-[0.28em] uppercase text-ag-gray-light mb-4">
                Applications
              </p>
              <h2 className="font-sans font-bold text-ag-black text-[48px] tracking-[-0.03em] mb-6">
                {t('useCasesTitle')}
              </h2>
              <p className="font-sans text-[18px] text-ag-gray max-w-3xl mx-auto leading-relaxed">
                La certification CIFSO 5000 répond aux besoins stratégiques des dirigeants et investisseurs
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {useCases.map((useCase, i) => {
                const icons = [TrendingUp, Shield, Target, Users, FileCheck, Award]
                const Icon = icons[i] || TrendingUp
                
                return (
                  <div key={i} className="bg-white border border-ag-border rounded-2xl p-8 hover:border-ag-apex hover:shadow-lg transition-all">
                    <div className="w-14 h-14 bg-ag-apex/10 rounded-xl flex items-center justify-center mb-6">
                      <Icon size={24} className="text-ag-apex" />
                    </div>
                    <h3 className="font-sans font-semibold text-ag-black text-[18px] mb-4">
                      {useCase.title}
                    </h3>
                    <p className="font-sans text-[14px] text-ag-gray leading-relaxed">
                      {useCase.desc}
                    </p>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* PAGE 3 : Échelle de grades premium */}
        <section className="min-h-screen bg-white px-6 py-24">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <p className="font-mono text-[10px] tracking-[0.28em] uppercase text-ag-gray-light mb-4">
                Échelle de notation
              </p>
              <h2 className="font-sans font-bold text-ag-black text-[48px] tracking-[-0.03em] mb-6">
                Grades CIFSO 5000
              </h2>
              <p className="font-sans text-[18px] text-ag-gray max-w-3xl mx-auto leading-relaxed">
                Une échelle à 5 niveaux pour une évaluation précise et différenciante
              </p>
            </div>

            <div className="space-y-6">
              {grades.map((grade, index) => (
                <div
                  key={grade.grade}
                  className="group flex items-start gap-8 p-8 rounded-2xl border-2 border-ag-border hover:border-ag-apex transition-all hover:shadow-xl"
                >
                  <div
                    className="shrink-0 w-20 h-20 rounded-2xl flex items-center justify-center font-mono font-bold text-white text-xl shadow-lg"
                    style={{ backgroundColor: grade.color }}
                  >
                    {grade.grade}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-3">
                      <h3 className="font-sans font-bold text-ag-black text-[20px]">
                        {grade.label}
                      </h3>
                      {index === 0 && (
                        <span className="px-3 py-1 bg-ag-apex/10 text-ag-apex text-xs font-mono font-semibold rounded-full">
                          TOP 5%
                        </span>
                      )}
                    </div>
                    <p className="font-sans text-[15px] text-ag-gray leading-relaxed">
                      {grade.profile}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* PAGE 4 : Processus avec visuel */}
        <section className="min-h-screen bg-gradient-to-b from-ag-off-white to-white px-6 py-24">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <p className="font-mono text-[10px] tracking-[0.28em] uppercase text-ag-gray-light mb-4">
                Méthodologie
              </p>
              <h2 className="font-sans font-bold text-ag-black text-[48px] tracking-[-0.03em] mb-6">
                Processus de certification
              </h2>
              <p className="font-sans text-[18px] text-ag-gray max-w-3xl mx-auto leading-relaxed">
                6 étapes structurées pour une évaluation rigoureuse et transparente
              </p>
            </div>

            <div className="space-y-8">
              {process.map((step, index) => (
                <div key={step.num} className="bg-white rounded-2xl p-10 border border-ag-border shadow-sm">
                  <div className="flex items-start gap-8 mb-8">
                    <div className="shrink-0 w-16 h-16 bg-ag-apex rounded-2xl flex items-center justify-center">
                      <span className="font-mono font-bold text-ag-navy text-lg">
                        {step.num}
                      </span>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-sans font-bold text-ag-black text-[20px] mb-3">
                        {step.title}
                      </h3>
                      <p className="font-sans text-[15px] text-ag-gray leading-relaxed">
                        {step.desc}
                      </p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8 border-t border-ag-border">
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-6 h-6 bg-ag-apex/10 rounded flex items-center justify-center">
                          <span className="text-ag-apex text-xs">→</span>
                        </div>
                        <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-ag-apex font-semibold">
                          {t('processInputs')}
                        </p>
                      </div>
                      <p className="font-sans text-[13px] text-ag-gray leading-relaxed">
                        {step.inputs}
                      </p>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-6 h-6 bg-ag-apex/10 rounded flex items-center justify-center">
                          <Check size={12} className="text-ag-apex" />
                        </div>
                        <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-ag-apex font-semibold">
                          {t('processOutputs')}
                        </p>
                      </div>
                      <p className="font-sans text-[13px] text-ag-gray leading-relaxed">
                        {step.outputs}
                      </p>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-6 h-6 bg-ag-apex/10 rounded flex items-center justify-center">
                          <Award size={12} className="text-ag-apex" />
                        </div>
                        <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-ag-apex font-semibold">
                          {t('processOutcomes')}
                        </p>
                      </div>
                      <p className="font-sans text-[13px] text-ag-gray leading-relaxed">
                        {step.outcomes}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* PAGE 5 : Bénéfices clients */}
        <section className="min-h-screen bg-white px-6 py-24 flex items-center">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <p className="font-mono text-[10px] tracking-[0.28em] uppercase text-ag-apex mb-4">
                  Avantages
                </p>
                <h2 className="font-sans font-bold text-ag-black text-[42px] tracking-[-0.03em] leading-[1.1] mb-8">
                  Pourquoi choisir<br />CIFSO 5000 ?
                </h2>
                
                <div className="space-y-6">
                  {[
                    {
                      title: 'Indépendance garantie',
                      desc: 'Évaluation par des analystes certifiés, sans conflit d\'intérêt'
                    },
                    {
                      title: 'Méthodologie transparente',
                      desc: 'Processus documenté et reproductible, auditabilité complète'
                    },
                    {
                      title: 'Reconnaissance internationale',
                      desc: 'Standard reconnu par les investisseurs et acquéreurs européens'
                    },
                    {
                      title: 'Accompagnement continu',
                      desc: 'Support dédié tout au long du processus de certification'
                    }
                  ].map((benefit, i) => (
                    <div key={i} className="flex gap-4">
                      <div className="shrink-0 w-8 h-8 bg-ag-apex/10 rounded-lg flex items-center justify-center mt-1">
                        <Check size={16} className="text-ag-apex" />
                      </div>
                      <div>
                        <h3 className="font-sans font-semibold text-ag-black text-[16px] mb-2">
                          {benefit.title}
                        </h3>
                        <p className="font-sans text-[14px] text-ag-gray leading-relaxed">
                          {benefit.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="relative aspect-[3/4] rounded-2xl overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1553877522-43269d4ea984?q=80&w=2940&auto=format&fit=crop"
                  alt="Team collaboration"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* PAGE FINALE : Contact premium */}
        <section className="min-h-screen bg-gradient-to-br from-ag-navy via-[#1a2845] to-ag-navy px-6 py-24 flex items-center justify-center relative overflow-hidden">
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0" style={{
              backgroundImage: `
                linear-gradient(to right, rgba(90, 221, 164, 0.3) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(90, 221, 164, 0.3) 1px, transparent 1px)
              `,
              backgroundSize: '60px 60px'
            }} />
          </div>

          <div className="max-w-4xl mx-auto text-center relative z-10">
            <div className="inline-flex items-center gap-3 mb-8 px-8 py-4 rounded-full border border-ag-apex/40 bg-ag-apex/10 backdrop-blur-sm">
              <div className="w-2 h-2 bg-ag-apex rounded-full animate-pulse" />
              <span className="font-mono text-[11px] tracking-[0.3em] uppercase text-ag-apex font-semibold">
                Prêt à certifier votre organisation ?
              </span>
            </div>

            <h2 className="font-sans font-bold text-white text-[56px] tracking-[-0.04em] leading-[1.05] mb-8">
              Obtenez votre<br />
              <span className="text-ag-apex">Certification CIFSO 5000</span>
            </h2>

            <p className="font-sans text-white/70 text-[18px] leading-relaxed mb-12 max-w-2xl mx-auto">
              Soumettez votre organisation pour certification et recevez votre grade officiel sous 15 à 35 jours ouvrés.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <Link
                href="/grade/submit"
                className="inline-flex items-center justify-center gap-2 bg-ag-apex text-ag-navy font-sans font-semibold text-[13px] tracking-[0.14em] uppercase px-10 py-5 rounded-xl hover:bg-ag-apex/90 transition-all shadow-lg hover:shadow-xl"
              >
                Soumettre pour certification
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 border-2 border-white/30 text-white hover:border-white hover:bg-white/10 font-sans font-semibold text-[13px] tracking-[0.14em] uppercase px-10 py-5 rounded-xl transition-all backdrop-blur-sm"
              >
                Nous contacter
              </Link>
            </div>

            <div className="pt-12 border-t border-white/10">
              <p className="font-sans text-white/50 text-sm mb-4 font-medium">
                Aegryn SA — Certification indépendante d'actifs entreprises
              </p>
              <p className="font-sans text-white/30 text-xs">
                Genève, Suisse • aegryn.com • contact@aegryn.com
              </p>
            </div>
          </div>
        </section>

      </div>
    </main>
  )
}
