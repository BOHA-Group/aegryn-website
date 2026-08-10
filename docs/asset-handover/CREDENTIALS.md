# CREDENTIALS — Access Inventory

> **Document type:** Asset handover — access inventory  
> **CIFS dimension:** S (Security — access control)  
> **⚠️ SECURITY NOTICE:** This file contains **no credential values**.  
> It is an inventory only. Actual credentials are transmitted via a secure channel (password manager or encrypted transfer) at closing — never stored in this repository.  
> **Do not add passwords, API keys, or secrets to this file.**

---

## 1. Infrastructure & Hosting

| Service | Purpose | Account owner | Access type | Transmitted |
|---|---|---|---|---|
| _(e.g. Vercel)_ | _(hosting)_ | _(seller)_ | _(admin login)_ | ☐ |
| _(e.g. AWS / GCP / OVH)_ | _(server)_ | — | — | ☐ |
| _(e.g. Cloudflare)_ | _(DNS / CDN)_ | — | — | ☐ |

---

## 2. Database & Storage

| Service | Purpose | Account owner | Access type | Transmitted |
|---|---|---|---|---|
| _(e.g. Supabase)_ | _(database)_ | — | _(project admin)_ | ☐ |
| _(e.g. Cloudflare R2 / S3)_ | _(storage)_ | — | _(API key)_ | ☐ |

---

## 3. External Services & APIs

| Service | Purpose | Account owner | Access type | Transmitted |
|---|---|---|---|---|
| _(e.g. Stripe)_ | _(payments)_ | — | _(secret key + webhook)_ | ☐ |
| _(e.g. Resend / SendGrid)_ | _(email)_ | — | _(API key)_ | ☐ |
| _(e.g. Auth provider)_ | _(auth)_ | — | _(admin + API keys)_ | ☐ |

---

## 4. Source Code & Version Control

| Service | Purpose | Account owner | Access type | Transmitted |
|---|---|---|---|---|
| _(e.g. GitHub)_ | _(repository)_ | — | _(org transfer or collaborator)_ | ☐ |

---

## 5. Domain & DNS

| Domain | Registrar | Account owner | Transmitted |
|---|---|---|---|
| _(e.g. example.com)_ | _(e.g. OVH)_ | — | ☐ |

---

## 6. Communication & Collaboration

| Service | Purpose | Account owner | Transmitted |
|---|---|---|---|
| _(e.g. Google Workspace)_ | _(email + docs)_ | — | ☐ |
| _(e.g. Slack / Notion)_ | _(team)_ | — | ☐ |

---

## 7. Other Accounts

| Service | Purpose | Notes | Transmitted |
|---|---|---|---|
| — | — | — | ☐ |

---

## Transmission Protocol

All credential values are transmitted at the closing date via:
- [ ] Shared password manager (1Password, Bitwarden) — temporary shared vault
- [ ] Encrypted file transfer (GPG or equivalent)
- [ ] Other: _(specify)_

Transmission confirmed by both parties in `HANDOVER.md`.
