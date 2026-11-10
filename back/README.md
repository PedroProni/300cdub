# 300c.dub API

NestJS 11 + MongoDB API for the 300c.dub showroom: public read-only catalog, a single-admin backoffice API, image upload to S3-compatible storage, and a link-preview page for social sharing.

## Features

- Public catalog: visible products only, categories, filters (category, featured, search, sort), pagination, slugs.
- Backoffice (one admin, httpOnly SameSite=Strict session cookie): products with variants and stock, promotional price, visibility, featured, manual ordering; categories with ordering; contact settings; change password.
- Images: JPEG, PNG or WebP up to 5 MB, magic-byte check, decoded and re-encoded with sharp into thumb, medium and large WebP variants, up to 10 per product, reorder and cover choice.
- Derived stock badge: `sold_out` (0), `last_units` (up to 3), `in_stock`.
- Share page `GET /p/:slug`: Open Graph and Twitter tags (title with price, description, cover) for WhatsApp and Instagram crawlers; browsers are redirected to the web app at `/produto/:slug`.
- Security: default-deny auth guard (`@Public()` opts routes out), Origin check on writes, login limited to 5 attempts per minute per IP, whitelist and forbid-unknown validation, bounded page sizes, helmet, escaped HTML on the share page.

## Layout

```
src/
  domain/          constants, enums and types (one context per file)
  common/          env service, helpers, pipes
  application/     services and mappers
  infrastructure/  database (schemas, repositories), storage (S3, sharp), security
  presentation/    controllers, DTOs, exception filter
test/              e2e suites (real MongoDB and S3-compatible storage)
```

## Run locally

```bash
cp .env.example .env
npm ci
npm run start:dev
```

Swagger is served at `/docs` when `SWAGGER_ENABLED` is not `false`. All JSON routes live under `/api`. The first admin is created from `ADMIN_EMAIL` and `ADMIN_PASSWORD` when no admin exists; later changes to those variables do nothing, use the change password route.

## Object storage (MinIO locally, Cloudflare R2 in production)

The same code runs on both through environment variables only.

| Variable | MinIO (local) | Cloudflare R2 |
| --- | --- | --- |
| `S3_ENDPOINT` | `http://localhost:9000` | `https://<account-id>.r2.cloudflarestorage.com` |
| `S3_REGION` | `auto` | `auto` |
| `S3_FORCE_PATH_STYLE` | `true` | `false` |
| `S3_BUCKET` | `cdub-images` | your bucket |
| `S3_PUBLIC_BASE_URL` | `http://localhost:9000/cdub-images` | the bucket public `r2.dev` URL or a custom domain |

On start the API creates the bucket and a public-read policy when the bucket is missing (works on MinIO). R2 does not accept bucket policies through the S3 API: create the bucket and enable public access (or a custom domain) in the Cloudflare dashboard, then create an R2 API token with object read and write and use its keys as `S3_ACCESS_KEY_ID` and `S3_SECRET_ACCESS_KEY`. Variants are stored as immutable WebP with a one year cache header.

## Tests

```bash
npm test
npm run test:e2e
```

The e2e suites need MongoDB and an S3-compatible server. Defaults are `mongodb://localhost:57001` and `http://localhost:57003` with the keys `cdubminio` / `cdubminio-secret`; override with `E2E_MONGO_URI`, `E2E_S3_ENDPOINT`, `E2E_S3_ACCESS_KEY` and `E2E_S3_SECRET_KEY`. Each run uses its own database and bucket.

## Main routes

| Route | Auth | Purpose |
| --- | --- | --- |
| `GET /api/public/products`, `/api/public/products/:slug`, `/api/public/categories`, `/api/public/settings` | public | showroom data |
| `GET /p/:slug` | public | share page with Open Graph tags |
| `POST /api/auth/login`, `POST /api/auth/logout`, `GET /api/auth/me`, `PUT /api/auth/password` | login public | session |
| `/api/admin/products` (+ `/:id/images`, `/reorder`) | admin | products and images |
| `/api/admin/categories` (+ `/reorder`) | admin | categories |
| `GET`/`PUT /api/admin/settings` | admin | Instagram handle, WhatsApp number, message template |

Errors are `{ statusCode, code, message }` with a stable `code` the front maps to translated text.
