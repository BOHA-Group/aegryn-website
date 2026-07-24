import { getTranslations } from 'next-intl/server'
import { generateAegrynMetadata } from '@/lib/seo'
import type { Metadata } from 'next'
import ContactForm from '@/components/contact/ContactForm'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  return generateAegrynMetadata({
    title: 'Contact Aegryn | General, Partnership, Investor & Media',
    description: "Reach out for general inquiries, media, partnerships, investments, or career opportunities. Let's build enduring digital ecosystems together.",
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
          <p className="font-sans font-semibold text-xs uppercase tracking-[0.3em] text-ag-apex mb-6">
            Contact
          </p>
          <h1 className="font-sans text-6xl font-bold tracking-tighter text-ag-black sm:text-7xl max-w-xl">
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
              <p className="font-sans font-semibold text-[10px] uppercase tracking-[0.25em] text-ag-gray-light mb-3">
                {t('info.baseLabel')}
              </p>
              <p className="text-sm text-ag-gray">{t('info.baseValue')}</p>
            </div>
            <div>
              <p className="font-sans font-semibold text-[10px] uppercase tracking-[0.25em] text-ag-gray-light mb-3">
                Email
              </p>
              <a
                href="mailto:contact@boha-group.com"
                className="text-sm text-ag-gray hover:text-ag-black transition-colors"
              >
                contact@boha-group.com
              </a>
            </div>
            <div>
              <p className="font-sans font-semibold text-[10px] uppercase tracking-[0.25em] text-ag-gray-light mb-3">
                LinkedIn
              </p>
              <a
                href="https://www.linkedin.com/company/106273747/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-ag-gray hover:text-ag-black transition-colors"
              >
                AEGRYN — LinkedIn ↗
              </a>
            </div>
            <div>
              <p className="font-sans font-semibold text-[10px] uppercase tracking-[0.25em] text-ag-gray-light mb-3">
                {t('responseTime.label')}
              </p>
              <p className="text-sm text-ag-gray">{t('responseTime.value')}</p>
            </div>
          </div>

          {/* Form */}
          <ContactForm locale={locale} />
        </div>
      </section>

      {/* FAQ */}
      <section className="border-t border-ag-border">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <p className="font-sans font-semibold text-[10px] uppercase tracking-[0.28em] text-ag-gray-light mb-12">
            {t('faq.label')}
          </p>
          <div className="grid gap-0 divide-y divide-ag-border">
            {(t.raw('faq.items') as { q: string; a: string }[]).map((item, i) => (
              <div key={i} className="py-8 grid md:grid-cols-[320px_1fr] gap-6">
                <h3 className="font-sans font-bold text-ag-black" style={{ fontSize: 'clamp(15px,1.4vw,18px)' }}>
                  {item.q}
                </h3>
                <p className="font-sans font-normal text-[15px] text-ag-gray leading-relaxed">
                  {item.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
