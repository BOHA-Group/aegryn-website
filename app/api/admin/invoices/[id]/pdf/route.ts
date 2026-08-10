import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient }      from '@/lib/supabase'
import { getUser }                  from '@/lib/supabaseServer'
import chromium                     from '@sparticuz/chromium-min'
import puppeteer                    from 'puppeteer-core'

type Params = { params: Promise<{ id: string }> }

function fmtMoney(n: number, currency = 'CHF') {
  return new Intl.NumberFormat('fr-CH', {
    style: 'currency', currency, minimumFractionDigits: 2,
  }).format(n)
}

function fmtDate(d: string | null) {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('fr-CH', { day: '2-digit', month: 'long', year: 'numeric' })
}

function buildHtml(inv: Record<string, unknown>): string {
  const items = (inv.line_items as { description: string; unit: string; qty: number; unit_price_ht: number }[]) ?? []
  const currency = String(inv.currency ?? 'CHF')

  /* Échéance : utilise due_date ou calcule +30 jours depuis issued_at */
  const dueDate: string | null = inv.due_date
    ? String(inv.due_date)
    : (() => {
        const base = inv.issued_at ? new Date(String(inv.issued_at)) : new Date()
        base.setDate(base.getDate() + 30)
        return base.toISOString().split('T')[0]
      })()

  const rows = items.map(l => `
    <tr>
      <td style="padding:8px 10px;border-bottom:1px solid #eee;font-size:12px;color:#374151">${l.description || '—'}</td>
      <td style="padding:8px 10px;border-bottom:1px solid #eee;font-size:12px;color:#374151;text-align:center">${l.unit}</td>
      <td style="padding:8px 10px;border-bottom:1px solid #eee;font-size:12px;color:#374151;text-align:center">${l.qty}</td>
      <td style="padding:8px 10px;border-bottom:1px solid #eee;font-size:12px;color:#374151;text-align:right;font-family:monospace">${fmtMoney(l.unit_price_ht, currency)}</td>
      <td style="padding:8px 10px;border-bottom:1px solid #eee;font-size:12px;font-weight:600;text-align:right;font-family:monospace">${fmtMoney(l.qty * l.unit_price_ht, currency)}</td>
    </tr>
  `).join('')

  return `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>Facture ${inv.invoice_number}</title>
<style>
  @media print {
    @page { size: A4; margin: 20mm 18mm; }
    body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Helvetica Neue', Arial, sans-serif; color: #111; background: #fff; padding: 40px; max-width: 740px; margin: 0 auto; }
  .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 40px; }
  .logo-block h1 { font-size: 18px; font-weight: 700; letter-spacing: -0.02em; }
  .logo-block p { font-size: 10px; color: #9ca3af; margin-top: 2px; font-family: monospace; }
  .invoice-meta { text-align: right; }
  .invoice-meta .num { font-size: 14px; font-weight: 700; color: #1a3c5e; font-family: monospace; }
  .invoice-meta p { font-size: 10px; color: #6b7280; margin-top: 2px; }
  .section-label { font-size: 9px; text-transform: uppercase; letter-spacing: 0.18em; color: #9ca3af; margin-bottom: 6px; font-family: monospace; }
  .divider { border: none; border-top: 1px solid #e5e7eb; margin: 24px 0; }
  .recipient { margin-bottom: 30px; }
  .recipient .name { font-size: 13px; font-weight: 600; color: #111; }
  .recipient .sub { font-size: 12px; color: #6b7280; margin-top: 2px; }
  table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
  thead tr { border-bottom: 2px solid #111; }
  thead th { font-size: 9px; text-transform: uppercase; letter-spacing: 0.14em; color: #6b7280; padding: 6px 10px; font-family: monospace; font-weight: 600; }
  .totals { display: flex; flex-direction: column; align-items: flex-end; gap: 6px; margin-bottom: 30px; }
  .totals .row { display: flex; gap: 80px; justify-content: flex-end; font-size: 12px; color: #374151; }
  .totals .row.grand { font-size: 15px; font-weight: 700; color: #111; border-top: 1px solid #e5e7eb; padding-top: 8px; margin-top: 4px; }
  .bank { background: #f9fafb; border: 1px solid #e5e7eb; padding: 16px; margin-top: 24px; }
  .bank p { font-size: 11px; color: #374151; margin-top: 4px; }
  .bank .iban { font-family: monospace; font-size: 12px; font-weight: 600; color: #111; }
</style>
</head>
<body>
  <div class="header">
    <div class="logo-block">
      <p style="font-weight:600;font-size:12px">Aegryn (par BOHA-Group Sàrl)</p>
      <p>Rue du Centre 142, 1025 Saint-Sulpice, Suisse.</p>
      <p>CHE-402.011.821 TVA.</p>
      <p style="margin-top:3px">finance@boha-group.com</p>
      <p>+41 (0) 79 590 18 81</p>
    </div>
    <div class="invoice-meta">
      <div class="num">${inv.invoice_number}</div>
      <p>Émise le ${fmtDate(String(inv.issued_at ?? ''))}</p>
      <p>Échéance : ${fmtDate(dueDate)}</p>
      <p style="margin-top:6px;font-size:10px;background:#f3f4f6;padding:2px 6px;display:inline-block;text-transform:uppercase;letter-spacing:0.1em">
        ${inv.status === 'paid' ? '✓ Payée' : inv.status === 'sent' ? 'Envoyée' : inv.status === 'cancelled' ? 'Annulée' : 'Brouillon'}
      </p>
    </div>
  </div>

  <hr class="divider"/>

  <div class="recipient">
    <div class="section-label">Facturer à</div>
    <div class="name">${inv.recipient_name || '—'}</div>
    ${inv.recipient_company ? `<div class="sub">${inv.recipient_company}</div>` : ''}
    ${inv.recipient_address ? `<div class="sub" style="white-space:pre-line">${inv.recipient_address}</div>` : ''}
    <div class="sub">${inv.recipient_email}</div>
    ${inv.recipient_vat_num ? `<div class="sub">N° TVA : ${inv.recipient_vat_num}</div>` : ''}
  </div>

  <table>
    <thead>
      <tr>
        <th style="text-align:left">Description</th>
        <th style="text-align:center">Unité</th>
        <th style="text-align:center">Qté</th>
        <th style="text-align:right">P.U. HT</th>
        <th style="text-align:right">Total HT</th>
      </tr>
    </thead>
    <tbody>${rows}</tbody>
  </table>

  <div class="totals">
    <div class="row"><span>Sous-total HT</span><span style="font-family:monospace">${fmtMoney(Number(inv.subtotal_ht ?? 0), currency)}</span></div>
    <div class="row"><span>TVA (${inv.vat_rate ?? 0}%)</span><span style="font-family:monospace">${fmtMoney(Number(inv.vat_amount ?? 0), currency)}</span></div>
    <div class="row grand"><span>Total TTC</span><span style="font-family:monospace">${fmtMoney(Number(inv.total_ttc ?? 0), currency)}</span></div>
    ${Number(inv.vat_rate ?? 0) === 0 ? '<p style="font-size:10px;color:#9ca3af;margin-top:6px">TVA non applicable — prestation exonérée ou opération hors champ.</p>' : ''}
  </div>

  <div class="bank">
    <div class="section-label">Modalités de paiement</div>
    <p>Les coordonnées bancaires pour le virement vous seront transmises séparément par l&apos;équipe Aegryn.</p>
    <p style="margin-top:6px">Référence à indiquer lors du virement : <strong>${inv.invoice_number}</strong></p>
  </div>

</body>
</html>`
}

export async function POST(_req: NextRequest, { params }: Params) {
  const { id } = await params
  let browser: Awaited<ReturnType<typeof puppeteer.launch>> | null = null
  try {
    const user = await getUser()
    if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })

    const supa = createServiceClient()
    const { data: profile } = await supa.from('profiles').select('roles').eq('id', user.id).single()
    if (!profile?.roles?.includes('admin')) {
      return NextResponse.json({ error: 'forbidden' }, { status: 403 })
    }

    const { data: inv, error } = await supa.from('invoices').select('*').eq('id', id).single()
    if (error || !inv) return NextResponse.json({ error: 'not_found' }, { status: 404 })

    const html = buildHtml(inv as Record<string, unknown>)

    /* Génération PDF via headless Chrome */
    const executablePath = await chromium.executablePath(
      'https://github.com/Sparticuz/chromium/releases/download/v131.0.1/chromium-v131.0.1-pack.tar'
    )
    browser = await puppeteer.launch({
      args:           chromium.args,
      executablePath,
      headless:       true,
    })
    const page = await browser.newPage()
    await page.setContent(html, { waitUntil: 'load' })
    const pdfBuffer = await page.pdf({
      format:            'A4',
      margin:            { top: '20mm', bottom: '20mm', left: '18mm', right: '18mm' },
      printBackground:   true,
    })

    const invoiceNum = String(inv.invoice_number ?? id)
    const storagePath = `invoices/${invoiceNum}.pdf`
    await supa.from('invoices').update({ pdf_storage_path: storagePath }).eq('id', id)

    return new NextResponse(Buffer.from(pdfBuffer), {
      headers: {
        'Content-Type':        'application/pdf',
        'Content-Disposition': `attachment; filename="${invoiceNum}.pdf"`,
      },
    })
  } catch {
    return NextResponse.json({ error: 'internal' }, { status: 500 })
  } finally {
    if (browser) await browser.close()
  }
}
