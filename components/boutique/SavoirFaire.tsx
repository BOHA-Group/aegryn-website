'use client'

/**
 * Savoir-faire de La Boutique : toutes les compétences mobilisées, une fiche par phase du
 * cycle de vie. Les fiches se déploient au passage de la souris (ou au toucher), comme les
 * fiches Cadrer de l'accueil ; filtres compacts par cycle et par thème.
 */
import { useEffect, useMemo, useState } from 'react'
import { Plus } from 'lucide-react'
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
  const [hovered, setHovered] = useState<string | null>(null)
  const [pinned, setPinned] = useState<string | null>(null)

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
    `rounded-full px-3.5 py-1.5 font-sans text-[12px] font-medium transition-colors ${active ? 'bg-ag-navy text-white' : 'bg-ag-navy/[0.05] text-ag-gray hover:bg-ag-navy/10 hover:text-ag-black'}`

  return (
    <div>
      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-1.5" role="group" aria-label={SF_UI.byCycle[lang]}>
          <span className="mr-2 font-mono text-[10px] uppercase tracking-[0.22em] text-ag-gray-light">{SF_UI.byCycle[lang]}</span>
          <button type="button" className={chip(cycle === 'all')} onClick={() => setCycle('all')}>{SF_UI.allCycles[lang]}</button>
          {CYCLES.map(c => (
            <button key={c} type="button" className={chip(cycle === c)} onClick={() => setCycle(c)}>{CYCLE_LABELS[c][lang]}</button>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-1.5" role="group" aria-label={SF_UI.byTheme[lang]}>
          <span className="mr-2 font-mono text-[10px] uppercase tracking-[0.22em] text-ag-gray-light">{SF_UI.byTheme[lang]}</span>
          <button type="button" className={chip(theme === 'all')} onClick={() => setTheme('all')}>{SF_UI.allThemes[lang]}</button>
          {THEMES.map(th => (
            <button key={th} type="button" className={chip(theme === th)} onClick={() => setTheme(th)}>{THEME_LABELS[th][lang]}</button>
          ))}
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-px md:grid-cols-2 lg:grid-cols-3">
        {rows.map(({ ph, items }) => {
          const expanded = hovered === ph.key || pinned === ph.key
          return (
            <div
              key={ph.key}
              className="flex cursor-pointer flex-col gap-3 bg-ag-white p-6"
              onMouseEnter={() => { if (window.matchMedia('(hover: hover)').matches) setHovered(ph.key) }}
              onMouseLeave={() => setHovered(null)}
              onClick={() => setPinned(pinned === ph.key ? null : ph.key)}
              aria-expanded={expanded}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-mono text-[11px] tracking-[0.2em] text-ag-apex-ink">{String(PHASES.findIndex(p => p.key === ph.key) + 1).padStart(2, '0')}</p>
                  <h3 className="mt-1 font-sans font-bold tracking-[-0.02em] text-ag-black" style={{ fontSize: 'clamp(18px,1.5vw,22px)' }}>{ph.label[lang]}</h3>
                </div>
                <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border transition-colors duration-300 ${expanded ? 'border-ag-apex bg-ag-apex/10 text-ag-apex-ink' : 'border-ag-border text-ag-gray-light'}`} aria-hidden="true">
                  <Plus size={13} strokeWidth={2} className={`transition-transform duration-300 ${expanded ? 'rotate-45' : ''}`} />
                </span>
              </div>
              <p className="text-[15px] leading-snug text-ag-gray">{ph.desc[lang]}</p>
              <p className="flex flex-wrap gap-x-3 gap-y-1 font-mono text-[10px] uppercase tracking-[0.16em] text-ag-gray-light">
                {ph.cycles.map(c => <span key={c}>{CYCLE_LABELS[c][lang]}</span>)}
              </p>
              <div
                className="grid transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
                style={{ gridTemplateRows: expanded ? '1fr' : '0fr', opacity: expanded ? 1 : 0 }}
              >
                <ul className="min-h-0 space-y-2 overflow-hidden">
                  {items.map((it, k) => (
                    <li key={k} className="flex items-start gap-2.5 text-[13px] leading-snug text-ag-black">
                      <span className="mt-[5px] h-1 w-1 shrink-0 rounded-full bg-ag-apex" />
                      <span>
                        {it.text[lang]}
                        <span className={`ml-2 rounded-full px-2 py-0.5 font-mono text-[8px] uppercase tracking-[0.12em] align-middle ${THEME_STYLE[it.theme]}`}>{THEME_LABELS[it.theme][lang]}</span>
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
