import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';
import { EnvConfigService } from '@common/env/env-config.service';
import { AuthGuard } from '@infrastructure/security/auth.guard';
import { OriginGuard } from '@infrastructure/security/origin.guard';
import { SessionService } from '@infrastructure/security/session.service';

@Global()
@Module({
  imports: [JwtModule.registerAsync({ inject: [EnvConfigService], useFactory: (env: EnvConfigService) => ({ secret: env.getJwtSecret() }) })],
  providers: [SessionService, { provide: APP_GUARD, useClass: OriginGuard }, { provide: APP_GUARD, useClass: AuthGuard }],
  exports: [SessionService],
})
export class SecurityModule {}
