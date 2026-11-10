import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { StorageConfig } from '@domain/types/storage-config.type';

@Injectable()
export class EnvConfigService {
  constructor(private readonly config: ConfigService) {}

  getPort(): number {
    return Number(this.config.get('PORT') ?? 3000);
  }

  getMongoUri(): string {
    return this.config.getOrThrow<string>('MONGODB_URI');
  }

  getJwtSecret(): string {
    return this.config.getOrThrow<string>('JWT_SECRET');
  }

  getAdminEmail(): string {
    return (this.config.get<string>('ADMIN_EMAIL') ?? '').trim().toLowerCase();
  }

  getAdminPassword(): string {
    return this.config.get<string>('ADMIN_PASSWORD') ?? '';
  }

  getAllowedOrigins(): string[] {
    return (this.config.get<string>('ALLOWED_ORIGINS') ?? '')
      .split(',')
      .map((origin) => origin.trim().replace(/\/$/, ''))
      .filter(Boolean);
  }

  isCookieSecure(): boolean {
    return this.config.get('COOKIE_SECURE') === 'true';
  }

  getTrustProxy(): boolean {
    return this.config.get('TRUST_PROXY') === 'true';
  }

  getSiteUrl(): string {
    return (this.config.get<string>('PUBLIC_SITE_URL') ?? 'http://localhost:57011').replace(/\/$/, '');
  }

  isThrottleDisabled(): boolean {
    return this.config.get('THROTTLE_DISABLED') === 'true';
  }

  isSwaggerEnabled(): boolean {
    return this.config.get('SWAGGER_ENABLED') !== 'false';
  }

  getStorageConfig(): StorageConfig {
    return {
      endpoint: this.config.getOrThrow<string>('S3_ENDPOINT'),
      region: this.config.get<string>('S3_REGION') ?? 'auto',
      bucket: this.config.getOrThrow<string>('S3_BUCKET'),
      accessKeyId: this.config.getOrThrow<string>('S3_ACCESS_KEY_ID'),
      secretAccessKey: this.config.getOrThrow<string>('S3_SECRET_ACCESS_KEY'),
      forcePathStyle: this.config.get('S3_FORCE_PATH_STYLE') === 'true',
      publicBaseUrl: this.config.getOrThrow<string>('S3_PUBLIC_BASE_URL').replace(/\/$/, ''),
    };
  }
}
