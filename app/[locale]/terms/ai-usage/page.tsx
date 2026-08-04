import { getTranslations } from 'next-intl/server'
import type { Metadata } from 'next'
import Link from 'next/link'
import { generateAegrynMetadata } from '@/lib/seo'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'aiUsage.meta' })
  return generateAegrynMetadata({ title: t('title'), description: t('desc'), path: '/terms/ai-usage', locale })
}

export default async function AiUsagePage({ params }: Props) {
  const { locale } = await params
  const t  = await getTranslations({ locale, namespace: 'aiUsage' })
  const tL = await getTranslations({ locale, namespace: 'legalNav' })

  return (
    <main className="bg-white min-h-screen">

      {/* Hero */}
      <section className="bg-ag-navy pt-24 pb-14 px-6">
        <div className="max-w-4xl mx-auto">
          <p className="font-mono text-[10px] tracking-[0.28em] uppercase text-ag-apex mb-5">AEGRYN — Legal</p>
          <h1
            className="font-sans font-bold text-white leading-[1.05] tracking-[-0.03em] mb-4"
            style={{ fontSize: 'clamp(28px,3.5vw,52px)' }}
          >
            {t('label')}
          </h1>
          <p className="font-sans text-[13px] text-white/40">{t('version')}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            {(['fr','en','de','es','it','nl'] as const).map(lang => (
              <Link
                key={lang}
                href={`/${lang}/terms/ai-usage`}
                className={`font-mono text-[10px] tracking-[0.14em] uppercase px-3 py-1 border transition-colors ${
                  lang === locale
                    ? 'border-ag-apex text-ag-apex'
                    : 'border-white/20 text-white/40 hover:border-white/50 hover:text-white/70'
                }`}
              >
                {lang.toUpperCase()}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto space-y-12">

          <div className="border border-ag-apex/20 bg-ag-apex/5 px-6 py-4">
            <p className="font-mono text-[10px] tracking-[0.18em] uppercase text-ag-apex mb-1">EU AI Act — Article 50</p>
            <p className="font-sans text-[13px] text-ag-gray leading-relaxed">{t('version')}</p>
          </div>

          {([
            { title: t('s1Title'), body: t('s1Body') },
            { title: t('s2Title'), body: t('s2Body') },
            { title: t('s3Title'), body: t('s3Body') },
          ] as const).map(({ title, body }) => (
            <div key={title} className="border-t border-ag-border pt-8">
              <h2 className="font-sans font-bold text-ag-black text-[18px] tracking-[-0.02em] mb-4">{title}</h2>
              <p className="font-sans text-[15px] text-ag-gray leading-[1.85]">{body}</p>
            </div>
          ))}

          {/* Section 4 — Do / Don't */}
          <div className="border-t border-ag-border pt-8">
            <h2 className="font-sans font-bold text-ag-black text-[18px] tracking-[-0.02em] mb-6">{t('s4Title')}</h2>
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="border border-ag-apex/30 bg-ag-apex/5 p-5">
                <p className="font-mono text-[10px] tracking-[0.18em] uppercase text-ag-apex mb-3">Ce que nous faisons</p>
                <ul className="space-y-2">
                  {t('s4Do').split('. ').filter(Boolean).map((item, i) => (
                    <li key={i} className="flex items-start gap-2 font-sans text-[13px] text-ag-gray leading-snug">
                      <span className="shrink-0 mt-1.5 w-1.5 h-1.5 rounded-full bg-ag-apex" />
                      {item.replace(/\.$/, '')}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="border border-red-200 bg-red-50 p-5">
                <p className="font-mono text-[10px] tracking-[0.18em] uppercase text-red-500 mb-3">Ce que nous ne faisons pas</p>
                <ul className="space-y-2">
                  {t('s4Dont').split('. ').filter(Boolean).map((item, i) => (
                    <li key={i} className="flex items-start gap-2 font-sans text-[13px] text-ag-gray leading-snug">
                      <span className="shrink-0 mt-1.5 w-1.5 h-1.5 rounded-full bg-red-400" />
                      {item.replace(/\.$/, '')}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Section 5 — Contact */}
          <div className="border-t border-ag-border pt-8">
            <h2 className="font-sans font-bold text-ag-black text-[18px] tracking-[-0.02em] mb-4">{t('s5Title')}</h2>
            <p className="font-sans text-[15px] text-ag-gray leading-[1.85]">{t('s5Body')}</p>
          </div>

          {/* Nav légale */}
          <div className="border-t border-ag-border pt-8 flex flex-wrap gap-4">
            {([
              { key: 'termsUse',  href: '/terms/use' },
              { key: 'termsCgv',  href: '/terms/cgv' },
              { key: 'privacy',   href: '/privacy' },
            ] as const).map(({ key, href }) => (
              <Link key={key} href={href}
                className="font-mono text-[10px] tracking-[0.14em] uppercase text-ag-gray-light hover:text-ag-black transition-colors">
                {tL(key)}
              </Link>
            ))}
          </div>

        </div>
      </section>
    </main>
  )
}
