'use client'

import { useTranslations } from 'next-intl'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, Printer } from 'lucide-react'

type CifsItem   = { code: string; name: string; weight: string; desc: string; criteria: string[] }
type Grade      = { grade: string; label: string; profile: string }
type ProcStep   = { num: string; title: string; desc: string }
type Principle  = { title: string; desc: string }
type Maturity   = { tier: string; rule: string }
type UseCase    = { num: string; tag: string; title: string; desc: string }
type ISORow     = { dimension: string; existing: string; cifso: string }
type PricingTier = { name: string; target: string; price: string; duration: string; includes: string[] }

const DIM_COLOR: Record<string, string> = {
  C: '#2D5BE3', I: '#7B3FC4', F: '#1F9E6A', S: '#C0392B', O: '#D68910',
}

export function WhitepaperContent() {
  const tG  = useTranslations('grade.index')
  const tGS = useTranslations('gradingSystem')

  const cifs          = tGS.raw('cifs')              as CifsItem[]
  const grades        = tGS.raw('grades')            as Grade[]
  const process       = tGS.raw('process')           as ProcStep[]
  const principles    = tGS.raw('principles')        as Principle[]
  const refusalCond   = tGS.raw('refusalConditions') as string[]
  const useCases      = tG.raw('useCases')           as UseCase[]
  const isoRows       = tG.raw('isoRows')            as ISORow[]
  const pricingTiers  = tG.raw('pricingTiers')       as PricingTier[]
  const tocItems      = tG.raw('wpTocItems')         as string[]

  return (
    <>
      {/* ── Screen nav bar (hidden on print) ── */}
      <div className="print:hidden sticky top-0 z-50 bg-ag-white border-b border-ag-border px-6 py-3 flex items-center justify-between">
        <Link
          href="/grade/methodology"
          className="inline-flex items-center gap-2 font-mono text-[10px] tracking-[0.14em] uppercase text-ag-gray hover:text-ag-black transition-colors"
        >
          <ArrowLeft size={12} /> {tG('wpNavBack')}
        </Link>
        <button
          onClick={() => window.print()}
          className="inline-flex items-center gap-2 bg-ag-navy text-white font-mono text-[10px] tracking-[0.14em] uppercase px-5 py-2.5 hover:bg-ag-navy-mid transition-colors"
        >
          <Printer size={12} /> {tG('wpNavPrint')}
        </button>
      </div>

      {/* ── Document ── */}
      <article
        className="
          max-w-[800px] mx-auto px-8 py-12
          print:max-w-none print:px-[1.5cm] print:py-[1cm]
          font-sans text-ag-black
        "
        style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
      >

        {/* ─── COVER ─── */}
        <header className="mb-16 print:mb-12">
          {/* Logo + header bar */}
          <div className="flex items-start justify-between mb-8 pb-6 border-b-2 border-ag-navy">
            <Image
              src="/images/logo.svg"
              alt="Aegryn"
              width={120}
              height={32}
              className="h-8 w-auto"
              priority
            />
            <div className="text-right">
              <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-ag-gray-light">
                Certification CIFSO 5000 v4.0
              </p>
              <p className="font-mono text-[10px] tracking-[0.16em] text-ag-gray-light">
                Aegryn SA · Saint-Sulpice, Switzerland
              </p>
            </div>
          </div>

          {/* Title */}
          <div className="bg-ag-navy px-10 py-12 mb-6">
            <p className="font-mono text-[10px] tracking-[0.24em] uppercase text-ag-apex mb-4">
              {tG('wpEyebrow')}
            </p>
            <h1
              className="font-sans font-bold text-white leading-[1.02] tracking-[-0.04em] mb-6"
              style={{ fontSize: '52px' }}
            >
              {tG('wpHeroTitle')}
            </h1>
            <p className="font-sans text-[16px] text-white/70 leading-relaxed max-w-md">
              {tG('wpHeroDesc')}
            </p>
          </div>

          {/* Cover meta */}
          <div className="grid grid-cols-3 gap-6 text-center border border-ag-border">
            {[
              { label: tG('wpProtocol'), value: 'CIFSO 5000 v4.0' },
              { label: tG('wpIssuer'), value: 'Aegryn SA' },
              { label: tG('wpJurisdiction'), value: 'Switzerland' },
            ].map(({ label, value }) => (
              <div key={label} className="px-4 py-4 border-r border-ag-border last:border-0">
                <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-ag-gray-light mb-1">
                  {label}
                </p>
                <p className="font-sans font-semibold text-ag-black text-[13px]">{value}</p>
              </div>
            ))}
          </div>
        </header>

        {/* ─── TABLE OF CONTENTS ─── */}
        <section className="mb-14 print:break-after-page">
          <h2 className="wp-section-title">{tG('wpTocTitle')}</h2>
          <ol className="flex flex-col gap-2">
            {tocItems.map((item) => (
              <li key={item} className="flex items-baseline gap-3">
                <span className="font-mono text-[11px] text-ag-gray-light shrink-0">
                  {item.split('.')[0]}.
                </span>
                <span className="font-sans text-[13px] text-ag-black border-b border-ag-border/40 flex-1 pb-1">
                  {item.split('. ').slice(1).join('. ')}
                </span>
              </li>
            ))}
          </ol>
        </section>

        {/* ─── 1. WHAT IS CIFSO 5000 ─── */}
        <section className="wp-section">
          <h2 className="wp-section-title">{tG('wpS1Title')}</h2>
          <p
            className="wp-body"
            dangerouslySetInnerHTML={{ __html: tG('wpS1Body1') }}
          />
          <p
            className="wp-body"
            dangerouslySetInnerHTML={{ __html: tG('wpS1Body2') }}
          />
          <div className="wp-callout">
            <p className="font-sans font-semibold text-ag-black text-[14px] leading-snug">
              {tG('wpS1Callout')}
            </p>
          </div>
        </section>

        {/* ─── 2. USE CASES ─── */}
        <section className="wp-section print:break-before-page">
          <h2 className="wp-section-title">{tG('wpS2Title')}</h2>
          <div className="flex flex-col gap-4">
            {useCases.map((uc) => (
              <div key={uc.num} className="grid grid-cols-[40px_1fr] gap-4 border border-ag-border p-5">
                <span className="font-mono text-[11px] font-bold text-ag-apex">{uc.num}</span>
                <div>
                  <p className="font-mono text-[10px] tracking-[0.18em] uppercase text-ag-gray-light mb-1">
                    {uc.tag}
                  </p>
                  <p className="font-sans font-semibold text-ag-black text-[13px] mb-2">{uc.title}</p>
                  <p className="font-sans text-[12px] text-ag-gray leading-relaxed">{uc.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ─── 3. FIVE DIMENSIONS ─── */}
        <section className="wp-section print:break-before-page">
          <h2 className="wp-section-title">{tG('wpS3Title')}</h2>
          <p className="wp-body mb-6">{tG('wpS3Intro')}</p>
          <div className="flex flex-col gap-3">
            {cifs.map((dim) => (
              <div
                key={dim.code}
                className="grid grid-cols-[8px_60px_1fr] gap-4 items-start border border-ag-border p-5"
                style={{ borderLeftColor: DIM_COLOR[dim.code], borderLeftWidth: 3 }}
              >
                <div />
                <div>
                  <p
                    className="font-mono text-[15px] font-bold"
                    style={{ color: DIM_COLOR[dim.code] }}
                  >
                    {dim.code}
                  </p>
                  <p className="font-mono text-[10px] text-ag-gray-light">{dim.weight} pts</p>
                </div>
                <div>
                  <p className="font-sans font-semibold text-ag-black text-[13px] mb-1">{dim.name}</p>
                  <p className="font-sans text-[12px] text-ag-gray leading-relaxed">{dim.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ─── 4. GRADE SCALE ─── */}
        <section className="wp-section">
          <h2 className="wp-section-title">{tG('wpS4Title')}</h2>
          <div className="border border-ag-border overflow-hidden rounded-2xl">
            <div className="grid grid-cols-[80px_120px_1fr] bg-ag-navy">
              {[tG('wpS4ColGrade'), tG('wpS4ColLevel'), tG('wpS4ColMeaning')].map((h) => (
                <div key={h} className="px-4 py-3 border-r border-white/10 last:border-0">
                  <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-white/60">{h}</p>
                </div>
              ))}
            </div>
            {grades.map((g) => (
              <div key={g.grade} className="grid grid-cols-[80px_120px_1fr] border-t border-ag-border">
                <div className="px-4 py-4 border-r border-ag-border flex items-center">
                  <p className="font-mono text-[14px] font-bold text-ag-black">{g.grade}</p>
                </div>
                <div className="px-4 py-4 border-r border-ag-border flex items-center">
                  <p className="font-sans font-semibold text-ag-black text-[12px]">{g.label}</p>
                </div>
                <div className="px-4 py-4">
                  <p className="font-sans text-[11px] text-ag-gray leading-relaxed">{g.profile}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ─── 5. ISO MAPPING ─── */}
        <section className="wp-section print:break-before-page">
          <h2 className="wp-section-title">{tG('wpS5Title')}</h2>
          <p className="wp-body">{tG('wpS5Intro')}</p>
          <div className="border border-ag-border overflow-hidden rounded-2xl mt-5">
            <div className="grid grid-cols-[140px_1fr_1fr] bg-ag-navy">
              {[tG('wpS5ColDim'), tG('wpS5ColExisting'), tG('wpS5ColCifso')].map((h) => (
                <div key={h} className="px-4 py-3 border-r border-white/10 last:border-0">
                  <p className="font-mono text-[10px] tracking-[0.18em] uppercase text-white/60">{h}</p>
                </div>
              ))}
            </div>
            {isoRows.map((row) => {
              const code = row.dimension.charAt(0)
              return (
                <div
                  key={row.dimension}
                  className="grid grid-cols-[140px_1fr_1fr] border-t border-ag-border"
                >
                  <div className="px-4 py-4 border-r border-ag-border bg-ag-off-white">
                    <p
                      className="font-mono text-[12px] font-bold mb-0.5"
                      style={{ color: DIM_COLOR[code] }}
                    >
                      {code}
                    </p>
                    <p className="font-sans text-[10px] text-ag-black">
                      {row.dimension.slice(code.length).replace(/^\s*[·—–-]?\s*/, '')}
                    </p>
                  </div>
                  <div className="px-4 py-4 border-r border-ag-border">
                    <p className="font-sans text-[11px] text-ag-gray leading-relaxed">
                      {row.existing}
                    </p>
                  </div>
                  <div className="px-4 py-4">
                    <p className="font-sans text-[11px] text-ag-black leading-relaxed">{row.cifso}</p>
                  </div>
                </div>
              )
            })}
          </div>
          <p className="font-mono text-[10px] text-ag-gray-light mt-3 leading-relaxed">
            {tG('wpS5Note')}
          </p>
        </section>

        {/* ─── 6. PROCESS ─── */}
        <section className="wp-section print:break-before-page">
          <h2 className="wp-section-title">{tG('wpS6Title')}</h2>
          <p className="wp-body">{tG('wpS6Intro')}</p>
          <div className="flex flex-col gap-0 border border-ag-border">
            {process.map(({ num, title, desc }) => (
              <div key={num} className="grid grid-cols-[56px_1fr] border-b border-ag-border last:border-0">
                <div className="px-4 py-5 border-r border-ag-border bg-ag-off-white flex items-start">
                  <p className="font-mono text-[11px] font-bold text-ag-apex">{num}</p>
                </div>
                <div className="px-5 py-5">
                  <p className="font-sans font-semibold text-ag-black text-[13px] mb-1">{title}</p>
                  <p className="font-sans text-[11px] text-ag-gray leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ─── 7. PRINCIPLES ─── */}
        <section className="wp-section">
          <h2 className="wp-section-title">{tG('wpS7Title')}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {principles.map(({ title, desc }) => (
              <div key={title} className="border border-ag-border p-5">
                <p className="font-sans font-semibold text-ag-black text-[13px] mb-2">{title}</p>
                <p className="font-sans text-[11px] text-ag-gray leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ─── 8. REFUSAL CONDITIONS ─── */}
        <section className="wp-section">
          <h2 className="wp-section-title">{tG('wpS8Title')}</h2>
          <p className="wp-body mb-4">{tG('wpS8Intro')}</p>
          <div className="flex flex-col gap-0 border border-ag-border">
            {refusalCond.map((cond, i) => (
              <div
                key={i}
                className="flex items-start gap-4 px-5 py-4 border-b border-ag-border last:border-0"
              >
                <span className="font-mono text-[10px] font-bold text-red-600 shrink-0 mt-0.5">✕</span>
                <p className="font-sans text-[11px] text-ag-gray leading-relaxed">{cond}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ─── 9. PRICING ─── */}
        <section className="wp-section print:break-before-page">
          <h2 className="wp-section-title">{tG('wpS9Title')}</h2>
          <p className="wp-body">{tG('wpS9Intro')}</p>
          <div className="flex flex-col gap-4 mt-4">
            {pricingTiers.map((tier) => (
              <div
                key={tier.name}
                className="grid grid-cols-[100px_1fr_120px] gap-4 border border-ag-border p-5 rounded-xl items-start"
              >
                <div>
                  <p className="font-mono text-[11px] font-bold text-ag-black">{tier.name}</p>
                  <p className="font-mono text-[10px] text-ag-gray-light mt-0.5">{tier.duration}</p>
                </div>
                <div>
                  <p className="font-sans text-[11px] text-ag-gray">{tier.target}</p>
                </div>
                <div className="text-right">
                  <p className="font-sans font-bold text-ag-black text-[14px]">{tier.price}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-3 border border-ag-border p-4 bg-ag-off-white">
            <p className="font-sans font-semibold text-ag-black text-[12px] mb-1">
              {tG('wpS9AllTiersLabel')}
            </p>
            <p className="font-sans text-[11px] text-ag-gray leading-relaxed">
              {tG('wpS9AllTiersDesc')}
            </p>
          </div>
        </section>

        {/* ─── 10. DISCLAIMER ─── */}
        <section className="wp-section">
          <h2 className="wp-section-title">{tG('wpS10Title')}</h2>
          <p className="font-sans text-[11px] text-ag-gray leading-relaxed">
            {tGS('disclaimerText')}
          </p>
        </section>

        {/* ─── FOOTER ─── */}
        <footer className="mt-16 pt-6 border-t-2 border-ag-navy">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-ag-gray-light">
                {tG('wpFooterVersion')}
              </p>
              <p className="font-mono text-[10px] text-ag-gray-light mt-0.5">
                {tG('wpFooterAddress')}
              </p>
            </div>
            <Image
              src="/images/logo.svg"
              alt="Aegryn"
              width={80}
              height={24}
              className="h-6 w-auto opacity-40"
            />
          </div>
        </footer>

      </article>

      {/* Print styles */}
      <style>{`
        @media print {
          @page { margin: 1.5cm; size: A4 portrait; }
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .wp-section { page-break-inside: avoid; }
        }
        .wp-section { margin-bottom: 3.5rem; }
        .wp-section-title {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-weight: 700;
          font-size: 18px;
          color: #0D1F3C;
          border-bottom: 1px solid #E5E5E5;
          padding-bottom: 0.5rem;
          margin-bottom: 1.25rem;
          letter-spacing: -0.02em;
        }
        .wp-body {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 13px;
          color: #666;
          line-height: 1.7;
          margin-bottom: 1rem;
        }
        .wp-callout {
          border-left: 3px solid #0D1F3C;
          padding: 1rem 1.5rem;
          background: #F7F7F5;
          margin: 1.5rem 0;
        }
      `}</style>
    </>
  )
}
