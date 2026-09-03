'use client'

import { useEffect, useRef, useState } from 'react'

interface Layer {
  key: string
  title: string
  desc: string
  tag?: string
  dep?: string | null
}

interface Props {
  layers: Layer[]
  apps: string[]
  verticalsLabel: string
  appsLabel: string
  packagedLabel: string
  flowLabel: string
  govTooltipLabel: string
}

const COLOR: Record<string, string> = {
  knowledge: '#A8C4E8',
  ai:        '#5DD9A4',
  data:      '#7BA8F8',
}

const CORE_ORDER = ['knowledge', 'ai', 'data']
const VERTICALS  = ['FinTech', 'HealthTech', 'PropTech', 'LegalTech', 'HRTech']

export function PlatformArchitectureDiagram({
  layers, apps, verticalsLabel, appsLabel, packagedLabel, flowLabel, govTooltipLabel,
}: Props) {
  const [active, setActive] = useState<string | null>(null)
  const [pulse, setPulse]   = useState(0)
  const [visible, setVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const govLayer   = layers.find(l => l.key === 'governance')
  const coreLayers = CORE_ORDER.map(k => layers.find(l => l.key === k)).filter(Boolean) as Layer[]
  const display    = coreLayers.length === 3 ? coreLayers : layers.filter(l => l.key !== 'governance')

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
      <div className="w-full max-w-3xl">

        {/* ── ROW 1 : Applications (3 cols) + Verticals ── */}
        <div className="flex flex-col md:flex-row gap-2 mb-1" style={fadeIn(0)}>

          {/* Applications — grille 3 colonnes numérotées par colonne */}
          <div className="flex-1 border border-white/30 bg-white/10 px-4 py-4">
            <p className="font-mono text-[10px] tracking-[0.24em] uppercase text-white/60 mb-3 font-semibold">
              {appsLabel}
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-2">
              {[0, 1, 2].map(col => {
                const start = col === 0 ? 0 : col === 1 ? 4 : 7
                const end   = col === 0 ? 4 : col === 1 ? 7 : 10
                return (
                  <div key={col} className="flex flex-col gap-2">
                    {apps.slice(start, end).map((a, j) => (
                      <div key={a} className="flex items-start gap-1.5">
                        <span className="font-mono text-[10px] text-white/35 shrink-0">{String(start + j + 1).padStart(2, '0')}</span>
                        <span className="font-mono text-[10px] tracking-[0.04em] text-white/80 leading-tight">{a}</span>
                      </div>
                    ))}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Separator */}
          <div className="hidden md:flex flex-col items-center justify-center px-1">
            <div className="w-px flex-1 bg-white/15" />
            <span className="font-mono text-[10px] text-white/35 whitespace-nowrap my-2">{packagedLabel}</span>
            <div className="w-px flex-1 bg-white/15" />
          </div>

          {/* Verticals */}
          <div className="border border-white/25 bg-white/5 px-4 py-4 md:min-w-[130px]">
            <p className="font-mono text-[10px] tracking-[0.24em] uppercase text-white/60 mb-3 font-semibold">
              {verticalsLabel}
            </p>
            <div className="flex md:flex-col flex-wrap gap-x-3 gap-y-1.5">
              {VERTICALS.map(v => (
                <span key={v} className="font-mono text-[10px] tracking-[0.08em] text-white/75">{v}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Bidirectional arrow */}
        <div className="flex items-center gap-2 px-4 py-1.5" style={fadeIn(0.1)}>
          <svg width="12" height="20" viewBox="0 0 12 20" fill="none">
            <polyline points="3,5 6,1 9,5" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" fill="none"/>
            <line x1="6" y1="1" x2="6" y2="19" stroke="rgba(255,255,255,0.35)" strokeWidth="1.5"/>
            <polyline points="3,15 6,19 9,15" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" fill="none"/>
          </svg>
          <span className="font-mono text-[10px] tracking-[0.1em] text-white/50">{flowLabel}</span>
        </div>

        {/* ── ROW 2 : Governance (transversale) + Couches core ── */}
        <div className="flex gap-0" style={fadeIn(0.15)}>

          {/* Governance — barre verticale, texte bas→haut sur 1 ligne */}
          {govLayer && (
            <div
              className="relative flex items-center justify-center cursor-pointer transition-all duration-200 shrink-0 py-3 px-1.5"
              style={{
                background: active === 'governance' ? '#C4A88222' : 'transparent',
                borderTop: '1px solid #C4A88270',
                borderLeft: '1px solid #C4A88270',
                borderBottom: '1px solid #C4A88270',
              }}
              onMouseEnter={() => setActive('governance')}
              onMouseLeave={() => setActive(null)}
            >
              <p
                className="font-mono text-[10px] tracking-[0.2em] uppercase font-bold whitespace-nowrap"
                style={{
                  color: '#C4A882',
                  writingMode: 'vertical-rl',
                  transform: 'rotate(180deg)',
                }}
              >
                {govLayer.title}
              </p>
              {active === 'governance' && (
                <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 z-20 w-56 border border-[#C4A882]/50 bg-ag-navy p-3 shadow-xl">
                  <p className="font-mono text-[10px] tracking-[0.14em] uppercase text-[#C4A882] mb-1.5 font-semibold">{govTooltipLabel}</p>
                  <p className="font-sans text-[10px] text-white/75 leading-relaxed">{govLayer.desc}</p>
                </div>
              )}
            </div>
          )}

          {/* Core layers */}
          <div className="flex-1 flex flex-col gap-0">
            {display.map((layer, i) => {
              const color   = COLOR[layer.key] ?? '#aaa'
              const isOn    = active === layer.key
              const isPulse = pulse === i
              return (
                <div key={layer.key} className="flex flex-col">
                  <div
                    className="relative border-t border-r border-b px-4 md:px-5 py-3 md:py-4 cursor-pointer transition-all duration-200"
                    style={{
                      borderColor: isPulse || isOn ? color + 'AA' : color + '45',
                      background: isOn ? color + '20' : isPulse ? color + '10' : 'rgba(255,255,255,0.02)',
                      opacity: visible ? 1 : 0,
                      transform: visible ? 'none' : 'translateX(8px)',
                      transition: `opacity 0.4s ease ${i * 0.09 + 0.2}s, transform 0.4s ease ${i * 0.09 + 0.2}s, border-color 0.2s, background 0.2s`,
                    }}
                    onMouseEnter={() => setActive(layer.key)}
                    onMouseLeave={() => setActive(null)}
                  >
                    <div className="absolute left-0 top-0 bottom-0 w-0.5 transition-all duration-300"
                      style={{
                        background: color,
                        opacity: isPulse || isOn ? 1 : 0.4,
                        boxShadow: isPulse ? `0 0 8px ${color}` : 'none',
                      }} />
                    <div className="pl-3 flex flex-col md:flex-row md:items-center justify-between gap-1 md:gap-4">
                      <div className="shrink-0">
                        <p className="font-mono text-[10px] tracking-[0.2em] uppercase font-bold" style={{ color }}>
                          {layer.title}
                        </p>
                        {layer.tag && <p className="font-mono text-[10px] text-white/55 mt-0.5">{layer.tag}</p>}
                      </div>
                      <p className="font-sans text-[10px] text-white/65 leading-relaxed md:text-right transition-opacity duration-200"
                        style={{ opacity: isOn ? 1 : 0.5 }}>
                        {layer.desc}
                      </p>
                    </div>
                  </div>

                  {/* Arrow + dep label between layers */}
                  {i < display.length - 1 && layer.dep && (
                    <div className="flex items-center gap-2 pl-4 py-0.5">
                      <svg width="10" height="12" viewBox="0 0 10 12" className="shrink-0">
                        <line x1="5" y1="0" x2="5" y2="8" stroke={color} strokeWidth="1.5"
                          strokeOpacity={isPulse ? 1 : 0.35}/>
                        <polyline points="2,6 5,10 8,6" stroke={color} strokeWidth="1.5" fill="none"
                          strokeOpacity={isPulse ? 1 : 0.35}/>
                      </svg>
                      <span className="font-mono text-[10px] tracking-[0.1em] transition-opacity duration-300"
                        style={{ color, opacity: isPulse ? 0.9 : 0.4 }}>
                        {layer.dep}
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
