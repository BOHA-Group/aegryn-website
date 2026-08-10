# RUNBOOK — [Asset Name]

> **Document type:** Asset handover — operational runbook  
> **CIFS dimension:** S (Security — BCP/DRP, incident management)  
> **Last updated:** _(to be filled)_

---

## 1. Routine Operations

| Task | Frequency | How to perform | Notes |
|---|---|---|---|
| _(e.g. Database backup verification)_ | _(weekly)_ | _(procedure)_ | — |
| _(e.g. Dependency updates)_ | _(monthly)_ | — | — |
| _(e.g. SSL certificate renewal)_ | _(annual)_ | — | Auto / Manual |
| — | — | — | — |

---

## 2. Monitoring & Alerts

| What is monitored | Tool | Alert channel | Threshold |
|---|---|---|---|
| _(e.g. Uptime)_ | _(e.g. UptimeRobot)_ | _(e.g. email)_ | _(e.g. < 99.9%)_ |
| _(e.g. Error rate)_ | — | — | — |
| — | — | — | — |

---

## 3. Incident Response

### Severity levels

| Level | Definition | Response time |
|---|---|---|
| P1 — Critical | _(e.g. full outage, data breach)_ | _(immediate)_ |
| P2 — High | _(e.g. feature broken for all users)_ | _(< 4h)_ |
| P3 — Medium | _(e.g. degraded performance)_ | _(< 24h)_ |
| P4 — Low | _(e.g. minor UI issue)_ | _(next sprint)_ |

### Incident procedure

1. _(Detect — describe how incidents are typically detected)_
2. _(Assess severity)_
3. _(Notify — describe who to notify and how)_
4. _(Mitigate — immediate steps to limit impact)_
5. _(Resolve — fix and verify)_
6. _(Post-mortem — document cause and prevention)_

---

## 4. Escalation Contacts

| Role | Responsibility | Contact method |
|---|---|---|
| _(e.g. Lead developer)_ | _(technical issues)_ | _(to be filled at closing)_ |
| _(e.g. DevOps)_ | _(infrastructure)_ | — |
| _(e.g. Legal)_ | _(security incidents, GDPR)_ | — |

> Contact names and details are filled at closing — do not pre-populate.

---

## 5. Disaster Recovery

| Scenario | Recovery procedure | RTO | RPO |
|---|---|---|---|
| _(e.g. Database corruption)_ | _(restore from last backup)_ | _(e.g. 2h)_ | _(e.g. 24h)_ |
| _(e.g. Hosting provider outage)_ | _(failover to secondary)_ | — | — |
| — | — | — | — |

---

## 6. Common Operational Tasks

```bash
# Example — adapt to the actual stack

# Restart application
_(command)_

# Check logs
_(command)_

# Apply database migration
_(command)_

# Clear cache
_(command)_
```

---

## 7. Known Issues & Workarounds

| Issue | Impact | Workaround | Permanent fix ETA |
|---|---|---|---|
| — | — | — | — |
