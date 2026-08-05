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
