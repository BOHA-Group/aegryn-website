# Parking-lot — fonctionnalités en attente

---

## Commissions — Espace Acquéreur (masqué)

**Contexte :**
La page `/client/buyer/commissions` affiche les frais de transaction dus par l'acquéreur à AEGRYN.
Fonctionnalité non activée pour l'instant — le flux de facturation n'est pas encore opérationnel.

**Ce qui existe (archivé, ne pas supprimer) :**
- Page : `app/client/buyer/commissions/page.tsx` — liste complète avec statuts pending/invoiced/paid
- Table Supabase : `buyer_commission_dues` (colonnes : transaction_id, amount_chf, status, eligible_at)
- Nav : entrée `navCommissions` dans `BuyerNav.tsx` (commentée)
- Admin : page `/admin/commissions` + `CommissionsClient.tsx` (également masquée)
- Admin nav : entrée "Commissions" dans `AdminSideNav.tsx` (commentée)

**Pour réactiver :**
1. Décommenter les entrées nav dans `BuyerNav.tsx` et `AdminSideNav.tsx`
2. Vérifier que la table `buyer_commission_dues` est correctement alimentée par le webhook Stripe
3. Activer la génération de factures Stripe pour les commissions

**Priorité :** Basse — à traiter après stabilisation complète du pipeline de transaction PTT.

---

## Notifications in-app — Parrainage expert

**Contexte :**
Le système de parrainage expert (`expert_referrals`, `expert_subscription_credits`) génère
des événements qui mériteraient des notifications in-app pour les deux parties (parrain et filleul).

**Déclencheurs à notifier :**
| Événement | Destinataire | Message |
|---|---|---|
| Code parrain utilisé (filleul s'inscrit) | Parrain | "Un expert a utilisé votre code parrain. Le mois offert sera crédité dès son 1er paiement." |
| Filleul paie son 1er mois → `rewarded` | Parrain | "+1 mois offert crédité sur votre abonnement (parrainage)." |
| Filleul paie son 1er mois → `rewarded` | Filleul | "+1 mois offert crédité sur votre abonnement (parrainage)." |
| Admin crédite des mois | Partenaire | "L'équipe AEGRYN vous a crédité N mois sur votre abonnement expert." |
| Abonnement expert arrive à expiration (J-7) | Partenaire | "Votre abonnement Fiche Expert expire dans 7 jours." |

**Prérequis :**
- Définir l'architecture `user_notifications` (table existante ? à créer ?)
- Décider du canal : in-app (toast/badge), email, ou les deux
- Intégrer dans le webhook Stripe (`applyReferralReward`) et dans l'API admin (`/api/admin/expert/subscription`)

**Priorité :** Moyenne — à traiter après stabilisation du flux Stripe + parrainage.

---

## Factures admin — Bouton "Enregistrer et envoyer" + email amélioré

**Contexte :**
Le bouton "Enregistrer + Envoyer email" a été temporairement supprimé (workflow manuel). À remettre.

**Ce qui est à faire :**
1. Remettre le bouton "Enregistrer et envoyer" dans `InvoiceEditor.tsx`
2. L'appel API existe déjà (`send_email: true` dans le PATCH) — câblage à rétablir
3. **Email :** adresse expéditeur = `finance@boha-group.com` (pas `no-reply@boha-group.com`)
4. **Contenu email :** ne pas mentionner IBAN/BOHA-Group — inclure à la place un **lien de paiement Stripe** directement dans le corps de l'email
5. Ajouter une phrase de remerciement et salutation avant la signature (ex: "Nous vous remercions de votre confiance. N'hésitez pas à nous contacter pour toute question.")
6. **Template PDF :** retirer aussi toute mention IBAN — remplacer par "Règlement par lien de paiement transmis séparément"

**Fichiers concernés :**
- `app/admin/invoices/[id]/InvoiceEditor.tsx` — remettre le bouton + état `sent`
- `app/api/admin/invoices/[id]/route.ts` — modifier `send_email` block (from, contenu, lien Stripe)
- `app/api/admin/invoices/[id]/pdf/route.ts` — retirer mention IBAN du template HTML

**Priorité :** Haute — à traiter prochainement.

---

## Liens de paiement Stripe — Certifications AEGRYN

**Contexte :**
Créer deux liens de paiement Stripe pour les certifications partenaires (CAS 3 / accréditation).

**À créer dans Stripe Dashboard (mode production) :**
| Produit | Montant | Usage |
|---|---|---|
| Certification AEGRYN — Niveau 1 | CHF 2 000 | Accréditation partenaire standard |
| Certification AEGRYN — Niveau 2 | CHF 5 000 | Accréditation partenaire premium |

**Actions :**
1. Créer les Payment Links dans le Stripe Dashboard (production)
2. Stocker les URLs dans les variables d'environnement (ex: `STRIPE_CERT_2000_URL`, `STRIPE_CERT_5000_URL`)
3. Intégrer les liens dans les emails de facturation certification (voir point ci-dessus)

**Priorité :** Haute — nécessaire pour monétiser les certifications partenaires.
