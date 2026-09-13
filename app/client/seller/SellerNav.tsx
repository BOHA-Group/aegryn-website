import { getTranslations } from 'next-intl/server'
import SideNav from '@/app/client/SideNav'
import type { NavGroup } from '@/app/client/SideNav'

type AssetSummary = { id: string; company_name: string | null }

export default async function SellerNav({
  unreadCount: _unreadCount,
  assets = [],
  certificationOnly = false,
}: {
  unreadCount: number
  assets?: AssetSummary[]
  /** Client demandeur CIFSO sans rôle cédant : pas de transactions ni NDA cédant */
  certificationOnly?: boolean
}) {
  const t = await getTranslations('clientSpace')

  /* ── Lien Data Room dynamique ── */
  let dataRoomItems: NavGroup['items']
  if (assets.length === 0) {
    dataRoomItems = [
      { href: '/client/seller/actifs#data-room', label: 'Data Room', icon: 'FolderLock', disabled: true },
    ]
  } else if (assets.length === 1) {
    dataRoomItems = [
      { href: `/client/seller/actifs/${assets[0].id}/documents`, label: 'Data Room', icon: 'FolderOpen' },
    ]
  } else {
    dataRoomItems = assets.map(a => ({
      href:  `/client/seller/actifs/${a.id}/documents`,
      label: a.company_name ?? `Actif #${a.id.slice(0, 6)}`,
      icon:  'FolderOpen' as const,
    }))
  }

  const groups: NavGroup[] = [
    {
      label: t('navGroupOverview'),
      items: [
        { href: '/client/seller', label: t('navDashboard'), icon: 'LayoutDashboard' },
      ],
    },
    {
      label: certificationOnly ? 'Certification CIFSO 5000' : t('navGroupFiles'),
      items: [
        { href: '/client/seller/actifs', label: certificationOnly ? 'Mes dossiers' : t('navAssets'), icon: 'Award' },
        ...(certificationOnly ? [] : [{ href: '/client/seller/transactions', label: t('navTransactions'), icon: 'ArrowRightLeft' }]),
        ...dataRoomItems,
      ],
    },
    {
      label: t('navGroupCompliance'),
      items: [
        { href: '/client/seller/kyc', label: t('navKyc'), icon: 'ShieldCheck' },
        ...(certificationOnly ? [] : [{ href: '/client/seller/nda-view', label: t('navSellerNda'), icon: 'FileText' }]),
      ],
    },
    {
      label: t('navGroupAccount'),
      items: [
        { href: '/client/seller/notifications', label: t('navNotifications'), icon: 'Bell' },
        { href: '/client/seller/account',       label: t('navMyAccount'),     icon: 'UserCircle' },
      ],
    },
  ]

  return <SideNav groups={groups} rootHref="/client/seller" />
}
