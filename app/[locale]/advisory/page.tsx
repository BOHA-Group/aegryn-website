import { useTranslations } from 'next-intl'
import { getTranslations } from 'next-intl/server'
import Link from 'next/link'
import { generateAegrynMetadata } from '@/lib/seo'
import type { Metadata } from 'next'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  return generateAegrynMetadata({
    title: 'Advisory',
    description:
      'Aegryn Advisory protège vos actifs numériques avec des protocoles de cybersécurité et d\'audit IA.',
    path: '/advisory',
    locale,
  })
}

const services = [
  {
    id: 'cyber',
    icon: '⬡',
    keys: ['title', 'desc', 'items'],
  },
  {
    id: 'ai',
    icon: '◈',
    keys: ['title', 'desc', 'items'],
  },
  {
    id: 'strategy',
    icon: '◎',
    keys: ['title', 'desc', 'items'],
  },
] as const

export default function AdvisoryPage() {
  const t = useTranslations('advisory')

  return (
    <>
      {/* Hero */}
      <section className="relative border-b border-ag-border bg-ag-navy overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(90,221,164,0.08)_0%,_transparent_60%)]" />
        <div className="relative mx-auto max-w-7xl px-6 py-32">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-ag-apex mb-6">
            Aegryn Advisory
          </p>
          <h1 className="font-display text-6xl font-black tracking-tighter text-white sm:text-7xl max-w-2xl">
            {t('hero.title')}
          </h1>
          <p className="mt-6 text-base text-white/70 leading-relaxed max-w-lg">
            {t('hero.desc')}
          </p>
          <Link
            href="/contact"
            className="mt-10 inline-flex items-center gap-3 rounded-full bg-ag-apex px-7 py-3.5 font-display text-sm font-bold text-ag-navy transition-all hover:bg-white"
          >
            {t('cta')}
            <span>↗</span>
          </Link>
        </div>
      </section>

      {/* Services */}
      <section className="mx-auto max-w-7xl px-6 py-24">
        <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-ag-apex mb-16">
          / Nos protocoles
        </p>
        <div className="grid gap-px rounded-2xl overflow-hidden border border-ag-border lg:grid-cols-3">
          {services.map(({ id, icon }) => (
            <div
              key={id}
              className="group bg-ag-off-white p-8 hover:bg-ag-light-gray transition-colors border-b border-ag-border lg:border-b-0 lg:border-r last:border-0"
            >
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl border border-ag-border text-xl text-ag-apex group-hover:border-ag-apex/40 transition-colors">
                {icon}
              </div>
              <h2 className="font-display text-xl font-bold tracking-tighter text-ag-black mb-3">
                {t(`services.${id}.title`)}
              </h2>
              <p className="text-sm text-ag-gray leading-relaxed mb-6">
                {t(`services.${id}.desc`)}
              </p>
              <ul className="space-y-2">
                {(t.raw(`services.${id}.items`) as string[]).map((item: string) => (
                  <li key={item} className="flex items-start gap-2 text-xs text-ag-gray-light">
                    <span className="mt-0.5 text-ag-apex">—</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Approach */}
      <section className="border-t border-ag-border bg-ag-off-white">
        <div className="mx-auto max-w-7xl px-6 py-24">
          <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-ag-apex mb-6">
                / Notre approche
              </p>
              <h2 className="font-display text-4xl font-black tracking-tighter text-ag-black sm:text-5xl mb-6">
                {t('approach.title')}
              </h2>
              <p className="text-sm text-ag-gray leading-relaxed mb-8">
                {t('approach.desc')}
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-full border border-ag-apex/40 px-6 py-3 font-mono text-xs text-ag-apex hover:border-ag-apex hover:bg-ag-apex hover:text-ag-navy transition-all"
              >
                {t('cta')} ↗
              </Link>
            </div>

            {/* Steps */}
            <ol className="space-y-6">
              {(t.raw('approach.steps') as Array<{ label: string; desc: string }>).map(
                (step, i) => (
                  <li key={i} className="flex items-start gap-5">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-ag-border font-mono text-xs text-ag-gray-light">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <div>
                      <p className="font-display text-sm font-bold text-ag-black mb-1">
                        {step.label}
                      </p>
                      <p className="text-xs text-ag-gray-light leading-relaxed">{step.desc}</p>
                    </div>
                  </li>
                ),
              )}
            </ol>
          </div>
        </div>
      </section>
    </>
  )
}
