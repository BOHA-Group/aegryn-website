import { redirect }           from 'next/navigation'
import { getUser }             from '@/lib/supabaseServer'
import { createServiceClient }  from '@/lib/supabase'
import { Shield, Lock }         from 'lucide-react'
import NdaAssetAcceptForm       from './NdaAssetAcceptForm'

const NDA_ASSET_VERSION = '2026-08'

export default async function NdaAssetPage({
  params,
}: {
  params: Promise<{ assetId: string }>
}) {
  const { assetId } = await params
  const user = await getUser()
  if (!user) redirect('/client/login')

  const supa = createServiceClient()

  /* Vérifie que l'actif existe et est publié */
  const { data: asset } = await supa
    .from('auction_assets')
    .select('id, name, lot_number, tagline, catalog_context, status')
    .eq('id', assetId)
    .eq('status', 'published')
    .single()

  if (!asset) redirect('/client/buyer/catalogue')

  /* Vérifie que le NDA général est signé */
  const { data: generalNda } = await supa
    .from('nda_signatures')
    .select('signed_at')
    .eq('buyer_id', user.id)
    .eq('scope', 'catalog_general')
    .not('signed_at', 'is', null)
    .maybeSingle()

  if (!generalNda) redirect('/client/buyer/nda-required')

  /* Vérifie si déjà signé pour cet actif */
  const { data: existing } = await supa
    .from('nda_signatures')
    .select('signed_at')
    .eq('buyer_id', user.id)
    .eq('scope', 'asset_specific')
    .eq('asset_id', assetId)
    .not('signed_at', 'is', null)
    .maybeSingle()

  if (existing) redirect(`/client/buyer/actif/${assetId}`)

  const { data: profile } = await supa
    .from('profiles')
    .select('full_name')
    .eq('id', user.id)
    .single()

  const fullName = profile?.full_name ?? user.email ?? ''

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Header sticky */}
      <div className="bg-ag-navy text-white px-6 py-4 sticky top-0 z-20">
        <div className="max-w-3xl mx-auto flex items-center gap-3">
          <Lock size={15} className="text-ag-apex shrink-0" />
          <div>
            <p className="text-[10px] font-mono tracking-[0.22em] uppercase text-ag-apex font-bold">Data Room — Accès restreint</p>
            <p className="text-[13px] font-semibold text-white/90">Signature NDA requise pour accéder au dossier</p>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-10 space-y-8">

        {/* Identité de l'actif */}
        <div className="bg-white border border-gray-200 px-8 py-6">
          <p className="font-mono text-[10px] uppercase tracking-widest text-gray-400 mb-1">Lot #{asset.lot_number}</p>
          <h1 className="font-sans font-bold text-gray-900 text-[20px] tracking-tight">{asset.name}</h1>
          {asset.tagline && <p className="text-[13px] text-gray-500 mt-1">{asset.tagline}</p>}
          {asset.catalog_context && (
            <p className="font-mono text-[10px] text-gray-400 mt-2 uppercase tracking-widest">{asset.catalog_context}</p>
          )}
        </div>

        {/* Texte NDA actif */}
        <div className="bg-white border border-gray-200 px-8 py-8 space-y-6 text-[13px] font-sans text-gray-700 leading-relaxed">

          <div className="flex items-center gap-3 border-b border-gray-100 pb-6">
            <Shield size={18} className="text-ag-navy shrink-0" />
            <div>
              <p className="font-mono text-[10px] uppercase tracking-widest text-gray-400">Version {NDA_ASSET_VERSION} — NDA Data Room par actif</p>
              <h2 className="font-sans font-bold text-gray-900 text-[16px] mt-0.5">
                Accord de Confidentialité — Accès Data Room
              </h2>
            </div>
          </div>

          <p className="font-sans font-semibold text-ag-black text-[14px]">
            Entre Aegryn (formerly BOHA-Group, société enregistrée en Suisse) et{' '}
            <span className="text-ag-navy">{fullName}</span> (ci-après « l'Acquéreur »),
            concernant l'actif <strong>{asset.name}</strong> (Lot #{asset.lot_number}).
          </p>

          <section>
            <h3 className="font-sans font-semibold text-[12px] uppercase tracking-widest text-ag-black mb-3">1. Objet spécifique</h3>
            <p>
              Le présent accord complète le NDA général d'accès au catalogue Aegryn déjà signé par l'Acquéreur.
              Il régit l'accès aux documents de la data room de l'actif <strong>{asset.name}</strong>,
              incluant sans limitation : états financiers détaillés, code source, base de données clients,
              contrats commerciaux, indicateurs opérationnels, documentation technique et tout autre
              document transmis dans le cadre de la due diligence.
            </p>
          </section>

          <section>
            <h3 className="font-sans font-semibold text-[12px] uppercase tracking-widest text-ag-black mb-3">2. Obligations renforcées</h3>
            <p>En accédant à la data room de cet actif, l'Acquéreur s'engage spécifiquement à :</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Ne jamais reproduire, copier, photographier ou extraire tout ou partie des documents de la data room</li>
              <li>N'utiliser les informations que dans le seul but d'évaluer une acquisition potentielle de cet actif</li>
              <li>Restreindre l'accès aux seules personnes de son organisation ayant un besoin strict (need-to-know) et les soumettre au même niveau de confidentialité</li>
              <li>Ne pas contacter directement le cédant, ses dirigeants, salariés, clients ou fournisseurs sans accord préalable écrit d'Aegryn</li>
              <li>Ne pas utiliser les informations pour développer ou améliorer un produit ou service concurrent</li>
              <li>Restituer ou détruire tous les documents à première demande d'Aegryn ou à l'issue du processus</li>
              <li>Signaler immédiatement tout accès non autorisé, perte ou divulgation accidentelle à legal@aegryn.com</li>
            </ul>
          </section>

          <section>
            <h3 className="font-sans font-semibold text-[12px] uppercase tracking-widest text-ag-black mb-3">3. Périmètre de l'accès</h3>
            <p>
              L'accès à la data room est strictement personnel et non cessible. Il est accordé à l'Acquéreur
              en sa qualité individuelle ou en tant que représentant habilité de son entité. Tout accès
              partagé avec des tiers non déclarés constitue une violation immédiate du présent accord.
            </p>
          </section>

          <section>
            <h3 className="font-sans font-semibold text-[12px] uppercase tracking-widest text-ag-black mb-3">4. Durée et survie</h3>
            <p>
              Les présentes obligations s'appliquent dès la signature et pendant{' '}
              <strong>5 ans</strong> après la conclusion ou l'abandon du processus d'acquisition de cet actif,
              quelle qu'en soit la raison. L'obligation de confidentialité survit à toute résiliation.
            </p>
          </section>

          <section>
            <h3 className="font-sans font-semibold text-[12px] uppercase tracking-widest text-ag-black mb-3">5. Sanctions</h3>
            <p>
              Tout manquement expose l'Acquéreur à la révocation immédiate de son accès à la plateforme,
              à des dommages-intérêts calculés sur le préjudice réel subi par Aegryn et/ou le cédant,
              assortis d'une indemnité forfaitaire minimale de <strong>75 000 € HT</strong> pour toute
              violation avérée. Aegryn se réserve le droit d'engager toute action judiciaire en référé.
            </p>
          </section>

          <section>
            <h3 className="font-sans font-semibold text-[12px] uppercase tracking-widest text-ag-black mb-3">6. Droit applicable</h3>
            <p>
              Le présent accord est soumis au droit suisse. Tout litige sera soumis aux tribunaux
              du canton de domicile d'Aegryn, après tentative de résolution amiable sous 30 jours.
            </p>
          </section>

          <div className="bg-gray-50 border border-gray-200 px-5 py-3">
            <p className="font-mono text-[10px] text-gray-400">
              Version {NDA_ASSET_VERSION} — Aegryn Data Room NDA — Actif : {asset.name} (Lot #{asset.lot_number})
            </p>
          </div>
        </div>

        {/* Formulaire */}
        <NdaAssetAcceptForm
          assetId={assetId}
          assetName={asset.name}
          version={NDA_ASSET_VERSION}
          fullName={fullName}
          redirectTo={`/client/buyer/actif/${assetId}`}
        />

      </div>
    </div>
  )
}
