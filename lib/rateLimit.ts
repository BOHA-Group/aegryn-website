import { createHash } from 'node:crypto'
import { createServiceClient } from '@/lib/supabase'

export function clientIp(req: Request): string {
  return req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || req.headers.get('x-real-ip') || 'unknown'
}

/**
 * Limite de requêtes par adresse IP (hachée) et par type de formulaire, comptée en base (fonction api_rate_limit, clé de service).
 * Retourne true quand la limite est dépassée : la route doit alors répondre 429. En cas d'indisponibilité de la base, la requête passe (journalisée).
 */
export async function rateLimited(req: Request, bucket: string, max: number, windowSeconds = 3600): Promise<boolean> {
  try {
    const subject = createHash('sha256').update(`${process.env.IP_HASH_SALT ?? ''}${clientIp(req)}`).digest('hex')
    const { data, error } = await createServiceClient().rpc('api_rate_limit', { p_bucket: bucket, p_subject: subject, p_max: max, p_window_seconds: windowSeconds })
    if (error) throw new Error(error.message)
    return data === false
  } catch (e) {
    console.error('[rateLimit]', bucket, e instanceof Error ? e.message : e)
    return false
  }
}
