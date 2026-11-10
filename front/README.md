# 300c.dub front

Public showroom and owner backoffice for the 300c.dub car page, in one Vue 3 single page app.

## Stack

- Vue 3, Vite, TypeScript (strict)
- Vue Router with lazy routes and an auth guard for `/admin`
- Pinia, one store per feature
- vue-i18n with Brazilian Portuguese (default) and English
- Tailwind CSS v4, Poppins (self hosted through Fontsource)
- Vitest and Vue Test Utils

## Routes

| Route | Purpose |
| --- | --- |
| `/` | Home with hero, categories and featured products |
| `/catalogo` | Catalog with category, search, sort and pagination (state lives in the query string) |
| `/produto/:slug` | Product page: gallery, size picker, stock badge, "I want this" |
| `/produto/:slug/contato` | Editable prefilled message, WhatsApp and Instagram buttons |
| `/admin/login` | Owner login |
| `/admin/produtos`, `/admin/produtos/novo`, `/admin/produtos/:id` | Products list (drag to reorder), form, image manager |
| `/admin/categorias` | Categories CRUD with drag to reorder |
| `/admin/configuracoes` | Instagram handle, WhatsApp number, default message |

There is no cart, checkout or payment. The visitor chooses a size, opens the contact page and sends the message through WhatsApp or Instagram. Instagram cannot prefill a direct message, so the message is copied to the clipboard and the visitor is told to paste it.

Share links use the API origin (`VITE_API_PUBLIC_ORIGIN/p/:slug`), which serves the Open Graph tags for crawlers and redirects people to `/produto/:slug`. The SPA only sets the document title and description client side.

## Structure

```
src/
  api/            typed API client, one module per resource (no fetch outside this folder)
  components/     shared ui (Base*, toasts, confirm dialog) and layouts
  composables/    useHead, useToast, useConfirm, useSortable, useApiError, ...
  config/         environment values
  features/       auth, catalog, product, site, admin/{products,categories,settings}
  i18n/           vue-i18n setup and messages/pt.json, messages/en.json
  router/         routes, constants and the auth guard
  types/          shared domain types
  utils/          pure helpers (price, buy links, clipboard, reorder)
```

Props and types live in `*.types.ts`, constants in `*.constants.ts`.

## Environment

Copy `.env.example` to `.env`.

| Variable | Default | Meaning |
| --- | --- | --- |
| `VITE_API_URL` | `http://localhost:3000/api` | API base URL (cookie session, requests use `credentials: include`) |
| `VITE_API_PUBLIC_ORIGIN` | `http://localhost:3000` | Public API origin used for share links |

The API must allow the front origin through CORS with credentials.

## Scripts

```
npm install
npm run dev        # Vite on http://localhost:5173
npm run build      # type check and production build into dist/
npm run preview    # serve the build on port 5173
npm run typecheck
npm run lint
npm test           # Vitest (unit, component, i18n parity, hardcoded text scan)
```

## Docker

```
docker build -t 300cdub-front --build-arg VITE_API_URL=https://api.example.com/api --build-arg VITE_API_PUBLIC_ORIGIN=https://api.example.com .
docker run -p 8080:80 300cdub-front
```

Multi stage build: Node builds `dist/`, nginx serves it with a fallback to `index.html` for client side routes. The API URLs are baked in at build time.

## Translations

Every visible string comes from `src/i18n/messages/pt.json` and `en.json`. `src/i18n/i18n-parity.test.ts` fails when the key sets differ, a value is empty, placeholders differ, a message does not compile, a key used by `t()` is missing, or an em dash appears. `src/i18n/no-hardcoded-text.test.ts` fails when a template contains literal text or a literal `placeholder`, `title`, `aria-label`, `alt` or `label`.
