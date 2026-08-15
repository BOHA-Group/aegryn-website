/**
 * /client/buyer — Espace acquéreur Aegryn TRANSACT
 * Affiche les demandes d'accès dossier et révèle le lien URL
 * UNIQUEMENT si l'accès est approuvé et la session toujours ouverte.
 * Aucun envoi email — accès exclusivement via cet espace.
 */
import { redirect }            from 'next/navigation'
import Link                    from 'next/link'
import { getTranslations }     from 'next-intl/server'
import { getUser }             from '@/lib/supabaseServer'
import { createServiceClient } from '@/lib/supabase'
import { Lock, ExternalLink, Clock, XCircle, CheckCircle, Hourglass } from 'lucide-react'
import { ComingSoonBanner }    from '@/components/ui/ComingSoonBanner'

type Props = { params: Promise<{ locale: string }> }

interface DossierRequest {
  id:         string
  status:     'pending' | 'approved' | 'rejected'
  note:       string | null
  created_at: string
  asset_id:   string
  assets: {
    slug:              string
    name:              string
    lot_number:        string
    catalog_context:   string | null
    session_closes_at: string | null
  }
}

interface AccessRecord {
  asset_id:   string
  expires_at: string
  status:     string
}

function statusIcon(status: string) {
  if (status === 'approved') return <CheckCircle size={14} className="text-emerald-600 shrink-0" />
  if (status === 'rejected') return <XCircle     size={14} className="text-red-500 shrink-0" />
  return                            <Hourglass   size={14} className="text-amber-500 shrink-0" />
}

function isAccessValid(access: AccessRecord, sessionClosesAt: string | null): boolean {
  const now = new Date()
  if (access.status !== 'active') return false
  if (new Date(access.expires_at) < now) return false
  if (sessionClosesAt && new Date(sessionClosesAt) < now) return false
  return true
}

function daysLeft(expiresAt: string, sessionClosesAt: string | null): number {
  const expiry = new Date(expiresAt)
  const close  = sessionClosesAt ? new Date(sessionClosesAt) : null
  const limit  = close && close < expiry ? close : expiry
  const ms     = limit.getTime() - Date.now()
  return Math.max(0, Math.ceil(ms / 86_400_000))
}

export default async function ClientBuyerPage({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations('clientAuction')

  /* ── Auth ── */
  const user = await getUser()
  if (!user) {
    redirect(`/${locale}/transact/catalog`)
  }

  /* ── Fetch requests ── */
  const supa = createServiceClient()

  const { data: requests } = await supa
    .from('dossier_requests')
    .select(`
      id, status, note, created_at, asset_id,
      assets ( slug, name, lot_number, catalog_context, session_closes_at )
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false }) as { data: DossierRequest[] | null }

  /* ── Fetch active accesses ── */
  const { data: accesses } = await supa
    .from('asset_access')
    .select('asset_id, expires_at, status')
    .eq('user_id', user.id) as { data: AccessRecord[] | null }

  const accessMap = new Map<string, AccessRecord>(
    (accesses ?? []).map(a => [a.asset_id, a])
  )

  return (
    <main className="bg-ag-off-white min-h-screen py-16 px-4">
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="mb-10">
          <p className="font-mono text-[9px] tracking-[0.28em] uppercase text-ag-apex mb-4 flex items-center gap-2">
            <span className="w-5 h-px bg-ag-apex/50 inline-block" />
            {t('eyebrow')}
          </p>
          <h1 className="font-sans font-bold text-ag-black text-[28px] tracking-tight mb-1">
            {t('title')}
          </h1>
          <p className="font-sans text-[13px] text-ag-gray-light">
            {t('subtitle')}
          </p>
        </div>

        {/* Liste des demandes */}
        {!requests || requests.length === 0 ? (
          <div className="border border-ag-border bg-ag-white p-10 text-center">
            <Lock size={24} className="text-ag-gray-light mx-auto mb-4" />
            <p className="font-sans text-[14px] text-ag-gray">
              {t('empty')}
            </p>
            <Link
              href={`/${locale}/transact/catalog`}
              className="inline-flex items-center gap-2 mt-5 font-mono text-[10px] uppercase tracking-[0.16em] text-ag-apex hover:underline"
            >
              {t('viewCatalog')} →
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {requests.map((req) => {
              const asset  = req.assets
              const access = accessMap.get(req.asset_id)
              const valid  = access ? isAccessValid(access, asset.session_closes_at) : false
              const days   = access && valid ? daysLeft(access.expires_at, asset.session_closes_at) : 0

              const statusKey = req.status === 'approved'
                ? 'statusApproved'
                : req.status === 'rejected'
                  ? 'statusRejected'
                  : 'statusPending'

              return (
                <div key={req.id}
                  className="bg-ag-white border border-ag-border p-6 flex flex-col gap-4">

                  {/* Asset header */}
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-ag-gray-light mb-1">
                        {t('lotPrefix')} {asset.lot_number} · {asset.catalog_context ?? 'Aegryn TRANSACT'}
                      </p>
                      <p className="font-sans font-semibold text-ag-black text-[17px]">
                        {asset.name}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {statusIcon(req.status)}
                      <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-ag-gray">
                        {t(statusKey)}
                      </span>
                    </div>
                  </div>

                  {/* Lien dossier (révélé uniquement si accès valide) */}
                  {req.status === 'approved' && valid && access ? (
                    <div className="border border-ag-apex/30 bg-ag-apex/5 rounded-sm p-4 flex items-center justify-between gap-4">
                      <div>
                        <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-ag-apex mb-1 flex items-center gap-1.5">
                          <CheckCircle size={10} />
                          {days > 1 ? t('accessActivePlural', { days }) : t('accessActive', { days })}
                        </p>
                        <p className="font-sans text-[12px] text-ag-gray-light">
                          {t('accessConfidential')}
                        </p>
                      </div>
                      <Link
                        href={`/${locale}/transact/lot/${asset.slug}`}
                        className="shrink-0 inline-flex items-center gap-2 bg-ag-navy text-white font-mono text-[10px] uppercase tracking-[0.14em] px-5 py-2.5 hover:bg-ag-apex hover:text-ag-navy transition-colors"
                      >
                        {t('openDossier')} <ExternalLink size={11} />
                      </Link>
                    </div>
                  ) : req.status === 'approved' && !valid ? (
                    <div className="border border-ag-border rounded-sm p-4 flex items-center gap-3">
                      <Clock size={14} className="text-ag-gray-light shrink-0" />
                      <p className="font-sans text-[12px] text-ag-gray-light">
                        {t('accessExpired')}
                      </p>
                    </div>
                  ) : req.status === 'pending' ? (
                    <div className="border border-amber-200 bg-amber-50 rounded-sm p-4">
                      <p className="font-sans text-[12px] text-amber-700">
                        {t('pendingReview')}
                      </p>
                    </div>
                  ) : (
                    <div className="border border-red-100 bg-red-50 rounded-sm p-4">
                      <p className="font-sans text-[12px] text-red-600">
                        {t('rejected')}
                      </p>
                    </div>
                  )}

                  {/* Date demande */}
                  <p className="font-mono text-[9px] text-ag-gray-light">
                    {t('requestedOn')}{' '}
                    {new Date(req.created_at).toLocaleDateString(locale, {
                      day: '2-digit', month: 'long', year: 'numeric'
                    })}
                  </p>
                </div>
              )
            })}
          </div>
        )}

        {/* Sections à venir */}
        <div className="mt-12 space-y-4">
          <p className="font-sans font-semibold text-[10px] uppercase tracking-[0.22em] text-ag-gray-light mb-4">
            {t('upcomingTitle')}
          </p>
          <ComingSoonBanner section={t('sectionSeller')} />
          <ComingSoonBanner section={t('sectionPartner')} />
        </div>

        {/* Disclaimer */}
        <p className="mt-10 text-center font-mono text-[9px] uppercase tracking-[0.18em] text-ag-gray-light">
          {t('disclaimer')}
        </p>
      </div>
    </main>
  )
}
