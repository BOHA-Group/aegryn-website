# Templates de référence AEGRYN

Ce dossier contient les templates visuels de référence utilisés pour la génération automatique
des documents officiels AEGRYN (factures, devis, etc.).

## Ajouter le template de facture

Déposez votre fichier PDF ou image de référence ici :

```
public/templates/invoice-template.pdf   ← PDF de référence
public/templates/invoice-template.png   ← ou image PNG
```

Le template sera utilisé comme modèle visuel fidèle pour la génération HTML/PDF des factures.
Le header (bandeau) du template sera reproduit tel quel, aucune liberté de design n'est prise.

## Structure obligatoire du template

Le template doit respecter l'ordre suivant :
1. **Header / Bandeau**, logo AEGRYN + coordonnées émetteur (reproduit fidèlement)
2. **Références**, N° facture, date émission, date échéance
3. **Destinataire**, nom, société, adresse, email, N° TVA
4. **Tableau des prestations**, description, unité, qté, P.U. HT, total HT
5. **Totaux**, sous-total HT, TVA, total TTC
6. **Pied de page**, coordonnées légales société (fixe, non modifiable)

## Pied de page (obligatoire, fixe)

> Aegryn, Rue du Centre 142, 1025 Saint-Sulpice, Suisse. CHE-402.011.821 TVA.

## Note sécurité RIB

Le RIB AEGRYN **n'est pas inclus** dans la facture générée automatiquement.
Il est transmis séparément au destinataire par l'équipe AEGRYN pour prévenir tout risque
de fraude ou d'interception de données bancaires.
