import { getTranslations }    from 'next-intl/server'
import type { Metadata }        from 'next'
import Link                     from 'next/link'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'privacy.meta' })
  return { title: t('title'), description: t('desc') }
}

export default async function PrivacyPage({ params }: Props) {
  const { locale } = await params
  const tN = await getTranslations({ locale, namespace: 'legalNav' })
  const tP = await getTranslations({ locale, namespace: 'privacy' })

  return (
    <main id="main" className="bg-white min-h-screen">

      {/* Hero */}
      <section className="bg-ag-navy pt-24 pb-14 px-6">
        <div className="max-w-4xl mx-auto">
          <p className="font-mono text-[10px] tracking-[0.28em] uppercase text-ag-apex mb-5">AEGRYN — Legal</p>
          <h1
            className="font-sans font-bold text-white leading-[1.05] tracking-[-0.03em] mb-4"
            style={{ fontSize: 'clamp(28px,3.5vw,52px)' }}
          >
            {tP('label')}
          </h1>
          <p className="font-sans text-[13px] text-white/40">{tP('updated')}</p>
          {/* Sélecteur de langue */}
          <div className="mt-6 flex flex-wrap gap-3">
            {(['fr','en','de','es','it','nl'] as const).map(lang => (
              <Link
                key={lang}
                href={`/${lang}/privacy`}
                className={`font-mono text-[10px] tracking-[0.14em] uppercase px-3 py-1 border transition-colors ${
                  lang === locale
                    ? 'border-ag-apex text-ag-apex'
                    : 'border-white/20 text-white/40 hover:border-white/50 hover:text-white/70'
                }`}
              >
                {lang.toUpperCase()}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Legal nav */}
      <div className="border-b border-ag-border bg-ag-off-white sticky top-16 z-20">
        <div className="max-w-4xl mx-auto px-6 py-3 flex flex-wrap gap-x-6 gap-y-1">
          {(['termsUse','termsCgv','privacy','security','faq'] as const).map((k, i) => (
            <Link
              key={k}
              href={['/terms/use','/terms/cgv','/privacy','/security','/help/faq'][i]}
              className={`font-mono text-[10px] tracking-[0.18em] uppercase transition-colors ${
                k === 'privacy' ? 'text-ag-black' : 'text-ag-gray-light hover:text-ag-black'
              }`}
            >
              {tN(k)}
            </Link>
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-6 md:px-16 py-16">

        <div className="prose prose-slate max-w-none font-sans
          prose-headings:font-sans prose-headings:font-bold prose-headings:text-ag-black prose-headings:tracking-[-0.02em]
          prose-h2:text-[22px] prose-h2:mt-14 prose-h2:mb-5
          prose-h3:text-[16px] prose-h3:mt-8 prose-h3:mb-3
          prose-p:text-[15px] prose-p:text-ag-gray prose-p:leading-[1.75]
          prose-li:text-[15px] prose-li:text-ag-gray prose-li:leading-[1.75]
          prose-a:text-ag-navy prose-a:no-underline hover:prose-a:underline
          prose-strong:text-ag-black
          prose-table:text-[14px]
          prose-th:text-ag-black prose-th:font-semibold prose-th:text-left prose-th:py-3 prose-th:px-4
          prose-td:text-ag-gray prose-td:py-3 prose-td:px-4 prose-td:align-top">

            {/* Introduction */}
          <h2>{tP('content.intro.h')}</h2>
          <p>{tP('content.intro.p1')}</p>
          <p>{tP('content.intro.p2')}</p>
          <p>{tP('content.intro.p3')}</p>
          <p>{tP('content.intro.defsTitle')}</p>
          <ul>
            {(['dataSubject','personalData','sensitiveData','processing','controller','processor','pfpdt'] as const).map(key => {
              const pair = tP.raw(`content.intro.defs.${key}`) as [string,string]
              return (
                <li key={key}><strong>{pair[0]}</strong> {pair[1]}</li>
              )
            })}
          </ul>

          {/* Who we are */}
          <h2>{tP('content.whoWeAre.h')}</h2>
          <p>{tP('content.whoWeAre.p')}</p>

          {/* Our role */}
          <h2>{tP('content.ourRole.h')}</h2>
          <p>{tP('content.ourRole.p1')}</p>
          <p>{tP('content.ourRole.p2')}</p>
          <p>{tP('content.ourRole.p3')}</p>

          {/* When we collect */}
          <h2>{tP('content.whenCollect.h')}</h2>
          <p>{tP('content.whenCollect.p')}</p>

          {/* Categories */}
          <h2>{tP('content.categories.h')}</h2>
          <h3>{tP('content.categories.contactH')}</h3>
          <p>{tP('content.categories.contactP')}</p>
          <h3>{tP('content.categories.internetH')}</h3>
          <p>{tP('content.categories.internetP')}</p>

          {/* Sensitive */}
          <h2>{tP('content.sensitive.h')}</h2>
          <p>{tP('content.sensitive.p')}</p>

          {/* Why */}
          <h2>{tP('content.why.h')}</h2>
          <p>{tP('content.why.pIntro')}</p>
          <ul>
            {(tP.raw('content.why.items') as string[]).map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
          <p>{tP('content.why.pNote')}</p>

          {/* Rights */}
          <h2>{tP('content.rights.h')}</h2>
          <p>{tP('content.rights.pIntro')}</p>
          <ul>
            {(tP.raw('content.rights.items') as string[]).map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
          <p>{tP('content.rights.pContact')}</p>

          {/* Security */}
          <h2>{tP('content.security.h')}</h2>
          <p>{tP('content.security.p')}</p>

          {/* Storage */}
          <h2>{tP('content.storage.h')}</h2>
          <p>{tP('content.storage.p')}</p>

          {/* Sharing */}
          <h2>{tP('content.sharing.h')}</h2>
          <p>{tP('content.sharing.p')}</p>
          <h3>{tP('content.sharing.providersH')}</h3>
          <table>
            <thead>
              <tr>
                {(tP.raw('content.sharing.tableHeaders') as string[]).map((h, i) => (
                  <th key={i}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(tP.raw('content.sharing.providers') as string[][]).map((row, i) => (
                <tr key={i}>{row.map((cell, j) => <td key={j}>{cell}</td>)}</tr>
              ))}
            </tbody>
          </table>

          {/* Cookies */}
          <h2>{tP('content.cookies.h')}</h2>
          <p>{tP('content.cookies.p')}</p>

          {/* Social */}
          <h2>{tP('content.social.h')}</h2>
          <p>{tP('content.social.p')}</p>

          {/* Comms */}
          <h2>{tP('content.comms.h')}</h2>
          <p>{tP('content.comms.p')}</p>

          {/* Final */}
          <h2>{tP('content.final.h')}</h2>
          <p>{tP('content.final.p')}</p>
        </div>
      </div>
    </main>
  )
}
