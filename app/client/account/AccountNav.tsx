import { getTranslations } from 'next-intl/server'
import SideNav from '@/app/client/SideNav'
import type { NavGroup } from '@/app/client/SideNav'

type AssetSummary = { id: string; company_name: string | null }

interface Props {
  roles:        string[]
  unreadCount:  number
  rootHref:     string
  assets?:      AssetSummary[]
}

export default async function AccountNav({ roles, unreadCount: _unreadCount, rootHref, assets = [] }: Props) {
  const t = await getTranslations('clientSpace')

  const isClient  = roles.includes('client')
  const isBuyer   = roles.includes('buyer')
  const isSeller  = roles.includes('seller')
  const isPartner = roles.includes('partner')

  /* Certification CIFSO 5000 : dossiers + data room (tout client, jamais grisé) */
  const dataRoomItems: NavGroup['items'] = assets.length === 0
    ? [{ href: '/client/seller/actifs#data-room', label: 'Data Room', icon: 'FolderLock', disabled: true }]
    : assets.length === 1
      ? [{ href: `/client/seller/actifs/${assets[0].id}/documents`, label: 'Data Room', icon: 'FolderOpen' }]
      : assets.map(a => ({ href: `/client/seller/actifs/${a.id}/documents`, label: a.company_name ?? `Dossier #${a.id.slice(0, 6)}`, icon: 'FolderOpen' as const }))
  const certificationItems: NavGroup['items'] = isClient || isSeller ? [
    { href: '/client/seller/actifs', label: 'Mes dossiers', icon: 'Award' },
    ...dataRoomItems,
  ] : []

  /* Espaces secondaires activés (pour les clients avec sous-rôles) */
  const subSpaceItems = []
  if (isClient && isBuyer) {
    subSpaceItems.push({ href: '/client/buyer',   label: 'Espace Acquéreur', icon: 'ShoppingBag' })
  }
  if (isClient && isSeller) {
    subSpaceItems.push({ href: '/client/seller',  label: 'Espace Cédant',    icon: 'Briefcase' })
  }

  /* Pour les comptes non-client (ancienne logique) */
  const legacyBackItems = []
  if (!isClient) {
    if (isBuyer || isPartner) {
      legacyBackItems.push({ href: isPartner ? '/client/partner' : '/client/buyer', label: t('navDashboard'), icon: 'LayoutDashboard' })
    } else if (isSeller) {
      legacyBackItems.push({ href: '/client/seller', label: t('navDashboard'), icon: 'LayoutDashboard' })
    }
  }

  const groups: NavGroup[] = [
    /* Espace général client */
    {
      label: isClient ? 'Mon espace' : t('navGroupAccount'),
      items: [
        { href: '/client/account', label: t('navMyAccount'), icon: 'UserCircle' },
      ],
    },
    /* Certification CIFSO 5000 */
    ...(certificationItems.length > 0 ? [{
      label: 'Certification CIFSO 5000',
      items: certificationItems,
    }] : []),
    /* Espaces de transaction (sous-rôles client) */
    ...(subSpaceItems.length > 0 ? [{
      label: 'Espaces de transaction',
      items: subSpaceItems,
    }] : []),
    /* Ancienne logique non-client */
    ...(legacyBackItems.length > 0 ? [{ label: t('navGroupOverview'), items: legacyBackItems }] : []),
  ]

  return <SideNav groups={groups} rootHref={rootHref} />
}
