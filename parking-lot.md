# Parking Lot - Fonctionnalités en attente

## 🚀 Fonctionnalités futures

### Talent - Espace Recruteur
**Statut**: En attente  
**Priorité**: Moyenne  
**Date ajout**: 2026-09-01

**Description**:
Créer un espace compte dédié pour les recruteurs (entreprises qui soumettent des mandats via le formulaire Talent).

**Fonctionnalités envisagées**:
- Dashboard avec statut des mandats en cours
- Historique des mandats soumis
- Candidats proposés par mandat
- Messagerie avec l'équipe Aegryn Talent
- Facturation et commissions
- Statistiques de placement

**Considérations techniques**:
- Nouveau rôle `recruiter` dans profiles.role
- Table `recruiter_companies` pour lier mandats à entreprises
- Authentification via email utilisé dans formulaire
- Invitation par email après premier mandat
- Dashboard read-only (pas d'édition directe)

**Dépendances**:
- Migration 096 (talent_enhanced_management)
- Migration 097 (admin_permissions_system)
- Système de notifications par email

**Bloqueurs**:
- Aucun pour l'instant
- Décision business à prendre sur le niveau d'accès

**Notes**:
- Les candidats (talent_candidates) n'ont PAS d'espace compte
- Seuls les recruteurs (talent_hiring_requests) pourraient en avoir un
- À valider avec la stratégie produit globale

---

## 📋 Autres idées en attente

### Magazine - Édition papier automatisée
**Statut**: Idée  
**Priorité**: Basse  
**Date ajout**: 2026-08-28

**Description**:
Automatiser la production de l'édition papier du magazine à partir du flipbook HTML.

**Fonctionnalités**:
- Export PDF print-ready depuis le flipbook
- Gestion des marges de coupe
- Profil colorimétrique CMYK
- Génération automatique du bon à tirer (BAT)

---

### Expert Network - Matching automatique
**Statut**: Idée  
**Priorité**: Moyenne  
**Date ajout**: 2026-08-02

**Description**:
Algorithme de matching automatique entre demandes clients et profils experts.

**Fonctionnalités**:
- Score de compatibilité basé sur expertise, secteur, langue
- Suggestions automatiques d'experts
- Notifications push aux experts matchés
- Dashboard de suivi des opportunités

---

## 🔒 Sécurité - Décisions importantes

### Permissions critiques INTERDITES à la délégation
**Date**: 2026-09-01

Les permissions suivantes sont **RÉSERVÉES aux admins full** et ne peuvent JAMAIS être déléguées via le système de permissions granulaires :

❌ **INTERDIT de déléguer** :
- `users.delete` - Suppression de comptes utilisateurs
- `users.manage_permissions` - Gestion des permissions admin
- `assets.delete` - Suppression d'actifs
- `system.settings` - Modification des paramètres système
- `finance.edit` - Modification des données financières

✅ **Peut être délégué** (avec prudence) :
- `talent.*` - Toutes les permissions Talent
- `users.view` - Lecture des utilisateurs
- `users.edit` - Édition des informations utilisateurs
- `users.manage_roles` - Changement de rôles (buyer/seller/partner uniquement)
- `content.*` - Toutes les permissions contenu
- `finance.view` - Lecture des finances

**Raison** :
Éviter qu'un utilisateur avec permissions puisse s'auto-promouvoir admin ou supprimer des données critiques.

---

## 📝 Template pour nouvelles entrées

```markdown
### [Nom de la fonctionnalité]
**Statut**: [Idée / En attente / Bloqué / Annulé]  
**Priorité**: [Haute / Moyenne / Basse]  
**Date ajout**: YYYY-MM-DD

**Description**:
[Description courte de la fonctionnalité]

**Fonctionnalités envisagées**:
- Point 1
- Point 2

**Considérations techniques**:
- Détail technique 1
- Détail technique 2

**Dépendances**:
- Dépendance 1
- Dépendance 2

**Bloqueurs**:
- Bloqueur 1

**Notes**:
- Note importante
```

---

**Dernière mise à jour**: 2026-09-01
