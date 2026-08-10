import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import { getUser } from '@/lib/supabaseServer'
import { createServiceClient } from '@/lib/supabase'
import AccountForm from './AccountForm'
import MfaSection from './MfaSection'
import DeletePartialSection from './DeletePartialSection'
import DeleteAccountSection from './DeleteAccountSection'
import ActivateProfileSection from './ActivateProfileSection'

export const metadata: Metadata = {
  title: 'Mon compte — Aegryn',
  robots: { index: false, follow: false },
}

const ROLE_LINKS: Record<string, string> = {
  buyer:   '/client/buyer',
  seller:  '/client/seller',
  partner: '/client/partner',
  expert:  '/client/expert',
  admin:   '/admin',
}

export default async function AccountPage() {
  const user = await getUser()
  if (!user) redirect('/client/login')

  const t = await getTranslations('clientArea.account')

  const ROLE_LABELS: Record<string, string> = {
    buyer:       t('roleBuyer'),
    seller:      t('roleSeller'),
    partner:     t('rolePartner'),
    admin:       t('roleAdmin'),
    super_admin: t('roleSuperAdmin'),
    expert:      t('roleExpert'),
  }

  const supa = createServiceClient()
  const { data: profile } = await supa
    .from('profiles')
    .select('full_name, roles, created_at, email_notifications_enabled, partner_nda_accepted_at, partner_nda_version')
    .eq('id', user.id)
    .single()

  const roles: string[] = Array.isArray(profile?.roles) ? profile.roles : []
  const emailNotifEnabled = profile?.email_notifications_enabled !== false
  const p = profile as Record<string, unknown> | null
  const partnerNdaSignedAt = p?.partner_nda_accepted_at as string | null
  const partnerNdaVersion  = p?.partner_nda_version  as string | null

  const { data: ndaSignatures } = await supa
    .from('nda_signatures')
    .select('nda_version, signed_at, scope')
    .eq('buyer_id', user.id)
    .order('signed_at', { ascending: false })

  return (
    <div className="p-8">
      <div className="max-w-2xl">

        {/* Header */}
        <div className="mb-10">
          <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-gray-500 mb-1">{t('eyebrow')}</p>
          <h1 className="font-sans font-bold text-gray-900 text-[26px] tracking-tight">{t('title')}</h1>
          <p className="font-sans text-[13px] text-gray-500 mt-0.5">{user.email}</p>
        </div>

        {/* Rôles actifs */}
        {roles.length > 0 && (
          <div className="bg-white border border-gray-200 p-5 mb-6">
            <p className="font-mono text-[9px] uppercase tracking-widest text-gray-400 mb-3">{t('activeSpaces')}</p>
            <div className="flex flex-wrap gap-2">
              {roles.map(role => (
                ROLE_LINKS[role] ? (
                  <a key={role} href={ROLE_LINKS[role]}
                    className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest text-ag-navy border border-ag-navy/30 bg-ag-navy/5 px-3 py-1.5 hover:bg-ag-navy hover:text-white transition-colors">
                    {ROLE_LABELS[role] ?? role}
                    <span className="text-[10px]">→</span>
                  </a>
                ) : (
                  <span key={role}
                    className="font-mono text-[10px] uppercase tracking-widest text-gray-500 border border-gray-200 bg-gray-50 px-3 py-1.5">
                    {ROLE_LABELS[role] ?? role}
                  </span>
                )
              ))}
            </div>
          </div>
        )}

        {/* Activer un profil supplémentaire */}
        <ActivateProfileSection currentRoles={roles} />

        {/* Formulaire profil */}
        <AccountForm
          userId={user.id}
          currentName={profile?.full_name ?? ''}
          currentEmail={user.email ?? ''}
        />

        {/* Double authentification */}
        <MfaSection />

        {/* Préférences email */}
        <div className="bg-white border border-gray-200 p-5 mt-4">
          <p className="font-mono text-[9px] uppercase tracking-widest text-gray-400 mb-3">{t('emailNotifTitle')}</p>
          {emailNotifEnabled ? (
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-sans text-[13px] text-gray-700">{t('emailNotifEnabledLabel')}</p>
                <p className="font-sans text-[11px] text-gray-400 mt-0.5">{t('emailNotifEnabledDesc')}</p>
              </div>
              <form action="/api/client/account/email-unsubscribe" method="POST">
                <input type="hidden" name="uid" value={user.id} />
                <button type="submit"
                  className="font-mono text-[10px] uppercase tracking-widest text-gray-400 hover:text-red-500 border border-gray-200 hover:border-red-200 px-3 py-1.5 transition-colors shrink-0">
                  {t('unsubscribe')}
                </button>
              </form>
            </div>
          ) : (
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-sans text-[13px] text-red-500">{t('emailNotifDisabledLabel')}</p>
                <p className="font-sans text-[11px] text-gray-400 mt-0.5">{t('emailNotifDisabledDesc')}</p>
              </div>
              {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
              <a href="/api/client/account/email-resubscribe"
                className="font-mono text-[10px] uppercase tracking-widest text-emerald-600 border border-emerald-200 px-3 py-1.5 hover:bg-emerald-50 transition-colors shrink-0">
                {t('resubscribe')}
              </a>
            </div>
          )}
        </div>

        {/* Infos compte */}
        <div className="bg-white border border-gray-200 p-5 mt-6">
          <p className="font-mono text-[9px] uppercase tracking-widest text-gray-400 mb-3">{t('infoTitle')}</p>
          <div className="flex flex-col gap-2">
            <div className="flex justify-between">
              <span className="font-sans text-[12px] text-gray-500">{t('infoId')}</span>
              <span className="font-mono text-[11px] text-gray-400">{user.id.slice(0, 16)}…</span>
            </div>
            {profile?.created_at && (
              <div className="flex justify-between">
                <span className="font-sans text-[12px] text-gray-500">{t('infoCreatedAt')}</span>
                <span className="font-sans text-[12px] text-gray-600">
                  {new Date(profile.created_at as string).toLocaleDateString('fr-CH', {
                    day: '2-digit', month: 'long', year: 'numeric',
                  })}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* NDA signés */}
        {((ndaSignatures && ndaSignatures.length > 0) || partnerNdaSignedAt) && (
          <div className="bg-white border border-gray-200 p-5 mt-6">
            <p className="font-mono text-[9px] uppercase tracking-widest text-gray-400 mb-3">{t('ndaTitle')}</p>
            <div className="flex flex-col gap-3">

              {/* NDA Partenaire */}
              {partnerNdaSignedAt && (
                <div className="flex items-start justify-between gap-4 border border-gray-100 px-4 py-3">
                  <div>
                    <p className="font-sans text-[13px] text-gray-700 font-medium">
                      {t('ndaPartnerTitle')}
                      <span className="ml-2 font-mono text-[10px] text-ag-apex bg-ag-navy px-1.5 py-0.5 uppercase tracking-wider">
                        {t('ndaSigned')}
                      </span>
                    </p>
                    <p className="font-mono text-[10px] text-gray-400 mt-0.5">
                      {t('ndaVersion')} {partnerNdaVersion ?? '—'} · {new Date(partnerNdaSignedAt).toLocaleDateString('fr-CH', { day: '2-digit', month: 'long', year: 'numeric' })}
                    </p>
                  </div>
                  <Link
                    href="/client/partner/nda"
                    className="font-mono text-[10px] uppercase tracking-widest text-ag-navy border border-ag-navy/30 px-3 py-1.5 hover:bg-ag-navy hover:text-white transition-colors shrink-0"
                  >
                    {t('ndaView')}
                  </Link>
                </div>
              )}

              {/* NDA Catalogue (acquéreur) */}
              {roles.includes('buyer') && ndaSignatures && ndaSignatures.map((sig, i) => (
                <div key={i} className="flex items-start justify-between gap-4 border border-gray-100 px-4 py-3">
                  <div>
                    <p className="font-sans text-[13px] text-gray-700 font-medium">
                      {t('ndaCatalogTitle')}
                      <span className="ml-2 font-mono text-[10px] text-ag-apex bg-ag-navy px-1.5 py-0.5 uppercase tracking-wider">
                        {t('ndaSigned')}
                      </span>
                    </p>
                    <p className="font-mono text-[10px] text-gray-400 mt-0.5">
                      {t('ndaVersion')} {String(sig.nda_version ?? '—')} · {sig.signed_at
                        ? new Date(sig.signed_at as string).toLocaleDateString('fr-CH', { day: '2-digit', month: 'long', year: 'numeric' })
                        : '—'}
                    </p>
                  </div>
                  <Link
                    href="/client/buyer/nda-view"
                    className="font-mono text-[10px] uppercase tracking-widest text-ag-navy border border-ag-navy/30 px-3 py-1.5 hover:bg-ag-navy hover:text-white transition-colors shrink-0"
                  >
                    {t('ndaView')}
                  </Link>
                </div>
              ))}

            </div>
          </div>
        )}

        {/* Déconnexion */}
        <div className="mt-6 flex items-center justify-between">
          <form action="/api/client/logout" method="POST">
            <button type="submit"
              className="font-mono text-[10px] uppercase tracking-widest text-gray-400 hover:text-gray-700 transition-colors border border-gray-300 px-4 py-2 hover:border-gray-500">
              {t('logout')}
            </button>
          </form>
        </div>

        {/* RGPD — gestion des données personnelles */}
        <div className="bg-white border border-gray-200 p-5 mt-4">
          <p className="font-mono text-[9px] uppercase tracking-widest text-gray-400 mb-4">{t('gdprTitle')}</p>

          {/* Export */}
          <div className="flex items-start justify-between gap-4 pb-4 border-b border-gray-100">
            <div>
              <p className="font-sans text-[13px] text-gray-700">{t('exportTitle')}</p>
              <p className="font-sans text-[11px] text-gray-400 mt-0.5">
                {t('exportDesc')}
              </p>
            </div>
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
            <a href="/api/client/account/export"
              className="font-mono text-[10px] uppercase tracking-widest text-ag-navy border border-ag-navy/30 px-3 py-1.5 hover:bg-ag-navy hover:text-white transition-colors shrink-0">
              {t('exportSubmit')}
            </a>
          </div>

          {/* Suppression partielle sélective */}
          <div className="py-4 border-b border-gray-100">
            <p className="font-sans text-[13px] text-gray-700 mb-1">{t('deletePartialTitle')}</p>
            <p className="font-sans text-[11px] text-gray-400 mb-3">
              {t('deletePartialDesc')}
            </p>
            <DeletePartialSection />
          </div>

          {/* Suppression totale */}
          <div className="pt-4">
            <p className="font-sans text-[13px] text-gray-700 mb-1">{t('deleteAccountTitle')}</p>
            <p className="font-sans text-[11px] text-gray-400 mb-3">
              {t('deleteAccountDesc')}
            </p>
            <DeleteAccountSection />
          </div>
        </div>
      </div>
    </div>
  )
}
