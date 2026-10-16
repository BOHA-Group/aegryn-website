'use client'

/**
 * Savoir-faire de La Boutique : toutes les compétences mobilisées, une fiche par phase du
 * cycle de vie. Les fiches se déploient au passage de la souris (ou au toucher), comme les
 * fiches Cadrer de l'accueil.
 */
import { useEffect, useState } from 'react'
import { Plus } from 'lucide-react'
import {
  CYCLE_LABELS, ITEMS, PHASES, THEME_LABELS,
  type Lang, type Theme,
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
  const [hovered, setHovered] = useState<string | null>(null)
  const [pinned, setPinned] = useState<string | null>(null)

  /* Lien depuis une page cycle : /boutique#savoir-faire-<cycle> amène à la section */
  useEffect(() => {
    const apply = () => {
      if (/^#savoir-faire(-.+)?$/.test(window.location.hash)) document.getElementById('savoir-faire')?.scrollIntoView()
    }
    apply()
    window.addEventListener('hashchange', apply)
    return () => window.removeEventListener('hashchange', apply)
  }, [])

  const rows = PHASES.map(ph => ({ ph, items: ITEMS.filter(it => it.phase === ph.key) })).filter(r => r.items.length > 0)

  return (
    <div>
      <div className="grid grid-cols-1 gap-px md:grid-cols-2 lg:grid-cols-3">
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
