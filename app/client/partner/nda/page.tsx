import type { Metadata }       from 'next'
import { redirect }             from 'next/navigation'
import { getUser }              from '@/lib/supabaseServer'
import { createServiceClient }  from '@/lib/supabase'
import { NDA_VERSIONS }         from '@/lib/ndaVersions'
import { ShieldCheck, FileText } from 'lucide-react'
import Link                     from 'next/link'

export const metadata: Metadata = {
  title: 'NDA signé — Espace Partenaire AEGRYN',
  robots: { index: false, follow: false },
}

function fmtDateTime(v: unknown): string {
  if (!v) return '—'
  return new Date(v as string).toLocaleString('fr-CH', {
    day:    '2-digit',
    month:  'long',
    year:   'numeric',
    hour:   '2-digit',
    minute: '2-digit',
    timeZone: 'Europe/Zurich',
  }) + ' (CET)'
}

export default async function PartnerNdaPage() {
  const user = await getUser()
  if (!user) redirect('/client/login')

  const supa = createServiceClient()
  const { data: profile } = await supa
    .from('profiles')
    .select('full_name, partner_nda_accepted_at, partner_nda_version, partner_nda_ip')
    .eq('id', user.id)
    .single()

  const p           = profile as Record<string, unknown> | null
  const acceptedAt  = p?.partner_nda_accepted_at  as string | null
  const version     = p?.partner_nda_version      as string | null
  const ip          = p?.partner_nda_ip           as string | null
  const currentVer  = NDA_VERSIONS.partner
  const isUpToDate  = version === currentVer

  if (!acceptedAt) redirect('/client/nda/partner')

  return (
    <div className="p-8 max-w-2xl">

      <div className="mb-8">
        <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-gray-400 mb-1">Espace Partenaire</p>
        <h1 className="font-sans font-bold text-gray-900 text-[24px] tracking-tight">NDA Partenaire signé</h1>
        <p className="font-sans text-[13px] text-gray-400 mt-1">
          Accord de confidentialité et conditions de partenariat AEGRYN accepté en ligne.
        </p>
      </div>

      {/* Certificat de signature */}
      <div className="bg-white border border-gray-200 divide-y divide-gray-100 mb-6">
        <div className="px-5 py-4 flex items-center gap-3">
          <ShieldCheck size={18} className="text-emerald-500 shrink-0" />
          <p className="font-sans font-semibold text-gray-900 text-[14px]">Signature électronique enregistrée</p>
        </div>

        <div className="px-5 py-4 grid grid-cols-[140px_1fr] gap-y-3 text-[12px]">
          <span className="font-mono text-[10px] uppercase tracking-widest text-gray-400 self-center">Signataire</span>
          <span className="font-sans text-gray-800">{(p?.full_name as string | null) ?? user.email}</span>

          <span className="font-mono text-[10px] uppercase tracking-widest text-gray-400 self-center">Email</span>
          <span className="font-sans text-gray-800">{user.email}</span>

          <span className="font-mono text-[10px] uppercase tracking-widest text-gray-400 self-center">Date et heure</span>
          <span className="font-sans text-gray-800">{fmtDateTime(acceptedAt)}</span>

          <span className="font-mono text-[10px] uppercase tracking-widest text-gray-400 self-center">Version NDA</span>
          <span className="font-sans text-gray-800 flex items-center gap-2">
            {version ?? '—'}
            {isUpToDate ? (
              <span className="font-mono text-[9px] uppercase px-2 py-0.5 bg-emerald-50 text-emerald-700 font-bold">En vigueur</span>
            ) : (
              <span className="font-mono text-[9px] uppercase px-2 py-0.5 bg-amber-50 text-amber-700 font-bold">Version antérieure</span>
            )}
          </span>

          {ip && (
            <>
              <span className="font-mono text-[10px] uppercase tracking-widest text-gray-400 self-center">Adresse IP</span>
              <span className="font-mono text-[11px] text-gray-500">{ip}</span>
            </>
          )}
        </div>
      </div>

      {/* Lien vers le texte intégral */}
      <div className="bg-gray-50 border border-gray-200 px-5 py-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <FileText size={16} className="text-gray-400 shrink-0" />
          <div>
            <p className="font-sans font-semibold text-gray-900 text-[13px]">Texte intégral du NDA</p>
            <p className="font-sans text-[11px] text-gray-400">Version {currentVer} — actuellement en vigueur</p>
          </div>
        </div>
        <Link
          href="/client/nda/partner"
          className="font-mono text-[9px] uppercase tracking-widest text-gray-500 border border-gray-200 px-3 py-2 hover:border-gray-400 transition-colors shrink-0"
        >
          Consulter →
        </Link>
      </div>

      {!isUpToDate && (
        <div className="mt-4 bg-amber-50 border border-amber-200 px-5 py-4">
          <p className="font-sans text-[12px] text-amber-800">
            <strong>Une nouvelle version du NDA est disponible.</strong>{' '}
            Votre acceptation porte sur la version {version}. La version en vigueur est {currentVer}.
            Vous pouvez relire et accepter la version actuelle depuis la page{' '}
            <Link href="/client/nda/partner" className="underline font-medium">NDA Partenaire →</Link>
          </p>
        </div>
      )}

    </div>
  )
}
