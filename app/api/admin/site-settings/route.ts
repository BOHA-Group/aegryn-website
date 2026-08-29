import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase'
import { getAdminUser }        from '@/lib/adminAuth'
import { activateEarlyAccessAndNotify } from '@/lib/magazineAccess'
import { ISSUE_01 } from '@/content/magazine/issue-01/meta'
import { ISSUE_02 } from '@/content/magazine/issue-02/meta'
import { ISSUE_03 } from '@/content/magazine/issue-03/meta'
import { ISSUE_04 } from '@/content/magazine/issue-04/meta'

const ALL_ISSUES = [ISSUE_01, ISSUE_02, ISSUE_03, ISSUE_04]
const EARLY_ACCESS_KEY_RE = /^magazine_issue_(\d{2})_early_access$/

async function verifyAdmin(req: NextRequest): Promise<boolean> {
  /* 1. Token URL (rétrocompatibilité) */
  const { searchParams } = new URL(req.url)
  const adminToken = process.env.ADMIN_LEADS_TOKEN
  if (adminToken && searchParams.get('token') === adminToken) return true
  /* 2. Session Supabase admin */
  const user = await getAdminUser()
  return !!user
}

export async function GET(req: NextRequest) {
  if (!(await verifyAdmin(req))) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const supa = createServiceClient()
  const { data, error } = await supa
    .from('site_settings')
    .select('key, value')

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ settings: data })
}

export async function PATCH(req: NextRequest) {
  if (!(await verifyAdmin(req))) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json() as { key: string; value: unknown }
  if (!body.key) return NextResponse.json({ error: 'key required' }, { status: 400 })

  const supa = createServiceClient()

  /* Détecte l'activation (false→true) du flag early_access — déclenche
     l'envoi des emails d'accès anticipé aux inscrits (newsletter + wishlist).
     On lit la valeur AVANT l'upsert pour ne notifier qu'une seule fois. */
  const earlyAccessMatch = body.key.match(EARLY_ACCESS_KEY_RE)
  let notifyResult: { token: string; sent: number } | null = null

  if (earlyAccessMatch && body.value === true) {
    const issuePad = earlyAccessMatch[1]
    const { data: prevRow } = await supa
      .from('site_settings')
      .select('value')
      .eq('key', body.key)
      .maybeSingle()
    const wasAlreadyActive = prevRow?.value === true || prevRow?.value === 'true'

    if (!wasAlreadyActive) {
      const issue = ALL_ISSUES.find(i => String(i.number).padStart(2, '0') === issuePad)
      if (issue) {
        notifyResult = await activateEarlyAccessAndNotify({
          issuePad,
          issueLabel: `Issue ${issuePad} — ${issue.title}`,
          issueTheme: issue.theme,
        })
      }
    }
  }

  const { error } = await supa
    .from('site_settings')
    .upsert({ key: body.key, value: body.value, updated_at: new Date().toISOString() })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true, notified: notifyResult?.sent ?? undefined })
}
