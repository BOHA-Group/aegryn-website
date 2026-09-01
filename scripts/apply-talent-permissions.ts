import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

async function applyPermissions() {
  console.log('Applying talent table permissions...')

  const sql = `
    -- Policy: Permettre INSERT public sur talent_candidates
    CREATE POLICY IF NOT EXISTS "talent_candidates_public_insert"
      ON talent_candidates FOR INSERT
      TO anon
      WITH CHECK (true);

    -- Policy: Permettre INSERT public sur talent_hiring_requests
    CREATE POLICY IF NOT EXISTS "talent_hiring_public_insert"
      ON talent_hiring_requests FOR INSERT
      TO anon
      WITH CHECK (true);
  `

  const { error } = await supabase.rpc('exec_sql', { sql_query: sql })

  if (error) {
    console.error('Error applying permissions:', error)
    process.exit(1)
  }

  console.log('✓ Permissions applied successfully')
}

applyPermissions()
