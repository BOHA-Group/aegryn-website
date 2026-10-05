import type { AdvisoryPageContent, AdvisoryKey } from './types'

/** Contenido en español de las cinco páginas ACCOMPAGNER, traducido de fr.ts (referencia). */

const PRIVACY =
  'Sus respuestas permanecen en su navegador. Nada se guarda ni se transmite sin su consentimiento. El resultado cabe en una página: su nivel y el siguiente paso recomendado.'

const S = '/images/advisory/situations/'

export const ADVISORY_ES: Record<AdvisoryKey, AdvisoryPageContent> = {

  strategy: {
    key: 'strategy', path: '/advisory/strategy',
    image: '/images/advisory/strategy-towers.jpg',
    imageAlt: 'Torres de oficinas vistas desde abajo, el rumbo y la altura de miras',
    meta: {
      title: 'Consultoría estratégica para pymes y empresas medianas | Aegryn',
      description: 'Rumbo, modelo de negocio, crecimiento externo, nuevos mercados: Aegryn ayuda a los directivos de organizaciones de 10 a 300 M€ a decidir, cuantificar y sostener sus decisiones estratégicas. Suiza y Europa.',
      keywords: ['consultoría estratégica pyme', 'consultoría estratégica empresa mediana', 'plan a tres años', 'crecimiento externo', 'entrada en nuevo mercado', 'advisory estrategia Suiza'],
    },
    eyebrow: 'Estrategia empresarial e Innovación',
    h1: 'Elegir el rumbo correcto, en el orden correcto, con los medios que realmente tiene.',
    subtitle: 'Para quien dirige una organización de 10 a 300 M€, la estrategia no es un ejercicio de planificación: son arbitrajes bajo restricciones de capital, de tiempo directivo y de capacidad de ejecución. Aegryn le ayuda a plantearlos, cuantificarlos y sostenerlos.',
    scope: [
      { label: 'Equipo directivo: Talento y Organización', href: '/advisory/talent-organization' },
      { label: 'Ejecución de una adquisición: M&A', href: '/advisory/ma' },
      { label: 'Decisiones de arquitectura: Tecnología', href: '/advisory/technology' },
    ],
    observation: {
      title: 'Lo que observamos',
      cards: [
        { value: '≈ 9 000', label: 'misiones de consultoría de Bpifrance en 2024, +50 % en un año', source: 'Bpifrance Presse, 2025' },
        { value: '−2 %', label: 'mercado francés de la consultoría en 2025, descontada la inflación', source: 'Syntec Conseil' },
        { value: '−7,3', label: 'puntos de índice, barómetro de pymes NZZ 2026, nivel más bajo desde el inicio de la encuesta en 2021', source: 'NZZ-KMU-Barometer 2026, Kalaidos Fachhochschule' },
      ],
      paragraphs: [
        'Los directivos de pymes y empresas medianas compran consultoría, pero de otra manera. Bpifrance realizó cerca de 9 000 misiones de consultoría en 2024, un 50 % más en un año, mientras el mercado francés de la consultoría retrocede un 2 % en 2025 descontada la inflación. En Suiza, el índice compuesto del barómetro de pymes NZZ 2026 (NZZ y la escuela superior Kalaidos) cae a −7,3 puntos, su nivel más bajo desde el inicio de la encuesta en 2021; solo la integración de las tecnologías progresa.',
      ],
      change: 'Cuando el contexto se tensa, el coste de un mal arbitraje aumenta. La necesidad ya no es un gran programa, es una decisión precisa, tomada rápido, con una mirada sénior.',
      sources: 'Fuentes: Bpifrance Presse (2025) · Syntec Conseil · NZZ-KMU-Barometer 2026, Kalaidos Fachhochschule (recogido por el SECO).',
    },
    outcomes: {
      title: 'Lo que obtiene',
      items: [
        'Una decisión que su comité puede defender ante un banquero o un accionista.',
        'Un rumbo que su comité puede aplicar en su ausencia, sin llamarle.',
        'Una primera acción fechada en los próximos treinta días.',
      ],
    },
    situations: {
      title: 'Dónde está. Cómo intervenimos.',
      items: [
        { quote: 'Nuestro modelo se erosiona.', decision: 'Pivotar, defender o cambiar de segmento.', deliverable: 'Revisión de posición: economía unitaria por segmento, competencia, tres opciones cuantificadas.', format: 'Misión corta', cycles: ['croissance', 'restructuration'], image: `${S}dashboard-laptop.jpg` },
        { quote: 'La IA cambia nuestro oficio.', decision: 'Dónde integrarla, qué no automatizar.', deliverable: 'Mapa de usos de la IA por etapa de la cadena de valor, clasificados por valor creado y riesgo asumido.', format: 'Unas semanas', cycles: ['croissance'], image: `${S}developer-desk.jpg` },
        { quote: 'Un competidor está en venta, o un socio podría comprarnos.', decision: 'Crecimiento orgánico, alianza o adquisición.', deliverable: 'Tesis de crecimiento externo, criterios de objetivo, marco go / no-go.', format: 'Unas semanas', cycles: ['acquisition'], image: `${S}handshake.jpg` },
        { quote: 'Abrimos un nuevo mercado (DACH, Benelux, Europa del Sur).', decision: 'Filial, distribuidor, socio, o esperar.', deliverable: 'Plan de entrada por país, con exigencias regulatorias locales y necesidades de talento.', format: 'Unas semanas', cycles: ['croissance'], image: `${S}meeting-room.jpg` },
        { quote: 'Mi consejo, mi banco o mi accionista pide un plan a tres años.', decision: 'Qué hipótesis asumir, cuáles probar.', deliverable: 'Plan defendible, sensibilidades explícitas, memorando de diez páginas para el comité.', format: 'De uno a dos meses', cycles: ['lancement', 'croissance'], image: `${S}planning-laptops.jpg` },
        { quote: 'La estrategia está en mi cabeza.', decision: 'Lo que debe existir sin usted.', deliverable: 'Estrategia documentada en cinco prioridades, con responsables e hitos.', format: 'Unas semanas', cycles: ['croissance', 'transmission'], image: `${S}plan-writing.jpg` },
      ],
    },
    services: {
      title: 'Nuestros servicios',
      items: [
        'Revisar la posición estratégica',
        'Arbitrar entre opciones',
        'Construir el plan a tres años',
        'Preparar el comité (memorando para consejo, banco, accionistas)',
        'Encuadrar la entrada en un nuevo mercado',
        'Acompañar al consejo (advisory trimestral)',
      ],
    },
    framework: {
      name: 'La Rejilla de las cuatro pruebas',
      intro: 'Cada opción estratégica pasa cuatro pruebas antes de ser retenida.',
      axes: [
        { label: 'Valor', desc: '¿Qué cambia en el valor de la organización dentro de tres años?' },
        { label: 'Reversibilidad', desc: 'Si fracasa, ¿cuál es el coste de salida a doce meses?' },
        { label: 'Capacidad', desc: '¿Tenemos las personas, la tecnología y el capital para ejecutarla, sin movilizar al directivo a tiempo completo?' },
        { label: 'Secuencia', desc: '¿Qué debe ser cierto antes, y qué puede esperar?' },
      ],
      deliverable: 'Una ficha de decisión de una página que puntúa las opciones y nombra la primera decisión a tomar en los próximos treinta días.',
    },
    bySize: {
      title: 'Según su tamaño',
      items: [
        { label: 'Pyme · de 10 a 50 M€', desc: 'El directivo decide con dos o tres personas, sin dirección de estrategia. La restricción es su tiempo. Entregamos corto, sin estructura de proyecto, en un formato que cabe en diez páginas.' },
        { label: 'Empresa mediana · de 50 a 300 M€', desc: 'Varias actividades, un comité ejecutivo, a veces un accionista familiar o un fondo. La restricción es la alineación. Animamos el arbitraje y documentamos la decisión para el consejo.' },
      ],
    },
    bySector: {
      title: 'Según su sector',
      items: [
        { cluster: 'Finance & Capital', desc: 'Desintermediación por los nuevos actores; alianzas tecnológicas a arbitrar bajo las restricciones DORA y FINMA sobre terceros críticos.' },
        { cluster: 'Salud y Ciencias de la vida', desc: 'Paso de lo público a lo privado, entrada en un país sometido a un marco MDR, HDS o EHDS distinto.' },
        { cluster: 'Industria, Energía e Infraestructuras', desc: 'Servicios en torno al producto (mantenimiento predictivo, as-a-service); captar el valor del dato o delegarlo a un integrador.' },
        { cluster: 'Comercio, Servicios y Experiencia de cliente', desc: 'Omnicanal, pricing, lugar de la marca propia frente a las plataformas de terceros.' },
        { cluster: 'Tech, Innovación y Sector público', desc: 'Modelo product-led o comercial, definición del cliente objetivo, entrada DACH, acceso a la contratación pública.' },
      ],
    },
    scenario: {
      tag: 'Escenario tipo · ilustrativo, no procedente de una misión identificada',
      text: 'Empresa mediana industrial de 120 M€, Suiza francófona y Francia. El directivo duda entre comprar un editor de mantenimiento predictivo y desarrollarlo internamente. En tres semanas, su comité dispone de una ficha de decisión: tres opciones, coste total a tres años, riesgos de ejecución, condiciones de reversibilidad, primera decisión a tomar en treinta días.',
    },
    ai: {
      title: 'Lo que una herramienta de IA no hará por usted',
      text: 'Un asistente estructura sus opciones. No conoce ni su accionariado, ni su equipo, ni lo que su banquero aceptará. No responde de la decisión. Aegryn confronta sus hipótesis, asume una opinión y vuelve a medir la desviación unos meses después.',
    },
    diagnostic: {
      title: '¿Dónde está? Cinco preguntas.',
      intro: 'Responda sí o no. El resultado le sitúa en tres niveles y nombra el siguiente paso.',
      questions: [
        { q: '¿Puede escribir su estrategia en una página, y conoce el comité de dirección sus cinco prioridades?' },
        { q: '¿Tiene cada prioridad un responsable, un hito y un indicador?' },
        { q: '¿Ha cuantificado al menos dos alternativas a su rumbo actual?' },
        { q: '¿Sabe qué decisiones son reversibles a doce meses y cuáles no?' },
        { q: '¿Una mirada externa ha cuestionado sus hipótesis clave en los últimos doce meses?' },
      ],
      levels: [
        { min: 0, label: 'Por encuadrar', desc: 'La estrategia existe, pero sobre todo en la cabeza del directivo. Las opciones no han sido cuantificadas ni confrontadas.', nextAction: 'Poner su decisión principal en una ficha: opciones, coste de salida, primera acción a treinta días.' },
        { min: 3, label: 'En construcción', desc: 'Las prioridades son conocidas y seguidas. Falta la puesta a prueba: alternativas cuantificadas, reversibilidad, mirada externa.', nextAction: 'Pasar su rumbo actual por la Rejilla de las cuatro pruebas, con un contradictor sénior.' },
        { min: 5, label: 'Dominado', desc: 'Estrategia escrita, pilotada, probada. El tema pasa a ser el ritmo: revisión trimestral y preparación del comité.', nextAction: 'Instaurar un advisory trimestral para sostener la trayectoria y preparar los próximos arbitrajes.' },
      ],
      privacy: PRIVACY,
    },
    perspectives: {
      title: 'Perspectivas',
      items: [
        { title: 'Estado del mercado de M&A tech en Europa, mediados de 2026', href: '/blog/marche-ma-tech-europe-q3-2026', kind: 'article' },
        { title: 'Aegryn Magazine, Issue 01 · Built to Last', href: '/magazine/issue-01', kind: 'magazine' },
      ],
    },
    cta: { primary: 'Plantear su decisión', secondary: 'Solicitar una ficha de decisión', subject: 'advisory' },
  },

  riskCompliance: {
    key: 'riskCompliance', path: '/advisory/risk-compliance',
    image: '/images/advisory/risk-compliance.jpg',
    imageAlt: 'Revisión de documentos contractuales y regulatorios',
    meta: {
      title: 'Cumplimiento normativo para pymes y empresas medianas: NIS2, DORA, AI Act, LPD | Aegryn',
      description: 'Qué obligaciones se le aplican, cuáles le impondrán sus clientes, cuáles pueden esperar. Cartografía, pruebas oponibles, gestión de incidentes. Francia, Suiza, UE.',
      keywords: ['NIS2 pyme', 'cumplimiento DORA', 'obligaciones AI Act', 'LPD RGPD Suiza', 'cartografía regulatoria', 'gestión de incidentes ciber', 'notificación OFCS 24 h'],
    },
    eyebrow: 'Riesgos y Cumplimiento',
    h1: 'Saber qué le obliga hoy, qué le impondrán sus clientes mañana, y qué puede esperar.',
    subtitle: 'NIS2 aún sin transponer en Francia, un régimen suizo distinto, un AI Act con plazos rediseñados, clientes que ya exigen pruebas. El cumplimiento ya no es un asunto de juristas: es un arbitraje de dirección.',
    scope: [
      { label: 'Arquitectura y alojamiento: Tecnología', href: '/advisory/technology' },
      { label: 'Cumplimiento de un objetivo: M&A', href: '/advisory/ma' },
    ],
    observation: {
      title: 'Lo que observamos',
      cards: [
        { value: '≈ 15 000', label: 'entidades previstas en el perímetro NIS2 en Francia, frente a unos centenares hoy', source: 'Comisión Europea; estimación' },
        { value: '24 h', label: 'plazo para notificar un ciberataque a la OFCS para las infraestructuras críticas suizas, desde el 1 de abril de 2025', source: 'OFCS, ncsc.admin.ch' },
        { value: '35 M€ · 7 %', label: 'tope de las multas del AI Act para las prácticas prohibidas; 15 M€ o 3 % para la mayoría de las demás obligaciones', source: 'Reglamento (UE) 2024/1689, art. 99' },
      ],
      paragraphs: [
        'Francia. NIS2 debe hacer pasar el número de entidades reguladas de unos centenares a unas 15 000, en 18 sectores, desde 50 empleados o 10 M€. La ley de transposición no está votada; la Comisión recurrió al Tribunal de Justicia el 8 de julio de 2026. Esperar la ley es una apuesta, no un plan.',
        'Suiza. NIS2 no se aplica directamente. Desde el 1 de abril de 2025, los operadores de infraestructuras críticas notifican todo ciberataque a la OFCS en 24 horas, con una multa que puede alcanzar 100 000 CHF desde el 1 de octubre de 2025. Seis meses después de la entrada en vigor se habían registrado 164 notificaciones. Fuera de las infraestructuras críticas no hay obligación legal, pero sus clientes de la UE podrán imponérsela por contrato.',
        'IA. El artículo 50 del AI Act es aplicable desde el 2 de agosto de 2026. Las obligaciones de «alto riesgo» del Anexo III se aplazan al 2 de diciembre de 2027 por el Reglamento (UE) 2026/1744. Las multas alcanzan 35 M€ o el 7 % de la facturación mundial para las prácticas prohibidas, 15 M€ o el 3 % para la mayoría de las demás obligaciones.',
      ],
      change: 'Tres calendarios, tres jurisdicciones. La pregunta correcta no es «¿cumplimos?», sino «¿a qué estamos obligados, ante quién, para cuándo?».',
      sources: 'Fuentes: Directiva (UE) 2022/2555 · Comisión Europea · OFCS, comunicado del 29.09.2025 · Reglamentos (UE) 2024/1689 y 2026/1744.',
    },
    outcomes: {
      title: 'Lo que obtiene',
      items: [
        'Una visión clara de lo que se aplica, de lo que se exige por contrato y de lo que puede esperar.',
        'Pruebas que entrega a un cliente sin reconstruirlas.',
        'Un responsable nombrado para cada obligación.',
      ],
    },
    situations: {
      title: 'Dónde está. Cómo intervenimos.',
      items: [
        { quote: 'Un gran cliente nos envía un cuestionario de seguridad de cuarenta páginas.', decision: 'Qué nivel de prueba aportar, sobre qué referencial.', deliverable: 'Expediente de pruebas y plan de cierre de brechas, reutilizable para los clientes siguientes.', format: 'Unas semanas', cycles: ['croissance'], image: `${S}laptop-hands.jpg` },
        { quote: 'No sabemos si estamos en el perímetro.', decision: 'Qué se nos aplica, qué se nos impondrá, qué puede esperar.', deliverable: 'Mapa de exposición de tres vías.', format: 'Misión corta', cycles: ['lancement', 'croissance'], image: `${S}discussion-hands.jpg` },
        { quote: 'Nuestros equipos usan la IA sin reglas.', decision: 'Qué herramientas, con qué datos, bajo qué responsabilidad.', deliverable: 'Política de uso, inventario de sistemas, clasificación conforme al AI Act.', format: 'Misión corta', cycles: ['croissance'], image: `${S}laptop-phone.jpg` },
        { quote: 'Hemos sufrido un incidente.', decision: 'A quién informar (autoridad, clientes, aseguradora), en qué plazos.', deliverable: 'Expediente de incidente documentado y plan de mejora, con los expertos en respuesta a incidentes de la red.', format: 'A demanda', cycles: ['restructuration'], image: `${S}network-cables.jpg` },
        { quote: 'Un inversor o un comprador nos va a auditar.', decision: 'Qué regularizar antes, qué asumir.', deliverable: 'Expediente de cumplimiento listo para la data room.', format: 'Unas semanas', cycles: ['acquisition', 'transmission'], image: `${S}planning-laptops.jpg` },
        { quote: 'Vendemos en la UE desde Suiza (o a la inversa).', decision: 'Representante, DPO, transferencias de datos.', deliverable: 'Matriz de jurisdicciones (LPD / RGPD) y obligaciones asociadas.', format: 'Misión corta', cycles: ['croissance'], image: `${S}office-corridor.jpg` },
      ],
    },
    services: {
      title: 'Nuestros servicios',
      items: [
        'Cartografiar su exposición regulatoria',
        'Constituir el expediente de pruebas oponible a sus clientes',
        'Encuadrar el uso de la IA',
        'Documentar la gestión de incidentes',
        'Pilotar la remediación',
        'Formar al comité de dirección en sus responsabilidades',
      ],
    },
    framework: {
      name: 'El Mapa de exposición de tres vías',
      intro: 'Cada texto se clasifica en una de las tres vías, con su plazo, su responsable interno y la brecha constatada.',
      axes: [
        { label: 'Obligatorio', desc: 'Lo que la ley le impone hoy, según su rol: entidad esencial o importante, responsable del despliegue o proveedor de IA, responsable del tratamiento.' },
        { label: 'Contractual', desc: 'Lo que sus clientes, aseguradoras e inversores exigen, incluso sin ley.' },
        { label: 'Por vigilar', desc: 'Plazo conocido, no aplicable a día de hoy.' },
      ],
      deliverable: 'Una página de síntesis, anexos detallados por texto.',
    },
    bySize: {
      title: 'Según su tamaño',
      items: [
        { label: 'Pyme · de 10 a 50 M€', desc: 'Rara vez un CISO o un DPO a tiempo completo. Apuntamos a una base de controles oponibles, no a un sistema de gestión completo, y movilizamos funciones externalizadas de la red.' },
        { label: 'Empresa mediana · de 50 a 300 M€', desc: 'Existe una dirección de riesgos, varios referenciales se superponen. Los consolidamos en un único plan y preparamos la auditoría interna.' },
      ],
    },
    bySector: {
      title: 'Según su sector',
      items: [
        { cluster: 'Finance & Capital', desc: 'DORA, aplicable desde el 17 de enero de 2025: terceros TIC críticos, pruebas de resiliencia, registro de proveedores. En Suiza, exigencias FINMA sobre riesgos operativos y resiliencia (circular 2023/1).' },
        { cluster: 'Salud y Ciencias de la vida', desc: 'HDS en Francia, MDR/IVDR, EHDS. IA integrada en un producto sanitario: alto riesgo del Anexo I, plazo 2 de agosto de 2028.' },
        { cluster: 'Industria, Energía e Infraestructuras', desc: 'NIS2 (energía, agua, transporte, fabricación); en Suiza, notificación OFCS en 24 h; segmentación IT/OT.' },
        { cluster: 'Comercio, Servicios y Experiencia de cliente', desc: 'RGPD y LPD (fidelización, perfilado); artículo 50 (agentes conversacionales, contenidos generados); herramientas de cribado de candidaturas: alto riesgo, Anexo III, 2 de diciembre de 2027.' },
        { cluster: 'Tech, Innovación y Sector público', desc: 'Sus clientes NIS2 y DORA le piden pruebas; Cyber Resilience Act (obligaciones de notificación desde septiembre de 2026, exigencias de producto en diciembre de 2027); editores de software usados en infraestructuras críticas: comprobar si la LSI suiza le afecta.' },
      ],
    },
    scenario: {
      tag: 'Escenario tipo · ilustrativo',
      text: 'Editor de software suizo con 25 M€ de facturación, clientes en la energía en Alemania y Francia. Su mayor cliente exige pruebas de seguridad de la cadena de suministro antes de renovar. En tres semanas: perímetro aclarado (obligatorio para él, contractual para sus clientes), ocho brechas clasificadas, pruebas reutilizables para los otros tres clientes.',
    },
    ai: {
      title: 'Lo que una herramienta de IA no hará por usted',
      text: 'Un asistente resume NIS2. No llevará su expediente ante su cliente, no elegirá las brechas que usted acepta, no responderá de la calidad de la prueba. Aegryn compromete a un experto nombrado, responsable de su perímetro.',
      legal: 'Nuestro acompañamiento no sustituye a un dictamen jurídico; trabajamos con despachos asociados.',
    },
    diagnostic: {
      title: '¿Dónde está? Cinco preguntas.',
      intro: 'Responda sí o no. El resultado le sitúa en tres niveles y nombra el siguiente paso.',
      questions: [
        { q: '¿Tiene la lista de los textos que se le aplican (UE y Suiza) y sus plazos?' },
        { q: '¿Sabe qué le imponen por contrato sus tres mayores clientes en materia de seguridad y datos?' },
        { q: '¿Existe un procedimiento de incidente escrito, con plazos de notificación y contactos?' },
        { q: '¿Tiene una regla escrita sobre los datos introducidos en las herramientas de IA?' },
        { q: '¿Responde nominalmente del cumplimiento un miembro de la dirección?' },
      ],
      levels: [
        { min: 0, label: 'Por encuadrar', desc: 'El perímetro no está establecido. La exposición se descubre cuando un cliente, un auditor o un incidente la revelan.', nextAction: 'Establecer el Mapa de exposición de tres vías: obligatorio, contractual, por vigilar.' },
        { min: 3, label: 'En construcción', desc: 'Los textos y las exigencias de los clientes están identificados. Falta la prueba: expediente reutilizable, procedimiento de incidente, responsable nombrado.', nextAction: 'Constituir el expediente de pruebas oponible y designar un responsable por obligación.' },
        { min: 5, label: 'Dominado', desc: 'Perímetro, pruebas, responsables: la base existe. El tema pasa a ser el mantenimiento y los plazos venideros (AI Act 2027, CRA).', nextAction: 'Planificar una revisión anual del perímetro y formar al comité de dirección en sus responsabilidades.' },
      ],
      privacy: PRIVACY,
    },
    perspectives: { title: 'Perspectivas', items: [] },
    cta: { primary: 'Evaluar su exposición', secondary: 'Solicitar el Mapa de exposición', subject: 'advisory' },
  },

  technology: {
    key: 'technology', path: '/advisory/technology',
    image: '/images/advisory/technology.jpg',
    imageAlt: 'Armarios de servidores en un centro de datos',
    meta: {
      title: 'Consultoría tecnológica: arquitectura, deuda, IA, alojamiento | Aegryn',
      description: 'Auditoría de arquitectura, arbitraje construir-comprar-aliarse, gobernanza de la IA, dirección técnica a tiempo compartido. Para pymes y empresas medianas de 10 a 300 M€. Suiza y Europa.',
      keywords: ['auditoría de arquitectura', 'deuda técnica', 'dirección técnica a tiempo compartido', 'CTO interino', 'gobernanza IA pyme', 'alojamiento soberano Suiza', 'reversibilidad'],
    },
    eyebrow: 'Tecnología y Soberanía',
    h1: 'Su tecnología es un activo o una dependencia. Mida cuál, antes de que un cliente, un inversor o una avería lo hagan por usted.',
    subtitle: 'Arquitectura, deuda técnica, IA, alojamiento: las decisiones de los tres primeros años pesan sobre los diez siguientes. Aegryn interviene en los momentos en que se deciden.',
    scope: [
      { label: 'Obligaciones legales: Riesgos y Cumplimiento', href: '/advisory/risk-compliance' },
      { label: 'Auditoría de un objetivo: M&A', href: '/advisory/ma' },
      { label: 'Desarrollo a medida: Build', href: '/services/build' },
    ],
    observation: {
      title: 'Lo que observamos',
      cards: [
        { value: '22 % → 34 %', label: 'pymes suizas que usan la IA, de 2024 a 2025', source: 'SECO, kmu.admin.ch' },
        { value: '34 %', label: 'disponen de reglas sobre los datos introducidos en las herramientas de IA; 23 % entre las empresas de menos de 10 empleados', source: 'SECO, kmu.admin.ch' },
        { value: '2 ago 2026', label: 'obligaciones de transparencia del AI Act (artículo 50) aplicables', source: 'Reglamento (UE) 2024/1689' },
      ],
      paragraphs: [
        'La adopción va por delante de la gobernanza. En Suiza, el uso de la IA por las pymes pasó del 22 % al 34 % entre 2024 y 2025; el 60 % ve en ella una oportunidad. Pero solo el 34 % dispone de reglas claras sobre los datos que pueden introducirse en estas herramientas, y el 23 % entre las empresas de menos de diez empleados. Del lado europeo, las obligaciones de transparencia del AI Act se aplican desde el 2 de agosto de 2026.',
      ],
      change: 'El riesgo no viene de la herramienta, sino de la ausencia de una regla a su alrededor.',
      sources: 'Fuentes: SECO, «AI gains ground among Swiss SMEs» · Reglamento (UE) 2024/1689.',
    },
    outcomes: {
      title: 'Lo que obtiene',
      items: [
        'Dependencias nombradas, con un plan para cada componente no reversible.',
        'Una deuda técnica cuantificada en lugar de percibida.',
        'Reglas de uso de la IA que sus equipos aplican.',
      ],
    },
    situations: {
      title: 'Dónde está. Cómo intervenimos.',
      items: [
        { quote: 'Nuestra plataforma ralentiza nuestras entregas.', decision: 'Refactorizar, rehacer o sustituir.', deliverable: 'Auditoría de arquitectura, deuda técnica cuantificada por dominio, trayectoria a doce meses.', format: 'Unas semanas', cycles: ['croissance'], image: `${S}server-room-walk.jpg` },
        { quote: 'Una sola persona entiende el sistema.', decision: 'Documentar, duplicar o internalizar.', deliverable: 'Registro de dependencias (personas, proveedores, licencias) y plan de reducción.', format: 'Misión corta', cycles: ['croissance', 'transmission'], image: `${S}developer-desk.jpg` },
        { quote: '¿Construir, comprar o aliarse?', decision: 'El arbitraje correcto, con el coste de salida.', deliverable: 'Análisis con criterios ponderados, reversibilidad incluida.', format: 'Misión corta', cycles: ['lancement', 'croissance'], image: `${S}loft-office.jpg` },
        { quote: 'Nuestros equipos usan la IA sin marco.', decision: 'Herramientas autorizadas, datos admitidos, alojamiento.', deliverable: 'Política de uso, inventario, arbitraje de herramientas.', format: 'Misión corta', cycles: ['croissance'], image: `${S}laptop-phone.jpg` },
        { quote: 'Ya no tenemos director técnico.', decision: 'Interinidad, contratación o dirección a tiempo compartido.', deliverable: 'Dirección técnica interina con traspaso documentado.', format: 'Misión fraccionada', cycles: ['restructuration'], image: `${S}open-office.jpg` },
        { quote: '¿Dónde están nuestros datos y quién puede acceder a ellos?', decision: 'Alojamiento UE o Suiza, cláusulas de reversibilidad, exposición a leyes extraterritoriales.', deliverable: 'Revisión del alojamiento y plan de reversibilidad.', format: 'Misión corta', cycles: ['lancement', 'croissance'], image: `${S}network-cables.jpg` },
      ],
    },
    services: {
      title: 'Nuestros servicios',
      items: [
        'Auditar la arquitectura y la deuda',
        'Arbitrar entre construir, comprar y aliarse',
        'Establecer el registro de dependencias críticas',
        'Encuadrar el uso de la IA',
        'Asegurar la dirección técnica interina',
        'Preparar el activo tecnológico para la mirada de un tercero (inversor, comprador)',
      ],
    },
    framework: {
      name: 'La Prueba de reversibilidad a 90 días',
      intro: 'Para cada componente crítico (proveedor de alojamiento, editor, prestador, modelo de IA, desarrollador clave), una pregunta: si desaparece mañana, ¿en cuántos días, a qué coste y con qué pérdida de datos vuelve a arrancar el servicio?',
      axes: [
        { label: 'Reversible en una semana', desc: 'Alternativa identificada, datos exportables, cambio documentado.' },
        { label: 'Reversible en un mes', desc: 'Alternativa conocida, migración por planificar, dependencia funcional limitada.' },
        { label: 'Reversible en 90 días', desc: 'Sustitución posible pero costosa: rediseño parcial, renegociación, contratación.' },
        { label: 'No reversible', desc: 'Sin alternativa creíble a día de hoy. El componente condiciona la continuidad del servicio.' },
      ],
      deliverable: 'Mapa de los diez componentes más críticos y plan de tratamiento de los no reversibles.',
    },
    bySize: {
      title: 'Según su tamaño',
      items: [
        { label: 'Pyme · de 10 a 50 M€', desc: 'Una pila construida por acumulación, algunos desarrolladores, proveedores. Prioridad: documentación mínima y reversibilidad de los tres componentes críticos.' },
        { label: 'Empresa mediana · de 50 a 300 M€', desc: 'Sistema de información heredado, varios editores, una dirección de sistemas. Prioridad: una trayectoria de modernización arbitrada por el comité, y una gobernanza de datos entre actividades.' },
      ],
    },
    bySector: {
      title: 'Según su sector',
      items: [
        { cluster: 'Finance & Capital', desc: 'Terceros TIC críticos y externalización cloud (DORA); arquitectura de resiliencia.' },
        { cluster: 'Salud y Ciencias de la vida', desc: 'Alojamiento HDS en Francia; separación de los datos de salud; IA en un producto sanitario (Anexo I, 2 de agosto de 2028).' },
        { cluster: 'Industria, Energía e Infraestructuras', desc: 'IT/OT, telemantenimiento, propiedad de los datos industriales.' },
        { cluster: 'Comercio, Servicios y Experiencia de cliente', desc: 'Unificar los datos de clientes entre canales sin depender de un único CRM; personalización por IA y RGPD.' },
        { cluster: 'Tech, Innovación y Sector público', desc: 'Auditoría antes de inversión o venta; licencias copyleft en el núcleo del producto; alojamiento impuesto por la contratación pública.' },
      ],
    },
    scenario: {
      tag: 'Escenario tipo · ilustrativo',
      text: 'Editor de software para clínicas, 18 M€ de facturación, 14 desarrolladores de los cuales 6 externos. Un fondo se interesa por la empresa. En cuatro semanas: dependencias y deuda cartografiadas, tres componentes no reversibles identificados, plan de remediación a seis meses cuantificado. El directivo lo presenta al fondo antes de que este lo descubra por su cuenta.',
    },
    ai: {
      title: 'Lo que una herramienta de IA no hará por usted',
      text: 'Un asistente de código produce código. No responde de la elección de arquitectura, no sabe lo que autoriza su contrato de alojamiento, y no ocupará el puesto de director técnico ante su consejo.',
    },
    diagnostic: {
      title: '¿Dónde está? Cinco preguntas.',
      intro: 'Responda sí o no. El resultado le sitúa en tres niveles y nombra el siguiente paso.',
      questions: [
        { q: '¿Está su arquitectura documentada y actualizada (esquema, flujos de datos)?' },
        { q: '¿Puede nombrar sus diez componentes críticos y el plazo de sustitución de cada uno?' },
        { q: '¿Entiende más de una persona cada componente crítico?' },
        { q: '¿Están archivadas las cesiones de derechos y licencias de todo el código entregado por proveedores?' },
        { q: '¿Sabe dónde están alojados sus datos y quién puede acceder a ellos?' },
      ],
      levels: [
        { min: 0, label: 'Por encuadrar', desc: 'El sistema funciona, pero su conocimiento descansa en pocas personas y su documentación no está al día.', nextAction: 'Establecer el registro de dependencias y pasar los tres componentes más críticos por la Prueba de reversibilidad.' },
        { min: 3, label: 'En construcción', desc: 'Arquitectura y datos son conocidos. Quedan ángulos muertos: cadena de derechos, suplentes de las personas clave, plazos de sustitución.', nextAction: 'Completar el registro (derechos, licencias, suplentes) y cuantificar la deuda por dominio.' },
        { min: 5, label: 'Dominado', desc: 'El activo tecnológico está documentado, es reversible y legible por un tercero. El tema pasa a ser la trayectoria: modernización, IA, gobernanza de datos.', nextAction: 'Arbitrar la trayectoria a doce meses en comité y preparar el activo para la mirada de un inversor o de un comprador.' },
      ],
      privacy: PRIVACY,
    },
    perspectives: {
      title: 'Perspectivas',
      items: [
        { title: 'Qué hace que un activo tech sea realmente certificable', href: '/blog/actif-tech-certifiable', kind: 'article' },
      ],
    },
    cta: { primary: 'Auditar su arquitectura', secondary: 'Someter a la prueba sus diez componentes críticos', subject: 'tech' },
  },

  talentOrganization: {
    key: 'talentOrganization', path: '/advisory/talent-organization',
    image: '/images/advisory/talent.jpg',
    imageAlt: 'Sala de consejo vacía, lista para la próxima sesión',
    meta: {
      title: 'Sucesión, gobernanza, equipo directivo | Aegryn',
      description: 'Medir la dependencia del directivo, estructurar el comité de dirección, construir un plan de sucesión, retener los perfiles clave. Pymes y empresas medianas de 10 a 300 M€. Suiza y Europa.',
      keywords: ['plan de sucesión pyme', 'dependencia del fundador', 'gobernanza comité de dirección', 'retención perfiles clave', 'transmisión empresa familiar', 'organización empresa mediana'],
    },
    eyebrow: 'Talento y Organización',
    h1: 'El valor de una organización se mide por lo que sabe hacer sin su directivo.',
    subtitle: 'Sucesión, gobernanza, retención, estructuración de la dirección: las decisiones de organización son las que más pesan con el tiempo y las que más a menudo se aplazan.',
    scope: [
      { label: 'Búsqueda y colocación: Reclutar', href: '/talent' },
      { label: 'Elección del rumbo: Estrategia', href: '/advisory/strategy' },
      { label: 'Equipo de un objetivo: M&A', href: '/advisory/ma' },
    ],
    observation: {
      title: 'Lo que observamos',
      cards: [
        { value: '40 %', label: 'de los directivos franceses de micro, pequeñas, medianas e intermedias empresas cuentan con transmitir en cinco años, es decir, 370 000 empresas', source: 'Bpifrance Le Lab, 27 nov. 2025' },
        { value: '130 000', label: 'transmisiones efectivas previstas al ritmo actual', source: 'Bpifrance Le Lab, 27 nov. 2025' },
        { value: '47 %', label: 'de los directivos de empresas familiares de 60 a 69 años no han formalizado un plan de sucesión', source: 'Bpifrance Le Lab, empresas familiares' },
      ],
      paragraphs: [
        'En Francia, el 40 % de los directivos de micro, pequeñas, medianas e intermedias empresas cuenta con transmitir su empresa en cinco años, un potencial de 370 000 empresas. Al ritmo actual, 130 000 cambiarían realmente de manos. Entre los directivos de pymes y empresas medianas familiares de 60 a 69 años, el 47 % no ha formalizado un plan de sucesión.',
      ],
      change: 'La brecha entre la intención y el acto tiene menos que ver con el mercado que con la preparación. Una organización que depende de una persona se transmite mal, se financia mal y se pilota mal.',
      sources: 'Fuentes: Bpifrance Le Lab, estudio Transmisión y recuperación de empresas (27 de noviembre de 2025) · Bpifrance Le Lab, empresas familiares.',
    },
    outcomes: {
      title: 'Lo que obtiene',
      items: [
        'Una organización que aguanta tres meses sin su directivo.',
        'Perfiles críticos con suplente.',
        'Un plan de sucesión escrito, fechado y compartido.',
      ],
    },
    situations: {
      title: 'Dónde está. Cómo intervenimos.',
      items: [
        { quote: 'Todo pasa por mí.', decision: 'Qué delegar primero, a quién.', deliverable: 'Índice de dependencia y plan de delegación a doce meses.', format: 'Unas semanas', cycles: ['croissance', 'transmission'], image: `${S}meeting-room.jpg` },
        { quote: 'Mi equipo directivo todavía no es un equipo.', decision: 'Roles, ritmos de decisión, delegaciones.', deliverable: 'Carta de gobernanza del comité de dirección.', format: 'Unas semanas', cycles: ['croissance'], image: `${S}discussion-hands.jpg` },
        { quote: 'Un perfil clave quiere irse.', decision: 'Retener, sustituir o duplicar.', deliverable: 'Plan de retención, suplente identificado, transferencia de conocimiento documentada.', format: 'Misión corta', cycles: ['restructuration'], image: `${S}laptop-hands.jpg` },
        { quote: 'Debo contratar a un directivo (técnico, financiero, operativo, país).', decision: 'El perfil correcto, en la gobernanza correcta.', deliverable: 'Definición del puesto y criterios de integración, luego relevo hacia Reclutar.', format: 'Misión corta', cycles: ['croissance'], image: `${S}handshake.jpg` },
        { quote: 'Pienso transmitir en dos a cinco años.', decision: 'Familia, interno o comprador externo.', deliverable: 'Plan de sucesión y gobernanza de transición.', format: 'De uno a dos meses', cycles: ['transmission'], image: `${S}plan-writing.jpg` },
        { quote: 'Llega una adquisición, dos culturas van a encontrarse.', decision: 'Quién se queda, quién dirige, cómo organizarse.', deliverable: 'Evaluación del equipo objetivo, organización objetivo, plan de retención.', format: 'Unas semanas', cycles: ['acquisition'], image: `${S}office-corridor.jpg` },
      ],
    },
    services: {
      title: 'Nuestros servicios',
      items: [
        'Medir la dependencia del directivo y de los perfiles clave',
        'Estructurar el comité de dirección y sus delegaciones',
        'Construir el plan de sucesión',
        'Asegurar la retención de los perfiles críticos',
        'Documentar el saber hacer crítico',
        'Preparar la contratación de un directivo',
      ],
    },
    framework: {
      name: 'El Índice de dependencia',
      intro: 'Para cada persona crítica, cuatro ejes, una puntuación, un tiempo de sustitución en semanas y un umbral de alerta.',
      axes: [
        { label: 'Decisiones', desc: 'Quién decide.' },
        { label: 'Relaciones', desc: 'Quién tiene los clientes y socios clave.' },
        { label: 'Saberes', desc: 'Quién es el único que sabe.' },
        { label: 'Contratos', desc: 'Qué cláusulas están ligadas a un nombre.' },
      ],
      deliverable: 'Un mapa de las personas cuya salida pondría a la organización en dificultades, y lo que cada salida costaría en continuidad.',
    },
    bySize: {
      title: 'Según su tamaño',
      items: [
        { label: 'Pyme · de 10 a 50 M€', desc: 'El directivo es a menudo primer comercial y primer decisor de producto. Prioridad: delegar las relaciones con los clientes clave y documentar los diez procesos críticos.' },
        { label: 'Empresa mediana · de 50 a 300 M€', desc: 'Gobernanza familiar o accionistas. Prioridad: plan de sucesión del director general y de sus N-1, comité de nombramientos, papel de la familia.' },
      ],
    },
    bySector: {
      title: 'Según su sector',
      items: [
        { cluster: 'Finance & Capital', desc: 'Funciones sujetas a autorización o notificación al regulador, cuya salida del titular desencadena trámites.' },
        { cluster: 'Salud y Ciencias de la vida', desc: 'Responsable del cumplimiento normativo (PRRC, MDR) y responsable de calidad: funciones reguladas con sucesión preparada.' },
        { cluster: 'Industria, Energía e Infraestructuras', desc: 'Saber hacer tácito de los veteranos, jubilaciones en racimo, empresas familiares.' },
        { cluster: 'Comercio, Servicios y Experiencia de cliente', desc: 'Responsables de red, cuentas clave, retención de los mandos de proximidad.' },
        { cluster: 'Tech, Innovación y Sector público', desc: 'Director técnico único, desarrolladores depositarios de la arquitectura.' },
      ],
    },
    scenario: {
      tag: 'Escenario tipo · ilustrativo',
      text: 'Empresa mediana familiar de 140 M€, directivo de 63 años, dos hijos de los cuales ninguno desea dirigir. En cuatro semanas: Índice de dependencia (siete personas críticas), tres escenarios de sucesión comparados, calendario de transición a veinticuatro meses que el consejo de familia puede decidir.',
    },
    ai: {
      title: 'Lo que una herramienta de IA no hará por usted',
      text: 'Un asistente redacta una ficha de puesto. No mantiene la conversación difícil con el fundador, no arbitra entre dos N-1, y no sabe lo que la familia no dice.',
    },
    diagnostic: {
      title: '¿Dónde está? Cinco preguntas.',
      intro: 'Responda sí o no. El resultado le sitúa en tres niveles y nombra el siguiente paso.',
      questions: [
        { q: '¿Funcionaría su organización con normalidad durante tres meses sin usted?' },
        { q: '¿Tienen sus cinco clientes o socios clave al menos dos interlocutores en su empresa?' },
        { q: '¿Tiene cada función crítica un suplente identificado?' },
        { q: '¿Existe un plan de sucesión escrito para el directivo y sus N-1?' },
        { q: '¿Está el saber hacer crítico documentado en otro lugar que en la cabeza de quienes lo poseen?' },
      ],
      levels: [
        { min: 0, label: 'Por encuadrar', desc: 'La organización descansa en su directivo y en unas pocas personas. Una salida o una ausencia prolongada la pondría en dificultades.', nextAction: 'Medir el Índice de dependencia y delegar primero las relaciones con los clientes clave.' },
        { min: 3, label: 'En construcción', desc: 'Las delegaciones existen y los clientes tienen varios interlocutores. Falta la formalización: suplentes, plan de sucesión escrito, saberes documentados.', nextAction: 'Escribir el plan de sucesión del directivo y de sus N-1, y documentar los diez procesos críticos.' },
        { min: 5, label: 'Dominado', desc: 'La organización aguanta sin su directivo. El tema pasa a ser la transición: calendario, gobernanza, papel de la familia o de los accionistas.', nextAction: 'Encuadrar la gobernanza de transición y preparar el comité de nombramientos.' },
      ],
      privacy: PRIVACY,
    },
    perspectives: { title: 'Perspectivas', items: [] },
    cta: { primary: 'Medir su dependencia', secondary: 'Encuadrar su sucesión', subject: 'advisory' },
  },

  ma: {
    key: 'ma', path: '/advisory/ma',
    image: '/images/advisory/ma.jpg',
    imageAlt: 'Directivo de camino a una reunión de negociación',
    meta: {
      title: 'Adquisición, venta, integración: la consultoría previa a las transacciones | Aegryn',
      description: 'Revisión de los ángulos muertos de un objetivo (código y derechos, cláusulas de cambio de control, cumplimiento, equipos), preparación del vendedor, integración a 100 días. La ejecución financiera corresponde a socios acreditados.',
      keywords: ['consultoría adquisición pyme', 'revisión de objetivo', 'cláusula de cambio de control', 'integración posadquisición', 'plan 100 días', 'build-up', 'preparación del vendedor'],
    },
    eyebrow: 'M&A, Transacciones y PMI',
    h1: 'Una adquisición se gana en la preparación. Se pierde en la integración.',
    subtitle: 'Aegryn mira lo que las auditorías financieras y jurídicas miran poco: el código, los derechos, las cláusulas de cambio de control, los equipos. La ejecución financiera se confía a socios acreditados.',
    scope: [
      { label: 'Profundidad de auditoría: Riesgos y Cumplimiento', href: '/advisory/risk-compliance' },
      { label: 'Profundidad de auditoría: Tecnología', href: '/advisory/technology' },
      { label: 'Equipos: Talento y Organización', href: '/advisory/talent-organization' },
    ],
    observation: {
      title: 'Lo que observamos',
      cards: [
        { value: '48 a 66 %', label: 'tasa de fracaso de las operaciones de M&A según los estudios compilados, sobre todo en la integración', source: 'Wiley Encyclopedia of Management; Kotter et al.' },
        { value: '208', label: 'operaciones de M&A de pymes suizas en 2025, +16 %; +28 % en servicios informáticos y software', source: 'SECO, kmu.admin.ch' },
        { value: '23 %', label: 'de los vendedores potenciales franceses señalan una falta de ofertas de compra', source: 'Bpifrance Le Lab, 2025' },
      ],
      paragraphs: [
        'Los estudios compilados sitúan el fracaso de las operaciones de M&A entre el 48 y el 66 % según la definición adoptada, y las observaciones de Kotter y sus coautores sitúan lo esencial de los fracasos en la integración. En Suiza, las operaciones de M&A de pymes repuntaron un 16 % en 2025 (208 operaciones), con +28 % en servicios informáticos y software. En Francia, el 23 % de los vendedores potenciales señala una falta de ofertas de compra.',
      ],
      change: 'El mercado tiene vendedores y compradores; lo que falta es la preparación que hace culminar la operación y cumplir sus promesas.',
      sources: 'Fuentes: Wiley Encyclopedia of Management; Kotter, Akhtar, Gupta, Change · SECO · Bpifrance Le Lab (2025).',
    },
    outcomes: {
      title: 'Lo que obtiene',
      items: [
        'Un objetivo examinado desde cuatro ángulos que la due diligence clásica cubre poco.',
        'Puntos de negociación cuantificados en lugar de intuiciones.',
        'Un plan de integración listo antes de la firma.',
      ],
    },
    situations: {
      title: 'Dónde está. Cómo intervenimos.',
      items: [
        { quote: 'Hemos identificado un objetivo.', decision: 'Qué mirar antes de la carta de intenciones.', deliverable: 'Revisión de los cuatro ángulos muertos, con tratamiento propuesto para cada uno: precio, garantía, condición suspensiva.', format: 'Unas semanas', cycles: ['acquisition'], image: `${S}planning-laptops.jpg` },
        { quote: 'Nos han abordado para comprarnos.', decision: 'Hasta dónde prepararse antes de responder.', deliverable: 'Diagnóstico de preparación del vendedor y posición negociadora.', format: 'Unas semanas', cycles: ['transmission'], image: `${S}dashboard-laptop.jpg` },
        { quote: 'Queremos hacer dos o tres adquisiciones en tres años.', decision: 'Tesis, criterios, proceso.', deliverable: 'Programa de build-up reproducible: criterios, revisión estándar, playbook de integración.', format: 'De uno a dos meses', cycles: ['acquisition'], image: `${S}loft-office.jpg` },
        { quote: 'La adquisición está firmada, la integración se atasca.', decision: 'Qué es urgente, qué puede esperar.', deliverable: 'Plan 30 / 60 / 100 días y pilotaje.', format: 'Misión de tres a seis meses', cycles: ['acquisition'], image: `${S}open-office.jpg` },
        { quote: 'Debemos vender una actividad no estratégica.', decision: 'Perímetro y separación de los sistemas.', deliverable: 'Plan de separación: perímetro, sistemas, personas, acuerdos de transición.', format: 'De uno a dos meses', cycles: ['restructuration'], image: `${S}industrial-engineer.jpg` },
        { quote: 'Mi fondo debe validar un objetivo tecnológico.', decision: 'Invertir, negociar o renunciar.', deliverable: 'Revisión técnica y organizativa independiente, puntuada por ángulo muerto.', format: 'Unas semanas', cycles: ['acquisition'], image: `${S}server-room-walk.jpg` },
      ],
    },
    services: {
      title: 'Nuestros servicios',
      items: [
        'Formular la tesis de adquisición y los criterios de objetivo',
        'Pasar el objetivo por el tamiz de los cuatro ángulos muertos',
        'Encuadrar los puntos de negociación surgidos de la revisión',
        'Preparar a la organización para ser examinada (lado vendedor)',
        'Pilotar la integración a 100 días',
        'Estructurar un programa de build-up',
      ],
    },
    framework: {
      name: 'La Revisión de los cuatro ángulos muertos',
      intro: 'Cada constatación se clasifica por impacto y probabilidad, y luego se trata: ajuste de precio, garantía específica, condición suspensiva o punto aceptado con conocimiento de causa.',
      axes: [
        { label: 'Código y cadena de derechos', desc: 'Licencias, cesiones de autor, dependencias.' },
        { label: 'Contratos y cambio de control', desc: 'Clientes, proveedores, licencias cedidas.' },
        { label: 'Cumplimiento y seguridad', desc: 'Perímetro regulatorio heredado, incidentes, pruebas disponibles.' },
        { label: 'Personas y dependencias', desc: 'Directivos clave, retención, cultura.' },
      ],
      deliverable: 'Una matriz impacto / probabilidad por ángulo, y para cada constatación el tratamiento propuesto en la negociación.',
    },
    bySize: {
      title: 'Según su tamaño',
      items: [
        { label: 'Pyme · de 10 a 50 M€', desc: 'Compra, MBO o adquisición por un actor de tamaño similar, con pocos asesores alrededor de la mesa. Concentramos la revisión en los cuatro ángulos muertos en unas semanas, junto al abogado y al experto contable.' },
        { label: 'Empresa mediana · de 50 a 300 M€', desc: 'Programa de crecimiento externo, equipo de M&A interno o banco de negocios. Aegryn interviene como socio de revisión técnica, organizativa y de integración.' },
      ],
    },
    bySector: {
      title: 'Según su sector',
      items: [
        { cluster: 'Finance & Capital', desc: 'Adquisición de un actor fintech o insurtech; autorizaciones y aprobaciones de cambio de control; portabilidad de datos; DORA sobre terceros.' },
        { cluster: 'Salud y Ciencias de la vida', desc: 'Continuidad del marcado CE (MDR) y del alojamiento HDS; contratos hospitalarios con cláusula de cambio de control.' },
        { cluster: 'Industria, Energía e Infraestructuras', desc: 'Adquirir competencias digitales; propiedad intelectual en entorno industrial; fundador-desarrollador.' },
        { cluster: 'Comercio, Servicios y Experiencia de cliente', desc: 'Actores digitales para completar una red física; datos de clientes; integración de los equipos.' },
        { cluster: 'Tech, Innovación y Sector público', desc: 'Build-up de software vertical; calidad del ingreso recurrente; cláusulas de cambio de control; copyleft.' },
      ],
    },
    scenario: {
      tag: 'Escenario tipo · ilustrativo',
      text: 'Grupo de servicios de 90 M€ que quiere comprar un editor de 8 M€ de facturación. En tres semanas: dos contratos de clientes importantes contienen una cláusula de cambio de control, una biblioteca bajo licencia copyleft está en el núcleo del producto, el director técnico es el único depositario de la arquitectura. Tres puntos pasan a negociación: garantía específica, condición suspensiva, plan de retención.',
    },
    ai: {
      title: 'Lo que una herramienta de IA no hará por usted',
      text: 'Un asistente lee un contrato de compraventa. No le dirá cuánto vale la cláusula de cambio de control del contrato de su primer cliente, no estará sentado frente al director técnico del objetivo, y no compromete su responsabilidad.',
    },
    complement: {
      title: 'Para ir más lejos',
      text: 'Cuando el expediente lo justifica, la revisión puede apoyarse en la certificación CIFSO 5000, independiente, otorgada sobre cinco dimensiones.',
    },
    diagnostic: {
      title: '¿Dónde está? Cinco preguntas.',
      intro: 'Responda sí o no. El resultado le sitúa en tres niveles y nombra el siguiente paso.',
      questions: [
        { q: '¿Dispone de una tesis escrita de crecimiento externo (criterios de objetivo, presupuesto, calendario)?' },
        { q: '¿Sabe qué cláusulas de cambio de control figuran en sus contratos con clientes clave?' },
        { q: '¿Está documentada la cadena de derechos sobre su código y sus marcas?' },
        { q: '¿Existe un plan de integración a 100 días antes de cualquier firma?' },
        { q: 'Si un comprador le abordara mañana, ¿podría abrir una data room en dos semanas?' },
      ],
      levels: [
        { min: 0, label: 'Por encuadrar', desc: 'La operación se trataría sobre la marcha. Los ángulos muertos (derechos, cláusulas, equipos) los descubriría la otra parte.', nextAction: 'Escribir la tesis o el diagnóstico de preparación, y releer las cláusulas de cambio de control de sus tres primeros contratos.' },
        { min: 3, label: 'En construcción', desc: 'Las bases existen: tesis o preparación, contratos conocidos. Falta la mecánica: cadena de derechos, plan a 100 días, data room lista.', nextAction: 'Documentar la cadena de derechos y redactar el plan de integración antes de la próxima carta de intenciones.' },
        { min: 5, label: 'Dominado', desc: 'Está listo para comprar o para ser examinado. El tema pasa a ser la repetibilidad: programa de build-up, playbook de integración.', nextAction: 'Estructurar el programa de build-up y medir la integración a 100 días en la próxima operación.' },
      ],
      privacy: PRIVACY,
    },
    perspectives: {
      title: 'Perspectivas',
      items: [
        { title: 'Cómo evalúan los compradores de PE un SaaS en 2026', href: '/blog/comment-acquereurs-pe-evaluent-saas-2026', kind: 'article' },
        { title: 'Aegryn Magazine, Issue 02 · The Exit Equation (abril de 2027)', href: '/magazine', kind: 'magazine' },
      ],
    },
    cta: { primary: 'Pasar un objetivo por el tamiz', secondary: 'Preparar una integración', subject: 'advisory' },
  },
}
