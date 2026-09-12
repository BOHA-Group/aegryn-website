import type { Metadata }   from 'next'
import Link                from 'next/link'
import { generateAegrynMetadata } from '@/lib/seo'

type Props = { params: Promise<{ locale: string }> }

type Def = { fr: string; en: string; de: string; es: string; it: string; nl: string }
type Lang = keyof Def

/* ── Glossary data — 6 langues ─────────────────────────────────────── */
const TERMS: { letter: string; terms: { id: string; name: string; def: Def }[] }[] = [
  {
    letter: 'A',
    terms: [
      { id: 'arr', name: 'ARR', def: {
        fr: 'Annual Recurring Revenue — Le revenu annuel récurrent, base de calcul des multiples de valorisation SaaS. Ne pas confondre avec le revenu total qui inclut les revenus one-shot.',
        en: 'Annual Recurring Revenue — The annual recurring revenue, basis for SaaS valuation multiples. Do not confuse with total revenue which includes one-shot revenues.',
        de: 'Annual Recurring Revenue — Der jährlich wiederkehrende Umsatz, Berechnungsgrundlage für SaaS-Bewertungsmultiples. Nicht mit dem Gesamtumsatz verwechseln, der einmalige Erlöse enthält.',
        es: 'Annual Recurring Revenue — El ingreso anual recurrente, base de cálculo de los múltiplos de valoración SaaS. No confundir con el ingreso total, que incluye ingresos puntuales.',
        it: 'Annual Recurring Revenue — Il ricavo annuale ricorrente, base di calcolo dei multipli di valutazione SaaS. Da non confondere con il fatturato totale che include ricavi una tantum.',
        nl: 'Annual Recurring Revenue — De jaarlijks terugkerende omzet, berekeningsbasis voor SaaS-waarderingsmultiples. Niet verwarren met de totale omzet die eenmalige inkomsten bevat.',
      }},
      { id: 'asset-deal', name: 'Asset deal', def: {
        fr: 'Acquisition des actifs uniquement (code, IP, contrats, clients) sans reprendre la structure légale de la société. Opposé au share deal.',
        en: 'Acquisition of assets only (code, IP, contracts, clients) without taking on the legal company structure. Opposite of a share deal.',
        de: 'Erwerb nur der Vermögenswerte (Code, IP, Verträge, Kunden), ohne die rechtliche Gesellschaftsstruktur zu übernehmen. Gegenteil des Share Deals.',
        es: 'Adquisición únicamente de los activos (código, IP, contratos, clientes) sin asumir la estructura legal de la sociedad. Opuesto al share deal.',
        it: 'Acquisizione dei soli asset (codice, IP, contratti, clienti) senza rilevare la struttura legale della società. Opposto allo share deal.',
        nl: 'Overname van uitsluitend de activa (code, IP, contracten, klanten) zonder de juridische vennootschapsstructuur over te nemen. Tegenovergestelde van een share deal.',
      }},
    ],
  },
  {
    letter: 'C',
    terms: [
      { id: 'cac', name: 'CAC', def: {
        fr: 'Customer Acquisition Cost — Coût d\'acquisition d\'un client. Le ratio LTV:CAC > 3:1 est le seuil minimum pour un SaaS B2B sain.',
        en: 'Customer Acquisition Cost — Cost of acquiring a client. An LTV:CAC ratio > 3:1 is the minimum threshold for a healthy B2B SaaS.',
        de: 'Customer Acquisition Cost — Kosten der Kundengewinnung. Ein LTV:CAC-Verhältnis > 3:1 ist die Mindestschwelle für ein gesundes B2B-SaaS.',
        es: 'Customer Acquisition Cost — Coste de adquisición de un cliente. El ratio LTV:CAC > 3:1 es el umbral mínimo para un SaaS B2B sano.',
        it: 'Customer Acquisition Cost — Costo di acquisizione di un cliente. Il rapporto LTV:CAC > 3:1 è la soglia minima per un SaaS B2B sano.',
        nl: 'Customer Acquisition Cost — Kosten van het werven van een klant. Een LTV:CAC-ratio > 3:1 is de minimumdrempel voor een gezonde B2B-SaaS.',
      }},
      { id: 'churn', name: 'Churn', def: {
        fr: 'Taux d\'attrition. Churn client (% de clients perdus) vs churn revenu (% de revenu perdu). Le churn revenu est plus significatif pour la valorisation.',
        en: 'Attrition rate. Client churn (% of clients lost) vs revenue churn (% of revenue lost). Revenue churn is more significant for valuation.',
        de: 'Abwanderungsrate. Kunden-Churn (% verlorener Kunden) vs. Umsatz-Churn (% verlorener Umsatz). Der Umsatz-Churn ist für die Bewertung aussagekräftiger.',
        es: 'Tasa de abandono. Churn de clientes (% de clientes perdidos) vs churn de ingresos (% de ingresos perdidos). El churn de ingresos es más significativo para la valoración.',
        it: 'Tasso di abbandono. Churn clienti (% di clienti persi) vs churn ricavi (% di ricavi persi). Il churn dei ricavi è più significativo per la valutazione.',
        nl: 'Verlooppercentage. Klant-churn (% verloren klanten) vs omzet-churn (% verloren omzet). Omzet-churn is belangrijker voor de waardering.',
      }},
      { id: 'closing', name: 'Closing', def: {
        fr: 'Finalisation juridique et financière de la transaction. Signature du SPA + virement du solde du prix + transfert des droits.',
        en: 'Legal and financial completion of the transaction. SPA signature + balance transfer + rights transfer.',
        de: 'Rechtliche und finanzielle Vollendung der Transaktion. SPA-Unterzeichnung + Zahlung des Restbetrags + Übertragung der Rechte.',
        es: 'Finalización jurídica y financiera de la transacción. Firma del SPA + transferencia del saldo del precio + transferencia de derechos.',
        it: 'Completamento giuridico e finanziario della transazione. Firma dello SPA + versamento del saldo del prezzo + trasferimento dei diritti.',
        nl: 'Juridische en financiële voltooiing van de transactie. SPA-ondertekening + overmaking van het restbedrag + overdracht van rechten.',
      }},
    ],
  },
  {
    letter: 'D',
    terms: [
      { id: 'data-room', name: 'Data room', def: {
        fr: 'Espace sécurisé de partage de documents entre vendeur et acquéreur qualifié, sous NDA. Contient les éléments d\'audit complets (financiers, techniques, juridiques).',
        en: 'Secure document sharing space between seller and qualified acquirer, under NDA. Contains complete audit materials (financial, technical, legal).',
        de: 'Gesicherter Dokumentenaustauschraum zwischen Verkäufer und qualifiziertem Käufer, unter NDA. Enthält die vollständigen Audit-Unterlagen (finanziell, technisch, juristisch).',
        es: 'Espacio seguro de intercambio de documentos entre vendedor y comprador cualificado, bajo NDA. Contiene los elementos de auditoría completos (financieros, técnicos, jurídicos).',
        it: 'Spazio sicuro di condivisione documenti tra venditore e acquirente qualificato, sotto NDA. Contiene gli elementi di audit completi (finanziari, tecnici, legali).',
        nl: 'Beveiligde ruimte voor het delen van documenten tussen verkoper en gekwalificeerde koper, onder NDA. Bevat de volledige auditmaterialen (financieel, technisch, juridisch).',
      }},
      { id: 'due-diligence', name: 'Due diligence', def: {
        fr: 'Processus d\'audit approfondi mené par l\'acquéreur avant closing. Couvre les dimensions technique, juridique, financière, et commerciale.',
        en: 'In-depth audit process conducted by the acquirer before closing. Covers technical, legal, financial, and commercial dimensions.',
        de: 'Vertieftes Audit-Verfahren, das der Käufer vor dem Closing durchführt. Umfasst die technischen, juristischen, finanziellen und kommerziellen Dimensionen.',
        es: 'Proceso de auditoría en profundidad realizado por el comprador antes del cierre. Cubre las dimensiones técnica, jurídica, financiera y comercial.',
        it: 'Processo di audit approfondito condotto dall\'acquirente prima del closing. Copre le dimensioni tecnica, legale, finanziaria e commerciale.',
        nl: 'Diepgaand auditproces uitgevoerd door de koper vóór de closing. Omvat de technische, juridische, financiële en commerciële dimensies.',
      }},
    ],
  },
  {
    letter: 'E',
    terms: [
      { id: 'earnout', name: 'Earnout', def: {
        fr: 'Complément de prix conditionnel versé après le closing, basé sur l\'atteinte d\'objectifs définis (ARR, croissance, rétention). Mécanisme d\'alignement d\'intérêts entre vendeur et acquéreur.',
        en: 'Conditional price supplement paid after closing, based on achieving defined targets (ARR, growth, retention). An interest-alignment mechanism between seller and acquirer.',
        de: 'Bedingter Preisaufschlag, der nach dem Closing gezahlt wird, basierend auf dem Erreichen definierter Ziele (ARR, Wachstum, Retention). Ein Interessen-Alignierungsmechanismus zwischen Verkäufer und Käufer.',
        es: 'Complemento de precio condicional pagado tras el cierre, basado en el cumplimiento de objetivos definidos (ARR, crecimiento, retención). Mecanismo de alineación de intereses entre vendedor y comprador.',
        it: 'Integrazione di prezzo condizionale versata dopo il closing, basata sul raggiungimento di obiettivi definiti (ARR, crescita, retention). Meccanismo di allineamento degli interessi tra venditore e acquirente.',
        nl: 'Voorwaardelijke prijstoeslag die na de closing wordt betaald, gebaseerd op het bereiken van vastgelegde doelen (ARR, groei, retentie). Een mechanisme om de belangen van verkoper en koper af te stemmen.',
      }},
      { id: 'escrow', name: 'Escrow (séquestre)', def: {
        fr: 'Montant bloqué par une tierce partie (banque ou notaire) pendant la période entre la signature et le closing. Garantit le vendeur contre le défaut de paiement.',
        en: 'Amount held by a third party (bank or notary) during the period between signing and closing. Protects the seller against payment default.',
        de: 'Betrag, der von einem Dritten (Bank oder Notar) während der Zeit zwischen Unterzeichnung und Closing hinterlegt wird. Schützt den Verkäufer gegen Zahlungsausfall.',
        es: 'Importe retenido por un tercero (banco o notario) durante el período entre la firma y el cierre. Protege al vendedor contra el impago.',
        it: 'Importo vincolato presso un terzo (banca o notaio) durante il periodo tra firma e closing. Protegge il venditore dal mancato pagamento.',
        nl: 'Bedrag dat door een derde partij (bank of notaris) wordt vastgehouden tijdens de periode tussen ondertekening en closing. Beschermt de verkoper tegen wanbetaling.',
      }},
    ],
  },
  {
    letter: 'G',
    terms: [
      { id: 'grade-aeg', name: 'Grade AEG', def: {
        fr: 'Certification indépendante des analystes Aegryn sur un actif tech, émise selon un protocole reproductible. De ★ (Exceptionnel) à B (Correct). Non attribué = Refusé. Basé sur 4 dimensions : Code, IP, Finance, Sécurité.',
        en: 'Independent certification from Aegryn analysts on a tech asset, issued following a reproducible protocol. From ★ (Exceptional) to B (Standard). Not assigned = Refused. Based on 4 dimensions: Code, IP, Finance, Security.',
        de: 'Unabhängige Zertifizierung eines Tech-Assets durch Aegryn-Analysten nach einem reproduzierbaren Protokoll. Von ★ (Aussergewöhnlich) bis B (Standard). Nicht vergeben = Abgelehnt. Basierend auf 4 Dimensionen: Code, IP, Finanzen, Sicherheit.',
        es: 'Certificación independiente de los analistas de Aegryn sobre un activo tech, emitida según un protocolo reproducible. De ★ (Excepcional) a B (Correcta). No asignada = Rechazada. Basada en 4 dimensiones: Código, IP, Finanzas, Seguridad.',
        it: 'Certificazione indipendente degli analisti Aegryn su un asset tech, emessa secondo un protocollo riproducibile. Da ★ (Eccezionale) a B (Corretta). Non assegnata = Rifiutata. Basata su 4 dimensioni: Codice, IP, Finanza, Sicurezza.',
        nl: 'Onafhankelijke certificering van een tech-actief door Aegryn-analisten volgens een reproduceerbaar protocol. Van ★ (Uitzonderlijk) tot B (Correct). Niet toegekend = Afgewezen. Gebaseerd op 4 dimensies: Code, IP, Financiën, Beveiliging.',
      }},
    ],
  },
  {
    letter: 'L',
    terms: [
      { id: 'loi', name: 'LOI (Letter of Intent)', def: {
        fr: 'Lettre d\'intention non-engageante. Première formalisation de l\'accord entre acheteur et vendeur sur le prix indicatif et les conditions principales.',
        en: 'Non-binding letter of intent. First formalisation of the agreement between buyer and seller on the indicative price and main conditions.',
        de: 'Unverbindliche Absichtserklärung. Erste Formalisierung der Einigung zwischen Käufer und Verkäufer über den indikativen Preis und die wichtigsten Bedingungen.',
        es: 'Carta de intenciones no vinculante. Primera formalización del acuerdo entre comprador y vendedor sobre el precio indicativo y las condiciones principales.',
        it: 'Lettera di intenti non vincolante. Prima formalizzazione dell\'accordo tra acquirente e venditore sul prezzo indicativo e le condizioni principali.',
        nl: 'Niet-bindende intentieverklaring. Eerste formalisering van de overeenkomst tussen koper en verkoper over de indicatieve prijs en de belangrijkste voorwaarden.',
      }},
      { id: 'ltv', name: 'LTV', def: {
        fr: 'Lifetime Value — Revenu total généré par un client sur sa durée de vie. Formule : LTV = ARPU × (1 / churn mensuel).',
        en: 'Lifetime Value — Total revenue generated by a client over their lifetime. Formula: LTV = ARPU × (1 / monthly churn).',
        de: 'Lifetime Value — Gesamtumsatz, den ein Kunde über seine gesamte Lebensdauer generiert. Formel: LTV = ARPU × (1 / monatlicher Churn).',
        es: 'Lifetime Value — Ingreso total generado por un cliente durante su vida útil. Fórmula: LTV = ARPU × (1 / churn mensual).',
        it: 'Lifetime Value — Ricavo totale generato da un cliente nel corso della sua vita. Formula: LTV = ARPU × (1 / churn mensile).',
        nl: 'Lifetime Value — Totale omzet die een klant gedurende zijn levensduur genereert. Formule: LTV = ARPU × (1 / maandelijkse churn).',
      }},
    ],
  },
  {
    letter: 'M',
    terms: [
      { id: 'mrr', name: 'MRR', def: {
        fr: 'Monthly Recurring Revenue — L\'ARR divisé par 12. Utile pour les actifs jeunes ou en forte croissance mensuelle.',
        en: 'Monthly Recurring Revenue — ARR divided by 12. Useful for young or fast-growing assets.',
        de: 'Monthly Recurring Revenue — Der ARR geteilt durch 12. Nützlich für junge oder monatlich stark wachsende Assets.',
        es: 'Monthly Recurring Revenue — El ARR dividido entre 12. Útil para activos jóvenes o de fuerte crecimiento mensual.',
        it: 'Monthly Recurring Revenue — L\'ARR diviso per 12. Utile per asset giovani o in forte crescita mensile.',
        nl: 'Monthly Recurring Revenue — De ARR gedeeld door 12. Nuttig voor jonge of maandelijks snelgroeiende activa.',
      }},
      { id: 'multiple-arr', name: 'Multiple ARR', def: {
        fr: 'Prix de cession exprimé en multiple de l\'ARR annuel. Exemple : actif avec 500K€ ARR vendu 2M€ = multiple de 4x ARR. Indicateur principal de valorisation SaaS.',
        en: 'Sale price expressed as a multiple of annual ARR. Example: asset with €500K ARR sold for €2M = 4x ARR multiple. Primary SaaS valuation indicator.',
        de: 'Verkaufspreis, ausgedrückt als Multiple des jährlichen ARR. Beispiel: Asset mit 500 K€ ARR, verkauft für 2 M€ = 4x ARR-Multiple. Hauptkennzahl der SaaS-Bewertung.',
        es: 'Precio de venta expresado en múltiplo del ARR anual. Ejemplo: activo con 500K€ de ARR vendido por 2M€ = múltiplo de 4x ARR. Indicador principal de valoración SaaS.',
        it: 'Prezzo di cessione espresso in multiplo dell\'ARR annuale. Esempio: asset con 500K€ di ARR venduto a 2M€ = multiplo di 4x ARR. Indicatore principale di valutazione SaaS.',
        nl: 'Verkoopprijs uitgedrukt als multiple van de jaarlijkse ARR. Voorbeeld: actief met €500K ARR verkocht voor €2M = 4x ARR-multiple. Primaire SaaS-waarderingsindicator.',
      }},
    ],
  },
  {
    letter: 'N',
    terms: [
      { id: 'nrr', name: 'NRR', def: {
        fr: 'Net Revenue Retention — Mesure l\'évolution du revenu sur une cohorte de clients existants. NRR > 100% = expansion nette. Indicateur critique pour les multiples premium (NRR > 110% → multiples top quartile).',
        en: 'Net Revenue Retention — Measures revenue evolution on a cohort of existing clients. NRR > 100% = net expansion. Critical indicator for premium multiples (NRR > 110% → top quartile multiples).',
        de: 'Net Revenue Retention — Misst die Umsatzentwicklung innerhalb einer bestehenden Kundenkohorte. NRR > 100 % = Nettoexpansion. Kritische Kennzahl für Premium-Multiples (NRR > 110 % → Top-Quartil-Multiples).',
        es: 'Net Revenue Retention — Mide la evolución del ingreso en una cohorte de clientes existentes. NRR > 100 % = expansión neta. Indicador crítico para múltiplos premium (NRR > 110 % → múltiplos de cuartil superior).',
        it: 'Net Revenue Retention — Misura l\'evoluzione del ricavo su una coorte di clienti esistenti. NRR > 100% = espansione netta. Indicatore critico per i multipli premium (NRR > 110% → multipli di quartile superiore).',
        nl: 'Net Revenue Retention — Meet de omzetontwikkeling binnen een cohort bestaande klanten. NRR > 100% = netto-expansie. Kritieke indicator voor premium-multiples (NRR > 110% → topkwartiel-multiples).',
      }},
    ],
  },
  {
    letter: 'P',
    terms: [
      { id: 'pe', name: 'PE (Private Equity)', def: {
        fr: 'Fonds d\'investissement qui acquiert pour restructurer et revendre à horizon 3–7 ans. Représente environ 58% des acquéreurs SaaS en Europe en 2025.',
        en: 'Investment fund that acquires to restructure and resell at a 3–7 year horizon. Represents approximately 58% of SaaS acquirers in Europe in 2025.',
        de: 'Investmentfonds, der kauft, um zu restrukturieren und innerhalb von 3–7 Jahren weiterzuverkaufen. Stellt 2025 etwa 58 % der SaaS-Käufer in Europa.',
        es: 'Fondo de inversión que adquiere para reestructurar y revender en un horizonte de 3–7 años. Representa aproximadamente el 58 % de los compradores de SaaS en Europa en 2025.',
        it: 'Fondo di investimento che acquisisce per ristrutturare e rivendere in un orizzonte di 3–7 anni. Rappresenta circa il 58% degli acquirenti SaaS in Europa nel 2025.',
        nl: 'Investeringsfonds dat overneemt om te herstructureren en binnen 3–7 jaar door te verkopen. Vertegenwoordigt in 2025 ongeveer 58% van de SaaS-kopers in Europa.',
      }},
    ],
  },
  {
    letter: 'S',
    terms: [
      { id: 'search-fund', name: 'Search Fund', def: {
        fr: 'Véhicule créé par un entrepreneur (le searcher) pour lever du capital, trouver une entreprise à acquérir, et l\'opérer personnellement. Modèle en forte croissance en Europe.',
        en: 'Vehicle created by an entrepreneur (the searcher) to raise capital, find a company to acquire, and operate it personally. A fast-growing model in Europe.',
        de: 'Vehikel, das ein Unternehmer (der Searcher) schafft, um Kapital aufzunehmen, ein zu erwerbendes Unternehmen zu finden und es persönlich zu führen. Ein in Europa stark wachsendes Modell.',
        es: 'Vehículo creado por un emprendedor (el searcher) para levantar capital, encontrar una empresa que adquirir y operarla personalmente. Un modelo en fuerte crecimiento en Europa.',
        it: 'Veicolo creato da un imprenditore (il searcher) per raccogliere capitale, trovare un\'azienda da acquisire e gestirla personalmente. Un modello in forte crescita in Europa.',
        nl: 'Voertuig opgericht door een ondernemer (de searcher) om kapitaal aan te trekken, een bedrijf te vinden om over te nemen en het persoonlijk te leiden. Een snelgroeiend model in Europa.',
      }},
      { id: 'share-deal', name: 'Share deal', def: {
        fr: 'Rachat de la société entière (ses parts ou actions) qui détient l\'actif. L\'acquéreur hérite de tous les actifs ET passifs. Opposé à l\'asset deal.',
        en: 'Acquisition of the entire company (its shares) holding the asset. The acquirer inherits all assets AND liabilities. Opposite of an asset deal.',
        de: 'Kauf der gesamten Gesellschaft (ihrer Anteile oder Aktien), die das Asset hält. Der Käufer erbt sämtliche Aktiva UND Passiva. Gegenteil des Asset Deals.',
        es: 'Compra de la sociedad entera (sus participaciones o acciones) que posee el activo. El comprador hereda todos los activos Y pasivos. Opuesto al asset deal.',
        it: 'Acquisizione dell\'intera società (le sue quote o azioni) che detiene l\'asset. L\'acquirente eredita tutti gli attivi E passivi. Opposto all\'asset deal.',
        nl: 'Overname van de gehele vennootschap (haar aandelen) die het actief bezit. De koper erft alle activa ÉN passiva. Tegenovergestelde van een asset deal.',
      }},
      { id: 'spa', name: 'SPA (Share Purchase Agreement)', def: {
        fr: 'Acte de cession final dans le cas d\'un share deal. Document juridique principal de la transaction, signé au closing.',
        en: 'Final transfer deed in the case of a share deal. The main legal document of the transaction, signed at closing.',
        de: 'Endgültige Übertragungsurkunde bei einem Share Deal. Das wichtigste Rechtsdokument der Transaktion, beim Closing unterzeichnet.',
        es: 'Escritura de cesión final en el caso de un share deal. El documento jurídico principal de la transacción, firmado en el cierre.',
        it: 'Atto di cessione finale nel caso di uno share deal. Il principale documento legale della transazione, firmato al closing.',
        nl: 'Definitieve overdrachtsakte bij een share deal. Het belangrijkste juridische document van de transactie, ondertekend bij de closing.',
      }},
      { id: 'strategic-buyer', name: 'Strategic buyer', def: {
        fr: 'Acquéreur industriel qui intègre l\'actif à son activité existante (acqui-hire, intégration technique, expansion verticale). Peut payer des primes significatives vs les fonds PE.',
        en: 'Industrial acquirer who integrates the asset into their existing activity (acqui-hire, technical integration, vertical expansion). Can pay significant premiums vs PE funds.',
        de: 'Industrieller Käufer, der das Asset in seine bestehende Tätigkeit integriert (Acqui-Hire, technische Integration, vertikale Expansion). Kann gegenüber PE-Fonds deutliche Prämien zahlen.',
        es: 'Comprador industrial que integra el activo en su actividad existente (acqui-hire, integración técnica, expansión vertical). Puede pagar primas significativas frente a los fondos PE.',
        it: 'Acquirente industriale che integra l\'asset nella propria attività esistente (acqui-hire, integrazione tecnica, espansione verticale). Può pagare premi significativi rispetto ai fondi PE.',
        nl: 'Industriële koper die het actief integreert in zijn bestaande activiteit (acqui-hire, technische integratie, verticale expansie). Kan aanzienlijke premies betalen ten opzichte van PE-fondsen.',
      }},
    ],
  },
]

/* ── UI texte par langue ───────────────────────────────────────────── */
const UI: Record<Lang, { metaTitle: string; metaDesc: string; kicker: string; title: string; sub: string; ctaTitle: string; ctaButton: string }> = {
  fr: {
    metaTitle: 'Glossaire M&A tech — 30 termes essentiels | Aegryn',
    metaDesc: 'Définitions des 30 termes essentiels du M&A tech européen : ARR, NRR, earnout, due diligence, Grade Aegryn, share deal et plus.',
    kicker: 'Aegryn — Ressources',
    title: 'Glossaire M&A tech',
    sub: 'Les 30 termes essentiels du marché des actifs tech européens — des métriques SaaS aux mécanismes contractuels.',
    ctaTitle: 'Approfondir avec nos analyses',
    ctaButton: 'Voir tous les articles',
  },
  en: {
    metaTitle: 'Tech M&A Glossary — 30 essential terms | Aegryn',
    metaDesc: 'Definitions of the 30 essential terms in European tech M&A: ARR, NRR, earnout, due diligence, Aegryn Grade, share deal and more.',
    kicker: 'Aegryn — Resources',
    title: 'Tech M&A Glossary',
    sub: 'The 30 essential terms of the European tech asset market — from SaaS metrics to contractual mechanisms.',
    ctaTitle: 'Go deeper with our analyses',
    ctaButton: 'View all articles',
  },
  de: {
    metaTitle: 'Tech-M&A-Glossar — 30 wesentliche Begriffe | Aegryn',
    metaDesc: 'Definitionen der 30 wichtigsten Begriffe des europäischen Tech-M&A: ARR, NRR, Earnout, Due Diligence, Aegryn Grade, Share Deal und mehr.',
    kicker: 'Aegryn — Ressourcen',
    title: 'Tech-M&A-Glossar',
    sub: 'Die 30 wichtigsten Begriffe des europäischen Tech-Asset-Marktes — von SaaS-Kennzahlen bis zu vertraglichen Mechanismen.',
    ctaTitle: 'Vertiefen Sie sich mit unseren Analysen',
    ctaButton: 'Alle Artikel ansehen',
  },
  es: {
    metaTitle: 'Glosario M&A tech — 30 términos esenciales | Aegryn',
    metaDesc: 'Definiciones de los 30 términos esenciales del M&A tech europeo: ARR, NRR, earnout, due diligence, Grade Aegryn, share deal y más.',
    kicker: 'Aegryn — Recursos',
    title: 'Glosario M&A tech',
    sub: 'Los 30 términos esenciales del mercado europeo de activos tech — de las métricas SaaS a los mecanismos contractuales.',
    ctaTitle: 'Profundice con nuestros análisis',
    ctaButton: 'Ver todos los artículos',
  },
  it: {
    metaTitle: 'Glossario M&A tech — 30 termini essenziali | Aegryn',
    metaDesc: 'Definizioni dei 30 termini essenziali dell\'M&A tech europeo: ARR, NRR, earnout, due diligence, Grade Aegryn, share deal e altro.',
    kicker: 'Aegryn — Risorse',
    title: 'Glossario M&A tech',
    sub: 'I 30 termini essenziali del mercato europeo degli asset tech — dalle metriche SaaS ai meccanismi contrattuali.',
    ctaTitle: 'Approfondisci con le nostre analisi',
    ctaButton: 'Vedi tutti gli articoli',
  },
  nl: {
    metaTitle: 'Tech M&A-woordenlijst — 30 essentiële termen | Aegryn',
    metaDesc: 'Definities van de 30 essentiële termen in Europese tech-M&A: ARR, NRR, earnout, due diligence, Aegryn Grade, share deal en meer.',
    kicker: 'Aegryn — Bronnen',
    title: 'Tech M&A-woordenlijst',
    sub: 'De 30 essentiële termen van de Europese tech-activamarkt — van SaaS-metrics tot contractuele mechanismen.',
    ctaTitle: 'Verdiep u met onze analyses',
    ctaButton: 'Bekijk alle artikelen',
  },
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const lang: Lang = (locale in UI ? locale : 'en') as Lang
  const ui = UI[lang]
  return generateAegrynMetadata({ title: ui.metaTitle, description: ui.metaDesc, path: '/glossaire', locale })
}

export default async function GlossairePage({ params }: Props) {
  const { locale } = await params
  const lang: Lang = (locale in UI ? locale : 'en') as Lang
  const ui = UI[lang]

  const letters = TERMS.map(g => g.letter)

  return (
    <main className="bg-ag-white">
      {/* Hero */}
      <section className="bg-ag-navy pt-24 pb-16 px-6">
        <div className="max-w-4xl mx-auto">
          <p className="font-mono text-[10px] tracking-[0.28em] uppercase text-ag-apex mb-5 flex items-center gap-3">
            <span className="w-6 h-px bg-ag-apex/50 inline-block" />
            {ui.kicker}
          </p>
          <h1
            className="font-sans font-bold text-white leading-[1.18] tracking-[-0.03em] mb-5"
            style={{ fontSize: 'clamp(48px,6vw,86px)' }}
          >
            {ui.title}
          </h1>
          <p className="font-sans text-[16px] text-white/55 max-w-xl mb-8">
            {ui.sub}
          </p>

          {/* Alpha nav */}
          <div className="flex flex-wrap gap-2">
            {letters.map(l => (
              <a
                key={l}
                href={`#letter-${l}`}
                className="rounded-lg font-mono text-[11px] tracking-[0.16em] uppercase px-3 py-1.5 border border-white/20 text-white/65 hover:border-ag-apex hover:text-ag-apex transition-colors"
              >
                {l}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Terms */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto space-y-16">
          {TERMS.map(group => (
            <div key={group.letter} id={`letter-${group.letter}`}>
              <div className="flex items-center gap-4 mb-8">
                <span className="font-sans font-bold text-ag-apex text-[48px] leading-none tracking-[-0.04em]">
                  {group.letter}
                </span>
                <span className="flex-1 h-px bg-ag-border" />
              </div>
              <div className="space-y-0 border border-ag-border divide-y divide-ag-border">
                {group.terms.map(term => (
                  <div key={term.id} id={term.id} className="p-6 hover:bg-ag-off-white transition-colors group">
                    <p className="font-sans font-bold text-ag-black text-[16px] tracking-[-0.01em] mb-2 group-hover:text-ag-navy transition-colors">
                      {term.name}
                    </p>
                    <p className="font-sans text-[14px] text-ag-gray leading-relaxed">
                      {term.def[lang]}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="rounded-lg py-16 px-6 border-t border-ag-border bg-ag-off-white">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-ag-apex mb-2">Aegryn Blog</p>
            <p className="font-sans font-bold text-ag-black text-[18px] tracking-[-0.02em]">
              {ui.ctaTitle}
            </p>
          </div>
          <Link
            href="/blog"
            className="rounded-lg shrink-0 inline-flex items-center gap-2 bg-ag-navy text-white font-mono text-[11px] tracking-[0.14em] uppercase px-6 py-3 hover:bg-ag-black transition-colors"
          >
            {ui.ctaButton}
          </Link>
        </div>
      </section>
    </main>
  )
}
