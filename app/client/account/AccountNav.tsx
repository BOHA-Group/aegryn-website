import { getTranslations } from 'next-intl/server'
import SideNav from '@/app/client/SideNav'
import type { NavGroup } from '@/app/client/SideNav'

interface Props {
  roles:        string[]
  unreadCount:  number
  rootHref:     string
}

export default async function AccountNav({ roles, unreadCount: _unreadCount, rootHref }: Props) {
  const t = await getTranslations('clientSpace')

  const isClient  = roles.includes('client')
  const isBuyer   = roles.includes('buyer')
  const isSeller  = roles.includes('seller')
  const isPartner = roles.includes('partner')

  /* Espaces secondaires activés (pour les clients avec sous-rôles) */
  const subSpaceItems = []
  if (isClient && isBuyer) {
    subSpaceItems.push({ href: '/client/buyer',   label: 'Espace Acquéreur', icon: 'ShoppingBag', locked: true })
  }
  if (isClient && isSeller) {
    subSpaceItems.push({ href: '/client/seller',  label: 'Espace Cédant',    icon: 'Briefcase',   locked: true })
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
    /* Espaces de transaction (sous-rôles client, grisés) */
    ...(subSpaceItems.length > 0 ? [{
      label: 'Espaces de transaction',
      items: subSpaceItems,
    }] : []),
    /* Ancienne logique non-client */
    ...(legacyBackItems.length > 0 ? [{ label: t('navGroupOverview'), items: legacyBackItems }] : []),
  ]

  return <SideNav groups={groups} rootHref={rootHref} />
}
