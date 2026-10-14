/**
 * /nda/[token] : signature publique d'un NDA mutuel via lien personnel.
 * Sans compte, hors locale, non indexée. L'état (à signer, signé, expiré,
 * révoqué, invalide) est déterminé côté serveur à partir du jeton.
 * Présentation : bandeau Aegryn, document au format A4 sur fond gris, puis
 * bloc de signature distinct (Aegryn d'un côté, le Signataire de l'autre).
 */
import type { Metadata } from 'next'
import { AegrynLogo } from '@/components/brand/AegrynLogo'
import { getSigningContext, type SigningContext } from '@/lib/nda/service'
import { NDA_TEMPLATE_VERSION } from '@/lib/nda/config'
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

function Shell({ lang, reference, children }: { lang: NdaLang; reference?: string; children: React.ReactNode }) {
  const t = NDA_PAGE[lang]
  return (
    <div lang={lang} className="min-h-screen bg-[#e4e7ec]">
      <header className="bg-ag-navy">
        <div className="mx-auto flex max-w-[794px] items-center justify-between px-6 py-5 md:px-0">
          <AegrynLogo variant="full" onDark size={30} />
          <div className="text-right">
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/70">{t.banner}</p>
            {reference && <p className="mt-0.5 font-mono text-[11px] tracking-[0.12em] text-ag-apex">{reference}</p>}
          </div>
        </div>
        <div className="h-1 bg-ag-apex" />
      </header>
      <main className="mx-auto max-w-[794px] px-3 py-8 md:px-0 md:py-10">{children}</main>
    </div>
  )
}

function Notice({ lang, title, text }: { lang: NdaLang; title: string; text: string }) {
  const t = NDA_PAGE[lang]
  return (
    <Shell lang={lang}>
      <div className="rounded-sm bg-white p-8 shadow-[0_10px_40px_rgba(15,28,63,0.18)] md:p-12">
        <h1 className="mb-3 font-sans text-[24px] font-bold tracking-tight text-ag-black">{title}</h1>
        <p className="text-[15px] leading-relaxed text-ag-gray">{text}</p>
        <p className="mt-4 text-[14px]"><a className="text-ag-navy underline underline-offset-2" href={`mailto:${t.contact}`}>{t.contact}</a></p>
      </div>
    </Shell>
  )
}

/** Feuille A4 : largeur 210 mm (794 px), marges 20 mm, proportions de page */
function Sheet({ blocks, reference, lang }: { blocks: NdaBlock[]; reference: string; lang: NdaLang }) {
  const t = NDA_PAGE[lang]
  return (
    <article className="min-h-[1123px] bg-white px-6 py-10 shadow-[0_10px_40px_rgba(15,28,63,0.18)] md:px-[76px] md:py-[72px]">
      <div className="space-y-3 text-[13px] leading-[1.7] text-ag-black/85">
        {blocks.map((b, i) => {
          switch (b.kind) {
            case 'title':    return <h1 key={i} className="border-b-2 border-ag-navy pb-3 font-sans text-[26px] font-bold leading-tight tracking-tight text-ag-navy">{b.text}</h1>
            case 'subtitle': return <p key={i} className="text-[12px] text-ag-gray">{b.text}</p>
            case 'meta':     return <p key={i} className="pb-3 font-mono text-[10px] text-ag-gray-light">{b.text}</p>
            case 'h':        return <h2 key={i} className="pt-4 font-sans text-[13.5px] font-bold text-ag-navy">{b.text}</h2>
            case 'li':       return <p key={i} className="pl-5">{b.text}</p>
            default:         return <p key={i} className="text-justify">{b.text}</p>
          }
        })}
      </div>
      <footer className="mt-12 flex items-center justify-between border-t border-ag-border pt-3 font-mono text-[10px] text-ag-gray-light">
        <span>Aegryn · {reference}</span><span>{t.version} {NDA_TEMPLATE_VERSION}</span>
      </footer>
    </article>
  )
}

export default async function NdaPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params
  const ctx: SigningContext = await getSigningContext(token).catch((): SigningContext => ({ state: 'unavailable' }))

  if (ctx.state === 'invalid' || ctx.state === 'unavailable') {
    const t = NDA_PAGE.fr
    return <Notice lang="fr" title={ctx.state === 'invalid' ? t.invalidTitle : t.unavailableTitle} text={ctx.state === 'invalid' ? t.invalidText : t.unavailableText} />
  }
  const t = NDA_PAGE[ctx.lang]
  if (ctx.state === 'expired') return <Notice lang={ctx.lang} title={t.expiredTitle} text={t.expiredText} />
  if (ctx.state === 'revoked') return <Notice lang={ctx.lang} title={t.revokedTitle} text={t.revokedText} />

  if (ctx.state === 'signed') {
    return (
      <Shell lang={ctx.lang} reference={ctx.reference}>
        <div className="space-y-4 rounded-sm border-t-4 border-ag-apex bg-white p-8 shadow-[0_10px_40px_rgba(15,28,63,0.18)] md:p-12">
          <span className="font-sans text-2xl font-semibold text-ag-apex-ink">✓</span>
          <h1 className="font-sans text-[24px] font-bold tracking-tight text-ag-black">{t.signedTitle}</h1>
          <p className="text-[15px] leading-relaxed text-ag-gray">{t.signedText}</p>
          <dl className="space-y-1 text-[13px] text-ag-gray">
            <div><dt className="inline font-semibold text-ag-black">{t.ref} : </dt><dd className="inline">{ctx.reference}</dd></div>
            <div><dt className="inline font-semibold text-ag-black">{t.signedOn} : </dt><dd className="inline">{dateUtc(ctx.signedAtIso)}</dd></div>
          </dl>
          <a
            href={`/api/nda/agreements/pdf?token=${encodeURIComponent(token)}`}
            className="inline-block rounded-full bg-ag-apex px-7 py-3.5 font-sans text-sm font-bold text-ag-navy transition-colors hover:bg-ag-navy hover:text-white"
          >
            {t.download}
          </a>
        </div>
      </Shell>
    )
  }

  return (
    <Shell lang={ctx.lang} reference={ctx.reference}>
      <div className="mb-6 flex flex-wrap items-center gap-x-6 gap-y-2 font-sans text-[12px] font-semibold text-ag-navy">
        <span>{t.stepRead}</span><span className="text-ag-gray-light">→</span><span>{t.stepSign}</span>
      </div>
      <p className="mb-2 max-w-2xl text-[14px] leading-relaxed text-ag-gray">{t.intro}</p>
      <p className="mb-6 font-mono text-[11px] text-ag-gray-light">
        {t.yourProfiles} : {ctx.roles.map(r => ROLE_LABELS[ctx.lang][r]).join(' · ')} · {t.validUntil} {ctx.expiresAtIso.slice(0, 10)}
      </p>
      <div className="space-y-8">
        <Sheet blocks={ctx.blocks} reference={ctx.reference} lang={ctx.lang} />
        <NdaSignForm token={token} lang={ctx.lang} expectedName={ctx.fullName} aegryn={ctx.aegryn} />
      </div>
    </Shell>
  )
}
