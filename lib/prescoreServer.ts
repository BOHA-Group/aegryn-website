import { createServiceClient } from '@/lib/supabase'
import { computePrescore, type Prescore } from '@/lib/prescore'

/** Recalcule et persiste le pré-scoring documentaire d'un dossier. */
export async function refreshPrescore(assetId: string): Promise<Prescore> {
  const supa = createServiceClient()
  const [{ data: catalog }, { data: docs }] = await Promise.all([
    supa.from('documents_catalog').select('code, dimension, required_level'),
    supa.from('data_room_documents').select('document_code, admin_quality, required_level, dimension, category').eq('asset_id', assetId),
  ])
  const prescore = computePrescore(catalog ?? [], docs ?? [])
  await supa.from('assets').update({ prescore_json: prescore, prescore_at: prescore.computedAt }).eq('id', assetId)
  return prescore
}
