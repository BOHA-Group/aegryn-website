import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { generateAegrynMetadata, aegrynOrganizationSchema } from '@/lib/seo'
import { AegrynSceneClient } from '@/components/three/AegrynSceneClient'
import type { Metadata } from 'next'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  return generateAegrynMetadata({
    title: 'About Aegryn | Structuring the Digital Economy',
    description: 'Learn how we build and operate digital ecosystems and provide selective advisory in Data, AI and Cybersecurity across Europe.',
    path: '/about',
    locale,
  })
}

const values = ['precision', 'durability', 'sovereignty', 'transparency'] as const
const missionPillars = ['create', 'simplify', 'embrace'] as const

export default function AboutPage() {
  const t = useTranslations('about')

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aegrynOrganizationSchema) }}
      />

      {/* Hero */}
      <section className="border-b border-ag-border">
        <div className="mx-auto max-w-7xl px-6 md:px-12 py-32">
          <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-ag-gray-light mb-8">
            {t('hero.label')}
          </p>
          <h1
            className="font-display font-black text-ag-black tracking-[-0.03em] leading-[0.93] max-w-3xl mb-8"
            style={{ fontSize: 'clamp(52px,6.5vw,88px)' }}
          >
            {t('hero.title')}
          </h1>
          <p className="text-[15px] text-ag-gray leading-relaxed max-w-xl">
            {t('hero.desc')}
          </p>
        </div>
      </section>

      {/* Vision + 3D Logo */}
      <section className="border-b border-ag-border">
        <div className="mx-auto max-w-7xl px-6 md:px-12">
          <div className="grid md:grid-cols-[280px_1fr_360px] divide-y md:divide-y-0 md:divide-x divide-ag-border">
            <div className="py-16 md:pr-16 flex items-start">
              <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-ag-gray-light">
                / {t('vision.label')}
              </p>
            </div>
            <div className="py-16 md:px-16">
              <p
                className="font-display font-black text-ag-black tracking-[-0.02em] leading-[1.15]"
                style={{ fontSize: 'clamp(22px,2.5vw,32px)' }}
              >
                {t('vision.text')}
              </p>
            </div>
            {/* 3D Logo R3F */}
            <div className="py-8 md:pl-8 flex items-center justify-center" style={{ height: '320px' }}>
              <AegrynSceneClient />
            </div>
          </div>
        </div>
      </section>

      {/* Mission — 3 pillars */}
      <section className="border-b border-ag-border">
        <div className="mx-auto max-w-7xl px-6 md:px-12 py-4">
          <div className="flex items-center justify-between border-b border-ag-border py-4 mb-0">
            <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-ag-gray-light">
              / {t('mission.label')}
            </span>
            <span className="font-display font-black text-ag-black tracking-[-0.02em] text-[13px]">
              {t('mission.title')}
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-ag-border">
            {missionPillars.map((key, i) => (
              <div key={key} className="py-14 md:px-10 first:pl-0 last:pr-0">
                <p className="font-mono text-[10px] tracking-[0.2em] text-ag-gray-light mb-6">
                  {String(i + 1).padStart(2, '0')}
                </p>
                <h2
                  className="font-display font-black text-ag-black tracking-[-0.02em] leading-none mb-4"
                  style={{ fontSize: 'clamp(20px,1.8vw,26px)' }}
                >
                  {t(`mission.${key}.title`)}
                </h2>
                <p className="text-[14px] text-ag-gray leading-relaxed">
                  {t(`mission.${key}.desc`)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DNA — values grid */}
      <section className="border-b border-ag-border bg-ag-off-white">
        <div className="mx-auto max-w-7xl px-6 md:px-12 py-20">
          <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-ag-gray-light mb-12">
            / Notre ADN
          </p>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-ag-border">
            {values.map((v) => (
              <div key={v} className="bg-ag-off-white p-8 hover:bg-ag-white transition-colors">
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ag-apex mb-4">
                  {t(`values.${v}.label`)}
                </p>
                <p className="font-display font-black text-ag-black text-[18px] tracking-[-0.02em] leading-none mb-3">
                  {t(`values.${v}.title`)}
                </p>
                <p className="text-[13px] text-ag-gray-light leading-relaxed">
                  {t(`values.${v}.desc`)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Founder */}
      <section className="border-b border-ag-border">
        <div className="mx-auto max-w-7xl px-6 md:px-12 py-24">
          <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-ag-gray-light mb-14">
            / {t('founder.label')}
          </p>
          <div className="grid gap-14 lg:grid-cols-[200px_1fr] lg:items-start">
            <div className="h-56 w-44 border border-ag-border bg-ag-off-white flex items-center justify-center shrink-0">
              <span className="font-display text-3xl font-black text-ag-gray-light tracking-[-0.04em]">YB</span>
            </div>
            <div>
              <h2
                className="font-display font-black text-ag-black tracking-[-0.03em] leading-none mb-1"
                style={{ fontSize: 'clamp(28px,3vw,42px)' }}
              >
                Yohann Bollack
              </h2>
              <p className="font-mono text-[11px] text-ag-apex uppercase tracking-[0.22em] mb-8">
                Founder & CEO — Aegryn
              </p>
              <div className="space-y-4 text-[15px] text-ag-gray leading-relaxed max-w-2xl">
                <p>{t('founder.bio1')}</p>
                <p>{t('founder.bio2')}</p>
              </div>
              <div className="mt-10 flex flex-wrap gap-4">
                <a
                  href="https://www.linkedin.com/in/yohannbollack"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 border border-ag-border px-5 py-2.5 font-mono text-[11px] tracking-[0.14em] uppercase text-ag-gray hover:border-ag-black hover:text-ag-black transition-all"
                >
                  LinkedIn <ArrowUpRight size={12} />
                </a>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 border border-ag-apex/40 px-5 py-2.5 font-mono text-[11px] tracking-[0.14em] uppercase text-ag-apex hover:border-ag-apex hover:bg-ag-apex hover:text-ag-navy transition-all"
                >
                  {t('founder.cta')} <ArrowUpRight size={12} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-ag-navy py-28 px-6 md:px-12">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8">
          <div>
            <p className="font-mono text-[11px] tracking-[0.22em] uppercase text-white/40 mb-4">
              Aegryn Group
            </p>
            <h2
              className="font-display font-black text-white tracking-[-0.03em] leading-[0.95] max-w-xl"
              style={{ fontSize: 'clamp(26px,3vw,48px)' }}
            >
              {t('swiss.title')}
            </h2>
          </div>
          <Link
            href="/what-we-build"
            className="shrink-0 inline-flex items-center gap-3 font-mono text-[11px] tracking-[0.16em] uppercase text-white border border-white/30 px-6 py-3 hover:border-white hover:bg-white hover:text-ag-navy transition-all"
          >
            {t('swiss.cta')} <ArrowUpRight size={14} />
          </Link>
        </div>
      </section>
    </>
  )
}
