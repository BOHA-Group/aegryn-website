/**
 * /transact/teaser-preview — aperçu public du lot en vente (teaser Aegryn TRANSACT).
 * Désormais lié publiquement depuis /transact/sessions ("Aperçu du lot" — session à venir).
 *
 * ⚠️ SUBBLINK_ASSET_ID est un placeholder — à remplacer par l'UUID réel de la
 * ligne `auction_assets` (table Supabase) une fois le lot subblink créé en base (db push).
 *
 * onRequestDossier : à brancher selon le choix de Yohann —
 *   A) formulaire modal de qualification
 *   B) redirection vers /contact
 *   C) envoi email via Resend
 */
import AssetTeaserDocument from '@/components/transaction/AssetTeaserDocument'
import { subblinkTeaser }   from '@/data/transaction/teasers/subblinkTeaser'

/* ID de l'actif en base — à remplacer par l'UUID réel après db push */
const SUBBLINK_ASSET_ID = '00000000-0000-0000-0000-000000000001'

export default function TeaserPreviewPage() {
  return (
    <div
      style={{ minHeight: '100vh', background: '#EDEAE2', padding: '48px 16px' }}
    >
      <AssetTeaserDocument
        teaser={subblinkTeaser}
        assetId={SUBBLINK_ASSET_ID}
      />
    </div>
  )
}
