/**
 * lib/indexConnectors.ts — Connecteurs de collecte automatique du CIFSO Valuation Index
 *
 * Chaque connecteur interroge un flux officiel ouvert (aucune clé, aucune action manuelle)
 * et renvoie des observations normalisées. Les noms de sources ne sont jamais exposés aux
 * clients (colonne source_internal) : la source affichée est « Aegryn CIFSO Valuation Index ».
 *
 * Flux utilisés :
 *   - Banque centrale européenne (SDMX REST) : rendement 10 ans zone euro, taux de dépôt,
 *     indice actions Euro Stoxx (contexte de valorisation, dimension F)
 *   - Eurostat (JSON-stat) : croissance du PIB réel et inflation HICP zone euro
 *   - Banque nationale suisse (data.snb.ch) : taux directeurs BNS, Fed, BCE, BoE
 *
 *   - Eurostat, enquête TIC entreprises : adoption de l'IA et mesures de sécurité (dimension S),
 *     défaillances et créations d'entreprises par secteur (dimension F)
 *   - BCE : change EUR/CHF, taux des crédits aux entreprises ; BNS : rendements Confédération,
 *     change, indice SPI
 *
 *   - SEC EDGAR (registre officiel américain, API XBRL ouverte) : comparables cotés par cluster,
 *     multiple prix / revenu (flottant public / chiffre d'affaires) et croissance du revenu,
 *     panier de sociétés cotées représentatives (nombre d'entre elles sont européennes cotées
 *     aux États-Unis). Compense les comparables cotés vendus sous licence.
 *   - Eurostat SBS (statistiques structurelles) : taux de marge brute d'exploitation et valeur
 *     ajoutée par salarié par secteur NACE, rapprochés des cinq clusters.
 *
 * Les multiples de transactions privées restent issus des séries curées par Aegryn et des
 * dossiers certifiés : aucun flux officiel ouvert ne publie de multiples M&A privés.
 */

export interface Observation {
  scope_type: 'market' | 'cluster'
  scope_key: string        // ex. 'euro_area', 'switzerland', 'united_states' ou une clé de cluster
  metric: 'rate_10y' | 'policy_rate' | 'equity_index' | 'gdp_growth' | 'inflation' | 'fx_eurchf' | 'lending_rate'
        | 'ai_adoption' | 'security_risk_assessment' | 'security_tests' | 'security_policy' | 'bankruptcies_yoy' | 'registrations_yoy'
        | 'public_comps_p_revenue' | 'public_comps_revenue_growth' | 'sector_operating_margin' | 'sector_value_added_per_employee'
  period: string           // date ou période de l'observation
  value: number            // médiane (p50) quand p25 / p75 sont fournis
  p25?: number
  p75?: number
  sample_size?: number
  unit: '%' | 'index' | 'x' | 'keur'
  is_public: boolean
}
export interface ConnectorResult { rows: Observation[]; latest: string | null }
export interface Connector {
  key: string
  name: string
  kind: 'official_api'
  /** Priorité géographique : Suisse et Europe d'abord */
  region: 'CH' | 'EU' | 'INTL'
  run: () => Promise<ConnectorResult>
}

const TIMEOUT_MS = 12_000
async function getJson(url: string, headers: Record<string, string> = {}): Promise<unknown> {
  const ctrl = new AbortController()
  const t = setTimeout(() => ctrl.abort(), TIMEOUT_MS)
  try {
    const res = await fetch(url, { headers: { Accept: 'application/json', 'User-Agent': 'Aegryn-CIFSO-Index/1.0 (contact@aegryn.com)', ...headers }, signal: ctrl.signal, cache: 'no-store' })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    return await res.json()
  } finally { clearTimeout(t) }
}

/* ── BCE : SDMX-JSON ───────────────────────────────────────────────────────── */
function parseEcb(json: unknown): { period: string; value: number }[] {
  const d = json as { dataSets: { series: Record<string, { observations: Record<string, number[]> }> }[]; structure: { dimensions: { observation: { values: { id: string }[] }[] } } }
  const series = d.dataSets[0].series
  const key = Object.keys(series)[0]
  const times = d.structure.dimensions.observation[0].values
  return Object.entries(series[key].observations).map(([i, v]) => ({ period: times[Number(i)].id, value: v[0] })).filter(o => Number.isFinite(o.value))
}
async function ecb(flow: string, keyPath: string, n = 8) {
  return parseEcb(await getJson(`https://data-api.ecb.europa.eu/service/data/${flow}/${keyPath}?lastNObservations=${n}&format=jsondata`))
}

/* ── Eurostat : JSON-stat 2.0 ──────────────────────────────────────────────── */
function parseEurostat(json: unknown, geo: string): { period: string; value: number }[] {
  const d = json as { id: string[]; size: number[]; dimension: Record<string, { category: { index: Record<string, number> } }>; value: Record<string, number> }
  const ti = d.id.indexOf('time'), gi = d.id.indexOf('geo')
  const tInv = Object.fromEntries(Object.entries(d.dimension.time.category.index).map(([k, v]) => [v, k]))
  const gInv = Object.fromEntries(Object.entries(d.dimension.geo.category.index).map(([k, v]) => [v, k]))
  const strides = Array(d.size.length).fill(1)
  for (let i = d.size.length - 2; i >= 0; i--) strides[i] = strides[i + 1] * d.size[i + 1]
  const out: { period: string; value: number }[] = []
  for (const [k, v] of Object.entries(d.value)) {
    const idx = d.size.map((s, i) => Math.floor(Number(k) / strides[i]) % s)
    if (gInv[idx[gi]] === geo) out.push({ period: tInv[idx[ti]], value: v })
  }
  return out.sort((a, b) => a.period.localeCompare(b.period))
}
async function eurostat(dataset: string, geo: string, filters: Record<string, string> = {}) {
  const q = Object.entries(filters).map(([k, v]) => `&${k}=${encodeURIComponent(v)}`).join('')
  return parseEurostat(await getJson(`https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/${dataset}?geo=${geo}${q}&format=JSON&lang=EN`), geo)
}
/* Dernière observation disponible (les périodes les plus récentes peuvent être vides ou provisoires : on remonte jusqu'à 4 périodes) */
async function eurostatLast(dataset: string, geo: string, filters: Record<string, string>) {
  const rows = await eurostat(dataset, geo, { ...filters, lastTimePeriod: '4' })
  return rows.filter(r => Number.isFinite(r.value)).at(-1) ?? null
}

/* ── BNS : data.snb.ch ─────────────────────────────────────────────────────── */
async function snbPolicyRates(): Promise<{ label: string; period: string; value: number }[]> {
  const d = await getJson('https://data.snb.ch/api/cube/snboffzisa/data/json/en') as { timeseries: { header: { dimItem: string }[]; values: { date: string; value: number | null }[] }[] }
  return d.timeseries.map(ts => {
    const vals = ts.values.filter(v => v.value != null)
    const last = vals[vals.length - 1]
    return { label: ts.header.map(h => h.dimItem).join(' '), period: last?.date ?? '', value: Number(last?.value) }
  }).filter(x => x.period && Number.isFinite(x.value))
}

/* Lecture générique d'un cube BNS : dernière valeur d'une série identifiée par un extrait de son en-tête */
async function snbLast(cube: string, needle: string): Promise<{ period: string; value: number } | null> {
  const d = await getJson(`https://data.snb.ch/api/cube/${cube}/data/json/en`) as { timeseries: { header: { dimItem: string }[]; values: { date: string; value: number | null }[] }[] }
  const ts = d.timeseries.find(t => t.header.map(h => h.dimItem).join(' ').includes(needle))
  const vals = (ts?.values ?? []).filter(v => v.value != null)
  const last = vals[vals.length - 1]
  return last ? { period: last.date, value: Number(last.value) } : null
}

const obs = (scope_key: string, metric: Observation['metric'], o: { period: string; value: number } | null, unit: Observation['unit'], is_public: boolean): Observation[] =>
  o && Number.isFinite(o.value) ? [{ scope_type: 'market', scope_key, metric, period: o.period, value: r2(o.value), unit, is_public }] : []

const latestOf = (rows: Observation[]) => rows.map(r => r.period).sort().at(-1) ?? null

const ALL_CONNECTORS: Connector[] = [
  {
    key: 'ecb_rates', name: 'Banque centrale européenne : rendement 10 ans et taux de dépôt', kind: 'official_api', region: 'EU',
    async run() {
      const [y10, dfr] = await Promise.all([ecb('YC', 'B.U2.EUR.4F.G_N_A.SV_C_YM.SR_10Y', 5), ecb('FM', 'B.U2.EUR.4F.KR.DFR.LEV', 3)])
      const rows: Observation[] = [
        ...y10.slice(-1).map(o => ({ scope_type: 'market' as const, scope_key: 'euro_area', metric: 'rate_10y' as const, period: o.period, value: r2(o.value), unit: '%' as const, is_public: true })),
        ...dfr.slice(-1).map(o => ({ scope_type: 'market' as const, scope_key: 'euro_area', metric: 'policy_rate' as const, period: o.period, value: r2(o.value), unit: '%' as const, is_public: true })),
      ]
      return { rows, latest: latestOf(rows) }
    },
  },
  {
    key: 'ecb_equity', name: 'Banque centrale européenne : indice actions Euro Stoxx (mensuel)', kind: 'official_api', region: 'EU',
    async run() {
      const idx = await ecb('FM', 'M.U2.EUR.DS.EI.DJEURST.HSTA', 13)
      const rows: Observation[] = idx.slice(-1).map(o => ({ scope_type: 'market' as const, scope_key: 'euro_area', metric: 'equity_index' as const, period: o.period, value: r2(o.value), unit: 'index' as const, is_public: false }))
      /* Variation sur 12 mois, exprimée en % (contexte de valorisation) */
      if (idx.length >= 13) {
        const a = idx[0].value, b = idx[idx.length - 1].value
        rows.push({ scope_type: 'market', scope_key: 'euro_area_12m', metric: 'equity_index', period: idx[idx.length - 1].period, value: r2(((b / a) - 1) * 100), unit: '%', is_public: true })
      }
      return { rows, latest: latestOf(rows) }
    },
  },
  {
    key: 'eurostat_macro', name: 'Eurostat : croissance du PIB réel et inflation HICP, zone euro', kind: 'official_api', region: 'EU',
    async run() {
      const [gdp, hicp] = await Promise.all([eurostat('tec00115', 'EA20'), eurostat('tec00118', 'EA20')])
      const rows: Observation[] = [
        ...gdp.slice(-1).map(o => ({ scope_type: 'market' as const, scope_key: 'euro_area', metric: 'gdp_growth' as const, period: o.period, value: r2(o.value), unit: '%' as const, is_public: true })),
        ...hicp.slice(-1).map(o => ({ scope_type: 'market' as const, scope_key: 'euro_area', metric: 'inflation' as const, period: o.period, value: r2(o.value), unit: '%' as const, is_public: true })),
      ]
      return { rows, latest: latestOf(rows) }
    },
  },
  {
    key: 'snb_policy', name: 'Banque nationale suisse : taux directeurs BNS, Fed, BCE, BoE', kind: 'official_api', region: 'CH',
    async run() {
      const all = await snbPolicyRates()
      const pick = (needle: string, key: string): Observation[] => {
        const s = all.find(x => x.label.includes(needle))
        return s ? [{ scope_type: 'market', scope_key: key, metric: 'policy_rate', period: s.period, value: r2(s.value), unit: '%', is_public: key === 'switzerland' }] : []
      }
      const rows = [...pick('SNB policy rate', 'switzerland'), ...pick('Fed target range - Upper', 'united_states'), ...pick('Bank of England', 'united_kingdom')]
      return { rows, latest: latestOf(rows) }
    },
  },
  {
    key: 'snb_markets', name: 'Banque nationale suisse : rendement Confédération 10 ans, change EUR/CHF, indice SPI', kind: 'official_api', region: 'CH',
    async run() {
      const [y10, fx, spi] = await Promise.all([snbLast('rendoblim', '10 year'), snbLast('devkum', 'Monthly average Europe - EUR 1'), snbLast('capchstocki', 'SPI Swiss Performance Index - Index total')])
      const rows = [...obs('switzerland', 'rate_10y', y10, '%', true), ...obs('switzerland', 'fx_eurchf', fx, 'index', true), ...obs('switzerland', 'equity_index', spi, 'index', false)]
      return { rows, latest: latestOf(rows) }
    },
  },
  {
    key: 'ecb_credit_fx', name: 'Banque centrale européenne : taux des crédits aux entreprises, change EUR/CHF', kind: 'official_api', region: 'EU',
    async run() {
      const [lend, fx] = await Promise.all([ecb('MIR', 'M.U2.B.A2A.A.R.A.2240.EUR.N', 2), ecb('EXR', 'D.CHF.EUR.SP00.A', 2)])
      const rows = [...obs('euro_area', 'lending_rate', lend.at(-1) ?? null, '%', true), ...obs('euro_area', 'fx_eurchf', fx.at(-1) ?? null, 'index', false)]
      return { rows, latest: latestOf(rows) }
    },
  },
  {
    key: 'eurostat_gdp_q', name: 'Eurostat : PIB trimestriel zone euro (glissement annuel) et inflation mensuelle', kind: 'official_api', region: 'EU',
    async run() {
      const [gdp, hicp] = await Promise.all([eurostatLast('teina011', 'EA20', { unit: 'PCH_Q4_SCA', na_item: 'B1GQ' }), eurostatLast('prc_hicp_manr', 'EA20', { coicop: 'CP00' })])
      const rows = [...obs('euro_area_q', 'gdp_growth', gdp, '%', true), ...obs('euro_area_m', 'inflation', hicp, '%', true)]
      return { rows, latest: latestOf(rows) }
    },
  },
  {
    key: 'eurostat_ai_security', name: 'Eurostat, enquête TIC : adoption de l\'IA et mesures de sécurité des entreprises (UE et pays voisins)', kind: 'official_api', region: 'EU',
    async run() {
      const rows: Observation[] = []
      for (const geo of ['EU27_2020', 'DE', 'FR', 'IT', 'NL', 'ES']) {
        const key = geo === 'EU27_2020' ? 'eu27' : geo.toLowerCase()
        const [ai, risk, tests, pol] = await Promise.all([
          eurostatLast('isoc_eb_ai', geo, { indic_is: 'E_AI_TANY', size_emp: 'GE10', unit: 'PC_ENT' }).catch(() => null),
          eurostatLast('isoc_cisce_ra', geo, { indic_is: 'E_SECMRASS', size_emp: 'GE10', unit: 'PC_ENT' }).catch(() => null),
          eurostatLast('isoc_cisce_ra', geo, { indic_is: 'E_SECMTST', size_emp: 'GE10', unit: 'PC_ENT' }).catch(() => null),
          eurostatLast('isoc_cisce_ra', geo, { indic_is: 'E_SECMANY', size_emp: 'GE10', unit: 'PC_ENT_SECPOL1' }).catch(() => null),
        ])
        const pub = geo === 'EU27_2020'
        rows.push(...obs(key, 'ai_adoption', ai, '%', pub), ...obs(key, 'security_risk_assessment', risk, '%', pub), ...obs(key, 'security_tests', tests, '%', false), ...obs(key, 'security_policy', pol, '%', false))
      }
      return { rows, latest: latestOf(rows) }
    },
  },
  {
    key: 'eurostat_business_demo', name: 'Eurostat : défaillances et créations d\'entreprises par secteur (UE, trimestriel)', kind: 'official_api', region: 'EU',
    async run() {
      const rows: Observation[] = []
      const sectors: [string, string][] = [['B-S_X_O_S94', 'eu27_all'], ['J', 'eu27_ict'], ['K-N', 'eu27_finance_services'], ['B-E', 'eu27_industry'], ['G', 'eu27_trade']]
      for (const [nace, key] of sectors) {
        const [bk, reg] = await Promise.all([
          eurostatLast('sts_rb_q', 'EU27_2020', { indic_bt: 'BKRT', nace_r2: nace, s_adj: 'NSA', unit: 'PCH_SM' }).catch(() => null),
          eurostatLast('sts_rb_q', 'EU27_2020', { indic_bt: 'REG', nace_r2: nace, s_adj: 'NSA', unit: 'PCH_SM' }).catch(() => null),
        ])
        rows.push(...obs(key, 'bankruptcies_yoy', bk, '%', key === 'eu27_all'), ...obs(key, 'registrations_yoy', reg, '%', key === 'eu27_all'))
      }
      return { rows, latest: latestOf(rows) }
    },
  },
]

/* ── SEC EDGAR : comparables cotés par cluster ────────────────────────────── */
/* Panier de sociétés cotées représentatives par cluster (tickers SEC). Le multiple est un
   proxy prix / revenu : flottant public (dei:EntityPublicFloat, dernier exercice) rapporté au
   revenu annuel (us-gaap). Percentiles p25 / p50 / p75 par cluster. */
const SEC_BASKET: Record<string, string[]> = {
  tech_innovation:   ['CRM', 'ADBE', 'NOW', 'WDAY', 'INTU', 'ORCL', 'SNOW', 'DDOG', 'MDB', 'HUBS', 'TEAM', 'ZS', 'CRWD', 'PANW', 'FTNT', 'OKTA', 'NET', 'TWLO', 'DT', 'GTLB', 'PATH', 'S', 'ESTC', 'CFLT', 'BRZE', 'MNDY', 'WIX', 'SPOT', 'DBX', 'BOX'],
  finance_capital:   ['PYPL', 'XYZ', 'AFRM', 'SOFI', 'COIN', 'LC', 'UPST', 'GPN', 'FIS', 'FI', 'TOST', 'BILL', 'FLYW', 'PAYO', 'NU', 'HOOD', 'INTU', 'LMND', 'ROOT', 'OPEN'],
  sante_sciences:    ['VEEV', 'DOCS', 'TDOC', 'HIMS', 'RMD', 'ISRG', 'DXCM', 'ALGN', 'IQV', 'EXAS', 'PODD', 'MASI', 'GEHC', 'EW', 'IDXX', 'ILMN', 'TXG', 'PHR', 'ONEM', 'CERT'],
  industrie_infra:   ['ROK', 'EMR', 'ETN', 'TT', 'PH', 'CARR', 'JCI', 'GNRC', 'ENPH', 'SEDG', 'PTC', 'ANSS', 'ADSK', 'TRMB', 'CGNX', 'ZBRA', 'FLNC', 'ARRY', 'SHLS', 'NVT'],
  commerce_services: ['SHOP', 'ETSY', 'EBAY', 'BKNG', 'ABNB', 'UBER', 'DASH', 'CHWY', 'W', 'EXPE', 'TRIP', 'LYFT', 'CART', 'RVLV', 'GLBE', 'CPNG', 'MELI', 'SE', 'JMIA', 'FVRR'],
}
const SEC_UA = { 'User-Agent': 'Aegryn CIFSO Valuation Index contact@aegryn.com' }
function percentiles(values: number[]) {
  const s = [...values].sort((a, b) => a - b)
  const q = (p: number) => { const i = (s.length - 1) * p; const lo = Math.floor(i), hi = Math.ceil(i); return s[lo] + (s[hi] - s[lo]) * (i - lo) }
  return { p25: q(0.25), p50: q(0.5), p75: q(0.75), n: s.length }
}
async function secPublicComps(): Promise<Observation[]> {
  const year = new Date().getFullYear() - 1                       // dernier exercice complet publié
  type Frame = { data: { cik: number; val: number; end: string }[] }
  const [tickers, rev1, rev2, revPrev1, revPrev2, floatQ2, floatQ4] = await Promise.all([
    getJson('https://www.sec.gov/files/company_tickers.json', SEC_UA) as Promise<Record<string, { cik_str: number; ticker: string }>>,
    getJson(`https://data.sec.gov/api/xbrl/frames/us-gaap/RevenueFromContractWithCustomerExcludingAssessedTax/USD/CY${year}.json`, SEC_UA) as Promise<Frame>,
    getJson(`https://data.sec.gov/api/xbrl/frames/us-gaap/Revenues/USD/CY${year}.json`, SEC_UA) as Promise<Frame>,
    getJson(`https://data.sec.gov/api/xbrl/frames/us-gaap/RevenueFromContractWithCustomerExcludingAssessedTax/USD/CY${year - 1}.json`, SEC_UA) as Promise<Frame>,
    getJson(`https://data.sec.gov/api/xbrl/frames/us-gaap/Revenues/USD/CY${year - 1}.json`, SEC_UA) as Promise<Frame>,
    getJson(`https://data.sec.gov/api/xbrl/frames/dei/EntityPublicFloat/USD/CY${year}Q2I.json`, SEC_UA).catch(() => ({ data: [] })) as Promise<Frame>,
    getJson(`https://data.sec.gov/api/xbrl/frames/dei/EntityPublicFloat/USD/CY${year}Q4I.json`, SEC_UA).catch(() => ({ data: [] })) as Promise<Frame>,
  ])
  const cikOf = new Map(Object.values(tickers).map(t => [t.ticker.toUpperCase(), t.cik_str]))
  const byCik = (f: Frame) => new Map(f.data.map(d => [d.cik, d.val]))
  const R1 = byCik(rev1), R2 = byCik(rev2), P1 = byCik(revPrev1), P2 = byCik(revPrev2), F2 = byCik(floatQ2), F4 = byCik(floatQ4)
  const rows: Observation[] = []
  for (const [cluster, list] of Object.entries(SEC_BASKET)) {
    const mult: number[] = [], growth: number[] = []
    for (const tk of list) {
      const cik = cikOf.get(tk); if (!cik) continue
      const rev = R1.get(cik) ?? R2.get(cik); const prev = P1.get(cik) ?? P2.get(cik); const flt = F2.get(cik) ?? F4.get(cik)
      if (rev && rev > 0 && flt && flt > 0) mult.push(flt / rev)
      if (rev && prev && prev > 0) growth.push(((rev / prev) - 1) * 100)
    }
    if (mult.length >= 5) {
      const m = percentiles(mult)
      rows.push({ scope_type: 'cluster', scope_key: cluster, metric: 'public_comps_p_revenue', period: `CY${year}`, value: r2(m.p50), p25: r2(m.p25), p75: r2(m.p75), sample_size: m.n, unit: 'x', is_public: cluster === 'tech_innovation' })
    }
    if (growth.length >= 5) {
      const g = percentiles(growth)
      rows.push({ scope_type: 'cluster', scope_key: cluster, metric: 'public_comps_revenue_growth', period: `CY${year}`, value: r2(g.p50), p25: r2(g.p25), p75: r2(g.p75), sample_size: g.n, unit: '%', is_public: cluster === 'tech_innovation' })
    }
  }
  return rows
}

/* ── Eurostat SBS : marges et productivité par secteur, rapprochées des clusters ── */
const SBS_NACE: Record<string, string> = { tech_innovation: 'J', finance_capital: 'K64-K66', sante_sciences: 'Q', industrie_infra: 'C', commerce_services: 'G' }

const ALL_CONNECTORS_EXT: Connector[] = [
  {
    key: 'sec_public_comps', name: 'SEC EDGAR : comparables cotés par cluster (prix / revenu, croissance du revenu), panier de 110 sociétés', kind: 'official_api', region: 'INTL',
    async run() { const rows = await secPublicComps(); return { rows, latest: latestOf(rows) } },
  },
  {
    key: 'eurostat_sbs', name: 'Eurostat, statistiques structurelles : taux de marge d\'exploitation et valeur ajoutée par salarié par secteur', kind: 'official_api', region: 'EU',
    async run() {
      const rows: Observation[] = []
      for (const [cluster, nace] of Object.entries(SBS_NACE)) {
        const [gor, va] = await Promise.all([
          eurostatLast('sbs_ovw_act', 'EU27_2020', { nace_r2: nace, indic_sbs: 'GOR_PC' }).catch(() => null),
          eurostatLast('sbs_ovw_act', 'EU27_2020', { nace_r2: nace, indic_sbs: 'AV_SAL_TEUR' }).catch(() => null),
        ])
        if (gor) rows.push({ scope_type: 'cluster', scope_key: cluster, metric: 'sector_operating_margin', period: gor.period, value: r2(gor.value), unit: '%', is_public: cluster === 'tech_innovation' })
        if (va)  rows.push({ scope_type: 'cluster', scope_key: cluster, metric: 'sector_value_added_per_employee', period: va.period, value: r2(va.value), unit: 'keur', is_public: false })
      }
      return { rows, latest: latestOf(rows) }
    },
  },
]

/* Priorité Suisse puis Europe, puis international */
const ORDER: Record<Connector['region'], number> = { CH: 0, EU: 1, INTL: 2 }
export const CONNECTORS: Connector[] = [...ALL_CONNECTORS, ...ALL_CONNECTORS_EXT].sort((a, b) => ORDER[a.region] - ORDER[b.region])

const r2 = (v: number) => Math.round(v * 100) / 100
