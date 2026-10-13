import { getTranslations }        from 'next-intl/server'
import { Link }                    from '@/i18n/navigation'
import type { Metadata }           from 'next'
import { Info }                    from 'lucide-react'
import { AssetsGrid }              from '@/components/sections/assets/AssetsGrid'
import { generateAegrynMetadata }  from '@/lib/seo'
import { ScrollReveal } from '@/components/animations/ScrollReveal'
import { WaveReveal }   from '@/components/animations/WaveReveal'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'assets.portfolio.meta' })
  return generateAegrynMetadata({ title: t('title'), description: t('desc'), path: '/portfolio', locale })
}

export default async function PortfolioPage({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'assets.portfolio' })

  return (
    <main>
      {/* Hero statique — pas d'animation, pas de vidéo */}
      <section className="border-b border-ag-border">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-28 md:py-36">
          <p className="font-sans font-semibold text-[11px] uppercase tracking-[0.28em] text-ag-gray-light mb-8">
            {t('label')}
          </p>
          <WaveReveal delay={0.1}><h1
            className="font-sans font-bold text-ag-black tracking-[-0.03em] leading-[1.05] max-w-3xl mb-6 whitespace-pre-line"
            style={{ fontSize: 'clamp(36px,5vw,72px)' }}
          >
            {t('title')}
          </h1></WaveReveal>
<ScrollReveal delay={0.25}>          <div className="font-sans text-[16px] text-ag-gray leading-relaxed max-w-xl space-y-4">
            <p>{t('sub')}</p>
            <p>{t('sub2')}</p>
          </div></ScrollReveal>
        </div>
      </section>

      {/* Note éditoriale — lien discret vers les actifs */}
      <div className="border-b border-ag-border bg-ag-off-white">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-5">
          <div className="flex items-start gap-3">
            <Info size={14} className="text-ag-gray-light mt-0.5 shrink-0" />
            <p className="font-sans text-[15px] text-ag-gray leading-relaxed max-w-2xl">
              {t('note')}{' '}
              <Link href={"/assets" as never} className="text-ag-black underline underline-offset-4 decoration-ag-border hover:decoration-ag-black transition-colors">
                {t('noteLink')}
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Grille complète des actifs du groupe — subblink exclu (assets only) */}
      <AssetsGrid excludeIds={['subblink']} />
    </main>
  )
}
