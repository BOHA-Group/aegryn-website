# AI ACT COMPLIANCE, EU Regulation 2024/1689

> **Audience:** Internal, Aegryn / BOHA Group  
> **Regulation:** EU AI Act (Règlement UE 2024/1689), applicable progressively from 2024 to 2027  
> **Last updated:** 2026-08  
> **Key dates:**
> - Prohibited practices: **2 February 2025** ✅ passed
> - GPAI models: **2 August 2025** ✅ passed
> - High-risk systems (Annex III): **2 August 2026** ← current
> - Full application: **2 August 2027**

---

## 1. Aegryn's AI Systems Inventory

| System | Description | Role | Risk classification |
|---|---|---|---|
| **CIFS Grade Engine** (`lib/gradeEngine.ts`) | Computes a score across 4 dimensions and proposes a grade | Aegryn = **Deployer** (internal tool) | See §2 |
| **LLM editorial assistant** | Assists in drafting blog articles and market reports | Aegryn = **Deployer** | Limited risk, art. 50 |
| **Grade auto-fill** (`lib/gradeAutoFill.ts`) | Suggests grade inputs based on uploaded documents | Aegryn = **Deployer** (internal tool) | Minimal risk |

---

## 2. CIFS Grade Engine, Risk Classification

### Is it an AI system under the EU AI Act?
The CIFS grade engine uses a **rule-based scoring algorithm** with fixed weights, it does not use machine learning or infer from training data. This places it **at the boundary** between a deterministic algorithm and an AI system.

**Conservative position adopted:** Treat it as an AI system subject to AI Act provisions, to future-proof compliance if the methodology evolves toward ML.

### Risk level assessment

The CIFS grade engine **does not fall under Annex III** (high-risk AI systems):
- It does not assess creditworthiness of natural persons (it assesses legal entities / tech assets)
- It does not make employment decisions
- It does not affect access to essential services

**Classification: Minimal risk**, no mandatory obligations under the AI Act beyond general good practice.

### Human oversight (maintained regardless)
- Every grade proposal is reviewed and validated by a certified CIFS expert and Aegryn team
- No grade is issued automatically, human sign-off is required at all times
- This is documented in `GRADING_PROTOCOL.md` §8 and `TRANSFER_CHECKLIST.md` Phase 2

---

## 3. LLM Editorial Assistant, Art. 50 Obligations (Transparency)

**Obligation:** AI-generated content that could be mistaken for human-generated must be labelled.

**Aegryn's implementation:**
- All AI-assisted articles are flagged with `aiAssisted: true` in `data/articles.ts`
- An editorial badge is displayed on each concerned article page
- A general AI usage notice is published at `/terms/ai-usage`
- A full human editorial review process is documented and versioned

**Documented in:** `ai-editorial-review-process.md` (this folder)

**Status:** ✅ Compliant with Art. 50 §4, human review process in place and documented

---

## 4. Prohibited Practices (Art. 5), Verification

The following prohibited practices are confirmed as not used by Aegryn:

| Prohibited practice | Applicable to Aegryn | Status |
|---|---|---|
| Subliminal manipulation techniques | No | ✅ N/A |
| Exploitation of vulnerabilities (age, disability) | No | ✅ N/A |
| Social scoring by public authorities | No | ✅ N/A |
| Real-time biometric identification in public spaces | No | ✅ N/A |
| Emotion recognition in workplace/education | No | ✅ N/A |
| Scraping facial images for recognition databases | No | ✅ N/A |

---

## 5. General Purpose AI (GPAI) Models, Art. 51-56

Aegryn **uses** GPAI models (LLMs via API) but does **not develop or deploy** them as a provider.
As a **user/deployer** of GPAI models, Aegryn's obligations are limited to:
- Respecting usage terms of the model provider
- Implementing transparency obligations (art. 50, see §3 above)
- Not using GPAI for prohibited purposes

**Status:** ✅ No obligations beyond art. 50 transparency

---

## 6. Action Items

| # | Action | Status | Deadline |
|---|---|---|---|
| 1 | Monitor CIFS engine evolution, reassess if ML introduced | ☐ | Ongoing |
| 2 | Review AI Act Annex III applicability annually | ☐ | Annual |
| 3 | Maintain `ai-editorial-review-process.md` up to date | ✅ | Ongoing |
| 4 | Register with EU AI Act database if high-risk system added | ☐ | If applicable |
| 5 | Review full application obligations (Aug 2027) | ☐ | Before 2027-08 |

---

## 7. Changelog

| Date | Change |
|---|---|
| 2026-08 | Initial compliance document created |
