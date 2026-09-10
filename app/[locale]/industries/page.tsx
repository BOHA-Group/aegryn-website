import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { generateAegrynMetadata } from '@/lib/seo'
import { ArrowUpRight } from 'lucide-react'
import Image from 'next/image'
import { Link } from '@/i18n/navigation'

type Props = { params: Promise<{ locale: string }> }

interface Sector {
  name: string
  desc: string
  tag: string
}

interface Cluster {
  id: string
  cluster: string
  image: string
  vision: string
  sectors: Sector[]
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'industries.page.meta' })
  return generateAegrynMetadata({
    title: t('title'),
    description: t('desc'),
    path: '/industries',
    locale,
  })
}


export default async function IndustriesPage({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'industries.page' })

  const clusters = t.raw('clusters') as Cluster[]

  return (
    <main>
      {/* ── Hero ── */}
      <section className="bg-ag-navy pt-32 pb-24 px-6">
        <div className="max-w-7xl mx-auto">
          <p className="font-mono text-[10px] tracking-[0.28em] uppercase text-ag-apex mb-6 flex items-center gap-3">
            <span className="w-6 h-px bg-ag-apex/50 inline-block" />
            {t('label')}
          </p>
          <h1
            className="font-sans font-bold text-white leading-[1.05] tracking-[-0.03em] max-w-3xl mb-6 whitespace-pre-line"
            style={{ fontSize: 'clamp(36px,5vw,68px)' }}
          >
            {t('title')}
          </h1>
          <p className="font-sans text-[16px] text-white/55 max-w-2xl mb-12 leading-relaxed">
            {t('desc')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/grade"
              className="inline-flex items-center gap-2 bg-ag-apex text-ag-navy font-mono text-[11px] tracking-[0.14em] uppercase px-7 py-3.5 font-semibold hover:bg-ag-apex/90 transition-colors"
            >
              {t('certifCta')} <ArrowUpRight size={13} />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 border border-white/25 text-white/75 font-mono text-[11px] tracking-[0.14em] uppercase px-7 py-3.5 hover:border-white/50 hover:text-white transition-all"
            >
              {t('contactCta')}
            </Link>
          </div>
        </div>
      </section>

      {/* ── Clusters industries ── */}
      <section className="py-24 px-6 bg-ag-white border-t border-ag-border" id="sectors">
        <div className="max-w-7xl mx-auto">
          <p className="font-mono text-[10px] tracking-[0.28em] uppercase text-ag-gray-light mb-16">
            {t('industriesTitle')}
          </p>

          <div className="flex flex-col gap-0 divide-y divide-ag-border border-t border-ag-border">
            {clusters.map((cluster, ci) => (
              <div key={cluster.id} id={cluster.id}>
                {/* Cluster header */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
                  {/* Image */}
                  <div className="lg:col-span-4 relative overflow-hidden" style={{ minHeight: 320 }}>
                    <Image
                      src={cluster.image}
                      alt={cluster.cluster}
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-ag-navy/60" />
                    <div className="absolute bottom-0 left-0 p-8">
                      <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-ag-apex mb-2">
                        {String(ci + 1).padStart(2, '0')}
                      </p>
                      <h2 className="font-sans font-bold text-white text-[22px] leading-tight tracking-[-0.02em]">
                        {cluster.cluster}
                      </h2>
                    </div>
                  </div>

                  {/* Vision + sectors */}
                  <div className="lg:col-span-8 p-8 lg:p-10 bg-ag-white flex flex-col gap-6">
                    <p className="font-sans text-[14px] text-ag-gray leading-relaxed max-w-2xl">
                      {cluster.vision}
                    </p>

                    {/* Sectors grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-px bg-ag-border border border-ag-border mt-2">
                      {cluster.sectors.map(sector => (
                        <div key={sector.name} className="bg-ag-white p-5 flex flex-col gap-2">
                          <div className="flex items-start justify-between gap-2">
                            <p className="font-sans font-semibold text-ag-black text-[13px] leading-snug">
                              {sector.name}
                            </p>
                            <span className="font-mono text-[8px] tracking-[0.1em] uppercase px-2 py-0.5 bg-ag-off-white border border-ag-border text-ag-gray-light shrink-0">
                              {sector.tag}
                            </span>
                          </div>
                          <p className="font-sans text-[12px] text-ag-gray leading-relaxed">
                            {sector.desc}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Bottom CTA ── */}
      <section className="py-20 px-6 bg-ag-white border-t border-ag-border">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div>
            <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-ag-gray-light mb-3">
              Aegryn
            </p>
            <p className="font-sans font-bold text-ag-black text-[22px] max-w-lg leading-snug tracking-[-0.02em]">
              {t('certifCta')}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <Link
              href="/grade"
              className="inline-flex items-center gap-2 bg-ag-navy text-white font-mono text-[11px] tracking-[0.14em] uppercase px-6 py-3 font-semibold hover:bg-ag-black transition-colors"
            >
              {t('certifCta')} <ArrowUpRight size={13} />
            </Link>
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 border border-ag-border text-ag-gray font-mono text-[11px] tracking-[0.14em] uppercase px-6 py-3 hover:border-ag-black hover:text-ag-black transition-all"
            >
              {t('articlesCta')} <ArrowUpRight size={13} />
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
