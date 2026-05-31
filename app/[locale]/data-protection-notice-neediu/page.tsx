import { generateAegrynMetadata } from '@/lib/seo'
import type { Metadata } from 'next'
import Link from 'next/link'

/* ─── REPLACE ENTIRE FILE ─────────────────────────────────────────────── */
type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  return generateAegrynMetadata({
    title: 'Notice de Protection des Données & CGU — neediu | Aegryn',
    description: 'Notice de protection des données et Conditions d\'utilisation de la plateforme neediu — Aegryn Sàrl, conformité LPD suisse et RGPD.',
    path: '/data-protection-notice-neediu',
    locale,
  })
}

export default function NeediuLegalPage() {
  return (
    <main className="bg-white min-h-screen">
      <div className="mx-auto max-w-5xl px-6 md:px-16 py-28">

        <p className="font-sans font-semibold text-[10px] uppercase tracking-[0.24em] text-ag-gray-light mb-10">
          <Link href="/" className="hover:text-ag-black transition-colors">Aegryn</Link>
          {' / '}
          <span className="text-ag-apex">neediu</span>
          {' / '}Legal
        </p>

        <p className="font-sans font-semibold text-[10px] uppercase tracking-[0.2em] text-ag-apex mb-4">(01)</p>

        <h1 className="font-sans font-bold text-ag-black tracking-[-0.03em] leading-[1.1] mb-4"
          style={{ fontSize: 'clamp(28px,3.5vw,46px)' }}>
          Notice de Protection des Données – AEGRYN neediu
        </h1>
        <p className="font-sans font-normal text-[13px] text-ag-gray leading-relaxed mb-4 border-l-2 border-ag-border pl-4">
          Exclusion de responsabilité : Cette notice de protection des données est une traduction réalisée par intelligence artificielle fournie à titre informatif uniquement. En cas de divergences ou d'incohérences, la version anglaise prévaudra.
        </p>
        <p className="font-sans font-semibold text-[11px] text-ag-gray-light mb-16">Dernière mise à jour : 01/03/2026</p>

        <div className="prose prose-slate max-w-none font-sans
          prose-headings:font-sans prose-headings:font-bold prose-headings:text-ag-black prose-headings:tracking-[-0.02em]
          prose-h2:text-[22px] prose-h2:mt-14 prose-h2:mb-5
          prose-h3:text-[16px] prose-h3:mt-8 prose-h3:mb-3
          prose-p:text-[15px] prose-p:text-ag-gray prose-p:leading-[1.75]
          prose-li:text-[15px] prose-li:text-ag-gray prose-li:leading-[1.75]
          prose-a:text-ag-navy prose-a:no-underline hover:prose-a:underline
          prose-strong:text-ag-black
          prose-table:text-[14px]
          prose-th:text-ag-black prose-th:font-semibold prose-th:text-left prose-th:py-3 prose-th:px-4
          prose-td:text-ag-gray prose-td:py-3 prose-td:px-4 prose-td:align-top">

          {/* ── NOTICE DE PROTECTION DES DONNÉES ── */}
          <h2>Introduction</h2>
          <p>
            neediu est une plateforme qui permet aux utilisateurs d'identifier et de se connecter rapidement avec des professionnels ou des particuliers de confiance offrant de l'aide pour des besoins liés à la maison dans leur région. Comme nous attachons une grande importance à la protection de vos données et à votre vie privée, nous avons élaboré cette notice de protection des données pour vous expliquer ce que nous faisons de vos données lorsque vous utilisez notre plateforme.
          </p>
          <p>
            Cette notice de protection des données couvre uniquement le traitement des données lié à notre plateforme. Notre objectif est d'assurer une protection adéquate des données personnelles conformément à toutes les lois sur la protection des données applicables, y compris, mais sans s'y limiter, la Loi fédérale suisse sur la protection des données (FADP) et le Règlement général sur la protection des données (RGPD).
          </p>
          <p>Principales définitions tirées de la LPD :</p>
          <ul>
            <li><strong>Personne concernée :</strong> La personne physique dont les données personnelles sont traitées.</li>
            <li><strong>Données personnelles :</strong> Toute information se rapportant à une personne physique identifiée ou identifiable.</li>
            <li><strong>Données personnelles sensibles :</strong> Données concernant les opinions ou activités religieuses, philosophiques, politiques ou syndicales ; les données concernant la santé, la sphère intime ou l'appartenance à une race ou une ethnie ; les données génétiques ; les données biométriques identifiant de manière unique une personne physique ; les données concernant les poursuites ou sanctions administratives et pénales ; les données concernant les mesures d'aide sociale.</li>
            <li><strong>Traitement :</strong> Toute manipulation de données personnelles, notamment la collecte, l'enregistrement, la conservation, l'utilisation, la modification, la divulgation, l'archivage, l'effacement ou la destruction de données.</li>
            <li><strong>Responsable du traitement :</strong> La personne privée ou l'organe fédéral qui, seul ou conjointement avec d'autres, détermine la finalité et les moyens du traitement des données personnelles.</li>
            <li><strong>Sous-traitant :</strong> La personne privée ou l'organe fédéral qui traite des données personnelles pour le compte du responsable du traitement.</li>
            <li><strong>PFPDT (FDPIC) :</strong> Le Préposé fédéral à la protection des données et à la transparence, chargé de surveiller la bonne application des dispositions fédérales relatives à la protection des données.</li>
          </ul>

          <h2>Qui sommes-nous et comment nous contacter ?</h2>
          <p>
            <strong>Aegryn Sàrl</strong> est le nom de notre entreprise. Si vous avez des questions concernant le traitement des données relatives à notre plateforme, vous pouvez nous contacter par courrier : Aegryn Sàrl, c/o Cofidex SA, Rue du Centre 142, 1025 St-Sulpice, Suisse. Vous pouvez également nous contacter par e-mail à <a href="mailto:legal@aegryn.com">legal@aegryn.com</a>.
          </p>

          <h2>Quel est notre rôle en matière de protection des données ?</h2>
          <p>
            Lorsque vous utilisez notre plateforme, nous pouvons traiter certaines de vos données personnelles. Conformément à la LPD, nous sommes le <strong>responsable du traitement</strong>. Lorsque des données personnelles sont partagées avec un Prestataire de Services pour l'exécution d'une mission, le Prestataire de Services agit en tant que responsable du traitement indépendant.
          </p>
          <p>En tant que responsable du traitement, nous définissons les finalités pour lesquelles nous traitons vos données personnelles, la manière dont elles sont traitées et les mesures de sécurité. La protection des données est l'affaire de tous. Nous vous encourageons à lire cette notice attentivement.</p>

          <h2>Quand et comment recueillons-nous vos données ?</h2>
          <p>
            La collecte de données débute dès que vous accédez à notre Plateforme ou interagissez avec elle. Nous recueillons des données directement auprès de vous lorsque vous utilisez la Plateforme et lorsque vous créez un Compte Utilisateur, que ce soit en tant que Client ou Prestataire de Services. Nous ne collectons pas de données auprès de tiers, sauf dans le cadre de campagnes de marketing ciblées.
          </p>

          <h2>Quelles catégories de données traitons-nous ?</h2>
          <h3>Données de contact</h3>
          <p>Nom, prénom, adresse, numéro de téléphone ou adresse e-mail lors de la création d'un compte.</p>
          <h3>Données privées</h3>
          <p>Données relatives à votre situation personnelle : sexe, date de naissance, photo, lieu d'origine, langue de contact et pays de résidence.</p>
          <h3>Données de compte</h3>
          <p>Statut du compte, services offerts ou demandés, photo de profil et autres préférences, historique des services, paramètres de disponibilité, participation à des fonctionnalités telles que les avis ou la messagerie.</p>
          <h3>Données économiques</h3>
          <p>Mode de paiement, montants payés ou reçus, historique de transactions, commissions applicables, adresse de facturation, coordonnées bancaires pour les versements. Les données relatives aux modes de paiement sont traitées uniquement par nos prestataires tiers — nous ne traitons pas les numéros de carte de crédit ni les numéros CVC.</p>
          <h3>Données Internet et de connexion</h3>
          <p>Adresse IP, informations sur le fournisseur d'accès Internet et le système d'exploitation de votre appareil, URL de référence, navigateur utilisé, date et heure d'accès, contenu consulté.</p>
          <h3>Autres données</h3>
          <p>Type et étendue de la tâche, taille ou état du domicile ou des locaux, date et heure souhaitées, photos ou descriptions clarifiant la nature de la mission, données d'identification dans le cadre de la procédure KYC.</p>

          <h2>Données sensibles et mineurs</h2>
          <p>Nous ne collectons ni ne traitons aucune donnée personnelle sensible. Nos services sont destinés exclusivement aux adultes. Nous ne ciblons pas les mineurs et ne collectons délibérément aucune donnée personnelle les concernant.</p>

          <h2>Pourquoi traitons-nous vos données ?</h2>
          <p>Nous traitons vos données personnelles afin de :</p>
          <ul>
            <li>Permettre l'accès et l'utilisation de la Plateforme (création et gestion de compte, mise en relation, traitement des paiements, messagerie, affichage d'informations pertinentes).</li>
            <li>Communiquer avec vous, répondre à vos demandes et exercer vos droits.</li>
            <li>Générer des statistiques de trafic utiles à l'amélioration de la Plateforme.</li>
            <li>Nous conformer aux lois, directives et recommandations des autorités.</li>
          </ul>
          <p>Nous ne prenons aucune décision individuelle automatisée.</p>

          <h2>Quels sont vos droits ?</h2>
          <p>En général, la LPD vous confère les droits suivants :</p>
          <ul>
            <li>Vous avez le droit d'accéder à vos données.</li>
            <li>Vous avez le droit de demander que vos données soient fournies dans un format électronique couramment utilisé.</li>
            <li>Vous avez le droit de faire rectifier les données inexactes.</li>
            <li>Vous avez le droit de vous opposer au traitement de vos données.</li>
            <li>Vous avez le droit de demander la suppression ou la destruction de vos données.</li>
            <li>Vous avez le droit d'exiger qu'une décision individuelle automatisée soit réexaminée par une personne physique.</li>
          </ul>
          <p>
            Pour exercer l'un de ces droits, veuillez nous <Link href="/contact">contacter</Link>. Si vous estimez que nous traitons vos données en violation des dispositions relatives à la protection des données, vous pouvez nous signaler au PFPDT.
          </p>

          <h2>Comment protégeons-nous vos données ?</h2>
          <p>Nous prenons des mesures de sécurité appropriées, comme le chiffrement, pour protéger vos données personnelles. Si vous pensez que vos données ont été compromises, veuillez nous en informer immédiatement à <a href="mailto:legal@aegryn.com">legal@aegryn.com</a>.</p>

          <h2>Où et combien de temps vos données sont-elles conservées ?</h2>
          <p>Les données personnelles sont stockées dans nos locaux ainsi que dans les centres de traitement opérés par nos prestataires tiers. Nous les conservons aussi longtemps que la finalité du traitement l'exige ou que nous avons un intérêt légitime à les conserver. Pour certaines données, la période de conservation peut atteindre dix ans.</p>

          <h2>Avec qui partageons-nous vos données ?</h2>
          <p>
            La gestion de notre plateforme implique une collaboration avec des prestataires tiers spécialisés. Certaines données personnelles sont également partagées directement entre utilisateurs lorsque cela est nécessaire pour l'exécution d'un service demandé. Toutes ces communications sont strictement limitées à ce qui est nécessaire et respectent le cadre légal applicable. Lorsque des données sont transférées en dehors de la Suisse ou de l'EEE, nous utilisons les clauses contractuelles types révisées de la Commission européenne ou d'autres garanties appropriées.
          </p>

          <h3>Nos prestataires tiers</h3>
          <table>
            <thead>
              <tr><th>Prestataire</th><th>Objectif</th><th>Lieu de traitement</th></tr>
            </thead>
            <tbody>
              <tr><td>Supabase</td><td>Plateforme backend-as-a-service pour le développement de l'application.</td><td>EEE</td></tr>
              <tr><td>Stripe</td><td>Infrastructure de paiement mondial — traitement sécurisé des transactions et vérification d'identité.</td><td>EEE/USA</td></tr>
              <tr><td>Google Analytics</td><td>Service d'analyse pour surveiller l'utilisation de la plateforme et compiler des rapports d'activité.</td><td>EEE/USA</td></tr>
            </tbody>
          </table>

          <h2>Réseaux sociaux</h2>
          <p>
            Nous sommes présents sur les réseaux sociaux (Facebook, Instagram, TikTok). Lorsque vous communiquez avec nous sur ces sites, nous collectons des données principalement pour communiquer avec vous. Pour plus d'informations, consultez les notices de protection des données des opérateurs concernés.
          </p>

          <h2>Dispositions finales (Notice)</h2>
          <p>Nous nous réservons le droit de modifier les termes de cette notice à notre entière discrétion. Toute version modifiée sera publiée sur notre plateforme.</p>

          {/* ── CONDITIONS D'UTILISATION ── */}
          <hr className="my-14 border-ag-border" />

          <p className="font-sans font-semibold text-[10px] uppercase tracking-[0.2em] text-ag-apex">(02)</p>
          <h2 className="!mt-4">Conditions d'utilisation – AEGRYN neediu</h2>
          <p className="border-l-2 border-ag-border pl-4 text-[14px]">
            Exclusion de responsabilité : La présente déclaration de protection des données est une traduction IA fournie à titre informatif uniquement. En cas de divergences ou d'incohérences, la version anglaise fera foi.
          </p>

          <p>
            Les présentes Conditions d'utilisation (les CdU) s'appliquent à toute utilisation de la Plateforme Aegryn, de l'application mobile neediu, ainsi qu'à tout service accessible ou fourni via la Plateforme (les Services), qui sont fournis et gérés par <strong>Aegryn Sàrl</strong>, c/o Cofidex SA, Rue du Centre 142, 1025 St-Sulpice, Suisse.
          </p>

          <h3>1. Généralités</h3>
          <p><strong>Acceptation.</strong> En accédant ou en utilisant notre Plateforme, vous acceptez d'être lié par les présentes CdU.</p>
          <p><strong>Modifications.</strong> Les présentes CdU peuvent être modifiées occasionnellement, auquel cas vous en serez informé par tout moyen approprié (y compris par e-mail ou via la Plateforme). Vous devrez accepter les nouvelles CdU pour continuer à utiliser la Plateforme.</p>

          <h3>2. CdU personnelles</h3>
          <p>En utilisant la Plateforme ou les Services, vous confirmez et garantissez que vous avez au moins 18 ans et, si vous utilisez la Plateforme au nom d'une entité juridique, que vous êtes dûment autorisé à le faire.</p>

          <h3>3. Compte personnel</h3>
          <p><strong>Compte.</strong> Pour accéder à certaines fonctionnalités, il est nécessaire de créer un compte personnel en fournissant les informations requises et en acceptant les présentes CdU.</p>
          <p><strong>Adhésions.</strong> Il existe deux catégories d'Utilisateurs Enregistrés : (i) les <strong>Clients</strong> qui utilisent la Plateforme pour rechercher et recevoir des services, et (ii) les <strong>Prestataires de Services</strong> qui offrent et exécutent des services pour les Clients.</p>
          <p><strong>Confidentialité.</strong> Vous êtes seul responsable de la confidentialité de votre mot de passe et de toute activité se produisant sous votre Compte. Informez-nous immédiatement de toute utilisation frauduleuse.</p>
          <p><strong>Vérification d'identité.</strong> Pour répondre aux exigences légales liées aux transactions financières et à la prévention de la fraude, nous ou notre prestataire tiers pouvons effectuer des procédures de vérification d'identité (KYC).</p>

          <h3>4. Accès, Internet et Télécommunication</h3>
          <p><strong>Internet.</strong> L'utilisation d'Internet implique des risques (interception, altération, suppression de données). En utilisant la Plateforme, vous acceptez ces risques.</p>
          <p><strong>Télécommunication.</strong> Nous ne sommes pas un fournisseur de télécommunications. Les fonctionnalités d'appel et de chat fonctionnent via Internet (VoIP/données) et ne sont pas liées aux réseaux mobiles ou fixes. Ne les utilisez pas pour les services d'urgence.</p>

          <h3>5. Fonctionnalités et Services</h3>
          <p>La Plateforme fournit un service numérique permettant aux utilisateurs de se connecter avec des professionnels ou particuliers offrant de l'aide pour des besoins liés à la maison. La Plateforme facilite le contact initial mais n'intervient pas dans l'exécution des services. Nous n'assumons aucune responsabilité quant à la qualité, la ponctualité ou le résultat des services effectués par des tiers.</p>

          <h3>6. Utilisation de la Plateforme</h3>
          <p><strong>Droit d'utilisation.</strong> Il vous est accordé un droit révocable, non-exclusif, non-transférable d'accéder et d'utiliser la Plateforme uniquement dans le but de rechercher, d'offrir ou de bénéficier de services d'aide à domicile.</p>
          <p><strong>Restrictions.</strong> Il est strictement interdit : (i) d'utiliser la Plateforme à des fins autres que celles prévues ; (ii) de reproduire, modifier ou créer des œuvres dérivées de la Plateforme ; (iii) d'accéder au code source par décompilation ou ingénierie inverse ; (iv) de collecter des adresses e-mail à des fins de spamming.</p>

          <h3>7. Contenu Utilisateur</h3>
          <p>Les Utilisateurs peuvent afficher ou créer du contenu (textes, images, photos). Les avis doivent être honnêtes, respectueux et basés sur des expériences réelles. Les Utilisateurs accordent à Aegryn une licence mondiale, libre de redevances, perpétuelle d'utiliser le Contenu Utilisateur en relation avec les Services.</p>

          <h3>8. Paiements et Frais</h3>
          <p>Tous les paiements effectués via la Plateforme sont traités par des prestataires de services de paiement tiers. Nous ne stockons ni ne traitons directement les informations de votre carte de paiement.</p>
          <p><strong>Frais du Prestataire de Services.</strong> En tant que Prestataire de Services, vous êtes soumis à une commission sur chaque service accompli avec succès :</p>
          <ul>
            <li>Niveau Démarrage (moins de 150 missions) : <strong>20 %</strong></li>
            <li>Niveau Pro (150 à 300 missions) : <strong>17,5 %</strong></li>
            <li>Niveau Élite (plus de 300 missions) : <strong>15 %</strong></li>
          </ul>
          <p>Les versements sont généralement traités dans les 5 à 7 jours ouvrables suivant l'achèvement du service.</p>

          <h3>9. Remboursements</h3>
          <p>Si un service payé n'est pas fourni comme promis, vous pouvez demander un remboursement dans les 7 jours suivant l'heure prévue du service, avec les détails justificatifs. Nous évaluerons les demandes au cas par cas.</p>

          <h3>10. Propriété Intellectuelle</h3>
          <p>À l'exception du Contenu Utilisateur, Aegryn reste l'unique propriétaire de tous les droits de propriété intellectuelle sur la Plateforme, les Services et le contenu accessible via la Plateforme.</p>

          <h3>11. Restrictions d'utilisation</h3>
          <p>Vous vous engagez : (i) à respecter toutes les dispositions légales applicables ; (ii) à ne pas utiliser la Plateforme à des fins illicites ; (iii) à ne pas inclure d'informations fausses, illégales ou offensantes ; (iv) à ne pas inclure de virus ou programmes malveillants.</p>

          <h3>12. Protection des Données</h3>
          <p>La Notice de Protection des Données, disponible sur cette page, fait partie intégrante des présentes CdU.</p>

          <h3>13. Modifications, Suspension et Résiliation</h3>
          <p>Nous nous réservons le droit de modifier, interrompre ou retirer la Plateforme à tout moment. Nous pouvons restreindre, suspendre ou résilier votre Compte à notre seule discrétion.</p>

          <h3>14. Aucune Garantie</h3>
          <p>La Plateforme, les Services et le Contenu sont fournis « en l'état » et « tels que disponibles ». Nous déclinons toutes garanties, expresses ou implicites.</p>

          <h3>15. Limitation de Responsabilité</h3>
          <p>Aegryn ne pourra être tenu responsable de tout dommage, y compris les pertes de profits, pertes de données ou autres pertes intangibles résultant de l'utilisation ou de l'impossibilité d'utiliser la Plateforme. Notre responsabilité est limitée au maximum au prix effectivement payé pour les Services.</p>

          <h3>16. Indemnisation</h3>
          <p>Vous vous engagez à nous indemniser pour toute responsabilité, perte, dommage ou réclamation résultant de votre violation des présentes CdU.</p>

          <h3>17. Divers</h3>
          <p><strong>Divisibilité.</strong> Si une disposition est nulle ou inapplicable, les autres dispositions restent pleinement en vigueur.</p>
          <p><strong>Force majeure.</strong> Nous ne pouvons être tenus responsables de l'inexécution due à des événements de force majeure.</p>
          <p><strong>Droit applicable.</strong> Les présentes CdU sont régies par le droit matériel suisse, sans référence à ses dispositions en matière de conflit de lois.</p>
          <p><strong>Juridiction.</strong> Tout litige sera soumis à la juridiction exclusive des tribunaux compétents du siège d'Aegryn.</p>

          <h3>18. Contact</h3>
          <p>Vous pouvez nous contacter à l'adresse <a href="mailto:legal@aegryn.com">legal@aegryn.com</a>.</p>
        </div>
      </div>
    </main>
  )
}
