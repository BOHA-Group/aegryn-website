import { createClient }        from '@supabase/supabase-js'
import { createBrowserClient } from '@supabase/ssr'

const url  = process.env.NEXT_PUBLIC_SUPABASE_URL!
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

/**
 * Client côté navigateur (anon key).
 * IMPORTANT : createBrowserClient (et non createClient de @supabase/supabase-js)
 * pour stocker la session en cookies plutôt qu'en localStorage. C'est requis pour
 * rester synchronisé avec les Server Components / API routes qui lisent la session
 * via lib/supabaseServer.ts (createServerClient, cookie-based). Sans ça, un login
 * ou une activation de compte réussis côté client restent invisibles côté serveur
 * (getUser()/requireAdmin() ne voient jamais la session) — d'où des redirections
 * en boucle vers /client/login ou /admin/login et des liens d'invitation qui
 * échouent avec "session expirée".
 */
export const supabase = createBrowserClient(url, anonKey)

/** Client côté serveur avec service_role — uniquement dans les API routes */
export function createServiceClient() {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
  return createClient(url, serviceKey, {
    auth: { persistSession: false },
  })
}
