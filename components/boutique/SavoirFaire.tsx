'use client'

/**
 * Savoir-faire de La Boutique : toutes les compétences mobilisées, par phase du cycle
 * de vie, avec filtres par cycle et par thème (norme du projet). Présentation aérée :
 * des phases en lignes, des pastilles pour les thèmes, aucun trait de séparation.
 */
import { useEffect, useMemo, useState } from 'react'
import {
  CYCLES, CYCLE_LABELS, ITEMS, PHASES, SF_UI, THEMES, THEME_LABELS,
  type Cycle, type Lang, type Theme,
} from '@/content/boutique/savoirFaire'

const THEME_STYLE: Record<Theme, string> = {
  strategy:   'bg-ag-apex/15 text-ag-apex-ink',
  compliance: 'bg-ag-navy/[0.07] text-ag-navy',
  tech:       'bg-sky-500/10 text-sky-800',
  talent:     'bg-amber-500/12 text-amber-800',
  reprise:    'bg-violet-500/10 text-violet-800',
}

export function SavoirFaire({ locale }: { locale: string }) {
  const lang = (['fr', 'en', 'de', 'es', 'it', 'nl'].includes(locale) ? locale : 'en') as Lang
  const [cycle, setCycle] = useState<Cycle | 'all'>('all')
  const [theme, setTheme] = useState<Theme | 'all'>('all')

  /* Lien depuis une page cycle : /boutique#savoir-faire-<cycle> présélectionne le cycle */
  useEffect(() => {
    const apply = () => {
      const m = window.location.hash.match(/^#savoir-faire-(.+)$/)
      if (m && (CYCLES as readonly string[]).includes(m[1])) {
        setCycle(m[1] as Cycle)
        document.getElementById('savoir-faire')?.scrollIntoView()
      }
    }
    apply()
    window.addEventListener('hashchange', apply)
    return () => window.removeEventListener('hashchange', apply)
  }, [])

  const rows = useMemo(() => PHASES.map(ph => {
    const items = ITEMS.filter(it => {
      if (it.phase !== ph.key) return false
      if (theme !== 'all' && it.theme !== theme) return false
      if (cycle !== 'all') return (it.cycles ?? ph.cycles).includes(cycle)
      return true
    })
    return { ph, items }
  }).filter(r => r.items.length > 0), [cycle, theme])

  const chip = (active: boolean) =>
    `rounded-full px-4 py-2 font-sans text-[13px] font-medium transition-colors ${active ? 'bg-ag-navy text-white' : 'bg-ag-navy/[0.05] text-ag-gray hover:bg-ag-navy/10 hover:text-ag-black'}`

  return (
    <div>
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-2" role="group" aria-label={SF_UI.byCycle[lang]}>
          <span className="mr-2 font-mono text-[10px] uppercase tracking-[0.22em] text-ag-gray-light">{SF_UI.byCycle[lang]}</span>
          <button type="button" className={chip(cycle === 'all')} onClick={() => setCycle('all')}>{SF_UI.allCycles[lang]}</button>
          {CYCLES.map(c => (
            <button key={c} type="button" className={chip(cycle === c)} onClick={() => setCycle(c)}>{CYCLE_LABELS[c][lang]}</button>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-2" role="group" aria-label={SF_UI.byTheme[lang]}>
          <span className="mr-2 font-mono text-[10px] uppercase tracking-[0.22em] text-ag-gray-light">{SF_UI.byTheme[lang]}</span>
          <button type="button" className={chip(theme === 'all')} onClick={() => setTheme('all')}>{SF_UI.allThemes[lang]}</button>
          {THEMES.map(th => (
            <button key={th} type="button" className={chip(theme === th)} onClick={() => setTheme(th)}>{THEME_LABELS[th][lang]}</button>
          ))}
        </div>
      </div>

      <div className="mt-14 space-y-12 md:space-y-16">
        {rows.map(({ ph, items }, i) => (
          <div key={ph.key} className="grid gap-5 md:grid-cols-[minmax(0,280px)_1fr] md:gap-14">
            <div>
              <p className="font-mono text-[11px] tracking-[0.2em] text-ag-apex-ink">{String(PHASES.findIndex(p => p.key === ph.key) + 1).padStart(2, '0')}</p>
              <h3 className="mt-1 font-sans text-[26px] font-bold tracking-[-0.02em] text-ag-black">{ph.label[lang]}</h3>
              <p className="mt-1 text-[15px] leading-relaxed text-ag-gray">{ph.desc[lang]}</p>
              <p className="mt-3 flex flex-wrap gap-x-3 gap-y-1 font-mono text-[10px] uppercase tracking-[0.16em] text-ag-gray-light">
                {ph.cycles.map(c => <span key={c}>{CYCLE_LABELS[c][lang]}</span>)}
              </p>
            </div>
            <ul className="grid content-start gap-3 sm:grid-cols-2" data-row={i}>
              {items.map((it, k) => (
                <li key={k} className="flex flex-col items-start gap-2 rounded-2xl bg-ag-off-white px-5 py-4">
                  <span className={`rounded-full px-2.5 py-0.5 font-mono text-[9px] uppercase tracking-[0.14em] ${THEME_STYLE[it.theme]}`}>{THEME_LABELS[it.theme][lang]}</span>
                  <span className="text-[15px] leading-snug text-ag-black">{it.text[lang]}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  )
}
