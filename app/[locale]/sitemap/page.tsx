import { useTranslations } from 'next-intl'
import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import type { Metadata } from 'next'
import { ChevronRight } from 'lucide-react'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'sitemap' })
  return { title: t('metaTitle'), description: t('metaDesc') }
}

type SitemapGroup = {
  labelKey: string
  links: { labelKey: string; href: string }[]
}

const GROUPS: SitemapGroup[] = [
  {
    labelKey: 'groupAuction',
    links: [
      { labelKey: 'auction',        href: '/auction/catalog' },
      { labelKey: 'auctionSell',    href: '/auction/how-to-sell' },
      { labelKey: 'auctionBuy',     href: '/auction/how-to-buy' },
      { labelKey: 'auctionBid',     href: '/auction/bid-models' },
      { labelKey: 'auctionSession', href: '/auction/sessions' },
      { labelKey: 'auctionResults', href: '/auction/results' },
    ],
  },
  {
    labelKey: 'groupGrade',
    links: [
      { labelKey: 'grade',         href: '/grade' },
      { labelKey: 'gradeMethod',   href: '/grade/methodology' },
      { labelKey: 'gradePartners', href: '/grade/partners' },
      { labelKey: 'gradeSubmit',   href: '/grade/submit' },
    ],
  },
  {
    labelKey: 'groupAssets',
    links: [
      { labelKey: 'assets', href: '/assets' },
    ],
  },
  {
    labelKey: 'groupServices',
    links: [
      { labelKey: 'advisory',     href: '/advisory' },
      { labelKey: 'alliances',    href: '/alliances' },
      { labelKey: 'acquisition',  href: '/services/acquisition-support' },
      { labelKey: 'valuation',    href: '/valuation' },
    ],
  },
  {
    labelKey: 'groupDiscover',
    links: [
      { labelKey: 'blog',      href: '/blog' },
      { labelKey: 'roadmap',   href: '/roadmap' },
    ],
  },
  {
    labelKey: 'groupCompany',
    links: [
      { labelKey: 'about',   href: '/about' },
      { labelKey: 'career',  href: '/career' },
      { labelKey: 'contact', href: '/contact' },
    ],
  },
  {
    labelKey: 'groupLegal',
    links: [
      { labelKey: 'termsUse',  href: '/terms/use' },
      { labelKey: 'termsCgv',  href: '/terms/cgv' },
      { labelKey: 'privacy',   href: '/privacy' },
      { labelKey: 'security',  href: '/security' },
      { labelKey: 'faq',       href: '/help/faq' },
    ],
  },
]

function SitemapSection({ group }: { group: SitemapGroup }) {
  const t = useTranslations('sitemap')
  return (
    <div>
      <h2 className="font-mono text-[9px] uppercase tracking-[0.22em] text-ag-apex mb-3">
        {t(group.labelKey)}
      </h2>
      <ul className="flex flex-col gap-1">
        {group.links.map(({ labelKey, href }) => (
          <li key={href} className="flex items-center gap-1.5">
            <ChevronRight size={10} className="text-ag-gray-light shrink-0" />
            <Link
              href={href as Parameters<typeof Link>[0]['href']}
              className="font-sans text-[13px] text-ag-gray hover:text-ag-black transition-colors"
            >
              {t(labelKey)}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default function SitemapPage() {
  const t = useTranslations('sitemap')
  return (
    <main id="main" className="bg-ag-off-white min-h-screen pt-32 pb-24 px-6">
      <div className="max-w-5xl mx-auto">

        <div className="mb-12">
          <p className="font-mono text-[9px] tracking-[0.28em] uppercase text-ag-apex mb-4 flex items-center gap-2">
            <span className="w-5 h-px bg-ag-apex/50 inline-block" />
            AEGRYN
          </p>
          <h1 className="font-sans font-bold text-ag-black text-[32px] tracking-tight">
            {t('title')}
          </h1>
          <p className="mt-2 font-sans text-[14px] text-ag-gray-light max-w-xl">
            {t('subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10">
          {GROUPS.map((group) => (
            <SitemapSection key={group.labelKey} group={group} />
          ))}
        </div>

        <div className="mt-16 pt-8 border-t border-ag-border" />
      </div>
    </main>
  )
}
