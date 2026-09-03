'use client'

import { useEffect, useRef, useState } from 'react'

interface Layer { key: string; title: string; desc: string }
interface Props { layers: Layer[]; verticalsLabel: string }

const META: Record<string, { color: string; tag: string }> = {
  knowledge: { color: '#8B9EC4', tag: 'Graphe de connaissances · Mémoire organisationnelle' },
  ai:        { color: '#6EC6A0', tag: 'Modèles IA souverains · On-premise ou Cloud CH/EU' },
  data:      { color: '#5B8AF0', tag: 'Ingestion · Normalisation · Stockage maîtrisé' },
}

const CORE_ORDER = ['knowledge', 'ai', 'data']
const VERTICALS = ['FinTech', 'HealthTech', 'PropTech', 'LegalTech', 'HRTech']
const APPS = ['Analyse contractuelle', 'Scoring de risque', 'Conformité réglementaire', 'Intelligence documentaire']

// Dependency labels between layers (top→bottom direction)
const DEP_LABEL: Record<string, string> = {
  knowledge: 'enrichit',
  ai:        'traite',
}

export function PlatformArchitectureDiagram({ layers, verticalsLabel }: Props) {
  const [active, setActive] = useState<string | null>(null)
  const [pulse, setPulse] = useState(0)
  const [visible, setVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const govLayer = layers.find(l => l.key === 'governance')
  const coreLayers = CORE_ORDER.map(k => layers.find(l => l.key === k)).filter(Boolean) as Layer[]
  const display = coreLayers.length === 3 ? coreLayers : layers.filter(l => l.key !== 'governance')

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true) }, { threshold: 0.1 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])

  useEffect(() => {
    if (!visible) return
    const id = setInterval(() => setPulse(p => (p + 1) % display.length), 900)
    return () => clearInterval(id)
  }, [visible, display.length])

  const fadeIn = (delay: number) => ({
    opacity: visible ? 1 : 0,
    transition: `opacity 0.45s ease ${delay}s`,
  })

  return (
    <div ref={ref} className="flex justify-center py-4 select-none">
      <div className="w-full max-w-2xl">

        {/* ── ROW 1 : Applications + Verticals (même niveau) ── */}
        <div className="flex gap-2 mb-1" style={fadeIn(0)}>
          {/* Applications */}
          <div className="flex-1 border border-white/20 bg-white/5 px-4 py-3">
            <p className="font-mono text-[7px] tracking-[0.22em] uppercase text-white/35 mb-1.5">Applications métier</p>
            <div className="flex flex-wrap gap-x-3 gap-y-1">
              {APPS.map(a => (
                <span key={a} className="font-mono text-[9px] tracking-[0.1em] text-white/60">{a}</span>
              ))}
            </div>
          </div>
          {/* Separator + label */}
          <div className="flex flex-col items-center justify-center px-1">
            <div className="w-px h-full bg-white/10" />
            <span className="font-mono text-[7px] text-white/20 rotate-0 whitespace-nowrap my-1">packagées →</span>
            <div className="w-px h-full bg-white/10" />
          </div>
          {/* Verticals */}
          <div className="border border-white/15 bg-white/4 px-4 py-3">
            <p className="font-mono text-[7px] tracking-[0.22em] uppercase text-white/35 mb-1.5">{verticalsLabel}</p>
            <div className="flex flex-col gap-0.5">
              {VERTICALS.map(v => (
                <span key={v} className="font-mono text-[9px] tracking-[0.1em] text-white/50">{v}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Bidirectional arrow: apps ↕ platform */}
        <div className="flex items-center gap-2 px-4 py-1" style={fadeIn(0.1)}>
          <svg width="12" height="20" viewBox="0 0 12 20" fill="none">
            <polyline points="3,5 6,1 9,5" stroke="rgba(255,255,255,0.3)" strokeWidth="1" fill="none"/>
            <line x1="6" y1="1" x2="6" y2="19" stroke="rgba(255,255,255,0.2)" strokeWidth="1"/>
            <polyline points="3,15 6,19 9,15" stroke="rgba(255,255,255,0.3)" strokeWidth="1" fill="none"/>
          </svg>
          <span className="font-mono text-[7px] tracking-[0.1em] text-white/25">
            les apps consomment les couches · écrivent dans la Data Layer
          </span>
        </div>

        {/* ── ROW 2 : Governance (transversale) + Couches core ── */}
        <div className="flex gap-0" style={fadeIn(0.15)}>

          {/* Governance — barre latérale transversale */}
          {govLayer && (
            <div
              className="relative flex flex-col items-center justify-center cursor-pointer transition-all duration-200 shrink-0"
              style={{
                width: 36,
                background: active === 'governance' ? '#C4A88218' : 'transparent',
                borderTop: '1px solid #C4A88250',
                borderLeft: '1px solid #C4A88250',
                borderBottom: '1px solid #C4A88250',
              }}
              onMouseEnter={() => setActive('governance')}
              onMouseLeave={() => setActive(null)}
            >
              <p
                className="font-mono text-[7px] tracking-[0.18em] uppercase font-semibold"
                style={{
                  color: '#C4A882',
                  writingMode: 'vertical-rl',
                  transform: 'rotate(180deg)',
                  opacity: 0.85,
                }}
              >
                {govLayer.title}
              </p>
              {/* Tooltip on hover */}
              {active === 'governance' && (
                <div className="absolute left-10 top-1/2 -translate-y-1/2 z-10 w-52 border border-[#C4A882]/40 bg-ag-navy p-3">
                  <p className="font-mono text-[7px] tracking-[0.12em] uppercase text-[#C4A882] mb-1">Encadre toutes les couches</p>
                  <p className="font-sans text-[10px] text-white/60 leading-relaxed">{govLayer.desc}</p>
                </div>
              )}
            </div>
          )}

          {/* Core layers stack */}
          <div className="flex-1 flex flex-col gap-0">
            {display.map((layer, i) => {
              const m = META[layer.key] ?? { color: '#888', tag: '' }
              const isOn = active === layer.key
              const isPulse = pulse === i
              const dep = DEP_LABEL[layer.key]
              return (
                <div key={layer.key} className="flex flex-col">
                  <div
                    className="relative border-t border-r border-b px-4 py-3 cursor-pointer transition-all duration-200"
                    style={{
                      borderColor: isPulse || isOn ? m.color + '80' : m.color + '30',
                      background: isOn ? m.color + '15' : isPulse ? m.color + '08' : 'transparent',
                      opacity: visible ? 1 : 0,
                      transform: visible ? 'none' : 'translateX(8px)',
                      transition: `opacity 0.4s ease ${i * 0.09 + 0.2}s, transform 0.4s ease ${i * 0.09 + 0.2}s, border-color 0.2s, background 0.2s`,
                    }}
                    onMouseEnter={() => setActive(layer.key)}
                    onMouseLeave={() => setActive(null)}
                  >
                    {/* left pulse bar */}
                    <div className="absolute left-0 top-0 bottom-0 w-0.5 transition-all duration-300"
                      style={{
                        background: m.color,
                        opacity: isPulse || isOn ? 1 : 0.25,
                        boxShadow: isPulse ? `0 0 6px ${m.color}` : 'none',
                      }} />
                    <div className="pl-3 flex items-center justify-between gap-4">
                      <div className="shrink-0">
                        <p className="font-mono text-[10px] tracking-[0.18em] uppercase font-semibold" style={{ color: m.color }}>
                          {layer.title}
                        </p>
                        <p className="font-mono text-[8px] text-white/30 mt-0.5">{m.tag}</p>
                      </div>
                      <p className="font-sans text-[11px] text-white/50 leading-relaxed text-right transition-opacity duration-200"
                        style={{ opacity: isOn ? 1 : 0.3 }}>
                        {layer.desc}
                      </p>
                    </div>
                  </div>

                  {/* Arrow + label between layers */}
                  {i < display.length - 1 && dep && (
                    <div className="flex items-center gap-1.5 pl-4 py-0.5">
                      <svg width="10" height="12" viewBox="0 0 10 12" className="shrink-0">
                        <line x1="5" y1="0" x2="5" y2="8" stroke={m.color} strokeWidth="1"
                          strokeOpacity={isPulse ? 0.85 : 0.2}/>
                        <polyline points="2,6 5,10 8,6" stroke={m.color} strokeWidth="1" fill="none"
                          strokeOpacity={isPulse ? 0.85 : 0.2}/>
                      </svg>
                      <span className="font-mono text-[7px] tracking-[0.08em] transition-opacity duration-300"
                        style={{ color: m.color, opacity: isPulse ? 0.7 : 0.18 }}>
                        {dep}
                      </span>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

      </div>
    </div>
  )
}
