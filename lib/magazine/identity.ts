/**
 * Keep the exported edition's model page aligned with the site's vocabulary.
 * Preserve its anchor IDs, pagination and stored export for existing reader links.
 */
const BOUTIQUE = 'Rare by selection. Discreet by principle.'

const EDITORIAL: [string, string][] = [
  ['Aegryn SA', 'Aegryn (BOHA-Group Sàrl)'],
  ['We frame, deliver, accompany, select and stay informed.',
    'We frame, deliver, accompany, select and stay informed. Through La Boutique, we also take on a limited number of signature projects.'],
  ['Built to last. In that spirit',
    `Aegryn has a second voice, La Boutique, where we frame, deliver and accompany a limited number of signature projects. ${BOUTIQUE} Built to last. In that spirit`],
  ['Aegryn works with the leaders of organisations between ten and three hundred million euros of revenue, on strategy, compliance, technology, people and transactions.',
    'Aegryn works with the leaders of organisations on strategy, compliance, technology, people and transactions, and, through La Boutique, carries a limited number of signature projects from concept to delivery.'],
  ['ready to transact.', 'built to last.'],
  ['Certified and ready to', 'Certified and built to'],
  ['set out on page 4.', 'set out on page 119.'],
  ['>Aegryn Value<', '>La Boutique<'],
  ['Confidential structured mandates between certified organisations and qualified counterparties, across Europe.',
    'A limited number of signature projects, framed, delivered and accompanied end to end. A confidentiality agreement comes first, and we reply within two working days.'],
  ['media@boha-group.com · aegryn.com<', 'aegryn.com/boutique<'],
  ['A premium audience at the intersection of technology, capital, and transactions.',
    'A premium audience at the intersection of technology, capital and signature projects.'],
  ['>Founders<', '>Founders and entrepreneurs<'],
  ['Building and preparing their technology assets for growth or exit.',
    'Building their companies and signature projects, and preparing them for growth or handover.'],
  ['>Investors<', '>Investors and family offices<'],
  ['PE, VC, family offices, and institutional capital active in European technology.',
    'PE, VC, family offices, institutional capital and acquirers active in European technology.'],
  ['>Acquirers<', '>Institutions, industrials and brands<'],
  ['Searching for qualified, certified European technology assets to acquire.',
    'Carrying an innovation or a signature project from decision to market.'],
]

export function prepareMagazineHtml(html: string) {
  const labels: Record<string, string> = {
    Advise: 'Frame', Build: 'Deliver', Navigate: 'Accompany', Recruit: 'Select', Inform: 'Stay informed',
  }
  const model = (block: string) => block
    .replace(/>(Advise|Build|Navigate|Recruit|Inform)</g, (_, label: string) => `>${labels[label]}<`)
    .replace('Durable digital assets, full client ownership. Each asset is designed to enhance company value, pass certification and guarantee technological independence.',
      'Project and programme delivery, from governance to acceptance. We coordinate specialist experts and work with your teams to turn decisions into results.')
  const harmonised = html
    .replace(/<section id="the-aegryn-model-five-disciplines-one-st"[\s\S]*?<\/section>/g, model)
    .replace(/<div id="p4" class="pg">[\s\S]*?(?=<div id="p5" class="pg">)/g, model)
    .replaceAll('Five disciplines', 'Five ways of working')
    .replace('We advise, build, support transitions, recruit and inform.', 'We frame, deliver, accompany, select and stay informed.')
    .replace('<head>', '<head>\n<link rel="icon" href="/favicon.svg" type="image/svg+xml">')
  return EDITORIAL.reduce((out, [from, to]) => out.replaceAll(from, to), harmonised)
}
