/**
 * FRANCHIR content — Italiano.
 * Traduzione del riferimento francese (content/franchir/fr.ts),
 * specifica del 6 ottobre 2026. Gli scenari sono illustrativi e
 * segnalati come tali.
 */

import type { CycleContent, FranchirIntro } from './types'

export const FRANCHIR_INTRO_IT: FranchirIntro = {
  meta: {
    title:       'Affrontare — ogni ciclo ha la sua decisione | Aegryn',
    description: 'Lancio, crescita, pivot, acquisizione, trasmissione: cinque cicli in cui un’organizzazione da 10 a 300 M€ impegna il suo futuro. Ecco cosa è in gioco, e chi mobilitare.',
  },
  eyebrow:   'Affrontare',
  heroTitle: 'Ogni ciclo ha la sua decisione. Trovate la vostra.',
  heroSub:   'Lancio, crescita, pivot, acquisizione, trasmissione: cinque cicli in cui un’organizzazione da 10 a 300 M€ impegna il suo futuro. Ecco cosa è in gioco, e chi mobilitare.',
  cycles: [
    { slug: 'lancement',       title: 'Lancio & Strutturazione',             stake: 'Scelte poco costose da fare ora, molto costose da correggere più tardi.' },
    { slug: 'croissance',      title: 'Crescita & Scalabilità',              stake: 'Ciò che funzionava con dieci persone rallenta con cinquanta.' },
    { slug: 'restructuration', title: 'Ristrutturazione & Pivot',            stake: 'Il modello, il mercato o la regola sono cambiati: decidere in fretta.' },
    { slug: 'acquisition',     title: 'Acquisizione & Crescita esterna',     stake: 'Sapere cosa si rileva, e come integrarlo.' },
    { slug: 'transmission',    title: 'Trasmissione & Cessione',             stake: 'Far tenere l’organizzazione senza il suo dirigente.' },
  ],
  overlap: {
    title: 'Attraversate due cicli contemporaneamente?',
    text:  'Crescere per acquisizione, ristrutturare prima di trasmettere: i cicli si sovrappongono. Aegryn costruisce un unico perimetro d’intervento, con le competenze coinvolte.',
    examples: [
      { label: 'Crescita + Acquisizione',         a: 'croissance',      b: 'acquisition' },
      { label: 'Ristrutturazione + Trasmissione', a: 'restructuration', b: 'transmission' },
    ],
  },
  diagnostic: {
    title: 'A che punto siete?',
    questions: [
      { q: 'La vostra organizzazione ha meno di 3 anni o sta preparando un nuovo prodotto o una nuova entità?', cycle: 'lancement' },
      { q: 'La vostra attività è più che raddoppiata in volume o in effettivi di recente?', cycle: 'croissance' },
      { q: 'Un cliente importante, un mercato, un incidente o una regola mettono in discussione il vostro modello?', cycle: 'restructuration' },
      { q: 'State studiando l’acquisizione di un’organizzazione o ne avete acquisita una negli ultimi 18 mesi?', cycle: 'acquisition' },
      { q: 'Pensate di passare la mano entro cinque anni?', cycle: 'transmission' },
    ],
  },
  assetsLink: { text: 'Per misurare e attestare il valore dei vostri attivi:', label: 'vedere gli attivi Aegryn' },
  cta:        { label: 'Scambiare 30 minuti' },
}

export const FRANCHIR_IT: CycleContent[] = [
  /* ------------------------------------------------------------------ */
  {
    slug: 'lancement',
    path: '/franchir/lancement',
    meta: {
      title:       'Lancio & Strutturazione — porre le giuste basi prima di spendere | Aegryn',
      description: 'Fornitori, tecnologie, proprietà intellettuale, conformità, governance: le scelte dei primi mesi costano poco da decidere e molto da correggere.',
    },
    eyebrow:  'Affrontare · Lancio & Strutturazione',
    h1:       'Porre le giuste basi prima di spendere.',
    subtitle: 'Fornitori, tecnologie, proprietà intellettuale, conformità, governance: le scelte dei primi mesi costano poco da decidere e molto da correggere.',
    verbs:    ['Inquadrare', 'Costruire', 'Reclutare'],
    constat: {
      text:   'Gli obblighi di trasparenza del regolamento europeo sull’IA (art. 50) si applicano dal 2 agosto 2026, con sanzioni fino a 15 M€ o al 3 % del fatturato mondiale per gli obblighi diversi dalle pratiche vietate. Un’organizzazione che lancia un prodotto che usa l’IA è interessata fin dal primo giorno.',
      source: 'Regolamento (UE) sull’IA.',
    },
    situations: {
      title: 'Dove vi trovate. Come interveniamo.',
      items: [
        { quote: 'Il mio fornitore ha consegnato il codice, ma non ho riletto il contratto.', decision: 'A chi appartengono codice e dati? Cosa succede se il fornitore se ne va?', metiers: ['technologie'], deliverable: 'Nota di posizione su proprietà e reversibilità, con le clausole da correggere' },
        { quote: 'Vogliamo andare veloci, la conformità la vedremo dopo.', decision: 'Quali obblighi si applicano già, quali possono attendere?', metiers: ['conformite'], deliverable: 'Mappa di esposizione: applicabile ora / presto / non interessati' },
        { quote: 'Esitiamo tra costruire, comprare o noleggiare.', decision: 'Quale perimetro costruire, quale comprare o noleggiare?', metiers: ['strategie', 'construire'], deliverable: 'Arbitrato scritto, con ciò a cui rinunciare' },
        { quote: 'Io e il mio socio non abbiamo definito chi decide.', decision: 'Chi decide cosa, chi detiene cosa?', metiers: ['talent'], deliverable: 'Quadro decisionale di due pagine, da far firmare' },
        { quote: 'Mi serve un primo responsabile tecnico.', decision: 'Profilo, status, remunerazione, ruolo verso i fornitori', metiers: ['recruter'], deliverable: 'Scheda di posto, bacino di profili' },
        { quote: 'Il nostro gruppo crea una nuova attività da isolare.', decision: 'Quale perimetro isolare dal sistema informativo del gruppo?', metiers: ['technologie', 'strategie'], deliverable: 'Piano di isolamento e roadmap dei primi 6 mesi' },
      ],
    },
    metiers: { mobilized: ['technologie', 'conformite', 'strategie', 'construire'], available: ['talent', 'recruter'] },
    bySize: {
      title: 'Secondo la dimensione',
      items: [
        { label: 'PMI', desc: 'Poche risorse, arbitrati in pochi giorni, un solo interlocutore in Aegryn.' },
        { label: 'ETI', desc: 'Nuova entità, spin-off: isolare la nuova attività dal sistema informativo e dalla governance del gruppo.' },
      ],
    },
    bySector: {
      title: 'Secondo il settore',
      items: [
        { cluster: 'Finance & Capital',                             desc: 'Requisiti di esercizio e di esternalizzazione dei sistemi fin dalla concezione.' },
        { cluster: 'Salute & Scienze della vita',                   desc: 'Dati sensibili trattati fin dal primo utente.' },
        { cluster: 'Industria, Energia & Infrastrutture',           desc: 'Software embedded, manutenzione su decenni.' },
        { cluster: 'Commercio, Servizi & Esperienza cliente',       desc: 'Consenso e dati dei clienti.' },
        { cluster: 'Tech, Innovazione & Settore pubblico',          desc: 'Reversibilità dei componenti e dei fornitori.' },
      ],
    },
    scenario: {
      tag:  'Scenario illustrativo',
      text: 'Un editore da 3 M€ di fatturato, il cui prodotto è sviluppato da un fornitore esterno, prepara il suo primo grande cliente. Il test di reversibilità mostra che il repository del codice è intestato al fornitore. La correzione si risolve in poche settimane prima della firma — e costerebbe molto di più dopo.',
    },
    ai: {
      title: 'Cosa uno strumento di IA generalista non farà al vostro posto',
      text:  'Leggere il vostro contratto con il fornitore nel suo contesto, arbitrare tra due soci, rispondere della decisione davanti al vostro consiglio o ai vostri finanziatori.',
    },
    diagnostic: {
      title: 'Autodiagnosi',
      intro: 'Cinque domande sì/no per situare le vostre basi.',
      questions: [
        { q: 'Codice e dati del vostro prodotto sono intestati alla vostra organizzazione?' },
        { q: 'Potreste cambiare il fornitore principale in meno di 90 giorni?' },
        { q: 'Avete elencato gli obblighi regolamentari applicabili al vostro prodotto?' },
        { q: 'Ruoli e poteri decisionali tra i soci sono scritti?' },
        { q: 'Qualcuno internamente comprende l’architettura da un capo all’altro?' },
      ],
      levels: [
        { min: 4, label: 'Basi poste',      desc: 'Le vostre basi sono poste. Uno scambio di 30 minuti può confermare i punti restanti.', nextAction: 'Scambiare 30 minuti' },
        { min: 2, label: 'Da mettere in sicurezza', desc: 'Diversi punti da mettere in sicurezza prima di crescere.', nextAction: 'Scambiare 30 minuti' },
        { min: 0, label: 'Fondamenta',      desc: 'Priorità alle fondamenta.', nextAction: 'Scambiare 30 minuti' },
      ],
      privacy: 'Nessun dato viene registrato: la diagnosi si calcola nel vostro browser.',
    },
    nextLabel: 'Ciclo successivo',
    next:      [{ label: 'Crescita & Scalabilità', slug: 'croissance' }],
  },

  /* ------------------------------------------------------------------ */
  {
    slug: 'croissance',
    path: '/franchir/croissance',
    meta: {
      title:       'Crescita & Scalabilità — crescere senza rompere ciò che funziona | Aegryn',
      description: 'Oltre un certo volume, ciò che funzionava con dieci persone rallenta con cinquanta: strumenti, decisioni, regole, dipendenze.',
    },
    eyebrow:  'Affrontare · Crescita & Scalabilità',
    h1:       'Crescere senza rompere ciò che funziona.',
    subtitle: 'Oltre un certo volume, ciò che funzionava con dieci persone rallenta con cinquanta: strumenti, decisioni, regole, dipendenze.',
    verbs:    ['Strutturare', 'Mettere in sicurezza', 'Rafforzare'],
    constat: {
      text:   'In Svizzera, l’uso dell’IA da parte delle PMI è passato dal 22 % al 34 % tra il 2024 e il 2025, ma solo il 34 % ha regole sui dati inseriti in questi strumenti (23 % tra le aziende con meno di 10 collaboratori). Il barometro delle PMI 2026 è a −7,3, il livello più basso dal 2021. La crescita avviene in un contesto teso, con pratiche ancora poco inquadrate.',
      source: 'SECO, Portale PMI.',
    },
    situations: {
      title: 'Dove vi trovate. Come interveniamo.',
      items: [
        { quote: 'I miei team usano l’IA come vogliono.', decision: 'Quali regole, quali dati, quali strumenti autorizzati?', metiers: ['conformite'], deliverable: 'Carta d’uso in tre regole, piano di diffusione' },
        { quote: 'Un grande cliente mi chiede garanzie di sicurezza.', decision: 'Quale livello di prova, a quale costo?', metiers: ['conformite', 'technologie'], deliverable: 'Mappa di esposizione e piano di aggiornamento prioritizzato' },
        { quote: 'Tutto passa ancora da me.', decision: 'Quali decisioni delegare, a chi, entro quali limiti?', metiers: ['talent'], deliverable: 'Indice di dipendenza e matrice di delega' },
        { quote: 'Il nostro strumento attuale non reggerà il doppio del volume.', decision: 'Riparare, rifare o sostituire?', metiers: ['technologie'], deliverable: 'Test di reversibilità e arbitrato quantificato' },
        { quote: 'Mi serve un direttore finanziario o operativo.', decision: 'Profilo, momento del reclutamento, ruolo verso il dirigente', metiers: ['recruter'], deliverable: 'Scheda di posto, bacino, griglia di colloquio' },
        { quote: 'Devo aprire un secondo mercato o una seconda filiale.', decision: 'Quale ritmo, quali priorità, quale rinuncia?', metiers: ['strategie'], deliverable: 'Griglia dei quattro test applicata alle opzioni' },
      ],
    },
    metiers: { mobilized: ['conformite', 'technologie', 'talent', 'recruter'], available: ['strategie', 'ma', 'construire'] },
    bySize: {
      title: 'Secondo la dimensione',
      items: [
        { label: 'PMI', desc: 'Fissare tre regole semplici anziché un quadro pesante; primo livello di delega.' },
        { label: 'ETI', desc: 'Coordinare più siti o filiali su una stessa politica; comitato direttivo strutturato.' },
      ],
    },
    bySector: {
      title: 'Secondo il settore',
      items: [
        { cluster: 'Finance & Capital',                             desc: 'Quadri di esternalizzazione e di resilienza operativa.' },
        { cluster: 'Salute & Scienze della vita',                   desc: 'Dati dei pazienti, tracciabilità.' },
        { cluster: 'Industria, Energia & Infrastrutture',           desc: 'Sicurezza dei sistemi industriali, obblighi degli operatori critici.' },
        { cluster: 'Commercio, Servizi & Esperienza cliente',       desc: 'Picchi di attività, dati dei clienti.' },
        { cluster: 'Tech, Innovazione & Settore pubblico',          desc: 'Requisiti crescenti dei committenti.' },
      ],
    },
    scenario: {
      tag:  'Scenario illustrativo',
      text: 'Un editore da 25 M€ i cui clienti sono energetici riceve una richiesta di misure di sicurezza prima del rinnovo. La mappa di esposizione distingue gli obblighi realmente applicabili dai timori generali e ordina i lavori su dodici mesi.',
    },
    ai: {
      title: 'Cosa uno strumento di IA generalista non farà al vostro posto',
      text:  'Decidere cosa resta centralizzato, negoziare con un grande cliente ciò che potete realmente garantire, convincere i vostri team ad applicare una regola.',
    },
    diagnostic: {
      title: 'Autodiagnosi',
      intro: 'Cinque domande per situare la vostra capacità di crescere.',
      questions: [
        { q: 'Le decisioni correnti passano ancora in maggioranza dal dirigente?', goodIf: 'no' },
        { q: 'Avete una regola scritta sui dati inseriti negli strumenti di IA?' },
        { q: 'Un cliente importante vi ha chiesto garanzie che fate fatica a documentare?', goodIf: 'no' },
        { q: 'Il vostro sistema principale può assorbire il doppio del volume senza rifacimento?' },
        { q: 'Il vostro comitato direttivo conta le funzioni necessarie alla dimensione che mirate?' },
      ],
      levels: [
        { min: 4, label: 'Ritmo tenuto',        desc: 'La vostra organizzazione tiene il ritmo di crescita: uno scambio di 30 minuti può confermare i punti restanti.', nextAction: 'Scambiare 30 minuti' },
        { min: 2, label: 'Da strutturare',      desc: 'La crescita si appoggia ancora su abitudini informali: diversi punti da strutturare.', nextAction: 'Scambiare 30 minuti' },
        { min: 0, label: 'Struttura necessaria', desc: 'La vostra organizzazione ha bisogno di struttura per sostenere la crescita.', nextAction: 'Scambiare 30 minuti' },
      ],
      privacy: 'Nessun dato viene registrato: la diagnosi si calcola nel vostro browser.',
    },
    nextLabel: 'Ciclo successivo',
    next:      [
      { label: 'Ristrutturazione & Pivot',        slug: 'restructuration' },
      { label: 'Acquisizione & Crescita esterna', slug: 'acquisition' },
    ],
  },

  /* ------------------------------------------------------------------ */
  {
    slug: 'restructuration',
    path: '/franchir/restructuration',
    meta: {
      title:       'Ristrutturazione & Pivot — cambiare rotta senza perdere il controllo | Aegryn',
      description: 'Perdita di un cliente importante, incidente, ingiunzione regolamentare, mercato che svolta: le prime decisioni sono le più pesanti.',
    },
    eyebrow:  'Affrontare · Ristrutturazione & Pivot',
    h1:       'Cambiare rotta senza perdere il controllo.',
    subtitle: 'Perdita di un cliente importante, incidente, ingiunzione regolamentare, mercato che svolta: le prime decisioni sono le più pesanti.',
    verbs:    ['Arbitrare', 'Stabilizzare', 'Ruotare'],
    constat: {
      text:   'La Banque de France conta 70 605 dissesti d’impresa nei dodici mesi a fine luglio 2026. In Svizzera, gli operatori di infrastrutture critiche devono segnalare un attacco informatico all’NCSC entro 24 ore dal 1° aprile 2025, pena una sanzione fino a 100 000 CHF dal 1° ottobre 2025.',
      source: 'Banque de France; NCSC.',
    },
    situations: {
      title: 'Dove vi trovate. Come interveniamo.',
      items: [
        { quote: 'Un cliente rappresenta una quota importante del mio fatturato e se ne va.', decision: 'Quali priorità su 90 giorni, quale tesoreria proteggere?', metiers: ['strategie'], deliverable: 'Piano 30/60/90 giorni presentabile al consiglio e alla banca' },
        { quote: 'Abbiamo subito un incidente. Cosa dobbiamo dichiarare?', decision: 'Chi notificare, entro quale termine, con quali prove?', metiers: ['conformite'], deliverable: 'Nota di posizione e sequenza di notifica' },
        { quote: 'Il mio mercato svolta con l’IA.', decision: 'Quale pivot, con quali attivi esistenti?', metiers: ['strategie', 'technologie'], deliverable: 'Opzioni di pivot confrontate sulla griglia dei quattro test' },
        { quote: 'Bisogna cedere un’attività per resistere.', decision: 'Quale perimetro isolare, quali sistemi condivisi?', metiers: ['ma'], deliverable: 'Perimetro di isolamento, elenco delle dipendenze' },
        { quote: 'Devo ridurre i costi senza rompere l’esecuzione.', decision: 'Quali costi, quali tempi, quali rischi sociali?', metiers: ['talent'], deliverable: 'Piano di riorganizzazione e rischi di partenza di profili chiave' },
        { quote: 'Mi serve un dirigente ad interim.', decision: 'Profilo, mandato, durata', metiers: ['recruter'], deliverable: 'Scheda di missione e profili preselezionati' },
      ],
    },
    metiers: { mobilized: ['strategie', 'conformite', 'recruter'], available: ['technologie', 'talent', 'ma', 'construire'] },
    bySize: {
      title: 'Secondo la dimensione',
      items: [
        { label: 'PMI', desc: 'Decisioni concentrate su una persona, quadro di 30 giorni.' },
        { label: 'ETI', desc: 'Coordinamento di consiglio d’amministrazione, finanziatori e filiali.' },
      ],
    },
    bySector: {
      title: 'Secondo il settore',
      items: [
        { cluster: 'Finance & Capital',                             desc: 'Requisiti delle autorità di vigilanza.' },
        { cluster: 'Salute & Scienze della vita',                   desc: 'Continuità delle cure e delle autorizzazioni.' },
        { cluster: 'Industria, Energia & Infrastrutture',           desc: 'Continuità di produzione e obblighi di segnalazione.' },
        { cluster: 'Commercio, Servizi & Esperienza cliente',       desc: 'Tesoreria e stagionalità.' },
        { cluster: 'Tech, Innovazione & Settore pubblico',          desc: 'Impegni contrattuali di livello di servizio.' },
      ],
    },
    scenario: {
      tag:  'Scenario illustrativo',
      text: 'Una società di servizi B2B da 40 M€ perde un cliente che rappresenta un terzo del fatturato. In dieci giorni: mappatura dei costi evitabili, ricentramento dell’offerta, punto con la banca. Il piano 30/60/90 giorni è presentato al consiglio.',
    },
    ai: {
      title: 'Cosa uno strumento di IA generalista non farà al vostro posto',
      text:  'Scegliere cosa sacrificare, parlare con la vostra banca e i vostri team, rispondere della decisione in una situazione d’urgenza.',
    },
    diagnostic: {
      title: 'Autodiagnosi',
      intro: 'Cinque domande per situare la vostra esposizione.',
      questions: [
        { q: 'Un cliente o un fornitore rappresenta una quota critica della vostra attività?', goodIf: 'no' },
        { q: 'Un evento (incidente, ingiunzione, perdita di cliente) impone una decisione entro 30 giorni?', goodIf: 'no' },
        { q: 'La vostra tesoreria è proiettata a 90 giorni?' },
        { q: 'Sapete quali obblighi di dichiarazione si applicano alla vostra organizzazione?' },
        { q: 'Disponete di un piano scritto in caso di partenza di una persona chiave?' },
      ],
      levels: [
        { min: 4, label: 'Preparati',        desc: 'La vostra organizzazione è preparata alle svolte.', nextAction: 'Scambiare 30 minuti' },
        { min: 2, label: 'Fragilità',        desc: 'Punti di fragilità da trattare prima che diventino urgenti.', nextAction: 'Scambiare 30 minuti' },
        { min: 0, label: 'Da stabilizzare',  desc: 'Diversi segnali chiedono una decisione rapida: priorità alla stabilizzazione.', nextAction: 'Scambiare 30 minuti' },
      ],
      privacy: 'Nessun dato viene registrato: la diagnosi si calcola nel vostro browser.',
    },
    nextLabel: 'Ciclo successivo',
    next:      [
      { label: 'Acquisizione & Crescita esterna', slug: 'acquisition' },
      { label: 'Trasmissione & Cessione',         slug: 'transmission' },
    ],
    urgency: true,
  },

  /* ------------------------------------------------------------------ */
  {
    slug: 'acquisition',
    path: '/franchir/acquisition',
    meta: {
      title:       'Acquisizione & Crescita esterna — comprare sapendo cosa rilevate | Aegryn',
      description: 'Un’acquisizione si gioca tanto sull’integrazione quanto sul prezzo: quattro punti ciechi, un piano d’integrazione, impegni di retention.',
    },
    eyebrow:  'Affrontare · Acquisizione & Crescita esterna',
    h1:       'Comprare sapendo cosa rilevate.',
    subtitle: 'Un’acquisizione si gioca tanto sull’integrazione quanto sul prezzo.',
    verbs:    ['Valutare', 'Integrare', 'Trattenere'],
    constat: {
      text:   'Gli studi raccolti nella Wiley Encyclopedia of Management collocano il fallimento delle operazioni di fusione-acquisizione tra il 48 % e il 66 %, con cause ricorrenti nella sinergia sovrastimata, nell’assenza di un piano d’integrazione e in un ritmo troppo lento. In Svizzera le operazioni di PMI hanno raggiunto 208 operazioni nel 2025 (+16 %), di cui +28 % nei servizi informatici e nel software.',
      source: 'Wiley Encyclopedia of Management; SECO.',
    },
    situations: {
      title: 'Dove vi trovate. Come interveniamo.',
      items: [
        { quote: 'Abbiamo trovato un target. Cosa guardare oltre i conti?', decision: 'Quali punti verificare prima di impegnarsi?', metiers: ['ma'], deliverable: 'Revisione dei quattro punti ciechi, con le condizioni da negoziare' },
        { quote: 'Codice e sistemi del target sono sani?', decision: 'Dipendenze, licenze, reversibilità', metiers: ['technologie'], deliverable: 'Rapporto tecnico e costo stimato di aggiornamento' },
        { quote: 'Tratterremo i suoi team chiave?', decision: 'Chi trattenere, con quali impegni?', metiers: ['talent'], deliverable: 'Indice di dipendenza del target, piano di retention' },
        { quote: 'Come integrare senza bloccare l’attività?', decision: 'Sequenza dei primi 100 giorni', metiers: ['ma', 'technologie'], deliverable: 'Piano d’integrazione a tappe' },
        { quote: 'Questa acquisizione è coerente con la nostra strategia?', decision: 'Tesi, priorità, rinunce', metiers: ['strategie'], deliverable: 'Griglia dei quattro test applicata al target' },
        { quote: 'Il target è conforme alle regole che ci impegneranno domani?', decision: 'Quali obblighi rileviamo?', metiers: ['conformite'], deliverable: 'Mappa di esposizione del target' },
      ],
    },
    metiers: { mobilized: ['ma', 'technologie', 'strategie'], available: ['conformite', 'talent', 'recruter'] },
    bySize: {
      title: 'Secondo la dimensione',
      items: [
        { label: 'PMI', desc: 'Un’acquisizione può pesare un quarto dell’attività; l’integrazione poggia su poche persone.' },
        { label: 'ETI', desc: 'Programma di acquisizioni successive, integrazione da sistematizzare.' },
      ],
    },
    bySector: {
      title: 'Secondo il settore',
      items: [
        { cluster: 'Finance & Capital',                             desc: 'Riconoscimenti e autorizzazioni da trasferire.' },
        { cluster: 'Salute & Scienze della vita',                   desc: 'Conformità dei prodotti rilevati.' },
        { cluster: 'Industria, Energia & Infrastrutture',           desc: 'Siti, catene di approvvigionamento, attivi pesanti.' },
        { cluster: 'Commercio, Servizi & Esperienza cliente',       desc: 'Basi clienti e contratti.' },
        { cluster: 'Tech, Innovazione & Settore pubblico',          desc: 'Proprietà e manutenibilità del codice.' },
      ],
    },
    scenario: {
      tag:  'Scenario illustrativo',
      text: 'Un gruppo di servizi da 90 M€ considera l’acquisto di un editore da 8 M€. La revisione dei punti ciechi rivela la dipendenza da due sviluppatori e un componente sotto licenza restrittiva. Il prezzo non cambia; condizioni di retention e un piano di sostituzione sono aggiunti all’accordo.',
    },
    ai: {
      title: 'Cosa uno strumento di IA generalista non farà al vostro posto',
      text:  'Valutare l’affidabilità del team di fronte, negoziare gli impegni di retention, decidere di rinunciare.',
    },
    mandate: 'Aegryn non realizza la transazione. L’esecuzione è affidata a banche d’affari, boutique M&A e avvocati abilitati.',
    diagnostic: {
      title: 'Autodiagnosi',
      intro: 'Cinque domande sì/no prima di impegnarvi.',
      questions: [
        { q: 'Avete definito per iscritto la tesi di questa acquisizione?' },
        { q: 'Un piano d’integrazione esiste prima della firma?' },
        { q: 'Conoscete le tre-cinque persone da cui dipende il valore del target?' },
        { q: 'I sistemi del target sono compatibili con i vostri?' },
        { q: 'L’esecuzione della transazione è affidata a consulenti abilitati?' },
      ],
      levels: [
        { min: 4, label: 'Approccio strutturato', desc: 'Il vostro approccio è strutturato: uno scambio di 30 minuti può verificare gli ultimi punti ciechi.', nextAction: 'Scambiare 30 minuti' },
        { min: 2, label: 'Da inquadrare',         desc: 'Diversi punti da inquadrare prima di impegnarvi.', nextAction: 'Scambiare 30 minuti' },
        { min: 0, label: 'Prima della firma',     desc: 'Prima della firma, mettere in sicurezza i fondamentali.', nextAction: 'Scambiare 30 minuti' },
      ],
      privacy: 'Nessun dato viene registrato: la diagnosi si calcola nel vostro browser.',
    },
    nextLabel: 'Ciclo successivo',
    next:      [{ label: 'Trasmissione & Cessione', slug: 'transmission' }],
  },

  /* ------------------------------------------------------------------ */
  {
    slug: 'transmission',
    path: '/franchir/transmission',
    meta: {
      title:       'Trasmissione & Cessione — preparare l’organizzazione a tenere senza di voi | Aegryn',
      description: 'La trasmissione si prepara con anni d’anticipo. Ciò che la condiziona è la capacità dell’organizzazione di funzionare senza il suo dirigente.',
    },
    eyebrow:  'Affrontare · Trasmissione & Cessione',
    h1:       'Preparare l’organizzazione a tenere senza di voi.',
    subtitle: 'La trasmissione si prepara con anni d’anticipo. Ciò che la condiziona è la capacità dell’organizzazione di funzionare senza il suo dirigente.',
    verbs:    ['Documentare', 'Delegare', 'Passare il testimone'],
    constat: {
      text:   'Secondo Bpifrance Le Lab (nov. 2025), il 40 % dei dirigenti di microimprese, PMI ed ETI prevede di trasmettere entro cinque anni — 370 000 imprese — e il 23 % dei cedenti constata una mancanza di acquirenti. Il 47 % dei dirigenti di imprese familiari tra i 60 e i 69 anni non ha un piano di successione formalizzato.',
      source: 'Bpifrance Le Lab.',
    },
    situations: {
      title: 'Dove vi trovate. Come interveniamo.',
      items: [
        { quote: 'Tutto poggia su di me.', decision: 'Chi può rilevare cosa, in quale ordine?', metiers: ['talent'], deliverable: 'Indice di dipendenza, piano di delega su 24 mesi' },
        { quote: 'La mia famiglia o i miei quadri rileveranno?', decision: 'Opzione familiare, interna o terza', metiers: ['strategie', 'ma'], deliverable: 'Confronto delle tre opzioni e calendario' },
        { quote: 'I miei contratti e i miei diritti sono in ordine?', decision: 'Cosa controllerà un acquirente', metiers: ['ma', 'conformite'], deliverable: 'Revisione dei punti ciechi lato venditore, elenco delle correzioni' },
        { quote: 'Il mio sistema poggia su una persona.', decision: 'Documentazione e reversibilità', metiers: ['technologie'], deliverable: 'Test di reversibilità e piano di documentazione' },
        { quote: 'Voglio partire tra 24 mesi.', decision: 'Calendario, tappe, ruolo dopo la partenza', metiers: ['ma'], deliverable: 'Roadmap a ritroso' },
        { quote: 'Il mio comitato direttivo non è pronto a rilevare.', decision: 'Chi reclutare, chi far crescere?', metiers: ['recruter', 'talent'], deliverable: 'Profili e piano di crescita in responsabilità' },
      ],
    },
    metiers: { mobilized: ['talent', 'ma'], available: ['strategie', 'technologie', 'conformite', 'recruter'] },
    bySize: {
      title: 'Secondo la dimensione',
      items: [
        { label: 'PMI', desc: 'Dirigente-fondatore, forte dipendenza, orizzonte di 2-3 anni.' },
        { label: 'ETI', desc: 'Consiglio di famiglia, governance, più azionisti.' },
      ],
    },
    bySector: {
      title: 'Secondo il settore',
      items: [
        { cluster: 'Finance & Capital',                             desc: 'Riconoscimenti legati alle persone.' },
        { cluster: 'Salute & Scienze della vita',                   desc: 'Titolari di licenze e autorizzazioni.' },
        { cluster: 'Industria, Energia & Infrastrutture',           desc: 'Know-how concentrato, attivi pesanti.' },
        { cluster: 'Commercio, Servizi & Esperienza cliente',       desc: 'Relazione con i clienti portata dal dirigente.' },
        { cluster: 'Tech, Innovazione & Settore pubblico',          desc: 'Conoscenza del codice concentrata su poche persone.' },
      ],
    },
    scenario: {
      tag:  'Scenario illustrativo',
      text: 'Un’ETI familiare da 140 M€ il cui dirigente ha 63 anni. L’indice di dipendenza mostra che molte decisioni risalgono a lui solo. Piano su 24 mesi: delega progressiva, comitato direttivo rafforzato, documentazione delle relazioni con i clienti chiave.',
    },
    ai: {
      title: 'Cosa uno strumento di IA generalista non farà al vostro posto',
      text:  'Parlare con la vostra famiglia e i vostri quadri, scegliere un successore, accettare di lasciare alcune decisioni.',
    },
    mandate: 'Aegryn prepara l’organizzazione. La vendita è eseguita con la banca d’affari, la boutique M&A o l’avvocato del cliente.',
    diagnostic: {
      title: 'Autodiagnosi',
      intro: 'Cinque domande sì/no per situare la vostra preparazione.',
      questions: [
        { q: 'Una decisione importante può essere presa senza di voi?' },
        { q: 'La vostra successione è formalizzata per iscritto?' },
        { q: 'Le vostre relazioni con i clienti chiave sono portate da più di una persona?' },
        { q: 'I vostri contratti, diritti e dati sono documentati e aggiornati?' },
        { q: 'Avete una data obiettivo per la vostra partenza?' },
      ],
      levels: [
        { min: 4, label: 'Trasmissione avviata', desc: 'La vostra trasmissione è avviata in buone condizioni.', nextAction: 'Scambiare 30 minuti' },
        { min: 2, label: 'Da documentare',       desc: 'Punti da documentare prima di impegnare il calendario.', nextAction: 'Scambiare 30 minuti' },
        { min: 0, label: 'Da preparare',         desc: 'La preparazione della vostra trasmissione inizia ora.', nextAction: 'Scambiare 30 minuti' },
      ],
      privacy: 'Nessun dato viene registrato: la diagnosi si calcola nel vostro browser.',
    },
    nextLabel: 'Ciclo precedente',
    next:      [{ label: 'Acquisizione & Crescita esterna', slug: 'acquisition' }],
  },
]
