/**
 * /alliances : page Partenaires (fusion des anciennes pages Alliances et Experts).
 * Douze activités, trois étapes, un seul chemin d'entrée : le formulaire de contact (sujet « Partenariat »).
 */
import type { Metadata } from 'next'
import { Link } from '@/i18n/navigation'
import { generateAegrynMetadata } from '@/lib/seo'
import { PARTNERS } from '@/content/partners/copy'
import { PARTNER_ACTIVITIES, OPTION_LABELS } from '@/content/contact/fields'

type Props = { params: Promise<{ locale: string }> }
const LANGS = ['fr', 'en', 'de', 'es', 'it', 'nl'] as const
type Lang = typeof LANGS[number]
const toLang = (l: string): Lang => ((LANGS as readonly string[]).includes(l) ? (l as Lang) : 'en')
const ACTIVITIES = PARTNER_ACTIVITIES.filter(a => a !== 'other')
const h2 = { fontSize: 'clamp(26px,3vw,44px)' }
const CONTACT = { pathname: '/contact', query: { subject: 'partnership' } } as never

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const lang = toLang(locale)
  return generateAegrynMetadata({ title: PARTNERS.metaTitle[lang], description: PARTNERS.metaDesc[lang], path: '/alliances', locale })
}

export default async function PartnersPage({ params }: Props) {
  const { locale } = await params
  const lang = toLang(locale)
  return (
    <main>
      <section className="bg-ag-navy px-6 py-32 md:px-12">
        <div className="mx-auto max-w-7xl">
          <p className="mb-6 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.28em] text-ag-apex">
            <span className="inline-block h-px w-6 bg-ag-apex/50" />{PARTNERS.label[lang]}
          </p>
          <h1 className="max-w-4xl whitespace-pre-line font-sans font-bold leading-[1.05] tracking-[-0.03em] text-white" style={{ fontSize: 'clamp(48px,6vw,86px)' }}>{PARTNERS.title[lang]}</h1>
          <p className="mt-8 max-w-2xl text-[16px] leading-relaxed text-white/80">{PARTNERS.desc[lang]}</p>
          <Link href={CONTACT} className="mt-10 inline-block rounded-full bg-ag-apex px-8 py-4 font-sans text-sm font-bold text-ag-navy transition-colors hover:bg-white">{PARTNERS.cta[lang]}</Link>
        </div>
      </section>

      <section className="bg-white py-24 md:py-28">
        <div className="mx-auto max-w-7xl px-6 md:px-12">
          <h2 className="max-w-3xl font-sans font-bold leading-[1.1] tracking-[-0.025em] text-ag-black" style={h2}>{PARTNERS.activitiesTitle[lang]}</h2>
          <div className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {ACTIVITIES.map((a, i) => (
              <div key={a} className="flex min-h-[132px] flex-col justify-between rounded-2xl bg-ag-off-white p-6">
                <span className="font-mono text-[11px] tracking-[0.2em] text-ag-apex-ink">{String(i + 1).padStart(2, '0')}</span>
                <p className="mt-6 font-sans text-[16px] font-semibold leading-snug tracking-[-0.01em] text-ag-black">{OPTION_LABELS[`activity.${a}`][lang]}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-ag-off-white py-24 md:py-28">
        <div className="mx-auto max-w-7xl px-6 md:px-12">
          <h2 className="max-w-3xl font-sans font-bold leading-[1.1] tracking-[-0.025em] text-ag-black" style={h2}>{PARTNERS.stepsTitle[lang]}</h2>
          <div className="mt-14 grid gap-12 md:grid-cols-3 md:gap-16">
            {PARTNERS.steps.map((s, i) => (
              <div key={i}>
                <p className="font-mono text-[11px] tracking-[0.2em] text-ag-apex-ink">{String(i + 1).padStart(2, '0')}</p>
                <h3 className="mt-2 font-sans text-[24px] font-bold tracking-[-0.02em] text-ag-black">{s.title[lang]}</h3>
                <p className="mt-3 text-[15px] leading-relaxed text-ag-gray">{s.desc[lang]}</p>
              </div>
            ))}
          </div>
          <Link href={CONTACT} className="mt-14 inline-block rounded-full bg-ag-navy px-8 py-4 font-sans text-sm font-bold text-white transition-colors hover:bg-ag-navy-mid">{PARTNERS.cta[lang]}</Link>
        </div>
      </section>
    </main>
  )
}
