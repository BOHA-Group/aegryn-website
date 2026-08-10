/**
 * GET /api/client/account/export
 *
 * Export RGPD Art.20 (EU) / Art.28 nLPD (CH) — portabilité des données.
 * Retourne un fichier JSON téléchargeable avec toutes les données personnelles
 * de l'utilisateur connecté.
 *
 * Inspiré de subblink-app/api/export-user-data.js
 */
import { NextRequest, NextResponse } from 'next/server'
import { getUser }             from '@/lib/supabaseServer'
import { createServiceClient } from '@/lib/supabase'

export async function GET(_req: NextRequest) {
  const user = await getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const supa = createServiceClient()

  const [
    profileRes,
    notificationsRes,
    kycRes,
    offersRes,
    transactionsRes,
    commissionsRes,
    introductionsRes,
  ] = await Promise.all([
    supa.from('profiles')
      .select('full_name, roles, email_notifications_enabled, created_at')
      .eq('id', user.id)
      .single(),

    supa.from('user_notifications')
      .select('id, type, title, body, read_at, dismissed_at, created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(200),

    supa.from('kyc_documents')
      .select('doc_type, status, created_at, reviewed_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false }),

    supa.from('offers')
      .select('id, asset_id, amount, status, created_at')
      .eq('buyer_id', user.id)
      .order('created_at', { ascending: false }),

    supa.from('transactions')
      .select('id, asset_id, stage, created_at')
      .or(`buyer_id.eq.${user.id},seller_id.eq.${user.id}`)
      .order('created_at', { ascending: false }),

    supa.from('commissions')
      .select('id, amount, status, created_at')
      .eq('partner_id', user.id)
      .order('created_at', { ascending: false }),

    supa.from('introductions')
      .select('id, target_name, status, created_at')
      .eq('partner_id', user.id)
      .order('created_at', { ascending: false }),
  ])

  const exportPayload = {
    export_date:   new Date().toISOString(),
    export_format: 'application/json',
    rgpd_basis:    'Art. 20 RGPD (EU) / Art. 28 nLPD (CH) — portabilité des données',
    account: {
      id:              user.id,
      email:           user.email,
      created_at:      user.created_at,
      last_sign_in_at: user.last_sign_in_at,
    },
    profile:       profileRes.data  ?? null,
    notifications: notificationsRes.data ?? [],
    kyc_documents: kycRes.data       ?? [],
    offers:        offersRes.data    ?? [],
    transactions:  transactionsRes.data ?? [],
    commissions:   commissionsRes.data  ?? [],
    introductions: introductionsRes.data ?? [],
  }

  const dateStr  = new Date().toISOString().slice(0, 10)
  const filename = `aegryn-export-${user.id.slice(0, 8)}-${dateStr}.txt`

  function sep(title: string) {
    return `\r\n${'─'.repeat(60)}\r\n${title.toUpperCase()}\r\n${'─'.repeat(60)}\r\n`
  }

  function row(label: string, value: unknown) {
    return `${String(label).padEnd(30)}${String(value ?? '—')}\r\n`
  }

  function tableSection<T extends Record<string, unknown>>(rows: T[] | null, cols: (keyof T)[]): string {
    if (!rows || rows.length === 0) return '  (aucune donnée)\r\n'
    const header = cols.map(c => String(c).padEnd(22)).join('  ') + '\r\n'
    const lines  = rows.map(r => cols.map(c => String(r[c] ?? '—').padEnd(22)).join('  ') + '\r\n')
    return header + lines.join('')
  }

  const p   = exportPayload
  const acc = p.account
  const pro = p.profile as Record<string, unknown> | null

  let txt = ''
  txt += '\uFEFF'
  txt += `Aegryn — EXPORT DE DONNÉES PERSONNELLES\r\n`
  txt += `Base légale : Art. 20 RGPD (EU) / Art. 28 nLPD (CH) — Portabilité\r\n`
  txt += `Date d'export : ${p.export_date}\r\n`

  txt += sep('Compte')
  txt += row('Identifiant', acc.id)
  txt += row('Email', acc.email)
  txt += row('Créé le', acc.created_at)
  txt += row('Dernière connexion', acc.last_sign_in_at)

  txt += sep('Profil')
  txt += row('Nom complet', pro?.full_name)
  txt += row('Rôles', Array.isArray(pro?.roles) ? (pro.roles as string[]).join(', ') : '—')
  txt += row('Notifications email', pro?.email_notifications_enabled ? 'Activées' : 'Désactivées')

  txt += sep('Documents KYC')
  txt += tableSection(p.kyc_documents as Record<string, unknown>[], ['doc_type', 'status', 'created_at', 'reviewed_at'])

  txt += sep('Offres')
  txt += tableSection(p.offers as Record<string, unknown>[], ['id', 'asset_id', 'amount', 'status', 'created_at'])

  txt += sep('Transactions')
  txt += tableSection(p.transactions as Record<string, unknown>[], ['id', 'asset_id', 'stage', 'created_at'])

  txt += sep('Commissions partenaire')
  txt += tableSection(p.commissions as Record<string, unknown>[], ['id', 'amount', 'status', 'created_at'])

  txt += sep('Introductions partenaire')
  txt += tableSection(p.introductions as Record<string, unknown>[], ['id', 'target_name', 'status', 'created_at'])

  txt += sep('Notifications (200 dernières)')
  txt += tableSection(p.notifications as Record<string, unknown>[], ['type', 'title', 'read_at', 'created_at'])

  txt += `\r\n${'─'.repeat(60)}\r\n`
  txt += `Fin de l'export — Aegryn / BOHA Group SA\r\n`

  return new NextResponse(txt, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Content-Disposition': `attachment; filename="${filename}"`,
    },
  })
}
