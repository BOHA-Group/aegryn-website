# /public/legal/

Dossier des documents légaux AEGRYN (statiques, servis directement).

## Fichiers attendus

- `cgv.pdf`         , Conditions Générales de Vente (rédigées par avocat)
- `methodology.pdf` , Méthodologie de certification Grade AEGRYN

## Workflow de mise à jour

Ces fichiers peuvent être remplacés sans redéploiement via Supabase Storage
(bucket `legal-docs`), à activer dans `/admin/` section "Documents légaux".

En attendant la version finale signée par avocat, les fichiers placeholder
ci-dessous sont servis pour éviter les erreurs 404 sur les boutons de
téléchargement présents sur `/terms` et `/grade/methodology`.

## Statut

cgv.pdf          → EN ATTENTE rédaction avocat
methodology.pdf  → EN ATTENTE rédaction avocat
