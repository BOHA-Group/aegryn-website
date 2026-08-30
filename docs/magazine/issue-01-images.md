# Aegryn Magazine — Issue 01 · Référence des visuels

> Inventaire complet des images utilisées dans le flipbook et la web edition.  
> Les URLs Pexels sont les placeholders actuels à remplacer par des visuels définitifs.  
> Fichier local = `public/magazine/issue-01/`

---

## Cover

| ID | Fichier local | Fallback Pexels | Notes |
|----|--------------|-----------------|-------|
| COVER | `cover-magazine-issue-01.jpg` | [pexels/618833](https://images.pexels.com/photos/618833/pexels-photo-618833.jpeg) | Montagne enneigée — utilisé IssueCard + IssueCard issue-01 |
| COVER-2 | `cover-magazine-issue-01-2.jpg` | — | Version alternative (non utilisée activement) |
| COVER-OLD | `cover-magazine-issue-01-old.jpg` | — | Archive ancienne version |

---

## Pages intérieures — Flipbook

| Page | ID | Section | Sujet visuel actuel (Pexels) | URL Pexels |
|------|----|---------|------------------------------|-----------|
| p01 | COVER | **Cover** | Montagne enneigée | [618833](https://images.pexels.com/photos/618833/pexels-photo-618833.jpeg?auto=compress&cs=tinysrgb&w=840) |
| p02 | IMG-A1 | **What Aegryn Is** | Bureau/équipe travail | [1486974](https://images.pexels.com/photos/1486974/pexels-photo-1486974.jpeg?auto=compress&cs=tinysrgb&w=840) |
| p06 | IMG-E1 | **Editorial — Editor's Letter** | Réunion équipe | [3184299](https://images.pexels.com/photos/3184299/pexels-photo-3184299.jpeg?auto=compress&cs=tinysrgb&w=840) |
| p09 | IMG-S2 | **Section separator** | Personnes au bureau laptops | [1181467](https://images.pexels.com/photos/1181467/pexels-photo-1181467.jpeg?auto=compress&cs=tinysrgb&w=840) |
| p11 | IMG-B2 | **Build** | Personne code/tech | [6077812](https://images.pexels.com/photos/6077812/pexels-photo-6077812.jpeg?auto=compress&cs=tinysrgb&w=840) |
| p17 | IMG-B3 | **Build — Opinion** | Équipe discussion | [1181671](https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&w=840) |
| p21 | IMG-S3 | **Section separator** | Architecture/ville | [325185](https://images.pexels.com/photos/325185/pexels-photo-325185.jpeg?auto=compress&cs=tinysrgb&w=840) |
| p22 | IMG-04 | **Money — Market Context** | Réunion business | [3184418](https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=840) |
| p27 | IMG-M1 | **Opinion — Money** | Collaboration bureau | [3184292](https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=840) |
| p31 | IMG-S4 | **Section separator** | Paysage abstrait | [374870](https://images.pexels.com/photos/374870/pexels-photo-374870.jpeg?auto=compress&cs=tinysrgb&w=840) |
| p36 | IMG-T1 | **Transaction — Acquirer Profiles** | Personnes business | [1181406](https://images.pexels.com/photos/1181406/pexels-photo-1181406.jpeg?auto=compress&cs=tinysrgb&w=840) |
| p40 | IMG-S5 | **Section separator** | Finance/data | [590041](https://images.pexels.com/photos/590041/pexels-photo-590041.jpeg?auto=compress&cs=tinysrgb&w=840) |
| p43 | IMG-S1 | **Section separator** | Tech/AI abstrait | [8386434](https://images.pexels.com/photos/8386434/pexels-photo-8386434.jpeg?auto=compress&cs=tinysrgb&w=840) |
| p44 | IMG-AI1 | **Tech & AI** | AI/tech visuel | [8386440](https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=840) |
| p49 | IMG-S6 | **Section separator** | Collaboration | [3184360](https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=840) |
| p50 | IMG-P1 | **People — Portrait fondateur** | Réunion business | [3184412](https://images.pexels.com/photos/3184412/pexels-photo-3184412.jpeg?auto=compress&cs=tinysrgb&w=840) |
| p55 | IMG-S7 | **Section separator** | Paysage/nature | [1366919](https://images.pexels.com/photos/1366919/pexels-photo-1366919.jpeg?auto=compress&cs=tinysrgb&w=840) |

---

## Légende des préfixes ID

| Préfixe | Signification |
|---------|---------------|
| `IMG-A` | About / What Aegryn Is |
| `IMG-E` | Editorial |
| `IMG-B` | Build section |
| `IMG-S` | Section separator (pleine page entre chapitres) |
| `IMG-M` | Money / Market |
| `IMG-T` | Transaction |
| `IMG-AI` | Tech & AI |
| `IMG-P` | People / Portrait |

---

## Remplacement — Procédure

1. Choisir le visuel définitif pour un `ID` donné
2. L'uploader dans `public/magazine/issue-01/` (ex: `img-a1.jpg`)
3. Dans `aegryn-magazine-issue-01_1.html`, remplacer l'URL Pexels par le chemin local :
   ```
   background-image:url('img-a1.jpg')
   ```
4. Faire de même dans `aegryn-magazine-issue-01_web.html` si le visuel y est aussi utilisé

---

*Généré le 30 août 2026 — aegryn-site/docs/magazine-issue-01-images.md*
