# DEPLOYMENT, [Asset Name]

> **Document type:** Asset handover, deployment guide  
> **CIFS dimension:** C (Code, CI/CD, architecture)  
> **Last updated:** _(to be filled)_

---

## 1. Environments

| Environment | URL | Branch | Notes |
|---|---|---|---|
| Production | _(URL)_ | _(e.g. main)_ |, |
| Staging | _(URL)_ | _(e.g. preview)_ |, |
| Local | localhost:_(port)_ |, |, |

---

## 2. Prerequisites

_(List tools and accounts required before deploying.)_

- [ ] _(e.g. Node.js v20+)_
- [ ] _(e.g. Access to hosting provider account)_
- [ ] _(e.g. Supabase project access)_
- [ ] _(e.g. Stripe account)_

---

## 3. Local Setup

```bash
# Clone the repository
git clone <repo-url>

# Install dependencies
_(e.g. npm install)_

# Copy environment variables
cp .env.example .env.local
# Fill in required values, see CREDENTIALS.md inventory

# Start development server
_(e.g. npm run dev)_
```

---

## 4. Required Environment Variables

| Variable | Purpose | Required |
|---|---|---|
| _(e.g. DATABASE_URL)_ | _(database connection)_ | Yes / No |
|, |, |, |

> Values are not stored here. See `CREDENTIALS.md` for the full inventory. Actual values are transmitted securely at closing.

---

## 5. Deployment Process

### Manual deployment
```bash
_(describe manual deployment steps if applicable)_
```

### Automated deployment (CI/CD)
_(Describe the CI/CD pipeline: trigger, steps, environments.)_

---

## 6. Post-Deployment Checks

- [ ] _(e.g. Health check endpoint returns 200)_
- [ ] _(e.g. Stripe webhook registered and active)_
- [ ] _(e.g. Email delivery confirmed)_
- [ ] _(e.g. Database migrations applied)_

---

## 7. Rollback Procedure

_(Describe how to roll back to a previous version in case of a failed deployment.)_
