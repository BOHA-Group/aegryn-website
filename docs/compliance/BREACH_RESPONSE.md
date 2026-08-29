# BREACH RESPONSE, Data Breach Procedure

> **Audience:** Internal, Aegryn / BOHA Group  
> **Legal basis:** GDPR Art. 33 (notification to authority) + Art. 34 (notification to individuals)  
> **Also applies:** nLPD (Swiss), notify FDPIC "as soon as possible"  
> **Last updated:** 2026-08

---

## 1. What Constitutes a Personal Data Breach

A personal data breach is any accidental or unlawful event leading to:
- **Destruction** of personal data
- **Loss** of personal data (e.g. accidental deletion, hardware failure)
- **Alteration** of personal data
- **Unauthorised disclosure** of personal data
- **Unauthorised access** to personal data

Examples relevant to Aegryn:
- Supabase database exposed publicly due to misconfigured RLS
- API endpoint returning user data without authentication
- Admin credentials compromised (phishing, weak password)
- Accidental email sent to wrong recipient containing personal data
- Third-party processor (Stripe, Resend) suffers a breach affecting Aegryn users

---

## 2. Response Timeline

```
T+0, Breach detected or suspected
T+0 to T+4h, Initial assessment and containment
T+4h to T+24h, Severity assessment + internal escalation
T+24h to T+72h, Regulatory notification (if required) ← GDPR hard deadline
T+72h+, Individual notification (if high risk) + remediation
```

---

## 3. Step-by-Step Procedure

### Step 1, Detect & Contain (T+0 to T+4h)

- [ ] Identify the nature and scope of the breach
- [ ] Isolate affected system(s) if possible (disable endpoint, revoke key, restrict access)
- [ ] Preserve evidence, do NOT delete logs
- [ ] Notify internal lead immediately

**First responder:** _(name, to be filled)_  
**Escalation contact:** _(founder / legal, to be filled)_

---

### Step 2, Assess Severity (T+4h to T+24h)

Answer these questions to determine notification obligations:

| Question | Answer |
|---|---|
| What data was affected? | _(categories, see GDPR_REGISTER.md)_ |
| How many individuals affected? | _(estimate)_ |
| Is the data encrypted? | Yes / No |
| Is there a risk to individuals' rights and freedoms? | Yes / No / Unlikely |
| Special categories of data involved? | Yes / No |

**Severity matrix:**

| Risk level | Definition | Action |
|---|---|---|
| **Low** | Data encrypted, no sensitive data, no real-world impact | Document internally, no notification required |
| **Medium** | Unencrypted data, limited scope, low risk | Notify authority (CNIL/FDPIC) within 72h |
| **High** | Sensitive data, large scope, or financial/identity risk | Notify authority + notify affected individuals |

---

### Step 3, Regulatory Notification (T+24h to T+72h, if required)

#### CNIL (France / EU)
- Portal: [notifications.cnil.fr](https://notifications.cnil.fr)
- Required for: any breach with risk to individuals' rights and freedoms

#### FDPIC (Switzerland)
- Contact: [edoeb.admin.ch](https://www.edoeb.admin.ch)
- Required for: breaches likely to result in high risk to data subjects
- Timeline: "as soon as possible" (no strict 72h under nLPD)

**Notification must include:**
- [ ] Nature of the breach
- [ ] Categories and approximate number of individuals affected
- [ ] Categories and approximate number of records affected
- [ ] Contact details of DPO / responsible person
- [ ] Likely consequences of the breach
- [ ] Measures taken or proposed to address the breach

---

### Step 4, Individual Notification (if high risk)

If the breach is likely to result in **high risk to individuals** (identity theft, financial loss, discrimination):

- [ ] Draft notification in clear, plain language
- [ ] Include: what happened, what data, what Aegryn is doing, how to protect yourself
- [ ] Send via email (Resend) within reasonable time after authority notification
- [ ] Do NOT send if it would require disproportionate effort, notify publicly instead

---

### Step 5, Remediation & Post-Mortem

- [ ] Fix the root cause
- [ ] Update affected credentials (see CREDENTIALS.md inventory)
- [ ] Review RLS policies and API security
- [ ] Document the incident: cause, impact, timeline, actions taken
- [ ] Update RUNBOOK.md with new monitoring/prevention steps
- [ ] Notify CIFS-certified assets if their data was affected

---

## 4. Breach Log

| Date | Nature | Systems affected | Individuals affected | Authority notified | Resolved |
|---|---|---|---|---|---|
| _(none to date)_ |, |, |, |, |, |

---

## 5. Key Contacts

| Authority | Country | URL | For |
|---|---|---|---|
| CNIL | France / EU | notifications.cnil.fr | GDPR breach notification |
| FDPIC | Switzerland | edoeb.admin.ch | nLPD breach notification |
| Supabase Support |, | supabase.com/support | If breach via Supabase |
| Stripe Security |, | stripe.com/contact | If breach via Stripe |
