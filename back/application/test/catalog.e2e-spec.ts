import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { createTestApp, TestApp } from './support/create-test-app';
import { E2E_ADMIN_EMAIL, E2E_ADMIN_PASSWORD, E2E_SITE_URL } from './support/e2e-env.constant';
import { jpegFixture, pngFixture } from './support/image-fixtures';

type Json = Record<string, any>;

describe('catalog and backoffice (e2e)', () => {
  let ctx: TestApp;
  let app: INestApplication;
  let cookie: string;
  let shirtsId: string;
  let shirtId: string;
  let hiddenId: string;

  const api = () => request(app.getHttpServer());
  const admin = (method: 'get' | 'post' | 'put' | 'delete', path: string) => api()[method](path).set('Cookie', cookie);
  const body = (overrides: Json = {}): Json => ({
    name: 'Camiseta 300C',
    description: 'Algodão premium',
    categoryId: shirtsId,
    price: 120,
    promoPrice: null,
    variants: [{ label: 'P', stock: 2 }, { label: 'M', stock: 4 }],
    visible: true,
    featured: true,
    ...overrides,
  });

  beforeAll(async () => {
    ctx = await createTestApp();
    app = ctx.app;
    const login = await api().post('/api/auth/login').send({ email: E2E_ADMIN_EMAIL, password: E2E_ADMIN_PASSWORD });
    cookie = (login.headers['set-cookie'] as unknown as string[])[0];
  });

  afterAll(async () => {
    await app.close();
  });

  describe('categories', () => {
    it('creates, renames with a new slug, lists in order', async () => {
      const created = await admin('post', '/api/admin/categories').send({ name: 'Camisetas' }).expect(201);
      shirtsId = created.body.id;
      expect(created.body.slug).toBe('camisetas');
      const second = await admin('post', '/api/admin/categories').send({ name: 'Colecionáveis' }).expect(201);
      expect(second.body.slug).toBe('colecionaveis');
      const dup = await admin('post', '/api/admin/categories').send({ name: 'Camisetas' }).expect(201);
      expect(dup.body.slug).toBe('camisetas-2');
      await admin('delete', `/api/admin/categories/${dup.body.id}`).expect(204);
      const renamed = await admin('put', `/api/admin/categories/${shirtsId}`).send({ name: 'Camisetas' }).expect(200);
      expect(renamed.body.slug).toBe('camisetas');
      const list = await admin('get', '/api/admin/categories').expect(200);
      expect(list.body.map((c: Json) => c.name)).toEqual(['Camisetas', 'Colecionáveis']);
    });

    it('reorders and rejects mismatched id sets', async () => {
      const list = (await admin('get', '/api/admin/categories')).body as Json[];
      const reversed = list.map((c) => c.id).reverse();
      await admin('put', '/api/admin/categories/reorder').send({ ids: reversed }).expect(204);
      expect(((await admin('get', '/api/admin/categories')).body as Json[]).map((c) => c.id)).toEqual(reversed);
      await admin('put', '/api/admin/categories/reorder').send({ ids: [reversed[0]] }).expect(400);
      await admin('put', '/api/admin/categories/reorder').send({ ids: ['507f1f77bcf86cd799439011', reversed[1]] }).expect(400);
      await admin('put', '/api/admin/categories/reorder').send({ ids: ['x', 'y'] }).expect(400);
    });

    it('validates names and ids', async () => {
      await admin('post', '/api/admin/categories').send({ name: '   ' }).expect(400);
      await admin('post', '/api/admin/categories').send({ name: 'x'.repeat(500) }).expect(400);
      await admin('put', '/api/admin/categories/not-an-id').send({ name: 'x' }).expect(400);
      await admin('put', '/api/admin/categories/507f1f77bcf86cd799439011').send({ name: 'x' }).expect(404);
    });
  });

  describe('products', () => {
    it('creates with slug, variants and derived stock', async () => {
      const res = await admin('post', '/api/admin/products').send(body()).expect(201);
      shirtId = res.body.id;
      expect(res.body.slug).toBe('camiseta-300c');
      expect(res.body.totalStock).toBe(6);
      expect(res.body.stockStatus).toBe('in_stock');
      expect(res.body.category.slug).toBe('camisetas');
      expect(res.body.images).toEqual([]);
    });

    it('gives colliding names distinct slugs', async () => {
      const res = await admin('post', '/api/admin/products').send(body({ name: 'Camiseta 300C', visible: false, featured: false })).expect(201);
      hiddenId = res.body.id;
      expect(res.body.slug).toBe('camiseta-300c-2');
    });

    it.each([
      ['unknown field', { admin: true }],
      ['negative price', { price: -1 }],
      ['zero price', { price: 0 }],
      ['absurd price', { price: 1e12 }],
      ['promo not lower than price', { promoPrice: 120 }],
      ['negative stock', { variants: [{ label: 'P', stock: -1 }] }],
      ['fractional stock', { variants: [{ label: 'P', stock: 1.5 }] }],
      ['duplicate variant labels', { variants: [{ label: 'P', stock: 1 }, { label: 'p', stock: 1 }] }],
      ['too many variants', { variants: Array.from({ length: 31 }, (_, i) => ({ label: `V${i}`, stock: 1 })) }],
      ['empty name', { name: '  ' }],
      ['non string name', { name: { $ne: null } }],
      ['bad category id', { categoryId: 'zzz' }],
      ['unknown category', { categoryId: '507f1f77bcf86cd799439011' }],
      ['non boolean visible', { visible: 'yes' }],
    ])('rejects %s', async (_label, overrides) => {
      await admin('post', '/api/admin/products').send(body(overrides)).expect(400);
    });

    it('updates fields, keeps the slug when the name is unchanged and regenerates it when renamed', async () => {
      const same = await admin('put', `/api/admin/products/${shirtId}`).send(body({ price: 130, promoPrice: 99.9 })).expect(200);
      expect(same.body.slug).toBe('camiseta-300c');
      expect(same.body.promoPrice).toBe(99.9);
      const renamed = await admin('put', `/api/admin/products/${shirtId}`).send(body({ name: 'Camiseta Chrome', price: 130, promoPrice: 99.9 })).expect(200);
      expect(renamed.body.slug).toBe('camiseta-chrome');
    });

    it('derives last units and sold out', async () => {
      const last = await admin('put', `/api/admin/products/${shirtId}`).send(body({ name: 'Camiseta Chrome', variants: [{ label: 'P', stock: 1 }, { label: 'M', stock: 2 }] })).expect(200);
      expect(last.body.stockStatus).toBe('last_units');
      const out = await admin('put', `/api/admin/products/${shirtId}`).send(body({ name: 'Camiseta Chrome', variants: [{ label: 'P', stock: 0 }] })).expect(200);
      expect(out.body.stockStatus).toBe('sold_out');
      await admin('put', `/api/admin/products/${shirtId}`).send(body({ name: 'Camiseta Chrome', variants: [{ label: 'P', stock: 2 }, { label: 'M', stock: 4 }] })).expect(200);
    });

    it('404 for unknown ids and 400 for malformed ids', async () => {
      await admin('get', '/api/admin/products/507f1f77bcf86cd799439011').expect(404);
      await admin('get', '/api/admin/products/%7B%24ne%7D').expect(400);
      await admin('delete', '/api/admin/products/507f1f77bcf86cd799439011').expect(404);
    });

    it('admin list shows hidden products; reorder persists and rejects mismatches', async () => {
      const list = (await admin('get', '/api/admin/products').expect(200)).body as Json[];
      expect(list.map((p) => p.id)).toEqual([shirtId, hiddenId]);
      await admin('put', '/api/admin/products/reorder').send({ ids: [hiddenId, shirtId] }).expect(204);
      expect(((await admin('get', '/api/admin/products')).body as Json[]).map((p) => p.id)).toEqual([hiddenId, shirtId]);
      await admin('put', '/api/admin/products/reorder').send({ ids: [shirtId] }).expect(400);
      await admin('put', '/api/admin/products/reorder').send({ ids: [shirtId, shirtId] }).expect(400);
    });
  });

  describe('images', () => {
    let first: string;
    let second: string;

    it('uploads, resizes and serves the variants from storage', async () => {
      const res = await admin('post', `/api/admin/products/${shirtId}/images`).attach('file', await jpegFixture(), { filename: 'a.jpg', contentType: 'image/jpeg' }).expect(201);
      first = res.body.images[0].id;
      expect(res.body.images[0].isCover).toBe(true);
      expect(res.body.images[0].urls.large.startsWith(ctx.publicBase)).toBe(true);
      for (const variant of ['thumb', 'medium', 'large']) {
        const file = await fetch(res.body.images[0].urls[variant]);
        expect(file.status).toBe(200);
        expect(file.headers.get('content-type')).toBe('image/webp');
      }
    });

    it('rejects non images, spoofed content types, svg and corrupt files', async () => {
      const post = () => admin('post', `/api/admin/products/${shirtId}/images`);
      await post().attach('file', Buffer.from('hello'), { filename: 'a.png', contentType: 'image/png' }).expect(415);
      await post().attach('file', Buffer.from('<svg xmlns="http://www.w3.org/2000/svg"/>'), { filename: 'a.svg', contentType: 'image/svg+xml' }).expect(415);
      await post().attach('file', Buffer.from('<?php system($_GET[1]);'), { filename: 'a.jpg', contentType: 'image/jpeg' }).expect(415);
      await post().attach('file', Buffer.concat([Buffer.from([0xff, 0xd8, 0xff, 0xe0]), Buffer.from('junk')]), { filename: 'a.jpg', contentType: 'image/jpeg' }).expect(422);
      await post().expect(400);
    });

    it('rejects files over 5 MB', async () => {
      const res = await admin('post', `/api/admin/products/${shirtId}/images`).attach('file', Buffer.alloc(5 * 1024 * 1024 + 10, 1), { filename: 'big.jpg', contentType: 'image/jpeg' });
      expect(res.status).toBe(413);
      expect(res.body.code).toBe('IMAGE_TOO_LARGE');
    });

    it('requires auth and an existing product', async () => {
      await api().post(`/api/admin/products/${shirtId}/images`).attach('file', await jpegFixture(), 'a.jpg').expect(401);
      await admin('post', '/api/admin/products/507f1f77bcf86cd799439011/images').attach('file', await jpegFixture(), 'a.jpg').expect(404);
    });

    it('reorders, changes the cover, and rejects foreign ids', async () => {
      const added = await admin('post', `/api/admin/products/${shirtId}/images`).attach('file', await pngFixture(), { filename: 'b.png', contentType: 'image/png' }).expect(201);
      second = added.body.images[1].id;
      const reordered = await admin('put', `/api/admin/products/${shirtId}/images/order`).send({ ids: [second, first] }).expect(200);
      expect(reordered.body.images.map((i: Json) => i.id)).toEqual([second, first]);
      const cover = await admin('put', `/api/admin/products/${shirtId}/images/${first}/cover`).expect(200);
      expect(cover.body.images.map((i: Json) => [i.id, i.isCover])).toEqual([[first, true], [second, false]]);
      await admin('put', `/api/admin/products/${shirtId}/images/order`).send({ ids: [first] }).expect(400);
      await admin('put', `/api/admin/products/${shirtId}/images/order`).send({ ids: [first, 'not-a-uuid'] }).expect(400);
      await admin('put', `/api/admin/products/${shirtId}/images/00000000-0000-4000-8000-000000000000/cover`).expect(404);
    });

    it('enforces the per product image limit', async () => {
      const statuses: number[] = [];
      for (let i = 0; i < 9; i += 1) {
        const res = await admin('post', `/api/admin/products/${shirtId}/images`).attach('file', await pngFixture(), { filename: 'c.png', contentType: 'image/png' });
        statuses.push(res.status);
      }
      expect(statuses.slice(0, 8)).toEqual(Array(8).fill(201));
      expect(statuses[8]).toBe(409);
    });

    it('deletes an image and its stored files', async () => {
      const before = (await admin('get', `/api/admin/products/${shirtId}`)).body as Json;
      const target = before.images[1];
      const res = await admin('delete', `/api/admin/products/${shirtId}/images/${target.id}`).expect(200);
      expect(res.body.images.length).toBe(before.images.length - 1);
      expect((await fetch(target.urls.thumb)).status).not.toBe(200);
      await admin('delete', `/api/admin/products/${shirtId}/images/${target.id}`).expect(404);
    });
  });

  describe('public catalog', () => {
    it('lists only visible products and never leaks the hidden one', async () => {
      const list = await api().get('/api/public/products').expect(200);
      expect(list.body.items.map((p: Json) => p.id)).toEqual([shirtId]);
      expect(list.body.total).toBe(1);
      await api().get('/api/public/products/camiseta-300c-2').expect(404);
      const visible = await api().get('/api/public/products/camiseta-chrome').expect(200);
      expect(visible.body.images.length).toBeGreaterThan(0);
    });

    it('a product turned hidden disappears and a hidden one turned visible appears', async () => {
      await admin('put', `/api/admin/products/${shirtId}`).send(body({ name: 'Camiseta Chrome', visible: false })).expect(200);
      await api().get('/api/public/products/camiseta-chrome').expect(404);
      expect((await api().get('/api/public/products')).body.total).toBe(0);
      await admin('put', `/api/admin/products/${hiddenId}`).send(body({ name: 'Camiseta 300C', visible: true, featured: false })).expect(200);
      expect((await api().get('/api/public/products')).body.items.map((p: Json) => p.id)).toEqual([hiddenId]);
      await admin('put', `/api/admin/products/${shirtId}`).send(body({ name: 'Camiseta Chrome', visible: true })).expect(200);
      await admin('put', `/api/admin/products/${hiddenId}`).send(body({ name: 'Camiseta 300C', visible: false, featured: false })).expect(200);
    });

    it('filters by category, featured and search, sorts and paginates', async () => {
      const extra = await admin('post', '/api/admin/products').send(body({ name: 'Miniatura (Chrysler) [1:18]', categoryId: null, price: 300, featured: false, variants: [{ label: 'Único', stock: 1 }] })).expect(201);
      expect((await api().get('/api/public/products?category=camisetas')).body.items.map((p: Json) => p.id)).toEqual([shirtId]);
      expect((await api().get('/api/public/products?category=does-not-exist')).body.total).toBe(0);
      expect((await api().get('/api/public/products?featured=true')).body.items.map((p: Json) => p.id)).toEqual([shirtId]);
      expect((await api().get('/api/public/products?search=chrome')).body.total).toBe(1);
      expect((await api().get('/api/public/products?search=' + encodeURIComponent('(chrysler) [1:18]'))).body.items[0].id).toBe(extra.body.id);
      expect((await api().get('/api/public/products?search=.*')).body.total).toBe(0);
      expect((await api().get('/api/public/products?sort=price_desc')).body.items[0].id).toBe(extra.body.id);
      expect((await api().get('/api/public/products?sort=price_asc')).body.items[0].id).toBe(shirtId);
      const page = await api().get('/api/public/products?limit=1&page=2').expect(200);
      expect(page.body.items.length).toBe(1);
      expect(page.body.total).toBe(2);
      expect(page.body.page).toBe(2);
    });

    it('rejects abusive query parameters', async () => {
      await api().get('/api/public/products?limit=100000').expect(400);
      await api().get('/api/public/products?page=0').expect(400);
      await api().get('/api/public/products?sort=drop').expect(400);
      await api().get('/api/public/products?category[$ne]=x').expect(400);
      await api().get('/api/public/products?search[$regex]=.*').expect(400);
      await api().get('/api/public/products?unknown=1').expect(400);
    });

    it('public category list exposes no admin fields beyond the view', async () => {
      const res = await api().get('/api/public/categories').expect(200);
      expect(Object.keys(res.body[0]).sort()).toEqual(['id', 'name', 'slug', 'sortOrder']);
    });
  });

  describe('settings', () => {
    it('returns defaults, saves normalized values and serves them publicly', async () => {
      expect((await api().get('/api/public/settings').expect(200)).body.instagramHandle).toBe('300c.dub');
      const saved = await admin('put', '/api/admin/settings').send({ instagramHandle: '@300c.dub', whatsappNumber: '+55 (11) 91234-5678', messageTemplate: 'Oi {product} {size}' }).expect(200);
      expect(saved.body).toEqual({ instagramHandle: '300c.dub', whatsappNumber: '5511912345678', messageTemplate: 'Oi {product} {size}' });
      expect((await api().get('/api/public/settings')).body.whatsappNumber).toBe('5511912345678');
    });

    it('rejects invalid handle and number', async () => {
      await admin('put', '/api/admin/settings').send({ instagramHandle: 'bad handle!', whatsappNumber: '5511912345678', messageTemplate: 'x' }).expect(400);
      await admin('put', '/api/admin/settings').send({ instagramHandle: 'ok', whatsappNumber: 'abc', messageTemplate: 'x' }).expect(400);
      await admin('put', '/api/admin/settings').send({ instagramHandle: 'ok', whatsappNumber: '123', messageTemplate: 'x' }).expect(400);
    });
  });

  describe('share page for link previews', () => {
    it('serves OG tags with title, price and cover to crawlers and a redirect for humans', async () => {
      const res = await api().get('/p/camiseta-chrome').set('User-Agent', 'WhatsApp/2.23 A').expect(200);
      expect(res.headers['content-type']).toMatch(/text\/html/);
      expect(res.text).toMatch(/og:title" content="Camiseta Chrome \| R\$/);
      expect(res.text).toContain('product:price:amount" content="120.00"');
      expect(res.text).toMatch(/og:image" content="http:\/\/localhost:57003\/cdub-e2e-[a-f0-9]+\/products\/[a-f\d]+\/[a-f\d-]+\/large\.webp"/);
      expect(res.text).toContain(`url=${E2E_SITE_URL}/produto/camiseta-chrome`);
    });

    it('redirects hidden or unknown slugs to the site without leaking data', async () => {
      const hidden = await api().get('/p/camiseta-300c-2').expect(302);
      expect(hidden.headers.location).toBe(E2E_SITE_URL);
      await api().get('/p/nope').expect(302);
    });
  });

  describe('delete', () => {
    it('deletes the product and its stored images', async () => {
      const product = (await admin('get', `/api/admin/products/${shirtId}`)).body as Json;
      const url = product.images[0].urls.thumb as string;
      expect((await fetch(url)).status).toBe(200);
      await admin('delete', `/api/admin/products/${shirtId}`).expect(204);
      await api().get('/api/public/products/camiseta-chrome').expect(404);
      expect((await fetch(url)).status).not.toBe(200);
    });

    it('deleting a category leaves its products uncategorised', async () => {
      const prod = await admin('post', '/api/admin/products').send(body({ name: 'Boné' })).expect(201);
      await admin('delete', `/api/admin/categories/${shirtsId}`).expect(204);
      expect(((await admin('get', `/api/admin/products/${prod.body.id}`)).body as Json).category).toBeNull();
      await admin('delete', `/api/admin/categories/${shirtsId}`).expect(404);
    });
  });
});
