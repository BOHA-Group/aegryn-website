/**
 * FRANCHIR content — Español.
 * Traducción de la referencia francesa (content/franchir/fr.ts),
 * especificación del 6 de octubre de 2026. Los escenarios son
 * ilustrativos y se señalan como tales.
 */

import type { CycleContent, FranchirIntro } from './types'

export const FRANCHIR_INTRO_ES: FranchirIntro = {
  meta: {
    title:       'Superar — cada ciclo tiene su decisión | Aegryn',
    description: 'Lanzamiento, crecimiento, pivote, adquisición, transmisión: cinco ciclos en los que una organización de 10 a 300 M€ juega su futuro. Esto es lo que está en juego, y a quién movilizar.',
  },
  eyebrow:   'Superar',
  heroTitle: 'Cada ciclo tiene su decisión. Encuentre la suya.',
  heroSub:   'Lanzamiento, crecimiento, pivote, adquisición, transmisión: cinco ciclos en los que una organización de 10 a 300 M€ juega su futuro. Esto es lo que está en juego, y a quién movilizar.',
  cycles: [
    { slug: 'lancement',       title: 'Lanzamiento y Estructuración',       stake: 'Decisiones poco costosas de tomar ahora, muy costosas de corregir después.' },
    { slug: 'croissance',      title: 'Crecimiento y Escalado',             stake: 'Lo que funcionaba con diez personas se ralentiza con cincuenta.' },
    { slug: 'restructuration', title: 'Reestructuración y Pivote',          stake: 'El modelo, el mercado o la norma han cambiado: decidir rápido.' },
    { slug: 'acquisition',     title: 'Adquisición y Crecimiento externo',  stake: 'Saber lo que se asume, y cómo integrarlo.' },
    { slug: 'transmission',    title: 'Transmisión y Venta',                stake: 'Hacer que la organización resista sin su dirigente.' },
  ],
  overlap: {
    title: '¿Atraviesa dos ciclos a la vez?',
    text:  'Crecer por adquisición, reestructurar antes de transmitir: los ciclos se solapan. Aegryn construye un único perímetro de intervención, con las disciplinas implicadas.',
    examples: [
      { label: 'Crecimiento + Adquisición',         a: 'croissance',      b: 'acquisition' },
      { label: 'Reestructuración + Transmisión',    a: 'restructuration', b: 'transmission' },
    ],
  },
  diagnostic: {
    title: '¿Dónde se encuentra?',
    questions: [
      { q: '¿Su organización tiene menos de 3 años o prepara un nuevo producto o una nueva entidad?', cycle: 'lancement' },
      { q: '¿Su actividad ha más que duplicado su volumen o plantilla recientemente?', cycle: 'croissance' },
      { q: '¿Un cliente importante, un mercado, un incidente o una norma cuestionan su modelo?', cycle: 'restructuration' },
      { q: '¿Estudia la compra de una organización o ha adquirido una en los últimos 18 meses?', cycle: 'acquisition' },
      { q: '¿Piensa ceder el testigo en los próximos cinco años?', cycle: 'transmission' },
    ],
  },
  assetsLink: { text: 'Para medir y certificar el valor de sus activos:', label: 'ver los activos de Aegryn' },
  cta:        { label: 'Intercambiar 30 minutos' },
}

export const FRANCHIR_ES: CycleContent[] = [
  /* ------------------------------------------------------------------ */
  {
    slug: 'lancement',
    path: '/franchir/lancement',
    meta: {
      title:       'Lanzamiento y Estructuración — sentar las bases antes de gastar | Aegryn',
      description: 'Proveedores, tecnologías, propiedad intelectual, cumplimiento, gobernanza: las decisiones de los primeros meses cuestan poco tomarlas y mucho corregirlas.',
    },
    eyebrow:  'Superar · Lanzamiento y Estructuración',
    h1:       'Sentar las bases adecuadas antes de gastar.',
    subtitle: 'Proveedores, tecnologías, propiedad intelectual, cumplimiento, gobernanza: las decisiones de los primeros meses cuestan poco tomarlas y muy caro corregirlas.',
    verbs:    ['Enmarcar', 'Construir', 'Reclutar'],
    constat: {
      text:   'Las obligaciones de transparencia del reglamento europeo de IA (art. 50) se aplican desde el 2 de agosto de 2026, con sanciones de hasta 15 M€ o el 3 % de la facturación mundial para obligaciones distintas de las prácticas prohibidas. Una organización que lanza un producto con IA está concernida desde el primer día.',
      source: 'Reglamento (UE) de IA.',
    },
    situations: {
      title: 'Dónde está. Cómo intervenimos.',
      items: [
        { quote: 'Mi proveedor entregó el código, pero no revisé el contrato.', decision: '¿A quién pertenecen el código y los datos? ¿Qué pasa si el proveedor se va?', metiers: ['technologie'], deliverable: 'Nota de posición sobre propiedad y reversibilidad, con las cláusulas a corregir' },
        { quote: 'Queremos ir rápido, el cumplimiento lo veremos después.', decision: '¿Qué obligaciones ya se aplican, cuáles pueden esperar?', metiers: ['conformite'], deliverable: 'Mapa de exposición: aplica ahora / pronto / no concierne' },
        { quote: 'Dudamos entre construir, comprar o alquilar.', decision: '¿Qué perímetro construir, cuál comprar o alquilar?', metiers: ['strategie', 'construire'], deliverable: 'Arbitraje escrito, con aquello a lo que hay que renunciar' },
        { quote: 'Mi socio y yo no hemos definido quién decide.', decision: '¿Quién decide qué, quién posee qué?', metiers: ['talent'], deliverable: 'Marco de decisión de dos páginas, listo para firmar' },
        { quote: 'Necesito un primer responsable técnico.', decision: 'Perfil, estatuto, remuneración, rol frente a los proveedores', metiers: ['recruter'], deliverable: 'Ficha de puesto, bolsa de perfiles' },
        { quote: 'Nuestro grupo crea una nueva actividad a aislar.', decision: '¿Qué perímetro aislar del sistema de información del grupo?', metiers: ['technologie', 'strategie'], deliverable: 'Plan de aislamiento y hoja de ruta de los primeros 6 meses' },
      ],
    },
    metiers: { mobilized: ['technologie', 'conformite', 'strategie', 'construire'], available: ['talent', 'recruter'] },
    bySize: {
      title: 'Según el tamaño',
      items: [
        { label: 'PYME', desc: 'Pocos recursos, arbitrajes en pocos días, un solo interlocutor en Aegryn.' },
        { label: 'ETI', desc: 'Nueva entidad, spin-off: aislar la nueva actividad del sistema de información y la gobernanza del grupo.' },
      ],
    },
    bySector: {
      title: 'Según el sector',
      items: [
        { cluster: 'Finanzas y Capital',                          desc: 'Requisitos de explotación y de externalización de sistemas desde la concepción.' },
        { cluster: 'Salud y Ciencias de la vida',                 desc: 'Datos sensibles tratados desde el primer usuario.' },
        { cluster: 'Industria, Energía e Infraestructuras',       desc: 'Software embarcado, mantenimiento durante décadas.' },
        { cluster: 'Comercio, Servicios y Experiencia de cliente', desc: 'Consentimiento y datos de clientes.' },
        { cluster: 'Tech, Innovación y Sector público',           desc: 'Reversibilidad de componentes y proveedores.' },
      ],
    },
    scenario: {
      tag:  'Escenario ilustrativo',
      text: 'Un editor de 3 M€ de facturación, cuyo producto desarrolla un proveedor externo, prepara su primera gran cuenta. La prueba de reversibilidad muestra que el repositorio de código está a nombre del proveedor. La corrección se resuelve en pocas semanas antes de la firma — y costaría mucho más después.',
    },
    ai: {
      title: 'Lo que una herramienta de IA generalista no hará por usted',
      text:  'Leer su contrato con el proveedor en su contexto, arbitrar entre dos socios y responder de la decisión ante su consejo o sus financiadores.',
    },
    diagnostic: {
      title: 'Autodiagnóstico',
      intro: 'Cinco preguntas de sí/no para situar sus bases.',
      questions: [
        { q: '¿El código y los datos de su producto están a nombre de su organización?' },
        { q: '¿Podría cambiar de proveedor principal en menos de 90 días?' },
        { q: '¿Ha listado las obligaciones reglamentarias que se aplican a su producto?' },
        { q: '¿Están escritos los roles y poderes de decisión entre socios?' },
        { q: '¿Alguien en interno comprende la arquitectura de principio a fin?' },
      ],
      levels: [
        { min: 4, label: 'Bases sentadas', desc: 'Sus bases están sentadas. Un intercambio de 30 minutos puede confirmar los puntos restantes.', nextAction: 'Intercambiar 30 minutos' },
        { min: 2, label: 'Por asegurar',   desc: 'Varios puntos por asegurar antes de crecer.', nextAction: 'Intercambiar 30 minutos' },
        { min: 0, label: 'Fundamentos',    desc: 'Prioridad a los fundamentos.', nextAction: 'Intercambiar 30 minutos' },
      ],
      privacy: 'No se registra ningún dato: el diagnóstico se calcula en su navegador.',
    },
    nextLabel: 'Ciclo siguiente',
    next:      [{ label: 'Crecimiento y Escalado', slug: 'croissance' }],
  },

  /* ------------------------------------------------------------------ */
  {
    slug: 'croissance',
    path: '/franchir/croissance',
    meta: {
      title:       'Crecimiento y Escalado — crecer sin romper lo que funciona | Aegryn',
      description: 'A partir de cierto volumen, lo que funcionaba con diez personas se ralentiza con cincuenta: herramientas, decisiones, reglas, dependencias.',
    },
    eyebrow:  'Superar · Crecimiento y Escalado',
    h1:       'Crecer sin romper lo que funciona.',
    subtitle: 'A partir de cierto volumen, lo que funcionaba con diez personas se ralentiza con cincuenta: herramientas, decisiones, reglas, dependencias.',
    verbs:    ['Estructurar', 'Asegurar', 'Reforzar'],
    constat: {
      text:   'En Suiza, el uso de la IA por las pymes pasó del 22 % al 34 % entre 2024 y 2025, pero solo el 34 % tiene reglas sobre los datos introducidos en estas herramientas (23 % entre las de menos de 10 empleados). El barómetro de las pymes 2026 está en −7,3, su nivel más bajo desde 2021. El crecimiento ocurre en un contexto tenso, con prácticas aún poco enmarcadas.',
      source: 'SECO, Portal PME.',
    },
    situations: {
      title: 'Dónde está. Cómo intervenimos.',
      items: [
        { quote: 'Mis equipos usan la IA como quieren.', decision: '¿Qué reglas, qué datos, qué herramientas autorizadas?', metiers: ['conformite'], deliverable: 'Carta de uso en tres reglas, plan de despliegue' },
        { quote: 'Un gran cliente me pide garantías de seguridad.', decision: '¿Qué nivel de prueba, a qué coste?', metiers: ['conformite', 'technologie'], deliverable: 'Mapa de exposición y plan de actualización priorizado' },
        { quote: 'Todo sigue pasando por mí.', decision: '¿Qué decisiones delegar, a quién, con qué límites?', metiers: ['talent'], deliverable: 'Índice de dependencia y matriz de delegación' },
        { quote: 'Nuestra herramienta actual no soportará el doble de volumen.', decision: '¿Reparar, rehacer o reemplazar?', metiers: ['technologie'], deliverable: 'Prueba de reversibilidad y arbitraje cuantificado' },
        { quote: 'Necesito un director financiero u operativo.', decision: 'Perfil, momento del reclutamiento, rol frente al dirigente', metiers: ['recruter'], deliverable: 'Ficha de puesto, bolsa, parrilla de entrevistas' },
        { quote: 'Debo abrir un segundo mercado o una segunda filial.', decision: '¿Qué ritmo, qué prioridades, qué renuncia?', metiers: ['strategie'], deliverable: 'Parrilla de las cuatro pruebas aplicada a las opciones' },
      ],
    },
    metiers: { mobilized: ['conformite', 'technologie', 'talent', 'recruter'], available: ['strategie', 'ma', 'construire'] },
    bySize: {
      title: 'Según el tamaño',
      items: [
        { label: 'PYME', desc: 'Fijar tres reglas simples en lugar de un marco pesado; primer nivel de delegación.' },
        { label: 'ETI', desc: 'Coordinar varios sitios o filiales bajo una misma política; comité de dirección estructurado.' },
      ],
    },
    bySector: {
      title: 'Según el sector',
      items: [
        { cluster: 'Finanzas y Capital',                          desc: 'Marcos de externalización y de resiliencia operativa.' },
        { cluster: 'Salud y Ciencias de la vida',                 desc: 'Datos de pacientes, trazabilidad.' },
        { cluster: 'Industria, Energía e Infraestructuras',       desc: 'Seguridad de sistemas industriales, obligaciones de operadores críticos.' },
        { cluster: 'Comercio, Servicios y Experiencia de cliente', desc: 'Picos de actividad, datos de clientes.' },
        { cluster: 'Tech, Innovación y Sector público',           desc: 'Exigencias crecientes de los clientes principales.' },
      ],
    },
    scenario: {
      tag:  'Escenario ilustrativo',
      text: 'Un editor de 25 M€ cuyos clientes son energéticas recibe una petición de medidas de seguridad antes de la renovación. El mapa de exposición distingue las obligaciones realmente aplicables de los temores generales y ordena los trabajos en doce meses.',
    },
    ai: {
      title: 'Lo que una herramienta de IA generalista no hará por usted',
      text:  'Decidir qué sigue centralizado, negociar con una gran cuenta lo que puede garantizar realmente, convencer a sus equipos de aplicar una regla.',
    },
    diagnostic: {
      title: 'Autodiagnóstico',
      intro: 'Cinco preguntas para situar su capacidad de crecer.',
      questions: [
        { q: '¿Las decisiones corrientes siguen pasando mayoritariamente por el dirigente?', goodIf: 'no' },
        { q: '¿Tiene una regla escrita sobre los datos introducidos en herramientas de IA?' },
        { q: '¿Un cliente importante le ha pedido garantías que le cuesta documentar?', goodIf: 'no' },
        { q: '¿Su sistema principal puede absorber el doble de volumen sin refundición?' },
        { q: '¿Su comité de dirección cuenta con las funciones necesarias para el tamaño que busca?' },
      ],
      levels: [
        { min: 4, label: 'Ritmo sostenido',      desc: 'Su organización sostiene su ritmo de crecimiento: un intercambio de 30 minutos puede confirmar los puntos restantes.', nextAction: 'Intercambiar 30 minutos' },
        { min: 2, label: 'Por estructurar',      desc: 'El crecimiento aún se apoya en hábitos informales: varios puntos por estructurar.', nextAction: 'Intercambiar 30 minutos' },
        { min: 0, label: 'Estructura necesaria', desc: 'Su organización necesita estructura para sostener su crecimiento.', nextAction: 'Intercambiar 30 minutos' },
      ],
      privacy: 'No se registra ningún dato: el diagnóstico se calcula en su navegador.',
    },
    nextLabel: 'Ciclo siguiente',
    next:      [
      { label: 'Reestructuración y Pivote',         slug: 'restructuration' },
      { label: 'Adquisición y Crecimiento externo', slug: 'acquisition' },
    ],
  },

  /* ------------------------------------------------------------------ */
  {
    slug: 'restructuration',
    path: '/franchir/restructuration',
    meta: {
      title:       'Reestructuración y Pivote — cambiar de rumbo sin perder el control | Aegryn',
      description: 'Pérdida de un cliente importante, incidente, requerimiento reglamentario, mercado que gira: las primeras decisiones son las más pesadas.',
    },
    eyebrow:  'Superar · Reestructuración y Pivote',
    h1:       'Cambiar de rumbo sin perder el control.',
    subtitle: 'Pérdida de un cliente importante, incidente, requerimiento reglamentario, mercado que gira: las primeras decisiones son las más pesadas.',
    verbs:    ['Arbitrar', 'Estabilizar', 'Pivotar'],
    constat: {
      text:   'El Banque de France registra 70 605 quiebras de empresas en los doce meses a fin de julio de 2026. En Suiza, los operadores de infraestructuras críticas deben notificar un ciberataque al NCSC en 24 horas desde el 1 de abril de 2025, bajo pena de multa de hasta 100 000 CHF desde el 1 de octubre de 2025.',
      source: 'Banque de France; NCSC.',
    },
    situations: {
      title: 'Dónde está. Cómo intervenimos.',
      items: [
        { quote: 'Un cliente representa una parte importante de mi facturación y se va.', decision: '¿Qué prioridades a 90 días, qué tesorería proteger?', metiers: ['strategie'], deliverable: 'Plan 30/60/90 días presentable al consejo y al banco' },
        { quote: 'Hemos sufrido un incidente. ¿Qué debemos declarar?', decision: '¿A quién notificar, en qué plazo, con qué pruebas?', metiers: ['conformite'], deliverable: 'Nota de posición y secuencia de notificación' },
        { quote: 'Mi mercado gira con la IA.', decision: '¿Qué pivote, con qué activos existentes?', metiers: ['strategie', 'technologie'], deliverable: 'Opciones de pivote comparadas en la parrilla de las cuatro pruebas' },
        { quote: 'Hay que ceder una actividad para resistir.', decision: '¿Qué perímetro aislar, qué sistemas compartidos?', metiers: ['ma'], deliverable: 'Perímetro de aislamiento, lista de dependencias' },
        { quote: 'Debo reducir costes sin romper la ejecución.', decision: '¿Qué costes, qué plazos, qué riesgos sociales?', metiers: ['talent'], deliverable: 'Plan de reorganización y riesgos de salida de perfiles clave' },
        { quote: 'Necesito un dirigente de transición.', decision: 'Perfil, mandato, duración', metiers: ['recruter'], deliverable: 'Ficha de misión y perfiles preseleccionados' },
      ],
    },
    metiers: { mobilized: ['strategie', 'conformite', 'recruter'], available: ['technologie', 'talent', 'ma', 'construire'] },
    bySize: {
      title: 'Según el tamaño',
      items: [
        { label: 'PYME', desc: 'Decisiones concentradas en una persona, marco de 30 días.' },
        { label: 'ETI', desc: 'Coordinación del consejo de administración, financiadores y filiales.' },
      ],
    },
    bySector: {
      title: 'Según el sector',
      items: [
        { cluster: 'Finanzas y Capital',                          desc: 'Exigencias de las autoridades de supervisión.' },
        { cluster: 'Salud y Ciencias de la vida',                 desc: 'Continuidad de la atención y de las autorizaciones.' },
        { cluster: 'Industria, Energía e Infraestructuras',       desc: 'Continuidad de producción y obligaciones de notificación.' },
        { cluster: 'Comercio, Servicios y Experiencia de cliente', desc: 'Tesorería y estacionalidad.' },
        { cluster: 'Tech, Innovación y Sector público',           desc: 'Compromisos contractuales de nivel de servicio.' },
      ],
    },
    scenario: {
      tag:  'Escenario ilustrativo',
      text: 'Una empresa de servicios B2B de 40 M€ pierde un cliente que representa un tercio de su facturación. En diez días: mapa de costes evitables, recentrado de la oferta, punto con el banco. El plan 30/60/90 días se presenta al consejo.',
    },
    ai: {
      title: 'Lo que una herramienta de IA generalista no hará por usted',
      text:  'Elegir qué sacrificar, hablar con su banco y sus equipos, responder de la decisión en situación de urgencia.',
    },
    diagnostic: {
      title: 'Autodiagnóstico',
      intro: 'Cinco preguntas para situar su exposición.',
      questions: [
        { q: '¿Un cliente o proveedor representa una parte crítica de su actividad?', goodIf: 'no' },
        { q: '¿Un evento (incidente, requerimiento, pérdida de cliente) impone una decisión en 30 días?', goodIf: 'no' },
        { q: '¿Su tesorería está proyectada a 90 días?' },
        { q: '¿Sabe qué obligaciones de declaración se aplican a su organización?' },
        { q: '¿Dispone de un plan escrito en caso de salida de una persona clave?' },
      ],
      levels: [
        { min: 4, label: 'Preparado',        desc: 'Su organización está preparada para los giros.', nextAction: 'Intercambiar 30 minutos' },
        { min: 2, label: 'Fragilidades',     desc: 'Puntos de fragilidad por tratar antes de que se vuelvan urgentes.', nextAction: 'Intercambiar 30 minutos' },
        { min: 0, label: 'Por estabilizar',  desc: 'Varias señales exigen una decisión rápida: prioridad a la estabilización.', nextAction: 'Intercambiar 30 minutos' },
      ],
      privacy: 'No se registra ningún dato: el diagnóstico se calcula en su navegador.',
    },
    nextLabel: 'Ciclo siguiente',
    next:      [
      { label: 'Adquisición y Crecimiento externo', slug: 'acquisition' },
      { label: 'Transmisión y Venta',             slug: 'transmission' },
    ],
    urgency: true,
  },

  /* ------------------------------------------------------------------ */
  {
    slug: 'acquisition',
    path: '/franchir/acquisition',
    meta: {
      title:       'Adquisición y Crecimiento externo — comprar sabiendo lo que asume | Aegryn',
      description: 'Una adquisición se juega tanto en la integración como en el precio: cuatro ángulos muertos, un plan de integración, compromisos de retención.',
    },
    eyebrow:  'Superar · Adquisición y Crecimiento externo',
    h1:       'Comprar sabiendo lo que asume.',
    subtitle: 'Una adquisición se juega tanto en la integración como en el precio.',
    verbs:    ['Evaluar', 'Integrar', 'Retener'],
    constat: {
      text:   'Los estudios compilados en la Wiley Encyclopedia of Management sitúan el fracaso de las operaciones de fusión-adquisición entre el 48 % y el 66 %, con causas recurrentes en la sinergia sobreestimada, la ausencia de plan de integración y un ritmo demasiado lento. En Suiza, las operaciones de pymes alcanzaron 208 transacciones en 2025 (+16 %), con un +28 % en servicios informáticos y software.',
      source: 'Wiley Encyclopedia of Management; SECO.',
    },
    situations: {
      title: 'Dónde está. Cómo intervenimos.',
      items: [
        { quote: 'Hemos encontrado un objetivo. ¿Qué mirar más allá de las cuentas?', decision: '¿Qué puntos verificar antes de comprometerse?', metiers: ['ma'], deliverable: 'Revisión de los cuatro ángulos muertos, con las condiciones a negociar' },
        { quote: '¿El código y los sistemas del objetivo están sanos?', decision: 'Dependencias, licencias, reversibilidad', metiers: ['technologie'], deliverable: 'Informe técnico y coste estimado de actualización' },
        { quote: '¿Retendremos a sus equipos clave?', decision: 'A quién retener, con qué compromisos?', metiers: ['talent'], deliverable: 'Índice de dependencia del objetivo, plan de retención' },
        { quote: '¿Cómo integrar sin bloquear la actividad?', decision: 'Secuencia de los primeros 100 días', metiers: ['ma', 'technologie'], deliverable: 'Plan de integración por hitos' },
        { quote: '¿Esta adquisición es coherente con nuestra estrategia?', decision: 'Tesis, prioridades, renuncias', metiers: ['strategie'], deliverable: 'Parrilla de las cuatro pruebas aplicada al objetivo' },
        { quote: '¿El objetivo cumple las normas que nos comprometerán mañana?', decision: '¿Qué obligaciones asumimos?', metiers: ['conformite'], deliverable: 'Mapa de exposición del objetivo' },
      ],
    },
    metiers: { mobilized: ['ma', 'technologie', 'strategie'], available: ['conformite', 'talent', 'recruter'] },
    bySize: {
      title: 'Según el tamaño',
      items: [
        { label: 'PYME', desc: 'Una adquisición puede pesar un cuarto de la actividad; la integración reposa en pocas personas.' },
        { label: 'ETI', desc: 'Programa de adquisiciones sucesivas, integración por sistematizar.' },
      ],
    },
    bySector: {
      title: 'Según el sector',
      items: [
        { cluster: 'Finanzas y Capital',                          desc: 'Licencias y autorizaciones por transferir.' },
        { cluster: 'Salud y Ciencias de la vida',                 desc: 'Cumplimiento de los productos adquiridos.' },
        { cluster: 'Industria, Energía e Infraestructuras',       desc: 'Sitios, cadenas de suministro, activos pesados.' },
        { cluster: 'Comercio, Servicios y Experiencia de cliente', desc: 'Bases de clientes y contratos.' },
        { cluster: 'Tech, Innovación y Sector público',           desc: 'Propiedad y mantenibilidad del código.' },
      ],
    },
    scenario: {
      tag:  'Escenario ilustrativo',
      text: 'Un grupo de servicios de 90 M€ considera comprar un editor de 8 M€. La revisión de ángulos muertos revela la dependencia de dos desarrolladores y un componente bajo licencia restrictiva. El precio no cambia; se añaden al acuerdo condiciones de retención y un plan de sustitución.',
    },
    ai: {
      title: 'Lo que una herramienta de IA generalista no hará por usted',
      text:  'Evaluar la fiabilidad del equipo enfrente, negociar los compromisos de retención, decidir renunciar.',
    },
    mandate: 'Aegryn no ejecuta la transacción. La ejecución se confía a bancos de inversión, boutiques de M&A y abogados habilitados.',
    diagnostic: {
      title: 'Autodiagnóstico',
      intro: 'Cinco preguntas de sí/no antes de comprometerse.',
      questions: [
        { q: '¿Ha definido por escrito la tesis de esta adquisición?' },
        { q: '¿Existe un plan de integración antes de la firma?' },
        { q: '¿Conoce a las tres a cinco personas de las que depende el valor del objetivo?' },
        { q: '¿Los sistemas del objetivo son compatibles con los suyos?' },
        { q: '¿La ejecución de la transacción está confiada a asesores habilitados?' },
      ],
      levels: [
        { min: 4, label: 'Enfoque estructurado', desc: 'Su enfoque está estructurado: un intercambio de 30 minutos puede verificar los últimos ángulos muertos.', nextAction: 'Intercambiar 30 minutos' },
        { min: 2, label: 'Por enmarcar',         desc: 'Varios puntos por enmarcar antes de comprometerse.', nextAction: 'Intercambiar 30 minutos' },
        { min: 0, label: 'Antes de firmar',      desc: 'Antes de la firma, asegure los fundamentos.', nextAction: 'Intercambiar 30 minutos' },
      ],
      privacy: 'No se registra ningún dato: el diagnóstico se calcula en su navegador.',
    },
    nextLabel: 'Ciclo siguiente',
    next:      [{ label: 'Transmisión y Venta', slug: 'transmission' }],
  },

  /* ------------------------------------------------------------------ */
  {
    slug: 'transmission',
    path: '/franchir/transmission',
    meta: {
      title:       'Transmisión y Venta — preparar la organización para resistir sin usted | Aegryn',
      description: 'La transmisión se prepara con años de antelación. Lo que la condiciona es la capacidad de la organización para funcionar sin su dirigente.',
    },
    eyebrow:  'Superar · Transmisión y Venta',
    h1:       'Preparar la organización para resistir sin usted.',
    subtitle: 'La transmisión se prepara con años de antelación. Lo que la condiciona es la capacidad de la organización para funcionar sin su dirigente.',
    verbs:    ['Documentar', 'Delegar', 'Pasar el testigo'],
    constat: {
      text:   'Según Bpifrance Le Lab (nov. 2025), el 40 % de los dirigentes de microempresas, pymes y ETI prevén transmitir en cinco años — 370 000 empresas — y el 23 % de los vendedores constatan una falta de compradores. El 47 % de los dirigentes de empresas familiares de 60 a 69 años no tienen un plan de sucesión formalizado.',
      source: 'Bpifrance Le Lab.',
    },
    situations: {
      title: 'Dónde está. Cómo intervenimos.',
      items: [
        { quote: 'Todo recae sobre mí.', decision: '¿Quién puede asumir qué, en qué orden?', metiers: ['talent'], deliverable: 'Índice de dependencia, plan de delegación a 24 meses' },
        { quote: '¿Mi familia o mis cuadros tomarán el relevo?', decision: 'Opción familiar, interna o tercera', metiers: ['strategie', 'ma'], deliverable: 'Comparación de las tres opciones y calendario' },
        { quote: '¿Mis contratos y derechos están en orden?', decision: 'Lo que un comprador controlará', metiers: ['ma', 'conformite'], deliverable: 'Revisión de ángulos muertos del lado vendedor, lista de correcciones' },
        { quote: 'Mi sistema depende de una persona.', decision: 'Documentación y reversibilidad', metiers: ['technologie'], deliverable: 'Prueba de reversibilidad y plan de documentación' },
        { quote: 'Quiero marcharme en 24 meses.', decision: 'Calendario, hitos, rol tras la partida', metiers: ['ma'], deliverable: 'Hoja de ruta a la inversa' },
        { quote: 'Mi comité de dirección no está listo para tomar el relevo.', decision: '¿A quién reclutar, a quién promover?', metiers: ['recruter', 'talent'], deliverable: 'Perfiles y plan de promoción en responsabilidad' },
      ],
    },
    metiers: { mobilized: ['talent', 'ma'], available: ['strategie', 'technologie', 'conformite', 'recruter'] },
    bySize: {
      title: 'Según el tamaño',
      items: [
        { label: 'PYME', desc: 'Dirigente-fundador, fuerte dependencia, horizonte de 2 a 3 años.' },
        { label: 'ETI', desc: 'Consejo de familia, gobernanza, varios accionistas.' },
      ],
    },
    bySector: {
      title: 'Según el sector',
      items: [
        { cluster: 'Finanzas y Capital',                          desc: 'Licencias ligadas a personas.' },
        { cluster: 'Salud y Ciencias de la vida',                 desc: 'Titulares de licencias y autorizaciones.' },
        { cluster: 'Industria, Energía e Infraestructuras',       desc: 'Saber hacer concentrado, activos pesados.' },
        { cluster: 'Comercio, Servicios y Experiencia de cliente', desc: 'Relación con el cliente portada por el dirigente.' },
        { cluster: 'Tech, Innovación y Sector público',           desc: 'Conocimiento del código concentrado en pocas personas.' },
      ],
    },
    scenario: {
      tag:  'Escenario ilustrativo',
      text: 'Una ETI familiar de 140 M€ cuyo dirigente tiene 63 años. El índice de dependencia muestra que muchas decisiones recaen solo en él. Plan a 24 meses: delegación progresiva, comité de dirección reforzado, documentación de las relaciones con clientes clave.',
    },
    ai: {
      title: 'Lo que una herramienta de IA generalista no hará por usted',
      text:  'Hablar con su familia y sus cuadros, elegir un sucesor, aceptar soltar ciertas decisiones.',
    },
    mandate: 'Aegryn prepara la organización. La venta se ejecuta con el banco de inversión, la boutique de M&A o el abogado del cliente.',
    diagnostic: {
      title: 'Autodiagnóstico',
      intro: 'Cinco preguntas de sí/no para situar su preparación.',
      questions: [
        { q: '¿Puede tomarse una decisión importante sin usted?' },
        { q: '¿Su sucesión está formalizada por escrito?' },
        { q: '¿Sus relaciones con clientes clave están portadas por más de una persona?' },
        { q: '¿Sus contratos, derechos y datos están documentados y al día?' },
        { q: '¿Tiene una fecha objetivo para su partida?' },
      ],
      levels: [
        { min: 4, label: 'Transmisión en marcha', desc: 'Su transmisión avanza en buenas condiciones.', nextAction: 'Intercambiar 30 minutos' },
        { min: 2, label: 'Por documentar',        desc: 'Puntos por documentar antes de comprometer el calendario.', nextAction: 'Intercambiar 30 minutos' },
        { min: 0, label: 'Por preparar',          desc: 'La preparación de su transmisión empieza ahora.', nextAction: 'Intercambiar 30 minutos' },
      ],
      privacy: 'No se registra ningún dato: el diagnóstico se calcula en su navegador.',
    },
    nextLabel: 'Ciclo anterior',
    next:      [{ label: 'Adquisición y Crecimiento externo', slug: 'acquisition' }],
  },
]
