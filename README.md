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

## Standards

No comments in code, one context per file, imports on one line, no hardcoded UI text (PT-BR and EN files with a parity test), no em dash anywhere.
