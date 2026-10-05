import type { AdvisoryPageContent, AdvisoryKey } from './types'

/** Contenuti italiani delle cinque pagine ACCOMPAGNER, tradotti da fr.ts (riferimento). */

const PRIVACY =
  'Le sue risposte restano nel suo browser. Nulla viene registrato né trasmesso senza il suo consenso. Il risultato sta in una pagina: il suo livello e il prossimo passo consigliato.'

const S = '/images/advisory/situations/'

export const ADVISORY_IT: Record<AdvisoryKey, AdvisoryPageContent> = {

  strategy: {
    key: 'strategy', path: '/advisory/strategy',
    image: '/images/advisory/strategy-towers.jpg',
    imageAlt: 'Torri di uffici viste dal basso, la rotta e l’altezza dello sguardo',
    meta: {
      title: 'Consulenza strategica per PMI e mid-cap | Aegryn',
      description: 'Rotta, modello economico, crescita esterna, nuovi mercati: Aegryn aiuta i dirigenti di organizzazioni da 10 a 300 M€ a decidere, quantificare e mantenere le proprie scelte strategiche. Svizzera ed Europa.',
      keywords: ['consulenza strategica PMI', 'consulenza strategica mid-cap', 'piano triennale', 'crescita esterna', 'ingresso in un nuovo mercato', 'advisory strategia Svizzera'],
    },
    eyebrow: 'Strategia d’impresa & Innovazione',
    h1: 'Scegliere la rotta giusta, nell’ordine giusto, con i mezzi che avete davvero.',
    subtitle: 'Per chi dirige un’organizzazione da 10 a 300 M€, la strategia non è un esercizio di pianificazione: sono arbitraggi sotto vincolo di capitale, di tempo direzionale e di capacità di esecuzione. Aegryn vi aiuta a porli, quantificarli e mantenerli.',
    scope: [
      { label: 'Squadra di direzione: Talento & Organizzazione', href: '/advisory/talent-organization' },
      { label: 'Esecuzione di un’acquisizione: M&A', href: '/advisory/ma' },
      { label: 'Scelte di architettura: Tecnologia', href: '/advisory/technology' },
    ],
    observation: {
      title: 'Che cosa osserviamo',
      cards: [
        { value: '≈ 9 000', label: 'missioni di consulenza Bpifrance nel 2024, +50 % in un anno', source: 'Bpifrance Presse, 2025' },
        { value: '−2 %', label: 'mercato francese della consulenza nel 2025, al netto dell’inflazione', source: 'Syntec Conseil' },
        { value: '−7,3', label: 'punti indice, barometro delle PMI NZZ 2026, livello più basso dall’avvio dell’indagine nel 2021', source: 'NZZ-KMU-Barometer 2026, Kalaidos Fachhochschule' },
      ],
      paragraphs: [
        'I dirigenti di PMI e mid-cap comprano consulenza, ma in modo diverso. Bpifrance ha realizzato quasi 9 000 missioni di consulenza nel 2024, in aumento del 50 % in un anno, mentre il mercato francese della consulenza arretra del 2 % nel 2025 al netto dell’inflazione. In Svizzera, l’indice composito del barometro delle PMI NZZ 2026 (NZZ e Kalaidos Fachhochschule) scende a −7,3 punti, il livello più basso dall’avvio dell’indagine nel 2021; solo l’integrazione delle tecnologie progredisce.',
      ],
      change: 'Quando il contesto si irrigidisce, il costo di un arbitraggio sbagliato aumenta. Il bisogno non è più un grande programma, è una decisione precisa, presa in fretta, con uno sguardo senior.',
      sources: 'Fonti: Bpifrance Presse (2025) · Syntec Conseil · NZZ-KMU-Barometer 2026, Kalaidos Fachhochschule (ripreso dalla SECO).',
    },
    outcomes: {
      title: 'Che cosa ottenete',
      items: [
        'Una decisione che il vostro comitato può difendere davanti a una banca o a un azionista.',
        'Una rotta che il vostro comitato può applicare in vostra assenza, senza chiamarvi.',
        'Una prima azione datata entro trenta giorni.',
      ],
    },
    situations: {
      title: 'A che punto siete. Come interveniamo.',
      items: [
        { quote: 'Il nostro modello si erode.', decision: 'Pivotare, difendere o cambiare segmento.', deliverable: 'Revisione di posizione: economia unitaria per segmento, concorrenza, tre opzioni quantificate.', format: 'Missione breve', cycles: ['croissance', 'restructuration'], image: `${S}dashboard-laptop.jpg` },
        { quote: 'L’IA cambia il nostro mestiere.', decision: 'Dove integrarla, che cosa non automatizzare.', deliverable: 'Mappa degli usi dell’IA per fase della catena del valore, classificati per valore creato e rischio assunto.', format: 'Qualche settimana', cycles: ['croissance'], image: `${S}developer-desk.jpg` },
        { quote: 'Un concorrente è in vendita, o un partner potrebbe acquisirci.', decision: 'Crescita organica, alleanza o acquisizione.', deliverable: 'Tesi di crescita esterna, criteri di target, quadro go / no-go.', format: 'Qualche settimana', cycles: ['acquisition'], image: `${S}handshake.jpg` },
        { quote: 'Apriamo un nuovo mercato (DACH, Benelux, Europa del Sud).', decision: 'Filiale, distributore, partner, o attendere.', deliverable: 'Piano d’ingresso per paese, con requisiti regolamentari locali e fabbisogno di talenti.', format: 'Qualche settimana', cycles: ['croissance'], image: `${S}meeting-room.jpg` },
        { quote: 'Il mio consiglio, la mia banca o il mio azionista chiede un piano a tre anni.', decision: 'Quali ipotesi assumere, quali testare.', deliverable: 'Piano difendibile, sensibilità esplicite, memo di dieci pagine per il comitato.', format: 'Da uno a due mesi', cycles: ['lancement', 'croissance'], image: `${S}planning-laptops.jpg` },
        { quote: 'La strategia è nella mia testa.', decision: 'Che cosa deve esistere senza di voi.', deliverable: 'Strategia documentata in cinque priorità, con responsabili e tappe.', format: 'Qualche settimana', cycles: ['croissance', 'transmission'], image: `${S}plan-writing.jpg` },
      ],
    },
    services: {
      title: 'I nostri servizi',
      items: [
        'Rivedere la posizione strategica',
        'Arbitrare tra opzioni',
        'Costruire il piano a tre anni',
        'Preparare il comitato (memo per consiglio, banca, azionisti)',
        'Inquadrare l’ingresso in un nuovo mercato',
        'Accompagnare il board (advisory trimestrale)',
      ],
    },
    framework: {
      name: 'La Griglia dei quattro test',
      intro: 'Ogni opzione strategica supera quattro test prima di essere trattenuta.',
      axes: [
        { label: 'Valore', desc: 'Che cosa cambia al valore dell’organizzazione tra tre anni?' },
        { label: 'Reversibilità', desc: 'Se fallisce, qual è il costo di uscita a dodici mesi?' },
        { label: 'Capacità', desc: 'Abbiamo le persone, la tecnologia e il capitale per eseguirla, senza mobilitare il dirigente a tempo pieno?' },
        { label: 'Sequenza', desc: 'Che cosa deve essere vero prima, e che cosa può attendere?' },
      ],
      deliverable: 'Una scheda decisionale di una pagina che valuta le opzioni e nomina la prima decisione da prendere entro trenta giorni.',
    },
    bySize: {
      title: 'Secondo la vostra dimensione',
      items: [
        { label: 'PMI · da 10 a 50 M€', desc: 'Il dirigente decide con due o tre persone, senza direzione strategia. Il vincolo è il suo tempo. Consegniamo in breve, senza struttura di progetto, in un formato che sta in dieci pagine.' },
        { label: 'Mid-cap · da 50 a 300 M€', desc: 'Più attività, un comitato esecutivo, a volte un azionista familiare o un fondo. Il vincolo è l’allineamento. Animiamo l’arbitraggio e documentiamo la decisione per il board.' },
      ],
    },
    bySector: {
      title: 'Secondo il vostro settore',
      items: [
        { cluster: 'Finance & Capital', desc: 'Disintermediazione da parte dei nuovi attori; partnership tecnologiche da arbitrare sotto i vincoli DORA e FINMA sui terzi critici.' },
        { cluster: 'Salute & Scienze della vita', desc: 'Passaggio dal pubblico al privato, ingresso in un paese soggetto a un quadro MDR, HDS o EHDS diverso.' },
        { cluster: 'Industria, Energia & Infrastrutture', desc: 'Servizi attorno al prodotto (manutenzione predittiva, as-a-service); catturare il valore del dato o delegarlo a un integratore.' },
        { cluster: 'Commercio, Servizi & Esperienza cliente', desc: 'Omnicanale, pricing, posto del proprio marchio di fronte alle piattaforme terze.' },
        { cluster: 'Tech, Innovazione & Settore pubblico', desc: 'Modello product-led o commerciale, definizione del cliente target, ingresso DACH, accesso agli appalti pubblici.' },
      ],
    },
    scenario: {
      tag: 'Scenario tipo · illustrativo, non tratto da una missione nominata',
      text: 'Mid-cap industriale da 120 M€, Svizzera romanda e Francia. Il dirigente esita tra acquisire un editore di manutenzione predittiva e svilupparlo internamente. In tre settimane, il suo comitato dispone di una scheda decisionale: tre opzioni, costo totale su tre anni, rischi di esecuzione, condizioni di reversibilità, prima decisione da prendere entro trenta giorni.',
    },
    ai: {
      title: 'Che cosa uno strumento di IA non farà al posto vostro',
      text: 'Un assistente struttura le vostre opzioni. Non conosce né il vostro azionariato, né la vostra squadra, né ciò che la vostra banca accetterà. Non risponde della decisione. Aegryn mette alla prova le vostre ipotesi, assume un parere e torna a misurare lo scarto qualche mese dopo.',
    },
    diagnostic: {
      title: 'A che punto siete? Cinque domande.',
      intro: 'Rispondete sì o no. Il risultato vi colloca su tre livelli e nomina il prossimo passo.',
      questions: [
        { q: 'Potete scrivere la vostra strategia in una pagina, e le vostre cinque priorità sono note al comitato di direzione?' },
        { q: 'Ogni priorità ha un responsabile, una tappa e un indicatore?' },
        { q: 'Avete quantificato almeno due alternative alla vostra rotta attuale?' },
        { q: 'Sapete quali decisioni sono reversibili a dodici mesi e quali no?' },
        { q: 'Uno sguardo esterno ha contestato le vostre ipotesi chiave negli ultimi dodici mesi?' },
      ],
      levels: [
        { min: 0, label: 'Da inquadrare', desc: 'La strategia esiste, ma soprattutto nella testa del dirigente. Le opzioni non sono state quantificate né messe alla prova.', nextAction: 'Mettere la vostra decisione principale su una scheda: opzioni, costo di uscita, prima azione a trenta giorni.' },
        { min: 3, label: 'In costruzione', desc: 'Le priorità sono note e seguite. Manca la messa alla prova: alternative quantificate, reversibilità, sguardo esterno.', nextAction: 'Far passare la vostra rotta attuale attraverso la Griglia dei quattro test, con un contraddittore senior.' },
        { min: 5, label: 'Padroneggiato', desc: 'Strategia scritta, pilotata, testata. Il tema diventa il ritmo: revisione trimestrale e preparazione del comitato.', nextAction: 'Istituire un advisory trimestrale per tenere la traiettoria e preparare i prossimi arbitraggi.' },
      ],
      privacy: PRIVACY,
    },
    perspectives: {
      title: 'Prospettive',
      items: [
        { title: 'Stato del mercato M&A tech in Europa, metà 2026', href: '/blog/marche-ma-tech-europe-q3-2026', kind: 'article' },
        { title: 'Aegryn Magazine, Issue 01 · Built to Last', href: '/magazine/issue-01', kind: 'magazine' },
      ],
    },
    cta: { metier: 'strategie' },
  },

  riskCompliance: {
    key: 'riskCompliance', path: '/advisory/risk-compliance',
    image: '/images/advisory/risk-compliance.jpg',
    imageAlt: 'Revisione di documenti contrattuali e regolamentari',
    meta: {
      title: 'Conformità regolamentare per PMI e mid-cap: NIS2, DORA, AI Act, LPD | Aegryn',
      description: 'Quali obblighi si applicano a voi, quali vi imporranno i vostri clienti, quali possono attendere. Mappatura, prove opponibili, gestione degli incidenti. Francia, Svizzera, UE.',
      keywords: ['NIS2 PMI', 'conformità DORA', 'obblighi AI Act', 'LPD GDPR Svizzera', 'mappatura regolamentare', 'gestione incidenti cyber', 'segnalazione UFCS 24 h'],
    },
    eyebrow: 'Rischi & Conformità',
    h1: 'Sapere che cosa vi vincola oggi, che cosa i vostri clienti vi imporranno domani, e che cosa può attendere.',
    subtitle: 'NIS2 non ancora recepita in Francia, un regime svizzero distinto, un AI Act con scadenze ridisegnate, clienti che esigono già prove. La conformità non è più una questione da giuristi: è un arbitraggio di direzione.',
    scope: [
      { label: 'Architettura e hosting: Tecnologia', href: '/advisory/technology' },
      { label: 'Conformità di un target: M&A', href: '/advisory/ma' },
    ],
    observation: {
      title: 'Che cosa osserviamo',
      cards: [
        { value: '≈ 15 000', label: 'entità attese nel perimetro NIS2 in Francia, contro qualche centinaio oggi', source: 'Commissione europea; stima' },
        { value: '24 h', label: 'termine per segnalare un attacco informatico all’UFCS per le infrastrutture critiche svizzere, dal 1° aprile 2025', source: 'UFCS, ncsc.admin.ch' },
        { value: '35 M€ · 7 %', label: 'tetto delle sanzioni AI Act per le pratiche vietate; 15 M€ o 3 % per la maggior parte degli altri obblighi', source: 'Regolamento (UE) 2024/1689, art. 99' },
      ],
      paragraphs: [
        'Francia. NIS2 deve far passare il numero di entità regolamentate da qualche centinaio a circa 15 000, in 18 settori, a partire da 50 dipendenti o 10 M€. La legge di recepimento non è votata; la Commissione ha adito la Corte di giustizia l’8 luglio 2026. Attendere la legge è una scommessa, non un piano.',
        'Svizzera. NIS2 non si applica direttamente. Dal 1° aprile 2025, gli esercenti di infrastrutture critiche segnalano ogni attacco informatico all’UFCS entro 24 ore, con una multa fino a 100 000 CHF dal 1° ottobre 2025. Sei mesi dopo l’entrata in vigore erano state registrate 164 segnalazioni. Fuori dalle infrastrutture critiche nessun obbligo legale, ma i vostri clienti dell’UE potranno imporvelo per contratto.',
        'IA. L’articolo 50 dell’AI Act è applicabile dal 2 agosto 2026. Gli obblighi «ad alto rischio» dell’Allegato III sono rinviati al 2 dicembre 2027 dal Regolamento (UE) 2026/1744. Le sanzioni raggiungono 35 M€ o il 7 % del fatturato mondiale per le pratiche vietate, 15 M€ o il 3 % per la maggior parte degli altri obblighi.',
      ],
      change: 'Tre calendari, tre giurisdizioni. La domanda giusta non è «siamo conformi?» ma «a che cosa siamo tenuti, verso chi, entro quando?».',
      sources: 'Fonti: Direttiva (UE) 2022/2555 · Commissione europea · UFCS, comunicato del 29.09.2025 · Regolamenti (UE) 2024/1689 e 2026/1744.',
    },
    outcomes: {
      title: 'Che cosa ottenete',
      items: [
        'Una visione chiara di ciò che si applica, di ciò che è richiesto per contratto e di ciò che può attendere.',
        'Prove che consegnate a un cliente senza ricostruirle.',
        'Un responsabile nominato per ogni obbligo.',
      ],
    },
    situations: {
      title: 'A che punto siete. Come interveniamo.',
      items: [
        { quote: 'Un grande cliente ci invia un questionario di sicurezza di quaranta pagine.', decision: 'Quale livello di prova fornire, su quale riferimento.', deliverable: 'Dossier di prove e piano di colmatura degli scarti, riutilizzabile per i clienti successivi.', format: 'Qualche settimana', cycles: ['croissance'], image: `${S}laptop-hands.jpg` },
        { quote: 'Non sappiamo se siamo nel perimetro.', decision: 'Che cosa si applica a noi, che cosa ci sarà imposto, che cosa può attendere.', deliverable: 'Mappa di esposizione a tre vie.', format: 'Missione breve', cycles: ['lancement', 'croissance'], image: `${S}discussion-hands.jpg` },
        { quote: 'Le nostre squadre usano l’IA senza regole.', decision: 'Quali strumenti, con quali dati, sotto quale responsabilità.', deliverable: 'Politica d’uso, inventario dei sistemi, classificazione ai sensi dell’AI Act.', format: 'Missione breve', cycles: ['croissance'], image: `${S}laptop-phone.jpg` },
        { quote: 'Abbiamo subito un incidente.', decision: 'Chi informare (autorità, clienti, assicuratore), entro quali termini.', deliverable: 'Dossier d’incidente documentato e piano di miglioramento, con gli esperti di risposta agli incidenti della rete.', format: 'Su richiesta', cycles: ['restructuration'], image: `${S}network-cables.jpg` },
        { quote: 'Un investitore o un acquirente ci farà un audit.', decision: 'Che cosa regolarizzare prima, che cosa assumere.', deliverable: 'Dossier di conformità pronto per la data room.', format: 'Qualche settimana', cycles: ['acquisition', 'transmission'], image: `${S}planning-laptops.jpg` },
        { quote: 'Vendiamo nell’UE dalla Svizzera (o viceversa).', decision: 'Rappresentante, DPO, trasferimenti di dati.', deliverable: 'Matrice delle giurisdizioni (LPD / GDPR) e obblighi associati.', format: 'Missione breve', cycles: ['croissance'], image: `${S}office-corridor.jpg` },
      ],
    },
    services: {
      title: 'I nostri servizi',
      items: [
        'Mappare la vostra esposizione regolamentare',
        'Costituire il dossier di prove opponibile ai vostri clienti',
        'Inquadrare l’uso dell’IA',
        'Documentare la gestione degli incidenti',
        'Pilotare la rimediazione',
        'Formare il comitato di direzione alle sue responsabilità',
      ],
    },
    framework: {
      name: 'La Mappa di esposizione a tre vie',
      intro: 'Ogni testo è classificato su una delle tre vie, con la sua scadenza, il suo responsabile interno e lo scarto constatato.',
      axes: [
        { label: 'Obbligatorio', desc: 'Ciò che la legge vi impone oggi, secondo il vostro ruolo: entità essenziale o importante, deployer o fornitore di IA, titolare del trattamento.' },
        { label: 'Contrattuale', desc: 'Ciò che i vostri clienti, assicuratori e investitori esigono, anche senza legge.' },
        { label: 'Da sorvegliare', desc: 'Scadenza nota, non applicabile a oggi.' },
      ],
      deliverable: 'Una pagina di sintesi, allegati dettagliati per testo.',
    },
    bySize: {
      title: 'Secondo la vostra dimensione',
      items: [
        { label: 'PMI · da 10 a 50 M€', desc: 'Raramente un CISO o un DPO a tempo pieno. Puntiamo a una base di controlli opponibili, non a un sistema di gestione completo, e mobilitiamo funzioni esternalizzate della rete.' },
        { label: 'Mid-cap · da 50 a 300 M€', desc: 'Una direzione dei rischi esiste, più riferimenti si sovrappongono. Li consolidiamo in un solo piano e prepariamo l’audit interno.' },
      ],
    },
    bySector: {
      title: 'Secondo il vostro settore',
      items: [
        { cluster: 'Finance & Capital', desc: 'DORA, applicabile dal 17 gennaio 2025: terzi ICT critici, test di resilienza, registro dei fornitori. In Svizzera, requisiti FINMA sui rischi operativi e la resilienza (circolare 2023/1).' },
        { cluster: 'Salute & Scienze della vita', desc: 'HDS in Francia, MDR/IVDR, EHDS. IA integrata in un dispositivo medico: alto rischio dell’Allegato I, scadenza 2 agosto 2028.' },
        { cluster: 'Industria, Energia & Infrastrutture', desc: 'NIS2 (energia, acqua, trasporti, manifattura); in Svizzera, segnalazione UFCS entro 24 h; segmentazione IT/OT.' },
        { cluster: 'Commercio, Servizi & Esperienza cliente', desc: 'GDPR e LPD (fidelizzazione, profilazione); articolo 50 (agenti conversazionali, contenuti generati); strumenti di selezione delle candidature: alto rischio, Allegato III, 2 dicembre 2027.' },
        { cluster: 'Tech, Innovazione & Settore pubblico', desc: 'I vostri clienti NIS2 e DORA vi chiedono prove; Cyber Resilience Act (obblighi di notifica da settembre 2026, requisiti di prodotto a dicembre 2027); editori di software usati in infrastrutture critiche: verificare se la LSI svizzera vi riguarda.' },
      ],
    },
    scenario: {
      tag: 'Scenario tipo · illustrativo',
      text: 'Editore di software svizzero con 25 M€ di fatturato, clienti nell’energia in Germania e in Francia. Il suo cliente più grande esige prove di sicurezza della catena di fornitura prima del rinnovo. In tre settimane: perimetro chiarito (obbligatorio per lui, contrattuale per i suoi clienti), otto scarti classificati, prove riutilizzabili per gli altri tre clienti.',
    },
    ai: {
      title: 'Che cosa uno strumento di IA non farà al posto vostro',
      text: 'Un assistente riassume NIS2. Non porterà il vostro dossier davanti al vostro cliente, non sceglierà gli scarti che accettate, non risponderà della qualità della prova. Aegryn impegna un esperto nominato, responsabile del proprio perimetro.',
      legal: 'Il nostro accompagnamento non sostituisce un parere legale; lavoriamo con studi partner.',
    },
    diagnostic: {
      title: 'A che punto siete? Cinque domande.',
      intro: 'Rispondete sì o no. Il risultato vi colloca su tre livelli e nomina il prossimo passo.',
      questions: [
        { q: 'Avete l’elenco dei testi che si applicano a voi (UE e Svizzera) e le loro scadenze?' },
        { q: 'Sapete che cosa i vostri tre maggiori clienti vi impongono per contratto in materia di sicurezza e dati?' },
        { q: 'Esiste una procedura d’incidente scritta, con termini di notifica e contatti?' },
        { q: 'Avete una regola scritta sui dati inseriti negli strumenti di IA?' },
        { q: 'Un membro della direzione risponde nominativamente della conformità?' },
      ],
      levels: [
        { min: 0, label: 'Da inquadrare', desc: 'Il perimetro non è stabilito. L’esposizione si scopre nel momento in cui un cliente, un auditor o un incidente la rivela.', nextAction: 'Stabilire la Mappa di esposizione a tre vie: obbligatorio, contrattuale, da sorvegliare.' },
        { min: 3, label: 'In costruzione', desc: 'I testi e le esigenze dei clienti sono identificati. Manca la prova: dossier riutilizzabile, procedura d’incidente, responsabile nominato.', nextAction: 'Costituire il dossier di prove opponibile e designare un responsabile per obbligo.' },
        { min: 5, label: 'Padroneggiato', desc: 'Perimetro, prove, responsabili: la base esiste. Il tema diventa il mantenimento e le scadenze a venire (AI Act 2027, CRA).', nextAction: 'Pianificare una revisione annuale del perimetro e formare il comitato di direzione alle sue responsabilità.' },
      ],
      privacy: PRIVACY,
    },
    perspectives: { title: 'Prospettive', items: [] },
    cta: { metier: 'conformite' },
  },

  technology: {
    key: 'technology', path: '/advisory/technology',
    image: '/images/advisory/technology.jpg',
    imageAlt: 'Armadi server in un centro dati',
    meta: {
      title: 'Consulenza tecnologica: architettura, debito, IA, hosting | Aegryn',
      description: 'Audit di architettura, arbitraggio costruire-comprare-allearsi, governance dell’IA, direzione tecnica a tempo condiviso. Per PMI e mid-cap da 10 a 300 M€. Svizzera ed Europa.',
      keywords: ['audit di architettura', 'debito tecnico', 'direzione tecnica a tempo condiviso', 'CTO interim', 'governance IA PMI', 'hosting sovrano Svizzera', 'reversibilità'],
    },
    eyebrow: 'Tecnologia & Sovranità',
    h1: 'La vostra tecnologia è un attivo o una dipendenza. Misurate quale, prima che un cliente, un investitore o un guasto lo facciano per voi.',
    subtitle: 'Architettura, debito tecnico, IA, hosting: le scelte dei primi tre anni pesano sui dieci successivi. Aegryn interviene nei momenti in cui si decidono.',
    scope: [
      { label: 'Obblighi legali: Rischi & Conformità', href: '/advisory/risk-compliance' },
      { label: 'Audit di un target: M&A', href: '/advisory/ma' },
      { label: 'Sviluppo su misura: Build', href: '/services/build' },
    ],
    observation: {
      title: 'Che cosa osserviamo',
      cards: [
        { value: '22 % → 34 %', label: 'PMI svizzere che usano l’IA, dal 2024 al 2025', source: 'SECO, kmu.admin.ch' },
        { value: '34 %', label: 'dispongono di regole sui dati inseriti negli strumenti IA; 23 % tra le aziende con meno di 10 dipendenti', source: 'SECO, kmu.admin.ch' },
        { value: '2 ago 2026', label: 'obblighi di trasparenza dell’AI Act (articolo 50) applicabili', source: 'Regolamento (UE) 2024/1689' },
      ],
      paragraphs: [
        'L’adozione precede la governance. In Svizzera, l’uso dell’IA da parte delle PMI è passato dal 22 % al 34 % tra il 2024 e il 2025; il 60 % vi vede un’opportunità. Ma solo il 34 % dispone di regole chiare sui dati che possono essere inseriti in questi strumenti, e il 23 % tra le aziende con meno di dieci dipendenti. Sul versante europeo, gli obblighi di trasparenza dell’AI Act si applicano dal 2 agosto 2026.',
      ],
      change: 'Il rischio non viene dallo strumento, ma dall’assenza di una regola attorno a esso.',
      sources: 'Fonti: SECO, «AI gains ground among Swiss SMEs» · Regolamento (UE) 2024/1689.',
    },
    outcomes: {
      title: 'Che cosa ottenete',
      items: [
        'Dipendenze nominate, con un piano per ogni componente non reversibile.',
        'Un debito tecnico quantificato piuttosto che percepito.',
        'Regole d’uso dell’IA che le vostre squadre applicano.',
      ],
    },
    situations: {
      title: 'A che punto siete. Come interveniamo.',
      items: [
        { quote: 'La nostra piattaforma rallenta i nostri rilasci.', decision: 'Rifattorizzare, rifare o sostituire.', deliverable: 'Audit di architettura, debito tecnico quantificato per dominio, traiettoria a dodici mesi.', format: 'Qualche settimana', cycles: ['croissance'], image: `${S}server-room-walk.jpg` },
        { quote: 'Una sola persona capisce il sistema.', decision: 'Documentare, raddoppiare o internalizzare.', deliverable: 'Registro delle dipendenze (persone, fornitori, licenze) e piano di riduzione.', format: 'Missione breve', cycles: ['croissance', 'transmission'], image: `${S}developer-desk.jpg` },
        { quote: 'Costruire, comprare o allearsi?', decision: 'L’arbitraggio giusto, con il costo di uscita.', deliverable: 'Analisi a criteri ponderati, reversibilità compresa.', format: 'Missione breve', cycles: ['lancement', 'croissance'], image: `${S}loft-office.jpg` },
        { quote: 'Le nostre squadre usano l’IA senza quadro.', decision: 'Strumenti autorizzati, dati ammessi, hosting.', deliverable: 'Politica d’uso, inventario, arbitraggio degli strumenti.', format: 'Missione breve', cycles: ['croissance'], image: `${S}laptop-phone.jpg` },
        { quote: 'Non abbiamo più un direttore tecnico.', decision: 'Interim, assunzione, o direzione a tempo condiviso.', deliverable: 'Direzione tecnica ad interim con passaggio di consegne documentato.', format: 'Missione frazionata', cycles: ['restructuration'], image: `${S}open-office.jpg` },
        { quote: 'Dove sono i nostri dati, e chi può accedervi?', decision: 'Hosting UE o Svizzera, clausole di reversibilità, esposizione alle leggi extraterritoriali.', deliverable: 'Revisione dell’hosting e piano di reversibilità.', format: 'Missione breve', cycles: ['lancement', 'croissance'], image: `${S}network-cables.jpg` },
      ],
    },
    services: {
      title: 'I nostri servizi',
      items: [
        'Verificare l’architettura e il debito',
        'Arbitrare tra costruire, comprare, allearsi',
        'Stabilire il registro delle dipendenze critiche',
        'Inquadrare l’uso dell’IA',
        'Assicurare la direzione tecnica ad interim',
        'Preparare l’attivo tecnologico allo sguardo di un terzo (investitore, acquirente)',
      ],
    },
    framework: {
      name: 'Il Test di reversibilità a 90 giorni',
      intro: 'Per ogni componente critico (hoster, editore, fornitore, modello di IA, sviluppatore chiave), una domanda: se scompare domani, in quanti giorni, a quale costo e con quale perdita di dati il servizio riparte?',
      axes: [
        { label: 'Reversibile in una settimana', desc: 'Alternativa identificata, dati esportabili, passaggio documentato.' },
        { label: 'Reversibile in un mese', desc: 'Alternativa nota, migrazione da pianificare, dipendenza funzionale limitata.' },
        { label: 'Reversibile in 90 giorni', desc: 'Sostituzione possibile ma costosa: rifacimento parziale, rinegoziazione, assunzione.' },
        { label: 'Non reversibile', desc: 'Nessuna alternativa credibile a oggi. Il componente condiziona la continuità del servizio.' },
      ],
      deliverable: 'Mappa dei dieci componenti più critici e piano di trattamento dei non reversibili.',
    },
    bySize: {
      title: 'Secondo la vostra dimensione',
      items: [
        { label: 'PMI · da 10 a 50 M€', desc: 'Uno stack costruito per accumulo, qualche sviluppatore, dei fornitori. Priorità: documentazione minima e reversibilità dei tre componenti critici.' },
        { label: 'Mid-cap · da 50 a 300 M€', desc: 'Sistema informativo ereditato, più editori, una direzione IT. Priorità: una traiettoria di modernizzazione arbitrata dal comitato, e una governance dei dati tra attività.' },
      ],
    },
    bySector: {
      title: 'Secondo il vostro settore',
      items: [
        { cluster: 'Finance & Capital', desc: 'Terzi ICT critici ed esternalizzazione cloud (DORA); architettura di resilienza.' },
        { cluster: 'Salute & Scienze della vita', desc: 'Hosting HDS in Francia; separazione dei dati sanitari; IA in un dispositivo medico (Allegato I, 2 agosto 2028).' },
        { cluster: 'Industria, Energia & Infrastrutture', desc: 'IT/OT, telemanutenzione, proprietà dei dati industriali.' },
        { cluster: 'Commercio, Servizi & Esperienza cliente', desc: 'Unificare i dati clienti tra canali senza dipendere da un solo CRM; personalizzazione tramite IA e GDPR.' },
        { cluster: 'Tech, Innovazione & Settore pubblico', desc: 'Audit prima di investimento o cessione; licenze copyleft nel cuore del prodotto; hosting imposto dagli appalti pubblici.' },
      ],
    },
    scenario: {
      tag: 'Scenario tipo · illustrativo',
      text: 'Editore di software per cliniche, 18 M€ di fatturato, 14 sviluppatori di cui 6 esterni. Un fondo si interessa all’azienda. In quattro settimane: dipendenze e debito mappati, tre componenti non reversibili identificati, piano di rimediazione a sei mesi quantificato. Il dirigente lo presenta al fondo prima che questo lo scopra da solo.',
    },
    ai: {
      title: 'Che cosa uno strumento di IA non farà al posto vostro',
      text: 'Un assistente di codice produce codice. Non risponde della scelta di architettura, non sa che cosa autorizza il vostro contratto di hosting, e non terrà il ruolo di direttore tecnico davanti al vostro consiglio.',
    },
    diagnostic: {
      title: 'A che punto siete? Cinque domande.',
      intro: 'Rispondete sì o no. Il risultato vi colloca su tre livelli e nomina il prossimo passo.',
      questions: [
        { q: 'La vostra architettura è documentata e aggiornata (schema, flussi di dati)?' },
        { q: 'Potete nominare i vostri dieci componenti critici e il tempo di sostituzione di ciascuno?' },
        { q: 'Più di una persona capisce ogni componente critico?' },
        { q: 'Le cessioni di diritti e le licenze di tutto il codice consegnato da fornitori sono archiviate?' },
        { q: 'Sapete dove sono ospitati i vostri dati e chi può accedervi?' },
      ],
      levels: [
        { min: 0, label: 'Da inquadrare', desc: 'Il sistema funziona, ma la sua conoscenza poggia su poche persone e la sua documentazione non è aggiornata.', nextAction: 'Stabilire il registro delle dipendenze e far passare i tre componenti più critici attraverso il Test di reversibilità.' },
        { min: 3, label: 'In costruzione', desc: 'Architettura e dati sono noti. Restano angoli ciechi: catena dei diritti, sostituti delle persone chiave, tempi di sostituzione.', nextAction: 'Completare il registro (diritti, licenze, sostituti) e quantificare il debito per dominio.' },
        { min: 5, label: 'Padroneggiato', desc: 'L’attivo tecnologico è documentato, reversibile e leggibile da un terzo. Il tema diventa la traiettoria: modernizzazione, IA, governance dei dati.', nextAction: 'Arbitrare la traiettoria a dodici mesi in comitato e preparare l’attivo allo sguardo di un investitore o di un acquirente.' },
      ],
      privacy: PRIVACY,
    },
    perspectives: {
      title: 'Prospettive',
      items: [
        { title: 'Che cosa rende un attivo tech davvero certificabile', href: '/blog/actif-tech-certifiable', kind: 'article' },
      ],
    },
    cta: { metier: 'technologie' },
  },

  talentOrganization: {
    key: 'talentOrganization', path: '/advisory/talent-organization',
    image: '/images/advisory/talent.jpg',
    imageAlt: 'Sala del consiglio vuota, pronta per la prossima seduta',
    meta: {
      title: 'Successione, governance, squadra di direzione | Aegryn',
      description: 'Misurare la dipendenza dal dirigente, strutturare il comitato di direzione, costruire un piano di successione, trattenere i profili chiave. PMI e mid-cap da 10 a 300 M€. Svizzera ed Europa.',
      keywords: ['piano di successione PMI', 'dipendenza dal fondatore', 'governance comitato di direzione', 'retention profili chiave', 'trasmissione impresa familiare', 'organizzazione mid-cap'],
    },
    eyebrow: 'Talento & Organizzazione',
    h1: 'Il valore di un’organizzazione si misura da ciò che sa fare senza il suo dirigente.',
    subtitle: 'Successione, governance, retention, strutturazione della direzione: le decisioni organizzative pesano di più nel tempo e sono le più spesso rinviate.',
    scope: [
      { label: 'Ricerca e collocamento: Recrutare', href: '/talent' },
      { label: 'Scelta della rotta: Strategia', href: '/advisory/strategy' },
      { label: 'Squadra di un target: M&A', href: '/advisory/ma' },
    ],
    observation: {
      title: 'Che cosa osserviamo',
      cards: [
        { value: '40 %', label: 'dei dirigenti francesi di microimprese, PMI e mid-cap contano di trasmettere entro cinque anni, ossia 370 000 imprese', source: 'Bpifrance Le Lab, 27 nov. 2025' },
        { value: '130 000', label: 'trasmissioni effettive attese al ritmo attuale', source: 'Bpifrance Le Lab, 27 nov. 2025' },
        { value: '47 %', label: 'dei dirigenti di imprese familiari tra 60 e 69 anni non hanno formalizzato un piano di successione', source: 'Bpifrance Le Lab, imprese familiari' },
      ],
      paragraphs: [
        'In Francia, il 40 % dei dirigenti di microimprese, PMI e mid-cap conta di trasmettere la propria impresa entro cinque anni, un potenziale di 370 000 imprese. Al ritmo attuale, 130 000 cambierebbero realmente mano. Tra i dirigenti di PMI e mid-cap familiari tra 60 e 69 anni, il 47 % non ha formalizzato un piano di successione.',
      ],
      change: 'Lo scarto tra l’intenzione e l’atto dipende meno dal mercato che dalla preparazione. Un’organizzazione che dipende da una persona si trasmette male, si finanzia male e si pilota male.',
      sources: 'Fonti: Bpifrance Le Lab, studio Trasmissione e ripresa d’impresa (27 novembre 2025) · Bpifrance Le Lab, imprese familiari.',
    },
    outcomes: {
      title: 'Che cosa ottenete',
      items: [
        'Un’organizzazione che regge tre mesi senza il suo dirigente.',
        'Profili critici con un sostituto.',
        'Un piano di successione scritto, datato e condiviso.',
      ],
    },
    situations: {
      title: 'A che punto siete. Come interveniamo.',
      items: [
        { quote: 'Tutto passa da me.', decision: 'Che cosa delegare per primo, a chi.', deliverable: 'Indice di dipendenza e piano di delega su dodici mesi.', format: 'Qualche settimana', cycles: ['croissance', 'transmission'], image: `${S}meeting-room.jpg` },
        { quote: 'La mia squadra di direzione non è ancora una squadra.', decision: 'Ruoli, ritmi decisionali, deleghe.', deliverable: 'Carta di governance del comitato di direzione.', format: 'Qualche settimana', cycles: ['croissance'], image: `${S}discussion-hands.jpg` },
        { quote: 'Un profilo chiave vuole andarsene.', decision: 'Trattenere, sostituire o raddoppiare.', deliverable: 'Piano di retention, sostituto identificato, trasferimento di conoscenze documentato.', format: 'Missione breve', cycles: ['restructuration'], image: `${S}laptop-hands.jpg` },
        { quote: 'Devo assumere un dirigente (tecnico, finanziario, operativo, paese).', decision: 'Il profilo giusto, nella governance giusta.', deliverable: 'Definizione della posizione e criteri di integrazione, poi passaggio a Recrutare.', format: 'Missione breve', cycles: ['croissance'], image: `${S}handshake.jpg` },
        { quote: 'Penso di trasmettere tra due e cinque anni.', decision: 'Famiglia, interno o acquirente esterno.', deliverable: 'Piano di successione e governance di transizione.', format: 'Da uno a due mesi', cycles: ['transmission'], image: `${S}plan-writing.jpg` },
        { quote: 'Arriva un’acquisizione, due culture stanno per incontrarsi.', decision: 'Chi resta, chi guida, come organizzarsi.', deliverable: 'Valutazione della squadra target, organizzazione target, piano di retention.', format: 'Qualche settimana', cycles: ['acquisition'], image: `${S}office-corridor.jpg` },
      ],
    },
    services: {
      title: 'I nostri servizi',
      items: [
        'Misurare la dipendenza dal dirigente e dai profili chiave',
        'Strutturare il comitato di direzione e le sue deleghe',
        'Costruire il piano di successione',
        'Assicurare la retention dei profili critici',
        'Documentare il know-how critico',
        'Preparare l’assunzione di un dirigente',
      ],
    },
    framework: {
      name: 'L’Indice di dipendenza',
      intro: 'Per ogni persona critica, quattro assi, un punteggio, un tempo di sostituzione in settimane e una soglia di allerta.',
      axes: [
        { label: 'Decisioni', desc: 'Chi decide.' },
        { label: 'Relazioni', desc: 'Chi detiene i clienti e i partner chiave.' },
        { label: 'Saperi', desc: 'Chi è il solo a sapere.' },
        { label: 'Contratti', desc: 'Quali clausole sono legate a un nome.' },
      ],
      deliverable: 'Una mappa delle persone la cui partenza metterebbe l’organizzazione in difficoltà, e che cosa ogni partenza costerebbe in continuità.',
    },
    bySize: {
      title: 'Secondo la vostra dimensione',
      items: [
        { label: 'PMI · da 10 a 50 M€', desc: 'Il dirigente è spesso primo commerciale e primo decisore prodotto. Priorità: delegare le relazioni con i clienti chiave e documentare i dieci processi critici.' },
        { label: 'Mid-cap · da 50 a 300 M€', desc: 'Governance familiare o azionisti. Priorità: piano di successione del direttore generale e dei suoi N-1, comitato di nomina, ruolo della famiglia.' },
      ],
    },
    bySector: {
      title: 'Secondo il vostro settore',
      items: [
        { cluster: 'Finance & Capital', desc: 'Funzioni soggette ad autorizzazione o notifica al regolatore, la cui partenza del titolare innesca adempimenti.' },
        { cluster: 'Salute & Scienze della vita', desc: 'Persona responsabile della conformità regolamentare (PRRC, MDR) e responsabile qualità: funzioni regolamentate a successione preparata.' },
        { cluster: 'Industria, Energia & Infrastrutture', desc: 'Know-how tacito degli anziani, pensionamenti a grappolo, imprese familiari.' },
        { cluster: 'Commercio, Servizi & Esperienza cliente', desc: 'Responsabili di rete, clienti chiave, retention dei manager di prossimità.' },
        { cluster: 'Tech, Innovazione & Settore pubblico', desc: 'Direttore tecnico unico, sviluppatori depositari dell’architettura.' },
      ],
    },
    scenario: {
      tag: 'Scenario tipo · illustrativo',
      text: 'Mid-cap familiare da 140 M€, dirigente di 63 anni, due figli di cui nessuno desidera dirigere. In quattro settimane: Indice di dipendenza (sette persone critiche), tre scenari di successione confrontati, calendario di transizione su ventiquattro mesi che il consiglio di famiglia può decidere.',
    },
    ai: {
      title: 'Che cosa uno strumento di IA non farà al posto vostro',
      text: 'Un assistente redige una scheda di posizione. Non conduce il colloquio difficile con il fondatore, non arbitra tra due N-1, e non sa che cosa la famiglia non dice.',
    },
    diagnostic: {
      title: 'A che punto siete? Cinque domande.',
      intro: 'Rispondete sì o no. Il risultato vi colloca su tre livelli e nomina il prossimo passo.',
      questions: [
        { q: 'La vostra organizzazione funzionerebbe normalmente per tre mesi senza di voi?' },
        { q: 'I vostri cinque clienti o partner chiave hanno almeno due interlocutori da voi?' },
        { q: 'Ogni funzione critica ha un sostituto identificato?' },
        { q: 'Esiste un piano di successione scritto per il dirigente e i suoi N-1?' },
        { q: 'Il know-how critico è documentato altrove che nella testa di chi lo detiene?' },
      ],
      levels: [
        { min: 0, label: 'Da inquadrare', desc: 'L’organizzazione poggia sul suo dirigente e su poche persone. Una partenza o un’assenza prolungata la metterebbe in difficoltà.', nextAction: 'Misurare l’Indice di dipendenza e delegare per prime le relazioni con i clienti chiave.' },
        { min: 3, label: 'In costruzione', desc: 'Le deleghe esistono e i clienti hanno più interlocutori. Manca la formalizzazione: sostituti, piano di successione scritto, saperi documentati.', nextAction: 'Scrivere il piano di successione del dirigente e dei suoi N-1, e documentare i dieci processi critici.' },
        { min: 5, label: 'Padroneggiato', desc: 'L’organizzazione regge senza il suo dirigente. Il tema diventa la transizione: calendario, governance, ruolo della famiglia o degli azionisti.', nextAction: 'Inquadrare la governance di transizione e preparare il comitato di nomina.' },
      ],
      privacy: PRIVACY,
    },
    perspectives: { title: 'Prospettive', items: [] },
    cta: { metier: 'talent' },
  },

  ma: {
    key: 'ma', path: '/advisory/ma',
    image: '/images/advisory/ma.jpg',
    imageAlt: 'Dirigente che si reca a una riunione di negoziazione',
    meta: {
      title: 'Acquisizione, cessione, integrazione: la consulenza a monte delle transazioni | Aegryn',
      description: 'Revisione degli angoli ciechi di un target (codice e diritti, clausole di cambio di controllo, conformità, squadre), preparazione del cedente, integrazione a 100 giorni. L’esecuzione finanziaria spetta a partner accreditati.',
      keywords: ['consulenza acquisizione PMI', 'revisione di target', 'clausola di cambio di controllo', 'integrazione post-acquisizione', 'piano 100 giorni', 'build-up', 'preparazione cedente'],
    },
    eyebrow: 'M&A, Transazioni & PMI',
    h1: 'Un’acquisizione si vince nella preparazione. Si perde nell’integrazione.',
    subtitle: 'Aegryn guarda ciò che gli audit finanziari e legali guardano poco: il codice, i diritti, le clausole di cambio di controllo, le squadre. L’esecuzione finanziaria è affidata a partner accreditati.',
    scope: [
      { label: 'Profondità di audit: Rischi & Conformità', href: '/advisory/risk-compliance' },
      { label: 'Profondità di audit: Tecnologia', href: '/advisory/technology' },
      { label: 'Squadre: Talento & Organizzazione', href: '/advisory/talent-organization' },
    ],
    observation: {
      title: 'Che cosa osserviamo',
      cards: [
        { value: '48 a 66 %', label: 'tasso di fallimento delle operazioni di M&A secondo gli studi compilati, per lo più nell’integrazione', source: 'Wiley Encyclopedia of Management; Kotter et al.' },
        { value: '208', label: 'operazioni di M&A di PMI svizzere nel 2025, +16 %; +28 % nei servizi informatici e nel software', source: 'SECO, kmu.admin.ch' },
        { value: '23 %', label: 'dei cedenti potenziali francesi rilevano una mancanza di offerte di ripresa', source: 'Bpifrance Le Lab, 2025' },
      ],
      paragraphs: [
        'Gli studi compilati collocano il fallimento delle operazioni di M&A tra il 48 e il 66 % secondo la definizione adottata, e le osservazioni di Kotter e dei suoi coautori collocano l’essenziale dei fallimenti nell’integrazione. In Svizzera, le operazioni di M&A di PMI sono rimbalzate del 16 % nel 2025 (208 operazioni), con +28 % nei servizi informatici e nel software. In Francia, il 23 % dei cedenti potenziali rileva una mancanza di offerte di ripresa.',
      ],
      change: 'Il mercato ha cedenti e acquirenti; ciò che manca è la preparazione che fa andare in porto l’operazione e mantiene le sue promesse.',
      sources: 'Fonti: Wiley Encyclopedia of Management; Kotter, Akhtar, Gupta, Change · SECO · Bpifrance Le Lab (2025).',
    },
    outcomes: {
      title: 'Che cosa ottenete',
      items: [
        'Un target guardato sotto quattro angoli che la due diligence classica copre poco.',
        'Punti di negoziazione quantificati piuttosto che intuizioni.',
        'Un piano di integrazione pronto prima della firma.',
      ],
    },
    situations: {
      title: 'A che punto siete. Come interveniamo.',
      items: [
        { quote: 'Abbiamo individuato un target.', decision: 'Che cosa guardare prima della lettera d’intenti.', deliverable: 'Revisione dei quattro angoli ciechi, con trattamento proposto per ciascuno: prezzo, garanzia, condizione sospensiva.', format: 'Qualche settimana', cycles: ['acquisition'], image: `${S}planning-laptops.jpg` },
        { quote: 'Ci hanno contattato per acquisirci.', decision: 'Fino a che punto prepararsi prima di rispondere.', deliverable: 'Diagnosi di preparazione del cedente e posizione negoziale.', format: 'Qualche settimana', cycles: ['transmission'], image: `${S}dashboard-laptop.jpg` },
        { quote: 'Vogliamo fare due o tre acquisizioni in tre anni.', decision: 'Tesi, criteri, processo.', deliverable: 'Programma di build-up riproducibile: criteri, revisione standard, playbook di integrazione.', format: 'Da uno a due mesi', cycles: ['acquisition'], image: `${S}loft-office.jpg` },
        { quote: 'L’acquisizione è firmata, l’integrazione arranca.', decision: 'Che cosa è urgente, che cosa può attendere.', deliverable: 'Piano 30 / 60 / 100 giorni e pilotaggio.', format: 'Missione da tre a sei mesi', cycles: ['acquisition'], image: `${S}open-office.jpg` },
        { quote: 'Dobbiamo cedere un’attività non strategica.', decision: 'Perimetro e separazione dei sistemi.', deliverable: 'Piano di separazione: perimetro, sistemi, persone, accordi di transizione.', format: 'Da uno a due mesi', cycles: ['restructuration'], image: `${S}industrial-engineer.jpg` },
        { quote: 'Il mio fondo deve validare un target tecnologico.', decision: 'Investire, negoziare o rinunciare.', deliverable: 'Revisione tecnica e organizzativa indipendente, valutata per angolo cieco.', format: 'Qualche settimana', cycles: ['acquisition'], image: `${S}server-room-walk.jpg` },
      ],
    },
    services: {
      title: 'I nostri servizi',
      items: [
        'Formulare la tesi di acquisizione e i criteri di target',
        'Passare il target al vaglio dei quattro angoli ciechi',
        'Inquadrare i punti di negoziazione emersi dalla revisione',
        'Preparare l’organizzazione a essere esaminata (lato cedente)',
        'Pilotare l’integrazione a 100 giorni',
        'Strutturare un programma di build-up',
      ],
    },
    framework: {
      name: 'La Revisione dei quattro angoli ciechi',
      intro: 'Ogni constatazione è classificata per impatto e probabilità, poi trattata: aggiustamento di prezzo, garanzia specifica, condizione sospensiva o punto accettato con cognizione di causa.',
      axes: [
        { label: 'Codice e catena dei diritti', desc: 'Licenze, cessioni d’autore, dipendenze.' },
        { label: 'Contratti e cambio di controllo', desc: 'Clienti, fornitori, licenze cedute.' },
        { label: 'Conformità e sicurezza', desc: 'Perimetro regolamentare ereditato, incidenti, prove disponibili.' },
        { label: 'Persone e dipendenze', desc: 'Manager chiave, retention, cultura.' },
      ],
      deliverable: 'Una matrice impatto / probabilità per angolo, e per ogni constatazione il trattamento proposto in negoziazione.',
    },
    bySize: {
      title: 'Secondo la vostra dimensione',
      items: [
        { label: 'PMI · da 10 a 50 M€', desc: 'Ripresa, MBO o acquisto da parte di un attore di dimensione simile, con pochi consulenti attorno al tavolo. Concentriamo la revisione sui quattro angoli ciechi in qualche settimana, a fianco dell’avvocato e del commercialista.' },
        { label: 'Mid-cap · da 50 a 300 M€', desc: 'Programma di crescita esterna, squadra M&A interna o banca d’affari. Aegryn interviene come partner di revisione tecnica, organizzativa e d’integrazione.' },
      ],
    },
    bySector: {
      title: 'Secondo il vostro settore',
      items: [
        { cluster: 'Finance & Capital', desc: 'Acquisizione di un attore fintech o insurtech; autorizzazioni e approvazioni di cambio di controllo; portabilità dei dati; DORA sui terzi.' },
        { cluster: 'Salute & Scienze della vita', desc: 'Continuità della marcatura CE (MDR) e dell’hosting HDS; contratti ospedalieri con clausola di cambio di controllo.' },
        { cluster: 'Industria, Energia & Infrastrutture', desc: 'Acquisire competenze digitali; proprietà intellettuale in ambiente industriale; fondatore-sviluppatore.' },
        { cluster: 'Commercio, Servizi & Esperienza cliente', desc: 'Attori digitali per completare una rete fisica; dati clienti; integrazione delle squadre.' },
        { cluster: 'Tech, Innovazione & Settore pubblico', desc: 'Build-up di software verticali; qualità del ricavo ricorrente; clausole di cambio di controllo; copyleft.' },
      ],
    },
    scenario: {
      tag: 'Scenario tipo · illustrativo',
      text: 'Gruppo di servizi da 90 M€ che vuole acquisire un editore da 8 M€ di fatturato. In tre settimane: due contratti clienti importanti contengono una clausola di cambio di controllo, una libreria sotto licenza copyleft è al cuore del prodotto, il direttore tecnico è il solo depositario dell’architettura. Tre punti vanno in negoziazione: garanzia specifica, condizione sospensiva, piano di retention.',
    },
    ai: {
      title: 'Che cosa uno strumento di IA non farà al posto vostro',
      text: 'Un assistente legge un contratto di cessione. Non vi dirà quanto vale la clausola di cambio di controllo del contratto del vostro primo cliente, non sarà seduto di fronte al direttore tecnico del target, e non impegna la propria responsabilità.',
    },
    complement: {
      title: 'Per andare oltre',
      text: 'Quando il dossier lo giustifica, la revisione può appoggiarsi alla certificazione CIFSO 5000, indipendente, rilasciata su cinque dimensioni.',
    },
    diagnostic: {
      title: 'A che punto siete? Cinque domande.',
      intro: 'Rispondete sì o no. Il risultato vi colloca su tre livelli e nomina il prossimo passo.',
      questions: [
        { q: 'Disponete di una tesi scritta di crescita esterna (criteri di target, budget, calendario)?' },
        { q: 'Sapete quali clausole di cambio di controllo figurano nei vostri contratti clienti chiave?' },
        { q: 'La catena dei diritti sul vostro codice e sui vostri marchi è documentata?' },
        { q: 'Esiste un piano di integrazione a 100 giorni prima di ogni firma?' },
        { q: 'Se un acquirente vi contattasse domani, potreste aprire una data room in due settimane?' },
      ],
      levels: [
        { min: 0, label: 'Da inquadrare', desc: 'L’operazione sarebbe gestita man mano. Gli angoli ciechi (diritti, clausole, squadre) sarebbero scoperti dall’altra parte.', nextAction: 'Scrivere la tesi o la diagnosi di preparazione, e rileggere le clausole di cambio di controllo dei vostri tre primi contratti.' },
        { min: 3, label: 'In costruzione', desc: 'Le basi esistono: tesi o preparazione, contratti noti. Manca la meccanica: catena dei diritti, piano a 100 giorni, data room pronta.', nextAction: 'Documentare la catena dei diritti e redigere il piano di integrazione prima della prossima lettera d’intenti.' },
        { min: 5, label: 'Padroneggiato', desc: 'Siete pronti a comprare o a essere esaminati. Il tema diventa la ripetibilità: programma di build-up, playbook di integrazione.', nextAction: 'Strutturare il programma di build-up e misurare l’integrazione a 100 giorni sulla prossima operazione.' },
      ],
      privacy: PRIVACY,
    },
    perspectives: {
      title: 'Prospettive',
      items: [
        { title: 'Come gli acquirenti PE valutano un SaaS nel 2026', href: '/blog/comment-acquereurs-pe-evaluent-saas-2026', kind: 'article' },
        { title: 'Aegryn Magazine, Issue 02 · The Exit Equation (aprile 2027)', href: '/magazine', kind: 'magazine' },
      ],
    },
    cta: { metier: 'ma' },
  },
}
