import { getTranslations } from 'next-intl/server'
import { useTranslations } from 'next-intl'
import { generateAegrynMetadata } from '@/lib/seo'
import type { Metadata } from 'next'
import { Link } from '@/i18n/navigation'
import { Check, ArrowUpRight } from 'lucide-react'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'auction.buy' })
  return generateAegrynMetadata({
    title: t('title'),
    description: t('desc'),
    path: '/auction/how-to-buy',
    locale,
    keywords: [
      'buy tech company', 'acheter entreprise tech', 'acquire SaaS', 'acquisition numérique',
      'buy digital asset', 'comment acheter startup', 'M&A buyer', 'KYC investor',
      'NDA dossier confidentiel', 'offre ferme', 'club deal buyer', 'how to buy SaaS company',
    ],
  })
}

export default function HowToBuyPage() {
  const t = useTranslations('auction.buy')
  const qualifItems  = t.raw('qualifItems')  as string[]
  const processSteps = t.raw('processSteps') as { num: string; title: string; desc: string }[]

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
            className="font-sans font-bold text-white leading-[1.05] tracking-[-0.03em] max-w-2xl mb-5 whitespace-pre-line"
            style={{ fontSize: 'clamp(32px,4.5vw,64px)' }}
          >
            {t('title')}
          </h1>
          <p className="font-sans text-[16px] text-white/55 max-w-xl mb-10">
            {t('desc')}
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 bg-ag-apex text-ag-navy font-mono text-[11px] tracking-[0.14em] uppercase px-7 py-3.5 font-semibold hover:bg-ag-apex/90 transition-colors"
          >
            {t('cta')} <ArrowUpRight size={13} />
          </Link>
        </div>
      </section>

      {/* Qualification profile */}
      <section className="py-24 px-6 border-t border-ag-border">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          <div>
            <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-ag-gray-light mb-4">
              {t('qualifTitle')}
            </p>
            <p className="font-sans text-[15px] text-ag-gray leading-relaxed mb-8">
              {t('qualifDesc')}
            </p>
            <ul className="flex flex-col gap-3">
              {qualifItems.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <Check size={14} className="text-ag-apex mt-0.5 shrink-0" />
                  <span className="font-sans text-[14px] text-ag-dark">{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-ag-off-white border border-ag-border p-10">
            <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-ag-gray-light mb-6">
              {t('processTitle')}
            </p>
            <div className="flex flex-col gap-6">
              {processSteps.map(({ num, title, desc }) => (
                <div key={num} className="flex gap-5">
                  <span className="font-mono text-[11px] tracking-[0.14em] text-ag-apex shrink-0 pt-0.5">{num}</span>
                  <div>
                    <p className="font-sans font-semibold text-ag-black text-[15px] mb-1">{title}</p>
                    <p className="font-sans text-[13px] text-ag-gray leading-relaxed">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
