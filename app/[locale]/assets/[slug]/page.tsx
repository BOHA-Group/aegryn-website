import { notFound }          from 'next/navigation'
import Link                   from 'next/link'
import { ArrowUpRight, ArrowLeft } from 'lucide-react'
import { generateAegrynMetadata } from '@/lib/seo'
import { AEGRYN_ASSETS, ASSET_CATEGORIES } from '@/data/assets'
import type { Metadata } from 'next'

type Props = { params: Promise<{ locale: string; slug: string }> }

const STATUS_CONFIG = {
  live:  { label: 'Live',              dot: 'bg-ag-live',  text: 'text-ag-live' },
  beta:  { label: 'Bêta',             dot: 'bg-ag-beta',  text: 'text-ag-beta' },
  dev:   { label: 'En développement', dot: 'bg-ag-gray-light', text: 'text-ag-gray-light' },
} as const

const ASSET_DETAILS: Record<string, {
  longDesc: string
  features: string[]
  audience: string
  tech: string[]
}> = {
  subblink: {
    longDesc: "Subblink analyse vos contrats d'entreprise en quelques secondes grâce à une IA calibrée pour le droit suisse et français. Risques, clauses critiques, obligations cachées — tout est identifié et expliqué en langage clair.",
    features: [
      'Analyse de contrats en moins de 30 secondes',
      'Détection automatique des clauses à risque',
      'Conformité droit suisse (CO) et droit français',
      'Résumé exécutif et points d\'attention priorisés',
      'Export PDF annoté',
      'API disponible pour intégration B2B',
    ],
    audience: 'Freelances, consultants, PME, cabinets juridiques',
    tech: ['IA générative', 'NLP juridique', 'Swiss Law', 'SaaS B2B'],
  },
  neediu: {
    longDesc: "Neediu connecte les particuliers aux meilleurs prestataires de services à domicile. Ménage, jardinage, bricolage, baby-sitting — une mise en relation intelligente basée sur la localisation et les avis vérifiés.",
    features: [
      'Mise en relation en temps réel',
      'Prestataires vérifiés et notés',
      'Paiement sécurisé intégré',
      'Suivi de mission en direct',
      'Assurance prestation incluse',
      'Disponible Île-de-France',
    ],
    audience: 'Particuliers, propriétaires, locataires',
    tech: ['Marketplace B2C', 'Géolocalisation', 'Paiement en ligne', 'Mobile-first'],
  },
  primiom: {
    longDesc: "Primiom réinvente la transaction immobilière en plaçant l'IA au cœur du processus d'achat et de vente. Estimation précise, analyse de marché en temps réel et accompagnement personnalisé de A à Z.",
    features: [
      'Estimation IA en moins de 2 minutes',
      'Analyse des prix du marché local',
      'Accompagnement acheteur/vendeur intégré',
      'Simulation de financement',
      'Connexion aux notaires partenaires',
      'Couverture Suisse et France',
    ],
    audience: 'Acheteurs, vendeurs, investisseurs immobiliers',
    tech: ['IA prédictive', 'Data immobilière', 'Proptech', 'CH/FR'],
  },
  movtoo: {
    longDesc: "Movtoo est une plateforme de livraison immédiate pilotée par l'intelligence artificielle. Courses, repas, colis — la livraison à la demande optimisée pour les zones urbaines denses.",
    features: [
      'Livraison en moins de 45 minutes',
      'Dispatch IA en temps réel',
      'Suivi GPS du livreur',
      'Multi-catégories : alimentaire, colis, documents',
      'Livreurs indépendants vérifiés',
      'API marchands disponible',
    ],
    audience: 'Particuliers, restaurateurs, commerces de proximité',
    tech: ['IA logistique', 'Géoptimisation', 'Last-mile delivery', 'On-demand'],
  },
  hobconnect: {
    longDesc: "Hobconnect crée des communautés authentiques autour des passions partagées. Photographie, cuisine, sport, musique — un réseau social centré sur l'intérêt commun plutôt que sur les abonnés.",
    features: [
      'Communautés thématiques par passion',
      'Fil d\'actualité sans algorithme publicitaire',
      'Événements locaux et en ligne',
      'Messagerie privée entre passionnés',
      'Ateliers et rencontres organisés',
      'Sans publicité intrusive',
    ],
    audience: 'Particuliers passionnés, créateurs de contenu, associations',
    tech: ['Réseau social B2C', 'Communautés', 'Événementiel', 'Privacy-first'],
  },
}

export async function generateStaticParams() {
  return AEGRYN_ASSETS
    .filter((a) => a.id !== 'kryv')
    .map((a) => ({ slug: a.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params
  const asset = AEGRYN_ASSETS.find((a) => a.slug === slug && a.id !== 'kryv')
  if (!asset) return {}
  return generateAegrynMetadata({
    title: asset.name,
    description: asset.tagline,
    path: `/assets/${slug}`,
    locale,
  })
}

export default async function AssetPage({ params }: Props) {
  const { slug } = await params
  const asset = AEGRYN_ASSETS.find((a) => a.slug === slug && a.id !== 'kryv')
  if (!asset) notFound()

  const details  = ASSET_DETAILS[asset.id]
  const status   = STATUS_CONFIG[asset.status]
  const category = ASSET_CATEGORIES[asset.category]
  const isLive   = !!asset.url

  return (
    <>
      {/* Back nav */}
      <div className="border-b border-ag-border">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-4">
          <Link
            href="/what-we-build"
            className="inline-flex items-center gap-2 font-sans font-semibold text-[11px] tracking-[0.14em] uppercase text-ag-gray-light hover:text-ag-black transition-colors"
          >
            <ArrowLeft size={12} />
            Nos actifs
          </Link>
        </div>
      </div>

      {/* Hero */}
      <section className="border-b border-ag-border">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-28">
          <div className="flex flex-wrap items-center gap-3 mb-10">
            <span className="font-sans font-semibold text-[10px] tracking-[0.2em] uppercase text-ag-gray-light border border-ag-border px-3 py-1">
              {category.label}
            </span>
            <span className="font-sans font-semibold text-[10px] tracking-[0.2em] uppercase border border-ag-border px-3 py-1 text-ag-gray-light">
              {asset.badge}
            </span>
            <span className="flex items-center gap-1.5">
              <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
              <span className={`font-sans font-semibold text-[10px] tracking-[0.14em] uppercase ${status.text}`}>
                {status.label}
              </span>
            </span>
          </div>

          <h1
            className="font-sans font-bold text-ag-black tracking-[-0.03em] leading-[0.92] max-w-3xl mb-6"
            style={{ fontSize: 'clamp(56px,7vw,96px)' }}
          >
            {asset.name}
          </h1>
          <p className="font-sans font-semibold text-[14px] text-ag-gray leading-relaxed max-w-xl mb-10">
            {asset.tagline}
          </p>

          {isLive ? (
            <a
              href={asset.url!}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 bg-ag-black text-white font-sans font-semibold text-[11px] tracking-[0.16em] uppercase px-7 py-4 hover:bg-ag-navy transition-colors"
            >
              Visiter {asset.name}
              <ArrowUpRight size={14} />
            </a>
          ) : (
            <span className="inline-flex items-center gap-3 border border-ag-border text-ag-gray-light font-sans font-semibold text-[11px] tracking-[0.16em] uppercase px-7 py-4 cursor-default select-none">
              Bientôt disponible
            </span>
          )}
        </div>
      </section>

      {/* Divider strip */}
      <div className="h-px bg-gradient-to-r from-transparent via-ag-apex/40 to-transparent" />

      {/* Description + features */}
      <section className="border-b border-ag-border">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-ag-border">

            {/* Long description */}
            <div className="py-20 md:pr-16">
              <p className="font-sans font-semibold text-[10px] tracking-[0.22em] uppercase text-ag-gray-light mb-8">
                Présentation
              </p>
              <p className="text-[15px] text-ag-dark leading-[1.8]">
                {details?.longDesc ?? asset.description}
              </p>
              {details?.audience && (
                <div className="mt-10 pt-8 border-t border-ag-border">
                  <p className="font-sans font-semibold text-[10px] tracking-[0.2em] uppercase text-ag-gray-light mb-2">
                    Public cible
                  </p>
                  <p className="text-[14px] text-ag-gray">{details.audience}</p>
                </div>
              )}
            </div>

            {/* Features */}
            <div className="py-20 md:pl-16">
              <p className="font-sans font-semibold text-[10px] tracking-[0.22em] uppercase text-ag-gray-light mb-8">
                Fonctionnalités
              </p>
              <ul className="space-y-4">
                {(details?.features ?? []).map((f, i) => (
                  <li key={i} className="flex items-start gap-4">
                    <span className="mt-[3px] w-4 h-4 shrink-0 flex items-center justify-center">
                      <span className="w-1.5 h-1.5 rounded-full bg-ag-apex" />
                    </span>
                    <span className="text-[14px] text-ag-gray leading-relaxed">{f}</span>
                  </li>
                ))}
              </ul>

              {details?.tech && (
                <div className="mt-12 flex flex-wrap gap-2">
                  {details.tech.map((tag) => (
                    <span key={tag} className="font-sans font-semibold text-[10px] tracking-[0.12em] uppercase border border-ag-border px-3 py-1.5 text-ag-gray-light">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* CTA strip */}
      <section className="bg-ag-navy py-28 px-6 md:px-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-10">
          <div>
            <p className="font-sans font-semibold text-[11px] tracking-[0.22em] uppercase text-white/60 mb-4">
              Aegryn Group
            </p>
            <h2
              className="font-sans font-bold text-white tracking-[-0.03em] leading-[0.95] max-w-xl"
              style={{ fontSize: 'clamp(28px,3.5vw,52px)' }}
            >
              Découvrez l&apos;ensemble de l&apos;écosystème.
            </h2>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 shrink-0">
            <Link
              href="/what-we-build"
              className="inline-flex items-center gap-3 font-sans font-semibold text-[11px] tracking-[0.16em] uppercase text-white border border-white/30 px-6 py-3 hover:border-white hover:bg-white hover:text-ag-navy transition-all"
            >
              Tous nos actifs
              <ArrowUpRight size={14} />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-3 font-sans font-semibold text-[11px] tracking-[0.16em] uppercase text-ag-navy bg-ag-apex px-6 py-3 hover:bg-white transition-colors"
            >
              Nous contacter
              <ArrowUpRight size={14} />
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
