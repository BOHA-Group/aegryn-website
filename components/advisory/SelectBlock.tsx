import { getTranslations } from 'next-intl/server'
import { ArrowRight, ArrowUpRight } from 'lucide-react'
import { Link } from '@/i18n/navigation'
import { LIFECYCLE_LABELS } from '@/content/advisory'
import { SELECT_COPY, SELECT_CYCLES } from '@/content/advisory/select'
import type { Lang } from '@/content/advisory/implement'

/** Bloc « Sélectionner » : profils clés et profils de transition. Libellés du menu repris de nav.craftRecruit*. */
export async function SelectBlock({ locale }: { locale: string }) {
  const lang = (['fr', 'en', 'de', 'es', 'it', 'nl'].includes(locale) ? locale : 'en') as Lang
  const t = await getTranslations({ locale: lang, namespace: 'nav' })
  const c = SELECT_COPY[lang]
  const cycles = LIFECYCLE_LABELS[lang] ?? LIFECYCLE_LABELS.fr
  return (
    <section id="selectionner" className="scroll-mt-24 border-t border-ag-border bg-ag-off-white px-6 py-24 md:px-12">
      <div className="mx-auto max-w-7xl">
        <p className="mb-4 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.28em] text-ag-apex-ink"><span className="inline-block h-px w-5 bg-ag-apex/50" />{t('craftRecruit')}</p>
        <h2 className="max-w-3xl font-sans font-bold leading-[1.15] tracking-[-0.03em] text-ag-black" style={{ fontSize: 'clamp(26px,3vw,44px)' }}>{t('craftRecruitDesc')}</h2>
        <Link href="/talent" className="mt-6 inline-flex items-center gap-2 font-sans text-[15px] font-semibold text-ag-navy underline-offset-4 hover:underline">
          <ArrowRight size={14} />{t('craftRecruitIntro')}
        </Link>

        <div className="mt-12 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          <div className="rounded-2xl border border-ag-border bg-ag-white p-8">
            <p className="mb-5 font-mono text-[10px] uppercase tracking-[0.2em] text-ag-gray-light">{t('craftRecruitForCompanies')}</p>
            <ul className="flex flex-col gap-6">
              <li>
                <Link href="/talent/entreprises" className="rounded-lg inline-flex items-center gap-2 bg-ag-apex px-6 py-3 font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-ag-navy transition-colors hover:bg-ag-apex/90">
                  {t('craftRecruitHire')} <ArrowUpRight size={12} />
                </Link>
                <p className="mt-3 text-[15px] leading-relaxed text-ag-gray">{c.hire}</p>
              </li>
              <li>
                <Link href="/talent/transition" className="rounded-lg inline-flex items-center gap-2 bg-ag-apex px-6 py-3 font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-ag-navy transition-colors hover:bg-ag-apex/90">
                  {t('craftRecruitTransition')} <ArrowUpRight size={12} />
                </Link>
                <p className="mt-3 text-[15px] leading-relaxed text-ag-gray">{c.trans}</p>
              </li>
            </ul>
          </div>
          <div className="rounded-2xl border border-ag-border bg-ag-white p-8">
            <p className="mb-5 font-mono text-[10px] uppercase tracking-[0.2em] text-ag-gray-light">{t('craftRecruitForCandidates')}</p>
            <Link href="/talent/candidats" className="rounded-lg inline-flex items-center gap-2 bg-ag-apex px-6 py-3 font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-ag-navy transition-colors hover:bg-ag-apex/90">
              {t('craftRecruitPool')} <ArrowUpRight size={12} />
            </Link>
          </div>
        </div>

        <div className="mt-6 rounded-2xl border border-ag-border bg-ag-white p-8">
          <p className="mb-5 font-mono text-[10px] uppercase tracking-[0.2em] text-ag-gray-light">{c.cyc_title}</p>
          <div className="hidden grid-cols-[minmax(0,1fr)_minmax(0,2fr)] gap-x-8 border-b border-ag-border pb-3 font-mono text-[9px] uppercase tracking-[0.18em] text-ag-gray-light sm:grid">
            <span>{c.h_cycle}</span><span>{c.h_profile}</span>
          </div>
          <ul className="divide-y divide-ag-border">
            {SELECT_CYCLES.map((cy, i) => (
              <li key={cy} className="grid gap-1 py-4 sm:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] sm:gap-x-8">
                <Link href={`/accompagner/${cy}` as never} className="font-sans text-[14px] font-semibold text-ag-black hover:text-ag-navy">{cycles[cy]}</Link>
                <span className="font-sans text-[15px] leading-relaxed text-ag-gray">{c.rows[i]}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-ag-border bg-ag-white p-8">
            <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.2em] text-ag-gray-light">{c.method_title}</p>
            <ol className="flex flex-wrap items-center gap-x-3 gap-y-2 font-sans text-[15px] text-ag-black">
              {c.steps.map((s, i) => (
                <li key={i} className="flex items-center gap-3"><span className="font-semibold">{s}</span>{i < c.steps.length - 1 && <span aria-hidden className="text-ag-gray-light">·</span>}</li>
              ))}
            </ol>
          </div>
          <div className="rounded-2xl border border-ag-border bg-ag-white p-8">
            <p className="font-sans text-[15px] leading-relaxed text-ag-gray"><span className="font-semibold text-ag-black">{c.indep_label}</span> {c.indep}</p>
          </div>
        </div>

        <div className="mt-10">
          <Link
            href={{ pathname: '/talent/entreprises', hash: 'besoin' } as never}
            className="rounded-lg inline-flex items-center gap-2 bg-ag-apex px-7 py-3.5 font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-ag-navy transition-colors hover:bg-ag-apex/90"
          >
            {c.button} <ArrowUpRight size={12} />
          </Link>
        </div>
      </div>
    </section>
  )
}
