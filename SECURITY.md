# Sécurité - Aegryn Platform

## 🔒 Politique de sécurité

### Rôles utilisateurs

| Rôle | Description | Accès |
|------|-------------|-------|
| `buyer` | Acheteur d'actifs | Espace client buyer uniquement |
| `seller` | Vendeur d'actifs | Espace client seller uniquement |
| `partner` | Partenaire expert | Espace client partner uniquement |
| `internal` | Utilisateur interne | Espace admin SI permissions attribuées |
| `admin` | Administrateur complet | Accès total sans restriction |

### Rôle `internal` - Utilisateurs internes

**Comportement** :
- ✅ Peut être créé par un admin full
- ✅ Espace compte vide par défaut (pas de menu)
- ✅ Accès admin **uniquement** si au moins une permission attribuée
- ❌ Ne peut PAS s'auto-attribuer de permissions
- ❌ Ne peut PAS devenir admin full

**Cas d'usage** :
- Talent Manager (permissions `talent.*`)
- Content Editor (permissions `content.*`)
- Support interne (permissions `users.view`, `users.edit`)

### Permissions critiques - INTERDITES à la délégation

Les permissions suivantes sont **RÉSERVÉES aux admins full** et ne peuvent JAMAIS être déléguées via le système de permissions granulaires :

❌ **INTERDIT** :
```
users.delete              // Suppression de comptes utilisateurs
users.manage_permissions  // Gestion des permissions admin
assets.delete             // Suppression d'actifs
system.settings           // Modification des paramètres système
finance.edit              // Modification des données financières
```

**Raison** :
- Éviter l'escalade de privilèges
- Protéger les données critiques
- Empêcher la suppression accidentelle ou malveillante
- Garantir l'intégrité du système

### Permissions déléguables (avec prudence)

✅ **Peut être délégué** :

**Talent Management** :
```
talent.view               // Lecture candidatures et mandats
talent.edit               // Édition candidatures et mandats
talent.delete             // Suppression candidatures et mandats (⚠️ irréversible)
talent.manage_assignments // Gestion assignations candidats-mandats
talent.view_financials    // Lecture salaires et commissions (données sensibles)
talent.edit_financials    // Édition salaires et commissions (données sensibles)
```

**User Management** :
```
users.view                // Lecture des utilisateurs (données personnelles)
users.edit                // Édition des informations utilisateurs (données personnelles)
users.manage_roles        // Changement de rôles buyer/seller/partner (ne peut pas créer admin/internal)
users.create_internal     // Création de comptes internal (sans permissions par défaut)
```

**Content Management** :
```
content.view              // Lecture du contenu éditorial
content.edit              // Édition articles, pages, newsletter
content.publish           // Publication et dépublication de contenu
```

**Assets Management** :
```
assets.view               // Lecture des actifs
assets.edit               // Édition des informations des actifs
assets.manage_grades      // Modification des grades et certifications
```

**Finance Management** :
```
finance.view              // Lecture des données financières
```

**System Administration** :
```
system.logs               // Lecture des logs système
```

## 🛡️ Row Level Security (RLS)

### Talent - Candidats et Mandats

**Tables** : `talent_hiring_requests`, `talent_candidates`

**Policies** :
- `talent_hiring_view` - Lecture si admin full OU permission `talent.view`
- `talent_hiring_edit` - Édition si admin full OU permission `talent.edit`
- `talent_hiring_delete` - Suppression si admin full OU permission `talent.delete`
- Idem pour `talent_candidates`

**Sécurité** :
- ✅ Les candidats et recruteurs (formulaires publics) n'ont PAS d'accès
- ✅ Seuls les admins et internal avec permissions peuvent voir/éditer
- ✅ Service role bypass RLS pour les API routes publiques

### Permissions Admin

**Tables** : `admin_permissions`, `user_admin_permissions`

**Policies** :
- Lecture : Admin full OU utilisateur pour ses propres permissions
- Insertion : Admin full uniquement
- Suppression : Admin full uniquement

**Sécurité** :
- ✅ Seuls les admins full peuvent attribuer/retirer des permissions
- ✅ Les utilisateurs internal ne peuvent pas se donner de permissions
- ✅ Les permissions critiques sont filtrées côté client ET serveur

## 🚫 Accès interdits

### Talent - Pas d'espace compte

**Candidats** (`talent_candidates`) :
- ❌ N'ont PAS de compte utilisateur
- ❌ N'ont PAS d'accès à la plateforme
- ✅ Soumettent leur candidature via formulaire public
- ✅ Sont gérés par l'équipe Aegryn Talent

**Recruteurs** (`talent_hiring_requests`) :
- ❌ N'ont PAS de compte utilisateur (pour l'instant)
- ❌ N'ont PAS d'accès à la plateforme
- ✅ Soumettent leur mandat via formulaire public
- ✅ Sont gérés par l'équipe Aegryn Talent
- 📋 **Parking-lot** : Espace recruteur envisagé pour le futur

## 🔐 Bonnes pratiques

### Pour les admins

1. **Ne jamais partager les credentials admin**
2. **Utiliser le rôle `internal` pour déléguer** plutôt que créer des admins
3. **Attribuer le minimum de permissions nécessaires** (principe du moindre privilège)
4. **Auditer régulièrement** les permissions attribuées
5. **Retirer les permissions** quand elles ne sont plus nécessaires

### Pour les développeurs

1. **Toujours vérifier les permissions** avant d'afficher/permettre une action
2. **Utiliser le hook `usePermissions()`** côté client
3. **Vérifier les RLS policies** côté serveur
4. **Ne jamais bypasser les vérifications** de sécurité
5. **Tester avec différents niveaux** de permissions

### Audit trail

Toutes les attributions de permissions sont tracées :
- `granted_by` - Qui a attribué la permission
- `granted_at` - Quand la permission a été attribuée
- `notes` - Notes optionnelles sur l'attribution

## 🚨 Signalement de vulnérabilités

Si vous découvrez une vulnérabilité de sécurité :

1. **NE PAS** créer d'issue publique
2. **Contacter** : security@boha-group.com
3. **Fournir** : Description détaillée, steps to reproduce, impact potentiel
4. **Attendre** : Nous vous répondrons sous 48h

## 📋 Checklist de sécurité

Avant de déployer une nouvelle fonctionnalité :

- [ ] RLS policies configurées correctement
- [ ] Permissions vérifiées côté client ET serveur
- [ ] Pas de données sensibles exposées dans les logs
- [ ] Pas de bypass de sécurité en dev/staging
- [ ] Tests avec différents rôles effectués
- [ ] Audit trail en place si nécessaire
- [ ] Documentation de sécurité mise à jour

---

**Dernière mise à jour** : 2026-09-01  
**Version** : 1.0  
**Responsable sécurité** : Admin Team
