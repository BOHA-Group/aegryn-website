/**
 * /nda/[token] : signature publique d'un NDA mutuel via lien personnel.
 * Sans compte, hors locale, non indexée. L'état (à signer, signé, expiré,
 * révoqué, invalide) est déterminé côté serveur à partir du jeton.
 */
import type { Metadata } from 'next'
import { getSigningContext, type SigningContext } from '@/lib/nda/service'
import { ROLE_LABELS, type NdaBlock, type NdaLang } from '@/lib/nda/template'
import NdaSignForm from './NdaSignForm'
import { NDA_PAGE } from './ndaText'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = {
  title: 'Aegryn',
  robots: { index: false, follow: false, nocache: true },
  referrer: 'no-referrer',
}

const dateUtc = (iso: string) => `${new Date(iso).toISOString().replace('T', ' ').slice(0, 16)} UTC`

function Shell({ lang, children }: { lang: NdaLang; children: React.ReactNode }) {
  return (
    <main lang={lang} className="min-h-screen bg-ag-off-white px-4 py-12 md:py-16">
      <div className="mx-auto max-w-3xl">
        <p className="mb-8 font-sans font-bold text-[13px] uppercase tracking-[0.3em] text-ag-navy">Aegryn</p>
        {children}
      </div>
    </main>
  )
}

function Notice({ lang, title, text }: { lang: NdaLang; title: string; text: string }) {
  const t = NDA_PAGE[lang]
  return (
    <Shell lang={lang}>
      <div className="rounded-2xl border border-ag-border bg-white p-8">
        <h1 className="font-sans font-bold text-ag-black text-[24px] tracking-tight mb-3">{title}</h1>
        <p className="text-[15px] text-ag-gray leading-relaxed">{text}</p>
        <p className="mt-4 text-[14px]"><a className="underline underline-offset-2 text-ag-navy" href={`mailto:${t.contact}`}>{t.contact}</a></p>
      </div>
    </Shell>
  )
}

function Doc({ blocks }: { blocks: NdaBlock[] }) {
  return (
    <article className="space-y-3 rounded-2xl border border-ag-border bg-white p-6 md:p-10">
      {blocks.map((b, i) => {
        switch (b.kind) {
          case 'title':    return <h1 key={i} className="font-sans font-bold text-ag-black text-[26px] tracking-tight leading-tight">{b.text}</h1>
          case 'subtitle': return <p key={i} className="font-sans text-[13px] text-ag-gray-light">{b.text}</p>
          case 'meta':     return <p key={i} className="font-mono text-[11px] text-ag-gray-light pb-4">{b.text}</p>
          case 'h':        return <h2 key={i} className="pt-4 font-sans font-bold text-ag-navy text-[15px]">{b.text}</h2>
          case 'li':       return <p key={i} className="pl-5 text-[14px] text-ag-gray leading-relaxed">{b.text}</p>
          default:         return <p key={i} className="text-[14px] text-ag-gray leading-relaxed">{b.text}</p>
        }
      })}
    </article>
  )
}

export default async function NdaPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params
  const ctx: SigningContext = await getSigningContext(token).catch((): SigningContext => ({ state: 'unavailable' }))

  if (ctx.state === 'invalid' || ctx.state === 'unavailable') {
    const lang: NdaLang = 'fr'
    const t = NDA_PAGE[lang]
    return <Notice lang={lang} title={ctx.state === 'invalid' ? t.invalidTitle : t.unavailableTitle} text={ctx.state === 'invalid' ? t.invalidText : t.unavailableText} />
  }
  const t = NDA_PAGE[ctx.lang]
  if (ctx.state === 'expired') return <Notice lang={ctx.lang} title={t.expiredTitle} text={t.expiredText} />
  if (ctx.state === 'revoked') return <Notice lang={ctx.lang} title={t.revokedTitle} text={t.revokedText} />

  if (ctx.state === 'signed') {
    return (
      <Shell lang={ctx.lang}>
        <div className="rounded-2xl border border-ag-apex/30 bg-ag-apex/5 p-8 space-y-4">
          <span className="font-sans font-semibold text-2xl text-ag-apex-ink">✓</span>
          <h1 className="font-sans font-bold text-ag-black text-[24px] tracking-tight">{t.signedTitle}</h1>
          <p className="text-[15px] text-ag-gray leading-relaxed">{t.signedText}</p>
          <dl className="text-[13px] text-ag-gray space-y-1">
            <div><dt className="inline font-semibold text-ag-black">{t.ref} : </dt><dd className="inline">{ctx.reference}</dd></div>
            <div><dt className="inline font-semibold text-ag-black">{t.signedOn} : </dt><dd className="inline">{dateUtc(ctx.signedAtIso)}</dd></div>
          </dl>
          <a
            href={`/api/nda/agreements/pdf?token=${encodeURIComponent(token)}`}
            className="inline-block rounded-full bg-ag-apex px-7 py-3.5 font-sans text-sm font-bold text-ag-navy hover:bg-ag-navy hover:text-white transition-colors"
          >
            {t.download}
          </a>
        </div>
      </Shell>
    )
  }

  return (
    <Shell lang={ctx.lang}>
      <p className="font-sans font-semibold text-[10px] uppercase tracking-[0.28em] text-ag-apex-ink mb-3">{t.kicker}</p>
      <p className="text-[15px] text-ag-gray leading-relaxed mb-2 max-w-2xl">{t.intro}</p>
      <p className="font-mono text-[11px] text-ag-gray-light mb-8">
        {t.yourProfiles} : {ctx.roles.map(r => ROLE_LABELS[ctx.lang][r]).join(' · ')} · {t.validUntil} {ctx.expiresAtIso.slice(0, 10)}
      </p>
      <div className="space-y-6">
        <Doc blocks={ctx.blocks} />
        <NdaSignForm token={token} lang={ctx.lang} expectedName={ctx.fullName} />
      </div>
    </Shell>
  )
}
