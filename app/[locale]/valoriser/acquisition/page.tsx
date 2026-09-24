import { getTranslations } from 'next-intl/server'
import type { Metadata } from 'next'
import { Link } from '@/i18n/navigation'
import { ArrowUpRight, Bug, FileWarning, ShieldAlert, UserX, Cpu, ScrollText, ShieldCheck, UserSearch, BadgeCheck, ClipboardList } from 'lucide-react'
import { generateAegrynMetadata } from '@/lib/seo'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'valoriser.acquisition.meta' })
  return generateAegrynMetadata({ title: t('title'), description: t('desc'), path: '/valoriser/acquisition', locale })
}

export default async function ValoriserAcquisitionPage({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'valoriser.acquisition' })

  const PAINS = [
    { key: 'pain1', icon: <Bug size={18} className="text-ag-apex-ink" /> },
    { key: 'pain2', icon: <FileWarning size={18} className="text-ag-apex-ink" /> },
    { key: 'pain3', icon: <ShieldAlert size={18} className="text-ag-apex-ink" /> },
    { key: 'pain4', icon: <UserX size={18} className="text-ag-apex-ink" /> },
  ] as const

  const SERVICES = [
    { key: 'svc1', icon: <Cpu size={18} className="text-ag-apex-ink" /> },
    { key: 'svc2', icon: <ScrollText size={18} className="text-ag-apex-ink" /> },
    { key: 'svc3', icon: <ShieldCheck size={18} className="text-ag-apex-ink" /> },
    { key: 'svc4', icon: <UserSearch size={18} className="text-ag-apex-ink" /> },
    { key: 'svc5', icon: <BadgeCheck size={18} className="text-ag-apex-ink" /> },
    { key: 'svc6', icon: <ClipboardList size={18} className="text-ag-apex-ink" /> },
  ] as const

  return (
    <main className="bg-ag-white">
      {/* ── Hero ── */}
      <section className="bg-ag-navy pt-24 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <p className="font-mono text-[10px] tracking-[0.28em] uppercase text-ag-apex mb-5 flex items-center gap-3">
            <span className="w-6 h-px bg-ag-apex/50 inline-block" />
            {t('surtitle')}
          </p>
          <h1
            className="font-sans font-bold text-white leading-[1.05] tracking-[-0.03em] max-w-2xl mb-5 whitespace-pre-line"
            style={{ fontSize: 'clamp(32px,4.5vw,64px)' }}
          >
            {t('heroTitle')}
          </h1>
          <p className="font-sans text-[16px] text-white/55 max-w-xl mb-10 leading-relaxed">
            {t('heroDesc')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/contact"
              className="rounded-lg inline-flex items-center gap-2 bg-ag-apex text-ag-navy font-mono text-[11px] tracking-[0.14em] uppercase px-7 py-3.5 font-semibold hover:bg-ag-apex/90 transition-colors"
            >
              {t('cta1')} <ArrowUpRight size={13} />
            </Link>
            <Link
              href="/grade"
              className="rounded-lg inline-flex items-center gap-2 border border-white/25 text-white/75 font-mono text-[11px] tracking-[0.14em] uppercase px-7 py-3.5 hover:border-white/50 hover:text-white transition-all"
            >
              {t('cta2')}
            </Link>
          </div>
        </div>
      </section>

      {/* ── Ce que les DD classiques ne voient pas ── */}
      <section className="py-24 px-6 border-t border-ag-border">
        <div className="max-w-7xl mx-auto">
          <div className="mb-14 max-w-2xl">
            <p className="font-mono text-[10px] tracking-[0.28em] uppercase text-ag-gray-light mb-4">
              {t('realitiesLabel')}
            </p>
            <p className="font-sans text-[16px] text-ag-gray leading-relaxed">
              {t('realitiesIntro')}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-ag-border border border-ag-border">
            {PAINS.map(({ key, icon }) => (
              <div key={key} className="bg-ag-white p-10 flex flex-col gap-5">
                <div className="w-10 h-10 border border-ag-apex/30 flex items-center justify-center shrink-0">{icon}</div>
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-ag-apex-ink mb-2">{t(`${key}Title`)}</p>
                  <p className="font-sans text-[13px] text-ag-gray leading-relaxed">{t(`${key}Desc`)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Rôle Operating Partner ── */}
      <section className="py-24 px-6 bg-ag-off-white border-t border-ag-border">
        <div className="max-w-7xl mx-auto">
          <div className="mb-14 max-w-2xl">
            <p className="font-mono text-[10px] tracking-[0.28em] uppercase text-ag-gray-light mb-4">
              {t('roleLabel')}
            </p>
            <p className="font-sans text-[16px] text-ag-gray leading-relaxed">{t('roleIntro')}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SERVICES.map(({ key, icon }) => (
              <Link
                key={key}
                href={t(`${key}Href`) as never}
                className="group rounded-2xl bg-ag-white border border-ag-border p-8 flex flex-col gap-4 hover:border-ag-navy/40 transition-colors"
              >
                <div className="w-10 h-10 rounded-lg border border-ag-apex/30 flex items-center justify-center">{icon}</div>
                <p className="font-sans font-semibold text-ag-black text-[15px] leading-snug tracking-[-0.02em]">{t(`${key}Title`)}</p>
                <p className="font-sans text-[13px] text-ag-gray leading-relaxed">{t(`${key}Desc`)}</p>
                <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-ag-navy flex items-center gap-1.5 mt-auto group-hover:gap-2.5 transition-all">
                  <ArrowUpRight size={11} />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Processus en 4 étapes ── */}
      <section className="py-24 px-6 border-t border-ag-border">
        <div className="max-w-7xl mx-auto">
          <p className="font-mono text-[10px] tracking-[0.28em] uppercase text-ag-gray-light mb-14">{t('processLabel')}</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-ag-border border border-ag-border">
            {([1, 2, 3, 4] as const).map((n) => (
              <div key={n} className="bg-ag-white p-10 flex flex-col gap-3">
                <span className="font-mono text-[11px] tracking-[0.18em] text-ag-apex-ink">0{n}</span>
                <p className="font-sans font-semibold text-ag-black text-[16px] leading-snug tracking-[-0.02em]">{t(`process${n}Title`)}</p>
                <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-ag-gray-light">{t(`process${n}Range`)}</p>
                <p className="font-sans text-[13px] text-ag-gray leading-relaxed">{t(`process${n}Desc`)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pour qui ── */}
      <section className="py-24 px-6 bg-ag-off-white border-t border-ag-border">
        <div className="max-w-7xl mx-auto">
          <p className="font-mono text-[10px] tracking-[0.28em] uppercase text-ag-gray-light mb-12">{t('audienceLabel')}</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-ag-border border border-ag-border">
            <div className="bg-ag-white p-10 flex flex-col gap-3">
              <p className="font-sans font-semibold text-ag-black text-[16px] leading-snug tracking-[-0.02em]">{t('audience1Title')}</p>
              <p className="font-sans text-[13px] text-ag-gray leading-relaxed">{t('audience1Desc')}</p>
            </div>
            <div className="bg-ag-white p-10 flex flex-col gap-3">
              <p className="font-sans font-semibold text-ag-black text-[16px] leading-snug tracking-[-0.02em]">{t('audience2Title')}</p>
              <p className="font-sans text-[13px] text-ag-gray leading-relaxed">{t('audience2Desc')}</p>
            </div>
            <div className="bg-ag-white p-10 flex flex-col gap-3">
              <p className="font-sans font-semibold text-ag-black text-[16px] leading-snug tracking-[-0.02em]">{t('audience3Title')}</p>
              <p className="font-sans text-[13px] text-ag-gray leading-relaxed">{t('audience3Desc')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA final ── */}
      <section className="bg-ag-navy py-20 px-6 border-t border-white/10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <p className="font-sans font-bold text-white text-[22px] max-w-md leading-snug">{t('heroTitle')}</p>
          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <Link
              href="/contact"
              className="rounded-lg inline-flex items-center gap-2 bg-ag-apex text-ag-navy font-mono text-[11px] tracking-[0.14em] uppercase px-6 py-3 font-semibold hover:bg-ag-apex/90 transition-colors"
            >
              {t('ctaPrimary')} <ArrowUpRight size={13} />
            </Link>
            <Link
              href="/grade"
              className="rounded-lg inline-flex items-center gap-2 border border-white/25 text-white/75 font-mono text-[11px] tracking-[0.14em] uppercase px-6 py-3 hover:border-white/50 hover:text-white transition-all"
            >
              {t('ctaSecondary')}
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
