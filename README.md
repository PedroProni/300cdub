# 300c.dub

Showroom for the 300c.dub car page: a mobile-first public catalog of t-shirts and collectibles, plus a simple backoffice so the owners can manage products, categories, images, order and contact details. Sales are closed over Instagram DM or WhatsApp; there is no cart, checkout or payment.

| Part | Folder | Stack |
| --- | --- | --- |
| API | [`back`](back/README.md) | NestJS 11, MongoDB, S3-compatible storage (MinIO by default, R2 optional), sharp |
| Web (showroom and `/admin`) | [`front`](front/README.md) | Vue 3, Vite, TypeScript, Pinia, vue-i18n (PT-BR and EN), Tailwind |

## Run everything locally

```bash
docker compose up --build
```

| Service | URL |
| --- | --- |
| Web | http://localhost:8080 |
| Backoffice | http://localhost:8080/admin |
| API and Swagger | http://localhost:3000/api, http://localhost:3000/docs |
| MinIO console | http://localhost:9001 |

Default local admin: `admin@300cdub.local` / `ChangeMe-12345` (override with `ADMIN_EMAIL` and `ADMIN_PASSWORD` before the first start, then change it in the backoffice). Ports can be changed with `API_PORT`, `WEB_PORT`, `MONGO_PORT`, `MINIO_PORT` and `MINIO_CONSOLE_PORT`.

## How a sale works

1. A visitor opens a product, picks a size and taps "I want this".
2. The contact page shows the product summary and an editable message naming the product, size and link.
3. WhatsApp opens `wa.me` with the message, or the message is copied and Instagram DM opens. The numbers come from the backoffice settings.

Product links shared as `<api>/p/<slug>` show title, price and cover in WhatsApp and Instagram previews and send people to the web app.

## Languages

The UI strings are translated into Brazilian Portuguese (default) and English. Category names and product descriptions are owner data: they are shown as entered, in both languages, because there are no English fields.

## Standards

No comments in code, one context per file, imports on one line, no hardcoded UI text (PT-BR and EN files with a parity test), no em dash anywhere.

## CI/CD

Pull requests to `main` run `ci.yml`: `back` (unit tests, build), `front` (lint, typecheck, tests, build) and `e2e` (the API end-to-end suite against MongoDB and MinIO containers). The `ci` job is the required status check of `main`: a pull request cannot be merged until it passes.

Every push to `main` that touches `back/**` runs `sync-demo-host.yml`: it applies that exact commit's change to the vendored copy in the private `PedroProni/orbit-demo-host` repository (`cdub/api`) and opens a `sync/300cdub-<sha>` pull request there. The demo host runs its own tests and image build, merges the pull request by itself when they pass, waits for the Render deploy of the commit and then runs a smoke test against production. If the change cannot be applied (for example it conflicts with a demo-only patch) the job opens an issue in this repository. Needs the repository secret `DEMO_HOST_TOKEN` (fine-grained token limited to `orbit-demo-host`).

Every push to `main` that touches `front/**` runs `deploy-pages.yml`: it builds, publishes with `wrangler pages deploy` to the `proni-cdub-demo` Cloudflare Pages project (branch `main`), then fetches the served page until it is byte-identical to the build and checks that the latest Pages deployment carries the pushed commit. Needs the repository secrets `CLOUDFLARE_API_TOKEN` (Pages edit only) and `CLOUDFLARE_ACCOUNT_ID`.
