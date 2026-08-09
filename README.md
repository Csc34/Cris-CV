# Portfolio

Personal portfolio site (About Me / Experience / Professional Interest / Projects / Certifications /
Contact), built as a fully static Next.js export hosted on AWS behind CloudFront, with the
infrastructure defined as code (CDK) and covered by automated tests end to end.

## Stack

- **Frontend**: Next.js (App Router) + TypeScript + Tailwind CSS, static export (`output: "export"`).
  Experience and Project entries are data-driven (`apps/web/src/data/*.ts`) and each renders its own
  statically-generated detail page (`/experience/[slug]`, `/projects/[slug]`).
- **Hosting**: private S3 bucket + CloudFront (Origin Access Control, no public bucket) + security
  response headers + CloudWatch dashboard/alarms + AWS Budgets, all defined in `infra/` with AWS CDK v2
  (TypeScript). No WAF (see trade-offs below).
- **Testing**: Vitest + React Testing Library (components), Playwright + axe-core (e2e + accessibility),
  `aws-cdk-lib/assertions` + `cdk-nag` (infrastructure correctness and security posture).
- **CI/CD**: GitHub Actions — `ci.yml` runs on every PR (lint, typecheck, unit, e2e, `cdk synth`),
  `deploy.yml` runs on merge to `main` (build, `cdk deploy`, S3 sync, CloudFront invalidation, smoke test).

## Local development

```bash
npm install
npm run dev --workspace apps/web   # http://localhost:3000
```

Real content (name, about, experience, professional interests, certifications, contact links) lives in
`apps/web/src/data/*.ts`. Achievements/tech stack for each experience entry and the two project
write-ups are still placeholders pending more detail.

Run tests:

```bash
npm run test                 # unit tests (web) + infra assertion/cdk-nag tests
npm run test:e2e --workspace apps/web   # Playwright e2e + accessibility, against the real static build
npm run lint --workspace apps/web
npm run typecheck
```

## Deploying to AWS (one-time manual bootstrap)

1. Install the AWS CLI and run `aws configure` (or `aws configure sso`).
2. Verify: `aws sts get-caller-identity` returns the intended account.
3. `cd infra && npx cdk bootstrap aws://<ACCOUNT_ID>/us-east-1` (once per account).
4. Set `githubOrg` / `githubRepo` in `infra/cdk.json` context to your real GitHub repo (used to scope
   the GitHub Actions OIDC trust policy).
5. `npx cdk deploy` — this first run must be done locally, since it also creates the GitHub OIDC
   provider/role that GitHub Actions will assume afterwards. Capture the printed outputs
   (`BucketName`, `DistributionId`, `DistributionDomainName`, `DeployRoleArn`).
6. Confirm the SNS email subscription AWS sends to the alert address.
7. Publish the first build: `npm run build --workspace apps/web && aws s3 sync apps/web/out s3://<BucketName> --delete && aws cloudfront create-invalidation --distribution-id <DistributionId> --paths "/*"`.
8. Open `https://<DistributionDomainName>/` and confirm the home page and both detail-page routes work.
9. In the GitHub repo settings, add a repository variable `AWS_DEPLOY_ROLE_ARN` = the `DeployRoleArn`
   output, so `deploy.yml` can assume it via OIDC on every push to `main`.

## Known trade-offs (documented, not accidental)

- **No WAF.** WAFv2 was removed to cut recurring cost — it has a flat ~$8/mo fee (per-WebACL + per-rule)
  regardless of traffic, which didn't pay for itself on a low-traffic personal portfolio. The site is
  still behind CloudFront (which absorbs volumetric abuse by design), keeps a fully private S3 origin,
  and enforces HTTPS + security response headers. `cdk-nag`'s `AwsSolutions-CFR2` (CloudFront should use
  WAF) is suppressed in `infra/lib/nag-suppressions.ts` with this reasoning. Re-adding a WebACL later
  (`infra/lib/constructs/waf.ts` — see git history) is a small, isolated change if traffic/risk grows.
- **No custom domain in v1.** The site is served on CloudFront's default `*.cloudfront.net` domain.
  This costs nothing extra and does not reduce security (HTTPS, private bucket, security headers all
  still apply). Adding a real domain later only requires a Route 53 hosted zone + ACM certificate
  (issued in `us-east-1`) + `domainNames`/`certificate` on the `Distribution` — no rework needed. Because
  of this, `cdk-nag`'s `AwsSolutions-CFR4` (CloudFront should use a non-default viewer certificate) is
  suppressed in `infra/lib/nag-suppressions.ts` with that reasoning; it will resolve itself once a
  custom domain is added.
- **CSP allows `'unsafe-inline'` for scripts.** Next.js's App Router injects an inline script even in
  static export builds, so a strict `script-src 'self'` would break hydration. Tightening this further
  (per-response CSP hashes generated at build time) is a possible v1.1 improvement, intentionally not
  built now to avoid over-engineering a personal portfolio site.
- **A moderate `postcss` advisory ships transitively via Next.js's own internal build pipeline**
  (even on the latest Next.js release, as of this writing). It's a build-time-only XSS advisory that
  requires parsing untrusted CSS input, which this project never does — accepted as a known, low-risk
  transitive dependency issue rather than pinned/patched.
