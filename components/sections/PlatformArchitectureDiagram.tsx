'use client'

import { useEffect, useRef, useState } from 'react'

const LAYERS = [
  {
    key: 'governance',
    label: 'Governance Layer',
    sublabel: 'Audit · RBAC · AI Act · NIS2 · DORA · LPD',
    color: '#C4A882',
    bg: 'bg-[#C4A882]/10',
    border: 'border-[#C4A882]/40',
    text: 'text-[#C4A882]',
    index: 0,
  },
  {
    key: 'knowledge',
    label: 'Knowledge Layer',
    sublabel: 'Graphe · Index sémantique · Mémoire org.',
    color: '#8B9EC4',
    bg: 'bg-[#8B9EC4]/10',
    border: 'border-[#8B9EC4]/40',
    text: 'text-[#8B9EC4]',
    index: 1,
  },
  {
    key: 'ai',
    label: 'AI Layer',
    sublabel: 'On-premise · Cloud CH/EU · Zéro fuite',
    color: '#6EC6A0',
    bg: 'bg-[#6EC6A0]/10',
    border: 'border-[#6EC6A0]/40',
    text: 'text-[#6EC6A0]',
    index: 2,
  },
  {
    key: 'data',
    label: 'Data Layer',
    sublabel: 'Ingestion · Normalisation · Stockage maîtrisé',
    color: '#5B8AF0',
    bg: 'bg-[#5B8AF0]/10',
    border: 'border-[#5B8AF0]/40',
    text: 'text-[#5B8AF0]',
    index: 3,
  },
]

const VERTICALS = [
  { label: 'FinTech', icon: '₣' },
  { label: 'HealthTech', icon: '✚' },
  { label: 'PropTech', icon: '⌂' },
  { label: 'LegalTech', icon: '⚖' },
  { label: 'HRTech', icon: '◈' },
]

const DOMAINS = ['ContractAI', 'DataRoom', 'RiskEngine', 'Compliance', 'KnowledgeBase']

export function PlatformArchitectureDiagram() {
  const [active, setActive] = useState<string | null>(null)
  const [flowStep, setFlowStep] = useState(0)
  const [visible, setVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true) },
      { threshold: 0.2 }
    )
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])

  useEffect(() => {
    if (!visible) return
    const id = setInterval(() => {
      setFlowStep(s => (s + 1) % (LAYERS.length + 1))
    }, 1200)
    return () => clearInterval(id)
  }, [visible])

  return (
    <div ref={ref} className="w-full mt-10 mb-4 select-none">

      {/* Top: vertical applications */}
      <div
        className="flex gap-2 justify-center mb-6"
        style={{ opacity: visible ? 1 : 0, transition: 'opacity 0.6s ease' }}
      >
        {DOMAINS.map((d, i) => (
          <div
            key={d}
            className="flex-1 min-w-0 border border-white/20 bg-white/5 px-2 py-2.5 text-center"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? 'translateY(0)' : 'translateY(-12px)',
              transition: `opacity 0.5s ease ${i * 0.08}s, transform 0.5s ease ${i * 0.08}s`,
            }}
          >
            <p className="font-mono text-[9px] tracking-[0.14em] uppercase text-white/50 truncate">{d}</p>
          </div>
        ))}
      </div>

      {/* Arrow down into layers */}
      <div className="flex justify-center mb-4">
        <div className="flex flex-col items-center gap-0.5">
          {[0,1,2].map(i => (
            <div
              key={i}
              className="w-px bg-white/20"
              style={{
                height: 8,
                opacity: visible ? (flowStep % 4 === i ? 1 : 0.25) : 0,
                transition: 'opacity 0.3s ease',
              }}
            />
          ))}
          <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-white/30" />
        </div>
      </div>

      {/* Layers stack */}
      <div className="flex flex-col gap-2">
        {LAYERS.map((layer, i) => {
          const isActive = active === layer.key
          const isFlowing = flowStep === i

          return (
            <div
              key={layer.key}
              className={`
                relative border cursor-pointer transition-all duration-300
                ${layer.border}
                ${isActive ? layer.bg : 'bg-white/[0.03]'}
              `}
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? 'translateX(0)' : 'translateX(-20px)',
                transition: `opacity 0.5s ease ${i * 0.12 + 0.2}s, transform 0.5s ease ${i * 0.12 + 0.2}s, background 0.3s`,
              }}
              onMouseEnter={() => setActive(layer.key)}
              onMouseLeave={() => setActive(null)}
            >
              {/* Pulse bar on left when flowing */}
              <div
                className="absolute left-0 top-0 bottom-0 w-0.5 transition-all duration-300"
                style={{
                  backgroundColor: layer.color,
                  opacity: isFlowing ? 1 : 0.2,
                  boxShadow: isFlowing ? `0 0 8px ${layer.color}` : 'none',
                }}
              />

              <div className="px-6 py-4 flex items-center gap-6">
                {/* Layer label */}
                <div className="shrink-0 w-44">
                  <p className={`font-mono text-[11px] tracking-[0.22em] uppercase font-semibold ${layer.text}`}>
                    {layer.label}
                  </p>
                  <p className="font-mono text-[9px] tracking-[0.1em] text-white/40 mt-0.5">{layer.sublabel}</p>
                </div>

                {/* Animated flow dots */}
                <div className="flex-1 flex items-center gap-1 overflow-hidden">
                  {Array.from({ length: 12 }).map((_, j) => (
                    <div
                      key={j}
                      className="rounded-full shrink-0 transition-all duration-200"
                      style={{
                        width: 5,
                        height: 5,
                        backgroundColor: layer.color,
                        opacity: isFlowing
                          ? (j === flowStep % 12 || j === (flowStep + 3) % 12 || j === (flowStep + 7) % 12) ? 0.9 : 0.12
                          : (isActive ? 0.3 : 0.08),
                        transform: `scale(${isFlowing && j === flowStep % 12 ? 1.4 : 1})`,
                      }}
                    />
                  ))}
                </div>

                {/* Right badge */}
                <div
                  className="shrink-0 px-2 py-0.5 border text-[8px] font-mono tracking-[0.14em] uppercase transition-opacity"
                  style={{
                    borderColor: layer.color + '40',
                    color: layer.color,
                    opacity: isActive ? 1 : 0.4,
                  }}
                >
                  {i === 0 ? 'SHIELD' : i === 1 ? 'GRAPH' : i === 2 ? 'INFERENCE' : 'STORAGE'}
                </div>
              </div>

              {/* Dependency arrows between layers */}
              {i < LAYERS.length - 1 && (
                <div className="absolute -bottom-2 left-6 flex items-center gap-1 z-10">
                  <div
                    className="w-3 h-px transition-all duration-300"
                    style={{ backgroundColor: layer.color, opacity: isFlowing ? 0.8 : 0.2 }}
                  />
                  <div
                    className="w-0 h-0 border-t-2 border-b-2 border-l-3 border-t-transparent border-b-transparent transition-all duration-300"
                    style={{
                      borderLeftColor: layer.color,
                      opacity: isFlowing ? 0.8 : 0.2,
                    }}
                  />
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Bottom: verticals */}
      <div className="mt-6 border-t border-white/10 pt-5">
        <p className="font-mono text-[8px] tracking-[0.22em] uppercase text-white/30 mb-3 text-center">Marchés verticaux packagés</p>
        <div className="flex gap-2 justify-center flex-wrap">
          {VERTICALS.map((v, i) => (
            <div
              key={v.label}
              className="border border-white/15 bg-white/5 px-4 py-2 flex items-center gap-2 cursor-default hover:border-white/30 transition-colors"
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? 'translateY(0)' : 'translateY(10px)',
                transition: `opacity 0.4s ease ${i * 0.07 + 0.8}s, transform 0.4s ease ${i * 0.07 + 0.8}s`,
              }}
            >
              <span className="font-mono text-[14px] text-white/40">{v.icon}</span>
              <span className="font-mono text-[9px] tracking-[0.16em] uppercase text-white/60">{v.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="mt-6 flex flex-wrap gap-4 justify-center">
        {[
          { color: '#5B8AF0', label: 'Données brutes' },
          { color: '#6EC6A0', label: 'Traitement IA' },
          { color: '#8B9EC4', label: 'Connaissance' },
          { color: '#C4A882', label: 'Gouvernance' },
        ].map(({ color, label }) => (
          <div key={label} className="flex items-center gap-1.5">
            <div className="w-3 h-px" style={{ backgroundColor: color }} />
            <span className="font-mono text-[8px] tracking-[0.1em] text-white/40">{label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
