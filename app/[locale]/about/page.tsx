import { useTranslations } from 'next-intl'
import { getTranslations } from 'next-intl/server'
import Link from 'next/link'
import { generateAegrynMetadata, aegrynOrganizationSchema } from '@/lib/seo'
import type { Metadata } from 'next'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  return generateAegrynMetadata({
    title: 'À propos',
    description: 'Aegryn est un Swiss Tech Asset Builder fondé pour construire des actifs numériques propriétaires conçus pour durer.',
    path: '/about',
    locale,
  })
}

const values = ['precision', 'durability', 'sovereignty', 'transparency'] as const

export default function AboutPage() {
  const t = useTranslations('about')

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aegrynOrganizationSchema) }}
      />

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-ag-border">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_rgba(46,175,125,0.05)_0%,_transparent_60%)]" />
        <div className="relative mx-auto max-w-7xl px-6 py-32">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-ag-apex mb-6">
            {t('hero.label')}
          </p>
          <h1 className="font-display text-6xl font-black tracking-tighter text-ag-black sm:text-7xl max-w-2xl leading-[1.02]">
            {t('hero.title')}
          </h1>
          <p className="mt-6 text-base text-ag-gray leading-relaxed max-w-lg">
            {t('hero.desc')}
          </p>
        </div>
      </section>

      {/* Manifeste étendu */}
      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="grid gap-16 lg:grid-cols-2 lg:items-start">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-ag-apex mb-6">
              / {t('mission.label')}
            </p>
            <h2 className="font-display text-4xl font-black tracking-tighter text-ag-black sm:text-5xl mb-6">
              {t('mission.title')}
            </h2>
            <div className="space-y-4 text-sm text-ag-gray leading-relaxed">
              <p>{t('mission.p1')}</p>
              <p>{t('mission.p2')}</p>
              <p>{t('mission.p3')}</p>
            </div>
          </div>

          {/* Valeurs */}
          <div className="grid grid-cols-2 gap-4">
            {values.map((v) => (
              <div
                key={v}
                className="rounded-2xl border border-ag-border bg-ag-off-white p-6 hover:border-ag-border-h transition-colors"
              >
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ag-apex mb-3">
                  {t(`values.${v}.label`)}
                </p>
                <p className="font-display text-base font-bold text-ag-black mb-2">
                  {t(`values.${v}.title`)}
                </p>
                <p className="text-xs text-ag-gray-light leading-relaxed">
                  {t(`values.${v}.desc`)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Founder */}
      <section className="border-t border-ag-border bg-ag-off-white">
        <div className="mx-auto max-w-7xl px-6 py-24">
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-ag-apex mb-12">
            / {t('founder.label')}
          </p>
          <div className="grid gap-12 lg:grid-cols-[auto_1fr] lg:items-start">
            <div className="relative h-64 w-48 overflow-hidden rounded-2xl border border-ag-border bg-ag-light-gray shrink-0">
              <div className="flex h-full items-center justify-center">
                <span className="font-display text-4xl font-black text-ag-gray-light">YB</span>
              </div>
            </div>
            <div>
              <h2 className="font-display text-3xl font-black tracking-tighter text-ag-black mb-1">
                Yohann Bollack
              </h2>
              <p className="font-mono text-xs text-ag-apex uppercase tracking-[0.2em] mb-6">
                Founder & CEO
              </p>
              <div className="space-y-4 text-sm text-ag-gray leading-relaxed max-w-2xl">
                <p>{t('founder.bio1')}</p>
                <p>{t('founder.bio2')}</p>
              </div>
              <div className="mt-8 flex gap-4">
                <a
                  href="https://www.linkedin.com/in/yohannbollack"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-ag-border px-5 py-2.5 font-mono text-xs text-ag-gray hover:border-ag-border-h hover:text-ag-black transition-all"
                >
                  LinkedIn ↗
                </a>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 rounded-full border border-ag-apex/40 px-5 py-2.5 font-mono text-xs text-ag-apex hover:border-ag-apex hover:bg-ag-apex hover:text-ag-navy transition-all"
                >
                  {t('founder.cta')} ↗
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Swiss DNA */}
      <section className="border-t border-ag-border">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-ag-apex mb-3">
                Swiss Tech Asset Builder
              </p>
              <h2 className="font-display text-3xl font-black tracking-tighter text-ag-black max-w-lg">
                {t('swiss.title')}
              </h2>
            </div>
            <Link
              href="/what-we-build"
              className="group inline-flex shrink-0 items-center gap-3 rounded-full border border-ag-border px-6 py-3 font-display text-sm font-bold text-ag-black transition-all hover:border-ag-apex hover:bg-ag-apex hover:text-ag-navy"
            >
              {t('swiss.cta')}
              <span className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5">↗</span>
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
