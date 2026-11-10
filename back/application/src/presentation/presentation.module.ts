import { Module } from '@nestjs/common';
import { ApplicationModule } from '@application/application.module';
import { AdminCategoriesController } from '@presentation/controllers/admin-categories.controller';
import { AdminProductsController } from '@presentation/controllers/admin-products.controller';
import { AdminSettingsController } from '@presentation/controllers/admin-settings.controller';
import { AuthController } from '@presentation/controllers/auth.controller';
import { HealthController } from '@presentation/controllers/health.controller';
import { PublicController } from '@presentation/controllers/public.controller';
import { ShareController } from '@presentation/controllers/share.controller';

@Module({
  imports: [ApplicationModule],
  controllers: [AuthController, AdminProductsController, AdminCategoriesController, AdminSettingsController, PublicController, ShareController, HealthController],
})
export class PresentationModule {}
