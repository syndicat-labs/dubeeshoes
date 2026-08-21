# dubeeshoes — Deployment Plan

> Operational phasing only. All architectural decisions referenced here are
> recorded authoritatively in **ADR-002** (`ArchitectureDecisionRecord.md`,
> Amendment Log). If this document and the ADR disagree, the ADR wins.

## Architecture summary

```
DEMO:   CF Pages (static) ── /api/* proxy via CF Worker ──> Django container (free container host)
PROD:   CloudFront ──┬── S3 (static frontend, OAC)
                     └── /api/* ──> ALB ──> ECS Fargate (gunicorn/Django) ──> RDS PostgreSQL
        Secrets Manager · CloudWatch · Sentry · GitHub Actions (OIDC, no long-lived keys)
```

## Phase 0 — Pre-deployment blockers (machine-law gates)

| # | Task | Gate |
|---|------|------|
| 0.1 | GitHub Actions CI: lint → typecheck → build → secrets scan (gitleaks) → `deps.sh --check-only` audit gate | Required check on PRs; branch protection on `main` |
| 0.2 | Vitest unit tests — error paths first (`validation.ts`, `errors.ts`, `auth.ts`, `products.ts` storage guards) | Coverage ≥ 80% enforced in CI |
| 0.3 | Replace hardcoded `#f0fdf4` in `auth.ts` with a semantic token; refactor 27 inline `style=""` attributes to token-based classes | Strict CSP without `unsafe-inline` becomes possible |
| 0.4 | Site hygiene: favicon, robots.txt, sitemap.xml, `404.html` | Present in build output |

## Phase 1 — ADR-002 (done at planning time)

Decisions recorded in the ADR Amendment Log. Backend implementation must not
begin before that record exists — it does now.

## Phase 2 — Backend foundation (Django)

- Project scaffold: settings split base/demo/prod; secrets via environment only
- Endpoints: `/api/v1/auth/{register,login,logout,me}`; session auth;
  Argon2 hashing; rate limiting on all auth endpoints
- JSON error envelope mirroring `src/ts/errors.ts` taxonomy with retryable flag
- Structured JSON logging (no PII); `/health` endpoint
- pytest-django suite: error paths first, adversarial cases (XSS payloads,
  user-enumeration timing, weak-password rejection); coverage ≥ 80%
- Migrations: additive-first, rollback plan documented per migration before
  running in any shared environment

## Phase 3 — Frontend integration

- Wire `auth.ts` to real endpoints (`fetch`, `credentials: 'include'`,
  envelope handling through existing taxonomy)
- Delete the fake-success path
- E2E smoke: register → login → logout against demo backend

## Phase 4 — Demo deployment (Cloudflare Pages)

- Pages git integration; PR preview deployments
- Worker `/api/*` reverse proxy → Django container (same-origin cookies)
- Sentry SDK front + back; uptime monitor on `/` and `/catalog.html`
  (alert if down > 5 min)
- Post-deploy smoke: assert HTTP 200 on all five routes + one hashed asset

## Phase 5 — Production AWS (Terraform)

- Modules: network, CDN (CloudFront + S3 OAC + Response Headers Policy),
  compute (ALB + ECS Fargate), data (RDS PostgreSQL), secrets (Secrets Manager)
- Headers via policy: strict CSP, HSTS, `X-Content-Type-Options`,
  `Referrer-Policy`, `frame-ancestors 'none'`, Permissions-Policy
- GH Actions deploy via OIDC; ECR image scanning (trivy)
- CloudWatch alarms: 5xx rate, p95 latency
- Rollback: ECS task-def revision rollback; migration rollback plan documented
  before execution; destructive operations require explicit owner sign-off
- SBOMs (npm + pip) attached to tagged releases

## Scope statement & non-goals

- Wishlist / recently-viewed stay client-side (localStorage) — non-sensitive UI
  state; persistent wishlist is future scope.
- Demo backend availability is best-effort (free tier) — acceptable for demo only.
- No custom domain at launch; DNS-only change later.

## Timeline honesty

Phases 0–4: days-scale. Phase 5: ~1–2 weeks including hardening.
