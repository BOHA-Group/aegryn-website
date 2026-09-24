import { getTranslations } from 'next-intl/server'
import type { Metadata } from 'next'
import Image from 'next/image'
import { Link } from '@/i18n/navigation'
import { ArrowUpRight, Gauge, BadgeCheck, Rocket, TrendingUp, RefreshCw, Search, Handshake } from 'lucide-react'
import { generateAegrynMetadata } from '@/lib/seo'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'valoriser.overview.meta' })
  return generateAegrynMetadata({ title: t('title'), description: t('desc'), path: '/valoriser', locale })
}

export default async function ValoriserPage({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'valoriser.overview' })

  const CYCLES = [
    { key: 'cycle1', href: '/valoriser/lancement',       icon: <Rocket size={20} className="text-ag-apex-ink" /> },
    { key: 'cycle2', href: '/valoriser/croissance',       icon: <TrendingUp size={20} className="text-ag-apex-ink" /> },
    { key: 'cycle3', href: '/valoriser/restructuration',  icon: <RefreshCw size={20} className="text-ag-apex-ink" /> },
    { key: 'cycle4', href: '/valoriser/acquisition',      icon: <Search size={20} className="text-ag-apex-ink" /> },
    { key: 'cycle5', href: '/valoriser/transmission',     icon: <Handshake size={20} className="text-ag-apex-ink" /> },
  ] as const

  const STATS = [
    { value: t('stat1Value'), label: t('stat1Label') },
    { value: t('stat2Value'), label: t('stat2Label') },
    { value: t('stat3Value'), label: t('stat3Label') },
    { value: t('stat4Value'), label: t('stat4Label') },
  ]

  return (
    <main>
      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-ag-navy pt-32 pb-24 px-6">
        <Image
          src="/images/transact/hero-valorisation.webp"
          alt="Valorisation d'organisation — Aegryn Group"
          fill
          priority
          unoptimized
          sizes="100vw"
          placeholder="blur"
          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/7QAkUGhvdG9zaG9wIDMuMAA4QklNBAQAAAAAAAgcAVoAAxslR//hAIBFeGlmAABJSSoACAAAAAUAEgEDAAEAAAABAAAAGgEFAAEAAABKAAAAGwEFAAEAAABSAAAAKAEDAAEAAAACAAAAaYcEAAEAAABaAAAAAAAAAEgAAAABAAAASAAAAAEAAAACAAKgBAABAAAAMBQAAAOgBAABAAAAYAsAAAAAAAD/4QD6aHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLwA8P3hwYWNrZXQgYmVnaW49IiIgaWQ9Ilc1TTBNcENlaGlIenJlU3pOVGN6a2M5ZCI/Pgo8eDp4bXBtZXRhIHhtbG5zOng9ImFkb2JlOm5zOm1ldGEvIiB4OnhtcHRrPSJHbyBYTVAgU0RLIDEuMCI+PHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj48L3JkZjpSREY+PC94OnhtcG1ldGE+Cjw/eHBhY2tldCBlbmQ9InciPz7/2wBDAA4KCw0LCQ4NDA0QDw4RFiQXFhQUFiwgIRokNC43NjMuMjI6QVNGOj1OPjIySGJJTlZYXV5dOEVmbWVabFNbXVn/2wBDAQ8QEBYTFioXFypZOzI7WVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVlZWVn/wAARCAAOABgDASIAAhEBAxEB/8QAGAAAAgMAAAAAAAAAAAAAAAAAAAYDBAX/xAAjEAACAQQABgMAAAAAAAAAAAABAgMABAURIjJBYXGRQlGh/8QAFgEBAQEAAAAAAAAAAAAAAAAABAAC/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAIBEQMhMf/aAAwDAQACEQMRAD8Ap4K4EwC3dvMjKpJ0vC3cHp4rQt4Ipog0rFX2QRrf7SljL9rE7jUHfMD8vNSR5OeFAiMVUdAaUrtfQrItcGeYWMYIV2dh9AAD3RSzJlZpFKycQ7gE+6KzLZr0xRGGtqf/2Q=="
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/25 to-black/80" />
        <div className="relative max-w-7xl mx-auto">
          <p className="font-mono text-[10px] tracking-[0.28em] uppercase text-ag-apex mb-6 flex items-center gap-3">
            <span className="w-6 h-px bg-ag-apex/50 inline-block" />
            {t('eyebrow')}
          </p>
          <h1
            className="font-sans font-bold text-white leading-[1.05] tracking-[-0.03em] max-w-3xl mb-6 whitespace-pre-line"
            style={{ fontSize: 'clamp(36px,5vw,72px)' }}
          >
            {t('heroTitle')}
          </h1>
          <p className="font-sans text-[16px] text-white/55 max-w-xl mb-12 leading-relaxed">
            {t('heroDesc')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/valuation"
              className="rounded-lg inline-flex items-center gap-2 bg-ag-apex text-ag-navy font-mono text-[11px] tracking-[0.14em] uppercase px-7 py-3.5 font-semibold hover:bg-ag-apex/90 transition-colors"
            >
              {t('ctaValuation')} <ArrowUpRight size={13} />
            </Link>
            <Link
              href="/grade"
              className="rounded-lg inline-flex items-center gap-2 border border-white/25 text-white/75 font-mono text-[11px] tracking-[0.14em] uppercase px-7 py-3.5 hover:border-white/50 hover:text-white transition-all"
            >
              {t('ctaGrade')}
            </Link>
          </div>
        </div>
      </section>

      {/* ── Séquence en deux temps ── */}
      <section className="py-24 px-6 bg-ag-off-white border-t border-ag-border">
        <div className="max-w-7xl mx-auto">
          <div className="mb-14">
            <p className="font-mono text-[10px] tracking-[0.28em] uppercase text-ag-gray-light mb-4">
              {t('sequenceLabel')}
            </p>
            <h2
              className="font-sans font-bold text-ag-black tracking-[-0.03em] leading-tight max-w-2xl whitespace-pre-line"
              style={{ fontSize: 'clamp(26px,3vw,44px)' }}
            >
              {t('sequenceTitle')}
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link
              href="/valuation"
              className="group rounded-2xl bg-ag-white border border-ag-border p-10 flex flex-col gap-5 hover:border-ag-navy/40 transition-colors"
            >
              <div className="w-10 h-10 rounded-lg border border-ag-apex/30 flex items-center justify-center"><Gauge size={18} className="text-ag-apex-ink" /></div>
              <div>
                <p className="font-sans font-bold text-ag-black text-[22px] leading-snug tracking-[-0.02em] mb-3">{t('step1Title')}</p>
                <p className="font-sans text-[14px] text-ag-gray leading-relaxed">{t('step1Desc')}</p>
              </div>
            </Link>
            <Link
              href="/grade"
              className="group rounded-2xl bg-ag-white border border-ag-border p-10 flex flex-col gap-5 hover:border-ag-navy/40 transition-colors"
            >
              <div className="w-10 h-10 rounded-lg border border-ag-apex/30 flex items-center justify-center"><BadgeCheck size={18} className="text-ag-apex-ink" /></div>
              <div>
                <p className="font-sans font-bold text-ag-black text-[22px] leading-snug tracking-[-0.02em] mb-3">{t('step2Title')}</p>
                <p className="font-sans text-[14px] text-ag-gray leading-relaxed">{t('step2Desc')}</p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* ── À quel moment Aegryn intervient ── */}
      <section className="py-24 px-6 bg-ag-white border-t border-ag-border">
        <div className="max-w-7xl mx-auto">
          <div className="mb-14">
            <p className="font-mono text-[10px] tracking-[0.28em] uppercase text-ag-gray-light mb-4">
              {t('momentsLabel')}
            </p>
            <h2
              className="font-sans font-bold text-ag-black tracking-[-0.03em] leading-tight max-w-2xl whitespace-pre-line"
              style={{ fontSize: 'clamp(26px,3vw,44px)' }}
            >
              {t('momentsTitle')}
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-px bg-ag-border border border-ag-border">
            {CYCLES.map(({ key, href, icon }) => (
              <Link
                key={key}
                href={href}
                className="group bg-ag-white p-8 flex flex-col gap-5 hover:bg-ag-off-white transition-colors"
              >
                <div className="w-10 h-10 border border-ag-apex/30 flex items-center justify-center">{icon}</div>
                <div>
                  <p className="font-sans font-semibold text-ag-black text-[15px] leading-snug tracking-[-0.02em] mb-2">
                    {t(`${key}Title`)}
                  </p>
                  <p className="font-sans text-[13px] text-ag-gray leading-relaxed">
                    {t(`${key}Desc`)}
                  </p>
                </div>
                <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-ag-apex-ink flex items-center gap-1.5 mt-auto group-hover:gap-2.5 transition-all">
                  <ArrowUpRight size={11} />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Chiffres clés ── */}
      <section className="py-24 px-6 bg-ag-off-white border-t border-ag-border">
        <div className="max-w-7xl mx-auto">
          <p className="font-mono text-[10px] tracking-[0.28em] uppercase text-ag-gray-light mb-14">
            {t('statsLabel')}
          </p>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-ag-border border border-ag-border">
            {STATS.map(({ value, label }) => (
              <div key={label} className="bg-ag-white p-5 sm:p-8 flex flex-col gap-2">
                <span className="font-sans font-bold text-ag-black tracking-[-0.03em]" style={{ fontSize: 'clamp(24px,2.5vw,36px)' }}>{value}</span>
                <span className="font-sans text-[12px] text-ag-gray leading-snug">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Bottom CTA strip ── */}
      <section className="bg-ag-navy py-20 px-6 border-t border-white/10">
        <div className="max-w-7xl mx-auto flex flex-col gap-8">
          <div className="flex flex-wrap gap-3">
            {CYCLES.map(({ key, href }) => (
              <Link
                key={key}
                href={href}
                className="rounded-lg inline-flex items-center gap-2 border border-white/25 text-white/75 font-mono text-[11px] tracking-[0.14em] uppercase px-5 py-2.5 hover:border-white/50 hover:text-white transition-all"
              >
                {t(`${key}Title`)}
              </Link>
            ))}
          </div>
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
            <p className="font-sans font-bold text-white text-[22px] max-w-md leading-snug">
              {t('momentsTitle')}
            </p>
            <Link
              href="/contact"
              className="rounded-lg shrink-0 inline-flex items-center gap-2 bg-ag-apex text-ag-navy font-mono text-[11px] tracking-[0.14em] uppercase px-6 py-3 font-semibold hover:bg-ag-apex/90 transition-colors"
            >
              {t('ctaContact')} <ArrowUpRight size={13} />
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
