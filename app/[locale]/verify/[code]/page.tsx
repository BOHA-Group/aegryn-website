import type { Metadata } from 'next'
import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import { BadgeCheck, Clock, Ban, SearchX } from 'lucide-react'
import { generateAegrynMetadata } from '@/lib/seo'
import { getPublicCertificate, normaliseCode } from '@/lib/certificate'
import VerifyForm from '../VerifyForm'

type Props = { params: Promise<{ locale: string; code: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, code } = await params
  const t = await getTranslations({ locale, namespace: 'verify' })
  const cert = await getPublicCertificate(code)
  const title = cert ? `${cert.organisation} · CIFSO 5000 ${cert.grade}` : t('metaTitle')
  return { ...generateAegrynMetadata({ title, description: t('metaDesc'), path: `/verify/${normaliseCode(code)}`, locale }), robots: { index: false, follow: true } }
}

function fmt(d: string | null, locale: string) {
  return d ? new Date(d).toLocaleDateString(locale, { day: '2-digit', month: 'long', year: 'numeric' }) : '—'
}

export default async function VerifyCodePage({ params }: Props) {
  const { locale, code } = await params
  const t    = await getTranslations({ locale, namespace: 'verify' })
  const cert = await getPublicCertificate(code)
  const clean = normaliseCode(code)

  const STATUS = {
    valid:      { label: t('statusValid'),      cls: 'bg-emerald-50 border-emerald-200 text-emerald-800', Icon: BadgeCheck },
    expired:    { label: t('statusExpired'),    cls: 'bg-amber-50 border-amber-200 text-amber-800',       Icon: Clock },
    superseded: { label: t('statusSuperseded'), cls: 'bg-gray-50 border-gray-200 text-gray-700',          Icon: Ban },
    not_found:  { label: t('statusNotFound'),   cls: 'bg-red-50 border-red-200 text-red-800',             Icon: SearchX },
  } as const
  const st = STATUS[cert?.status ?? 'not_found']

  return (
    <main className="bg-ag-white min-h-[70vh]">
      <section className="max-w-4xl mx-auto px-6 pt-32 pb-24">
        <p className="font-mono text-[11px] tracking-[0.28em] uppercase text-ag-gray-light mb-4">{t('eyebrow')}</p>
        <h1 className="font-sans font-bold text-ag-black text-[32px] md:text-[42px] tracking-[-0.03em] leading-[1.05] mb-8">{t('title')}</h1>

        <div className={`rounded-xl border px-6 py-5 flex items-center gap-4 mb-8 ${st.cls}`}>
          <st.Icon size={28} className="shrink-0" />
          <div>
            <p className="font-sans font-bold text-[18px] leading-tight">{st.label}</p>
            <p className="font-mono text-[12px] tracking-[0.14em] uppercase opacity-80 mt-1">{clean}</p>
          </div>
        </div>

        {cert ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="md:col-span-2 rounded-xl border border-ag-border p-8">
              <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-ag-gray-light mb-1">{t('organisation')}</p>
              <h2 className="font-sans font-bold text-ag-black text-[26px] tracking-[-0.02em] mb-6">{cert.organisation}</h2>
              <dl className="grid grid-cols-2 gap-5">
                <div><dt className="font-mono text-[10px] tracking-[0.22em] uppercase text-ag-gray-light mb-1">{t('score')}</dt><dd className="font-sans font-bold text-ag-black text-[18px]">{cert.score != null ? `${cert.score} / 100` : '—'}</dd></div>
                <div><dt className="font-mono text-[10px] tracking-[0.22em] uppercase text-ag-gray-light mb-1">{t('issued')}</dt><dd className="font-sans text-ag-black text-[14px]">{fmt(cert.issuedAt, locale)}</dd></div>
                <div><dt className="font-mono text-[10px] tracking-[0.22em] uppercase text-ag-gray-light mb-1">{t('validUntil')}</dt><dd className="font-sans text-ag-black text-[14px]">{fmt(cert.validUntil, locale)}</dd></div>
                <div><dt className="font-mono text-[10px] tracking-[0.22em] uppercase text-ag-gray-light mb-1">Version</dt><dd className="font-sans text-ag-black text-[14px]">{cert.version}</dd></div>
              </dl>
              <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-ag-gray-light mt-8 mb-3">{t('dimensions')}</p>
              <div className="grid grid-cols-5 gap-2">
                {cert.dimensions.map(d => (
                  <div key={d.letter} className="rounded-lg bg-ag-off-white border border-ag-border px-3 py-3 text-center">
                    <p className="font-sans font-bold text-ag-navy text-[18px] leading-none">{d.letter}</p>
                    <p className="font-mono text-[11px] text-ag-black mt-1.5">{d.score != null ? `${d.score}/${d.max}` : '—'}</p>
                  </div>
                ))}
              </div>
              {cert.summary && (
                <>
                  <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-ag-gray-light mt-8 mb-2">{t('summary')}</p>
                  <p className="font-sans text-[14px] text-ag-black/80 leading-relaxed border-l-4 border-ag-apex pl-4">{cert.summary}</p>
                </>
              )}
            </div>
            <div className="flex flex-col gap-4">
              <div className="rounded-xl bg-ag-navy text-white p-8 text-center">
                <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-white/50 mb-3">{t('grade')}</p>
                <p className="font-sans font-extrabold text-ag-apex text-[64px] leading-none">{cert.grade}</p>
                <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-white/50 mt-4">CIFSO 5000</p>
              </div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`/api/certificate/${cert.code}/badge.svg`} alt={t('badgeAlt')} width={320} height={96} className="w-full h-auto rounded-xl border border-ag-border" />
              <p className="font-sans text-[11px] text-ag-gray-light leading-relaxed">{t('issuer')}</p>
            </div>
          </div>
        ) : (
          <p className="font-sans text-[14px] text-ag-black/70 leading-relaxed max-w-2xl mb-10">{t('notFoundHint')}</p>
        )}

        <VerifyForm initial={cert ? '' : clean} />

        <div className="mt-16 border-l-4 border-ag-apex pl-6 max-w-2xl">
          <h2 className="font-sans font-bold text-ag-black text-[18px] mb-2">{t('whatTitle')}</h2>
          <p className="font-sans text-[14px] text-ag-black/70 leading-relaxed mb-4">{t('whatDesc')}</p>
          <p className="font-sans text-[14px] text-ag-black/70 leading-relaxed mb-4">{t('whatDeed')}</p>
          <Link href={`/${locale}/grade`} className="font-sans font-semibold text-[12px] tracking-[0.14em] uppercase text-ag-navy underline underline-offset-4">{t('learnMore')}</Link>
        </div>
      </section>
    </main>
  )
}
