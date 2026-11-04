import { createClient } from '@supabase/supabase-js'

/** Projet Supabase de l'app neediu (distinct de celui d'Aegryn). */
export const NEEDIU_SUPABASE_URL = process.env.NEEDIU_SUPABASE_URL ?? 'https://ttiqahbkzigkogcxmmsg.supabase.co'

/** Client service_role de la base neediu, ou null tant que la clé n'est pas configurée. */
export function createNeediuServiceClient() {
  const key = process.env.NEEDIU_SUPABASE_SERVICE_ROLE_KEY
  if (!key) return null
  return createClient(NEEDIU_SUPABASE_URL, key, { auth: { persistSession: false } })
}
