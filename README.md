# ⚡ CRIS-CV ⚡

Welcome to the _behind-the-scenes_ of my personal portfolio website, live at [d3d3gndxeqngdb.cloudfront.net](https://d3d3gndxeqngdb.cloudfront.net/)!

> I've proudly opened up the source code, CI/CD, and infrastructure as code of this project. Why? Because as a DevOps and Infrastructure Engineer, this portfolio isn't just a CV — it's a working demonstration of how I build and operate cloud infrastructure.

## 🚀 Project Overview

This is a production-ready personal portfolio site showcasing my experience, professional interests, certifications, and projects. Built with security, observability and cost-awareness in mind, it demonstrates real AWS infrastructure practices rather than a static-site-hosting shortcut.

### ✨ Key Features

- **Static & Fast**: Next.js static export served entirely from the edge via CloudFront — no servers to manage
- **Dynamic Detail Pages**: Experience and Projects are data-driven and each renders its own statically-generated detail page
- **Security First**: Private S3 origin (Origin Access Control only), HTTPS-only, and a full security response headers policy (CSP, HSTS, X-Frame-Options, Referrer-Policy, Permissions-Policy)
- **Monitoring & Observability**: CloudWatch dashboard + alarms and AWS Budgets, both wired to a single SNS topic that emails me directly
- **Zero Long-Lived Credentials**: CI/CD authenticates into AWS via GitHub's OIDC provider — no AWS access keys stored anywhere
- **Cost-Conscious by Design**: Every infrastructure decision documents its cost trade-off (see [Known Trade-offs](#known-trade-offs))
- **Tested End to End**: Component tests, e2e + accessibility tests, and infrastructure security tests (`cdk-nag`) all run in CI before every deploy

## 🏗️ Architecture & Technology Stack

<img src="assets/architecture.png" width=90%> <br>

### Frontend Stack

- **[Next.js 15](https://nextjs.org)** (App Router): static export (`output: "export"`), dynamic routes pre-rendered via `generateStaticParams`
- **[Tailwind CSS](https://tailwindcss.com)**: utility-first styling
- **[lucide-react](https://lucide.dev)**: icon set
- **TypeScript**: strict mode across the entire codebase

### AWS Cloud Infrastructure

- **Amazon S3**: two private buckets — one for the static site, one for access logs — both fully blocked from public access
- **CloudFront**: global CDN, Origin Access Control to the private S3 bucket, TLS 1.2+, HTTP/2+3
- **CloudFront Functions**: viewer-request URL rewriting for Next.js static export compatibility
- **CloudFront Response Headers Policy**: CSP, HSTS, X-Frame-Options, Referrer-Policy and Permissions-Policy attached at the edge
- **CloudWatch**: dashboard (requests, 4xx/5xx error rate, bytes downloaded) + alarms on elevated error rates
- **SNS**: single alerts topic, emailed directly, fed by both CloudWatch alarms and AWS Budgets
- **AWS Budgets**: monthly cost budget with 80%-actual and 100%-forecasted email alerts
- **IAM (OIDC Federation)**: GitHub Actions assumes a scoped deploy role via `sts:AssumeRoleWithWebIdentity` — no stored AWS credentials
- No WAF and no custom domain yet — both are deliberate cost trade-offs, documented below, not oversights

### Infrastructure as Code

- **[AWS CDK v2](https://aws.amazon.com/cdk/)** (TypeScript): a single stack (`PortfolioStack`) in `us-east-1`
- **CloudFormation**: underlying resource provisioning, deployed via `cdk deploy`
- **[cdk-nag](https://github.com/cdklabs/cdk-nag)**: `AwsSolutionsChecks` run on every synth, with every suppression documented inline with its reasoning

### DevOps & CI/CD

- **[GitHub Actions](https://docs.github.com/en/actions)**: `ci.yml` on every PR, `deploy.yml` on every push to `main`
- **OIDC-based deploys**: no long-lived AWS access keys stored in GitHub secrets
- **Single-environment strategy**: one AWS account, one stack — no dev/prod split (see [Branch Strategy](#branch-strategy))

### Testing & Quality Assurance

- **[Vitest](https://vitest.dev)** + **React Testing Library**: component tests for the frontend, assertion tests for the CDK stack
- **[Playwright](https://playwright.dev)** + **[@axe-core/playwright](https://github.com/dequelabs/axe-core-npm)**: end-to-end and accessibility tests against the real static build
- **cdk-nag**: automated AWS security best-practice checks on every infrastructure change
- **ESLint** + **TypeScript strict**: linting and type safety, gating CI

## 📁 Project Structure

```
Portafolio/
├── 📂 .github/workflows/     # CI/CD pipeline definitions
│   ├── ci.yml                # Lint, typecheck, unit + e2e tests, cdk synth
│   └── deploy.yml            # Build, cdk deploy, S3 sync, CloudFront invalidation
├── 📂 apps/web/               # Next.js application (static export)
│   ├── src/app/               # Pages and dynamic routes (App Router)
│   │   ├── experience/[slug]/ # Experience detail pages
│   │   └── projects/[slug]/   # Project detail pages
│   ├── src/components/        # React components (Header, cards, lists, ...)
│   ├── src/data/               # Real content: profile, experience, projects, certifications
│   ├── src/lib/                # Types and utilities
│   ├── src/test/               # Vitest component tests
│   └── e2e/                    # Playwright e2e + accessibility tests
├── 📂 infra/                   # AWS CDK infrastructure (TypeScript)
│   ├── bin/infra.ts             # CDK app entry point
│   ├── lib/portfolio-stack.ts   # Main stack, composes every construct below
│   ├── lib/constructs/          # site-buckets, cdn, monitoring, budget, deploy-role
│   ├── lib/nag-suppressions.ts  # Documented cdk-nag suppressions
│   └── test/                    # aws-cdk-lib/assertions + cdk-nag tests
├── package.json                # npm workspaces root
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- **Node.js 20+**: for Next.js and CDK
- **AWS CLI**: configured with credentials (only needed for infrastructure work)
- **AWS CDK**: installed via `npx` — no global install required

### Local Development

1. **Clone the repository**

   ```bash
   git clone https://github.com/Csc34/Cris-CV.git
   cd Cris-CV
   ```

2. **Install dependencies** (npm workspaces — installs both `apps/web` and `infra`)

   ```bash
   npm install
   ```

3. **Run the development server**

   ```bash
   npm run dev --workspace apps/web
   ```

   Visit `http://localhost:3000` to see the site.

Real content (name, bio, experience, professional interests, certifications, contact links) lives in
`apps/web/src/data/*.ts`. Achievements/tech stack for each experience entry and the two project
write-ups are still placeholders pending more detail.

### Build and Export

```bash
npm run build --workspace apps/web
```

Generates the static export in `apps/web/out/`.

## 🔧 Development Workflow

### Code Quality Standards

- **ESLint** (`eslint-config-next`): JavaScript/TypeScript linting
- **TypeScript strict mode**: enabled in both `apps/web` and `infra`
- **Prettier**: available for formatting (not yet wired to an npm script)

### Available Scripts

**Frontend (`apps/web/`):**

```bash
npm run dev          # Start development server
npm run build        # Build the static export
npm run lint         # Run ESLint
npm run typecheck    # tsc --noEmit
npm run test         # Vitest component tests
npm run test:e2e     # Playwright e2e + accessibility tests
```

**Infrastructure (`infra/`):**

```bash
npm run build        # Compile TypeScript
npm run typecheck    # tsc --noEmit
npm run test         # aws-cdk-lib/assertions + cdk-nag tests
npm run synth        # cdk synth (no AWS credentials required)
npm run diff         # cdk diff against the deployed stack
npm run deploy       # cdk deploy
```

## 🚀 Deployment & CI/CD

### Branch Strategy

- **`main`**: the only branch — every push deploys straight to the single production stack
- **Feature branches**: no automatic deployment; `ci.yml` still runs on the pull request

Unlike a multi-account dev/prod setup, this project intentionally runs a single AWS account and a
single CloudFront distribution — the right trade-off for a low-traffic personal portfolio, not a
missing feature.

### Pipeline Stages

**`ci.yml`** (every pull request and push to `main`):

1. Install dependencies
2. Lint + typecheck (`apps/web`)
3. Unit/component tests (Vitest)
4. Build the static export
5. Playwright e2e + accessibility tests against the real build
6. Infra typecheck, `aws-cdk-lib/assertions` + `cdk-nag` tests, `cdk synth` (no AWS credentials needed)

**`deploy.yml`** (push to `main` only):

1. Build the static export
2. Assume the AWS deploy role via GitHub OIDC (`aws-actions/configure-aws-credentials`)
3. `cdk deploy`
4. `aws s3 sync` the build to the site bucket
5. `aws cloudfront create-invalidation`
6. Smoke test: HTTP GET the CloudFront domain, fail the job if it isn't a 200

### Deployment Scripts

| Script | Purpose | Usage |
| --- | --- | --- |
| [`.github/workflows/ci.yml`](.github/workflows/ci.yml) | Lint, test, build, `cdk synth` on every PR | Triggered by `pull_request` / `push` |
| [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) | Deploy infra + publish the site | Triggered by push to `main` |
| `npm run deploy --workspace infra` | Manual `cdk deploy` | Run locally with AWS credentials configured |

## 🧪 Testing Strategy

### Component Tests

Vitest + React Testing Library — each component renders correctly from its real data file (correct
`/experience/<slug>/` and `/projects/<slug>/` links, correct counts, correct copy).

### End-to-End & Accessibility Tests

Playwright, run against the actual static export (served via `serve`, not a dev server):

- Home page renders all 6 sections
- Clicking an experience row / project card navigates to the correct detail page
- An unknown slug renders the real `404.html` with an HTTP 404 status
- `@axe-core/playwright` scans the home page and both detail-page templates for accessibility violations

### Infrastructure Tests

- **`aws-cdk-lib/assertions`**: asserts the S3 buckets are fully private and encrypted, CloudFront
  redirects to HTTPS, the response headers policy is attached, the GitHub OIDC trust condition is
  scoped to this exact repo and branch
- **`cdk-nag`**: `AwsSolutionsChecks` must report zero unsuppressed findings on every synth; every
  suppression in `infra/lib/nag-suppressions.ts` documents *why* it's safe to ignore

## 🔒 Security & Best Practices

### Security Implementation

- **HTTPS Enforcement**: all viewer traffic redirected to HTTPS
- **Security Headers**: CSP, HSTS (preload, 1 year), X-Content-Type-Options, X-Frame-Options (`DENY`),
  Referrer-Policy, and a locked-down Permissions-Policy — all attached via a CloudFront Response
  Headers Policy
- **Private S3 Origin**: both buckets fully block public access; CloudFront reaches the site bucket
  only through Origin Access Control
- **No Long-Lived AWS Credentials**: GitHub Actions authenticates via OIDC (`sts:AssumeRoleWithWebIdentity`),
  trust-scoped to `repo:Csc34/Cris-CV:ref:refs/heads/main`
- **Least-Privilege IAM**: the deploy role can only touch this site's bucket, this distribution's
  invalidations, and this account's CDK bootstrap roles

### Performance Optimizations

- **Static Site Generation**: every route, including dynamic experience/project pages, is pre-rendered at build time
- **Global CDN**: CloudFront edge caching (`CACHING_OPTIMIZED` policy), HTTP/2 and HTTP/3
- **Edge URL Rewriting**: a CloudFront Function maps clean URLs to their `index.html` at the edge, no origin round-trip

### Monitoring & Observability

- **CloudWatch Dashboard**: requests, 4xx/5xx error rate, bytes downloaded
- **CloudWatch Alarms**: elevated 5xx (>5%) and 4xx (>10%) error rates, both notify SNS
- **AWS Budgets**: monthly cost budget, alerts at 80% actual and 100% forecasted spend
- **Single SNS Topic**: every alert (errors or cost) lands in one inbox, `enforceSSL: true`

## 🛠️ Infrastructure Details

### AWS CDK Stack Components

The infrastructure is defined as a single CDK stack (`infra/lib/portfolio-stack.ts`), composed from
focused constructs:

**Core Resources:**

- `site-buckets.ts` — private S3 site bucket + logs bucket
- `cdn.ts` — CloudFront distribution, CloudFront Function, Response Headers Policy
- `monitoring.ts` — CloudWatch dashboard, alarms, SNS topic
- `budget.ts` — AWS Budgets monthly cost alert
- `deploy-role.ts` — GitHub OIDC provider + scoped deploy role

**Security Features:**

- Origin Access Control (not the legacy OAI) for CloudFront → S3
- Response Headers Policy enforcing CSP/HSTS/etc. at the edge
- `BlockPublicAccess.BLOCK_ALL` on both S3 buckets
- Access logging: S3 server access logs + CloudFront access logs, both delivered to the private logs bucket

### CloudFront Functions

`infra/lib/functions/url-rewrite.js` runs on every viewer request: it appends `index.html` to
directory-style paths, since a private S3 origin behind Origin Access Control (unlike an S3
website-hosting endpoint) does not do this automatically.

## 💰 Cost

- **~$0-1/mo** at current traffic — S3, CloudFront and IAM fall within the AWS free tier; SNS email and
  the first 2 AWS Budgets are free
- A **$15/mo budget alarm** emails on 80% actual / 100% forecasted spend, so any surprise gets caught early
- WAFv2 was removed specifically to avoid its flat ~$8/mo fee (see [Known Trade-offs](#known-trade-offs))

## 🚨 Important Operational Notes

### Infrastructure Destruction

**⚠️ Caution: destruction is manual-only, on purpose.**

```bash
cd infra
npx cdk destroy
```

Destruction is intentionally excluded from CI/CD to prevent an accidental outage from a bad push.

### Cost Optimization Decisions

- **No WAF**: removed after launch to cut its flat per-ACL + per-rule fee (~$8/mo) — see trade-offs below
- **`PriceClass_100`**: CloudFront serves from North America/Europe edge locations only
- **S3 Lifecycle Rules**: log objects expire after 90 days; noncurrent site object versions expire after 30 days
- **No custom domain yet**: avoids a Route 53 hosted zone charge until it's worth owning a domain

## 📖 Known Trade-offs

- **No WAF.** Removed to cut recurring cost — a flat ~$8/mo fee (per-WebACL + per-rule) regardless of
  traffic, which didn't pay for itself on a low-traffic personal portfolio. CloudFront (DDoS-resistant
  by design), the private S3 origin, HTTPS, and security headers remain unchanged. `cdk-nag`'s
  `AwsSolutions-CFR2` is suppressed with this reasoning; re-adding a WebACL is a small, isolated change
  if traffic or risk grows.
- **No custom domain in v1.** The site is served on CloudFront's default `*.cloudfront.net` domain —
  costs nothing extra and does not reduce security. Adding a real domain later only needs a Route 53
  hosted zone + ACM certificate + `domainNames`/`certificate` on the `Distribution`. `cdk-nag`'s
  `AwsSolutions-CFR4` is suppressed for the same reason and will resolve itself once a domain is added.
- **CSP allows `'unsafe-inline'` for scripts.** Next.js's App Router injects an inline script even in
  static export builds, so a strict `script-src 'self'` would break hydration. Tightening this further
  (build-time CSP hashes) is a possible future improvement, intentionally not built now.
- **A moderate `postcss` advisory ships transitively via Next.js's own build pipeline** (even on the
  latest release). It's a build-time-only XSS advisory requiring untrusted CSS input, which this
  project never processes — accepted as a known, low-risk transitive issue rather than pinned/patched.

## 📈 Future Enhancements

- **Custom domain**: Route 53 + ACM once it's worth owning one
- **Fill in real content**: achievements/tech stack per experience entry, full write-ups for both projects
- **Re-add WAF**: if traffic or abuse risk grows enough to justify the cost
- **Stricter CSP**: build-time hash extraction instead of `'unsafe-inline'`

## 🤝 Contributing

This is a personal portfolio, so it isn't looking for feature contributions — but if you spot a bug,
a security issue, or something genuinely broken, feel free to open an issue.

## 📚 Learning Resources

This project is a reference for:

- **Static Site Generation**: Next.js App Router export
- **Infrastructure as Code**: AWS CDK v2 in TypeScript
- **CI/CD**: GitHub Actions with OIDC (no long-lived cloud credentials)
- **AWS security posture**: `cdk-nag` + documented, reasoned suppressions
- **Cost-aware architecture**: every infra decision ties back to an actual dollar figure

## 👨‍💻 Author

### Cristofher Suarez

<table border="1">
    <tr>
        <td>
            <p align="center">Infrastructure &amp; DevOps Engineer with 5 years of experience designing, automating, and operating mission-critical enterprise platforms across on-premise and AWS cloud environments.</p>
            <br>
            <p align="center">
                <strong>DevOps | Infrastructure &amp; Cloud Engineer</strong><br>
                <strong>Middleware &amp; Cloud Specialist</strong>
            </p>
        </td>
        <td>
            <p align="center"><img src="assets/cristofher-suarez.png" width=80%></p>
        </td>
    </tr>
</table>

### Connect with Cristofher

- 🌐 **Website**: [d3d3gndxeqngdb.cloudfront.net](https://d3d3gndxeqngdb.cloudfront.net/)
- 💼 **LinkedIn**: [cristofher-suarez](https://www.linkedin.com/in/cristofher-suarez-4028a2277/)
- 🐙 **GitHub**: [Csc34](https://github.com/Csc34)
- 📧 **Email**: cristofhers21@gmail.com

## 📄 License

Copyright 2026 Cristofher Suarez — all rights reserved. No open-source license has been chosen yet;
this repo is public for transparency, not for reuse. (Swap this section for a real license, e.g. MIT
or Apache 2.0, if you'd like others to reuse the code.)

---

<p align="center">
  <strong>⚡ Built with real AWS infrastructure, real trade-offs, and real cost numbers ⚡</strong>
</p>
