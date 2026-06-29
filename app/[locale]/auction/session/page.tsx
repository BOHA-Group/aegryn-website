import { getTranslations } from 'next-intl/server'
import { useTranslations } from 'next-intl'
import type { Metadata } from 'next'
import Link from 'next/link'
import { Calendar, MapPin, Users, ArrowUpRight } from 'lucide-react'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'auction.session' })
  return { title: t('title'), description: t('registerDesc') }
}

export default function AuctionSessionPage() {
  const t = useTranslations('auction.session')

  const details = [
    { icon: Calendar, label: t('date'),   value: t('dateTbd')      },
    { icon: Users,    label: t('format'), value: t('formatValue')  },
    { icon: MapPin,   label: t('location'), value: t('locationValue') },
  ]

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
            className="font-sans font-bold text-white leading-[1.05] tracking-[-0.03em] max-w-2xl mb-10"
            style={{ fontSize: 'clamp(32px,4.5vw,64px)' }}
          >
            {t('title')}
          </h1>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {details.map(({ icon: Icon, label, value }) => (
              <div key={label} className="border border-white/15 p-6 flex flex-col gap-3">
                <Icon size={16} className="text-ag-apex" />
                <p className="font-mono text-[10px] tracking-[0.18em] uppercase text-white/40">{label}</p>
                <p className="font-sans font-semibold text-white text-[14px]">{value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Assets in session */}
      <section className="py-20 px-6 border-t border-ag-border">
        <div className="max-w-7xl mx-auto">
          <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-ag-gray-light mb-4">
            {t('assetsLabel')}
          </p>
          <p className="font-sans text-[15px] text-ag-gray">{t('assetsTbd')}</p>
        </div>
      </section>

      {/* Two-column CTAs */}
      <section className="py-20 px-6 bg-ag-off-white border-t border-ag-border">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Buyer */}
          <div className="border border-ag-border bg-ag-white p-10 flex flex-col gap-6">
            <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-ag-apex">{t('registerTitle')}</p>
            <p className="font-sans font-bold text-ag-black text-[20px] leading-snug tracking-[-0.02em]">
              {t('registerTitle')}
            </p>
            <p className="font-sans text-[14px] text-ag-gray leading-relaxed">{t('registerDesc')}</p>
            <Link
              href="/contact"
              className="self-start inline-flex items-center gap-2 bg-ag-navy text-white font-mono text-[11px] tracking-[0.14em] uppercase px-6 py-3 hover:bg-ag-navy-mid transition-colors"
            >
              {t('registerCta')} <ArrowUpRight size={13} />
            </Link>
          </div>
          {/* Seller */}
          <div className="border border-ag-apex/30 bg-ag-white p-10 flex flex-col gap-6">
            <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-ag-apex">{t('sellerTitle')}</p>
            <p className="font-sans font-bold text-ag-black text-[20px] leading-snug tracking-[-0.02em]">
              {t('sellerTitle')}
            </p>
            <p className="font-sans text-[14px] text-ag-gray leading-relaxed">{t('sellerDesc')}</p>
            <Link
              href="/auction/how-to-sell"
              className="self-start inline-flex items-center gap-2 bg-ag-apex text-ag-navy font-mono text-[11px] tracking-[0.14em] uppercase px-6 py-3 font-semibold hover:bg-ag-apex/90 transition-colors"
            >
              {t('sellerCta')} <ArrowUpRight size={13} />
            </Link>
          </div>
        </div>
      </section>

      {/* Past sessions */}
      <section className="py-16 px-6 border-t border-ag-border">
        <div className="max-w-7xl mx-auto">
          <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-ag-gray-light mb-6">
            {t('pastSessions')}
          </p>
          <p className="font-sans text-[14px] text-ag-gray">{t('noSessions')}</p>
        </div>
      </section>
    </main>
  )
}
