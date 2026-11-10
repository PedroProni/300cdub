import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { randomBytes } from 'crypto';
import { E2E_ADMIN_EMAIL, E2E_ADMIN_PASSWORD, E2E_MONGO_URI, E2E_S3_ACCESS_KEY, E2E_S3_ENDPOINT, E2E_S3_SECRET_KEY, E2E_SITE_URL } from './e2e-env.constant';

export type TestApp = { app: INestApplication; suffix: string; bucket: string; publicBase: string };

export async function createTestApp(options: { throttle?: boolean } = {}): Promise<TestApp> {
  const suffix = randomBytes(4).toString('hex');
  const bucket = `cdub-e2e-${suffix}`;
  const publicBase = `${E2E_S3_ENDPOINT}/${bucket}`;
  Object.assign(process.env, {
    MONGODB_URI: `${E2E_MONGO_URI}/cdub_e2e_${suffix}`,
    JWT_SECRET: 'e2e-secret-0123456789abcdef0123456789',
    ADMIN_EMAIL: E2E_ADMIN_EMAIL,
    ADMIN_PASSWORD: E2E_ADMIN_PASSWORD,
    ALLOWED_ORIGINS: E2E_SITE_URL,
    PUBLIC_SITE_URL: E2E_SITE_URL,
    COOKIE_SECURE: 'false',
    S3_ENDPOINT: E2E_S3_ENDPOINT,
    S3_REGION: 'auto',
    S3_BUCKET: bucket,
    S3_ACCESS_KEY_ID: E2E_S3_ACCESS_KEY,
    S3_SECRET_ACCESS_KEY: E2E_S3_SECRET_KEY,
    S3_FORCE_PATH_STYLE: 'true',
    S3_PUBLIC_BASE_URL: publicBase,
    SWAGGER_ENABLED: 'false',
    THROTTLE_DISABLED: options.throttle ? 'false' : 'true',
  });
  const { AppModule } = await import('../../src/app.module');
  const { configureApp } = await import('../../src/app.setup');
  const moduleRef = await Test.createTestingModule({ imports: [AppModule] }).compile();
  const app = moduleRef.createNestApplication();
  configureApp(app);
  await app.init();
  return { app, suffix, bucket, publicBase };
}
