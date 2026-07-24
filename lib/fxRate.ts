/**
 * Taux de change CHF → EUR via le flux XML quotidien de la BCE
 * (Banque de France redistribue les taux SEBC depuis la BCE — même source officielle)
 * URL : https://www.ecb.europa.eu/stats/eurofxref/eurofxref-daily.xml
 *
 * Retourne le taux EUR/CHF du jour, puis calcule CHF→EUR :
 *   1 EUR = X CHF  →  1 CHF = 1/X EUR
 *
 * Fallback silencieux : si l'API est indisponible, retourne null.
 */

type FxResult = {
  rate: number        // taux CHF→EUR (ex: 0.9521)
  rateDate: string    // date de publication (ex: "2026-07-24")
  eurPerChf: number   // alias = rate
}

let _cache: { data: FxResult; fetchedAt: number } | null = null
const CACHE_TTL_MS = 4 * 60 * 60 * 1000 // 4h — la BCE publie une fois par jour

export async function getChfToEurRate(): Promise<FxResult | null> {
  const now = Date.now()

  if (_cache && now - _cache.fetchedAt < CACHE_TTL_MS) {
    return _cache.data
  }

  try {
    const res = await fetch(
      'https://www.ecb.europa.eu/stats/eurofxref/eurofxref-daily.xml',
      { next: { revalidate: 14400 } }
    )
    if (!res.ok) throw new Error(`ECB HTTP ${res.status}`)

    const xml = await res.text()

    // Extraire le taux EUR/CHF depuis le XML (currency="CHF" rate="X.XXXX")
    const match = xml.match(/currency='CHF'\s+rate='([0-9.]+)'/) ??
                  xml.match(/currency="CHF"\s+rate="([0-9.]+)"/)

    if (!match?.[1]) throw new Error('CHF rate not found in ECB XML')

    const eurPerChf = 1 / parseFloat(match[1])

    // Extraire la date
    const dateMatch = xml.match(/time='([0-9-]+)'/) ?? xml.match(/time="([0-9-]+)"/)
    const rateDate = dateMatch?.[1] ?? new Date().toISOString().slice(0, 10)

    const data: FxResult = { rate: eurPerChf, eurPerChf, rateDate }
    _cache = { data, fetchedAt: now }
    return data
  } catch (err) {
    console.error('[fxRate] ECB fetch failed:', err)
    return null
  }
}

/**
 * Convertit un montant CHF en EUR et retourne une chaîne formatée.
 * Ex: formatChfEur(800) → "800 CHF (≈ 762 EUR au 24.07.2026, taux BCE)"
 */
export async function formatChfEur(chf: number): Promise<string> {
  const fx = await getChfToEurRate()
  if (!fx) return `${chf.toLocaleString('fr-CH')} CHF`

  const eur = Math.round(chf * fx.eurPerChf)
  const dateFormatted = fx.rateDate.split('-').reverse().join('.')
  return `${chf.toLocaleString('fr-CH')} CHF (≈ ${eur.toLocaleString('fr-FR')} EUR au ${dateFormatted}, taux BCE)`
}
