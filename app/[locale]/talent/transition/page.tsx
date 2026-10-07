import { getTranslations } from 'next-intl/server'
import type { Metadata }   from 'next'
import { Link }            from '@/i18n/navigation'
import { ArrowUpRight, CalendarClock, ListChecks, ArrowLeftRight } from 'lucide-react'
import { generateAegrynMetadata } from '@/lib/seo'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'talent.transition' })
  return generateAegrynMetadata({
    title: t('meta.title'),
    description: t('meta.desc'),
    path: '/talent/transition',
    locale
  })
}

export default async function TalentTransitionPage({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'talent.transition' })

  const situations = t.raw('situations.items') as string[]
  const formatItems = t.raw('format.items') as { title: string; desc: string }[]
  const formatIcons = [CalendarClock, ListChecks, ArrowLeftRight]
  const dataCards  = t.raw('data.cards') as { stat: string; desc: string; source: string; url?: string }[]

  return (
    <>
      {/* Hero */}
      <section className="border-b border-ag-border bg-ag-navy overflow-hidden">
        <div className="relative mx-auto max-w-7xl px-6 md:px-12 py-32">
          <p className="font-sans font-semibold text-[11px] uppercase tracking-[0.28em] text-ag-apex/70 mb-8">
            {t('hero.label')}
          </p>
          <h1
            className="font-sans font-bold text-white tracking-[-0.03em] leading-[1.18] max-w-3xl mb-8"
            style={{ fontSize: 'clamp(36px,5vw,72px)' }}
          >
            {t('hero.title')}
          </h1>
          <p className="text-[16px] text-white/60 leading-relaxed max-w-xl mb-10">
            {t('hero.desc')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href={{ pathname: '/contact', query: { type: 'transition' } } as never}
              className="rounded-lg inline-flex items-center justify-center gap-2 bg-ag-apex text-ag-navy font-mono text-[11px] tracking-[0.14em] uppercase px-7 py-3.5 font-semibold hover:bg-ag-apex/90 transition-colors"
            >
              {t('hero.ctaNeed')} <ArrowUpRight size={12} />
            </Link>
          </div>
        </div>
      </section>

      {/* Situations */}
      <section className="py-24 border-b border-ag-border">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <h2 className="font-sans font-bold text-ag-black tracking-[-0.02em] mb-12" style={{ fontSize: 'clamp(26px,3vw,44px)' }}>
            {t('situations.title')}
          </h2>
          <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {situations.map((s, i) => (
              <li key={i} className="border border-ag-border bg-white p-6 flex items-start gap-3">
                <span className="shrink-0 mt-2 w-1.5 h-1.5 bg-ag-apex rounded-full" />
                <span className="text-[15px] text-ag-gray leading-relaxed">{s}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Format de la mission */}
      <section className="py-24 border-b border-ag-border bg-ag-off-white">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <h2 className="font-sans font-bold text-ag-black tracking-[-0.02em] mb-12" style={{ fontSize: 'clamp(26px,3vw,44px)' }}>
            {t('format.title')}
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {formatItems.map((f, i) => {
              const Icon = formatIcons[i]
              return (
              <div key={i} className="border border-ag-border bg-white p-8">
                <span className="w-10 h-10 rounded-lg bg-ag-apex/10 border border-ag-apex/25 flex items-center justify-center text-ag-apex-ink mb-5">
                  <Icon size={18} strokeWidth={1.8} />
                </span>
                <h3 className="font-sans font-bold text-ag-black text-[17px] tracking-[-0.01em] mb-3">
                  {f.title}
                </h3>
                <p className="text-[15px] text-ag-gray leading-relaxed">
                  {f.desc}
                </p>
              </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Données de cadrage */}
      <section className="py-24 border-b border-ag-border">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <h2 className="font-sans font-bold text-ag-black tracking-[-0.02em] mb-3" style={{ fontSize: 'clamp(26px,3vw,44px)' }}>
            {t('data.title')}
          </h2>
          <p className="text-[15px] text-ag-gray leading-relaxed mb-12 max-w-2xl">
            {t('data.note')}
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            {dataCards.map((card, i) => (
              <div key={i} className="border border-ag-border bg-white p-6">
                <p className="font-sans font-bold text-ag-black text-[22px] tracking-[-0.02em] mb-3">
                  {card.stat}
                </p>
                <p className="font-sans text-[13px] text-ag-gray leading-relaxed mb-4">
                  {card.desc}
                </p>
                <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-ag-gray-light">
                  {card.url ? (
                    <a href={card.url} target="_blank" rel="noopener noreferrer" className="hover:text-ag-apex-ink transition-colors">
                      {card.source} ↗
                    </a>
                  ) : card.source}
                </p>
              </div>
            ))}
          </div>
          <p className="mt-8 text-[13px] text-ag-gray-light italic leading-relaxed max-w-3xl">
            {t('data.reading')}
          </p>
        </div>
      </section>

      {/* Repli */}
      <section className="py-24 bg-ag-navy">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <h2 className="font-sans font-bold text-white tracking-[-0.02em] mb-10" style={{ fontSize: 'clamp(26px,3vw,44px)' }}>
            {t('bottom.title')}
          </h2>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href={{ pathname: '/contact', query: { type: 'transition' } } as never}
              className="rounded-lg inline-flex items-center justify-center gap-2 bg-ag-apex text-ag-navy font-mono text-[11px] tracking-[0.14em] uppercase px-7 py-3.5 font-semibold hover:bg-ag-apex/90 transition-colors"
            >
              {t('hero.ctaNeed')} <ArrowUpRight size={12} />
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
