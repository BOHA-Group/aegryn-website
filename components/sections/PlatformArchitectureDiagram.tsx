'use client'

import { useEffect, useRef, useState } from 'react'

interface Layer { key: string; title: string; desc: string }

interface Props {
  layers: Layer[]
  verticalsLabel: string
}

const LAYER_META: Record<string, { color: string; badge: string; sublabel: string }> = {
  data:       { color: '#5B8AF0', badge: 'STORAGE',   sublabel: 'Ingestion · Normalisation · Stockage' },
  ai:         { color: '#6EC6A0', badge: 'INFERENCE',  sublabel: 'On-premise · Cloud CH/EU · Zéro fuite' },
  knowledge:  { color: '#8B9EC4', badge: 'GRAPH',      sublabel: 'Sémantique · Mémoire · Index' },
  governance: { color: '#C4A882', badge: 'SHIELD',     sublabel: 'RBAC · AI Act · NIS2 · DORA · LPD' },
}

const VERTICALS = ['FinTech', 'HealthTech', 'PropTech', 'LegalTech', 'HRTech']

const APPS = ['ContractAI', 'DataRoom', 'RiskEngine', 'Compliance', 'KnowledgeBase']

const DEPS: Record<string, string> = {
  ai:         'dépend de → Data',
  knowledge:  'enrichit → AI',
  governance: 'encadre toutes les couches',
}

export function PlatformArchitectureDiagram({ layers, verticalsLabel }: Props) {
  const [active, setActive] = useState<string | null>(null)
  const [pulse, setPulse] = useState(0)
  const [visible, setVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  // ordered bottom-up: data → ai → knowledge → governance
  const ordered = ['data', 'ai', 'knowledge', 'governance']
    .map(k => layers.find(l => l.key === k))
    .filter(Boolean) as Layer[]

  // fallback: if keys don't match, use as-is reversed
  const displayLayers = ordered.length === 4 ? ordered : [...layers].reverse()

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true) },
      { threshold: 0.15 }
    )
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])

  useEffect(() => {
    if (!visible) return
    const id = setInterval(() => setPulse(p => (p + 1) % displayLayers.length), 1000)
    return () => clearInterval(id)
  }, [visible, displayLayers.length])

  return (
    <div ref={ref} className="w-full select-none">

      {/* Row 1: Apps layer */}
      <div className="mb-3">
        <p className="font-mono text-[8px] tracking-[0.2em] uppercase text-white/30 mb-2">Applications métier</p>
        <div className="grid grid-cols-5 gap-1">
          {APPS.map((app, i) => (
            <div
              key={app}
              className="border border-white/15 bg-white/5 px-2 py-2 text-center"
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? 'translateY(0)' : 'translateY(-8px)',
                transition: `opacity 0.4s ease ${i * 0.06}s, transform 0.4s ease ${i * 0.06}s`,
              }}
            >
              <p className="font-mono text-[8px] tracking-[0.1em] text-white/50 truncate">{app}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Connector: apps → layers */}
      <div className="flex justify-center mb-2">
        <div className="w-px h-5 bg-white/20" />
      </div>

      {/* Row 2: Platform layers — bottom to top visually means governance on top */}
      <div className="flex flex-col-reverse gap-0">
        {displayLayers.map((layer, i) => {
          const meta = LAYER_META[layer.key] ?? { color: '#888', badge: '—', sublabel: '' }
          const isActive = active === layer.key
          const isPulsing = pulse === i
          const dep = DEPS[layer.key]

          return (
            <div key={layer.key} className="flex flex-col">
              {/* Dependency connector between layers */}
              {i > 0 && (
                <div className="flex items-center gap-2 px-4 py-1">
                  <div
                    className="w-px transition-all duration-500"
                    style={{
                      height: 16,
                      backgroundColor: meta.color,
                      opacity: isPulsing ? 0.9 : 0.2,
                      boxShadow: isPulsing ? `0 0 6px ${meta.color}` : 'none',
                    }}
                  />
                  {dep && (
                    <span
                      className="font-mono text-[7px] tracking-[0.1em] transition-opacity duration-300"
                      style={{ color: meta.color, opacity: isPulsing ? 0.8 : 0.2 }}
                    >
                      {dep}
                    </span>
                  )}
                </div>
              )}

              {/* Layer row */}
              <div
                className="relative border cursor-pointer transition-all duration-200"
                style={{
                  borderColor: isActive || isPulsing ? meta.color + '80' : meta.color + '30',
                  backgroundColor: isActive ? meta.color + '18' : isPulsing ? meta.color + '0C' : 'transparent',
                  opacity: visible ? 1 : 0,
                  transform: visible ? 'translateX(0)' : 'translateX(-16px)',
                  transition: `opacity 0.45s ease ${i * 0.1 + 0.1}s, transform 0.45s ease ${i * 0.1 + 0.1}s, border-color 0.2s, background 0.2s`,
                }}
                onMouseEnter={() => setActive(layer.key)}
                onMouseLeave={() => setActive(null)}
              >
                {/* Left accent bar */}
                <div
                  className="absolute left-0 top-0 bottom-0 w-0.5"
                  style={{
                    backgroundColor: meta.color,
                    opacity: isActive || isPulsing ? 1 : 0.3,
                    boxShadow: isPulsing ? `0 0 8px ${meta.color}` : 'none',
                    transition: 'opacity 0.2s, box-shadow 0.2s',
                  }}
                />

                <div className="relative pl-5 pr-4 py-3 flex items-center gap-4">
                  {/* Badge */}
                  <span
                    className="shrink-0 font-mono text-[8px] tracking-[0.18em] border px-1.5 py-0.5"
                    style={{ color: meta.color, borderColor: meta.color + '50' }}
                  >
                    {meta.badge}
                  </span>

                  {/* Title + sublabel */}
                  <div className="shrink-0 w-36">
                    <p className="font-mono text-[10px] tracking-[0.18em] uppercase font-semibold" style={{ color: meta.color }}>
                      {layer.title}
                    </p>
                    <p className="font-mono text-[8px] text-white/35 mt-0.5">{meta.sublabel}</p>
                  </div>

                  {/* Description — revealed on hover */}
                  <p
                    className="font-sans text-[11px] text-white/60 leading-relaxed flex-1 transition-opacity duration-200"
                    style={{ opacity: isActive ? 1 : 0.4 }}
                  >
                    {layer.desc}
                  </p>

                  {/* Flow dots */}
                  <div className="shrink-0 flex items-center gap-0.5">
                    {Array.from({ length: 8 }).map((_, j) => (
                      <div
                        key={j}
                        className="rounded-full transition-all duration-150"
                        style={{
                          width: 4, height: 4,
                          backgroundColor: meta.color,
                          opacity: isPulsing
                            ? (j === pulse % 8 || j === (pulse + 3) % 8) ? 1 : 0.1
                            : isActive ? 0.25 : 0.07,
                          transform: `scale(${isPulsing && j === pulse % 8 ? 1.5 : 1})`,
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Connector: layers → verticals */}
      <div className="flex justify-center mt-2 mb-3">
        <div className="w-px h-5 bg-white/20" />
      </div>

      {/* Row 3: Verticals */}
      <div>
        <p className="font-mono text-[8px] tracking-[0.2em] uppercase text-white/30 mb-2">{verticalsLabel}</p>
        <div className="flex gap-2 flex-wrap">
          {VERTICALS.map((v, i) => (
            <div
              key={v}
              className="border border-white/15 bg-white/5 px-3 py-1.5 hover:border-white/30 transition-colors"
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? 'translateY(0)' : 'translateY(8px)',
                transition: `opacity 0.35s ease ${i * 0.06 + 0.5}s, transform 0.35s ease ${i * 0.06 + 0.5}s`,
              }}
            >
              <span className="font-mono text-[9px] tracking-[0.14em] uppercase text-white/55">{v}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
