/**
 * /transact/lot/[slug]
 * ──────────────────────────────────────────────────────────────────
 * Page protégée — fiche actif Aegryn TRANSACT (AssetLotSheet complet).
 *
 * Conditions d'accès :
 *  1. Utilisateur authentifié (session Supabase valide)
 *  2. Entrée active dans `transact_asset_access` pour cet actif
 *  3. expires_at > now() ET session_closes_at > now()
 *     La fenêtre max est 30 jours avant session_closes_at.
 *
 * Tracking : chaque ouverture est enregistrée dans transact_access_log.
 * URL révélée uniquement dans /client/buyer — jamais par email.
 * Si l'une des conditions n'est pas remplie → message dédié, pas de 404.
 */
import { cookies }          from 'next/headers'
import { redirect }         from 'next/navigation'
import { createServerClient } from '@supabase/ssr'
import { getTranslations }  from 'next-intl/server'
import type { Metadata }    from 'next'
import NextLink             from 'next/link'
import { Link }             from '@/i18n/navigation'
import { Lock, ArrowUpRight, ClockAlert } from 'lucide-react'

import AssetLotSheet   from '@/components/transaction/AssetLotSheet'
import { mapRowToAsset } from '@/lib/transaction/mapRowToAsset'
import { createServiceClient } from '@/lib/supabase'
import { checkTransactCatalogAccess } from '@/lib/transactAccess'
import type { TransactionLotRow, TransactionLotAccess } from '@/types/transaction'

type Props = { params: Promise<{ locale: string; slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  return {
    title: `Lot — Aegryn TRANSACT`,
    description: 'Dossier confidentiel — Accès réservé aux acquéreurs qualifiés Aegryn TRANSACT.',
    robots: { index: false, follow: false },
    openGraph: { title: `Lot ${slug} — Aegryn TRANSACT` },
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
    redirect(`/client/login?next=/${locale}/transact/lot/${slug}`)
  }

  /* ── 2. NDA + CGV check ── */
  const catalogAccess = await checkTransactCatalogAccess(user.id)
  if (catalogAccess !== 'ok') {
    redirect(`/${locale}/transact/catalog`)
  }

  /* ── 3. Access check via service client (bypasses RLS) ── */
  const supa = createServiceClient()

  const { data: lotRow } = await supa
    .from('assets')
    .select('id, status, session_closes_at')
    .eq('slug', slug)
    .eq('status', 'published')
    .single() as { data: { id: string; status: string; session_closes_at: string | null } | null }

  if (!lotRow) {
    /* Lot inexistant ou non publié — même message que "pas d'accès" */
    return <AccessDeniedScreen locale={locale} slug={slug} state="no_access" t={t} />
  }

  const { data: access } = await supa
    .from('asset_access')
    .select('id, expires_at, status')
    .eq('asset_id', lotRow.id)
    .eq('user_id', user.id)
    .single() as { data: (Pick<TransactionLotAccess, 'expires_at' | 'status'> & { id: string }) | null }

  const now = new Date()
  let accessState: AccessState = 'ok'

  if (!access || access.status !== 'active') {
    accessState = 'no_access'
  } else if (new Date(access.expires_at) < now) {
    accessState = 'expired'
  } else if (lotRow.session_closes_at && new Date(lotRow.session_closes_at) < now) {
    /* Session clôturée — accès révoqué automatiquement */
    accessState = 'expired'
  }

  if (accessState !== 'ok') {
    return <AccessDeniedScreen locale={locale} slug={slug} state={accessState} t={t} />
  }

  /* ── 3. Fetch full lot data ── */
  const { data: fullRow } = await supa
    .from('assets')
    .select('*')
    .eq('id', lotRow.id)
    .single() as { data: TransactionLotRow | null }

  if (!fullRow) {
    return <AccessDeniedScreen locale={locale} slug={slug} state="no_access" t={t} />
  }

  const asset = mapRowToAsset(fullRow)
  if (!asset) {
    return <AccessDeniedScreen locale={locale} slug={slug} state="no_access" t={t} />
  }

  /* ── 4. Tracking (fire-and-forget, ne bloque pas le rendu) ── */
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'
  fetch(`${siteUrl}/api/transact/track-access`, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify({ asset_id: lotRow.id, access_id: access!.id, page: 'dossier' }),
  }).catch(() => { /* non-blocking */ })

  return (
    <main className="min-h-screen py-12 px-4" style={{ backgroundColor: '#FAF8F3' }}>
      <AssetLotSheet asset={asset} />
    </main>
  )
}

/* ── Écrans de garde ── */
function AccessDeniedScreen({
  locale: _locale, slug: _slug, state, t,
}: {
  locale: string; slug: string
  state: Exclude<AccessState, 'ok'>
  t: Awaited<ReturnType<typeof getTranslations>>
}) {
  const isExpired = state === 'expired'

  return (
    <main className="min-h-[80vh] flex items-center justify-center px-6 bg-ag-white">
      <div className="max-w-lg text-center flex flex-col items-center gap-6">
        <div className="w-16 h-16 border border-ag-border flex items-center justify-center">
          {isExpired
            ? <ClockAlert size={28} className="text-ag-gray-light" />
            : <Lock size={28} className="text-ag-gray-light" />}
        </div>
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-ag-apex mb-3">
            Aegryn TRANSACT — {t('confidentialLabel')}
          </p>
          <h1 className="font-sans font-bold text-ag-black text-[28px] tracking-[-0.02em] mb-4">
            {isExpired ? t('accessExpiredTitle') : t('accessDeniedTitle')}
          </h1>
          <p className="font-sans text-[14px] text-ag-gray leading-relaxed">
            {isExpired ? t('accessExpiredDesc') : t('accessDeniedDesc')}
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <NextLink
            href="/client/buyer"
            className="inline-flex items-center justify-center gap-2 bg-ag-navy text-white font-mono text-[11px] uppercase tracking-[0.16em] px-6 py-3.5 hover:bg-ag-navy-mid transition-colors"
          >
            Mon espace acquéreur <ArrowUpRight size={12} />
          </NextLink>
          <Link
            href="/transact/catalog"
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
