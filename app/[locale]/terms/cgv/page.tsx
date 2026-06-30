import { getTranslations }    from 'next-intl/server'
import type { Metadata }        from 'next'
import Link                     from 'next/link'
import { ArrowUpRight }         from 'lucide-react'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'termsCgv.meta' })
  return { title: t('title'), description: t('desc') }
}

export default async function TermsCgvPage({ params }: Props) {
  const { locale } = await params
  const t  = await getTranslations({ locale, namespace: 'termsCgv' })
  const tN = await getTranslations({ locale, namespace: 'legalNav' })

  const DEFS = [
    ['AEGRYN', 'defAegryn'],
    ['Actif tech', 'defAsset'],
    ['Grade AEGRYN', 'defGrade'],
    ['Grade estimé', 'defGradeEst'],
    ['PTT', 'defPtt'],
    ['Séquestre', 'defEscrow'],
    ['Vendeur', 'defSeller'],
    ['Acquéreur', 'defBuyer'],
  ] as const

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
          <p className="font-sans text-[13px] text-white/40 mb-3">{t('version')}</p>
          <p className="font-sans text-[13px] text-ag-apex/70 max-w-2xl italic">{t('note')}</p>
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
                k === 'termsCgv'
                  ? 'text-ag-black'
                  : 'text-ag-gray-light hover:text-ag-black'
              }`}
            >
              {tN(k)}
            </Link>
          ))}
        </div>
      </div>

      <article className="max-w-4xl mx-auto px-6 py-16 space-y-14">

        {/* Section I — Définitions */}
        <section className="border-t border-ag-border pt-8">
          <h2 className="font-sans font-semibold text-[13px] uppercase tracking-[0.18em] text-ag-black mb-6">
            Section I — {t('s1Title')}
          </h2>
          <dl className="space-y-4">
            {DEFS.map(([term, key]) => (
              <div key={key} className="grid grid-cols-[160px_1fr] gap-6">
                <dt className="font-sans font-semibold text-[13px] text-ag-black pt-0.5">{term}</dt>
                <dd className="font-sans text-[14px] text-ag-gray leading-relaxed">{t(key)}</dd>
              </div>
            ))}
          </dl>
        </section>

        {/* Section II — Services */}
        <section className="border-t border-ag-border pt-8">
          <h2 className="font-sans font-semibold text-[13px] uppercase tracking-[0.18em] text-ag-black mb-6">
            Section II — {t('s2Title')}
          </h2>
          {([
            ['s2ReviewTitle','s2Review'],
            ['s2ReviewPlusTitle','s2ReviewPlus'],
            ['s2CertTitle','s2Cert'],
            ['s2AdvisoryTitle','s2Advisory'],
          ] as const).map(([titleKey, bodyKey]) => (
            <div key={titleKey} className="mb-6 pl-4 border-l-2 border-ag-border">
              <h3 className="font-sans font-semibold text-[13px] text-ag-black mb-2">{t(titleKey)}</h3>
              <p className="font-sans text-[14px] text-ag-gray leading-relaxed">{t(bodyKey)}</p>
            </div>
          ))}
        </section>

        {/* Section III — Soumission */}
        <section className="border-t border-ag-border pt-8">
          <h2 className="font-sans font-semibold text-[13px] uppercase tracking-[0.18em] text-ag-black mb-4">
            Section III — {t('s3Title')}
          </h2>
          <p className="font-sans text-[14px] text-ag-gray leading-relaxed mb-4">{t('s3')}</p>
          <div className="pl-4 border-l-2 border-ag-border">
            <h3 className="font-sans font-semibold text-[13px] text-ag-black mb-2">{t('s3ObligTitle')}</h3>
            <p className="font-sans text-[14px] text-ag-gray leading-relaxed">{t('s3Oblig')}</p>
          </div>
        </section>

        {/* Section IV — PTT */}
        <section className="border-t border-ag-border pt-8">
          <h2 className="font-sans font-semibold text-[13px] uppercase tracking-[0.18em] text-ag-black mb-6">
            Section IV — {t('s4Title')}
          </h2>
          {([
            ['s4EiTitle','s4Ei'],
            ['s4ApTitle','s4Ap'],
            ['s4EscrowTitle','s4Escrow'],
            ['s4DdTitle','s4Dd'],
            ['s4SigningTitle','s4Signing'],
          ] as const).map(([titleKey, bodyKey], i) => (
            <div key={titleKey} className="mb-6 flex gap-5">
              <div className="w-7 h-7 shrink-0 border border-ag-border flex items-center justify-center font-mono text-[10px] text-ag-gray-light">
                {String(i+1).padStart(2,'0')}
              </div>
              <div>
                <h3 className="font-sans font-semibold text-[13px] text-ag-black mb-2">{t(titleKey)}</h3>
                <p className="font-sans text-[14px] text-ag-gray leading-relaxed">{t(bodyKey)}</p>
              </div>
            </div>
          ))}
          {/* Règles rétractation */}
          <div className="mt-6 pl-4 border-l-2 border-ag-border space-y-4">
            <h3 className="font-sans font-semibold text-[13px] text-ag-black">{t('s4RetractTitle')}</h3>
            {(['s4RetractBuyer','s4RetractSeller','s4RetractSusp'] as const).map(k => (
              <p key={k} className="font-sans text-[14px] text-ag-gray leading-relaxed">{t(k)}</p>
            ))}
          </div>
        </section>

        {/* Sections V–IX */}
        {([
          ['V', 's5Title', 's5'],
          ['VI', 's6Title', 's6'],
          ['VII', 's7Title', 's7'],
          ['VIII', 's8Title', 's8'],
          ['IX', 's9Title', 's9'],
        ] as const).map(([num, titleKey, bodyKey]) => (
          <section key={num} className="border-t border-ag-border pt-8">
            <h2 className="font-sans font-semibold text-[13px] uppercase tracking-[0.18em] text-ag-black mb-4">
              Section {num} — {t(titleKey)}
            </h2>
            <p className="font-sans text-[14px] text-ag-gray leading-relaxed">{t(bodyKey)}</p>
          </section>
        ))}

        {/* CTAs */}
        <div className="pt-6 border-t border-ag-border flex flex-wrap gap-4">
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 font-sans font-semibold text-[11px] uppercase tracking-[0.16em] text-ag-navy border border-ag-navy px-5 py-3 hover:bg-ag-navy hover:text-white transition-colors"
          >
            {t('ctaContact')} <ArrowUpRight size={12} />
          </Link>
          <Link
            href="/terms/use"
            className="inline-flex items-center gap-2 font-sans font-semibold text-[11px] uppercase tracking-[0.16em] text-ag-gray-light border border-ag-border px-5 py-3 hover:border-ag-black hover:text-ag-black transition-colors"
          >
            {t('ctaTermsUse')} <ArrowUpRight size={12} />
          </Link>
        </div>
      </article>
    </main>
  )
}
