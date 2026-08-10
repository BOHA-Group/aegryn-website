# DATABASE — [Asset Name]

> **Document type:** Asset handover — database documentation  
> **CIFS dimension:** C (Code — architecture, documentation)  
> **Last updated:** _(to be filled)_

---

## 1. Database System

| Field | Value |
|---|---|
| Engine | _(e.g. PostgreSQL 15)_ |
| Hosting | _(e.g. Supabase, self-hosted, RDS)_ |
| Connection method | _(e.g. connection string, pooler)_ |
| Backup policy | _(e.g. daily automated, 30-day retention)_ |

---

## 2. Schema Overview

_(Describe the main tables/collections and their purpose. A schema diagram may be attached separately.)_

| Table / Collection | Purpose | Key columns |
|---|---|---|
| _(e.g. users)_ | _(user accounts)_ | _(id, email, created_at)_ |
| — | — | — |

---

## 3. Migrations

_(Describe how migrations are managed and applied.)_

| Tool | _(e.g. Supabase CLI, Flyway, Alembic)_ |
|---|---|
| Migration files location | _(e.g. /supabase/migrations/)_ |
| Naming convention | _(e.g. sequential: 001_, 002_)_ |
| Apply command | _(e.g. supabase db push)_ |

---

## 4. Key Relationships

_(Describe the main foreign key relationships and any cascade rules.)_

---

## 5. Row-Level Security / Access Control

_(Describe any RLS policies, data access rules, or multi-tenant isolation logic.)_

---

## 6. Seed / Reference Data

_(Describe any required seed data or reference tables that must be populated for the application to function.)_

---

## 7. Backup & Restore

```bash
# Backup
_(e.g. pg_dump command or provider CLI)_

# Restore
_(e.g. psql or provider restore procedure)_
```

---

## 8. Known Issues / Constraints

_(List any known database performance issues, missing indexes, or planned schema changes.)_
