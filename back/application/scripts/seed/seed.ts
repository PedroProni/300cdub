import sharp from 'sharp';
import { SEED_API, SEED_CATEGORIES, SEED_EMAIL, SEED_ORIGIN, SEED_PASSWORD, SEED_PRODUCTS, SEED_SETTINGS } from './seed.constants';
import { SeedProduct } from './seed.types';

let cookie = '';

async function call<T>(method: string, path: string, body?: unknown, form?: FormData): Promise<T> {
  const headers: Record<string, string> = { Cookie: cookie };
  if (SEED_ORIGIN) headers.Origin = SEED_ORIGIN;
  if (body) headers['Content-Type'] = 'application/json';
  const res = await fetch(`${SEED_API}${path}`, { method, headers, body: form ?? (body ? JSON.stringify(body) : undefined) });
  if (!res.ok) throw new Error(`${method} ${path} ${res.status} ${await res.text()}`);
  const set = res.headers.get('set-cookie');
  if (set) cookie = set.split(';')[0];
  return res.status === 204 ? (undefined as T) : ((await res.json()) as T);
}

function placeholder(product: SeedProduct): Promise<Buffer> {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="1200"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${product.tint}"/><stop offset="1" stop-color="#000"/></linearGradient></defs><rect width="1200" height="1200" fill="url(#g)"/><text x="600" y="640" font-size="170" font-family="sans-serif" font-weight="700" text-anchor="middle" fill="#d6ff3f" opacity="0.85">${product.caption}</text></svg>`;
  return sharp(Buffer.from(svg)).jpeg({ quality: 82 }).toBuffer();
}

async function main(): Promise<void> {
  if (!SEED_EMAIL || !SEED_PASSWORD) throw new Error('ADMIN_EMAIL and ADMIN_PASSWORD are required');
  await call('POST', '/auth/login', { email: SEED_EMAIL, password: SEED_PASSWORD });
  const categoryIds = new Map<string, string>();
  for (const name of SEED_CATEGORIES) categoryIds.set(name, (await call<{ id: string }>('POST', '/admin/categories', { name })).id);
  await call('PUT', '/admin/settings', SEED_SETTINGS);
  for (const product of SEED_PRODUCTS) {
    const created = await call<{ id: string }>('POST', '/admin/products', {
      name: product.name,
      description: product.description,
      categoryId: categoryIds.get(product.category) ?? null,
      price: product.price,
      promoPrice: product.promoPrice,
      variants: product.variants,
      visible: product.visible,
      featured: product.featured,
    });
    const form = new FormData();
    form.append('file', new Blob([new Uint8Array(await placeholder(product))], { type: 'image/jpeg' }), 'placeholder.jpg');
    await call('POST', `/admin/products/${created.id}/images`, undefined, form);
  }
  process.stdout.write(`Seeded ${SEED_CATEGORIES.length} categories and ${SEED_PRODUCTS.length} products\n`);
}

main().catch((error: Error) => {
  process.stderr.write(`${error.message}\n`);
  process.exit(1);
});
