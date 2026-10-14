/**
 * Génération de l'exemplaire PDF signé d'un NDA (pdf-lib, polices standard).
 * Contenu : texte accepté (socle commun + annexes du profil), bloc de signatures
 * (Aegryn contresigne automatiquement), page « dossier de preuve » avec
 * horodatage UTC, IP, version du modèle et empreintes SHA-256.
 *
 * Les polices standard n'encodent que le jeu WinAnsi : les caractères hors jeu
 * sont ramenés à leur lettre de base. Le nom saisi est conservé à l'identique en
 * base ; l'empreinte SHA-256 du nom exact figure dans le dossier de preuve.
 */
import { PDFDocument, StandardFonts, rgb, type PDFFont, type PDFPage } from 'pdf-lib'
import { ROLE_LABELS, getNdaSignatureLabels, type NdaBlock, type NdaLang, type NdaRole } from './template'

const PAGE_W = 595.28
const PAGE_H = 841.89
const MARGIN = 56
const NAVY   = rgb(0.059, 0.11, 0.247)
const GRAY   = rgb(0.4, 0.45, 0.52)
const LINE   = rgb(0.85, 0.87, 0.9)

export interface SignedNdaInput {
  lang:            NdaLang
  blocks:          NdaBlock[]
  reference:       string
  templateVersion: string
  contentSha256:   string
  signatory: {
    name:        string
    company?:    string | null
    email:       string
    roles:       NdaRole[]
    signedAtIso: string
    ip:          string | null
    userAgent:   string | null
    nameSha256:  string
  }
  aegryn: { name: string; title: string; countersignedAtIso: string }
}

const WIN_ANSI_EXTRA = new Set('€‚ƒ„…†‡ˆ‰Š‹ŒŽ‘’“”•–—˜™š›œžŸ')
const FOLD: Record<string, string> = { ł: 'l', Ł: 'L', đ: 'd', Đ: 'D', ı: 'i', ø: 'o', Ø: 'O', ß: 'ss', ț: 't', Ț: 'T', ș: 's', Ș: 'S' }

/** Ramène une chaîne au jeu WinAnsi des polices standard PDF. */
export function toWinAnsi(input: string): string {
  let out = ''
  for (const ch of input.normalize('NFC')) {
    const code = ch.codePointAt(0) as number
    if (ch === '\u202f' || ch === '\u2009') { out += ' '; continue }
    if ((code >= 0x20 && code <= 0x7e) || (code >= 0xa0 && code <= 0xff) || WIN_ANSI_EXTRA.has(ch)) { out += ch; continue }
    if (FOLD[ch]) { out += FOLD[ch]; continue }
    const base = ch.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    out += base && base.charCodeAt(0) <= 0x7e ? base : '?'
  }
  return out
}

const utc = (iso: string) => `${new Date(iso).toISOString().replace('T', ' ').slice(0, 19)} UTC`

function wrap(text: string, font: PDFFont, size: number, maxWidth: number): string[] {
  const lines: string[] = []
  let current = ''
  for (const word of toWinAnsi(text).split(/\s+/).filter(Boolean)) {
    const candidate = current ? `${current} ${word}` : word
    if (font.widthOfTextAtSize(candidate, size) <= maxWidth) { current = candidate; continue }
    if (current) lines.push(current)
    current = word
  }
  if (current) lines.push(current)
  return lines
}

export async function buildSignedNdaPdf(input: SignedNdaInput): Promise<Uint8Array> {
  const lbl = getNdaSignatureLabels(input.lang)
  const doc = await PDFDocument.create()
  const regular = await doc.embedFont(StandardFonts.Helvetica)
  const bold    = await doc.embedFont(StandardFonts.HelveticaBold)
  const italic  = await doc.embedFont(StandardFonts.HelveticaOblique)
  const contentW = PAGE_W - MARGIN * 2

  doc.setTitle(`${input.reference}`)
  doc.setAuthor('Aegryn')
  doc.setSubject('NDA')
  doc.setCreationDate(new Date(input.signatory.signedAtIso))

  let page: PDFPage = doc.addPage([PAGE_W, PAGE_H])
  let y = PAGE_H - MARGIN
  const newPage = () => { page = doc.addPage([PAGE_W, PAGE_H]); y = PAGE_H - MARGIN }
  const ensure = (h: number) => { if (y - h < MARGIN + 24) newPage() }

  const draw = (text: string, o: { font?: PDFFont; size?: number; color?: ReturnType<typeof rgb>; indent?: number; gap?: number; lead?: number }) => {
    const font = o.font ?? regular, size = o.size ?? 9.5, lead = o.lead ?? size * 1.38, indent = o.indent ?? 0
    for (const line of wrap(text, font, size, contentW - indent)) {
      ensure(lead)
      page.drawText(line, { x: MARGIN + indent, y: y - size, size, font, color: o.color ?? rgb(0.12, 0.14, 0.2) })
      y -= lead
    }
    y -= o.gap ?? 0
  }

  for (const b of input.blocks) {
    switch (b.kind) {
      case 'title':    draw(b.text, { font: bold, size: 18, color: NAVY, gap: 3, lead: 23 }); break
      case 'subtitle': draw(b.text, { size: 10, color: GRAY, gap: 2 }); break
      case 'meta':     draw(b.text, { size: 8, color: GRAY, gap: 14 }); break
      case 'h':        y -= 6; ensure(34); draw(b.text, { font: bold, size: 10.5, color: NAVY, gap: 3 }); break
      case 'li':       draw(b.text, { indent: 14, gap: 2 }); break
      default:         draw(b.text, { gap: 5 })
    }
  }

  /* ── Bloc de signatures ── */
  ensure(190)
  y -= 14
  page.drawLine({ start: { x: MARGIN, y }, end: { x: PAGE_W - MARGIN, y }, thickness: 0.6, color: LINE })
  y -= 22
  const colW = (contentW - 24) / 2
  const top  = y
  const box = (x: number, title: string, name: string, lines: string[]) => {
    page.drawText(toWinAnsi(title.toUpperCase()), { x, y: top, size: 8, font: bold, color: GRAY })
    page.drawText(toWinAnsi(name), { x, y: top - 30, size: 16, font: italic, color: NAVY })
    page.drawLine({ start: { x, y: top - 38 }, end: { x: x + colW, y: top - 38 }, thickness: 0.6, color: NAVY })
    let ly = top - 52
    for (const l of lines) for (const w of wrap(l, regular, 8.5, colW)) { page.drawText(w, { x, y: ly, size: 8.5, font: regular, color: GRAY }); ly -= 11.5 }
  }
  const roleLabels = input.signatory.roles.map(r => ROLE_LABELS[input.lang][r]).join(', ')
  box(MARGIN, lbl.aegryn, input.aegryn.name, [input.aegryn.title, `${lbl.signedAt} ${utc(input.aegryn.countersignedAtIso)}`, lbl.auto])
  box(MARGIN + colW + 24, lbl.signatory, input.signatory.name, [
    [input.signatory.company, roleLabels].filter(Boolean).join(' · '),
    `${lbl.signedAt} ${utc(input.signatory.signedAtIso)}`,
  ])
  y = top - 110

  /* ── Page de preuve ── */
  newPage()
  const proofTitle = input.lang === 'fr' ? 'Dossier de preuve' : 'Evidence file'
  draw(proofTitle, { font: bold, size: 16, color: NAVY, gap: 4, lead: 21 })
  draw(input.lang === 'fr'
    ? 'Le texte accepté par le Signataire est celui des pages précédentes. Son empreinte numérique ci-dessous permet de vérifier qu’il n’a pas été modifié.'
    : 'The text accepted by the Signatory is that of the preceding pages. Its digital fingerprint below makes it possible to verify that it has not been altered.',
  { size: 9, color: GRAY, gap: 14 })

  const rows: [string, string][] = input.lang === 'fr' ? [
    ['Référence', input.reference],
    ['Version du modèle', input.templateVersion],
    ['Langue', 'Français'],
    ['Signataire (nom saisi)', input.signatory.name],
    ['SHA-256 du nom saisi (UTF-8)', input.signatory.nameSha256],
    ['E-mail du lien personnel', input.signatory.email],
    ['Profils', roleLabels],
    ['Signé le', utc(input.signatory.signedAtIso)],
    ['Adresse IP', input.signatory.ip ?? 'non disponible'],
    ['Agent utilisateur', input.signatory.userAgent ?? 'non disponible'],
    ['SHA-256 du texte accepté', input.contentSha256],
    ['Contresignature Aegryn', `${input.aegryn.name}, ${input.aegryn.title}`],
    ['Contresigné le', utc(input.aegryn.countersignedAtIso)],
  ] : [
    ['Reference', input.reference],
    ['Template version', input.templateVersion],
    ['Language', 'English'],
    ['Signatory (name entered)', input.signatory.name],
    ['SHA-256 of the name entered (UTF-8)', input.signatory.nameSha256],
    ['E-mail of the personal link', input.signatory.email],
    ['Profiles', roleLabels],
    ['Signed on', utc(input.signatory.signedAtIso)],
    ['IP address', input.signatory.ip ?? 'not available'],
    ['User agent', input.signatory.userAgent ?? 'not available'],
    ['SHA-256 of the text accepted', input.contentSha256],
    ['Aegryn countersignature', `${input.aegryn.name}, ${input.aegryn.title}`],
    ['Countersigned on', utc(input.aegryn.countersignedAtIso)],
  ]
  for (const [k, v] of rows) {
    ensure(34)
    draw(k.toUpperCase(), { font: bold, size: 7.5, color: GRAY, lead: 10 })
    draw(v, { size: 9, color: rgb(0.12, 0.14, 0.2), gap: 7, lead: 12 })
  }

  /* ── Pied de page et pagination ── */
  const pages = doc.getPages()
  const docTitleShort = `Aegryn · ${input.reference}`
  pages.forEach((p, i) => {
    p.drawLine({ start: { x: MARGIN, y: 40 }, end: { x: PAGE_W - MARGIN, y: 40 }, thickness: 0.4, color: LINE })
    p.drawText(toWinAnsi(docTitleShort), { x: MARGIN, y: 28, size: 7.5, font: regular, color: GRAY })
    const label = `${i + 1} / ${pages.length}`
    p.drawText(label, { x: PAGE_W - MARGIN - regular.widthOfTextAtSize(label, 7.5), y: 28, size: 7.5, font: regular, color: GRAY })
  })

  return doc.save()
}
