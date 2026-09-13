'use client'

import { useState } from 'react'
import { Copy, Check, Download, ExternalLink, Megaphone } from 'lucide-react'

export default function CommunicationKit({ code, organisation, grade, validUntil }: {
  code: string; organisation: string; grade: string; validUntil: string | null
}) {
  const site      = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://aegryn.com'
  const verifyUrl = `${site}/fr/verify/${code}`
  const badgeUrl  = `${site}/api/certificate/${code}/badge.svg`
  const until     = validUntil ? new Date(validUntil).toLocaleDateString('fr-CH', { month: 'long', year: 'numeric' }) : ''

  const embed = `<a href="${verifyUrl}" target="_blank" rel="noopener"><img src="${badgeUrl}" alt="${organisation} · Certifié CIFSO 5000 · Grade ${grade}" width="320" height="96" /></a>`
  const mention = `${organisation} est certifiée CIFSO 5000 (grade ${grade}) par Aegryn, organisme de certification indépendant, Suisse. Certificat vérifiable : ${verifyUrl}`
  const linkedin = `${organisation} obtient la Certification CIFSO 5000 avec le grade ${grade}.\n\nCe grade, délivré par Aegryn après un audit indépendant sur cinq dimensions (Code, IP, Finance, Sécurité, Organisation), documente la valeur et la transmissibilité de notre organisation de manière vérifiable.\n\nVérifier le certificat : ${verifyUrl}\n\n#CIFSO5000 #Certification #Gouvernance`
  const press = `${organisation} annonce l'obtention de la Certification CIFSO 5000, grade ${grade}, délivrée par Aegryn, organisme de certification indépendant basé en Suisse. La certification CIFSO 5000 évalue la valeur et la transmissibilité d'une organisation sur cinq dimensions : code et architecture, propriété intellectuelle, finance, sécurité, organisation et talent. Elle repose sur une vérification documentaire, une analyse indépendante et une revue, et est valide ${until ? `jusqu'en ${until}` : '12 mois'}. Le certificat est vérifiable publiquement à l'adresse ${verifyUrl}.`

  const [copied, setCopied] = useState<string | null>(null)
  async function copy(key: string, text: string) {
    await navigator.clipboard.writeText(text)
    setCopied(key); setTimeout(() => setCopied(null), 1800)
  }

  const Block = ({ k, title, text, mono = false }: { k: string; title: string; text: string; mono?: boolean }) => (
    <div className="border border-gray-100 p-4">
      <div className="flex items-center justify-between gap-3 mb-2">
        <p className="font-mono text-[9px] uppercase tracking-widest text-gray-400">{title}</p>
        <button onClick={() => copy(k, text)} className="rounded-lg inline-flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-widest text-ag-navy border border-ag-navy/30 px-2.5 py-1 hover:bg-ag-navy hover:text-white transition-colors">
          {copied === k ? <Check size={10} /> : <Copy size={10} />} {copied === k ? 'Copié' : 'Copier'}
        </button>
      </div>
      <pre className={`whitespace-pre-wrap break-words text-[12px] text-gray-700 leading-relaxed ${mono ? 'font-mono text-[11px]' : 'font-sans'}`}>{text}</pre>
    </div>
  )

  return (
    <div className="bg-white border border-gray-200 p-6 mb-6">
      <div className="flex items-center gap-2 mb-1">
        <Megaphone size={14} className="text-ag-navy" />
        <p className="font-sans font-bold text-gray-900 text-[14px]">Kit de communication</p>
      </div>
      <p className="font-sans text-[12px] text-gray-500 mb-5">
        Badge officiel, lien de vérification publique et textes prêts à l&apos;emploi. Toute mention doit renvoyer vers la page de vérification et respecter le grade et la période de validité.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="border border-gray-100 p-4 flex flex-col gap-3">
          <p className="font-mono text-[9px] uppercase tracking-widest text-gray-400">Badge officiel</p>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={`/api/certificate/${code}/badge.svg`} alt={`Badge Certifié CIFSO 5000 ${grade}`} width={320} height={96} className="w-full max-w-[320px] h-auto border border-gray-100 rounded-lg" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={`/api/certificate/${code}/badge.svg?theme=dark`} alt="" width={320} height={96} className="w-full max-w-[320px] h-auto rounded-lg" />
          <div className="flex flex-wrap gap-2">
            <a href={`/api/certificate/${code}/badge.svg`} download={`aegryn-cifso-5000-${code}.svg`} className="rounded-lg inline-flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-widest text-white bg-ag-navy px-3 py-1.5 hover:bg-ag-navy/90"><Download size={10} /> SVG clair</a>
            <a href={`/api/certificate/${code}/badge.svg?theme=dark`} download={`aegryn-cifso-5000-${code}-dark.svg`} className="rounded-lg inline-flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-widest text-ag-navy border border-ag-navy/30 px-3 py-1.5 hover:bg-ag-navy hover:text-white"><Download size={10} /> SVG sombre</a>
          </div>
        </div>
        <div className="border border-gray-100 p-4 flex flex-col gap-3">
          <p className="font-mono text-[9px] uppercase tracking-widest text-gray-400">Vérification publique</p>
          <a href={verifyUrl} target="_blank" rel="noopener noreferrer" className="font-mono text-[12px] text-ag-navy underline break-all inline-flex items-center gap-1.5">{verifyUrl} <ExternalLink size={11} /></a>
          <p className="font-sans text-[11px] text-gray-500">Code : <span className="font-mono text-gray-800">{code}</span>{until ? ` · valide jusqu'en ${until}` : ''}</p>
          <button onClick={() => copy('url', verifyUrl)} className="rounded-lg self-start inline-flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-widest text-ag-navy border border-ag-navy/30 px-2.5 py-1 hover:bg-ag-navy hover:text-white transition-colors">
            {copied === 'url' ? <Check size={10} /> : <Copy size={10} />} Copier le lien
          </button>
          <p className="font-mono text-[9px] uppercase tracking-widest text-gray-400 mt-2">API JSON (banques, investisseurs, auditeurs)</p>
          <code className="font-mono text-[11px] text-gray-700 break-all">{site}/api/verify/{code}</code>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3">
        <Block k="embed"    title="Intégration site web (HTML)" text={embed} mono />
        <Block k="mention"  title="Mention officielle (rapport annuel, dossier investisseurs, signature)" text={mention} />
        <Block k="linkedin" title="Publication LinkedIn" text={linkedin} />
        <Block k="press"    title="Communiqué (paragraphe type)" text={press} />
      </div>
    </div>
  )
}
