/**
 * /auction/teaser-preview — page de validation visuelle locale.
 * ⚠️ À retirer ou protéger avant toute mise en production.
 *
 * onRequestDossier : à brancher selon le choix de Yohann —
 *   A) formulaire modal de qualification
 *   B) redirection vers /contact
 *   C) envoi email via Resend
 */
import AssetTeaserDocument from '@/components/auction/AssetTeaserDocument'
import { subblinkTeaser }   from '@/data/auction/teasers/subblinkTeaser'

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
