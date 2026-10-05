/**
 * Catalogue des dix actions des pages ACCOMPAGNER (deux boutons par page :
 * un échange de cadrage, une action spécifique). Chaque bouton pointe vers
 * /contact?metier=...&action=..., qui affiche le titre et la question
 * propres à l'action. Les paramètres metier/action sont des identifiants
 * stables (non traduits) ; seuls label/question/options sont localisés.
 */

export type Metier = 'strategie' | 'conformite' | 'technologie' | 'talent' | 'ma'
export type ActionSlug =
  | 'echange' | 'arbitrage'
  | 'cartographie'
  | 'audit' | 'reversibilite'
  | 'indice' | 'succession'
  | 'revue-cible'

export interface ActionDef {
  /** Libellé du bouton, aussi utilisé comme titre du formulaire */
  label:        string
  /** Question spécifique posée en plus des champs communs */
  question:     string
  questionType: 'text' | 'select'
  options?:     string[]
}

type Key = `${Metier}:${ActionSlug}`

/** Pour chaque page, le bouton d'échange et le bouton d'action affichés */
export const PAGE_ACTIONS: Record<Metier, { echange: ActionSlug; action: ActionSlug }> = {
  strategie:    { echange: 'echange', action: 'arbitrage' },
  conformite:   { echange: 'echange', action: 'cartographie' },
  technologie:  { echange: 'audit',   action: 'reversibilite' },
  talent:       { echange: 'indice',  action: 'succession' },
  ma:           { echange: 'echange', action: 'revue-cible' },
}

export const ADVISORY_ACTIONS: Record<string, Partial<Record<Key, ActionDef>>> = {
  fr: {
    'strategie:echange':    { label: 'Poser votre décision', question: 'Quelle décision, et pour quand ?', questionType: 'text' },
    'strategie:arbitrage':  { label: 'Faire arbitrer votre décision', question: 'Quelles options envisagez-vous ?', questionType: 'text' },
    'conformite:echange':   { label: 'Évaluer votre exposition', question: 'Dans quels pays opérez-vous ?', questionType: 'text' },
    'conformite:cartographie': { label: "Cartographier votre exposition", question: 'Quel texte vous préoccupe ?', questionType: 'select', options: ['NIS2', 'DORA', "Règlement IA (AI Act)", 'LPD / RGPD', 'Plusieurs / je ne sais pas'] },
    'technologie:audit':         { label: 'Auditer votre architecture', question: 'Hébergement actuel, nombre de développeurs (internes, prestataires) ?', questionType: 'text' },
    'technologie:reversibilite': { label: 'Tester vos composants critiques', question: 'Listez jusqu’à trois composants (hébergeur, éditeur, prestataire, outil d’IA)', questionType: 'text' },
    'talent:indice':      { label: 'Mesurer votre dépendance', question: 'Combien de personnes jugez-vous critiques ?', questionType: 'text' },
    'talent:succession':  { label: 'Préparer votre succession', question: 'Horizon et cadre envisagés ?', questionType: 'select', options: ['Moins de 2 ans, famille', 'Moins de 2 ans, interne ou tiers', '2 à 5 ans, famille', '2 à 5 ans, interne ou tiers', 'Plus de 5 ans'] },
    'ma:echange':      { label: 'Parler de votre opération', question: 'Acquisition, cession ou séparation d’activité ?', questionType: 'select', options: ['Acquisition', 'Cession', 'Séparation d’activité', 'Pas encore défini'] },
    'ma:revue-cible':  { label: 'Passer une cible au crible', question: 'Secteur et taille de la cible, à quel stade ?', questionType: 'select', options: ['Cible repérée', 'En discussion', "Lettre d'intention signée", 'Acquisition signée, intégration en cours'] },
  },
  en: {
    'strategie:echange':    { label: 'Frame your decision', question: 'Which decision, and by when?', questionType: 'text' },
    'strategie:arbitrage':  { label: 'Have your decision arbitrated', question: 'Which options are you considering?', questionType: 'text' },
    'conformite:echange':   { label: 'Assess your exposure', question: 'Which countries do you operate in?', questionType: 'text' },
    'conformite:cartographie': { label: 'Map your exposure', question: 'Which text concerns you?', questionType: 'select', options: ['NIS2', 'DORA', 'the AI Act', 'FADP / GDPR', 'Several / not sure'] },
    'technologie:audit':         { label: 'Audit your architecture', question: 'Current hosting, number of developers (in-house, contractors)?', questionType: 'text' },
    'technologie:reversibilite': { label: 'Test your critical components', question: 'List up to three components (host, vendor, provider, AI tool)', questionType: 'text' },
    'talent:indice':      { label: 'Measure your dependency', question: 'How many people do you consider critical?', questionType: 'text' },
    'talent:succession':  { label: 'Prepare your succession', question: 'Intended horizon and framework?', questionType: 'select', options: ['Under 2 years, family', 'Under 2 years, internal or external', '2 to 5 years, family', '2 to 5 years, internal or external', 'Over 5 years'] },
    'ma:echange':      { label: 'Talk about your deal', question: 'Acquisition, sale or business separation?', questionType: 'select', options: ['Acquisition', 'Sale', 'Business separation', 'Not yet defined'] },
    'ma:revue-cible':  { label: 'Run a target through the review', question: 'Target sector and size, what stage?', questionType: 'select', options: ['Target identified', 'In discussion', 'Letter of intent signed', 'Deal signed, integration under way'] },
  },
  de: {
    'strategie:echange':    { label: 'Ihre Entscheidung rahmen', question: 'Welche Entscheidung, und bis wann?', questionType: 'text' },
    'strategie:arbitrage':  { label: 'Ihre Entscheidung prüfen lassen', question: 'Welche Optionen ziehen Sie in Betracht?', questionType: 'text' },
    'conformite:echange':   { label: 'Ihre Exposition bewerten', question: 'In welchen Ländern sind Sie tätig?', questionType: 'text' },
    'conformite:cartographie': { label: 'Ihre Exposition kartieren', question: 'Welcher Erlass beschäftigt Sie?', questionType: 'select', options: ['NIS2', 'DORA', 'der AI Act', 'DSG / DSGVO', 'Mehrere / weiss nicht'] },
    'technologie:audit':         { label: 'Ihre Architektur auditieren', question: 'Aktuelles Hosting, Anzahl Entwickler (intern, extern)?', questionType: 'text' },
    'technologie:reversibilite': { label: 'Ihre kritischen Komponenten testen', question: 'Nennen Sie bis zu drei Komponenten (Hoster, Anbieter, Dienstleister, KI-Tool)', questionType: 'text' },
    'talent:indice':      { label: 'Ihre Abhängigkeit messen', question: 'Wie viele Personen halten Sie für kritisch?', questionType: 'text' },
    'talent:succession':  { label: 'Ihre Nachfolge vorbereiten', question: 'Geplanter Horizont und Rahmen?', questionType: 'select', options: ['Unter 2 Jahre, Familie', 'Unter 2 Jahre, intern oder extern', '2 bis 5 Jahre, Familie', '2 bis 5 Jahre, intern oder extern', 'Über 5 Jahre'] },
    'ma:echange':      { label: 'Über Ihr Vorhaben sprechen', question: 'Akquisition, Verkauf oder Abspaltung?', questionType: 'select', options: ['Akquisition', 'Verkauf', 'Abspaltung', 'Noch nicht definiert'] },
    'ma:revue-cible':  { label: 'Ein Zielunternehmen prüfen lassen', question: 'Branche und Grösse des Zielunternehmens, welche Phase?', questionType: 'select', options: ['Zielunternehmen identifiziert', 'Im Gespräch', 'Absichtserklärung unterzeichnet', 'Deal unterzeichnet, Integration läuft'] },
  },
  it: {
    'strategie:echange':    { label: 'Porre la vostra decisione', question: 'Quale decisione, ed entro quando?', questionType: 'text' },
    'strategie:arbitrage':  { label: 'Far arbitrare la vostra decisione', question: 'Quali opzioni state considerando?', questionType: 'text' },
    'conformite:echange':   { label: 'Valutare la vostra esposizione', question: 'In quali paesi operate?', questionType: 'text' },
    'conformite:cartographie': { label: 'Mappare la vostra esposizione', question: 'Quale testo vi preoccupa?', questionType: 'select', options: ['NIS2', 'DORA', "l'AI Act", 'LPD / GDPR', 'Più di uno / non so'] },
    'technologie:audit':         { label: 'Verificare la vostra architettura', question: 'Hosting attuale, numero di sviluppatori (interni, esterni)?', questionType: 'text' },
    'technologie:reversibilite': { label: 'Sottoporre al test i vostri componenti critici', question: 'Elencate fino a tre componenti (hoster, editore, fornitore, strumento IA)', questionType: 'text' },
    'talent:indice':      { label: 'Misurare la vostra dipendenza', question: 'Quante persone ritenete critiche?', questionType: 'text' },
    'talent:succession':  { label: 'Preparare la vostra successione', question: 'Orizzonte e quadro previsti?', questionType: 'select', options: ['Meno di 2 anni, famiglia', 'Meno di 2 anni, interno o esterno', 'Da 2 a 5 anni, famiglia', 'Da 2 a 5 anni, interno o esterno', 'Oltre 5 anni'] },
    'ma:echange':      { label: 'Parlare della vostra operazione', question: 'Acquisizione, cessione o separazione di un’attività?', questionType: 'select', options: ['Acquisizione', 'Cessione', 'Separazione di attività', 'Non ancora definito'] },
    'ma:revue-cible':  { label: 'Passare un target al vaglio', question: 'Settore e dimensione del target, a che fase?', questionType: 'select', options: ['Target individuato', 'In discussione', 'Lettera di intenti firmata', 'Operazione firmata, integrazione in corso'] },
  },
  es: {
    'strategie:echange':    { label: 'Plantear su decisión', question: '¿Qué decisión, y para cuándo?', questionType: 'text' },
    'strategie:arbitrage':  { label: 'Hacer arbitrar su decisión', question: '¿Qué opciones está considerando?', questionType: 'text' },
    'conformite:echange':   { label: 'Evaluar su exposición', question: '¿En qué países opera?', questionType: 'text' },
    'conformite:cartographie': { label: 'Cartografiar su exposición', question: '¿Qué texto le preocupa?', questionType: 'select', options: ['NIS2', 'DORA', 'el AI Act', 'LPD / RGPD', 'Varios / no lo sé'] },
    'technologie:audit':         { label: 'Auditar su arquitectura', question: '¿Alojamiento actual, número de desarrolladores (internos, externos)?', questionType: 'text' },
    'technologie:reversibilite': { label: 'Someter a prueba sus componentes críticos', question: 'Enumere hasta tres componentes (alojamiento, editor, proveedor, herramienta de IA)', questionType: 'text' },
    'talent:indice':      { label: 'Medir su dependencia', question: '¿A cuántas personas considera críticas?', questionType: 'text' },
    'talent:succession':  { label: 'Preparar su sucesión', question: '¿Horizonte y marco previstos?', questionType: 'select', options: ['Menos de 2 años, familia', 'Menos de 2 años, interno o externo', 'De 2 a 5 años, familia', 'De 2 a 5 años, interno o externo', 'Más de 5 años'] },
    'ma:echange':      { label: 'Hablar de su operación', question: '¿Adquisición, venta o separación de una actividad?', questionType: 'select', options: ['Adquisición', 'Venta', 'Separación de actividad', 'Aún no definido'] },
    'ma:revue-cible':  { label: 'Pasar un objetivo por el tamiz', question: 'Sector y tamaño del objetivo, ¿en qué fase?', questionType: 'select', options: ['Objetivo identificado', 'En conversaciones', 'Carta de intenciones firmada', 'Operación firmada, integración en curso'] },
  },
  nl: {
    'strategie:echange':    { label: 'Uw beslissing kaderen', question: 'Welke beslissing, en tegen wanneer?', questionType: 'text' },
    'strategie:arbitrage':  { label: 'Uw beslissing laten toetsen', question: 'Welke opties overweegt u?', questionType: 'text' },
    'conformite:echange':   { label: 'Uw blootstelling beoordelen', question: 'In welke landen bent u actief?', questionType: 'text' },
    'conformite:cartographie': { label: 'Uw blootstelling in kaart brengen', question: 'Welke tekst baart u zorgen?', questionType: 'select', options: ['NIS2', 'DORA', 'de AI Act', 'DSG / AVG', 'Meerdere / weet niet'] },
    'technologie:audit':         { label: 'Uw architectuur auditen', question: 'Huidige hosting, aantal ontwikkelaars (intern, extern)?', questionType: 'text' },
    'technologie:reversibilite': { label: 'Uw kritieke componenten testen', question: 'Noem tot drie componenten (hoster, leverancier, dienstverlener, AI-tool)', questionType: 'text' },
    'talent:indice':      { label: 'Uw afhankelijkheid meten', question: 'Hoeveel personen beschouwt u als kritiek?', questionType: 'text' },
    'talent:succession':  { label: 'Uw opvolging voorbereiden', question: 'Beoogde horizon en kader?', questionType: 'select', options: ['Minder dan 2 jaar, familie', 'Minder dan 2 jaar, intern of extern', '2 tot 5 jaar, familie', '2 tot 5 jaar, intern of extern', 'Meer dan 5 jaar'] },
    'ma:echange':      { label: 'Praten over uw transactie', question: 'Overname, verkoop of afsplitsing?', questionType: 'select', options: ['Overname', 'Verkoop', 'Afsplitsing', 'Nog niet bepaald'] },
    'ma:revue-cible':  { label: 'Een doelwit door de zeef halen', question: 'Sector en omvang van het doelwit, welke fase?', questionType: 'select', options: ['Doelwit geïdentificeerd', 'In gesprek', 'Intentieverklaring getekend', 'Deal getekend, integratie loopt'] },
  },
}

export function getAction(locale: string, metier: Metier, action: ActionSlug): ActionDef | null {
  const dict = ADVISORY_ACTIONS[locale] ?? ADVISORY_ACTIONS.fr
  return dict[`${metier}:${action}` as Key] ?? ADVISORY_ACTIONS.fr[`${metier}:${action}` as Key] ?? null
}

/** Les 5 clusters sectoriels du site (mêmes que /industries), pour le champ commun "secteur" */
export const SECTOR_CLUSTERS: Record<string, string[]> = {
  fr: ['Finance & Capital', 'Santé & Sciences de la vie', 'Industrie, Énergie & Infrastructures', 'Commerce, Services & Expérience client', 'Tech, Innovation & Secteur public'],
  en: ['Finance & Capital', 'Health & Life Sciences', 'Industry, Energy & Infrastructure', 'Commerce, Services & Customer Experience', 'Tech, Innovation & Public Sector'],
  de: ['Finance & Capital', 'Health & Life Sciences', 'Industrie, Energie & Infrastruktur', 'Handel, Dienstleistungen & Kundenerlebnis', 'Tech, Innovation & öffentlicher Sektor'],
  it: ['Finance & Capital', 'Salute & Scienze della vita', 'Industria, Energia & Infrastrutture', 'Commercio, Servizi & Esperienza cliente', 'Tech, Innovazione & Settore pubblico'],
  es: ['Finance & Capital', 'Salud y Ciencias de la vida', 'Industria, Energía e Infraestructuras', 'Comercio, Servicios y Experiencia de cliente', 'Tech, Innovación y Sector público'],
  nl: ['Finance & Capital', 'Gezondheid & Life Sciences', 'Industrie, Energie & Infrastructuur', 'Handel, Diensten & Klantbeleving', 'Tech, Innovatie & Publieke sector'],
}

export const REVENUE_BANDS: Record<string, { value: string; label: string }[]> = {
  fr: [{ value: '10_50m', label: '10 à 50 M€' }, { value: '50_300m', label: '50 à 300 M€' }, { value: 'autre', label: 'Autre / non applicable' }],
  en: [{ value: '10_50m', label: '€10 to 50 M' }, { value: '50_300m', label: '€50 to 300 M' }, { value: 'autre', label: 'Other / not applicable' }],
  de: [{ value: '10_50m', label: '10 bis 50 Mio. €' }, { value: '50_300m', label: '50 bis 300 Mio. €' }, { value: 'autre', label: 'Andere / nicht zutreffend' }],
  it: [{ value: '10_50m', label: 'da 10 a 50 M€' }, { value: '50_300m', label: 'da 50 a 300 M€' }, { value: 'autre', label: 'Altro / non applicabile' }],
  es: [{ value: '10_50m', label: 'de 10 a 50 M€' }, { value: '50_300m', label: 'de 50 a 300 M€' }, { value: 'autre', label: 'Otro / no aplicable' }],
  nl: [{ value: '10_50m', label: '10 tot 50 M€' }, { value: '50_300m', label: '50 tot 300 M€' }, { value: 'autre', label: 'Anders / niet van toepassing' }],
}
