import { getTranslations }     from 'next-intl/server'
import type { Metadata }        from 'next'
import Link                     from 'next/link'
import { ArrowLeft }            from 'lucide-react'
import { existsSync }           from 'fs'
import path                     from 'path'
import { MagazineViewer }       from '@/components/magazine/MagazineViewer'
import { MagazineFallback }     from '@/components/magazine/MagazineFallback'

const PDF_API_URL   = '/api/magazine/report/2026/pdf'
const TOTAL_PAGES   = 18  // À mettre à jour après export Canva
const FIRST_PAGE_CHECK = path.resolve('public/reports/2026/pages/page.0001.jpg')

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'magazine.report.meta' })
  return {
    title:       `Flipbook — ${t('title')}`,
    description: t('description'),
    robots:      { index: false, follow: false },
    alternates:  { canonical: `/${locale}/magazine/report/2026/pdf` },
  }
}

export default async function Report2026PdfPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'magazine.report' })

  // SSR check — flipbook only if images have been generated
  const pagesReady = existsSync(FIRST_PAGE_CHECK)

  return (
    <div className="min-h-screen bg-magazine-black">

      {/* Back bar */}
      <div className="bg-magazine-black border-b border-magazine-white/8 px-6 md:px-[120px] py-4">
        <Link
          href={`/${locale}/magazine/report/2026`}
          className="inline-flex items-center gap-2 text-label-mag uppercase tracking-[0.12em]
                     text-magazine-white/40 hover:text-magazine-white transition-colors"
        >
          <ArrowLeft size={13} /> {t('readOnline')}
        </Link>
      </div>

      {pagesReady ? (
        <MagazineViewer totalPages={TOTAL_PAGES} pdfUrl={PDF_API_URL} />
      ) : (
        <MagazineFallback pdfUrl={PDF_API_URL} />
      )}
    </div>
  )
}
