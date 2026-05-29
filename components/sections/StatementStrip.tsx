import { ArrowUpRight } from 'lucide-react'
import Link from 'next/link'

type Props = {
  label: string
  title: string
  cta: string
  href: string
}

export function StatementStrip({ label, title, cta, href }: Props) {
  return (
    <section className="bg-ag-navy py-32 px-6 md:px-12 border-t border-ag-navy">
      <div className="max-w-7xl mx-auto">
        <p className="font-mono text-[11px] tracking-[0.22em] uppercase text-white/40 mb-6">
          {label}
        </p>
        <h2
          className="font-display font-black text-white tracking-[-0.03em] leading-[0.95] max-w-2xl mb-12"
          style={{ fontSize: 'clamp(32px,4vw,60px)' }}
        >
          {title}
        </h2>
        <Link
          href={href}
          className="inline-flex items-center gap-3 font-mono text-[11px] tracking-[0.16em] uppercase text-white border border-white/30 px-6 py-3 hover:border-white hover:bg-white hover:text-ag-navy transition-all duration-300"
        >
          {cta}
          <ArrowUpRight size={14} />
        </Link>
      </div>
    </section>
  )
}
