'use client'

import { useEffect, useRef }         from 'react'
import Link                          from 'next/link'
import Image                         from 'next/image'
import { useTranslations, useLocale } from 'next-intl'
import { ArrowUpRight, Check, FileText, Download } from 'lucide-react'
import { gsap }                      from '@/lib/gsap'

const _GRADE_COLORS: Record<string, string> = {
  '#5ADDA4': '#5ADDA4',
  '#C9A84C': '#C9A84C',
  '#9BA8B0': '#9BA8B0',
  '#4A90D9': '#4A90D9',
  '#D4820A': '#D4820A',
}

type CifsItem = {
  code: string
  name: string
  full: string
  weight: string
  desc: string
  criteria: string[]
}

type GradeItem = {
  grade: string
  label: string
  range: string
  color: string
  rarity: string
  profile: string
  typical: string
  subcodes: string[]
}

type SubcodeRow = {
  code: string
  label: string
  desc: string
}

type ExampleItem = {
  part: string
  meaning: string
}

type ProcessStep = {
  num: string
  title: string
  desc: string
  inputs: string
  outputs: string
  outcomes: string
}

type Principle = {
  title: string
  desc: string
}

type MaturityRuleItem = {
  tier: string
  rule: string
}

export function GradingSystemPage() {
  const t         = useTranslations('gradingSystem')
  const tG        = useTranslations('grade.index')
  const locale    = useLocale()
  const heroRef   = useRef<HTMLDivElement>(null)
  const cifsRef   = useRef<HTMLElement>(null)
  const gradesRef = useRef<HTMLElement>(null)
  const processRef = useRef<HTMLElement>(null)

  const cifs      = t.raw('cifs')      as CifsItem[]
  const grades    = t.raw('grades')    as GradeItem[]
  const subcodes  = t.raw('subcodeTable') as SubcodeRow[]
  const examples  = t.raw('exampleItems') as ExampleItem[]
  const process   = t.raw('process')  as ProcessStep[]
  const principles = t.raw('principles') as Principle[]
  const refusalConditions = t.raw('refusalConditions') as string[]
  const maturityRules = t.raw('maturityRules') as MaturityRuleItem[]

  useEffect(() => {
    const ctxHero = gsap.context(() => {
      gsap.from('.gs-hero-label', { opacity: 0, y: 16, duration: 0.7, ease: 'expo.out', delay: 0.1 })
      gsap.from('.gs-hero-title', { opacity: 0, y: 28, duration: 0.8, ease: 'expo.out', delay: 0.25 })
      gsap.from('.gs-hero-intro', { opacity: 0, y: 20, duration: 0.7, ease: 'expo.out', delay: 0.45 })
      gsap.from('.gs-hero-version', { opacity: 0, duration: 0.5, delay: 0.6 })
    }, heroRef)

    const ctxCifs = gsap.context(() => {
      gsap.fromTo('.cifs-card',
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, stagger: 0.1, ease: 'expo.out', duration: 0.65,
          scrollTrigger: { trigger: cifsRef.current, start: 'top 85%', once: true } }
      )
    }, cifsRef)

    const ctxGrades = gsap.context(() => {
      gsap.fromTo('.grade-row',
        { opacity: 0, x: -20 },
        { opacity: 1, x: 0, stagger: 0.08, ease: 'expo.out', duration: 0.6,
          scrollTrigger: { trigger: gradesRef.current, start: 'top 85%', once: true } }
      )
    }, gradesRef)

    const ctxProcess = gsap.context(() => {
      gsap.fromTo('.process-step',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, stagger: 0.1, ease: 'expo.out', duration: 0.6,
          scrollTrigger: { trigger: processRef.current, start: 'top 85%', once: true } }
      )
    }, processRef)

    return () => {
      ctxHero.revert()
      ctxCifs.revert()
      ctxGrades.revert()
      ctxProcess.revert()
    }
  }, [])

  return (
    <main id="main" className="bg-ag-white">

      {/* ── HERO ── */}
      <section ref={heroRef} className="bg-ag-navy pt-28 pb-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-10">
            <div className="max-w-3xl">
              <p className="gs-hero-label font-sans font-semibold text-[10px] tracking-[0.3em] uppercase text-ag-apex mb-6 flex items-center gap-3">
                <span className="w-8 h-px bg-ag-apex/40 inline-block" />
                {t('label')}
              </p>
              <h1
                className="gs-hero-title font-sans font-bold text-white leading-[1.02] tracking-[-0.035em] whitespace-pre-line mb-8"
                style={{ fontSize: 'clamp(48px,6.5vw,96px)' }}
              >
                {t('title')}
              </h1>
              <p className="gs-hero-intro font-sans text-[16px] text-white/60 leading-relaxed max-w-2xl">
                {t('intro')}
              </p>
            </div>
            <div className="gs-hero-version shrink-0 flex flex-col gap-3">
              <div className="rounded-lg border border-white/10 px-5 py-4 text-right">
                <p className="font-mono text-[11px] tracking-[0.22em] uppercase text-white/60 mb-1">
                  {t('downloadLabel')}
                </p>
                <p className="font-mono text-[11px] tracking-[0.1em] text-ag-apex">
                  {t('version')}
                </p>
              </div>
              <Link
                href={`/${locale}/grade/brochure`}
                className="rounded-lg inline-flex items-center gap-2 bg-ag-apex/10 border border-ag-apex/30 text-ag-apex font-mono text-[10px] tracking-[0.14em] uppercase px-5 py-3 hover:bg-ag-apex/20 transition-colors"
              >
                <FileText size={11} />
                {tG('whitepaperCta')}
              </Link>
            </div>
          </div>

          {/* Score bar visuelle */}
          <div className="mt-20 flex items-center gap-0 border border-white/8">
            {grades.map((g) => (
              <div
                key={g.grade}
                className="flex-1 h-1.5"
                style={{ backgroundColor: g.color, opacity: 0.85 }}
              />
            ))}
          </div>
          <div className="flex items-center gap-0 mt-1">
            {grades.map((g) => (
              <div key={g.grade} className="flex-1 text-center">
                <span
                  className="font-mono text-[11px] tracking-[0.08em]"
                  style={{ color: g.color }}
                >
                  {g.grade}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── POURQUOI CIFSO ── */}
      <section className="py-28 px-6 border-t border-ag-border">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-sans font-bold text-ag-black text-[32px] tracking-[-0.02em] mb-6">
            {t('whyTitle')}
          </h2>
          <p className="font-sans text-[16px] text-ag-gray leading-relaxed">
            {t('whyDesc')}
          </p>
        </div>
      </section>

      {/* ── CAS D'USAGE ── */}
      <section className="py-28 px-6 border-t border-ag-border">
        <div className="max-w-7xl mx-auto">
          <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-ag-gray-light mb-16">
            {t('useCasesTitle')}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {(t.raw('useCases') as Array<{title: string; desc: string}>).map((useCase, i) => (
              <div key={i} className="border border-ag-border rounded-lg p-6 hover:border-ag-apex transition-colors">
                <h3 className="font-sans font-semibold text-ag-black text-[15px] mb-3">
                  {useCase.title}
                </h3>
                <p className="font-sans text-[13px] text-ag-gray leading-relaxed">
                  {useCase.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BROCHURE CIFSO 5000 ── */}
      <section className="py-28 px-6 border-t border-ag-border bg-gradient-to-br from-ag-navy/5 to-transparent">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Preview image */}
            <div className="relative aspect-[3/4] lg:aspect-[4/5] rounded-2xl overflow-hidden border border-ag-border shadow-2xl">
              <Image
                src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2426&auto=format&fit=crop"
                alt="CIFSO 5000 Brochure Cover"
                fill
                className="object-cover opacity-15"
              />
              <div className="absolute inset-0 bg-gradient-to-br from-ag-navy via-ag-navy to-[#1a2332]" />
              
              {/* Cover content */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-8">
                <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full border border-ag-apex/30 bg-ag-apex/5">
                  <div className="w-1.5 h-1.5 bg-ag-apex rounded-full animate-pulse" />
                  <span className="font-mono text-[9px] tracking-[0.3em] uppercase text-ag-apex">
                    {t('version')}
                  </span>
                </div>
                <h3 className="font-sans font-bold text-white text-[clamp(32px,5vw,48px)] leading-[0.95] tracking-[-0.04em] mb-4">
                  Certification<br />
                  <span className="text-ag-apex">CIFSO 5000</span>
                </h3>
                <p className="font-sans text-white/70 text-sm max-w-xs">
                  Valorisation d'actifs entreprises
                </p>
              </div>
            </div>

            {/* Content */}
            <div>
              <p className="font-mono text-[10px] tracking-[0.28em] uppercase text-ag-gray-light mb-4">
                Documentation complète
              </p>
              <h2 className="font-sans font-bold text-ag-black text-[36px] tracking-[-0.03em] leading-[1.1] mb-6">
                Brochure CIFSO 5000
              </h2>
              <p className="font-sans text-[16px] text-ag-gray leading-relaxed mb-8">
                {t('whitepaperDesc')}
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href={`/${locale}/grade/brochure`}
                  className="inline-flex items-center justify-center gap-2 bg-ag-apex text-ag-navy font-sans font-semibold text-[11px] tracking-[0.14em] uppercase px-6 py-4 rounded-lg hover:bg-ag-apex/90 transition-colors"
                >
                  <FileText size={14} />
                  Consulter la brochure
                </Link>
                <button
                  onClick={() => window.open(`/${locale}/grade/brochure`, '_blank')}
                  className="inline-flex items-center justify-center gap-2 border border-ag-border text-ag-gray hover:text-ag-black hover:border-ag-black font-sans font-semibold text-[11px] tracking-[0.14em] uppercase px-6 py-4 rounded-lg transition-all"
                >
                  <Download size={14} />
                  Télécharger PDF
                </button>
              </div>

              {/* Features list */}
              <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  'Processus détaillé',
                  'Échelle de grades',
                  'Cas d\'usage',
                  'Méthodologie complète'
                ].map((feature, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <Check size={16} className="text-ag-apex shrink-0" />
                    <span className="font-sans text-[13px] text-ag-gray">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CADRE CIFSO ── */}
      <section ref={cifsRef} className="py-28 px-6 border-t border-ag-border">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16">
            <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-ag-gray-light mb-4">
              {t('cifsTitle')}
            </p>
            <p className="font-sans text-[16px] text-ag-gray max-w-2xl leading-relaxed">
              {t('cifsDesc')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {cifs.map((dim) => (
              <div key={dim.code} className="cifs-card bg-white border border-ag-border rounded-2xl p-10 flex flex-col gap-6">
                {/* Header */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-ag-navy flex items-center justify-center shrink-0">
                      <span className="font-sans font-bold text-ag-apex text-[22px] leading-none">
                        {dim.code}
                      </span>
                    </div>
                    <div>
                      <p className="font-mono text-[10px] tracking-[0.18em] uppercase text-ag-gray-light mb-0.5">
                        {dim.name}
                      </p>
                      <p className="font-sans font-semibold text-ag-black text-[15px] tracking-[-0.01em]">
                        {dim.full}
                      </p>
                    </div>
                  </div>
                  <span className="font-mono text-[12px] tracking-[0.1em] text-ag-apex font-semibold shrink-0 mt-1">
                    {dim.weight}
                  </span>
                </div>

                {/* Description */}
                <p className="font-sans text-[13px] text-ag-gray leading-relaxed">
                  {dim.desc}
                </p>

                {/* Criteria */}
                <ul className="flex flex-col gap-2 pt-2 border-t border-ag-border">
                  {dim.criteria.map((c) => (
                    <li key={c} className="flex items-start gap-2.5">
                      <Check
                        size={11}
                        className="text-ag-apex shrink-0 mt-[3px]"
                        strokeWidth={2.5}
                      />
                      <span className="font-sans text-[12px] text-ag-gray leading-snug">{c}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── GRADES ── */}
      <section ref={gradesRef} className="rounded-lg py-28 px-6 border-t border-ag-border">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16">
            <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-ag-gray-light mb-4">
              {t('gradesTitle')}
            </p>
            <p className="font-sans text-[16px] text-ag-gray max-w-2xl leading-relaxed">
              {t('gradesDesc')}
            </p>
          </div>

          <div className="flex flex-col gap-px bg-ag-border border border-ag-border rounded-2xl overflow-hidden">
            {grades.map((g) => (
              <div
                key={g.grade}
                className="grade-row bg-ag-white p-8 md:p-10 grid grid-cols-1 md:grid-cols-[200px_1fr_220px] gap-8 items-start hover:bg-ag-off-white transition-colors"
              >
                {/* Grade identity */}
                <div>
                  <div
                    className="inline-block font-mono text-[11px] tracking-[0.15em] font-bold px-3 py-1.5 mb-3 border"
                    style={{ color: g.color, borderColor: `${g.color}40` }}
                  >
                    {g.grade}
                  </div>
                  <p className="font-sans font-bold text-ag-black text-[20px] tracking-[-0.02em] mb-1">
                    {g.label}
                  </p>
                  <p className="font-mono text-[11px] text-ag-gray tracking-[0.06em]">
                    {g.range}
                  </p>
                  <p
                    className="font-mono text-[10px] tracking-[0.1em] mt-3 uppercase"
                    style={{ color: g.color }}
                  >
                    {g.rarity}
                  </p>
                </div>

                {/* Profile + typical */}
                <div className="flex flex-col gap-4">
                  <p className="font-sans text-[14px] text-ag-black leading-relaxed font-medium">
                    {g.profile}
                  </p>
                  <p className="font-sans text-[13px] text-ag-gray leading-relaxed italic">
                    {g.typical}
                  </p>
                </div>

                {/* Subcodes */}
                <div className="flex flex-col gap-2">
                  <p className="font-mono text-[11px] tracking-[0.2em] uppercase text-ag-gray-light mb-1">
                    {t('subcodesTypicalLabel')}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {g.subcodes.map((sc) => (
                      <span
                        key={sc}
                        className="font-mono text-[10px] tracking-[0.1em] border px-2 py-0.5"
                        style={{ color: g.color, borderColor: `${g.color}30` }}
                      >
                        {sc}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SUBCODES ── */}
      <section className="py-28 px-6 border-t border-ag-border">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">

          {/* Table sous-codes */}
          <div>
            <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-ag-gray-light mb-4">
              {t('subcodesTitle')}
            </p>
            <p className="font-sans text-[15px] text-ag-gray mb-10 leading-relaxed max-w-lg">
              {t('subcodesDesc')}
            </p>
            <div className="border border-ag-border rounded-2xl">
              <div className="grid grid-cols-[56px_120px_1fr] border-b border-ag-border bg-ag-light-gray">
                <p className="font-mono text-[11px] tracking-[0.18em] uppercase text-ag-gray-light px-5 py-3">{t('subcodesColCode')}</p>
                <p className="font-mono text-[11px] tracking-[0.18em] uppercase text-ag-gray-light px-4 py-3">{t('subcodesColLabel')}</p>
                <p className="font-mono text-[11px] tracking-[0.18em] uppercase text-ag-gray-light px-4 py-3">{t('subcodesColDef')}</p>
              </div>
              {subcodes.map(({ code, label, desc }) => (
                <div
                  key={code}
                  className="grid grid-cols-[56px_120px_1fr] border-b border-ag-border last:border-0 bg-ag-white hover:bg-ag-off-white transition-colors"
                >
                  <p className="font-mono text-[13px] font-bold text-ag-apex px-5 py-4">{code}</p>
                  <p className="font-sans font-semibold text-ag-black text-[13px] px-4 py-4">{label}</p>
                  <p className="font-sans text-[13px] text-ag-gray px-4 py-4 leading-snug">{desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Exemple code complet */}
          <div>
            <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-ag-gray-light mb-4">
              {t('exampleTitle')}
            </p>
            <p className="font-sans text-[15px] text-ag-gray mb-10 leading-relaxed">
              {t('exampleDesc')}
            </p>

            {/* Code badge */}
            <div className="rounded-lg bg-ag-navy px-8 py-6 mb-8 font-mono text-[14px] tracking-[0.08em] text-ag-apex">
              C1-D01 <span className="text-white/60 mx-2">|</span>
              I2-M02 <span className="text-white/60 mx-2">|</span>
              F1-A01 <span className="text-white/60 mx-2">|</span>
              S2
            </div>

            <div className="flex flex-col gap-0 border border-ag-border rounded-2xl overflow-hidden">
              {examples.map(({ part, meaning }) => (
                <div
                  key={part}
                  className="flex items-start gap-0 border-b border-ag-border last:border-0"
                >
                  <div className="rounded-lg w-28 shrink-0 px-5 py-4 border-r border-ag-border bg-ag-off-white">
                    <span className="font-mono text-[12px] tracking-[0.1em] text-ag-apex font-semibold">
                      {part}
                    </span>
                  </div>
                  <div className="px-5 py-4">
                    <p className="font-sans text-[13px] text-ag-gray leading-snug">{meaning}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── PROCESSUS ── */}
      <section ref={processRef} className="rounded-lg py-28 px-6 border-t border-ag-border">
        <div className="max-w-7xl mx-auto">
          <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-ag-gray-light mb-16">
            {t('processTitle')}
          </p>

          <div className="relative">
            {/* Ligne verticale */}
            <div className="absolute left-[28px] top-0 bottom-0 w-px bg-ag-border hidden md:block" />

            <div className="flex flex-col gap-0">
              {process.map((step, i) => (
                <div
                  key={step.num}
                  className="process-step flex gap-8 md:gap-14 items-start pb-12 last:pb-0"
                >
                  {/* Numéro cercle */}
                  <div className="relative shrink-0 z-10">
                    <div className="w-14 h-14 bg-ag-white border border-ag-border flex items-center justify-center rounded-lg">
                      <span className="font-mono text-[13px] font-bold text-ag-black tracking-[0.06em]">
                        {step.num}
                      </span>
                    </div>
                    {i < process.length - 1 && (
                      <div className="absolute top-14 left-1/2 -translate-x-1/2 w-px flex-1 bg-ag-border h-12 hidden md:block" />
                    )}
                  </div>

                  {/* Contenu */}
                  <div className="pt-3 pb-4 flex-1 border-b border-ag-border last:border-0">
                    <h3 className="font-sans font-semibold text-ag-black text-[17px] tracking-[-0.02em] mb-3">
                      {step.title}
                    </h3>
                    <p className="font-sans text-[14px] text-ag-gray leading-relaxed max-w-2xl mb-6">
                      {step.desc}
                    </p>

                    {/* Inputs / Outputs / Outcomes (approche Bureau Veritas) */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6 pt-6 border-t border-ag-border">
                      <div>
                        <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-ag-apex mb-2 font-semibold">
                          {t('processInputs')}
                        </p>
                        <p className="font-sans text-[12px] text-ag-gray leading-relaxed">
                          {step.inputs}
                        </p>
                      </div>
                      <div>
                        <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-ag-apex mb-2 font-semibold">
                          {t('processOutputs')}
                        </p>
                        <p className="font-sans text-[12px] text-ag-gray leading-relaxed">
                          {step.outputs}
                        </p>
                      </div>
                      <div>
                        <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-ag-apex mb-2 font-semibold">
                          {t('processOutcomes')}
                        </p>
                        <p className="font-sans text-[12px] text-ag-gray leading-relaxed">
                          {step.outcomes}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── PRINCIPES D'INDÉPENDANCE ── */}
      <section className="py-28 px-6 border-t border-ag-border">
        <div className="max-w-7xl mx-auto">
          <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-ag-gray-light mb-16">
            {t('principlesTitle')}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-ag-border border border-ag-border rounded-2xl overflow-hidden">
            {principles.map(({ title, desc }, i) => (
              <div key={title} className="bg-ag-white p-10 flex gap-6">
                <div className="w-8 shrink-0 mt-0.5">
                  <span className="font-mono text-[11px] tracking-[0.1em] text-ag-gray-light">
                    0{i + 1}
                  </span>
                </div>
                <div>
                  <h3 className="font-sans font-semibold text-ag-black text-[17px] tracking-[-0.02em] mb-3">
                    {title}
                  </h3>
                  <p className="font-sans text-[13px] text-ag-gray leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SCORING TABLE RÉCAP ── */}
      <section className="rounded-lg py-20 px-6 bg-ag-navy border-t border-ag-border">
        <div className="max-w-7xl mx-auto">
          <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-ag-apex/60 mb-10">
            {t('version')}
          </p>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="font-mono text-[11px] tracking-[0.2em] uppercase text-white/60 text-left px-6 py-3 font-normal">{t('tableColGrade')}</th>
                  <th className="font-mono text-[11px] tracking-[0.2em] uppercase text-white/60 text-left px-6 py-3 font-normal">{t('tableColLabel')}</th>
                  <th className="font-mono text-[11px] tracking-[0.2em] uppercase text-white/60 text-left px-6 py-3 font-normal">{t('tableColScore')}</th>
                  <th className="font-mono text-[11px] tracking-[0.2em] uppercase text-white/60 text-left px-6 py-3 font-normal">{t('tableColRarity')}</th>
                </tr>
              </thead>
              <tbody>
                {grades.map((g) => (
                  <tr key={g.grade} className="border-b border-white/5 hover:bg-white/[0.03] transition-colors">
                    <td className="px-6 py-4">
                      <span
                        className="font-mono text-[12px] tracking-[0.12em] font-bold"
                        style={{ color: g.color }}
                      >
                        {g.grade}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-sans text-[13px] text-white/70">{g.label}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-mono text-[12px] text-white/65">{g.range}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className="font-mono text-[11px] tracking-[0.08em]"
                        style={{ color: g.color, opacity: 0.8 }}
                      >
                        {g.rarity}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── REFUS AUTOMATIQUE ── */}
      <section className="rounded-lg py-28 px-6 border-t border-ag-border">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_1.6fr] gap-16 items-start">
          <div>
            <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-ag-gray-light mb-4">
              {t('refusalTitle')}
            </p>
            <p className="font-sans text-[15px] text-ag-gray leading-relaxed">
              {t('refusalDesc')}
            </p>
          </div>
          <div className="flex flex-col gap-0 border border-ag-border rounded-2xl overflow-hidden">
            {refusalConditions.map((cond, i) => (
              <div key={i} className="rounded-lg flex items-start gap-4 px-6 py-5 bg-ag-white border-b border-ag-border last:border-0">
                <span className="font-mono text-[11px] font-bold text-red-600 shrink-0 mt-0.5">✕</span>
                <p className="font-sans text-[13px] text-ag-gray leading-relaxed">{cond}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ÉLIGIBILITÉ PAR MATURITÉ ── */}
      <section className="py-28 px-6 border-t border-ag-border">
        <div className="max-w-7xl mx-auto">
          <div className="mb-14 max-w-2xl">
            <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-ag-gray-light mb-4">
              {t('maturityTitle')}
            </p>
            <p className="font-sans text-[16px] text-ag-gray leading-relaxed">
              {t('maturityDesc')}
            </p>
          </div>
          <div className="flex flex-col gap-px bg-ag-border border border-ag-border rounded-2xl overflow-hidden">
            {maturityRules.map((m, i) => (
              <div key={i} className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-4 md:gap-8 bg-ag-white p-8">
                <p className="font-sans font-semibold text-ag-black text-[14px] leading-snug">{m.tier}</p>
                <p className="font-sans text-[13px] text-ag-gray leading-relaxed">{m.rule}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── DISCLAIMER ── */}
      <section className="rounded-lg py-16 px-6 border-t border-ag-border bg-ag-navy">
        <div className="max-w-7xl mx-auto">
          <p className="font-mono text-[11px] tracking-[0.2em] uppercase text-ag-apex/60 mb-3">
            {t('disclaimerTitle')}
          </p>
          <p className="font-sans text-[13px] text-white/65 leading-relaxed max-w-3xl">
            {t('disclaimerText')}
          </p>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24 px-6 border-t border-ag-border">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-10">
          <div className="max-w-lg">
            <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-ag-gray-light mb-4">
              {t('ctaTitle')}
            </p>
            <p className="font-sans font-bold text-ag-black text-[24px] tracking-[-0.02em] leading-snug">
              {t('ctaDesc')}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <Link
              href="/grade/submit"
              className="rounded-lg inline-flex items-center gap-2 bg-ag-navy text-white font-mono text-[11px] tracking-[0.14em] uppercase px-7 py-4 hover:bg-ag-navy-mid transition-colors"
            >
              {t('ctaPrimary')} <ArrowUpRight size={12} />
            </Link>
            <Link
              href="/grade/partners"
              className="inline-flex items-center gap-2 border border-ag-border text-ag-gray font-mono text-[11px] tracking-[0.14em] uppercase px-7 py-4 hover:border-ag-black hover:text-ag-black transition-all rounded-lg"
            >
              {t('ctaSecondary')}
            </Link>
          </div>
        </div>
      </section>

    </main>
  )
}
