import { getTranslations } from 'next-intl/server'
import Link                from 'next/link'
import Image               from 'next/image'
import { ArrowUpRight }    from 'lucide-react'
import { generateAegrynMetadata } from '@/lib/seo'
import type { Metadata }   from 'next'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  return generateAegrynMetadata({
    title: 'Careers | Integrated Advisory Group | Aegryn',
    description: 'Join Aegryn, an integrated advisory group hiring senior talents across advisory, build, transitions, talent and market intelligence.',
    path: '/career',
    locale,
  })
}

const CRAFTS = ['accompagner', 'construire', 'franchir', 'recruter', 'informer'] as const
const VALUES = ['precision', 'durability', 'sovereignty', 'trust'] as const

const CRAFT_IMAGES: Record<(typeof CRAFTS)[number], string> = {
  accompagner: '/images/career/craft-conseil.jpg',
  construire:  '/images/career/craft-engineering.jpg',
  franchir:    '/images/career/craft-transformation.jpg',
  recruter:    '/images/career/craft-talent.jpg',
  informer:    '/images/career/craft-intelligence.jpg',
}

export default async function CareerPage({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'career' })
  const tm = await getTranslations({ locale, namespace: 'missionSection' })
  const disciplines = (tm.raw('items') as { title: string }[]).map((i) => i.title)

  return (
    <>
      {/* Hero */}
      <section className="border-b border-ag-border bg-ag-navy">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-32">
          <p className="font-sans font-semibold text-[11px] uppercase tracking-[0.28em] text-ag-apex/70 mb-8">
            {t('hero.label')}
          </p>
          <h1
            className="font-sans font-bold text-white tracking-[-0.03em] leading-[1.05] max-w-3xl mb-8 whitespace-pre-line"
            style={{ fontSize: 'clamp(48px,6vw,86px)' }}
          >
            {t('hero.title')}
          </h1>
          <p className="text-[16px] text-white/60 leading-relaxed max-w-xl">
            {t('hero.desc')}
          </p>
        </div>
      </section>

      {/* About Aegryn */}
      <section className="border-b border-ag-border py-24">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid md:grid-cols-2 gap-16 items-start">
            <div>
              <p className="font-sans font-semibold text-[11px] uppercase tracking-[0.25em] text-ag-gray-light mb-6">
                {t('about.label')}
              </p>
              <h2
                className="font-sans font-bold text-ag-black tracking-[-0.03em] leading-[1.1]"
                style={{ fontSize: 'clamp(26px,3vw,44px)' }}
              >
                {t('about.title')}
              </h2>
            </div>
            <div>
              <p className="text-[15px] text-ag-gray leading-relaxed">
                {t('about.desc')}
              </p>
              <p className="mt-6 font-sans font-semibold text-[11px] uppercase tracking-[0.2em] text-ag-apex-ink">
                {t('about.tagline')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our crafts */}
      <section className="border-b border-ag-border py-24">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <p className="font-sans font-semibold text-[11px] uppercase tracking-[0.25em] text-ag-gray-light mb-4">
            {t('crafts.label')}
          </p>
          <h2
            className="font-sans font-bold text-ag-black tracking-[-0.03em] leading-[1.1] mb-16"
            style={{ fontSize: 'clamp(26px,3vw,44px)' }}
          >
            {t('crafts.title')}
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {CRAFTS.map((key, i) => (
              <div
                key={key}
                className="group flex flex-col overflow-hidden rounded-xl border border-ag-border bg-white"
              >
                <div className="relative overflow-hidden" style={{ height: 'clamp(160px,16vw,210px)' }}>
                  <Image
                    src={CRAFT_IMAGES[key]}
                    alt={t(`crafts.items.${key}.title`)}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(min-width: 1024px) 20vw, (min-width: 640px) 50vw, 100vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent" />
                  <span className="absolute top-4 left-4 font-mono text-[9px] tracking-[0.22em] text-white/50">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <p className="absolute bottom-4 left-4 right-4 font-mono text-[8px] tracking-[0.22em] uppercase text-white/70">
                    {disciplines[i]}
                  </p>
                </div>
                <div className="flex-1 p-5">
                  <h3 className="font-sans font-bold text-ag-black text-[15px] tracking-[-0.01em] mb-3">
                    {t(`crafts.items.${key}.title`)}
                  </h3>
                  <p className="text-[13px] text-ag-gray leading-relaxed">
                    {t(`crafts.items.${key}.desc`)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="border-b border-ag-border py-24 bg-ag-off-white">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <p className="font-sans font-semibold text-[11px] uppercase tracking-[0.25em] text-ag-gray-light mb-4">
            {t('values.label')}
          </p>
          <h2
            className="font-sans font-bold text-ag-black tracking-[-0.03em] leading-[1.1] mb-16"
            style={{ fontSize: 'clamp(26px,3vw,44px)' }}
          >
            {t('values.title')}
          </h2>
          <div className="grid sm:grid-cols-2 gap-px bg-ag-border">
            {VALUES.map((key) => (
              <div key={key} className="bg-ag-off-white p-10">
                <h3 className="font-sans font-bold text-ag-black text-[15px] tracking-[0.04em] uppercase mb-3">
                  {t(`values.items.${key}.title`)}
                </h3>
                <p className="text-[14px] text-ag-gray leading-relaxed">
                  {t(`values.items.${key}.desc`)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* No open positions — spontaneous application */}
      <section className="bg-ag-navy py-28 px-6 md:px-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-10">
          <div>
            <p className="font-sans font-semibold text-[11px] tracking-[0.22em] uppercase text-white/60 mb-4">
              {t('openings.label')}
            </p>
            <h2
              className="font-sans font-bold text-white tracking-[-0.03em] leading-[1.1] max-w-xl"
              style={{ fontSize: 'clamp(26px,3vw,44px)' }}
            >
              {t('openings.title')}
            </h2>
            <p className="mt-4 text-[15px] text-white/60 leading-relaxed max-w-lg">
              {t('openings.desc')}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <Link
              href="/contact"
              className="rounded-lg inline-flex items-center gap-3 font-sans font-semibold text-[11px] tracking-[0.16em] uppercase bg-ag-apex text-ag-navy px-6 py-3 hover:bg-ag-apex/90 transition-colors"
            >
              {t('openings.cta')}
              <ArrowUpRight size={14} />
            </Link>
            <Link
              href="/alliances"
              className="rounded-lg inline-flex items-center gap-3 font-sans font-semibold text-[11px] tracking-[0.16em] uppercase border border-white/30 text-white px-6 py-3 hover:bg-white/10 transition-colors"
            >
              {t('openings.ctaPartner')}
              <ArrowUpRight size={14} />
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
