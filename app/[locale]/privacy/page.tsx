import { getTranslations }    from 'next-intl/server'
import type { Metadata }        from 'next'
import Link                     from 'next/link'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'privacy.meta' })
  return { title: t('title'), description: t('desc') }
}

export default async function PrivacyPage({ params }: Props) {
  const { locale } = await params
  const tN = await getTranslations({ locale, namespace: 'legalNav' })
  const tP = await getTranslations({ locale, namespace: 'privacy' })

  return (
    <main id="main" className="bg-white min-h-screen">

      {/* Hero */}
      <section className="bg-ag-navy pt-24 pb-14 px-6">
        <div className="max-w-4xl mx-auto">
          <p className="font-mono text-[10px] tracking-[0.28em] uppercase text-ag-apex mb-5">AEGRYN — Legal</p>
          <h1
            className="font-sans font-bold text-white leading-[1.05] tracking-[-0.03em] mb-4"
            style={{ fontSize: 'clamp(28px,3.5vw,52px)' }}
          >
            {tP('label')}
          </h1>
          <p className="font-sans text-[13px] text-white/40">{tP('updated')}</p>
          {/* Sélecteur de langue */}
          <div className="mt-6 flex flex-wrap gap-3">
            {(['fr','en','de','es','it','nl'] as const).map(lang => (
              <Link
                key={lang}
                href={`/${lang}/privacy`}
                className={`font-mono text-[10px] tracking-[0.14em] uppercase px-3 py-1 border transition-colors ${
                  lang === locale
                    ? 'border-ag-apex text-ag-apex'
                    : 'border-white/20 text-white/40 hover:border-white/50 hover:text-white/70'
                }`}
              >
                {lang.toUpperCase()}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Legal nav */}
      <div className="border-b border-ag-border bg-ag-off-white sticky top-16 z-20">
        <div className="max-w-4xl mx-auto px-6 py-3 flex flex-wrap gap-x-6 gap-y-1">
          {(['termsUse','termsCgv','privacy','security','faq'] as const).map((k, i) => (
            <Link
              key={k}
              href={['/terms/use','/terms/cgv','/privacy','/security','/help/faq'][i]}
              className={`font-mono text-[10px] tracking-[0.18em] uppercase transition-colors ${
                k === 'privacy' ? 'text-ag-black' : 'text-ag-gray-light hover:text-ag-black'
              }`}
            >
              {tN(k)}
            </Link>
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-6 md:px-16 py-16">

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

          <h2>Introduction</h2>
          <p>
            Étant donné l'importance que nous accordons à la protection de vos données et à votre vie privée, nous avons élaboré la présente notice de protection des données pour vous expliquer ce que nous faisons lorsque vous visitez notre site web <a href="https://aegryn.com">aegryn.com</a>.
          </p>
          <p>
            La présente notice de protection des données ne couvre que le traitement des données lié à notre site web. Des notices spécifiques de protection des données peuvent s'appliquer à d'autres services et offres que nous proposons.
          </p>
          <p>
            En Suisse, la protection de vos données est basée notamment sur la Loi fédérale du 25 septembre 2020 sur la protection des données (FADP), ainsi que sur l'Ordonnance fédérale du 31 août sur la protection des données (DPO). Notre notice de protection des données, ainsi que nos pratiques, sont alignées sur les dispositions légales contenues dans la législation mentionnée.
          </p>
          <p>Nous avons regroupé les principales définitions pour faciliter la compréhension de cette notice :</p>
          <ul>
            <li><strong>Personne concernée :</strong> la personne physique dont les données personnelles sont traitées.</li>
            <li><strong>Données personnelles :</strong> toute information se rapportant à une personne physique identifiée ou identifiable.</li>
            <li><strong>Données personnelles sensibles :</strong> données relatives aux opinions ou activités religieuses, philosophiques, politiques ou syndicales ; données relatives à la santé, à la sphère privée ou à l'appartenance à une race ou à une ethnie ; données génétiques ; données biométriques ; données relatives aux poursuites et sanctions administratives et pénales ; données relatives aux mesures d'aide sociale.</li>
            <li><strong>Traitement :</strong> toute manipulation de données personnelles, quels que soient les moyens et procédures utilisés.</li>
            <li><strong>Responsable du traitement :</strong> une personne privée ou un organisme fédéral qui, seul ou conjointement avec d'autres, détermine la finalité et les moyens du traitement des données personnelles.</li>
            <li><strong>Sous-traitant :</strong> la personne privée ou l'organisme fédéral qui traite des données personnelles pour le compte du responsable du traitement.</li>
            <li><strong>PFPDT :</strong> le Préposé fédéral à la protection des données et à la transparence, chargé de veiller à la bonne application des dispositions fédérales en matière de protection des données.</li>
          </ul>

          <h2>Qui sommes-nous et comment nous contacter ?</h2>
          <p>
            <strong>Aegryn Sàrl</strong> est le nom de notre entreprise. Si vous avez des questions sur le traitement des données relatives à notre site web, vous pouvez nous contacter par courrier : Aegryn Sàrl, c/o Cofidex SA, Rue du Centre 142, 1025 St-Sulpice. Vous pouvez également nous contacter par e-mail à <a href="mailto:legal@aegryn.com">legal@aegryn.com</a> ou via notre <Link href="/contact">formulaire de contact</Link>.
          </p>

          <h2>Quel est notre rôle en matière de protection des données ?</h2>
          <p>
            Lorsque vous naviguez sur notre site web, nous pouvons traiter certaines de vos données personnelles. Conformément à la LPD, nous sommes le <strong>responsable du traitement</strong>.
          </p>
          <p>
            En tant que responsable du traitement, nous sommes chargés de déterminer les finalités pour lesquelles nous traitons vos données personnelles, la manière dont elles sont traitées et les mesures de sécurité. Lorsque nous travaillons avec des fournisseurs de services, nous nous assurons qu'ils partagent notre engagement en matière de protection des données.
          </p>
          <p>
            La protection des données est l'affaire de tous. Nous vous encourageons à lire cette notice et, si vous êtes l'un de nos clients, à consulter les documents contractuels qui nous lient.
          </p>

          <h2>Quand et comment collectons-nous vos données ?</h2>
          <p>
            Dès votre première interaction avec notre site web, nous collectons des données (par exemple pour déterminer si vous consentez à l'utilisation des cookies). Vous nous fournissez également vos données lorsque vous nous contactez via notre formulaire de contact.
          </p>

          <h2>Quelles catégories de données traitons-nous ?</h2>
          <h3>Données de contact</h3>
          <p>Nous traitons vos données de contact, telles que votre prénom, nom de famille, adresse, numéro de téléphone ou adresse e-mail.</p>
          <h3>Données Internet et de connexion</h3>
          <p>Pour des raisons techniques et pour améliorer notre site web, nous traitons votre adresse IP, des informations sur votre fournisseur d'accès Internet et le système d'exploitation de votre appareil, des informations sur l'URL de référence, sur le navigateur utilisé, la date et l'heure d'accès, et le contenu consulté lors de votre visite.</p>

          <h2>Qu'en est-il des données sensibles et des mineurs ?</h2>
          <p>Nous ne collectons ni ne traitons aucune donnée personnelle sensible. Bien que l'accès à notre site web soit ouvert à tous, nos services sont exclusivement destinés aux adultes. Nous ne ciblons pas les mineurs et ne collectons délibérément aucune donnée personnelle les concernant.</p>

          <h2>Pourquoi traitons-nous vos données ?</h2>
          <p>Nous traitons vos données afin de :</p>
          <ul>
            <li>Communiquer avec vous, notamment pour répondre à vos demandes et exercer vos droits.</li>
            <li>Vous informer sur nos services et offres.</li>
            <li>Générer des statistiques de trafic utiles à l'amélioration de notre site web.</li>
            <li>Nous conformer aux lois, directives et recommandations des autorités.</li>
          </ul>
          <p>Il est important de noter que nous ne prenons aucune décision individuelle automatisée.</p>

          <h2>Quels sont vos droits ?</h2>
          <p>En général, la LPD vous confère les droits suivants :</p>
          <ul>
            <li>Vous avez le droit d'accéder à vos données.</li>
            <li>Vous avez le droit de demander que vos données soient fournies dans un format électronique couramment utilisé.</li>
            <li>Vous avez le droit de faire rectifier des données inexactes.</li>
            <li>Vous avez le droit de vous opposer au traitement de vos données.</li>
            <li>Vous avez le droit de demander la suppression ou la destruction de vos données.</li>
            <li>Vous avez le droit d'exiger qu'une décision individuelle automatisée soit réexaminée par une personne physique.</li>
          </ul>
          <p>
            Pour exercer l'un de ces droits, veuillez nous <Link href="/contact">contacter</Link>. Si vous estimez que nous traitons vos données en violation des dispositions de protection des données, vous pouvez également nous signaler au PFPDT.
          </p>

          <h2>Comment protégeons-nous vos données ?</h2>
          <p>
            Nous prenons des mesures de sécurité appropriées, telles que le chiffrement, pour protéger vos données personnelles. Si vous pensez que vos données personnelles ont été compromises, veuillez nous en informer immédiatement à <a href="mailto:legal@aegryn.com">legal@aegryn.com</a>.
          </p>

          <h2>Où vos données sont-elles stockées et combien de temps ?</h2>
          <p>
            Les données sont stockées dans nos locaux ainsi que dans les centres de traitement exploités par nos fournisseurs de services. Nous traitons vos données aussi longtemps que la finalité du traitement l'exige, que nous avons un intérêt légitime à les conserver, ou que les données sont soumises à une obligation légale de conservation (jusqu'à 10 ans pour certaines données).
          </p>

          <h2>Avec qui partageons-nous vos données ?</h2>
          <p>
            La gestion de notre site web implique une collaboration avec des prestataires de services externes spécialisés (création, maintenance, hébergement). Nous nous assurons que ces communications sont strictement limitées à ce qui est nécessaire. Lorsque des données sont transférées en dehors de la Suisse ou de l'EEE, nous utilisons les clauses contractuelles types révisées de la Commission européenne ou d'autres garanties appropriées.
          </p>

          <h3>Nos fournisseurs de services</h3>
          <table>
            <thead>
              <tr><th>Fournisseur</th><th>Objectif</th><th>Lieu de traitement</th></tr>
            </thead>
            <tbody>
              <tr><td>Vercel</td><td>Hébergement et déploiement du site web.</td><td>EEE/USA</td></tr>
              <tr><td>Cloudflare</td><td>Sécurité, disponibilité et analytics RGPD-conformes du site web.</td><td>EEE/USA</td></tr>
              <tr><td>Resend</td><td>Envoi transactionnel des e-mails de contact.</td><td>EEE/USA</td></tr>
            </tbody>
          </table>

          <h2>Quels cookies utilisons-nous ?</h2>
          <p>
            Notre site web utilise des cookies. Vous pouvez accéder à la liste des types de cookies via notre bannière de cookies. Vous pouvez bloquer les cookies en activant un paramètre dans votre navigateur ou via notre bannière de cookies.
          </p>

          <h2>Réseaux sociaux</h2>
          <p>
            Nous exploitons nos présences sur les réseaux sociaux (LinkedIn, Facebook, Instagram, TikTok, YouTube). Lorsque vous communiquez avec nous sur ces plateformes, nous collectons des données utilisées principalement pour communiquer avec vous. Pour plus d'informations, consultez les notices de protection des données des opérateurs concernés.
          </p>

          <h2>Services de contact et de communication</h2>
          <p>
            Aegryn Sàrl n'est pas un fournisseur de services de télécommunication. Les fonctionnalités de communication au sein des applications (appels, chat) fonctionnent exclusivement via les protocoles Internet (VoIP et messagerie de données). Ce numéro de contact et les fonctions de communication des applications ne sont <strong>pas</strong> destinés aux services d'urgence.
          </p>

          <h2>Dispositions finales</h2>
          <p>
            Nous nous réservons le droit de modifier les termes de la présente notice à notre entière discrétion. Toute version modifiée sera publiée sur notre site web.
          </p>
        </div>
      </div>
    </main>
  )
}
