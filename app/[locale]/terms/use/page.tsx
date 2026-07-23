import { getTranslations }    from 'next-intl/server'
import type { Metadata }        from 'next'
import Link                     from 'next/link'
import { ArrowUpRight }         from 'lucide-react'
import { generateAegrynMetadata } from '@/lib/seo'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'termsUse.meta' })
  return generateAegrynMetadata({ title: t('title'), description: t('desc'), path: '/terms/use', locale })
}

const SECTIONS = [
  's1','s2','s3','s4','s5','s6','s7','s8',
] as const

export default async function TermsUsePage({ params }: Props) {
  const { locale } = await params
  const t  = await getTranslations({ locale, namespace: 'termsUse' })
  const tN = await getTranslations({ locale, namespace: 'legalNav' })

  return (
    <main id="main" className="bg-ag-white min-h-screen">
      {/* Hero */}
      <section className="bg-ag-navy pt-24 pb-14 px-6">
        <div className="max-w-4xl mx-auto">
          <p className="font-mono text-[10px] tracking-[0.28em] uppercase text-ag-apex mb-5">
            AEGRYN — Legal
          </p>
          <h1
            className="font-sans font-bold text-white leading-[1.05] tracking-[-0.03em] mb-4"
            style={{ fontSize: 'clamp(28px,3.5vw,52px)' }}
          >
            {t('label')}
          </h1>
          <p className="font-sans text-[13px] text-white/40">{t('version')}</p>
        </div>
      </section>

      {/* Legal nav strip */}
      <div className="border-b border-ag-border bg-ag-off-white sticky top-16 z-20">
        <div className="max-w-4xl mx-auto px-6 py-3 flex flex-wrap gap-x-6 gap-y-1">
          {(['termsUse','termsCgv','privacy','security','faq'] as const).map((k, i) => (
            <Link
              key={k}
              href={['/terms/use','/terms/cgv','/privacy','/security','/help/faq'][i]}
              className={`font-mono text-[10px] tracking-[0.18em] uppercase transition-colors ${
                k === 'termsUse'
                  ? 'text-ag-black'
                  : 'text-ag-gray-light hover:text-ag-black'
              }`}
            >
              {tN(k)}
            </Link>
          ))}
        </div>
      </div>

      {/* Content */}
      <article className="max-w-4xl mx-auto px-6 py-16">
        <p className="font-sans text-[15px] text-ag-gray leading-relaxed mb-12 max-w-2xl">
          {t('intro')}
        </p>

        <div className="space-y-10">
          {SECTIONS.map((s, i) => (
            <section key={s} className="border-t border-ag-border pt-8">
              <h2 className="font-sans font-semibold text-[13px] uppercase tracking-[0.18em] text-ag-black mb-4">
                Article {i + 1} — {t(`${s}Title`)}
              </h2>
              <div className="font-sans text-[15px] text-ag-gray leading-relaxed whitespace-pre-line">
                {t(s)}
              </div>
            </section>
          ))}
        </div>

        {/* CTAs */}
        <div className="mt-16 pt-10 border-t border-ag-border flex flex-wrap gap-4">
          <Link
            href="/terms/cgv"
            className="inline-flex items-center gap-2 font-sans font-semibold text-[11px] uppercase tracking-[0.16em] text-ag-navy border border-ag-navy px-5 py-3 hover:bg-ag-navy hover:text-white transition-colors"
          >
            {t('ctaCgv')} <ArrowUpRight size={12} />
          </Link>
          <Link
            href="/privacy"
            className="inline-flex items-center gap-2 font-sans font-semibold text-[11px] uppercase tracking-[0.16em] text-ag-gray-light border border-ag-border px-5 py-3 hover:border-ag-black hover:text-ag-black transition-colors"
          >
            {t('ctaPrivacy')} <ArrowUpRight size={12} />
          </Link>
        </div>
      </article>
    </main>
  )
}
