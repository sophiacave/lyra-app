# Like One — Information Security Policy

**Version:** 1.0
**Effective Date:** March 29, 2026
**Owner:** Sophia Cave, Founder
**Contact:** sophiacave.me@gmail.com
**Domain:** likeone.ai

---

## 1. Purpose

This policy establishes the information security framework for Like One, an online educational technology company. It defines how we protect customer data, financial information, and system credentials across all infrastructure.

## 2. Scope

This policy applies to all systems, data, and services operated by Like One, including:
- Web application (likeone.ai) hosted on Vercel
- Database infrastructure (Supabase with PostgreSQL)
- Payment processing (Stripe)
- Video delivery (Bunny Stream CDN)
- Development machines and cloud compute (GCP)
- All third-party API integrations

## 3. Data Classification

| Classification | Examples | Handling |
|---|---|---|
| Sacred | SSN, banking credentials, service_role keys | AES-256 encrypted at rest, Supabase Vault, never logged |
| Protected | API keys, OAuth tokens, webhook secrets | Encrypted in Supabase Vault, accessed only via RPC |
| Internal | User emails, subscription data, analytics | Row Level Security (RLS) enforced, TLS in transit |
| Public | Course titles, blog posts, marketing content | No restrictions |

## 4. Access Control

- **Authentication:** All database access requires JWT authentication via Supabase Auth.
- **Authorization:** Row Level Security (RLS) is enabled on all sensitive tables. Service-role keys are stored in Supabase Vault, never in source code or environment files on public repositories.
- **API Keys:** All third-party API keys are stored in an encrypted vault (Supabase Vault with `pgsodium` encryption). Keys are accessed via a `get_secret` RPC function that requires authenticated access.
- **SSH Access:** Cloud infrastructure uses SSH key-based authentication only. No password authentication is permitted.
- **Machine Fleet:** All connected devices authenticate to the central brain via unique machine IDs and JWT tokens.

## 5. Encryption

- **In Transit:** All web traffic uses TLS 1.2+ via Vercel's automatic HTTPS. All API calls use HTTPS.
- **At Rest:** Sensitive credentials are encrypted using Supabase Vault (AES-256 via `pgsodium`). Database backups are encrypted by Supabase's managed infrastructure.
- **Sacred Tier:** Identity documents and financial credentials use an additional application-level encryption layer with passphrase protection.

## 6. Infrastructure Security

- **Hosting:** Application hosted on Vercel (SOC 2 Type II compliant). Database on Supabase (SOC 2 Type II compliant).
- **Network:** No direct database access from the public internet. All database connections route through Supabase's connection pooler with SSL required.
- **Monitoring:** Machine heartbeat system monitors all fleet devices every 5 minutes. Credential health table tracks the verification status of all API integrations.
- **Audit Logging:** Vault access is logged in a `vault_audit` table recording every credential access with timestamps.

## 7. Payment Security

- **PCI Compliance:** Like One does not store, process, or transmit credit card numbers. All payment processing is handled by Stripe (PCI DSS Level 1 certified). Customer card data never touches our servers.
- **Webhook Validation:** Stripe webhooks are verified using HMAC signature validation with a stored webhook secret.

## 8. Incident Response

1. **Detection:** Automated monitoring via GCP watchdog cron checks all services every 5 minutes.
2. **Containment:** API keys can be rotated immediately via vault. Compromised credentials are revoked and rotated within 1 hour.
3. **Notification:** Any breach affecting customer data will be reported to affected users within 72 hours per applicable regulations.
4. **Recovery:** All infrastructure can be reproduced from source code (GitHub) and database backups (Supabase daily backups with point-in-time recovery).

## 9. Credential Management

- All credentials are stored in a centralized vault (`brain_vault` table with encrypted storage).
- Credential health is tracked in a `credential_health` table with last-verified timestamps.
- API keys are rotated on a quarterly basis or immediately upon suspected compromise.
- No credentials are committed to source code repositories. The GitHub repository is public; all secrets are stored server-side.

## 10. Employee Security

Like One LLC is a Nevada limited liability company. The founder is the only person with access to production systems. There are no employees or contractors with database access. AI systems (Claude) operate under strict directives with credential access limited to the encrypted vault RPC interface.

## 11. Data Retention

- Customer subscription data: Retained for the duration of the subscription plus 1 year.
- Transaction records: Retained for 7 years for tax compliance.
- Analytics data: Retained for 2 years, then aggregated and anonymized.
- Deleted account data: Purged within 30 days of account deletion request.

## 12. Third-Party Risk

All third-party services are evaluated for:
- SOC 2 compliance (required for data processors)
- Encryption in transit and at rest
- API-based credential management (no dashboard-only services)
- Clear data deletion/export capabilities

Current approved vendors: Vercel, Supabase, Stripe, Bunny Stream, Plaid, Namecheap, HuggingFace.

## 13. Policy Review

This policy is reviewed and updated quarterly, or immediately following any security incident or significant infrastructure change.

---

**Approved by:** Sophia Cave, Founder — Like One
**Date:** March 29, 2026
