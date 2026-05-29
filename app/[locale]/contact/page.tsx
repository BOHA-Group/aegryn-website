import { getTranslations } from 'next-intl/server'
import { generateAegrynMetadata } from '@/lib/seo'
import type { Metadata } from 'next'
import ContactForm from '@/components/contact/ContactForm'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  return generateAegrynMetadata({
    title: 'Contact',
    description: 'Prenez contact avec Aegryn — advisory, partenariat ou questions générales.',
    path: '/contact',
    locale,
  })
}

export default async function ContactPage({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'contact' })

  return (
    <>
      {/* Hero */}
      <section className="border-b border-ag-border">
        <div className="mx-auto max-w-7xl px-6 py-24 lg:py-32">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-ag-apex mb-6">
            Contact
          </p>
          <h1 className="font-display text-6xl font-black tracking-tighter text-ag-black sm:text-7xl max-w-xl">
            {t('hero.title')}
          </h1>
          <p className="mt-4 text-sm text-ag-gray max-w-md leading-relaxed">
            {t('hero.desc')}
          </p>
        </div>
      </section>

      {/* Form + Info */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="grid gap-16 lg:grid-cols-[1fr_2fr]">
          {/* Info column */}
          <div className="space-y-10">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-ag-gray-light mb-3">
                Base
              </p>
              <p className="text-sm text-ag-gray">Suisse</p>
            </div>
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-ag-gray-light mb-3">
                Email
              </p>
              <a
                href="mailto:contact@aegryn.com"
                className="text-sm text-ag-gray hover:text-ag-black transition-colors"
              >
                contact@aegryn.com
              </a>
            </div>
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-ag-gray-light mb-3">
                LinkedIn
              </p>
              <a
                href="https://www.linkedin.com/company/aegryn"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-ag-gray hover:text-ag-black transition-colors"
              >
                /company/aegryn ↗
              </a>
            </div>
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-ag-gray-light mb-3">
                {t('responseTime.label')}
              </p>
              <p className="text-sm text-ag-gray">{t('responseTime.value')}</p>
            </div>
          </div>

          {/* Form */}
          <ContactForm locale={locale} />
        </div>
      </section>
    </>
  )
}
