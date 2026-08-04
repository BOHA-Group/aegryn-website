# Processus de révision éditoriale — Contenus assistés par IA

**Version :** 1.0  
**En vigueur :** 2 août 2026  
**Base légale :** EU AI Act art. 50 §4 — Règlement UE 2024/1689  
**Responsable :** Équipe éditoriale AEGRYN  
**Contact :** contact@boha-group.com

---

## 1. Objet

Ce document décrit le processus interne de révision humaine appliqué à tout contenu produit avec l'assistance de systèmes d'intelligence artificielle générative (ci-après "contenu IA-assisté") avant publication sur aegryn.com.

Il constitue la **trace documentaire** de la responsabilité éditoriale AEGRYN au sens de l'article 50 §4 du EU AI Act, lequel exonère les déployeurs de l'obligation de mention explicite par unité de contenu lorsqu'une **révision humaine est mise en place et documentée**.

AEGRYN a choisi de **cumuler** les deux dispositifs : mention éditoriale par article (`aiAssisted: true`) **et** documentation du processus interne — au-delà du minimum légal.

---

## 2. Périmètre

Ce processus s'applique à **tous les contenus** publiés sur aegryn.com qui ont été produits en tout ou partie avec l'assistance d'un système IA génératif :

| Type de contenu | Identifiant technique | Couvert |
|---|---|---|
| Articles de blog | `aiAssisted: true` dans `data/articles.ts` | ✅ |
| Rapports marché | Idem | ✅ |
| Analyses sectorielles | Idem | ✅ |
| Pages légales (CGU, CGV, Privacy) | Rédigées manuellement | ❌ hors périmètre |
| Code source | Hors périmètre EU AI Act art. 50 | ❌ hors périmètre |

**Systèmes IA utilisés (liste non exhaustive) :**
- Modèles de langage (LLM) pour la rédaction assistée de corps d'articles
- Cascade (Windsurf IDE) pour la génération de contenu éditorial
- Tout autre système LLM utilisé ponctuellement par l'équipe

---

## 3. Étapes du processus de révision

### Étape 1 — Génération assistée

- Un membre de l'équipe éditoriale formule le brief, les sources de données, et le cadrage factuel
- Le système IA génère un premier jet
- **Durée estimée :** variable selon la longueur

### Étape 2 — Révision factuelle (obligatoire)

Le réviseur humain vérifie :

| Point de contrôle | Critère d'acceptation |
|---|---|
| Exactitude des chiffres et données | Vérification source primaire (rapport KPMG, Dealroom, CB Insights, données internes) |
| Cohérence avec le positionnement AEGRYN | Pas de contradiction avec la méthodologie Grade, les CGV, le cadre légal |
| Absence d'affirmations invérifiables | Toute statistique sans source doit être supprimée ou qualifiée |
| Ton éditorial | Respect du ton AEGRYN : factuel, institutionnel, sans hyperbole |
| Mentions légales | Vérification que les disclaimers ("à titre indicatif", "consulter un professionnel") sont présents là où requis |

### Étape 3 — Révision structurelle (obligatoire)

- Cohérence des H2/H3 avec le corps
- Absence de répétitions ou d'artefacts IA (formulations génériques, hallucinations)
- Vérification des liens internes et des ancres

### Étape 4 — Validation finale et marquage

- Le réviseur valide le contenu pour publication
- Le champ `aiAssisted: true` est confirmé dans `data/articles.ts`
- La date de publication est définie

### Étape 5 — Publication

- Merge du contenu sur `main`
- Le bandeau éditorial "IA" s'affiche automatiquement sur la page article
- La notice générique footer reste visible sur toutes les pages

---

## 4. Responsabilités

| Rôle | Responsabilité |
|---|---|
| **Rédacteur / Opérateur IA** | Brief, génération, premier jet |
| **Réviseur éditorial** | Étapes 2 et 3 — révision factuelle et structurelle |
| **Responsable publication** | Étape 4 — validation finale, marquage `aiAssisted`, merge |
| **Responsable légal AEGRYN** | Mise à jour de ce document, conformité EU AI Act |

> En l'absence d'une équipe dédiée, le fondateur assume les rôles de réviseur éditorial et responsable publication.

---

## 5. Traçabilité

### Traçabilité technique

Chaque article publié est traçable via :
- Le commit Git associé (auteur, date, diff) — repo `BOHA-Group/aegryn-website`
- Le champ `date` dans `data/articles.ts` (date de publication)
- Le champ `aiAssisted: true` indiquant le statut IA-assisté

### Traçabilité documentaire

Ce fichier constitue la pièce justificative du processus. Il est versionné dans le repo Git et opposable en cas de contrôle régulateur.

**En cas d'audit par une autorité nationale (ex. CNIL, CJUE, autorité suisse compétente) :**
1. Fournir ce document
2. Fournir l'historique Git (`git log --all --oneline`)
3. Montrer le code du bandeau éditorial (`app/[locale]/blog/[slug]/page.tsx` lignes 213–225)
4. Montrer la page `/terms/ai-usage` et la notice footer

---

## 6. Délai de révision

| Volume de contenu | Délai minimal de révision avant publication |
|---|---|
| Article court (< 1 000 mots) | 30 minutes |
| Article standard (1 000–3 000 mots) | 2 heures |
| Article long / rapport (> 3 000 mots) | 4 heures minimum, ou J+1 |

Aucun contenu IA-assisté ne peut être publié sans avoir franchi l'intégralité des étapes 2 à 4, indépendamment des délais.

---

## 7. Cas de rejet

Un contenu généré par IA doit être **rejeté ou substantiellement réécrit** si :

- Il contient des affirmations factuellement inexactes non corrigibles par une note
- Il mentionne des personnes physiques de façon inexacte ou susceptible de les diffamer
- Il contient des prédictions financières présentées comme certitudes
- Il reproduit des formulations identifiables comme étant issues d'un autre éditeur (risque de plagiat)
- Il entre en contradiction avec les CGV ou la méthodologie AEGRYN Grade

---

## 8. Mise à jour de ce document

Ce document est mis à jour :
- À chaque changement de système IA utilisé
- À chaque évolution réglementaire significative (mise à jour des guidelines EU AI Act)
- En cas d'audit ou de demande d'une autorité compétente
- Au minimum une fois par an (révision annuelle)

| Version | Date | Auteur | Changement |
|---|---|---|---|
| 1.0 | 2026-08-04 | AEGRYN | Création initiale — mise en conformité EU AI Act art. 50 |

---

*Ce document est interne à AEGRYN. Il est versionné dans le dépôt Git du projet et n'est pas destiné à être publié publiquement dans son intégralité — seuls les éléments synthétiques figurant sur `/terms/ai-usage` sont destinés au public.*
