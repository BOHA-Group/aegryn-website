# Parking-lot — fonctionnalités en attente

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
