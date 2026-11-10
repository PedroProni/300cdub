import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { hash } from 'bcryptjs';
import { EnvConfigService } from '@common/env/env-config.service';
import { AdminRepository } from '@infrastructure/database/repositories/admin.repository';
import { BCRYPT_ROUNDS, PASSWORD_MIN_LENGTH } from '@domain/constants/auth.constant';

@Injectable()
export class AdminSeedService implements OnModuleInit {
  private readonly logger = new Logger(AdminSeedService.name);

  constructor(
    private readonly env: EnvConfigService,
    private readonly admins: AdminRepository,
  ) {}

  async onModuleInit(): Promise<void> {
    if ((await this.admins.count()) > 0) return;
    const email = this.env.getAdminEmail();
    const password = this.env.getAdminPassword();
    if (!email || password.length < PASSWORD_MIN_LENGTH) {
      this.logger.warn('No admin exists and ADMIN_EMAIL or ADMIN_PASSWORD is missing or too short');
      return;
    }
    await this.admins.create(email, await hash(password, BCRYPT_ROUNDS));
    this.logger.log('Admin account created from environment');
  }
}
