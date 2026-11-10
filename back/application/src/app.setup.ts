import { INestApplication, ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { EnvConfigService } from '@common/env/env-config.service';
import { AllExceptionsFilter } from '@presentation/filters/all-exceptions.filter';
import { SHARE_ROUTE_PREFIX } from '@domain/constants/share.constant';

export function configureApp(app: INestApplication): void {
  const env = app.get(EnvConfigService);
  const express = app as NestExpressApplication;
  if (env.getTrustProxy()) express.set('trust proxy', 1);
  express.disable('x-powered-by');
  app.setGlobalPrefix('api', { exclude: [`${SHARE_ROUTE_PREFIX}/:slug`] });
  app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
  app.use(cookieParser());
  app.enableCors({ origin: env.getAllowedOrigins(), credentials: true, methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'] });
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }));
  app.useGlobalFilters(new AllExceptionsFilter());
}
