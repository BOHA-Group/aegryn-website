import { getTranslations } from 'next-intl/server'
import type { Metadata } from 'next'
import { Suspense } from 'react'
import { generateAegrynMetadata } from '@/lib/seo'
import MandateForm from './MandateForm'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'transact.mandate.meta' })
  return generateAegrynMetadata({
    title: t('title'),
    description: t('desc'),
    path: '/transact/mandate',
    locale,
  })
}

export default async function MandatePage({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'transact.mandate' })

  return (
    <main className="bg-ag-white">

      {/* ── Hero ── */}
      <section className="bg-ag-navy pt-28 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <p className="font-mono text-[10px] tracking-[0.28em] uppercase text-ag-apex mb-5 flex items-center gap-3">
            <span className="w-6 h-px bg-ag-apex/50 inline-block" />
            {t('eyebrow')}
          </p>
          <h1
            className="font-sans font-bold text-white leading-[1.05] tracking-[-0.03em] max-w-3xl mb-6 whitespace-pre-line"
            style={{ fontSize: 'clamp(32px,4.5vw,64px)' }}
          >
            {t('heroTitle')}
          </h1>
          <p className="font-sans text-[16px] text-white/55 max-w-xl leading-relaxed">
            {t('heroDesc')}
          </p>
        </div>
      </section>

      {/* ── Formulaire ── */}
      <section className="py-20 px-6 border-t border-ag-border">
        <div className="max-w-4xl mx-auto">
          <Suspense>
            <MandateForm />
          </Suspense>
        </div>
      </section>

      {/* ── NDA ── */}
      <section className="py-16 px-6 bg-ag-off-white border-t border-ag-border">
        <div className="max-w-7xl mx-auto">
          <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-ag-gray-light mb-3">
            {t('ndaLabel')}
          </p>
          <p className="font-sans font-bold text-ag-black text-[18px] max-w-lg leading-snug mb-2">
            {t('ndaTitle')}
          </p>
          <p className="font-sans text-[14px] text-ag-gray max-w-md leading-relaxed">
            {t('ndaDesc')}
          </p>
        </div>
      </section>

    </main>
  )
}
