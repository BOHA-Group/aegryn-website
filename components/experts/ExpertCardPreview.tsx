'use client'

import Image from 'next/image'
import { CheckCircle2, Mail, Globe, MapPin, Star, AlertTriangle } from 'lucide-react'
import {
  EXPERTISE_TAXONOMY,
  getCategoryLabel,
  getSpecialtyLabel,
  type LocaleKey,
} from '@/lib/expertiseTaxonomy'

export type ExpertCardPreviewData = {
  first_name:   string
  last_name:    string
  profession:   string
  organization: string
  city:         string
  country_code: string
  bio:          string
  email_public: string
  website:      string
  min_rate_eur:   number | null
  rate_currency:  string
  languages:      string[]
  avatar_url:     string | null
  /* taxonomy */
  expertise_dimension:    string | null
  expertise_categories:   string[]
  expertise_specialties:  string[]
}

const DIMENSION_COLORS: Record<string, { bg: string; border: string; text: string }> = {
  tech:        { bg: 'bg-[#5ADDA4]/10', border: 'border-[#5ADDA4]/40', text: 'text-[#0e7a52]' },
  transaction: { bg: 'bg-[#818cf8]/10', border: 'border-[#818cf8]/40', text: 'text-[#4338ca]' },
  both:        { bg: 'bg-ag-apex/8',    border: 'border-ag-apex/30',    text: 'text-ag-apex'   },
}

// Couleur d'une catégorie taxonomy selon sa dimension
function getCatColor(catId: string): { bg: string; border: string; text: string } {
  const cat = EXPERTISE_TAXONOMY.find(c => c.id === catId)
  if (!cat) return { bg: 'bg-gray-50', border: 'border-gray-200', text: 'text-gray-500' }
  return DIMENSION_COLORS[cat.dimension] ?? { bg: 'bg-ag-off-white', border: 'border-ag-border', text: 'text-ag-gray' }
}

const DIMENSION_LABELS: Record<string, string> = {
  tech:        'Advisory Tech',
  transaction: 'Advisory Transaction',
  both:        'Advisory Tech & Transaction',
}

const LANG_LABELS: Record<string, string> = {
  fr: 'FR', en: 'EN', de: 'DE', es: 'ES', it: 'IT', nl: 'NL',
}

export function ExpertCardPreview({ data, locale = 'fr' }: { data: ExpertCardPreviewData; locale?: LocaleKey }) {
  const initials = `${data.first_name[0] ?? ''}${data.last_name[0] ?? ''}`.toUpperCase()

  const categoryNodes = EXPERTISE_TAXONOMY.filter(c =>
    data.expertise_categories.includes(c.id)
  )
  const specialtyNodes = EXPERTISE_TAXONOMY
    .flatMap(c => c.specialties)
    .filter(s => data.expertise_specialties.includes(s.id))

  const hasContent = data.first_name || data.last_name || data.profession

  return (
    <div className="bg-ag-white border border-ag-border p-5 flex flex-col gap-4 relative">

      {/* Watermark si vide */}
      {!hasContent && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <p className="font-mono text-[10px] uppercase tracking-widest text-ag-gray-light/50 rotate-[-20deg]">
            Aperçu de la fiche
          </p>
        </div>
      )}

      {/* ── Badges hiérarchiques : Dimension → Catégories → Expertises ── */}
      {(data.expertise_dimension || categoryNodes.length > 0 || specialtyNodes.length > 0) && (
        <div className="space-y-1.5">

          {/* Niveau 1 — Dimension */}
          {data.expertise_dimension && (
            <div className="flex flex-wrap gap-1.5">
              <span className={`inline-flex items-center font-mono text-[9px] tracking-[0.14em] uppercase px-2 py-0.5 border font-bold ${
                DIMENSION_COLORS[data.expertise_dimension]?.bg ?? 'bg-ag-off-white'
              } ${
                DIMENSION_COLORS[data.expertise_dimension]?.border ?? 'border-ag-border'
              } ${
                DIMENSION_COLORS[data.expertise_dimension]?.text ?? 'text-ag-gray'
              }`}>
                {DIMENSION_LABELS[data.expertise_dimension] ?? data.expertise_dimension}
              </span>
            </div>
          )}

          {/* Niveau 2 — Catégories */}
          {categoryNodes.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pl-2 border-l-2 border-ag-border ml-1">
              {categoryNodes.map(cat => {
                const cc = getCatColor(cat.id)
                return (
                  <span key={cat.id} className={`font-mono text-[9px] tracking-[0.12em] uppercase px-2 py-0.5 border ${cc.bg} ${cc.border} ${cc.text}`}>
                    {getCategoryLabel(cat, locale)}
                  </span>
                )
              })}
            </div>
          )}

          {/* Niveau 3 — Expertises (max 5) */}
          {specialtyNodes.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pl-4 border-l-2 border-ag-border/50 ml-1">
              {specialtyNodes.slice(0, 5).map(s => (
                <span key={s.id} className="font-mono text-[9px] tracking-[0.12em] uppercase px-2 py-0.5 bg-ag-off-white border border-ag-border text-ag-gray">
                  {getSpecialtyLabel(s, locale)}
                </span>
              ))}
              {specialtyNodes.length > 5 && (
                <span className="font-mono text-[9px] text-ag-gray-light px-1 py-0.5">
                  +{specialtyNodes.length - 5}
                </span>
              )}
            </div>
          )}

        </div>
      )}

      {/* Identité */}
      <div className="flex items-start gap-4">
        {data.avatar_url ? (
          <Image
            src={data.avatar_url}
            alt={`${data.first_name} ${data.last_name}`}
            width={48}
            height={48}
            className="w-12 h-12 object-cover shrink-0"
            unoptimized
          />
        ) : (
          <div className="w-12 h-12 bg-ag-off-white border border-ag-border flex items-center justify-center shrink-0">
            <span className="font-mono text-[13px] font-bold text-ag-gray">{initials || '?'}</span>
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-0.5">
            <h3 className="font-sans font-semibold text-ag-black text-[15px] leading-tight">
              {data.first_name || data.last_name
                ? `${data.first_name} ${data.last_name}`.trim()
                : <span className="text-ag-gray-light italic">Prénom Nom</span>
              }
            </h3>
            <span className="inline-flex items-center gap-1 font-mono text-[9px] tracking-[0.14em] uppercase px-2 py-0.5 bg-ag-apex/10 text-ag-apex border border-ag-apex/30">
              <CheckCircle2 size={9} /> Vérifié
            </span>
          </div>
          <p className="font-sans text-[12px] text-ag-apex font-semibold">
            {data.profession || <span className="text-ag-gray-light italic">Titre / Profession</span>}
          </p>
          {data.organization && (
            <p className="font-sans text-[12px] text-ag-gray mt-0.5">{data.organization}</p>
          )}
        </div>
      </div>

      {/* Bio */}
      {data.bio && (
        <p className="font-sans text-[12px] text-ag-gray leading-relaxed line-clamp-3">{data.bio}</p>
      )}

      {/* Banner max expertises atteint */}
      {specialtyNodes.length >= 5 && (
        <div className="flex items-center gap-2 px-3 py-2 bg-amber-50 border border-amber-200">
          <AlertTriangle size={10} className="text-amber-500 shrink-0" />
          <p className="font-mono text-[9px] text-amber-700">
            Max 5 expertises — choisissez les plus représentatives
          </p>
        </div>
      )}

      {/* Footer — deux lignes pour éviter l'écrasement avec de nombreuses langues */}
      <div className="pt-2 border-t border-ag-border mt-auto space-y-1.5">
        {/* Ligne 1 : langues */}
        {data.languages.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {data.languages.map(l => (
              <span key={l} className="font-mono text-[9px] text-ag-gray-light border border-ag-border px-1.5 py-0.5">
                {LANG_LABELS[l] ?? l.toUpperCase()}
              </span>
            ))}
          </div>
        )}
        {/* Ligne 2 : ville + taux */}
        <div className="flex items-center justify-between gap-2">
          {(data.city || data.country_code) ? (
            <span className="inline-flex items-center gap-1 font-sans text-[11px] text-ag-gray-light min-w-0 truncate">
              <MapPin size={10} className="shrink-0" />
              <span className="truncate">{[data.city, data.country_code].filter(Boolean).join(', ')}</span>
            </span>
          ) : <span />}
          {data.min_rate_eur != null && (
            <span className="inline-flex items-center gap-1 font-mono text-[10px] text-ag-gray-light shrink-0">
              <Star size={9} /> Dès {data.min_rate_eur} {data.rate_currency || 'CHF'} /h
            </span>
          )}
        </div>
      </div>

      {/* Liens contact */}
      {(data.email_public || data.website) && (
        <div className="flex gap-2 flex-wrap">
          {data.email_public && (
            <span className="inline-flex items-center gap-1.5 font-mono text-[9px] tracking-[0.14em] uppercase px-3 py-1.5 border border-ag-navy text-ag-navy">
              <Mail size={10} /> Contact
            </span>
          )}
          {data.website && (
            <span className="inline-flex items-center gap-1.5 font-mono text-[9px] tracking-[0.14em] uppercase px-3 py-1.5 border border-ag-border text-ag-gray">
              <Globe size={10} /> Site
            </span>
          )}
        </div>
      )}
    </div>
  )
}
