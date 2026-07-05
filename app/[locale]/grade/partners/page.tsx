import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowUpRight, Scale, Calculator, ShieldCheck } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Réseau d\'experts — AEGRYN Grade',
  description: 'AEGRYN Grade est une certification standalone. Les experts indépendants (juridique IP, expert-comptable, cybersécurité) peuvent candidater pour s\'adosser à la certification ou accompagner vendeurs et acquéreurs.',
}

const PARTNER_TYPES = [
  {
    icon: Scale,
    label: 'JURIDIQUE IP',
    title: 'Candidatures ouvertes',
    desc: 'Cabinet juridique spécialisé tech & IP, en support sur la dimension I (IP & Droits) pour les vendeurs et acquéreurs qui le souhaitent.',
    dimension: 'Dimension I — IP & Droits',
  },
  {
    icon: Calculator,
    label: 'EXPERT-COMPTABLE',
    title: 'Candidatures ouvertes',
    desc: 'Cabinet d\'audit ou expert-comptable spécialisé SaaS/tech, en support sur la dimension F (Finance) pour les vendeurs et acquéreurs qui le souhaitent.',
    dimension: 'Dimension F — Finance',
  },
  {
    icon: ShieldCheck,
    label: 'CYBERSÉCURITÉ',
    title: 'Candidatures ouvertes',
    desc: 'Spécialiste cybersécurité accrédité (PASSI ou CREST), en support sur la dimension S (Sécurité) pour les vendeurs et acquéreurs qui le souhaitent.',
    dimension: 'Dimension S — Sécurité',
  },
]

export default function GradePartnersPage() {
  return (
    <main id="main" className="bg-ag-white">

      {/* Hero */}
      <section className="border-b border-ag-border pt-24 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <Link href="/grade" className="inline-flex items-center gap-2 font-sans font-semibold text-[10px] uppercase tracking-[0.22em] text-ag-gray-light hover:text-ag-black transition-colors mb-10">
            ← Grade AEGRYN
          </Link>
          <p className="font-sans font-semibold text-[10px] tracking-[0.28em] uppercase text-ag-apex mb-5 flex items-center gap-3">
            <span className="w-6 h-px bg-ag-apex/50 inline-block" />
            AEGRYN GRADE
          </p>
          <h1 className="font-sans font-bold text-ag-black leading-[1.05] tracking-[-0.03em] max-w-2xl mb-6" style={{ fontSize: 'clamp(32px,4.5vw,64px)' }}>
            Un réseau d'experts en support, pas une obligation
          </h1>
          <p className="font-sans text-[15px] text-ag-gray leading-relaxed max-w-xl mb-8">
            L'AEGRYN Grade est une certification standalone : AEGRYN évalue et note la qualité des actifs tech mis en vente sans dépendre d'un tiers pour émettre son grade. Nos vendeurs se font par ailleurs accompagner de façon indépendante dans leur processus de vente.
          </p>
          <p className="font-sans text-[13px] text-ag-gray-light max-w-xl">
            Nous restons ouverts aux candidatures d'experts indépendants souhaitant s'adosser à la certification ou rejoindre notre réseau, mobilisable à la demande avant, pendant et après une transaction.
          </p>
        </div>
      </section>

      {/* 3 colonnes — placeholders */}
      <section className="py-20 px-6 border-b border-ag-border">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {PARTNER_TYPES.map((p) => {
            const Icon = p.icon
            return (
              <div key={p.label} className="border border-ag-border border-dashed p-8 flex flex-col gap-6">
                <div className="w-12 h-12 border border-ag-border flex items-center justify-center">
                  <Icon size={18} className="text-ag-gray-light" />
                </div>
                <div>
                  <p className="font-sans font-semibold text-[10px] uppercase tracking-[0.22em] text-ag-gray-light mb-2">{p.label}</p>
                  <p className="font-sans font-bold text-ag-black text-[16px] mb-1">{p.title}</p>
                  <p className="font-sans text-[11px] uppercase tracking-[0.12em] text-ag-apex">{p.dimension}</p>
                </div>
                <p className="font-sans text-[13px] text-ag-gray leading-relaxed">{p.desc}</p>
                <div className="mt-auto pt-4 border-t border-ag-border/50">
                  <span className="font-sans text-[10px] uppercase tracking-[0.18em] text-ag-gray-light">
                    Annonce dès le premier partenariat formalisé
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* CTA partenaires potentiels */}
      <section className="py-20 px-6 border-b border-ag-border bg-ag-off-white">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <div>
            <p className="font-sans font-semibold text-[10px] uppercase tracking-[0.22em] text-ag-gray-light mb-6">POUR LES EXPERTS</p>
            <h2 className="font-sans font-bold text-ag-black tracking-[-0.025em] leading-[1.1] mb-6" style={{ fontSize: 'clamp(24px,3vw,40px)' }}>
              Vous êtes cabinet juridique, expert-comptable ou spécialiste cybersécurité ?
            </h2>
            <p className="font-sans text-[14px] text-ag-gray leading-relaxed mb-8">
              Candidatez pour rejoindre le réseau d'experts AEGRYN : accès à un flux régulier d'actifs tech nécessitant votre expertise, visibilité institutionnelle, clientèle qualifiée.
            </p>
            <Link
              href="/alliances?tab=certification"
              className="inline-flex items-center gap-2 bg-ag-black text-white font-sans font-semibold text-[11px] uppercase tracking-[0.16em] px-7 py-4 hover:bg-ag-navy transition-colors"
            >
              Candidater au réseau d'experts <ArrowUpRight size={13} />
            </Link>
          </div>
          <div className="border border-ag-border p-8 bg-ag-white">
            <p className="font-sans font-semibold text-[10px] uppercase tracking-[0.22em] text-ag-gray-light mb-4">CE QUE VOUS OBTENEZ</p>
            <ul className="flex flex-col gap-4">
              {[
                'Accès à un flux régulier d\'actifs tech nécessitant votre expertise',
                'Visibilité en tant que partenaire du réseau AEGRYN (dès les premiers mandats)',
                'Clientèle institutionnelle qualifiée — acquéreurs PE, VC, Family Office',
                'Rémunération définie dans le cadre du partenariat',
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="w-5 h-5 border border-ag-apex/40 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="w-1.5 h-1.5 bg-ag-apex rounded-full" />
                  </span>
                  <span className="font-sans text-[13px] text-ag-gray leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

    </main>
  )
}
