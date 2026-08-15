import { getTranslations }   from 'next-intl/server'
import type { Metadata }      from 'next'
import { PdfViewer }          from '@/components/magazine/PdfViewer'
import Link                   from 'next/link'
import { ArrowLeft }          from 'lucide-react'

const PDF_PATH = '/reports/the-aegryn-2026.pdf'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'intelligence.report.meta' })
  return {
    title:   `PDF — ${t('title')}`,
    description: t('description'),
    robots:  { index: false, follow: false },
    alternates: { canonical: `/${locale}/intelligence/report/2026/pdf` },
  }
}

export default async function Report2026PdfPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'intelligence.report' })

  return (
    <div className="min-h-screen bg-magazine-ivory">
      {/* Back bar */}
      <div className="bg-magazine-white border-b border-magazine-black/10 px-6 md:px-[120px] py-4">
        <Link
          href={`/${locale}/intelligence/report/2026`}
          className="inline-flex items-center gap-2 text-label-mag uppercase tracking-[0.12em]
                     text-magazine-black/50 hover:text-magazine-black transition-colors"
        >
          <ArrowLeft size={13} /> {t('readOnline')}
        </Link>
      </div>

      <PdfViewer src={PDF_PATH} fileName="the-aegryn-2026.pdf" />
    </div>
  )
}
