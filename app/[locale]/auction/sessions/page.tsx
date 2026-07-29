import { getTranslations } from 'next-intl/server'
import type { Metadata } from 'next'
import NextLink from 'next/link'
import { Link } from '@/i18n/navigation'
import Image from 'next/image'
import { Calendar, MapPin, Users, ArrowUpRight, Bell, Lock } from 'lucide-react'
import WaitlistForm from '@/components/auction/WaitlistForm'
import { getUser } from '@/lib/supabaseServer'
import { checkAuctionCatalogAccess } from '@/lib/auctionAccess'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'auction.session' })
  return { title: t('title'), description: t('registerDesc') }
}

export default async function AuctionSessionPage({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'auction.session' })

  const user = await getUser()
  const accessStatus = user
    ? await checkAuctionCatalogAccess(user.id)
    : 'not_authenticated'
  const hasLotAccess = accessStatus === 'ok'

  const details = [
    { icon: Calendar, label: t('date'),   value: t('dateTbd')      },
    { icon: Users,    label: t('format'), value: t('formatValue')  },
    { icon: MapPin,   label: t('location'), value: t('locationValue') },
  ]

  return (
    <main className="bg-ag-white">
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

      {/* Assets in session — liste style Antiquorum (vignette + statut + CTA) */}
      <section className="py-20 px-6 border-t border-ag-border">
        <div className="max-w-7xl mx-auto">
          <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-ag-gray-light mb-8">
            {t('upcomingSessions')}
          </p>

          <div className="border border-ag-border bg-ag-white flex flex-col md:flex-row gap-0 md:gap-8 hover:border-ag-black/30 transition-colors">
            {/* Vignette — format vertical 9:16, image visible en totalité (style Antiquorum) */}
            <div className="relative w-full md:w-[166px] shrink-0 bg-ag-off-white overflow-hidden" style={{ aspectRatio: '9 / 16' }}>
              <Image
                src="/images/auction/auction_legal tech_T32026.jpg"
                alt={t('sessionCardTitle')}
                fill
                className="object-contain"
                sizes="166px"
              />
              <span className="absolute top-3 left-3 bg-ag-apex text-ag-navy font-mono font-semibold text-[10px] tracking-[0.14em] uppercase px-3 py-1.5">
                {t('sessionCardStatus')}
              </span>
            </div>

            {/* Détails */}
            <div className="flex-1 py-8 pr-8 pl-6 md:pl-0 flex flex-col md:flex-row md:items-center gap-6">
              <div className="flex-1">
                <p className="font-mono text-[9px] tracking-[0.2em] uppercase text-ag-apex-ink mb-2">
                  {t('sessionCardKicker')} — {t('sessionCardCategory')}
                </p>
                <h2 className="font-sans font-bold text-ag-black text-[20px] tracking-[-0.02em] leading-snug mb-3">
                  {t('sessionCardTitle')}
                </h2>
                <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-ag-gray">
                  <span className="flex items-center gap-1.5 font-sans text-[13px]">
                    <MapPin size={13} className="text-ag-gray-light" /> {t('sessionCardLocation')}
                  </span>
                  <span className="flex items-center gap-1.5 font-sans text-[13px]">
                    <Calendar size={13} className="text-ag-gray-light" /> {t('sessionCardDateValue')}
                  </span>
                </div>
              </div>

              {/* CTAs — équivalent Price List / Top Lots / Catalog */}
              <div className="flex flex-wrap items-center gap-2 shrink-0">
                {hasLotAccess ? (
                  <Link
                    href="/auction/teaser-preview"
                    className="inline-flex items-center gap-2 bg-ag-navy text-white font-mono text-[10px] tracking-[0.14em] uppercase px-4 py-2.5 hover:bg-ag-navy-mid transition-colors"
                  >
                    {t('sessionCardCtaPreview')}
                  </Link>
                ) : (
                  <div className="flex flex-col gap-1.5">
                    <span className="inline-flex items-center gap-2 bg-ag-off-white border border-ag-border text-ag-gray-light font-mono text-[10px] tracking-[0.14em] uppercase px-4 py-2.5 cursor-not-allowed select-none">
                      <Lock size={11} /> {t('sessionCardCtaPreview')}
                    </span>
                    <p className="font-sans text-[11px] text-ag-gray-light leading-tight">
                      {t('sessionCardLocked')}
                    </p>
                    <NextLink
                      href="/client/register"
                      className="font-sans text-[11px] font-semibold text-ag-apex-ink underline underline-offset-2 hover:text-ag-apex transition-colors"
                    >
                      {t('sessionCardLockedCta')} →
                    </NextLink>
                  </div>
                )}
                <Link
                  href="/auction/catalog"
                  className="inline-flex items-center gap-2 border border-ag-border text-ag-gray font-mono text-[10px] tracking-[0.14em] uppercase px-4 py-2.5 hover:border-ag-black hover:text-ag-black transition-colors"
                >
                  {t('sessionCardCtaCatalog')}
                </Link>
                <Link
                  href={{ pathname: '/auction/catalog', hash: 'notify' }}
                  className="inline-flex items-center gap-2 border border-ag-apex/40 text-ag-apex-ink font-mono text-[10px] tracking-[0.14em] uppercase px-4 py-2.5 hover:border-ag-apex hover:bg-ag-apex/10 transition-colors"
                >
                  <Bell size={11} /> {t('sessionCardCtaNotify')}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Waiting list */}
      <section id="waitlist" className="py-20 px-6 bg-ag-off-white border-t border-ag-border">
        <div className="max-w-7xl mx-auto">
          <div className="mb-10 max-w-xl">
            <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-ag-apex mb-3">
              Accès prioritaire
            </p>
            <h2 className="font-sans font-bold text-ag-black text-[26px] tracking-[-0.02em] leading-tight mb-3">
              {t('registerTitle')}
            </h2>
            <p className="font-sans text-[14px] text-ag-gray leading-relaxed">
              {t('registerDesc')}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
            {/* Formulaire */}
            <WaitlistForm locale={locale} />

            {/* Seller CTA (conservé) */}
            <div className="border border-ag-apex/30 bg-ag-white p-10 flex flex-col gap-6">
              <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-ag-apex-ink">{t('sellerTitle')}</p>
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
