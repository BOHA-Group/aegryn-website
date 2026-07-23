import { generateAegrynMetadata } from '@/lib/seo'
import { getTranslations } from 'next-intl/server'
import type { Metadata } from 'next'
import Link from 'next/link'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'neediuDpn' })
  return generateAegrynMetadata({
    title: t('meta.title'),
    description: t('meta.desc'),
    path: '/data-protection-notice-neediu',
    locale,
  })
}

export default async function NeediuLegalPage({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'neediuDpn' })

  const defKeys = ['dataSubject', 'personalData', 'sensitiveData', 'processing', 'controller', 'processor', 'pfpdt'] as const

  return (
    <main className="bg-white min-h-screen">
      <div className="mx-auto max-w-5xl px-6 md:px-16 py-28">

        <p className="font-sans font-semibold text-[10px] uppercase tracking-[0.24em] text-ag-gray-light mb-10">
          <Link href="/" className="hover:text-ag-black transition-colors">Aegryn</Link>
          {' / '}
          <span className="text-ag-apex">neediu</span>
          {' / '}{t('breadcrumb')}
        </p>

        <p className="font-sans font-semibold text-[10px] uppercase tracking-[0.2em] text-ag-apex mb-4">{t('sectionDpn')}</p>

        <h1 className="font-sans font-bold text-ag-black tracking-[-0.03em] leading-[1.1] mb-4"
          style={{ fontSize: 'clamp(28px,3.5vw,46px)' }}>
          {t('h1')}
        </h1>
        <p className="font-sans font-normal text-[13px] text-ag-gray leading-relaxed mb-4 border-l-2 border-ag-border pl-4">
          {t('disclaimer')}
        </p>
        <p className="font-sans font-semibold text-[11px] text-ag-gray-light mb-16">{t('updated')}</p>

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

          {/* ── DPN ── */}
          <h2>{t('dpn.intro.h')}</h2>
          <p>{t('dpn.intro.p1')}</p>
          <p>{t('dpn.intro.p2')}</p>
          <p>{t('dpn.intro.defsTitle')}</p>
          <ul>
            {defKeys.map(key => {
              const pair = t.raw(`dpn.intro.defs.${key}`) as [string, string]
              return (
                <li key={key}><strong>{pair[0]}</strong> {pair[1]}</li>
              )
            })}
          </ul>

          <h2>{t('dpn.whoWeAre.h')}</h2>
          <p>{t('dpn.whoWeAre.p')}</p>

          <h2>{t('dpn.ourRole.h')}</h2>
          <p>{t('dpn.ourRole.p1')}</p>
          <p>{t('dpn.ourRole.p2')}</p>

          <h2>{t('dpn.whenCollect.h')}</h2>
          <p>{t('dpn.whenCollect.p')}</p>

          <h2>{t('dpn.categories.h')}</h2>
          <h3>{t('dpn.categories.contactH')}</h3>
          <p>{t('dpn.categories.contactP')}</p>
          <h3>{t('dpn.categories.privateH')}</h3>
          <p>{t('dpn.categories.privateP')}</p>
          <h3>{t('dpn.categories.accountH')}</h3>
          <p>{t('dpn.categories.accountP')}</p>
          <h3>{t('dpn.categories.economicH')}</h3>
          <p>{t('dpn.categories.economicP')}</p>
          <h3>{t('dpn.categories.internetH')}</h3>
          <p>{t('dpn.categories.internetP')}</p>
          <h3>{t('dpn.categories.otherH')}</h3>
          <p>{t('dpn.categories.otherP')}</p>

          <h2>{t('dpn.sensitive.h')}</h2>
          <p>{t('dpn.sensitive.p')}</p>

          <h2>{t('dpn.why.h')}</h2>
          <p>{t('dpn.why.pIntro')}</p>
          <ul>
            {(t.raw('dpn.why.items') as string[]).map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
          <p>{t('dpn.why.pNote')}</p>

          <h2>{t('dpn.rights.h')}</h2>
          <p>{t('dpn.rights.pIntro')}</p>
          <ul>
            {(t.raw('dpn.rights.items') as string[]).map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
          <p>{t('dpn.rights.pContact')}</p>

          <h2>{t('dpn.security.h')}</h2>
          <p>{t('dpn.security.p')}</p>

          <h2>{t('dpn.storage.h')}</h2>
          <p>{t('dpn.storage.p')}</p>

          <h2>{t('dpn.sharing.h')}</h2>
          <p>{t('dpn.sharing.p')}</p>
          <h3>{t('dpn.sharing.providersH')}</h3>
          <table>
            <thead>
              <tr>
                {(t.raw('dpn.sharing.tableHeaders') as string[]).map((h, i) => (
                  <th key={i}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(t.raw('dpn.sharing.providers') as string[][]).map((row, i) => (
                <tr key={i}>{row.map((cell, j) => <td key={j}>{cell}</td>)}</tr>
              ))}
            </tbody>
          </table>

          <h2>{t('dpn.social.h')}</h2>
          <p>{t('dpn.social.p')}</p>

          <h2>{t('dpn.final.h')}</h2>
          <p>{t('dpn.final.p')}</p>

          {/* ── CGU ── */}
          <hr className="my-14 border-ag-border" />

          <p className="font-sans font-semibold text-[10px] uppercase tracking-[0.2em] text-ag-apex">{t('cgu.sectionLabel')}</p>
          <h2 className="!mt-4">{t('cgu.h2')}</h2>
          <p className="border-l-2 border-ag-border pl-4 text-[14px]">{t('cgu.disclaimer')}</p>

          <p>{t('cgu.intro')}</p>

          <h3>{t('cgu.s1H')}</h3>
          <p><strong>{t('cgu.s1AcceptTitle')}</strong> {t('cgu.s1Accept')}</p>
          <p><strong>{t('cgu.s1ModifTitle')}</strong> {t('cgu.s1Modif')}</p>

          <h3>{t('cgu.s2H')}</h3>
          <p>{t('cgu.s2')}</p>

          <h3>{t('cgu.s3H')}</h3>
          <p><strong>{t('cgu.s3AccountTitle')}</strong> {t('cgu.s3Account')}</p>
          <p><strong>{t('cgu.s3MemberTitle')}</strong> {t('cgu.s3Member')}</p>
          <p><strong>{t('cgu.s3ConfidTitle')}</strong> {t('cgu.s3Confid')}</p>
          <p><strong>{t('cgu.s3KycTitle')}</strong> {t('cgu.s3Kyc')}</p>

          <h3>{t('cgu.s4H')}</h3>
          <p><strong>{t('cgu.s4InternetTitle')}</strong> {t('cgu.s4Internet')}</p>
          <p><strong>{t('cgu.s4TelecomTitle')}</strong> {t('cgu.s4Telecom')}</p>

          <h3>{t('cgu.s5H')}</h3>
          <p>{t('cgu.s5')}</p>

          <h3>{t('cgu.s6H')}</h3>
          <p><strong>{t('cgu.s6RightTitle')}</strong> {t('cgu.s6Right')}</p>
          <p><strong>{t('cgu.s6RestrictTitle')}</strong> {t('cgu.s6Restrict')}</p>

          <h3>{t('cgu.s7H')}</h3>
          <p>{t('cgu.s7')}</p>

          <h3>{t('cgu.s8H')}</h3>
          <p>{t('cgu.s8')}</p>
          <p><strong>{t('cgu.s8FeesTitle')}</strong> {t('cgu.s8FeesIntro')}</p>
          <ul>
            {(t.raw('cgu.s8Fees') as string[]).map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
          <p>{t('cgu.s8Payout')}</p>

          <h3>{t('cgu.s9H')}</h3>
          <p>{t('cgu.s9')}</p>

          <h3>{t('cgu.s10H')}</h3>
          <p>{t('cgu.s10')}</p>

          <h3>{t('cgu.s11H')}</h3>
          <p>{t('cgu.s11')}</p>

          <h3>{t('cgu.s12H')}</h3>
          <p>{t('cgu.s12')}</p>

          <h3>{t('cgu.s13H')}</h3>
          <p>{t('cgu.s13')}</p>

          <h3>{t('cgu.s14H')}</h3>
          <p>{t('cgu.s14')}</p>

          <h3>{t('cgu.s15H')}</h3>
          <p>{t('cgu.s15')}</p>

          <h3>{t('cgu.s16H')}</h3>
          <p>{t('cgu.s16')}</p>

          <h3>{t('cgu.s17H')}</h3>
          <p><strong>{t('cgu.s17DivTitle')}</strong> {t('cgu.s17Div')}</p>
          <p><strong>{t('cgu.s17ForceTitle')}</strong> {t('cgu.s17Force')}</p>
          <p><strong>{t('cgu.s17LawTitle')}</strong> {t('cgu.s17Law')}</p>
          <p><strong>{t('cgu.s17JurisTitle')}</strong> {t('cgu.s17Juris')}</p>

          <h3>{t('cgu.s18H')}</h3>
          <p>{t('cgu.s18')}</p>
        </div>
      </div>
    </main>
  )
}
