import { notFound } from 'next/navigation'
import Image from 'next/image'
import { Check } from 'lucide-react'
import { getTranslations } from 'next-intl/server'
import type { Metadata } from 'next'
import { Link } from '@/i18n/navigation'
import { generateAegrynMetadata } from '@/lib/seo'
import { assetPath } from '@/data/assets'
import { isNeediuProVisible } from '@/lib/neediuPro'
import { ProWaitlistForm } from '@/components/neediu/ProWaitlistForm'

type Props = { params: Promise<{ locale: string }>; searchParams: Promise<{ confirmed?: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'neediuPro' })
  const meta = generateAegrynMetadata({ title: t('meta.title'), description: t('meta.desc'), path: '/neediu/pro', locale })
  return { ...meta, robots: { index: false, follow: false } }
}

/** Page de préinscription des pros neediu : preview et local seulement, 404 en production avant le go. */
export default async function NeediuProPage({ params, searchParams }: Props) {
  if (!isNeediuProVisible()) notFound()
  const { locale } = await params
  const { confirmed } = await searchParams
  const t = await getTranslations({ locale, namespace: 'neediuPro' })
  const steps = t.raw('steps') as { t: string; d: string }[]
  const trust = t.raw('trust') as string[]

  return (
    <main>
      <section className="relative overflow-hidden bg-ag-navy px-6 pb-20 pt-36 md:px-12">
        <div className="relative mx-auto flex max-w-7xl items-center">
          <div className="min-w-0 md:w-fit md:max-w-[44rem] md:shrink-0">
          <p className="mb-6 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.28em] text-ag-apex">
            <span className="inline-block h-px w-6 bg-ag-apex/50" />{t('eyebrow')}
          </p>
          <h1 className="mb-6 text-balance md:w-0 md:min-w-full font-sans font-bold leading-[1.05] tracking-[-0.03em] text-white" style={{ fontSize: 'clamp(36px,5vw,72px)' }}>
            {t('title')}
          </h1>
          <p className="whitespace-pre-line font-sans text-[16px] leading-relaxed text-white/80">{t('intro')}</p>
          <span className="mt-8 inline-block rounded-full bg-ag-apex px-4 py-1.5 font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-ag-navy">{t('soon')}</span>
          </div>
          <div className="flex flex-1 items-center justify-center">
            <Image src="/images/neediu/neediu-app-icon.png" alt="neediu" width={512} height={512} priority className="h-20 w-20 shrink-0 rounded-[22%] shadow-2xl ring-1 ring-white/10 sm:h-28 sm:w-28 md:h-44 md:w-44" />
          </div>
        </div>
      </section>

      <section className="bg-white px-6 py-16 md:px-12 md:py-20">
        <div className="mx-auto max-w-7xl">
          {confirmed && (
            <p role="status" className={`mb-10 rounded-xl px-5 py-4 font-sans text-[15px] font-semibold ${confirmed === '1' ? 'bg-ag-apex/15 text-ag-navy' : 'bg-ag-off-white text-ag-gray'}`}>
              {confirmed === '1' ? t('form.confirmed') : t('form.notConfirmed')}
            </p>
          )}
          <div className="grid gap-12 lg:grid-cols-5 lg:gap-16">
            <div className="flex flex-col lg:col-span-2">
              <p className="mb-6 font-sans text-[10px] font-semibold uppercase tracking-[0.22em] text-ag-gray-light">{t('stepsLabel')}</p>
              <ol className="space-y-6">
                {steps.map((s, i) => (
                  <li key={s.t} className="flex items-start gap-4">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-ag-navy font-mono text-[12px] font-bold text-white">{i + 1}</span>
                    <span>
                      <span className="block font-sans text-[16px] font-semibold text-ag-black">{s.t}</span>
                      <span className="block font-sans text-[14px] text-ag-gray">{s.d}</span>
                    </span>
                  </li>
                ))}
              </ol>
              <ul className="mt-10 space-y-3 border-t border-ag-border pt-8">
                {trust.map(line => (
                  <li key={line} className="flex items-start gap-3 font-sans text-[15px] text-ag-dark">
                    <Check size={16} className="mt-1 shrink-0 text-ag-apex-ink" aria-hidden="true" />{line}
                  </li>
                ))}
              </ul>
              <div className="mt-10 flex flex-wrap items-center gap-x-5 gap-y-3 lg:mb-44 lg:mt-auto">
                <span className="font-sans text-[14px] text-ag-gray">{t('stores.label')}</span>
                <Image src={`/images/neediu/badges/app-store-${locale}.svg`} alt="App Store" width={127} height={40} className="h-10 w-auto" unoptimized />
                <Image src={`/images/neediu/badges/google-play-${locale}.png`} alt="Google Play" width={646} height={250} className={`w-auto ${locale === 'en' ? 'h-[60px]' : 'h-[52px]'}`} unoptimized />
              </div>
            </div>

            <div className="lg:col-span-3">
              <div className="rounded-2xl border border-ag-border p-6 md:p-10">
                <ProWaitlistForm />
              </div>
              <p className="mt-6 font-sans text-[13px] leading-relaxed text-ag-gray">{t('reassurance')}</p>
            </div>
          </div>

          <div className="mt-14 border-t border-ag-border pt-8">
            <Link href={assetPath('neediu') as never} className="font-sans text-[11px] font-semibold uppercase tracking-[0.16em] text-ag-navy underline underline-offset-4 hover:text-ag-apex-ink">
              {t('back')}
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
