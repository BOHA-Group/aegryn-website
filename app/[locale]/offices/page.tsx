import { getTranslations } from 'next-intl/server'
import { generateAegrynMetadata } from '@/lib/seo'
import type { Metadata } from 'next'
import { MapPin } from 'lucide-react'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  return generateAegrynMetadata({
    title: 'Our Offices | Aegryn Switzerland & Europe',
    description: 'Aegryn offices in Switzerland and across Europe. Contact us for tech M&A advisory, asset certification, and executive search.',
    path: '/offices',
    locale,
  })
}

const OFFICES = [
  {
    country: 'Switzerland',
    address: 'Rue du Centre 142',
    city: '1025 St-Sulpice',
    region: 'Vaud',
  },
]

export default async function OfficesPage({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'offices' })

  return (
    <>
      {/* Hero */}
      <section className="border-b border-ag-border">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-32">
          <p className="font-sans font-semibold text-[11px] uppercase tracking-[0.25em] text-ag-gray-light mb-6">
            {t('hero.label')}
          </p>
          <h1
            className="font-sans font-bold text-ag-black tracking-[-0.03em] leading-[1.15] max-w-3xl"
            style={{ fontSize: 'clamp(48px,6vw,88px)' }}
          >
            {t('hero.title')}
          </h1>
          <p className="mt-8 text-[15px] text-ag-gray leading-relaxed max-w-xl">
            {t('hero.desc')}
          </p>
        </div>
      </section>

      {/* Offices list */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {OFFICES.map((office, idx) => (
              <div
                key={idx}
                className="bg-white border border-ag-border p-8 hover:border-ag-apex transition-colors"
              >
                <div className="flex items-start gap-3 mb-4">
                  <MapPin size={20} className="text-ag-apex mt-1" />
                  <div>
                    <h2 className="font-sans font-bold text-ag-black text-[18px] tracking-[-0.01em] mb-2">
                      {office.country}
                    </h2>
                    <p className="text-[14px] text-ag-gray leading-relaxed">
                      {office.address}
                      <br />
                      {office.city}
                      {office.region && (
                        <>
                          <br />
                          {office.region}
                        </>
                      )}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Contact */}
      <section className="bg-ag-navy py-28 px-6 md:px-12">
        <div className="max-w-7xl mx-auto text-center">
          <h2
            className="font-sans font-bold text-white tracking-[-0.03em] leading-[1.1] mb-6"
            style={{ fontSize: 'clamp(28px,3.5vw,52px)' }}
          >
            {t('cta.title')}
          </h2>
          <p className="text-[15px] text-white/70 leading-relaxed max-w-2xl mx-auto mb-10">
            {t('cta.desc')}
          </p>
          <a
            href="/contact"
            className="inline-flex items-center gap-3 font-sans font-semibold text-[11px] tracking-[0.16em] uppercase text-ag-navy bg-white px-8 py-4 hover:bg-ag-apex transition-all"
          >
            {t('cta.btn')}
          </a>
        </div>
      </section>
    </>
  )
}
