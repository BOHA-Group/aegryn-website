/**
 * Keep the exported edition's model page aligned with the site's vocabulary.
 * Preserve its anchor IDs, pagination and stored export for existing reader links.
 */
export function prepareMagazineHtml(html: string) {
  const labels: Record<string, string> = {
    Advise: 'Frame', Build: 'Deliver', Navigate: 'Accompany', Recruit: 'Select', Inform: 'Stay informed',
  }
  const model = (block: string) => block
    .replace(/>(Advise|Build|Navigate|Recruit|Inform)</g, (_, label: string) => `>${labels[label]}<`)
    .replace('Durable digital assets, full client ownership. Each asset is designed to enhance company value, pass certification and guarantee technological independence.',
      'Project and programme delivery, from governance to acceptance. We coordinate specialist experts and work with your teams to turn decisions into results.')
  return html
    .replace(/<section id="the-aegryn-model-five-disciplines-one-st"[\s\S]*?<\/section>/g, model)
    .replace(/<div id="p4" class="pg">[\s\S]*?(?=<div id="p5" class="pg">)/g, model)
    .replaceAll('Five disciplines', 'Five ways of working')
    .replace('We advise, build, support transitions, recruit and inform.', 'We frame, deliver, accompany, select and stay informed.')
    .replace('<head>', '<head>\n<link rel="icon" href="/favicon.svg" type="image/svg+xml">')
}
