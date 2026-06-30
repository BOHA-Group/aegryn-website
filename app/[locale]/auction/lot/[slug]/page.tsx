/**
 * /auction/lot/[slug]
 * ──────────────────────────────────────────────────────────────────────
 * Page protégée — fiche actif AEGRYN Auction (AssetLotSheet complet).
 *
 * Conditions d'accès :
 *  1. Utilisateur authentifié (session Supabase valide)
 *  2. Entrée active dans `auction_lot_access` pour ce lot
 *  3. Fenêtre d'accès non expirée (expires_at > now())
 *     La durée standard est de 30 jours à compter de l'ouverture de session.
 *
 * Si l'une des conditions n'est pas remplie → message dédié, pas de 404
 * (pour éviter l'énumération de slugs).
 */
import { cookies }          from 'next/headers'
import { redirect }         from 'next/navigation'
import { createServerClient } from '@supabase/ssr'
import { getTranslations }  from 'next-intl/server'
import type { Metadata }    from 'next'
import Link                 from 'next/link'
import { Lock, ArrowUpRight, ClockAlert } from 'lucide-react'

import AssetLotSheet   from '@/components/auction/AssetLotSheet'
import { mapRowToAsset } from '@/lib/auction/mapRowToAsset'
import { createServiceClient } from '@/lib/supabase'
import type { AuctionLotRow, AuctionLotAccess } from '@/types/auction'

type Props = { params: Promise<{ locale: string; slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  return {
    title: `Lot — AEGRYN Auction`,
    description: 'Dossier confidentiel — Accès réservé aux acquéreurs qualifiés AEGRYN Auction.',
    robots: { index: false, follow: false },
    openGraph: { title: `Lot ${slug} — AEGRYN Auction` },
  }
}

async function createSupabaseServerClient() {
  const cookieStore = await cookies()
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: () => {},
      },
    }
  )
}

type AccessState = 'ok' | 'not_authenticated' | 'no_access' | 'expired'

export default async function AuctionLotPage({ params }: Props) {
  const { locale, slug } = await params
  const t = await getTranslations({ locale, namespace: 'auctionLot' })

  /* ── 1. Auth check ── */
  const supaUser = await createSupabaseServerClient()
  const { data: { user } } = await supaUser.auth.getUser()

  if (!user) {
    redirect(`/${locale}/client/login?next=/${locale}/auction/lot/${slug}`)
  }

  /* ── 2. Access check via service client (bypasses RLS) ── */
  const supa = createServiceClient()

  const { data: lotRow } = await supa
    .from('auction_lots')
    .select('id, status')
    .eq('slug', slug)
    .eq('status', 'published')
    .single() as { data: { id: string; status: string } | null }

  if (!lotRow) {
    /* Lot inexistant ou non publié — même message que "pas d'accès" */
    return <AccessDeniedScreen locale={locale} slug={slug} state="no_access" t={t} />
  }

  const { data: access } = await supa
    .from('auction_lot_access')
    .select('expires_at, status')
    .eq('lot_id', lotRow.id)
    .eq('user_id', user.id)
    .single() as { data: Pick<AuctionLotAccess, 'expires_at' | 'status'> | null }

  let accessState: AccessState = 'ok'

  if (!access || access.status !== 'active') {
    accessState = 'no_access'
  } else if (new Date(access.expires_at) < new Date()) {
    accessState = 'expired'
  }

  if (accessState !== 'ok') {
    return <AccessDeniedScreen locale={locale} slug={slug} state={accessState} t={t} />
  }

  /* ── 3. Fetch full lot data ── */
  const { data: fullRow } = await supa
    .from('auction_lots')
    .select('*')
    .eq('id', lotRow.id)
    .single() as { data: AuctionLotRow | null }

  if (!fullRow) {
    return <AccessDeniedScreen locale={locale} slug={slug} state="no_access" t={t} />
  }

  const asset = mapRowToAsset(fullRow)

  return (
    <main id="main" className="min-h-screen py-12 px-4" style={{ backgroundColor: '#FAF8F3' }}>
      <AssetLotSheet asset={asset} />
    </main>
  )
}

/* ── Écrans de garde ── */
function AccessDeniedScreen({
  locale, slug, state, t,
}: {
  locale: string; slug: string
  state: Exclude<AccessState, 'ok'>
  t: Awaited<ReturnType<typeof getTranslations>>
}) {
  const isExpired = state === 'expired'

  return (
    <main id="main" className="min-h-[80vh] flex items-center justify-center px-6 bg-ag-white">
      <div className="max-w-lg text-center flex flex-col items-center gap-6">
        <div className="w-16 h-16 border border-ag-border flex items-center justify-center">
          {isExpired
            ? <ClockAlert size={28} className="text-ag-gray-light" />
            : <Lock size={28} className="text-ag-gray-light" />}
        </div>
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-ag-apex mb-3">
            AEGRYN Auction — {t('confidentialLabel')}
          </p>
          <h1 className="font-sans font-bold text-ag-black text-[28px] tracking-[-0.02em] mb-4">
            {isExpired ? t('accessExpiredTitle') : t('accessDeniedTitle')}
          </h1>
          <p className="font-sans text-[14px] text-ag-gray leading-relaxed">
            {isExpired ? t('accessExpiredDesc') : t('accessDeniedDesc')}
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <Link
            href={`/${locale}/auction/submit`}
            className="inline-flex items-center justify-center gap-2 bg-ag-navy text-white font-mono text-[11px] uppercase tracking-[0.16em] px-6 py-3.5 hover:bg-ag-navy-mid transition-colors"
          >
            {t('requestAccessCta')} <ArrowUpRight size={12} />
          </Link>
          <Link
            href={`/${locale}/auction/catalog`}
            className="inline-flex items-center justify-center gap-2 border border-ag-border text-ag-gray font-mono text-[11px] uppercase tracking-[0.16em] px-6 py-3.5 hover:border-ag-black hover:text-ag-black transition-all"
          >
            {t('backToCatalog')}
          </Link>
        </div>
        <p className="font-sans text-[11px] text-ag-gray-light max-w-sm">
          {t('requestAccessDesc')}
        </p>
      </div>
    </main>
  )
}
