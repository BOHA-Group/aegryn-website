export interface GradeSheetAsset {
  id?:                 string
  company_name?:       string | null
  asset_type?:         string | null
  benchmark_category?: string | null
  arr?:                number | null
  official_grade?:     string | null
  aeg_grade?:          string | null
  score_total?:        number | null
  score_code?:         number | null
  score_ip?:           number | null
  score_finance?:      number | null
  score_security?:     number | null
  subcodes_code?:      string[] | null
  subcodes_ip?:        string[] | null
  subcodes_finance?:   string[] | null
  subcodes_security?:  string[] | null
  public_summary?:     string | null
  graded_at?:          string | null
  grading_version?:    string | null
}

function fmtDate(d: string | null | undefined): string {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('fr-CH', {
    day: '2-digit', month: 'long', year: 'numeric',
    hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Zurich',
  }) + ' (CET)'
}

function fmtChf(n: number | null | undefined): string {
  if (n == null) return '—'
  return new Intl.NumberFormat('fr-CH', {
    style: 'currency', currency: 'CHF', maximumFractionDigits: 0,
  }).format(n)
}

function scoreBar(score: number | null | undefined, max = 25): string {
  const s   = score ?? 0
  const pct = Math.round((s / max) * 100)
  const color = pct >= 80 ? '#16a34a' : pct >= 60 ? '#2563eb' : pct >= 40 ? '#d97706' : '#dc2626'
  return `
    <div style="display:flex;align-items:center;gap:10px;">
      <div style="flex:1;background:#e5e7eb;height:6px;border-radius:3px;">
        <div style="width:${pct}%;background:${color};height:6px;border-radius:3px;"></div>
      </div>
      <span style="font-family:monospace;font-size:12px;color:#374151;min-width:40px;text-align:right;">${s}/${max}</span>
    </div>`
}

function gradeColor(g: string | null | undefined): string {
  if (g === '★' || g === 'star') return '#059669'
  if (g === 'AAA' || g === 'aaa') return '#1d4ed8'
  if (g === 'AA'  || g === 'aa')  return '#16a34a'
  if (g === 'A'   || g === 'a')   return '#b45309'
  if (g === 'B'   || g === 'b')   return '#6b7280'
  return '#dc2626'
}

export function gradeSheetHtml(asset: GradeSheetAsset): string {
  const grade      = asset.official_grade ?? '—'
  const gColor     = gradeColor(asset.official_grade)
  const total      = asset.score_total ?? 0
  const gradedTs   = fmtDate(asset.graded_at)
  const generatedTs = fmtDate(new Date().toISOString())
  const ref        = (asset.id ?? 'unknown').slice(0, 8).toUpperCase()

  const dimensions = [
    { label: 'Code (C)',          key: 'C', score: asset.score_code,     subcodes: asset.subcodes_code },
    { label: 'IP & Droits (I)',   key: 'I', score: asset.score_ip,       subcodes: asset.subcodes_ip },
    { label: 'Finance (F)',       key: 'F', score: asset.score_finance,   subcodes: asset.subcodes_finance },
    { label: 'Sécurité (S)',      key: 'S', score: asset.score_security,  subcodes: asset.subcodes_security },
  ]

  const dimensionRows = dimensions.map(d => `
    <tr>
      <td style="padding:12px 16px;border-bottom:1px solid #e5e7eb;font-weight:600;color:#111827;font-size:13px;">${d.label}</td>
      <td style="padding:12px 16px;border-bottom:1px solid #e5e7eb;width:220px;">${scoreBar(d.score)}</td>
      <td style="padding:12px 16px;border-bottom:1px solid #e5e7eb;font-family:monospace;font-size:11px;color:#6b7280;">
        ${(d.subcodes ?? []).join(', ') || '—'}
      </td>
    </tr>`).join('')

  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Fiche de Grade AEGRYN — ${ref}</title>
  <style>
    @media print {
      body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      .no-print { display: none !important; }
      @page { margin: 20mm; }
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      background: #f9fafb;
      color: #111827;
      margin: 0;
      padding: 0;
    }
    .sheet {
      max-width: 800px;
      margin: 40px auto;
      background: #ffffff;
      border: 1px solid #e5e7eb;
      padding: 48px;
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 40px;
      padding-bottom: 24px;
      border-bottom: 2px solid #111827;
    }
    .logo {
      font-family: monospace;
      font-size: 11px;
      letter-spacing: 0.2em;
      text-transform: uppercase;
      color: #6b7280;
    }
    .logo strong {
      display: block;
      font-size: 20px;
      color: #111827;
      letter-spacing: -0.02em;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      margin-bottom: 2px;
    }
    .grade-badge {
      font-family: monospace;
      font-size: 36px;
      font-weight: 700;
      color: ${gColor};
      border: 2px solid ${gColor};
      padding: 8px 20px;
      text-align: center;
      min-width: 80px;
    }
    .grade-score {
      font-family: monospace;
      font-size: 12px;
      color: #6b7280;
      text-align: center;
      margin-top: 4px;
    }
    .section-title {
      font-size: 10px;
      font-family: monospace;
      text-transform: uppercase;
      letter-spacing: 0.2em;
      color: #9ca3af;
      margin-bottom: 12px;
      margin-top: 32px;
    }
    .meta-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
      margin-bottom: 8px;
    }
    .meta-item label {
      display: block;
      font-size: 10px;
      font-family: monospace;
      text-transform: uppercase;
      letter-spacing: 0.15em;
      color: #9ca3af;
      margin-bottom: 4px;
    }
    .meta-item span {
      font-size: 13px;
      color: #111827;
      font-weight: 500;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 8px;
    }
    th {
      text-align: left;
      padding: 8px 16px;
      font-size: 10px;
      font-family: monospace;
      text-transform: uppercase;
      letter-spacing: 0.15em;
      color: #6b7280;
      background: #f9fafb;
      border-bottom: 1px solid #e5e7eb;
    }
    .summary-box {
      border-left: 3px solid ${gColor};
      padding: 12px 16px;
      background: #f9fafb;
      font-size: 13px;
      color: #374151;
      line-height: 1.6;
      margin-top: 8px;
    }
    .footer {
      margin-top: 40px;
      padding-top: 20px;
      border-top: 1px solid #e5e7eb;
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
    }
    .footer-left {
      font-size: 10px;
      font-family: monospace;
      color: #9ca3af;
      line-height: 1.8;
    }
    .disclaimer {
      margin-top: 24px;
      padding: 12px 16px;
      background: #fef9c3;
      border: 1px solid #fde68a;
      font-size: 11px;
      color: #78350f;
      line-height: 1.5;
    }
    .print-btn {
      display: block;
      margin: 0 auto 24px;
      max-width: 800px;
      text-align: right;
    }
    .print-btn button {
      background: #111827;
      color: #fff;
      border: none;
      padding: 10px 20px;
      font-size: 12px;
      font-family: monospace;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      cursor: pointer;
    }
  </style>
</head>
<body>
  <div class="print-btn no-print">
    <button onclick="window.print()">Imprimer / Enregistrer PDF</button>
  </div>

  <div class="sheet">
    <!-- Header -->
    <div class="header">
      <div class="logo">
        <strong>AEGRYN</strong>
        Fiche de Grade Officielle
      </div>
      <div>
        <div class="grade-badge">${grade}</div>
        <div class="grade-score">${total}/100</div>
      </div>
    </div>

    <!-- Métadonnées actif -->
    <div class="section-title">Actif évalué</div>
    <div class="meta-grid">
      <div class="meta-item">
        <label>Référence dossier</label>
        <span>${ref}</span>
      </div>
      <div class="meta-item">
        <label>Nom de l'actif</label>
        <span>${asset.company_name ?? '—'}</span>
      </div>
      <div class="meta-item">
        <label>Type d'actif</label>
        <span>${asset.asset_type ?? '—'}</span>
      </div>
      <div class="meta-item">
        <label>Catégorie benchmark</label>
        <span>${asset.benchmark_category ?? '—'}</span>
      </div>
      <div class="meta-item">
        <label>ARR déclaré</label>
        <span>${fmtChf(asset.arr)}</span>
      </div>
      <div class="meta-item">
        <label>Version référentiel</label>
        <span>CIFS v${asset.grading_version ?? '1.0'}</span>
      </div>
    </div>

    <!-- Scores par dimension -->
    <div class="section-title">Scores par dimension (C/I/F/S)</div>
    <table>
      <thead>
        <tr>
          <th>Dimension</th>
          <th>Score</th>
          <th>Sous-codes</th>
        </tr>
      </thead>
      <tbody>
        ${dimensionRows}
      </tbody>
    </table>

    <!-- Résumé public -->
    ${asset.public_summary ? `
    <div class="section-title">Résumé certifié</div>
    <div class="summary-box">${asset.public_summary}</div>
    ` : ''}

    <!-- Disclaimer -->
    <div class="disclaimer">
      Cette fiche est un document de synthèse produit par AEGRYN à titre informatif. La certification CIFS constitue un outil d'aide à la décision et ne constitue pas un conseil en investissement au sens de la directive MiFID II. AEGRYN n'est pas partie à la transaction et ne garantit pas la valeur de l'actif ni l'issue de toute cession.
    </div>

    <!-- Footer -->
    <div class="footer">
      <div class="footer-left">
        <div>Grade attribué le : ${gradedTs}</div>
        <div>Document généré le : ${generatedTs}</div>
        <div>Référence : AEGRYN-GRADE-${ref}</div>
      </div>
      <div style="font-family:monospace;font-size:10px;color:#d1d5db;">
        aegryn.com — Confidentiel
      </div>
    </div>
  </div>
</body>
</html>`
}
