import { getTranslations } from 'next-intl/server'
import { useTranslations } from 'next-intl'
import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'grade.methodology' })
  return { title: t('title'), description: t('desc') }
}

export default function GradeMethodologyPage() {
  const t          = useTranslations('grade.methodology')
  const principles = t.raw('principles') as { title: string; desc: string }[]
  const scores     = t.raw('scores')     as { range: string; grade: string; color: string }[]

  const COLOR_MAP: Record<string, string> = {
    'grade-star': '#5ADDA4',
    'grade-aaa':  '#C9A84C',
    'grade-aa':   '#9BA8B0',
    'grade-a':    '#4A90D9',
    'grade-b':    '#D4820A',
  }

  return (
    <main id="main" className="bg-ag-white">
      {/* Hero */}
      <section className="bg-ag-navy pt-24 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <p className="font-mono text-[10px] tracking-[0.28em] uppercase text-ag-apex mb-5 flex items-center gap-3">
            <span className="w-6 h-px bg-ag-apex/50 inline-block" />
            {t('label')}
          </p>
          <h1
            className="font-sans font-bold text-white leading-[1.05] tracking-[-0.03em] max-w-2xl mb-5 whitespace-pre-line"
            style={{ fontSize: 'clamp(32px,4.5vw,64px)' }}
          >
            {t('title')}
          </h1>
          <p className="font-sans text-[16px] text-white/55 max-w-xl mb-8">{t('desc')}</p>
          <div className="inline-flex items-center gap-2 border border-white/15 px-4 py-2">
            <span className="font-mono text-[10px] tracking-[0.16em] uppercase text-white/40">{t('versionLabel')}</span>
            <span className="font-mono text-[10px] tracking-[0.12em] text-ag-apex">{t('version')}</span>
          </div>
        </div>
      </section>

      {/* Principles */}
      <section className="py-24 px-6 border-t border-ag-border">
        <div className="max-w-7xl mx-auto">
          <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-ag-gray-light mb-14">
            {t('principlesLabel')}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-ag-border border border-ag-border">
            {principles.map(({ title, desc }) => (
              <div key={title} className="bg-ag-white p-10">
                <h2 className="font-sans font-semibold text-ag-black text-[18px] mb-3 tracking-[-0.02em]">{title}</h2>
                <p className="font-sans text-[14px] text-ag-gray leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Scoring table */}
      <section className="py-20 px-6 bg-ag-off-white border-t border-ag-border">
        <div className="max-w-7xl mx-auto">
          <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-ag-gray-light mb-4">
            {t('scoringLabel')}
          </p>
          <p className="font-sans text-[15px] text-ag-gray max-w-xl mb-10">{t('scoringDesc')}</p>
          <div className="border border-ag-border">
            <div className="grid grid-cols-2 border-b border-ag-border bg-ag-light-gray">
              <p className="font-mono text-[10px] tracking-[0.18em] uppercase text-ag-gray-light px-6 py-3">Score / 100</p>
              <p className="font-mono text-[10px] tracking-[0.18em] uppercase text-ag-gray-light px-6 py-3">Grade</p>
            </div>
            {scores.map(({ range, grade, color }) => (
              <div key={grade} className="grid grid-cols-2 border-b border-ag-border last:border-0 bg-ag-white hover:bg-ag-off-white transition-colors">
                <p className="font-sans font-semibold text-ag-black px-6 py-4">{range}</p>
                <p
                  className="font-mono text-[13px] tracking-[0.1em] font-semibold px-6 py-4"
                  style={{ color: COLOR_MAP[color] ?? '#6B6B6B' }}
                >
                  {grade}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-6 border-t border-ag-border">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <p className="font-sans font-semibold text-ag-black text-[18px] max-w-md">
            Prêt à soumettre votre actif pour certification ?
          </p>
          <Link
            href="/contact"
            className="shrink-0 inline-flex items-center gap-2 bg-ag-navy text-white font-mono text-[11px] tracking-[0.14em] uppercase px-6 py-3 hover:bg-ag-navy-mid transition-colors"
          >
            Soumettre mon actif <ArrowUpRight size={13} />
          </Link>
        </div>
      </section>
    </main>
  )
}
