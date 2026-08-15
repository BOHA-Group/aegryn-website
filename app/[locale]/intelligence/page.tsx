import Link            from 'next/link'
import { useTranslations } from 'next-intl'
import { getTranslations } from 'next-intl/server'
import type { Metadata }   from 'next'
import { ArrowUpRight }    from 'lucide-react'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'intelligence.report.meta' })
  return {
    title:       t('title'),
    description: t('description'),
    alternates:  { canonical: `/${locale}/intelligence` },
    openGraph:   { title: t('title'), description: t('description'), type: 'website' },
  }
}

export default function IntelligencePage() {
  const t    = useTranslations('intelligence')
  const tHub = useTranslations('intelligence.hub')

  return (
    <main className="min-h-screen bg-magazine-ivory">
      <div className="max-w-magazine mx-auto px-6 md:px-[120px] py-32">

        <p className="text-label-mag text-magazine-black/40 uppercase tracking-[0.15em] mb-6">
          AEGRYN
        </p>
        <h1
          className="font-sans font-bold text-magazine-black mb-6"
          style={{ fontSize: 'clamp(40px,6vw,80px)', lineHeight: 1, letterSpacing: '-0.03em' }}
        >
          {tHub('title')}
        </h1>
        <p className="text-body-mag text-magazine-black/60 max-w-prose mb-16">
          {tHub('desc')}
        </p>

        <div className="border-t border-magazine-black/10 pt-12 grid grid-cols-1 md:grid-cols-2 gap-0 md:divide-x divide-magazine-black/10">

          {/* Report card */}
          <Link
            href="./intelligence/report/2026"
            className="group pr-0 md:pr-16 pb-12 md:pb-0 flex flex-col justify-between gap-8"
          >
            <div>
              <p className="text-label-mag text-magazine-accent uppercase tracking-[0.15em] mb-4">
                {tHub('reportLabel')}
              </p>
              <h2 className="text-h2-mag text-magazine-black mb-3 font-sans font-semibold">
                {tHub('reportDesc')}
              </h2>
              <p className="text-body-mag text-magazine-black/50">
                The AEGRYN · First Edition · Autumn 2026
              </p>
            </div>
            <span className="inline-flex items-center gap-2 text-label-mag uppercase tracking-[0.12em] text-magazine-black group-hover:text-magazine-accent transition-colors">
              {t('report.readOnline')} <ArrowUpRight size={14} />
            </span>
          </Link>

          {/* Subscribe card */}
          <Link
            href="./intelligence/subscribe"
            className="group pl-0 md:pl-16 pt-12 md:pt-0 flex flex-col justify-between gap-8"
          >
            <div>
              <p className="text-label-mag text-magazine-black/40 uppercase tracking-[0.15em] mb-4">
                {tHub('subscribeLabel')}
              </p>
              <h2 className="text-h2-mag text-magazine-black mb-3 font-sans font-semibold">
                {tHub('subscribeDesc')}
              </h2>
              <p className="text-body-mag text-magazine-black/50">
                Accès libre · Annuel · Multilingue
              </p>
            </div>
            <span className="inline-flex items-center gap-2 text-label-mag uppercase tracking-[0.12em] text-magazine-black group-hover:text-magazine-accent transition-colors">
              {t('subscribe.cta')} <ArrowUpRight size={14} />
            </span>
          </Link>

        </div>
      </div>
    </main>
  )
}
