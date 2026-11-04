/**
 * Services proposables par les pros neediu : les 51 catégories du catalogue neediu (clés = `service_categories.name`
 * dans la base neediu-react). Les 46 premiers viennent de `neediu-app/apps/mobile/constants/services.ts` avec leurs
 * libellés exacts (fr, en, es, it, de, nl) ; 5 existent seulement dans les migrations (event-staff, clearance,
 * pet-grooming, personal-shopper, car-wash : nom français de la base, autres langues à confirmer).
 * Les clés sont la référence ; la base neediu reste maître du catalogue. Ordre alphabétique : calculé à l'affichage
 * selon la langue du visiteur.
 */
export type NeediuLocale = 'fr' | 'en' | 'de' | 'es' | 'it' | 'nl'
type Labels = Record<NeediuLocale, string>

export const NEEDIU_THEMES = ["maison", "bricolage", "bien-etre", "beaute", "enfants", "animaux", "evenements", "auto", "tech", "pro"] as const
export type NeediuTheme = (typeof NEEDIU_THEMES)[number]

export const NEEDIU_THEME_LABELS: Record<NeediuTheme, Labels> = {
  "maison": { fr: "Maison", en: "Home", de: "Zuhause", es: "Hogar", it: "Casa", nl: "Huis" },
  "bricolage": { fr: "Bricolage", en: "DIY & repair", de: "Heimwerken", es: "Bricolaje", it: "Fai da te", nl: "Klussen" },
  "bien-etre": { fr: "Bien-être", en: "Well-being", de: "Wohlbefinden", es: "Bienestar", it: "Benessere", nl: "Welzijn" },
  "beaute": { fr: "Beauté", en: "Beauty", de: "Schönheit", es: "Belleza", it: "Bellezza", nl: "Schoonheid" },
  "enfants": { fr: "Enfants", en: "Kids", de: "Kinder", es: "Niños", it: "Bambini", nl: "Kinderen" },
  "animaux": { fr: "Animaux", en: "Pets", de: "Haustiere", es: "Mascotas", it: "Animali", nl: "Huisdieren" },
  "evenements": { fr: "Événements", en: "Events", de: "Events", es: "Eventos", it: "Eventi", nl: "Evenementen" },
  "auto": { fr: "Auto & transport", en: "Car & transport", de: "Auto & Transport", es: "Coche y transporte", it: "Auto e trasporti", nl: "Auto & vervoer" },
  "tech": { fr: "Tech", en: "Tech", de: "Tech", es: "Tech", it: "Tech", nl: "Tech" },
  "pro": { fr: "Pro & divers", en: "Pro & misc", de: "Pro & Sonstiges", es: "Pro y varios", it: "Pro e vari", nl: "Pro & divers" },
}

export const NEEDIU_SERVICES: { key: string; theme: NeediuTheme; label: Labels }[] = [
  { key: "locksmithing", theme: "bricolage", label: { fr: "Serrurerie", en: "Locksmithing", de: "Schlüsseldienst", es: "Cerrajería", it: "Fabbro / Serraturista", nl: "Slotenmaker" } },
  { key: "administration", theme: "pro", label: { fr: "Gestion administrative", en: "Administration", de: "Verwaltung", es: "Gestión administrativa", it: "Gestione amministrativa", nl: "Administratie" } },
  { key: "baby", theme: "enfants", label: { fr: "Garde d'enfant", en: "Babysitting", de: "Kinderbetreuung", es: "Cuidado de niños", it: "Assistenza bambini", nl: "Kinderopvang" } },
  { key: "bodyguard", theme: "pro", label: { fr: "Agent de sécurité", en: "Bodyguard", de: "Sicherheitsdienst", es: "Agente de seguridad", it: "Agente di sicurezza", nl: "Beveiliger" } },
  { key: "car-repair", theme: "auto", label: { fr: "Entretien auto", en: "Car Repair", de: "Kfz-Werkstatt", es: "Taller mecánico", it: "Meccanico auto", nl: "Autoherstel" } },
  { key: "carrying", theme: "auto", label: { fr: "Portage / transport", en: "Carrying", de: "Trageservice", es: "Transporte de cargas", it: "Facchinaggio", nl: "Vervoer" } },
  { key: "cleaning", theme: "maison", label: { fr: "Ménage à domicile", en: "Home Cleaning", de: "Haushaltsreinigung", es: "Limpieza del hogar", it: "Pulizie domestiche", nl: "Schoonmaak" } },
  { key: "clown", theme: "evenements", label: { fr: "Animation anniversaire", en: "Clown / Party", de: "Kindergeburtstag", es: "Animación infantil", it: "Animazione feste", nl: "Feestanimatie" } },
  { key: "coaching", theme: "bien-etre", label: { fr: "Entraîneur sportif", en: "Sports Coaching", de: "Sporttrainer", es: "Entrenamiento deportivo", it: "Allenatore sportivo", nl: "Sporttrainer" } },
  { key: "confort", theme: "bricolage", label: { fr: "Climatisation / confort", en: "Air Conditioning", de: "Klimaanlage", es: "Climatización", it: "Climatizzazione", nl: "Airconditioning" } },
  { key: "cooking", theme: "evenements", label: { fr: "Cuisine à domicile", en: "Cooking", de: "Kochen zu Hause", es: "Cocina a domicilio", it: "Cucina a domicilio", nl: "Thuiskoken" } },
  { key: "dance", theme: "bien-etre", label: { fr: "Cours de danse", en: "Dance", de: "Tanzkurs", es: "Clases de baile", it: "Corsi di danza", nl: "Danslessen" } },
  { key: "delivery", theme: "auto", label: { fr: "Livraison", en: "Delivery", de: "Lieferservice", es: "Entrega a domicilio", it: "Consegna a domicilio", nl: "Bezorging" } },
  { key: "dj", theme: "evenements", label: { fr: "DJ / Soirée", en: "DJ", de: "DJ / Party", es: "DJ / Eventos", it: "DJ / Serate", nl: "DJ / Feest" } },
  { key: "electrical", theme: "bricolage", label: { fr: "Électricité", en: "Electrical", de: "Elektroinstallation", es: "Electricidad", it: "Elettricità", nl: "Elektriciteitswerk" } },
  { key: "food-tray", theme: "evenements", label: { fr: "Traiteur / plateau repas", en: "Food Tray", de: "Catering", es: "Catering / Menú", it: "Catering / Gastronomia", nl: "Catering" } },
  { key: "gardening", theme: "maison", label: { fr: "Jardinage", en: "Gardening", de: "Gartenarbeit", es: "Jardinería", it: "Giardinaggio", nl: "Tuinieren" } },
  { key: "haircut", theme: "beaute", label: { fr: "Coiffure", en: "Haircut", de: "Friseur", es: "Peluquería", it: "Parrucchiere", nl: "Kapper" } },
  { key: "heart", theme: "bien-etre", label: { fr: "Soins à domicile", en: "Home Care", de: "Häusliche Pflege", es: "Cuidados a domicilio", it: "Assistenza domiciliare", nl: "Thuiszorg" } },
  { key: "heating", theme: "bricolage", label: { fr: "Chauffage", en: "Heating", de: "Heizungsinstallation", es: "Calefacción", it: "Riscaldamento", nl: "Verwarming" } },
  { key: "iron", theme: "maison", label: { fr: "Repassage", en: "Ironing", de: "Bügeln", es: "Planchado", it: "Stiratura", nl: "Strijken" } },
  { key: "it", theme: "tech", label: { fr: "Informatique", en: "IT Support", de: "IT-Support", es: "Soporte informático", it: "Supporto informatico", nl: "IT-ondersteuning" } },
  { key: "makeup", theme: "beaute", label: { fr: "Maquillage", en: "Makeup", de: "Make-up", es: "Maquillaje", it: "Trucco e make-up", nl: "Make-up" } },
  { key: "massage", theme: "bien-etre", label: { fr: "Massage", en: "Massage", de: "Massage", es: "Masaje", it: "Massaggio", nl: "Massage" } },
  { key: "moving", theme: "auto", label: { fr: "Déménagement", en: "Moving", de: "Umzug", es: "Mudanza", it: "Trasloco", nl: "Verhuizing" } },
  { key: "nail", theme: "beaute", label: { fr: "Manucure", en: "Manicure", de: "Maniküre", es: "Manicura", it: "Manicure", nl: "Manicure" } },
  { key: "nurse", theme: "bien-etre", label: { fr: "Soins infirmiers", en: "Nursing", de: "Krankenpflege", es: "Enfermería", it: "Infermieristica", nl: "Verpleging" } },
  { key: "outdoor-cleaning", theme: "maison", label: { fr: "Nettoyage extérieur", en: "Outdoor Cleaning", de: "Außenreinigung", es: "Limpieza exterior", it: "Pulizie esterne", nl: "Buitenreiniging" } },
  { key: "package-box", theme: "maison", label: { fr: "Emballage / cartons", en: "Packing", de: "Verpackungsservice", es: "Embalaje / Cajas", it: "Imballaggio", nl: "Verpakking" } },
  { key: "painting", theme: "maison", label: { fr: "Peinture", en: "Painting", de: "Malerarbeiten", es: "Pintura", it: "Imbianchino", nl: "Schilderwerk" } },
  { key: "parquet", theme: "maison", label: { fr: "Pose de parquet et carrelage", en: "Flooring & tiling", de: "Parkett und Fliesen verlegen", es: "Suelos y azulejos", it: "Posa parquet e piastrelle", nl: "Parket en tegels leggen" } },
  { key: "petcare", theme: "animaux", label: { fr: "Garde d'animaux", en: "Pet Care", de: "Tierbetreuung", es: "Cuidado de mascotas", it: "Custodia animali", nl: "Huisdieroppas" } },
  { key: "photo-camera", theme: "evenements", label: { fr: "Photographie", en: "Photography", de: "Fotografie", es: "Fotografía", it: "Fotografia", nl: "Fotografie" } },
  { key: "plumbing", theme: "bricolage", label: { fr: "Plomberie", en: "Plumbing", de: "Klempnerarbeiten", es: "Fontanería", it: "Idraulico", nl: "Loodgieter" } },
  { key: "power-washing", theme: "maison", label: { fr: "Nettoyage haute pression", en: "Power Washing", de: "Hochdruckreiniger", es: "Limpieza a presión", it: "Pulizia alta pressione", nl: "Hogedrukreiniging" } },
  { key: "recycling-bin", theme: "maison", label: { fr: "Évacuation déchets", en: "Recycling / Waste", de: "Entsorgungsservice", es: "Gestión de residuos", it: "Smaltimento rifiuti", nl: "Afvalverwijdering" } },
  { key: "shaker", theme: "evenements", label: { fr: "Barman / cocktails", en: "Bartending", de: "Barkeeper", es: "Barman / Cócteles", it: "Barman / Cocktail", nl: "Barman" } },
  { key: "shoe-shine", theme: "beaute", label: { fr: "Cirage chaussures", en: "Shoe Shine", de: "Schuhpflege", es: "Limpieza de zapatos", it: "Lucidatura scarpe", nl: "Schoenenpoetsen" } },
  { key: "shutter", theme: "maison", label: { fr: "Volets / stores", en: "Shutters", de: "Rollläden / Jalousien", es: "Persianas / Estores", it: "Persiane / Tapparelle", nl: "Rolluiken" } },
  { key: "steering-wheel", theme: "auto", label: { fr: "Chauffeur privé", en: "Private Driver", de: "Privatfahrer", es: "Chófer privado", it: "Autista privato", nl: "Privéchauffeur" } },
  { key: "stitching", theme: "beaute", label: { fr: "Couture / retouche", en: "Stitching", de: "Schneiderei", es: "Costura / Arreglos", it: "Sartoria", nl: "Kleermaker" } },
  { key: "tinking", theme: "bricolage", label: { fr: "Bricolage", en: "DIY / Tinkering", de: "Heimwerken", es: "Bricolaje / Mantenimiento", it: "Bricolage / Tuttofare", nl: "Klusjes" } },
  { key: "trash-can", theme: "maison", label: { fr: "Nettoyage poubelles", en: "Bin Cleaning", de: "Mülltonnenreinigung", es: "Limpieza de contenedores", it: "Pulizia bidoni", nl: "Vuilnisbak schoonmaken" } },
  { key: "tutoring", theme: "enfants", label: { fr: "Cours particuliers", en: "Tutoring", de: "Nachhilfe", es: "Clases particulares", it: "Ripetizioni", nl: "Bijles" } },
  { key: "vinyl-player", theme: "evenements", label: { fr: "Animation musicale", en: "Music Performance", de: "Musikshow", es: "Animación musical", it: "Animazione musicale", nl: "Muzikale animatie" } },
  { key: "window-cleaning", theme: "maison", label: { fr: "Nettoyage vitres", en: "Window Cleaning", de: "Fensterreinigung", es: "Limpieza de cristales", it: "Pulizia vetri", nl: "Raambewassing" } },
  { key: "event-staff", theme: "evenements", label: { fr: "Aide événementiel", en: "Event staff", de: "Eventhelfer", es: "Personal para eventos", it: "Personale per eventi", nl: "Evenementenhulp" } },
  { key: "clearance", theme: "maison", label: { fr: "Débarras", en: "Clearance", de: "Entrümpelung", es: "Vaciado de inmuebles", it: "Sgombero", nl: "Ontruiming" } },
  { key: "pet-grooming", theme: "animaux", label: { fr: "Toilettage animaux", en: "Pet grooming", de: "Tierpflege", es: "Peluquería canina y felina", it: "Toelettatura animali", nl: "Trimmen van huisdieren" } },
  { key: "personal-shopper", theme: "pro", label: { fr: "Assistant shopping", en: "Personal shopper", de: "Personal Shopper", es: "Asistente de compras", it: "Personal shopper", nl: "Personal shopper" } },
  { key: "car-wash", theme: "auto", label: { fr: "Lavage auto", en: "Car wash", de: "Autowäsche", es: "Lavado de coches", it: "Lavaggio auto", nl: "Autowas" } },
]

export const NEEDIU_SERVICE_KEYS = NEEDIU_SERVICES.map(s => s.key)
