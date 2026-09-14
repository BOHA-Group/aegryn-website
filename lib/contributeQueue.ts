'use client'

/**
 * File d'attente locale pour les contributions anonymes à l'Index (/api/valuation/contribute).
 *
 * Garantie de non-perte "best effort" côté client : un simple fetch fire-and-forget ne
 * garantit rien (échec réseau, statut HTTP non-ok jamais intercepté par .catch, onglet fermé
 * pendant la requête). Ici :
 *   1. keepalive: true — la requête peut se terminer même si la page se décharge.
 *   2. Le statut HTTP est vérifié explicitement (fetch ne rejette que sur erreur réseau).
 *   3. En cas d'échec (réseau ou HTTP), le payload est mis en file dans localStorage et
 *      retenté automatiquement à la prochaine visite d'une page qui appelle flushContributionQueue().
 *
 * Aucune donnée identifiante n'est stockée ici (mêmes champs que /api/valuation/contribute :
 * jamais de nom d'entreprise ni d'email).
 */
const QUEUE_KEY = 'aegryn_contribute_queue_v1'
const ENDPOINT = '/api/valuation/contribute'
const MAX_QUEUE = 50 /* garde-fou : évite une croissance illimitée si le endpoint reste indisponible */

type ContributionPayload = Record<string, unknown>

function readQueue(): ContributionPayload[] {
  try {
    const raw = localStorage.getItem(QUEUE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch { return [] }
}

function writeQueue(items: ContributionPayload[]) {
  try { localStorage.setItem(QUEUE_KEY, JSON.stringify(items)) } catch { /* quota/privé : tant pis, best effort */ }
}

/** true = envoyé (ou erreur définitive, ex. validation 4xx — inutile de retenter), false = à retenter. */
async function post(payload: ContributionPayload): Promise<boolean> {
  try {
    const res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      keepalive: true,
      body: JSON.stringify(payload),
    })
    if (res.ok) return true
    if (res.status >= 400 && res.status < 500) {
      console.error('[contributeQueue] échec définitif (validation), payload abandonné', res.status)
      return true /* ne pas remettre en file : une 4xx échouera identiquement à chaque retry */
    }
    return false /* 5xx ou autre : transitoire, à retenter */
  } catch {
    return false /* échec réseau : transitoire, à retenter */
  }
}

/** À appeler à chaque soumission du test gratuit. Ne bloque jamais l'UI (fire-and-forget côté
 *  appelant), mais met en file localement si l'envoi échoue, pour retry ultérieur. */
export async function sendContribution(payload: ContributionPayload): Promise<void> {
  const ok = await post(payload)
  if (!ok) writeQueue([...readQueue(), payload].slice(-MAX_QUEUE))
}

/** À appeler au montage d'une page du parcours Index : retente les contributions en attente. */
export async function flushContributionQueue(): Promise<void> {
  const queue = readQueue()
  if (!queue.length) return
  const remaining: ContributionPayload[] = []
  for (const item of queue) {
    const ok = await post(item)
    if (!ok) remaining.push(item)
  }
  writeQueue(remaining)
}
