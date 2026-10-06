import PartnersCarousel from './PartnersCarousel'

type Props = {
  label: string
  badge: string
  title: string
  desc: string
  note: string
}

/* Section partenaires réutilisable (/network, /investisseurs, /grade/partners) */
export default function PartnersSection({ label, badge, title, desc, note }: Props) {
  return (
    <section className="border-b border-ag-border">
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-20">
        <div className="flex items-center gap-4 mb-8">
          <span className="rounded-lg font-mono text-[10px] uppercase tracking-[0.28em] text-ag-gray-light border border-ag-border px-3 py-1">
            {label}
          </span>
          <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-ag-apex-ink">
            {badge}
          </span>
        </div>
        <h2
          className="font-sans font-bold text-ag-black tracking-[-0.02em] leading-[1.15] max-w-2xl mb-6"
          style={{ fontSize: 'clamp(26px,3vw,44px)' }}
        >
          {title}
        </h2>
        <p className="text-[14px] text-ag-gray leading-relaxed max-w-xl mb-6">
          {desc}
        </p>
        <p className="font-sans text-[11px] text-ag-gray-light italic">
          {note}
        </p>
        <div className="mt-10">
          <PartnersCarousel />
        </div>
      </div>
    </section>
  )
}
