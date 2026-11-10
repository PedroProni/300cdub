import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { createTestApp, TestApp } from './support/create-test-app';
import { E2E_ADMIN_EMAIL, E2E_ADMIN_PASSWORD, E2E_OTHER_ORIGIN, E2E_SITE_URL } from './support/e2e-env.constant';

const productBody = {
  name: 'Camiseta',
  description: 'Algodão',
  categoryId: null,
  price: 100,
  promoPrice: null,
  variants: [{ label: 'M', stock: 5 }],
  visible: true,
  featured: false,
};

describe('auth and security (e2e)', () => {
  let ctx: TestApp;
  let app: INestApplication;
  let cookie: string;

  beforeAll(async () => {
    ctx = await createTestApp();
    app = ctx.app;
    const login = await request(app.getHttpServer()).post('/api/auth/login').send({ email: E2E_ADMIN_EMAIL, password: E2E_ADMIN_PASSWORD });
    cookie = (login.headers['set-cookie'] as unknown as string[])[0];
  });

  afterAll(async () => {
    await app.close();
  });

  it('login sets an httpOnly SameSite=Strict cookie and returns the user', async () => {
    const res = await request(app.getHttpServer()).post('/api/auth/login').send({ email: E2E_ADMIN_EMAIL.toUpperCase(), password: E2E_ADMIN_PASSWORD }).expect(200);
    const header = (res.headers['set-cookie'] as unknown as string[])[0];
    expect(header).toMatch(/cdub_session=/);
    expect(header).toMatch(/HttpOnly/i);
    expect(header).toMatch(/SameSite=Strict/i);
    expect(res.body.user.email).toBe(E2E_ADMIN_EMAIL);
    expect(JSON.stringify(res.body)).not.toMatch(/hash|\$2/);
  });

  it('wrong password and unknown email give the same generic 401', async () => {
    const wrong = await request(app.getHttpServer()).post('/api/auth/login').send({ email: E2E_ADMIN_EMAIL, password: 'nope-nope-nope' }).expect(401);
    const unknown = await request(app.getHttpServer()).post('/api/auth/login').send({ email: 'x@y.test', password: 'nope-nope-nope' }).expect(401);
    expect(wrong.body).toEqual(unknown.body);
    expect(wrong.body.code).toBe('INVALID_CREDENTIALS');
  });

  it('login payload rejects operators and extra fields', async () => {
    await request(app.getHttpServer()).post('/api/auth/login').send({ email: { $gt: '' }, password: { $gt: '' } }).expect(400);
    await request(app.getHttpServer()).post('/api/auth/login').send({ email: E2E_ADMIN_EMAIL, password: E2E_ADMIN_PASSWORD, role: 'root' }).expect(400);
  });

  it.each([
    ['get', '/api/admin/products'],
    ['post', '/api/admin/products'],
    ['put', '/api/admin/products/reorder'],
    ['put', '/api/admin/products/507f1f77bcf86cd799439011'],
    ['delete', '/api/admin/products/507f1f77bcf86cd799439011'],
    ['post', '/api/admin/products/507f1f77bcf86cd799439011/images'],
    ['get', '/api/admin/categories'],
    ['post', '/api/admin/categories'],
    ['get', '/api/admin/settings'],
    ['put', '/api/admin/settings'],
    ['get', '/api/auth/me'],
    ['put', '/api/auth/password'],
  ])('public cannot %s %s', async (method, path) => {
    const res = await (request(app.getHttpServer()) as unknown as Record<string, (p: string) => request.Test>)[method](path).send({});
    expect(res.status).toBe(401);
    expect(res.body.code).toBe('UNAUTHORIZED');
  });

  it('rejects a forged or tampered session cookie', async () => {
    await request(app.getHttpServer()).get('/api/auth/me').set('Cookie', 'cdub_session=abc.def.ghi').expect(401);
    const tampered = cookie.replace(/\.[^.;]+;/, '.AAAA;');
    await request(app.getHttpServer()).get('/api/auth/me').set('Cookie', tampered).expect(401);
  });

  it('authenticated admin reads me', async () => {
    const res = await request(app.getHttpServer()).get('/api/auth/me').set('Cookie', cookie).expect(200);
    expect(res.body.user.email).toBe(E2E_ADMIN_EMAIL);
  });

  it('blocks cookie-authenticated writes from a foreign Origin and allows the site origin', async () => {
    await request(app.getHttpServer()).post('/api/admin/products').set('Cookie', cookie).set('Origin', E2E_OTHER_ORIGIN).send(productBody).expect(403);
    await request(app.getHttpServer()).post('/api/admin/products').set('Cookie', cookie).set('Origin', E2E_SITE_URL).send(productBody).expect(201);
  });

  it('public routes are readable without a session', async () => {
    await request(app.getHttpServer()).get('/api/public/products').expect(200);
    await request(app.getHttpServer()).get('/api/public/categories').expect(200);
    await request(app.getHttpServer()).get('/api/public/settings').expect(200);
    await request(app.getHttpServer()).get('/api/health').expect(200);
  });

  it('change password: wrong current is refused, success invalidates the old session and issues a new one', async () => {
    await request(app.getHttpServer()).put('/api/auth/password').set('Cookie', cookie).send({ currentPassword: 'wrong-wrong', newPassword: 'Another-Pass-2' }).expect(400);
    await request(app.getHttpServer()).put('/api/auth/password').set('Cookie', cookie).send({ currentPassword: E2E_ADMIN_PASSWORD, newPassword: 'short' }).expect(400);
    await request(app.getHttpServer()).put('/api/auth/password').set('Cookie', cookie).send({ currentPassword: E2E_ADMIN_PASSWORD, newPassword: E2E_ADMIN_PASSWORD }).expect(400);
    await new Promise((resolve) => setTimeout(resolve, 1100));
    const changed = await request(app.getHttpServer()).put('/api/auth/password').set('Cookie', cookie).send({ currentPassword: E2E_ADMIN_PASSWORD, newPassword: 'Another-Pass-2' }).expect(204);
    const fresh = (changed.headers['set-cookie'] as unknown as string[])[0];
    await request(app.getHttpServer()).get('/api/auth/me').set('Cookie', cookie).expect(401);
    await request(app.getHttpServer()).get('/api/auth/me').set('Cookie', fresh).expect(200);
    await request(app.getHttpServer()).post('/api/auth/login').send({ email: E2E_ADMIN_EMAIL, password: E2E_ADMIN_PASSWORD }).expect(401);
    await request(app.getHttpServer()).post('/api/auth/login').send({ email: E2E_ADMIN_EMAIL, password: 'Another-Pass-2' }).expect(200);
  });

  it('logout clears the cookie', async () => {
    const res = await request(app.getHttpServer()).post('/api/auth/logout').expect(204);
    expect((res.headers['set-cookie'] as unknown as string[])[0]).toMatch(/cdub_session=;/);
  });
});

describe('login brute force limit (e2e)', () => {
  let ctx: TestApp;

  beforeAll(async () => {
    ctx = await createTestApp({ throttle: true });
  });

  afterAll(async () => {
    await ctx.app.close();
  });

  it('returns 429 after five attempts in the window, even for the right password', async () => {
    const statuses: number[] = [];
    for (let attempt = 0; attempt < 5; attempt += 1) {
      const res = await request(ctx.app.getHttpServer()).post('/api/auth/login').send({ email: E2E_ADMIN_EMAIL, password: 'wrong-wrong-wrong' });
      statuses.push(res.status);
    }
    expect(statuses).toEqual([401, 401, 401, 401, 401]);
    const blocked = await request(ctx.app.getHttpServer()).post('/api/auth/login').send({ email: E2E_ADMIN_EMAIL, password: E2E_ADMIN_PASSWORD });
    expect(blocked.status).toBe(429);
    expect(blocked.body.code).toBe('TOO_MANY_REQUESTS');
  });
});
