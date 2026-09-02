# TODO : Finaliser traductions ES/IT/NL

## ✅ COMPLÉTÉ
- FR : advisory enrichi + thoughtLeadership + navbar + homepage + build
- EN : advisory enrichi + thoughtLeadership + navbar
- DE : advisory enrichi + thoughtLeadership + navbar
- ES : advisory.pillars.strategy + advisory.pillars.technology (PARTIEL)

---

## ❌ RESTE À FAIRE

### 1. ESPAGNOL (ES) — 10min
Fichier : `i18n/messages/es.json`

**A. advisory.pillars.ma** (lignes ~296-320)
```json
"ma": {
  "title": "Consultoría M&A",
  "desc": "Acompañamos operaciones de fusiones-adquisiciones e integración post-adquisición con experiencia tech.",
  "why": {
    "title": "¿Por qué consultoría M&A?",
    "desc": "Las adquisiciones tech rara vez fracasan en la estrategia, sino en la ejecución: subestimación de deuda técnica, integración IT fallida, fuga de talentos clave, sinergias tecnológicas no realizadas. Intervenimos desde la fase de due diligence para identificar riesgos técnicos y oportunidades de creación de valor, luego acompañamos la integración hasta el cierre y más allá."
  },
  "approach": {
    "title": "Nuestro enfoque",
    "desc": "Tratamos cada adquisición como una oportunidad de transformación. Más allá de la due diligence técnica clásica, evaluamos cómo la adquisición puede acelerar su modernización IT, enriquecer sus capacidades data/IA, o servir como plataforma para consolidar su mercado. Nuestra experiencia cubre todo el ciclo M&A.",
    "steps": [
      {"label": "Due diligence tech", "desc": "Auditoría técnica profunda: arquitectura, deuda técnica, seguridad, cumplimiento, IP. Evaluación de riesgos y oportunidades. Cuantificación de sinergias tecnológicas."},
      {"label": "Technology blueprint", "desc": "Definición de arquitectura objetivo post-adquisición. Plan de integración IT detallado: sistemas, datos, procesos. Identificación de quick wins y proyectos estructurales."},
      {"label": "Integration Management Office", "desc": "Dirección de integración IT: gobernanza, planificación, gestión de riesgos, coordinación de equipos. Seguimiento de hitos críticos (Day 1, Day 100, sinergias)."},
      {"label": "Value capture & transformation", "desc": "Realización de sinergias tecnológicas. Modernización acelerada de sistemas legacy. Transformación digital post-adquisición para maximizar creación de valor."}
    ]
  },
  "dimensions": [...]
}
```

**B. advisory.thoughtLeadership** (après pillars, avant "label")
```json
"thoughtLeadership": {
  "title": "Tres dimensiones complementarias en un mercado en consolidación",
  "desc": "El mercado tech europeo atraviesa una transformación estructural: la tecnología ya no es una ventaja diferenciadora, sino un requisito de supervivencia. En este contexto, estrategia, tecnología y M&A ya no son disciplinas aisladas — forman un tríptico indisociable para los líderes que quieren crecer.",
  "pillars": [
    {"label": "Estrategia: definir dónde jugar", "desc": "Ante la fragmentación del mercado europeo y la aceleración tecnológica, los líderes deben tomar decisiones radicales: qué mercados abordar, qué capacidades desarrollar internamente, qué adquisiciones apuntar para cerrar brechas. La estrategia define la visión, pero sin hoja de ruta tecnológica ni plan M&A, queda en letra muerta."},
    {"label": "Tecnología: construir la ventaja", "desc": "La tecnología se ha convertido en la principal palanca de diferenciación: experiencia del cliente, eficiencia operativa, capacidad de innovación. Pero el 70% de las transformaciones digitales fracasan por falta de alineación estratégica. Una visión tech desconectada de la estrategia de negocio genera deuda técnica e inversiones perdidas."},
    {"label": "M&A: acelerar por consolidación", "desc": "El crecimiento orgánico ya no es suficiente. Los líderes tech europeos consolidan sus mercados mediante adquisiciones para ganar masa crítica, adquirir talentos escasos o acelerar su transformación digital. Pero sin due diligence tech rigurosa y plan de integración IT, las adquisiciones destruyen más valor del que crean."}
  ],
  "conclusion": "Aegryn Advisory interviene en la intersección de estas tres dimensiones. Ayudamos a los líderes tech a definir una estrategia de crecimiento coherente, construir las capacidades tecnológicas para ejecutarla e identificar las adquisiciones que aceleran el plan sin crear deuda técnica. Un enfoque integrado para un mercado que ya no perdona los silos."
}
```

**C. Navbar keys** (lignes ~70-77)
```json
"craftSupportDesc": "Consultoría en Estrategia, Tech & M&A — Todas industrias",
"craftSupportStrategy": "Consultoría Estratégica",
"craftSupportTechnology": "Consultoría Tecnológica",
"craftSupportMA": "Consultoría M&A",
```

---

### 2. ITALIEN (IT) — 30min
Fichier : `i18n/messages/it.json`

Traduire TOUT le contenu enrichi :
- advisory.pillars.strategy (why + approach + 4 steps)
- advisory.pillars.technology (why + approach + 4 steps)
- advisory.pillars.ma (why + approach + 4 steps)
- advisory.thoughtLeadership (title + desc + 3 pillars + conclusion)
- Navbar keys (craftSupportDesc, craftSupportStrategy, craftSupportTechnology, craftSupportMA)

**Base de référence** : Copier structure DE ou ES, adapter terminologie italienne.

---

### 3. NÉERLANDAIS (NL) — 30min
Fichier : `i18n/messages/nl.json`

Traduire TOUT le contenu enrichi (même structure que IT).

---

## 🎯 COMMANDES VALIDATION

Après chaque langue :
```bash
npx tsc --noEmit
git add -A && git commit -m "feat(i18n): traduire [LANGUE] complet"
```

Build final :
```bash
npm run build
```

---

## 📝 NOTES

- Inspiration traductions : sites officiels McKinsey/BCG/Accenture dans chaque langue
- Garder ton professionnel, éviter traduction littérale
- Stats : 70% transformations échouent, 30% réussissent (cohérent toutes langues)
- Termes clés à préserver : "quick wins", "due diligence", "Day 1/Day 100"
