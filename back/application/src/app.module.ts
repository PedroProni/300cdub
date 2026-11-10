import { Module } from '@nestjs/common';
import { ThrottlerModule } from '@nestjs/throttler';
import { EnvConfigModule } from '@common/env/env-config.module';
import { EnvConfigService } from '@common/env/env-config.service';
import { DatabaseModule } from '@infrastructure/database/database.module';
import { SecurityModule } from '@infrastructure/security/security.module';
import { ApplicationModule } from '@application/application.module';
import { PresentationModule } from '@presentation/presentation.module';
import { GLOBAL_THROTTLE_LIMIT, GLOBAL_THROTTLE_TTL_MS, THROTTLER_NAME } from '@domain/constants/throttle.constant';

@Module({
  imports: [
    EnvConfigModule,
    ThrottlerModule.forRootAsync({
      inject: [EnvConfigService],
      useFactory: (env: EnvConfigService) => ({
        throttlers: [{ name: THROTTLER_NAME, limit: GLOBAL_THROTTLE_LIMIT, ttl: GLOBAL_THROTTLE_TTL_MS }],
        skipIf: () => env.isThrottleDisabled(),
      }),
    }),
    DatabaseModule,
    SecurityModule,
    ApplicationModule,
    PresentationModule,
  ],
})
export class AppModule {}
